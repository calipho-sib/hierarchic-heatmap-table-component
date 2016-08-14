var headerTemplateData  = {header:['Positive',
                              'NotDetected',
                              'Positive', 
                              'High', 
                              'Medium',
                              'Low',
                              'NotDetected']
                          };

var heatmapTableOptions = {
    valuesSetting: [
        // { value: 'Positive', color: '#FFA10A'},
        { value: 'Positive', color: '#FFA10A'},
        { value: 'NotDetected', color: "lightgray"},
        { value: 'Low', color: '#FFE6BD'},
        { value: 'Medium', color: '#FFC870'},
        { value: 'High', color: '#FFA10A'}
    ],
    columnWidth: "30px",
    detailTemplate: "detailTemplate",
    headerTemplate: "headerTemplate",
    headerTemplateData: headerTemplateData,
}

var applicationName = 'protein expression app'; //please provide a name for your application
var clientInfo = 'JinJin'; //please provide some information about you
var nx = new Nextprot.Client(applicationName, clientInfo);

// var proteinAccession = 'NX_Q01101'; //Corresponds to Breast cancer protein -> http://www.nextprot.org/db/entry/NX_P38398/expression
var proteinAccession = nx.getEntryName();

var heatMapTableName = "heatmap-table";
var heatMapTable = HeatMapTable({
    tableID: heatMapTableName,
    options: heatmapTableOptions
});
heatMapTable.showLoadingStatus();

nx.getAnnotationsByCategory(proteinAccession, 'expression-profile').then(function (data) {
    var experimentalContext = {};
    $.ajax(
        {
            type: "get",
            url: "https://api.nextprot.org/entry/"+proteinAccession+"/experimental-context.json",
            // url: "./data/experimental-context.json",
            async: false,
            success: function (data) {
                data = data['entry']['experimentalContexts'];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].developmentalStage && data[i].developmentalStage.name != "unknown") {
                        experimentalContext[data[i].contextId] = data[i].developmentalStage.name;
                    }
                }
            },
            error: function (msg) {
                console.log(msg);
            }
        }
    );

    var heatmapData = convertNextProtDataIntoHeatMapTableFormat(experimentalContext, data);

    heatmapData = filterByEvidences(heatmapData, getFilters());
    console.log(heatmapData);
    activateFilters(heatmapData, heatMapTable);
    heatMapTable.loadJSONData(heatmapData);
    heatMapTable.show();
    heatMapTable.hideLoadingStatus();

});