function convertNextProtDataIntoHeatMapTableFormat(data) {
    //TODO convert the data here into the JSON format used by heatmap table
    // Related task: https://trello.com/c/DNgw1yLp/12-convert-nextprot-data-into-the-json-format
    console.log(data)
    console.log("Found " + data.annot.length + " annotations in nextprot about data expression");
    console.log("Example");

    for (var i = 0; i < data.annot.length; i++) {
        var annot = data.annot[i];
        console.log(annot.cvTermAccessionCode)

        for (var j = 0; j < annot.evidences.length; j++) {

            var evidence = annot.evidences[j]; //There might be more than one evidence for each "statement", this should be reflected on the heatmap table as well

            // Can be immunolocalization evidence -> IHC
            // Can be microarray RNA expression level evidence -> Microarray
            // Can be transcript expression evidence -> EST
            console.log("\tmethod: " + evidence.evidenceCodeName);

            //It depends on the methodology, can be weak / low, moderate / medium, strong / high, not detected, positive
            console.log("\tvalue: " + evidence.expressionLevel);

            //Don't worry about quality for now, but see it will need to be present on the filters: http://www.nextprot.org/db/entry/NX_P01308/expression
            console.log("\tquality: " + evidence.qualityQualifier);
            console.log("\t");

        }
    }


    // alert("See console log. Need to Implement convertNextProtDataIntoHeatMapTableFormat")
    //TODO 
    return {
        "alimentary-system": {
            data: {}
        },
        "cardiovascular-system": {
            data: {}
        }
    };
}