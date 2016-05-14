/*
* @File: generic-protein-expression-view.js
* @Description: Generic protein expression view for Human Body
* @Author: JinJin Lin
* @Email:   jinjin.lin@outlook.com
* @Date:   2016-03-12 15:20:55
* @Last Modified time: 2016-05-08 20:44:24
* All copyright reserved
*/

(function(root) {

    'use strict';

    if (root.HeatMapTable === undefined) {
        root.HeatMapTable = function(argv) {
            this.valueToColor = {'High': 'redBG', 'Low':'blueBG', 'Moderate':'grayBG', 'Negative': 'greenBG'};
            this.heatmapTable = $("#" + argv.tableID)[0];
            this.header = argv.header;
            this.hasColumnLabel = {};
            this.headerToNum = {};
            this.headerCount = 0;

            var self = this;
            Handlebars.registerHelper('createHeader', function(columnName, block) {
                self.headerToNum[columnName.toLowerCase()] = self.headerCount;
                self.headerCount += 1;
                var result = {};
                result.columnName = columnName;
                result.columnClass = columnName.toLowerCase() + " " + "header";
                return block.fn(result);
            });

            Handlebars.registerHelper('forCreateIcons', function(values, block) {
                var accum = '';
                for(var i = 0; i < self.headerCount; i++) {
                    var result = {};
                    result.columnClass = self.header[i].toLowerCase();
                    for (var j = 0; j < values.length; j++) {
                        if (self.headerToNum[values[j].columnLabel.toLowerCase()] == i) {
                            result.circleColor = self.valueToColor[values[j].value];
                            break;
                        }
                    }
                    accum += block.fn(result);
                }
                return accum;
            });

        }
    }

    HeatMapTable.prototype.initStyle = function() {
        for (var i = 0; i < this.header.length; i++) {
            var self = this;
            var columnName = this.header[i].toLowerCase();
            var width = $("."+columnName + '.header').width();
            $("."+columnName).each(function() {
                this.style.width = width + "px";
            });
        }
    }

    HeatMapTable.prototype.loadJSONData = function(data) {
        this.data = data;
        this.data.header = this.header
        this.showData();
        this.addClickEvent();
    }

    HeatMapTable.prototype.addClickEvent = function() {
        $('p.tree-toggler').click(function () {
            $(this).find(".glyphicon").toggleClass("glyphicon-plus glyphicon-minus");
            $(this).parent().parent().children('ul.tree').toggle(300);
        });
        $('p.tree-toggler').parent().parent().children('ul.tree').toggle();
    }

    HeatMapTable.prototype.loadJSONDataFromURL = function(filePath) {
        var self = this;
        $.getJSON(filePath, function(data) {
            self.loadJSONData(data);
        });
    }

    HeatMapTable.prototype.showData = function() {
        var template = HBtemplates['templates/heatmap.tmpl'];
        var result = template(this.data);
        console.log(result);
        $(this.heatmapTable).append(result);
        this.initStyle();
    }

}(this));