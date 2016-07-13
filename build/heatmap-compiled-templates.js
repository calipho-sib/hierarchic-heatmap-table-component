this["HBtemplates"] = this["HBtemplates"] || {};

this["HBtemplates"]["templates/heatmap-body.tmpl"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"heatmap-body\">\n    <div style=\"overflow:hidden\">\n        <div style=\"overflow:hidden\">\n            <div class=\"pull-right\">\n                "
    + container.escapeExpression(((helper = (helper = helpers.heatmapCreateHeader || (depth0 != null ? depth0.heatmapCreateHeader : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"heatmapCreateHeader","hash":{},"data":data}) : helper)))
    + "\n            </div>\n        </div>\n    </div>\n\n</div>";
},"useData":true});

this["HBtemplates"]["templates/heatmap-circle.tmpl"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<i class=\"heatmap-circle "
    + alias4(((helper = (helper = helpers.circleColorClass || (depth0 != null ? depth0.circleColorClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"circleColorClass","hash":{},"data":data}) : helper)))
    + "\" style=\"background-color: "
    + alias4(((helper = (helper = helpers.circleColorStyle || (depth0 != null ? depth0.circleColorStyle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"circleColorStyle","hash":{},"data":data}) : helper)))
    + "\"></i>";
},"useData":true});

this["HBtemplates"]["templates/heatmap-row.tmpl"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<p class=\""
    + alias4(((helper = (helper = helpers["class"] || (depth0 != null ? depth0["class"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"class","hash":{},"data":data}) : helper)))
    + " heatmap-rowLabel tree-toggler\">\n    "
    + ((stack1 = ((helper = (helper = helpers.iconHtml || (depth0 != null ? depth0.iconHtml : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iconHtml","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    <span class=\"rowLabel\">"
    + ((stack1 = ((helper = (helper = helpers.rowLabel || (depth0 != null ? depth0.rowLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rowLabel","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span>\n    <span><a href=\""
    + alias4(((helper = (helper = helpers.linkURL || (depth0 != null ? depth0.linkURL : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkURL","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.linkLabel || (depth0 != null ? depth0.linkLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkLabel","hash":{},"data":data}) : helper)))
    + "</a></span>\n</p>";
},"useData":true});

this["HBtemplates"]["templates/heatmap-skeleton.tmpl"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"col-md-5\">\n	<div class=\"typeahead__container\">\n		<div class=\"typeahead__field\">\n			<span class=\"typeahead__query\">\n				<input class=\"heatmap-filterByRowName-input\" name=\"country_v1[query]\" type=\"search\" placeholder=\"Search\" autocomplete=\"off\">\n			</span>\n			<span class=\"typeahead__button\">\n				<button class=\"heatmap-filterByRowName-search\">\n					<i class=\"typeahead__search-icon\"></i>\n				</button>\n			</span>\n		</div>\n	</div>\n</div>\n<button class=\"btn btn-default heatmap-reset-btn\">Reset</button>\n<button class=\"btn btn-default heatmap-collapseAll-btn\">CollapseAll</button>\n<button class=\"btn btn-default heatmap-expandAll-btn\">ExpandAll</button>\n<p class=\"heatmap-info\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></span> Loading...</p>";
},"useData":true});

this["HBtemplates"]["templates/heatmap-tree.tmpl"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "                "
    + container.escapeExpression((helpers.showValue || (depth0 && depth0.showValue) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"showValue","hash":{},"data":data}))
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"heatmap-detail\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.detailData : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "                    <div>\n                    "
    + container.escapeExpression((helpers.addDetail || (depth0 && depth0.addDetail) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,{"name":"addDetail","hash":{},"data":data}))
    + "\n                    </div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "            "
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "\n<li>\n    <div class=\"heatmap-row\">\n        "
    + container.escapeExpression((helpers.createRow || (depth0 && depth0.createRow) || helpers.helperMissing).call(alias1,depth0,{"name":"createRow","hash":{},"data":data}))
    + "\n        <div class=\"pull-right\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.values : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n    </div>\n    <ul class=\"tree heatmap-closed heatmap-tree\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.detailData : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.childrenHTML : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</li>\n";
},"useData":true});

this["HBtemplates"]["templates/heatmap-value.tmpl"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"heatmap-column "
    + alias4(((helper = (helper = helpers.columnClass || (depth0 != null ? depth0.columnClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"columnClass","hash":{},"data":data}) : helper)))
    + "\", style=\"width:"
    + alias4(((helper = (helper = helpers.columnWidth || (depth0 != null ? depth0.columnWidth : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"columnWidth","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.valueStyle || (depth0 != null ? depth0.valueStyle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"valueStyle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>";
},"useData":true});