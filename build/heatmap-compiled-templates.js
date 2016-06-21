this["HBtemplates"] = this["HBtemplates"] || {};

this["HBtemplates"]["templates/heatmap-tree.tmpl"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<li>\r\n    <div class=\"heatmap-row\">\r\n        "
    + container.escapeExpression((helpers.createRow || (depth0 && depth0.createRow) || helpers.helperMissing).call(alias1,depth0,{"name":"createRow","hash":{},"data":data}))
    + "\r\n        <div class=\"pull-right\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.values : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n    <ul class=\"tree heatmap-closed\">\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.detailData : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\r\n</li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "                "
    + container.escapeExpression((helpers.showValue || (depth0 && depth0.showValue) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"showValue","hash":{},"data":data}))
    + "\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"heatmap-detail\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.detailData : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "                    <div>\r\n                    "
    + container.escapeExpression((helpers.addDetail || (depth0 && depth0.addDetail) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"addDetail","hash":{},"data":data}))
    + "\r\n                    </div>\r\n";
},"7":function(container,depth0,helpers,partials,data) {
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