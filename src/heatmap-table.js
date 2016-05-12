/*
* @File: generic-protein-expression-view.js
* @Description: Generic protein expression view for Human Body
* @Author: JinJin Lin
* @Email:   jinjin.lin@outlook.com
* @Date:   2016-03-12 15:20:55
* @Last Modified time: 2016-05-08 20:44:24
* All copyright reserved
*/

'use strict';

function HeatMapTable(header, divId) {
    this.valueToColor = {'High': 'redBG', 'Low':'blueBG', 'Moderate':'grayBG', 'Negative': 'greenBG'};
    this.heatmapTable = $("#" + divId)[0];
    this.header = header.header;
    this.hasColumnLabel = {};
}

HeatMapTable.prototype.loadJSONData = function(data) {
    this.data = data['data'];
    this.showData();
}

HeatMapTable.prototype.loadJSONDataFromURL = function(filePath) {
    var self = this;
    $.getJSON(filePath, function(data) {
        self.loadJSONData(data);
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
    tableElem.addClass("heatmap-columns")
	trElem.appendTo(tbodyElem);
	tbodyElem.appendTo(tableElem);
	tableElem.appendTo(this.heatmapTable)	
}

HeatMapTable.prototype.createColumn = function(header) {
	if (header === undefined) return $("<td></td>");
	this.hasColumnLabel[header] = true
	var tdElem = $("<td></td>");
	var divElem = $("<div></div>")
	// divElem.addClass("verticallegend");
	divElem.text(header);
	divElem.appendTo(tdElem);
    tdElem.addClass("heatmap-column");
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

    var rowElem = this.createRowElem(rowData);
    // var circleBarElem = this.createCircleBar(rowData['values']);
    // circleBarElem.appendTo(rowElem);
    rowElem.appendTo(liElem);

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

HeatMapTable.prototype.createRowElem = function(rowData) {
    var tableElem = $("<table></table>"); //TODO there should only one table element
    var tbodyElem = $("<tbody></tbody>");
    var trElem = $("<tr></tr>");
    var tdLabelElem = $("<td></td>");
    var spanElem = $("<span></span>");
    var iconElem = $("<i></i>");
    var tdCircleBarElem = $("<td></td>");

    iconElem.addClass("icon-plus");
    spanElem.text(rowData['rowLabel']);
    spanElem.prepend(iconElem);
    spanElem.appendTo(tdLabelElem);
    tdLabelElem.appendTo(trElem);

    var circleBarElem = this.createCircleBar(rowData['values']);
    circleBarElem.appendTo(tdCircleBarElem);
    tdCircleBarElem.appendTo(trElem);

    trElem.appendTo(tbodyElem);
    tbodyElem.appendTo(tableElem);
    tableElem.addClass("tree-toggler heatmap-row");
    tableElem.click(function () {
        $(this).parent().children('ul.tree').toggle(300);
        if ($(this).find('.icon-plus').length != 0) {
            $(this).find('.icon-plus').removeClass("icon-plus").addClass("icon-minus")
        } else if ($(this).find('.icon-minus')) {
            $(this).find('.icon-minus').removeClass("icon-minus").addClass("icon-plus");
        }
    });
    return tableElem;
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
    var iElem = $("<i></i>");
    divElem.addClass("circleBox");
    iElem.addClass(this.valueToColor[value]);
    iElem.addClass("circle");
    iElem.appendTo(divElem);
    return divElem;
}

