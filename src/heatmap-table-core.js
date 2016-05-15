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
                for(var i = 0; i < self.headerCount; i++) {
                    var result = {};
                    result.columnClass = self.header[i].toLowerCase();

                    //For an circle, searching if there are a value will be set. 
                    for (var j = 0; j < values.length; j++) {
                        /*
                            Example: 
                                When the values[j].columnLabel.toLowerCase() is est.
                                And we also have a header call est in the second column
                                (headerToNum['est'] == 1, start from 0).
                                Then when create the second circle(i is 1, start from 0),
                                this condition will be true,
                                so the result.circleColor will be set the right value.
                        */
                        if (self.headerToNum[ values[j].columnLabel.toLowerCase() ] == i) {
                            result.circleColor = self.valueToColor[values[j].value];
                            break;
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
        }
    }

    HeatMapTable.init = function(argv) {
        this.valueToColor = {'High': 'redBG', 'Low':'blueBG', 'Moderate':'grayBG', 'Negative': 'greenBG'};
        this.heatmapTable = $("#" + argv.tableID)[0];
        this.header = argv.header;
        this.headerToNum = {};
        this.headerCount = 0;
    }

    HeatMapTable.init.prototype = HeatMapTable.prototype;

    global.HeatMapTable = HeatMapTable;

}(this));