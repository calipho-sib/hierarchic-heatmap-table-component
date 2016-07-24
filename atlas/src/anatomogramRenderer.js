"use strict";

//*------------------------------------------------------------------*

var React = require('react');
var ReactDOM = require('react-dom');

//*------------------------------------------------------------------*

var Anatomogram = require('../src/Anatomogram.jsx');

var EventEmitter = require('events');

//*------------------------------------------------------------------*

module.exports = function(anatomogramData, expressedTissueColor, hoveredTissueColor, profileRows, mountNode) {
    ReactDOM.render(
        React.createElement(Anatomogram, {
            anatomogramData: anatomogramData,
            expressedTissueColor: expressedTissueColor,
            hoveredTissueColor: hoveredTissueColor,
            profileRows: profileRows,
            eventEmitter: new EventEmitter(),
            atlasBaseURL: "https://www.ebi.ac.uk/gxa"
        }), mountNode
    );
};
