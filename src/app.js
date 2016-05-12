
$(function () {

    //TODO invoke nextprot API and and built a heatmap table for each anatomycal system instead of calling data.json mock file.
    $.getJSON("data/data.json", function(data) {

        var heatMapTable = new HeatMapTable({header:['Microarray', 'EST', 'IHC']});
        heatMapTable.loadJSONData(data);
    })

});
