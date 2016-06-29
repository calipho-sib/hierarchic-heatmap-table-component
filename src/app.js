$(function () {
    
    var headerTemplateData  = {header:['MA-P',
                                  'MA-ND',
                                  'EST-P', 
                                  'IHC-H', 
                                  'IHC-M',
                                  'IHC-L',
                                  'IHC-ND']
                              };

    var heatmapTableOptions = {
        valuesSetting: [
            // { value: 'Positive', color: '#FFA10A'},
            { value: 'Positive', color: '#FFA10A', filterID: "positiveFilter"},
            { value: 'NotDetected', color: "lightgray", filterID: "notDetectedFilter"},
            { value: 'Low', color: '#FFE6BD'},
            { value: 'Medium', color: '#FFC870'},
            { value: 'High', color: '#FFC870'}
        ],
        columnWidth: "50px",
        detailTemplate: "detailTemplate",
        headerTemplate: "headerTemplate",
        headerTemplateData: headerTemplateData,
    }

    var applicationName = 'protein expression app'; //please provide a name for your application
    var clientInfo = 'JinJin'; //please provide some information about you
    var nx = new Nextprot.Client(applicationName, clientInfo);

    // var proteinAccession = 'NX_P54868'; //Corresponds to Breast cancer protein -> http://www.nextprot.org/db/entry/NX_P38398/expression
    var proteinAccession = nx.getEntryName();

    var heatMapTableName = "heatmap-table";
    var heatMapTable = HeatMapTable({
        tableID: heatMapTableName,
        options: heatmapTableOptions
    });
    heatMapTable.showloadingStatus();

    nx.getAnnotationsByCategory(proteinAccession, 'expression-profile').then(function (data) {
        var experimentalContext = {};

        $.ajax(
            {
                type: "get",
                url: "https://api.nextprot.org/entry/"+proteinAccession+"/experimental-context.json",
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

        console.log(heatmapData);
        heatMapTable.loadJSONData(heatmapData);
        heatMapTable.show();
        heatMapTable.hideloadingStatus();
        // var rowLabelsToId = {
        //     "Alimentary system": "alimentary-system",
        //     "Cardiovascular system": "cardiovascular-system",
        //     "Dermal system": "dermal-system",
        //     "Endocrine system": "endocrine-system",
        //     "Exocrine system": "exocrine-system",
        //     "Hemolymphoid and immune system": "hemolymphoid-and-immune-system",
        //     "Musculoskeletal system": "musculoskeletal-system",
        //     "Nervous system": "nervous-system",
        //     "Reproductive system": "reproductive-system",
        //     "Respiratory system": "respiratory-system",
        //     "Urinary system": "urinary-system",
        //     "Sense organ": "sense-organ",
        //     "Body part": "body-part",
        //     "Tissue": "tissue",
        //     "Cell type": "cell-type",
        //     "Fluid and secretion": "fluid-and-secretion",
        //     "Gestational structure": "gestational-structure"
        // }

        // $("#"+heatMapTableName).children(".heatmap-body").children("ul").children("li").each(function() {
        //     var rowLabel = $($(this).children(".heatmap-row").children(".heatmap-rowLabel").children(".rowLabel")[0]).text();
        //     this.id = rowLabelsToId[rowLabel];
        // });
    });


});
