
$(function () {

    //TODO invoke nextprot API and and built a heatmap table for each anatomycal system instead of calling data.json mock file.
    // Related Trello task: https://trello.com/c/DNgw1yLp/12-convert-nextprot-data-into-the-json-format


    var applicationName = 'protein expression app'; //please provide a name for your application
    var clientInfo='JinJin'; //please provide some information about you
    var nx = new Nextprot.Client(applicationName, clientInfo);

    var proteinAccession = 'NX_P38398'; //Corresponds to Breast cancer protein -> http://www.nextprot.org/db/entry/NX_P38398/expression
    nx.getAnnotationsByCategory(proteinAccession, 'expression-profile').then(function (data){

        var data = convertNextProtDataIntoHeatMapTableFormat(data);

        var heatMapTable = HeatMapTable({
            header:['Microarray', 'EST', 'IHC'],
            tableID: "heatmap-table"
        });

        heatMapTable.loadJSONData(data);
        heatMapTable.show();

    });


});
