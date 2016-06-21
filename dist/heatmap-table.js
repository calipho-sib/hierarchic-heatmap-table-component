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

            Handlebars.registerHelper('createIcon', function(data) {
                if (data.children.length > 0 || (data.detailData && data.detailData.length > 0)) {
                    return new Handlebars.SafeString('<span class="glyphicon glyphicon-plus"></span>');
                }
                return new Handlebars.SafeString('<span class="glyphicon glyphicon-record"></span>');
            });

            Handlebars.registerHelper('showValue', function(value, block) {
                var accum = '';

                var valueHtml = '<div class="heatmap-column {{columnClass}}", style="width:{{columnWidth}}">{{{valueStyle}}}</div>';
                var circleHtml = '<i class="heatmap-circle {{circleColorClass}}" style="background-color: {{circleColorStyle}}"></i>';
                var valueTemplate = Handlebars.compile(valueHtml);
                var circleTemplate = Handlebars.compile(circleHtml);

                var result = {};
                // result.columnClass = self.header[i].toLowerCase();
                result.columnWidth = self.columnWidth;
                if (self.valueToStyle[value]) {
                    if (self.valueToStyle[value].cssClass) {
                        result.circleColorClass = self.valueToStyle[value].cssClass;
                    } else if (self.valueToStyle[value].color) {
                        result.circleColorStyle = self.valueToStyle[value].color;
                    } else if (self.valueToStyle[value].html) {
                        result.valueStyle = self.valueToStyle[value].html;
                        return new Handlebars.SafeString(valueTemplate(result));
                    }
                } else {
                    result.circleColorStyle = "black";
                }
                result.valueStyle = circleTemplate(result);
                return new Handlebars.SafeString(valueTemplate(result));
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

        getValueToStyle: function(valuesColorMapping) {
            var valueToStyle = {}
            for (var i = 0; i < valuesColorMapping.length; i++) {
                valueToStyle[valuesColorMapping[i].value] = {};
                if (valuesColorMapping[i].color) {
                    valueToStyle[valuesColorMapping[i].value].color = valuesColorMapping[i].color;
                } else if (valuesColorMapping[i].cssClass) {
                    valueToStyle[valuesColorMapping[i].value].cssClass = valuesColorMapping[i].cssClass;
                } else if (valuesColorMapping[i].html) {
                    valueToStyle[valuesColorMapping[i].value].html = valuesColorMapping[i].html;
                } else {
                    throw "The value" + values[j].value + "has no color or cssClass";
                }
            }
            return valueToStyle
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
            this.valueToStyle = this.getValueToStyle(argv.options.valuesColorMapping);
        }
    }

    HeatMapTable.init.prototype = HeatMapTable.prototype;

    global.HeatMapTable = HeatMapTable;

}(window));;
this["HBtemplates"] = this["HBtemplates"] || {};

this["HBtemplates"]["templates/heatmap-tree.tmpl"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li>\n    <div class=\"heatmap-row\">\n        <p class=\"heatmap-rowLabel tree-toggler\">\n"
    + ((stack1 = (helpers.createIcon || (depth0 && depth0.createIcon) || alias2).call(alias1,depth0,{"name":"createIcon","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <span class=\"rowLabel\">"
    + ((stack1 = ((helper = (helper = helpers.rowLabel || (depth0 != null ? depth0.rowLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rowLabel","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span>\n            <span><a href=\""
    + alias4(((helper = (helper = helpers.linkURL || (depth0 != null ? depth0.linkURL : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkURL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.linkLabel || (depth0 != null ? depth0.linkLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkLabel","hash":{},"data":data}) : helper)))
    + "</a></span>\n        </p>\n        <div class=\"pull-right\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.values : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n    </div>\n    <ul class=\"tree heatmap-closed\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.detailData : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"4":function(container,depth0,helpers,partials,data) {
    return "                "
    + container.escapeExpression((helpers.showValue || (depth0 && depth0.showValue) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"showValue","hash":{},"data":data}))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"heatmap-detail\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.detailData : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "                    <div>\n                    "
    + container.escapeExpression((helpers.addDetail || (depth0 && depth0.addDetail) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"addDetail","hash":{},"data":data}))
    + "\n                    </div>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["create-children"],depth0,{"name":"create-children","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});

this["HBtemplates"]["templates/heatmap.tmpl"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"col-md-5\">\n    <div class=\"input-group\">\n        <input type=\"text\" class=\"heatmap-filterByRowName-input form-control\" placeholder=\"Search for...\">\n        <span class=\"input-group-btn\">\n            <button class=\"btn btn-default heatmap-filterByRowName-search\" type=\"button\">Search</button>\n        </span>\n    </div>\n</div>\n<button class=\"btn btn-default heatmap-reset-btn\">Reset</button>\n<button class=\"btn btn-default heatmap-collapseAll-btn\">CollapseAll</button>\n<button class=\"btn btn-default heatmap-expandAll-btn\">ExpandAll</button>\n<div class=\"heatmap-body\">\n    <div style=\"overflow:hidden\">\n        <div style=\"overflow:hidden\">\n            <div class=\"pull-right\">\n                "
    + container.escapeExpression(((helper = (helper = helpers.heatmapCreateHeader || (depth0 != null ? depth0.heatmapCreateHeader : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"heatmapCreateHeader","hash":{},"data":data}) : helper)))
    + "\n            </div>\n        </div>\n    </div>\n    <ul class=\"tree heatmap-ul heatmap-rows\">\n    </ul>\n</div>";
},"useData":true});