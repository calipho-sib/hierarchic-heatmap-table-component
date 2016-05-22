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
                var result = {};
                result.columnWidth = self.columnWidth;
                result.columnName = columnName;
                return block.fn(result);
            });

            //Create group header
            Handlebars.registerHelper('createHeaderGroups', function(headerGroups, block) {
                var result = {};
                result.groupWidth = (parseInt(self.columnWidth) * headerGroups.holdColumns) + "px";
                result.groupName = headerGroups.groupName;
                return block.fn(result);
            });

            Handlebars.registerHelper('forCreateCircle', function(values, block) {
                var accum = '';

                for(var i = 0; i < self.header.length; i++) {
                    var result = {};
                    result.columnClass = self.header[i].toLowerCase();
                    result.columnWidth = self.columnWidth;
                    if (self.valueToColor[values[i]]) {
                        if (self.valueToColor[values[i]].cssClass) {
                            result.circleColorClass = self.valueToColor[values[i]].cssClass;
                        } else if (self.valueToColor[values[i]].color) {
                            result.circleColorStyle = self.valueToColor[values[i]].color;
                        } 
                    } else {
                        result.circleColorStyle = "black";
                    }

                    accum += block.fn(result);
                }
                return accum;
            });
        },

        showHeatMapSkeleton: function() {
            var template = HBtemplates['templates/heatmap.tmpl'];
            var skeleton = template(this.data);
            $(this.heatmapTable).append(skeleton);
        },

        showRows : function() {
            var rows = HBtemplates['templates/heatmap-tree.tmpl'](this.data);
            $("#heatmap-rows").empty().append(rows);

            this.initClickEvent();
        },

        expandByFilterString: function(root, filterString) {
            var children = root.children("li");
            var found = false;
            var rowLabel = root.parent().children(".heatmap-row").children(".heatmap-rowLabel").children(".rowLabel").text();
            for (var i = 0; i < children.length; i++) {
                found |= this.expandByFilterString($(children[i]).children(".heatmap-closed"), filterString);
            }
            if (found) {
                root.show()
                   .toggleClass("heatmap-closed heatmap-opened")
                   .parent().children(".heatmap-row").find(".glyphicon").toggleClass("glyphicon-plus glyphicon-minus");
            }
            return found || rowLabel.toLowerCase().indexOf(filterString.toLowerCase()) !== -1
        },

        initClickEvent : function() {
            var self = this;
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

            $("#heatmap-reset-btn").click(function() {
                self.data = self.originData;
                self.showRows();
            });

            this.enablefilterButton();
        },

        loadJSONData : function(data) {
            this.originData = {};
            this.originData['children'] = data.data;
            this.data = this.originData;
            this.data.header = this.header;
            this.data.headerGroups = this.headerGroups;
        },

        loadJSONDataFromURL : function(filePath) {
            var self = this;
            $.getJSON(filePath, function(data) {
                self.loadJSONData(data);
            });
        },

        show : function() {
            this.initHandlebars();
            this.showHeatMapSkeleton();
            this.showRows();
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
        },

        filterByRowsLabel: function(filterString) {
            var self = this;
            return {"children": this.filter(this.originData.children, filterString)};
        },

        filter: function(data, filterString) {
            var newData = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].rowLabel.toLowerCase().indexOf(filterString.toLowerCase()) !== -1) {
                    newData.push(data[i]);
                } else if (data[i].children.length !== 0) {
                    var newChildren = this.filter(data[i].children, filterString);
                    if (newChildren.length !== 0) {
                        data[i].children = newChildren;
                        newData.push(data[i]);
                    }
                }
            }
            return newData;
        },
        enablefilterButton: function() {
            var self = this;
            $("#heatmap-filterByRowName-search").click(function() {
                var filterString = $("#heatmap-filterByRowName-input").val();
                self.data = self.filterByRowsLabel(filterString);
                self.showRows();
                self.expandByFilterString($("#heatmap-rows"), filterString);
            });
        }
    }

    HeatMapTable.init = function(argv) {
        this.header = argv.header;
        this.headerGroups = argv.options.headerGroups;
        this.columnWidth = argv.columnWidth || "70px";
        this.valueToColor = this.getValueToColor(argv.options.valuesColorMapping);
        this.headerGroups = argv.options.headerGroups;
        this.heatmapTable = $("#" + argv.tableID)[0];
    }

    HeatMapTable.init.prototype = HeatMapTable.prototype;

    global.HeatMapTable = HeatMapTable;

}(this));