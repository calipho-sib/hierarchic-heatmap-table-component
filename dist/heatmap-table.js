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
            // Handlebars.registerHelper('createHeader', function(columnName, block) {
            //     var result = {};
            //     result.columnWidth = self.columnWidth;
            //     result.columnName = columnName;
            //     return block.fn(result);
            // });

            Handlebars.registerHelper('createIcon', function(data) {
                if (data.children.length > 0 || data.detailData.length > 0) {
                    return new Handlebars.SafeString('<span class="glyphicon glyphicon-plus"></span>');
                }
                return new Handlebars.SafeString('<span class="glyphicon glyphicon-record"></span>');
            });

            //Create group header
            // Handlebars.registerHelper('createHeaderGroups', function(headerGroups, block) {
            //     var result = {};
            //     result.groupWidth = (parseInt(self.columnWidth) * headerGroups.holdColumns) + "px";
            //     result.groupName = headerGroups.groupName;
            //     return block.fn(result);
            // });

            Handlebars.registerHelper('forCreateCircle', function(values, block) {
                var accum = '';
                for(var i = 0; i < values.length; i++) {
                    var result = {};
                    // result.columnClass = self.header[i].toLowerCase();
                    result.columnWidth = self.columnWidth;
                    if (values && values[i]) {
                        if (self.valueToColor[values[i]]) {
                            if (self.valueToColor[values[i]].cssClass) {
                                result.circleColorClass = self.valueToColor[values[i]].cssClass;
                            } else if (self.valueToColor[values[i]].color) {
                                result.circleColorStyle = self.valueToColor[values[i]].color;
                            }
                        } else {
                            result.circleColorStyle = "black";
                        }
                    }

                    accum += block.fn(result);
                }
                return accum;
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

        showHeatMapSkeleton: function() {
            var template = HBtemplates['templates/heatmap.tmpl'];
            var skeleton = template(this.data);
            $(this.heatmapTable).append(skeleton);
        },

        showRows : function() {
            var rows = HBtemplates['templates/heatmap-tree.tmpl'](this.data);
            $(this.heatmapTable).find(".heatmap-rows").empty().append(rows);

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
            $(self.heatmapTable).find('.heatmap-rowLabel').parent().parent().children('ul.tree').toggle();

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
                self.showRows();
            });

            $(self.heatmapTable).find(".heatmap-filterByRowName-search").click(function() {
                var filterString = $(self.heatmapTable).find(".heatmap-filterByRowName-input").val();
                if (filterString === "") return ;

                self.data = self.filterByRowsLabel(filterString);
                self.showRows();
                self.expandByFilterString($(self.heatmapTable).find(".heatmap-rows"), filterString);
                if (self.data['children'].length === 0) {
                    $(self.heatmapTable).find(".heatmap-rows").append("<p>No result be found.</p>");
                }
            });

            // $(self.heatmapTable).find(".heatmap-zoom").each(function() {
            //     $(this).click(function() {
            //         $(this).parent().parent().parent().children(".heatmap-detail").toggle();
            //         $(this).toggleClass("glyphicon-zoom-out", "glyphicon-zoom-in");
            //     });
            // });
        },

        loadJSONData : function(data) {
            this.originData = {};
            this.originData['children'] = data.data;
            this.data = this.originData;
            // this.data.header = this.header;
            // this.data.headerGroups = this.headerGroups;
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
            return {"children": this.filter(this.originData.children, filterString)};
        },

        filter: function(data, filterString) {
            var newData = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].rowLabel.toLowerCase().indexOf(filterString.toLowerCase()) !== -1) {
                    newData.push(data[i]);
                } else if (data[i].children && data[i].children.length !== 0) {
                    var newChildren = this.filter(data[i].children, filterString);
                    if (newChildren.length !== 0) {
                        data[i].children = newChildren;
                        newData.push(data[i]);
                    }
                }
            }
            return newData;
        },
    }

    HeatMapTable.init = function(argv) {
        this.originData = {};
        this.data = {};
        this.heatmapTable = $("#" + argv.tableID)[0];
        if (argv.options) {
            this.detailTemplate = argv.options.detailTemplate;
            this.headerTemplate = argv.options.headerTemplate;
            this.headerTemplateData = argv.options.headerTemplateData;
            this.columnWidth = argv.options.columnWidth || "70px";
            this.valueToColor = this.getValueToColor(argv.options.valuesColorMapping);
        }
    }

    HeatMapTable.init.prototype = HeatMapTable.prototype;

    global.HeatMapTable = HeatMapTable;

}(window));;
this["HBtemplates"] = this["HBtemplates"] || {};

this["HBtemplates"]["templates/heatmap-tree.tmpl"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li>\r\n    <div class=\"heatmap-row\">\r\n        <p class=\"heatmap-rowLabel tree-toggler\">\r\n"
    + ((stack1 = (helpers.createIcon || (depth0 && depth0.createIcon) || alias2).call(alias1,depth0,{"name":"createIcon","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <span class=\"rowLabel\">"
    + alias4(((helper = (helper = helpers.rowLabel || (depth0 != null ? depth0.rowLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rowLabel","hash":{},"data":data}) : helper)))
    + "</span>\r\n            <span><a href=\""
    + alias4(((helper = (helper = helpers.linkURL || (depth0 != null ? depth0.linkURL : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkURL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.linkLabel || (depth0 != null ? depth0.linkLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkLabel","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n        </p>\r\n        <div class=\"pull-right\">\r\n"
    + ((stack1 = (helpers.forCreateCircle || (depth0 && depth0.forCreateCircle) || alias2).call(alias1,(depth0 != null ? depth0.values : depth0),{"name":"forCreateCircle","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n    <ul class=\"tree heatmap-closed\">\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.detailData : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\r\n</li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"4":function(container,depth0,helpers,partials,data) {
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
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"heatmap-detail\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.detailData : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\r\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "                    <div>\r\n                    "
    + container.escapeExpression((helpers.addDetail || (depth0 && depth0.addDetail) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"addDetail","hash":{},"data":data}))
    + "\r\n                    </div>\r\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["create-children"],depth0,{"name":"create-children","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});

this["HBtemplates"]["templates/heatmap.tmpl"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"col-md-5\">\r\n    <div class=\"input-group\">\r\n        <input type=\"text\" class=\"heatmap-filterByRowName-input form-control\" placeholder=\"Search for...\">\r\n        <span class=\"input-group-btn\">\r\n            <button class=\"btn btn-default heatmap-filterByRowName-search\" type=\"button\">Search</button>\r\n        </span>\r\n    </div>\r\n</div>\r\n<button class=\"btn btn-default heatmap-reset-btn\">Reset</button>\r\n<button class=\"btn btn-default heatmap-collapseAll-btn\">CollapseAll</button>\r\n<button class=\"btn btn-default heatmap-expandAll-btn\">ExpandAll</button>\r\n<div class=\"heatmap-body\">\r\n    <div style=\"overflow:hidden\">\r\n        <div style=\"overflow:hidden\">\r\n            <div class=\"pull-right\">\r\n                "
    + container.escapeExpression(((helper = (helper = helpers.heatmapCreateHeader || (depth0 != null ? depth0.heatmapCreateHeader : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"heatmapCreateHeader","hash":{},"data":data}) : helper)))
    + "\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <ul class=\"tree heatmap-ul heatmap-rows\">\r\n    </ul>\r\n</div>";
},"useData":true});