$(function () {

    //TODO invoke nextprot API and and built a heatmap table for each anatomycal system instead of calling data.json mock file.
    // Related Trello task: https://trello.com/c/DNgw1yLp/12-convert-nextprot-data-into-the-json-format


    var heatmapTableOptions = {
        valuesColorMapping: [
            {
                value: 'High',
                color: '#C00000'
                    },
            {
                value: 'Low',
                color: '#0070C0'
                    },
            {
                value: 'Moderate',
                cssClass: 'grayBG'
                    },
            {
                value: 'Negative',
                cssClass: 'greenBG'
                    }
                ]
    }

    var heatmapTableHeader = ['Microarray', 'EST', 'IHC'];
    var heatmapTableNames = ['alimentary-system', 'cardiovascular-system']; //Complete with all...


    var applicationName = 'protein expression app'; //please provide a name for your application
    var clientInfo = 'JinJin'; //please provide some information about you
    var nx = new Nextprot.Client(applicationName, clientInfo);

    var proteinAccession = 'NX_P38398'; //Corresponds to Breast cancer protein -> http://www.nextprot.org/db/entry/NX_P38398/expression

    nx.getAnnotationsByCategory(proteinAccession, 'expression-profile').then(function (data) {

        //Suppose you have a map here for each "roots" another way of doing is calling this method inside the for loop for passing the name of the heatmap table as a parameter
        var dataMap = convertNextProtDataIntoHeatMapTableFormat(data);

        for (var i = 0; i < heatmapTableNames.length; i++) {

            var heatMapTableName = heatmapTableNames[i];
            console.log(heatMapTableName);

            var heatMapTable = HeatMapTable({
                header: heatmapTableHeader,
                tableID: heatMapTableName,
                options: heatmapTableOptions
            });


            var data = dataMap[heatMapTableName];
            heatMapTable.loadJSONData(data);
            heatMapTable.show();

        }

    });


});