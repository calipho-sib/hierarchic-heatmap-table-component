
$(function () {

    //TODO invoke nextprot API and and built a heatmap table for each anatomycal system instead of calling data.json mock file.
    // Related Trello task: https://trello.com/c/DNgw1yLp/12-convert-nextprot-data-into-the-json-format
    $.getJSON("data/data.json", function(data) {

        var heatMapTable = new HeatMapTable({
        		header:['Microarray', 'EST', 'IHC'],
        		tableID: "heatmap-table"
        	});
        heatMapTable.loadJSONData(data);


    })

});

Handlebars.registerPartial('create-ul', HBtemplates['templates/heatmap-tree.tmpl']);
