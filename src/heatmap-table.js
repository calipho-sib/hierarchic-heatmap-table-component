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
        $(this.heatmapTable).append(result);
    }

}(this));