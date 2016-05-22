function convertNextProtDataIntoHeatMapTableFormat (data) {
    //TODO convert the data here into the JSON format used by heatmap table
    // Related task: https://trello.com/c/DNgw1yLp/12-convert-nextprot-data-into-the-json-format
    console.log(data);
    // console.log("Found " + data.annot.length + " annotations in nextprot about data expression");
    // console.log("Example");

    var tree = []

    function addTermToData(term, dataList) {
        if (term.ancestorAccession && term.ancestorAccession.length !== 0) {
            for (var i = 0; i < dataList.length; i++) {
                if (term.ancestorAccession[0] === dataList[i].accession) {
                    term.children = [];
                    dataList[i]['children'].push(term);
                    term.ancestorAccession.shift();
                }
                addTermToData(term, dataList[i]['children'])
            }
        }
    }

    var term_dict = {};

    $.get("https://api.nextprot.org/terminology/nextprot-anatomy-cv.json", function(terminologyList, status) {
        console.log(terminologyList);
        var queue = [];
        terminologyList = terminologyList["terminologyList"]
        var newData = {};
        var count = 0;
        for (var i = 0; i < terminologyList.length; i++) {
            term_dict[terminologyList[i].accession] = terminologyList[i];
            if (terminologyList[i].ancestorAccession === null) {
                newData = terminologyList[i];
                queue.push(newData);
            }
        }
        while (queue.length !== 0) {
            var term = queue.shift();
            term.children = [];
            for (var i = 0; i < term.childAccession.length; i++) {
                term.children.push(term_dict[term.childAccession[i]]);
                if (term_dict[term.childAccession[i]].childAccession) {
                    queue.push(term_dict[term.childAccession[i]]);
                }
            }
        }
        console.log(newData);

        for(var i=0; i<data.annot.length; i++) {
         var annot = data.annot[i];
         console.log(annot.cvTermAccessionCode)
         console.log(term_dict[annot.cvTermAccessionCode]);
         console.log('=====');         

         // for(var j=0; j<annot.evidences.length; j++) {
             
             // var evidence = annot.evidences[j]; //There might be more than one evidence for each "statement", this should be reflected on the heatmap table as well
             
             // Can be immunolocalization evidence -> IHC
             // Can be microarray RNA expression level evidence -> Microarray
             // Can be transcript expression evidence -> EST
             // console.log("\tmethod: " + evidence.evidenceCodeName); 

             //It depends on the methodology, can be weak / low, moderate / medium, strong / high, not detected, positive
             // console.log("\tvalue: " + evidence.expressionLevel);
             
             //Don't worry about quality for now, but see it will need to be present on the filters: http://www.nextprot.org/db/entry/NX_P01308/expression
             // console.log("\tquality: " + evidence.qualityQualifier);
             // console.log("\t");
             
         // }
        }

    });

    return {
        "alimentary-system": {
            data: {}
        },
        "cardiovascular-system": {
            data: {}
        }
    };
}
