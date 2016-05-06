/*
* @File: generic-protein-expression-view.js
* @Description: Generic protein expression view for Human Body
* @Author: JinJin Lin
* @Email:   jinjin.lin@outlook.com
* @Date:   2016-03-12 15:20:55
* @Last Modified time: 2016-05-06 20:48:50
* All copyright reserved
*/

'use strict';

function HeatMapTable(header) {
    this.valueToColor = {'High': 'redBG', 'Low':'blueBG', 'Moderate':'grayBG', 'Negative': 'greenBG'};
    this.heatmapTable = $("#heatmap-table")[0];
    this.header = header.header;
    this.hasColumnLabel = {};
}

HeatMapTable.prototype.loadData = function(filePath) {
    var that = this;
    $.getJSON(filePath, function(data) {
        that.data = data['data'];
        that.showData();
    });
}

HeatMapTable.prototype.showData = function() {
	this.createColumns();
	this.createRows();
}

HeatMapTable.prototype.createColumns = function() {
	var tableElem = $("<table></table>");
	var tbodyElem = $("<tbody></tboby>")
	var trElem = $("<tr></tr>");
	for (var i in this.header) {
		this.createColumn(this.header[i]).appendTo(trElem);
	}
	trElem.appendTo(tbodyElem);
	tbodyElem.appendTo(tableElem);
	tableElem.appendTo(this.heatmapTable)	
}

HeatMapTable.prototype.createColumn = function(header) {
	if (header === undefined) return $("<td></td>");
	this.hasColumnLabel[header] = true
	var tdElem = $("<td></td>");
	var divElem = $("<div></div>")
	divElem.addClass("verticallegend");
	divElem.text(header);
	divElem.appendTo(tdElem);
	return tdElem;
}

HeatMapTable.prototype.createRows = function() {
	var rowsElem = $("<ul></ul>");
	rowsElem.addClass("nav nav-list");
    for (var i in this.data) {
        this.createRow(this.data[i]).appendTo(rowsElem);
        this.addDivider(rowsElem);
    }
    rowsElem.appendTo(this.heatmapTable);
}

HeatMapTable.prototype.addDivider = function(elem) {
    var divider = $("<li class='divider'></li>");
    divider.appendTo(elem);
}

HeatMapTable.prototype.createRow = function(rowData) {
    var liElem = $("<li></li>");

    var labelElem = this.createLabel(rowData['rowLabel']);
    var circleBarElem = this.createCircleBar(rowData['values']);
    circleBarElem.appendTo(labelElem);
    labelElem.appendTo(liElem);

    if (rowData['children'].length != 0) {
        var ulElem = $("<ul></ul>");
        ulElem.addClass("nav nav-list tree");
        //Recursively generated child rows
        for (var i in rowData['children']) {
            var childRow = this.createRow(rowData['children'][i]);
            childRow.appendTo(ulElem);
        }
        ulElem.hide();
        ulElem.appendTo(liElem);
 	}
    return liElem;
}

HeatMapTable.prototype.createLabel = function(name) {
    var labelElem = $("<label></label>");
    labelElem.addClass("tree-toggler nav-header");
    labelElem.text(name);
    labelElem.click(function () {
        $(this).parent().children('ul.tree').toggle(300);
    });
    return labelElem;
}

HeatMapTable.prototype.createCircleBar = function(values) {
    var circleBarElem = $("<div></div>");
    circleBarElem.addClass("circleBar");
    for (var i in values) {
    	if (this.hasColumnLabel[ values[i]['columnLabel'] ] != true) continue
        var circle = this.createCircle(values[i]['value']);
        circle.appendTo(circleBarElem);
    }
    return circleBarElem;
}

HeatMapTable.prototype.createCircle = function(value) {
    var divElem = $("<div></div>");
    divElem.addClass(this.valueToColor[value]);
    divElem.addClass("circle");
    return divElem;
}


$(function () {
    var heatMapTable = new HeatMapTable({header:['Microarray', 'EST', 'IHC']});
    // var heatMapTable = new HeatMapTable({header:['Microarray', 'EST']});


    //rawgit test
    heatMapTable.loadData("/linjinjin123/Generic-protein-expression-view/master/server/static/data/data.json");
    
    //local test
    // heatMapTable.loadData("/static/data/data.json");
});
