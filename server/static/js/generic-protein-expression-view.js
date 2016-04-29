/*
* @File: generic-protein-expression-view.js
* @Description: Generic protein expression view for Human Body
* @Author: JinJin Lin
* @Email:   jinjin.lin@outlook.com
* @Date:   2016-03-12 15:20:55
* @Last Modified time: 2016-04-30 01:02:17
* All copyright reserved
*/

'use strict';

function ProteinExpression() {
    this.data = {};
    this.valueToColor = {'High': 'redBG', 'Low':'blueBG', 'Moderate':'grayBG', 'Negative': 'greenBG'};
}

ProteinExpression.prototype.loadData = function(filePath, callback) {
    var that = this;
    $.getJSON(filePath, function(data) {
        that.data = data['data'];
        // console.log("Load Data success.");
        // console.log(that.data = data['data']);
        callback();
    });
}

ProteinExpression.prototype.showData = function(para_elem) {
    for (var i in this.data) {
        var li_elem = this.createRow(this.data[i]);
        li_elem.appendTo(para_elem);
        this.addDivider(para_elem);
    }
}

ProteinExpression.prototype.addDivider = function(para_elem) {
    var divider = $("<li class='divider'></li>");
    divider.appendTo(para_elem);
}

ProteinExpression.prototype.add_click_event = function(elem) {
    console.log($(elem));
    elem.click(function () {
        $(this).parent().children('ul.tree').toggle(300);
    });
}

ProteinExpression.prototype.createRow = function(data) {
    var li_elem = $("<li></li>");
    var ul_elem = $("<ul></ul>");

    var label_elem = this.createLabel(data['rowLabel']);
    var circleBar_elem = this.createCircleBar(data['values']);
    circleBar_elem.appendTo(label_elem);
    label_elem.appendTo(li_elem);

    ul_elem.addClass("nav nav-list tree");
    //Recursively generated child rows
    for (var i in data['children']) {
        var childRow = this.createRow(data['children'][i]);
        childRow.appendTo(ul_elem);
    }

    ul_elem.appendTo(li_elem);
    return li_elem;
}

ProteinExpression.prototype.createLabel = function(name) {
    var label_elem = $("<label></label>");
    label_elem.addClass("tree-toggler nav-header");
    label_elem.text(name);
    label_elem.click(function () {
        $(this).parent().children('ul.tree').toggle(300);
    });
    return label_elem;
}

ProteinExpression.prototype.createCircleBar = function(values) {
    var circleBar_elem = $("<div></div>");
    circleBar_elem.addClass("circleBar");
    for (var i in values) {
        var circle = this.createCircle(values[i]['value']);
        circle.appendTo(circleBar_elem);
    }
    return circleBar_elem;
}

ProteinExpression.prototype.createCircle = function(value) {
    var div_elem = $("<div></div>");
    div_elem.addClass(this.valueToColor[value]);
    div_elem.addClass("circle");
    return div_elem;
}


$(function () {
    var proteinExpression = new ProteinExpression();
    var pe_table = $("#pe_table")[0];

    proteinExpression.loadData("/linjinjin123/Generic-protein-expression-view/master/server/static/data/data.json", function() {
        proteinExpression.showData(pe_table);
    });
});
