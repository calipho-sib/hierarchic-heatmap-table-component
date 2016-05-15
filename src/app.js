
$(function () {

    //TODO invoke nextprot API and and built a heatmap table for each anatomycal system instead of calling data.json mock file.
    // Related Trello task: https://trello.com/c/DNgw1yLp/12-convert-nextprot-data-into-the-json-format

    var heatMapTable = HeatMapTable({
		header:['Microarray', 'EST', 'test1','test3', 'IHC', 'test2'],
		tableID: "heatmap-table"
	});

    $.getJSON("../data/data.json", function(data) {
        heatMapTable.loadJSONData(data);
        heatMapTable.show();
    })

});
