/*
* @File: generic-protein-expression-view.js
* @Description: Generic protein expression view for Human Body
* @Author: JinJin Lin
* @Email:   jinjin.lin@outlook.com
* @Date:   2016-03-12 15:20:55
* @Last Modified time: 2016-05-08 20:44:24
* All copyright reserved
*/

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

            //Create column header
            Handlebars.registerHelper('createHeader', function(columnName, block) {
                //record which header in which column
                self.headerToNum[columnName.toLowerCase()] = self.headerCount;

                //record how many header are there
                self.headerCount += 1;

                var result = {};
                result.columnName = columnName;
                result.columnClass = columnName.toLowerCase() + " " + "header";

                return block.fn(result);
            });

            Handlebars.registerHelper('forCreateCircle', function(values, block) {
                var accum = '';
                //create [headerCount] circle
                for(var i = 0; i < self.header.length; i++) {
                    var result = {};
                    result.columnClass = self.header[i].toLowerCase();

                    if (self.valueToColor[values[i]]) {
                        if (self.valueToColor[values[i]].cssClass) {
                            result.circleColorClass = self.valueToColor[values[i]].cssClass;
                        } else if (self.valueToColor[values[i]].color) {
                            result.circleColorStyle = self.valueToColor[values[i]].color;
                        }
                    }

                    accum += block.fn(result);
                }
                return accum;
            });
        },

        initStyle : function() {
            var self = this;
            //Setting the width of circles according to the width of its header. 
            for (var i = 0; i < self.header.length; i++) {
                //get the header string
                var columnName = self.header[i].toLowerCase();

                //get the width of header
                var width = $("."+columnName + '.header').width();

                //This function will be time consuming...Need to improve performance.
                $("."+columnName).each(function() {
                    this.style.width = width + "px";
                });
            }
        },

        initTemplate : function() {
            var template = HBtemplates['templates/heatmap.tmpl'];
            var result = template(this.data);
            $(this.heatmapTable).append(result);
        },

        initClickEvent : function() {
            //Collapse the table in the begining
            $('.heatmap-rowLabel').parent().parent().children('ul.tree').toggle();

            $('.heatmap-rowLabel').click(function () {
                $(this).find(".glyphicon").toggleClass("glyphicon-plus glyphicon-minus")
                $(this).parent().parent().children('ul.tree').toggleClass("heatmap-closed heatmap-opened").toggle(300);
            });

            //Add the click event of collapseAll button
            $("#heatmap-collapseAll-btn").click(function() {
                $(".heatmap-opened").each(function() {
                    $(this).hide()
                           .toggleClass("heatmap-opened heatmap-closed")
                           .parent().children(".heatmap-row").find(".glyphicon").toggleClass("glyphicon-minus glyphicon-plus");
                });
            });

            // //Add the click event of expandAll button
            $("#heatmap-expandAll-btn").click(function() {
                $(".heatmap-closed").each(function() {
                    $(this).show()
                           .toggleClass("heatmap-closed heatmap-opened")
                           .parent().children(".heatmap-row").find(".glyphicon").toggleClass("glyphicon-plus glyphicon-minus");
                });
            })
        },

        loadJSONData : function(data) {
            this.data = data;
            this.data.header = this.header
        },

        loadJSONDataFromURL : function(filePath) {
            var self = this;
            $.getJSON(filePath, function(data) {
                self.loadJSONData(data);
            });
        },

        show : function() {
            this.initHandlebars();
            this.initTemplate();
            this.initClickEvent();
            this.initStyle();
        },

        getValueToColor: function(valuesColorMapping) {
            var valueToColor = {}
            for (var i = 0; i < valuesColorMapping.length; i++) {
                valueToColor[valuesColorMapping[i].value] = {};
                if (valuesColorMapping[i].color) {
                    valueToColor[valuesColorMapping[i].value].color = valuesColorMapping[i].color;
                } else if (valuesColorMapping[i].cssClass) {
                    valueToColor[valuesColorMapping[i].value].cssClass = valuesColorMapping[i].cssClass;
                } else {
                    throw "The value" + values[j].value + "has no color or cssClass";
                }
            }
            return valueToColor
        }
    }

    HeatMapTable.init = function(argv) {
        this.valueToColor = this.getValueToColor(argv.options.valuesColorMapping);
        this.heatmapTable = $("#" + argv.tableID)[0];
        this.header = argv.header;
        this.headerToNum = {};
        this.headerCount = 0;
    }

    HeatMapTable.init.prototype = HeatMapTable.prototype;

    global.HeatMapTable = HeatMapTable;

}(this));