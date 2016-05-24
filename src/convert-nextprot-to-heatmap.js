function convertNextProtDataIntoHeatMapTableFormat (data) {
    $.ajax(
            {
                type: "get",
                url: "https://api.nextprot.org/terminology/nextprot-anatomy-cv.json",
                async: false,
                dataType: 'json',
                crossDomain: true,
                success: function (data) {
                    terminologyList = data["terminologyList"]
                },
                error: function (msg) { 
                }
            }
        );

    var termDict = {};
    var queue = [];
    var heatMapTableTree = [];
    var count = 0;
    for (var i = 0; i < terminologyList.length; i++) {
        termDict[terminologyList[i].accession] = terminologyList[i];
        if (terminologyList[i].ancestorAccession === null) {
            var node = {};
            node.children = [];
            node.values = [];
            node.rowLabel = terminologyList[i].name;
            node.cvTermAccessionCode = terminologyList[i].accession;
            node.linkLabel = "[" + terminologyList[i].accession + "]"
            node.linkURL = "http://www.nextprot.org/db/term/" + terminologyList[i].name;
            heatMapTableTree.push(node);
            queue.push(heatMapTableTree[0]);
        }
    }
    while (queue.length !== 0) {
        var currNode = queue.shift();
        var currTerm = termDict[currNode.cvTermAccessionCode];
        if (currTerm && currTerm.childAccession) {
            for (var i = 0; i < currTerm.childAccession.length; i++) {
                var childTerm = termDict[currTerm.childAccession[i]];
                var childNode = {};
                childNode.children = [];
                childNode.values = [];
                childNode.cvTermAccessionCode = childTerm.accession;
                childNode.rowLabel = childTerm.name;
                childNode.linkLabel = "[" + childTerm.accession + "]"
                childNode.linkURL = "http://www.nextprot.org/db/term/" + childTerm.name;
                queue.push(childNode);

                currNode.children.push(childNode);
            }
        }
    }

    // var treeNodesMap = {};

    // function addTermToTree(annot) {
    //     var termCode = annot.cvTermAccessionCode;
    //     if (treeNodesMap[termCode] === undefined) {
    //         //if the term is not in the tree
    //         treeNodesMap[termCode] = termDict[termCode];
    //     }
    //     if (termDict[termCode].ancestorAccession) {
    //         for (var j = 0; j < termDict[termCode].ancestorAccession.length; j++) {
    //             console.log(termDict[termCode].ancestorAccession);
    //             var ancestor = termDict[termCode].ancestorAccession[i];
    //             addTermToTree(ancestor);
    //             if (treeNodesMap[ancestor].children) {
    //                 treeNodesMap[ancestor].children = [];
    //             }
    //             treeNodesMap[ancestor].children.push(termDict[termCode]);
    //         }
    //     }
    // }

    // for(var i=0; i<data.annot.length; i++) {
    //     console.log(data.annot[i].cvTermName);
    //     var annot = data.annot[i];
        // console.log(annot.cvTermAccessionCode+ "  " +termDict[annot.cvTermAccessionCode].name)
        // console.log("i:");
        // console.log(i);
        // addTermToTree(annot);
     // console.log(termDict[annot.cvTermAccessionCode]);
     // console.log('=====');         
     // for(var j=0; j<annot.evidences.length; j++) {
         
         // var evidence = annot.evidences[j]; //There might be more than one evidence for each "statement", this should be reflected on the heatMapTable table as well
         
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
//     }
//     console.log(treeNodesMap);

    var rowLabelsToheatMapTable = {
        "Alimentary system": "alimentary-system",
        "Cardiovascular system": "cardiovascular-system",
        "Dermal system": "dermal-system",
        "Endocrine system": "endocrine-system",
        "Exocrine system": "exocrine-system",
        "Hemolymphoid and immune system": "hemolymphoid-and-immune-system",
        "Musculoskeletal system": "musculoskeletal-system",
        "Nervous system": "nervous-system",
        "Reproductive system": "reproductive-system",
        "Respiratory system": "respiratory-system",
        "Urinary system": "urinary-system",
        "Sense organ": "sense-organ",
        "Body part": "body-part",
        "Tissue": "tissue",
        "Cell type": "cell-type",
        "Fluid and secretion": "fluid-and-secretion",
        "Gestational structure": "gestational-structure"
    }

    var heatMapTableDict = {};

    function findHeatMapData(data, step) {
        if (step > 2) return;
        if (rowLabelsToheatMapTable[data.rowLabel]) {
            heatMapTableDict[rowLabelsToheatMapTable[data.rowLabel]] = {'data': [data]};
        }
        for (var i = 0; i < data.children.length; i++) {
            findHeatMapData(data.children[i], step+1);
        }
    }

    findHeatMapData(heatMapTableTree[0], 0);

    return heatMapTableDict;
}
