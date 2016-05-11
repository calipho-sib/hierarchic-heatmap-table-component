
$(function () {

    $.getJSON("data/data.json", function(data) {

        var heatMapTable = new HeatMapTable({header:['Microarray', 'EST', 'IHC']});
        heatMapTable.loadJSONData(data);
    })

});
