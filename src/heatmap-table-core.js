;(function(global) {

    'use strict';

    var HeatMapTable = function(argv) { 
        return new HeatMapTable.init(argv);
    }

    HeatMapTable.prototype = {

        initHandlebars : function() {
            var self = this;
            //Share template for recursively generate children
            Handlebars.registerPartial('create-children', HBtemplates['templates/heatmap-tree.tmpl']);

            Handlebars.registerHelper('createRow', function(data) {
                var rowTemplate = HBtemplates['templates/heatmap-row.tmpl']
                
                var iconHtml = null;
                var result = {};
                result.rowLabel = data.rowLabel;
                result.linkURL = data.linkURL;
                result.linkLabel = data.linkLabel;

                if (data.children.length > 0 || (data.detailData && data.detailData.length > 0)) {
                    result.iconHtml = '<span class="glyphicon glyphicon-plus"></span>';
                } else {
                    result.class = "heatmap-no-cursor";
                    result.iconHtml ='<span class="glyphicon glyphicon-record"></span>';
                }
                return new Handlebars.SafeString(rowTemplate(result));
            }); 

            Handlebars.registerHelper('showValue', function(value, block) {
                var accum = '';

                var valueHtml = '<div class="heatmap-column {{columnClass}}", style="width:{{columnWidth}}">{{{valueStyle}}}</div>';
                var circleHtml = '<i class="heatmap-circle {{circleColorClass}}" style="background-color: {{circleColorStyle}}"></i>';
                var valueTemplate = Handlebars.compile(valueHtml);
                var circleTemplate = Handlebars.compile(circleHtml);

                var result = {};
                // result.columnClass = self.header[i].toLowerCase();
                result.columnWidth = self.columnWidth;
                if (self.valueToStyle[value]) {
                    if (self.valueToStyle[value].cssClass) {
                        result.circleColorClass = self.valueToStyle[value].cssClass;
                    } else if (self.valueToStyle[value].color) {
                        result.circleColorStyle = self.valueToStyle[value].color;
                    } else if (self.valueToStyle[value].html) {
                        result.valueStyle = self.valueToStyle[value].html;
                        return new Handlebars.SafeString(valueTemplate(result));
                    } else {
                        result.circleColorStyle = "black";
                        return new Handlebars.SafeString(valueTemplate(result));
                    }
                } else {
                    return new Handlebars.SafeString(valueTemplate(result));
                }

                result.valueStyle = circleTemplate(result);

                return new Handlebars.SafeString(valueTemplate(result));
            });

            Handlebars.registerHelper('addDetail', function(detailData) {
                var source   = $('#'+self.detailTemplate).html();
                var template = Handlebars.compile(source);
                return new Handlebars.SafeString(template(detailData));
            });

           Handlebars.registerHelper('heatmapCreateHeader', function() {
                var source   = $('#'+self.headerTemplate).html();
                var template = Handlebars.compile(source);
                return new Handlebars.SafeString(template(self.headerTemplateData));
            });
        },

        showHeatmapBody: function() {
            $(this.heatmapTable).find(".heatmap-body").remove();

            if (this.heatmapBody) {
                $(this.heatmapTable).append(this.heatmapBody);
            } else {
                var template = HBtemplates['templates/heatmap-body.tmpl'];
                this.heatmapBody = template();
                $(this.heatmapTable).append(this.heatmapBody);
            }
        },

        showHeatmapSkeleton: function() {
            var template = HBtemplates['templates/heatmap-skeleton.tmpl'];
            $(this.heatmapTable).append(template());
        },

        showHeatmapRows : function(isReset) {
            this.showLoadingStatus();

            $(this.heatmapTable).find(".heatmap-rows").empty()
            if (isReset && this.heatmapRowsHTML) {

                $(this.heatmapTable).find(".heatmap-body").append(this.heatmapRowsHTML.clone());

            } else {
           
                var heatmapRowsHTML = $('<ul class="tree heatmap-ul heatmap-rows"></ul>');
                for (var i = 0; i < this.data.length; i++) {
                    var row = this.createRow(this.data[i]);
                    heatmapRowsHTML.append(row);
                }

                $(this.heatmapTable).find(".heatmap-body").append(heatmapRowsHTML.clone());

                if (this.heatmapRowsHTML === null) {
                    this.heatmapRowsHTML = heatmapRowsHTML.clone();
                }
            }

            $(this.heatmapTable).find('.heatmap-rowLabel').parent().parent().children('ul.tree').toggle();


            this.hideLoadingStatus();
        },

        createRow: function(data) {
            data.childrenHTML = [];
            if (data.children && data.children.length > 0) {
                for (var i = 0; i < data.children.length; i++) {
                    var childreRowsHTML = new Handlebars.SafeString(this.createRow(data.children[i]));
                    data.childrenHTML.push(childreRowsHTML);
                }
            }
            var rows = this.heatmapTreeTmpl(data);
            return rows;
        },

        expandByFilterString: function(root, filterString, isRoot) {
            var children = root.children("li");
            var found = false;
            var rowLabel = root.parent().children(".heatmap-row").children(".heatmap-rowLabel").children(".rowLabel").text();
            for (var i = 0; i < children.length; i++) {
                found |= this.expandByFilterString($(children[i]).children(".heatmap-closed"), filterString, false);
            }
            if (found && isRoot === false) {
                root.show()
                   .toggleClass("heatmap-closed heatmap-opened")
                   .parent().children(".heatmap-row").find(".glyphicon").toggleClass("glyphicon-plus glyphicon-minus");
            }
            return found || rowLabel.toLowerCase().indexOf(filterString.toLowerCase()) !== -1
        },

        initClickEvent : function() {
            var self = this;

            $(self.heatmapTable).find('.heatmap-rowLabel').click(function () {
                $(this).find(".glyphicon").toggleClass("glyphicon-plus glyphicon-minus")
                $(this).parent().parent().children('ul.tree').toggleClass("heatmap-closed heatmap-opened").toggle(300);
            });

            //Add the click event of collapseAll button
            $(self.heatmapTable).find(".heatmap-collapseAll-btn").click(function() {
                $(self.heatmapTable).find(".heatmap-opened").each(function() {
                    $(this).hide()
                           .toggleClass("heatmap-opened heatmap-closed")
                           .parent().children(".heatmap-row").find(".glyphicon").toggleClass("glyphicon-minus glyphicon-plus");
                });
            });

            // //Add the click event of expandAll button
            $(self.heatmapTable).find(".heatmap-expandAll-btn").click(function() {
                $(self.heatmapTable).find(".heatmap-closed").each(function() {
                    $(this).show()
                           .toggleClass("heatmap-closed heatmap-opened")
                           .parent().children(".heatmap-row").find(".glyphicon").toggleClass("glyphicon-plus glyphicon-minus");
                });
            })

            $(self.heatmapTable).find(".heatmap-reset-btn").click(function() {
                self.data = self.originData;
                self.resetHeatMap();
            });

            $(self.heatmapTable).find(".heatmap-filterByRowName-search").click(function() {
                
                var filterString = $(self.heatmapTable).find(".heatmap-filterByRowName-input").val();
                if (filterString === "") return ;

                self.showLoadingStatus();
                self.data = self.filterByRowsLabel(self.originData, filterString);
                self.hideLoadingStatus();

                self.show();
                // self.showHeatmapRows();
                self.expandByFilterString($(self.heatmapTable).find(".heatmap-rows"), filterString, true);
                if (self.data.length === 0) {
                    $(self.heatmapTable).find(".heatmap-rows").append("<p>No result be found.</p>");
                }

            });

        },

        loadJSONData : function(data) {
            this.originData = data;
            this.data = this.originData;
        },

        loadJSONDataFromURL : function(filePath) {
            var self = this;
            $.getJSON(filePath, function(data) {
                self.loadJSONData(data);
            });
        },

        initInitialState: function() {
            $(".heatmap-filterByRowName-input").text("");
        },

        clear: function() {
            $(this.heatmapTable).empty();
        },

        resetHeatMap: function() {
            this.clear();
            this.showHeatmapSkeleton();
            this.initInitialState();
            this.show(true);
        },

        show : function(isReset) {
            this.showHeatmapBody();
            this.showHeatmapRows(isReset);
            this.initClickEvent();
            this.initFilter();
        },

        initFilter: function() {
            var self = this;
            for (var value in self.valueTofiltersID) {
                $("#" + self.valueTofiltersID[value]).click((function(value) {
                    return function() {
                            if ($(this).is(':checked')) {
                            self.showLoadingStatus();
                            console.log(value);
                            self.data = self.filterByValue(self.data, value);
                            console.log(self.data);
                            self.hideLoadingStatus();

                            self.show();
                            // self.showHeatmapRows();
                            if (self.data.length === 0) {
                                $(self.heatmapTable).find(".heatmap-rows").append("<p>No result be found.</p>");
                            }
                        } else {
                        }
                    }
                })(value));
            }
        },


        filterByValue: function(data, value) {
            var newData = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].children && data[i].children.length !== 0) {
                    var newChildren = this.filterByValue(data[i].children, value);
                    if (newChildren.length !== 0) {
                        data[i].children = newChildren;
                    } else {
                        data[i].children = [];
                    }
                }
                if (data[i].children && data[i].children.length !== 0) {
                    newData.push(data[i]);
                } else {
                    for (var j = 0; j < data[i].values.length; j++) {
                    // for (var value in this.valueTofiltersID) {
                        if (data[i].values[j].toLowerCase() === value.toLowerCase()) {
                            newData.push(data[i]);
                            break;
                        }
                    // else if (data[i].children && data[i].children.length !== 0) {
            //         //     var newChildren = this.filterByValue(data[i].children, value);
            //         //     if (newChildren.length !== 0) {
            //         //         data[i].children = newChildren;
            //         //         newData.push(data[i]);
            //         //     }
            //         }
                    }
                }
            }
            return newData;
        },

        getValueToStyle: function(valuesSetting) {
            var valueToStyle = {}
            for (var i = 0; i < valuesSetting.length; i++) {
                valueToStyle[valuesSetting[i].value] = {};
                if (valuesSetting[i].color) {
                    valueToStyle[valuesSetting[i].value].color = valuesSetting[i].color;
                } else if (valuesSetting[i].cssClass) {
                    valueToStyle[valuesSetting[i].value].cssClass = valuesSetting[i].cssClass;
                } else if (valuesSetting[i].html) {
                    valueToStyle[valuesSetting[i].value].html = valuesSetting[i].html;
                } else {
                    throw "The value" + values[j].value + "has no color or cssClass";
                }
            }
            return valueToStyle
        },

        getValueTofiltersID: function(valuesSetting) {
            var valueTofiltersID = {}
            for (var i = 0; i < valuesSetting.length; i++) {
                if (valuesSetting[i].filterID) {
                    valueTofiltersID[valuesSetting[i].value] = valuesSetting[i].filterID;
                }
            }
            return valueTofiltersID;
        },

        filterByRowsLabel: function(data, filterString) {
            var newData = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].rowLabel.toLowerCase().indexOf(filterString.toLowerCase()) !== -1) {
                    newData.push(data[i]);
                } else if (data[i].children && data[i].children.length !== 0) {
                    var newChildren = this.filterByRowsLabel(data[i].children, filterString);
                    if (newChildren.length !== 0) {
                        data[i].children = newChildren;
                        newData.push(data[i]);
                    }
                }
            }
            return newData;
        },

        showLoadingStatus: function() {
            $(".heatmap-info").show();
        },

        hideLoadingStatus: function() {
            $(".heatmap-info").hide()
        }
    }

    HeatMapTable.init = function(argv) {
        this.heatmapTreeTmpl = HBtemplates['templates/heatmap-tree.tmpl'];
        this.heatmapRowsHTML = null;
        this.dataIndexToHtml = {};

        this.originData = [];
        this.data = [];
        this.heatmapTable = $("#" + argv.tableID)[0];
        if (argv.options) {
            this.detailTemplate = argv.options.detailTemplate;
            this.headerTemplate = argv.options.headerTemplate;
            this.headerTemplateData = argv.options.headerTemplateData;
            this.columnWidth = argv.options.columnWidth || "70px";
            this.valueToStyle = this.getValueToStyle(argv.options.valuesSetting);
            this.valueTofiltersID = this.getValueTofiltersID(argv.options.valuesSetting);
        }

        this.initHandlebars();
        this.showHeatmapSkeleton();
        this.initInitialState();
    }

    HeatMapTable.init.prototype = HeatMapTable.prototype;

    global.HeatMapTable = HeatMapTable;

}(window));