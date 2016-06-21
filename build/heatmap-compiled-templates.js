this["HBtemplates"] = this["HBtemplates"] || {};

this["HBtemplates"]["templates/heatmap-tree.tmpl"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li>\n    <div class=\"heatmap-row\">\n        <p class=\"heatmap-rowLabel tree-toggler\">\n"
    + ((stack1 = (helpers.createIcon || (depth0 && depth0.createIcon) || alias2).call(alias1,depth0,{"name":"createIcon","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <span class=\"rowLabel\">"
    + ((stack1 = ((helper = (helper = helpers.rowLabel || (depth0 != null ? depth0.rowLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rowLabel","hash":{},"data":data}) : helper))) != null ? stack1 : "")
<<<<<<< HEAD
    + "</span>\r\n            <span><a href=\""
=======
    + "</span>\n            <span><a href=\""
>>>>>>> f3099cc203f3bcc503bd5f954e328cb406fa99db
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