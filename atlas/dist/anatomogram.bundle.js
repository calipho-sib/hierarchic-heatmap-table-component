var anatomogram =
webpackJsonp_name_([0,3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	//*------------------------------------------------------------------*

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	//*------------------------------------------------------------------*

	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(159);

	var $ = __webpack_require__(160);
	__webpack_require__(161);
	__webpack_require__(162);

	var Snap = __webpack_require__(163);

	var EventEmitter = __webpack_require__(164);

	//*------------------------------------------------------------------*

	var AnatomogramSelectImageButton = React.createClass({
	    displayName: 'AnatomogramSelectImageButton',

	    propTypes: {
	        anatomogramId: React.PropTypes.string.isRequired,
	        selected: React.PropTypes.bool.isRequired,
	        toggleSrcTemplate: React.PropTypes.string.isRequired,
	        onClick: React.PropTypes.func.isRequired
	    },

	    render: function () {
	        var selectedToggleSrc = this.props.toggleSrcTemplate + "_selected.png",
	            unselectedToggleSrc = this.props.toggleSrcTemplate + "_unselected.png";

	        return React.createElement(
	            'div',
	            null,
	            React.createElement('img', { ref: 'toggleButton', onClick: this._onClick, src: this.props.selected ? selectedToggleSrc : unselectedToggleSrc,
	                style: { width: "20px", height: "20px", padding: "2px" } })
	        );
	    },

	    componentDidMount: function () {
	        $(ReactDOM.findDOMNode(this.refs.toggleButton)).button();
	    },

	    _onClick: function () {
	        this.props.onClick(this.props.anatomogramId);
	    }
	});

	var AnatomogramSelectImageButtons = React.createClass({
	    displayName: 'AnatomogramSelectImageButtons',

	    propTypes: {
	        selectedId: React.PropTypes.string.isRequired,
	        availableAnatomograms: React.PropTypes.array.isRequired,
	        onClick: React.PropTypes.func.isRequired
	    },

	    render: function () {
	        if (this.props.availableAnatomograms.length > 1) {
	            var selectedId = this.props.selectedId,
	                onClick = this.props.onClick;
	            var anatomogramSelectImageButtons = this.props.availableAnatomograms.map(function (availableAnatomogram) {
	                return React.createElement(AnatomogramSelectImageButton, { key: availableAnatomogram.id + "_toggle",
	                    anatomogramId: availableAnatomogram.id, selected: selectedId === availableAnatomogram.id, toggleSrcTemplate: availableAnatomogram.toggleSrcTemplate, onClick: onClick });
	            });

	            return React.createElement(
	                'span',
	                null,
	                anatomogramSelectImageButtons
	            );
	        } else {
	            return null;
	        }
	    }

	});

	var Anatomogram = React.createClass({
	    displayName: 'Anatomogram',


	    propTypes: {
	        anatomogramData: React.PropTypes.object.isRequired,
	        expressedTissueColor: React.PropTypes.string.isRequired,
	        hoveredTissueColor: React.PropTypes.string.isRequired,
	        profileRows: React.PropTypes.arrayOf(React.PropTypes.shape({
	            id: React.PropTypes.string,
	            name: React.PropTypes.string.isRequired,
	            expressions: React.PropTypes.arrayOf(React.PropTypes.shape({
	                factorName: React.PropTypes.string,
	                color: React.PropTypes.string,
	                value: React.PropTypes.number, // missing represents "NA"/"NT"
	                svgPathId: React.PropTypes.string
	            })).isRequired
	        })).isRequired,
	        eventEmitter: React.PropTypes.instanceOf(EventEmitter),
	        atlasBaseURL: React.PropTypes.string.isRequired
	    },

	    getInitialState: function () {

	        var availableAnatomograms = [];
	        if (this.props.anatomogramData.maleAnatomogramFile) {
	            availableAnatomograms.push({ id: "male",
	                anatomogramFile: this.props.atlasBaseURL + "/resources/svg/" + this.props.anatomogramData.maleAnatomogramFile,
	                toggleSrcTemplate: this.props.atlasBaseURL + this.props.anatomogramData.toggleButtonMaleImageTemplate });
	        }
	        if (this.props.anatomogramData.femaleAnatomogramFile) {
	            availableAnatomograms.push({ id: "female",
	                anatomogramFile: this.props.atlasBaseURL + "/resources/svg/" + this.props.anatomogramData.femaleAnatomogramFile,
	                toggleSrcTemplate: this.props.atlasBaseURL + this.props.anatomogramData.toggleButtonFemaleImageTemplate });
	        }

	        var allExpressedFactors = [],
	            expressedFactorsPerRow = {};
	        this.props.profileRows.forEach(function (profileRow) {
	            var expressedFactors = [];
	            profileRow.expressions.forEach(function (expression) {
	                if (!typeof expression.value !== "undefined" && expression.value) {
	                    expressedFactors.push(expression.svgPathId);
	                }
	            });
	            expressedFactorsPerRow[profileRow.name] = expressedFactors;
	            allExpressedFactors = allExpressedFactors.concat(expressedFactors);
	        });

	        function onlyUnique(value, index, self) {
	            return self.indexOf(value) === index;
	        }

	        return {
	            selectedId: availableAnatomograms[0].id,
	            availableAnatomograms: availableAnatomograms,
	            expressedFactors: allExpressedFactors.filter(onlyUnique),
	            expressedFactorsPerRow: expressedFactorsPerRow,
	            hoveredPathId: null,
	            hoveredRowId: null
	        };
	    },

	    render: function () {
	        function containsHuman(str) {
	            return str.indexOf("human") > -1;
	        }

	        var height = containsHuman(this.props.anatomogramData.maleAnatomogramFile) ? "375" : "265";

	        return React.createElement(
	            'div',
	            { className: 'gxaAnatomogram', style: { display: "table", paddingTop: "4px" } },
	            React.createElement(
	                'div',
	                { style: { display: "table-row" } },
	                React.createElement(
	                    'div',
	                    { style: { display: "table-cell", verticalAlign: "top" } },
	                    React.createElement(AnatomogramSelectImageButtons, { selectedId: this.state.selectedId, availableAnatomograms: this.state.availableAnatomograms, onClick: this._handleChange })
	                ),
	                React.createElement('svg', { ref: 'anatomogram', style: { display: "table-cell", width: "230px", height: height + "px" } })
	            )
	        );
	    },

	    componentDidMount: function () {
	        this.props.eventEmitter.addListener("gxaHeatmapColumnHoverChange", this._highlightPath);
	        this.props.eventEmitter.addListener("gxaHeatmapRowHoverChange", this._highlightRow);
	        this._loadAnatomogram(this._getAnatomogramSVGFile(this.state.selectedId));
	    },

	    // Only displays/highlights the relevant tissues to avoid loading the anatomogram every time we hover over a tissue or a factor header
	    componentDidUpdate: function () {
	        var svg = Snap(ReactDOM.findDOMNode(this.refs.anatomogram)).select("g");
	        this._displayAllOrganismParts(svg);
	    },

	    _handleChange: function (newSelectedId) {
	        if (newSelectedId !== this.state.selectedId) {
	            this._loadAnatomogram(this._getAnatomogramSVGFile(newSelectedId));
	            this.setState({ selectedId: newSelectedId });
	        }
	    },

	    // TODO We could manually highlight un-highlight the affected tissues instead of re-displaying all of them, as setState triggers componentDidUpdate
	    _highlightPath: function (svgPathId) {
	        this.setState({ hoveredPathId: svgPathId });
	    },

	    _highlightRow: function (rowId) {
	        this.setState({ hoveredRowId: rowId });
	    },

	    _getAnatomogramSVGFile: function (id) {
	        for (var i = 0; i < this.state.availableAnatomograms.length; i++) {
	            if (id === this.state.availableAnatomograms[i].id) {
	                return this.state.availableAnatomograms[i].anatomogramFile;
	            }
	        }
	    },

	    _loadAnatomogram: function (svgFile) {

	        var svgCanvas = Snap(ReactDOM.findDOMNode(this.refs.anatomogram)),
	            $svgCanvas = $(ReactDOM.findDOMNode(this.refs.anatomogram)),
	            allElements = svgCanvas.selectAll("*");

	        if (allElements) {
	            allElements.remove();
	        }

	        var displayAllOrganismPartsCallback = this._displayAllOrganismParts;
	        var registerHoverEventsCallback = this._registerHoverEvents;
	        Snap.load(svgFile, function (fragment) {
	            var g = fragment.select("g");
	            g.transform("S1.6,0,0"); //放大1.6倍
	            displayAllOrganismPartsCallback(g);
	            registerHoverEventsCallback(g);
	            svgCanvas.append(g);
	        });
	    },

	    _displayAllOrganismParts: function (svg) {
	        if (svg) {
	            // Sometimes svg is null... why?
	            this.props.anatomogramData.allSvgPathIds.forEach(function (svgPathId) {
	                this._displayOrganismPartsWithDefaultProperties(svg, svgPathId);
	            }, this);
	        }
	    },

	    _hoveredRowContainsPathId: function (svgPathId) {
	        if (!this.state.hoveredRowId) {
	            return false;
	        }
	        return this.state.expressedFactorsPerRow.hasOwnProperty(this.state.hoveredRowId) && this.state.expressedFactorsPerRow[this.state.hoveredRowId].indexOf(svgPathId) > -1;
	    },

	    _displayOrganismPartsWithDefaultProperties: function (svg, svgPathId) {

	        var color = this.props.expressedTissueColor;
	        //目前正在高亮的部位是这个svg或者heatmap高亮的地方也是这个svg的话, 颜色就显示为高亮的颜色
	        if (this.state.hoveredPathId === svgPathId || this._hoveredRowContainsPathId(svgPathId)) {
	            color = this.props.hoveredTissueColor;
	        }

	        if (this.state.expressedFactors.indexOf(svgPathId) > -1) {
	            this._highlightOrganismParts(svg, svgPathId, color, 0.7);
	        } else {
	            this._highlightOrganismParts(svg, svgPathId, "gray", 0.5);
	        }
	    },

	    _highlightOrganismParts: function (svg, svgPathId, color, opacity) {
	        Anatomogram._recursivelyChangeProperties(svg.select("#" + svgPathId), color, opacity);
	    },

	    _registerHoverEvents: function (svg) {
	        if (svg) {
	            // Sometimes svg is null... why?

	            var eventEmitter = this.props.eventEmitter,
	                hoverColor = this.props.hoveredTissueColor,
	                highlightOrganismPartsCallback = this._highlightOrganismParts,
	                displayOrganismPartsWithDefaultPropertiesCallback = this._displayOrganismPartsWithDefaultProperties;
	            var mouseoverCallback = function (svgPathId) {
	                highlightOrganismPartsCallback(svg, svgPathId, hoverColor, 0.7);
	                eventEmitter.emit('gxaAnatomogramTissueMouseEnter', svgPathId);
	            };
	            var mouseoutCallback = function (svgPathId) {
	                displayOrganismPartsWithDefaultPropertiesCallback(svg, svgPathId);
	                eventEmitter.emit('gxaAnatomogramTissueMouseLeave', svgPathId);
	            };

	            this.props.anatomogramData.allSvgPathIds.forEach(function (svgPathId) {
	                var svgElement = svg.select("#" + svgPathId);
	                if (svgElement) {
	                    svgElement.mouseover(function () {
	                        mouseoverCallback(svgPathId);
	                    });
	                    svgElement.mouseout(function () {
	                        mouseoutCallback(svgPathId);
	                    });
	                }
	            }, this);
	        }
	    },

	    statics: {
	        _recursivelyChangeProperties: function (svgElement, color, opacity) {

	            if (svgElement) {
	                var innerElements = svgElement.selectAll("*");

	                if (innerElements.length > 0) {
	                    innerElements.forEach(function (innerElement) {
	                        Anatomogram._recursivelyChangeProperties(innerElement);
	                    });
	                }

	                svgElement.attr({ "fill": color, "fill-opacity": opacity });
	            }
	        },

	        _recursivelySelectElements: function (svgElement) {
	            if (!svgElement) {
	                return [];
	            }

	            var innerElements = svgElement.selectAll("*");
	            if (innerElements.length === 0) {
	                return [svgElement];
	            } else {
	                var allElements = [];
	                innerElements.forEach(function (innerElement) {
	                    allElements = allElements.concat(Anatomogram._recursivelySelectElements(innerElement));
	                });
	                return allElements;
	            }
	        }
	    }

	});

	//*------------------------------------------------------------------*

	module.exports = Anatomogram;

/***/ },

/***/ 164:
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ }

});