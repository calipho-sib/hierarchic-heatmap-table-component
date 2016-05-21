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
                    } else {
                        result.circleColorStyle = "black";
                    }

                    accum += block.fn(result);
                }
                return accum;
            });
        },

        initCircleStyle : function() {
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

        showHeatMapSkeleton: function() {
            var template = HBtemplates['templates/heatmap.tmpl'];
            var skeleton = template(this.data);
            $(this.heatmapTable).append(skeleton);
        },

        showRows : function() {
            var rows = HBtemplates['templates/heatmap-tree.tmpl'](this.data);
            $("#heatmap-rows").empty().append(rows);

            this.initCircleStyle();
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
            return found || rowLabel.indexOf(filterString) !== -1
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
            this.originData = {}
            this.originData['children'] = data.data
            this.data = this.originData;
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
                if (data[i].rowLabel.indexOf(filterString) !== -1) {
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
        this.valueToColor = this.getValueToColor(argv.options.valuesColorMapping);
        this.heatmapTable = $("#" + argv.tableID)[0];
        this.header = argv.header;
        this.headerToNum = {};
        this.headerCount = 0;
    }

    HeatMapTable.init.prototype = HeatMapTable.prototype;

    global.HeatMapTable = HeatMapTable;

}(this));;
this["HBtemplates"] = this["HBtemplates"] || {};

this["HBtemplates"]["templates/heatmap-tree.tmpl"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li>\r\n    <div class=\"heatmap-row\">\r\n        <p class=\"heatmap-rowLabel tree-toggler\"><span class=\"glyphicon glyphicon-plus\"></span><span class=\"rowLabel\">"
    + alias4(((helper = (helper = helpers.rowLabel || (depth0 != null ? depth0.rowLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rowLabel","hash":{},"data":data}) : helper)))
    + "</span><span><a href=\""
    + alias4(((helper = (helper = helpers.linkURL || (depth0 != null ? depth0.linkURL : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkURL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.linkLabel || (depth0 != null ? depth0.linkLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkLabel","hash":{},"data":data}) : helper)))
    + "</a></span></p>\r\n        <div class=\"pull-right\">\r\n"
    + ((stack1 = (helpers.forCreateCircle || (depth0 && depth0.forCreateCircle) || alias2).call(alias1,(depth0 != null ? depth0.values : depth0),{"name":"forCreateCircle","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n    <ul class=\"tree heatmap-closed\">\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\r\n</li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <div class=\"heatmap-column "
    + alias4(((helper = (helper = helpers.columnClass || (depth0 != null ? depth0.columnClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"columnClass","hash":{},"data":data}) : helper)))
    + "\", style=\"width:"
    + alias4(((helper = (helper = helpers.columnWidth || (depth0 != null ? depth0.columnWidth : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"columnWidth","hash":{},"data":data}) : helper)))
    + "\">\r\n                    <i class=\"heatmap-circle "
    + alias4(((helper = (helper = helpers.circleColorClass || (depth0 != null ? depth0.circleColorClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"circleColorClass","hash":{},"data":data}) : helper)))
    + "\" style=\"background-color: "
    + alias4(((helper = (helper = helpers.circleColorStyle || (depth0 != null ? depth0.circleColorStyle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"circleColorStyle","hash":{},"data":data}) : helper)))
    + "\"></i>\r\n                </div>\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["create-children"],depth0,{"name":"create-children","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});

this["HBtemplates"]["templates/heatmap.tmpl"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.createHeader || (depth0 && depth0.createHeader) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"createHeader","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <div class=\"heatmap-column "
    + alias4(((helper = (helper = helpers.columnClass || (depth0 != null ? depth0.columnClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"columnClass","hash":{},"data":data}) : helper)))
    + "\">\r\n                        "
    + alias4(((helper = (helper = helpers.columnName || (depth0 != null ? depth0.columnName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"columnName","hash":{},"data":data}) : helper)))
    + "\r\n                    </div>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<!-- <form class=\"form-inline\"> -->\r\n<div class=\"col-md-5\">\r\n    <div class=\"input-group\">\r\n        <input type=\"text\" id=\"heatmap-filterByRowName-input\" class=\"form-control\" placeholder=\"Search for...\">\r\n        <span class=\"input-group-btn\">\r\n            <button class=\"btn btn-default\" id=\"heatmap-filterByRowName-search\" type=\"button\">Search</button>\r\n        </span>\r\n    </div>\r\n</div>\r\n    <button class=\"btn btn-default\" id=\"heatmap-reset-btn\">Reset</button>\r\n    <button class=\"btn btn-default\" id=\"heatmap-collapseAll-btn\">CollapseAll</button>\r\n    <button class=\"btn btn-default\" id=\"heatmap-expandAll-btn\">ExpandAll</button>\r\n<!-- </form> -->\r\n<div id=\"heatmap-body\">\r\n    <div style=\"overflow:hidden\">\r\n        <div style=\"display:inline-block;width:400px\"></div>\r\n        <div class=\"pull-right\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.header : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n    <ul class=\"tree heatmap-ul\" id=\"heatmap-rows\">\r\n    </ul>\r\n</div>";
},"useData":true});