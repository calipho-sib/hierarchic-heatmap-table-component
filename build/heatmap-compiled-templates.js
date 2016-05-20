this["HBtemplates"] = this["HBtemplates"] || {};

this["HBtemplates"]["templates/heatmap-tree.tmpl"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <li>\r\n        <div class=\"heatmap-row\">\r\n            <p class=\"heatmap-rowLabel tree-toggler\"><span class=\"glyphicon glyphicon-plus\"></span><span>"
    + alias4(((helper = (helper = helpers.rowLabel || (depth0 != null ? depth0.rowLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rowLabel","hash":{},"data":data}) : helper)))
    + "</span><span><a href=\""
    + alias4(((helper = (helper = helpers.linkURL || (depth0 != null ? depth0.linkURL : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkURL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.linkLabel || (depth0 != null ? depth0.linkLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkLabel","hash":{},"data":data}) : helper)))
    + "</a></span></p>\r\n            <div class=\"pull-right\">\r\n"
    + ((stack1 = (helpers.forCreateCircle || (depth0 && depth0.forCreateCircle) || alias2).call(alias1,(depth0 != null ? depth0.values : depth0),{"name":"forCreateCircle","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\r\n        </div>\r\n        <ul class=\"tree heatmap-closed\">\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\r\n    </li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <div class=\"heatmap-column "
    + alias4(((helper = (helper = helpers.columnClass || (depth0 != null ? depth0.columnClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"columnClass","hash":{},"data":data}) : helper)))
    + "\", style=\"width:"
    + alias4(((helper = (helper = helpers.columnWidth || (depth0 != null ? depth0.columnWidth : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"columnWidth","hash":{},"data":data}) : helper)))
    + "\">\r\n                        <i class=\"heatmap-circle "
    + alias4(((helper = (helper = helpers.circleColorClass || (depth0 != null ? depth0.circleColorClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"circleColorClass","hash":{},"data":data}) : helper)))
    + "\" style=\"background-color: "
    + alias4(((helper = (helper = helpers.circleColorStyle || (depth0 != null ? depth0.circleColorStyle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"circleColorStyle","hash":{},"data":data}) : helper)))
    + "\"></i>\r\n                    </div>\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["create-children"],depth0,{"name":"create-children","data":data,"indent":"                ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n";
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

  return "<button class=\"btn btn-default\" id=\"heatmap-collapseAll-btn\">CollapseAll</button>\r\n<button class=\"btn btn-default\" id=\"heatmap-expandAll-btn\">ExpandAll</button>\r\n<div id=\"heatmap-body\">\r\n    <div style=\"overflow:hidden\">\r\n        <div style=\"display:inline-block;width:400px\"></div>\r\n        <div class=\"pull-right\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.header : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n    <ul class=\"tree heatmap-ul\">\r\n"
    + ((stack1 = container.invokePartial(partials["create-children"],depth0,{"name":"create-children","data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "    </ul>\r\n</div>";
},"usePartial":true,"useData":true});