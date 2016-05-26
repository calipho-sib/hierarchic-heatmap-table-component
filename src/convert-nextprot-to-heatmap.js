function convertNextProtDataIntoHeatMapTableFormat (data) {
    $.ajax(
            {
                type: "get",
                url: "https://api.nextprot.org/terminology/nextprot-anatomy-cv.json",
                // url: "../data/nextprot-anatomy-cv.json",
                async: false,
                crossDomain: true,
                success: function (data) {
                    console.log("Get data.")
                    console.log(data);
                    terminologyList = data["terminologyList"]
                },
                error: function (msg) {
                    console.log(msg);
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
            node.ancestorAccession = null;
            node.children = [];
            node.values = ["",  "", "", "", "", "", ""];
            console.log(node);
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
                childNode.ancestorAccession = currNode;
                childNode.children = [];
                childNode.values = ["",  "", "", "", "", "", ""];
                childNode.cvTermAccessionCode = childTerm.accession;
                childNode.rowLabel = childTerm.name;
                childNode.linkLabel = "[" + childTerm.accession + "]"
                childNode.linkURL = "http://www.nextprot.org/db/term/" + childTerm.name;
                queue.push(childNode);

                currNode.children.push(childNode);
            }
        }
    }

    function updateAncestorValues(data, values) {
        for (var i = 0; i < data.values.length; i++) {
            if (data.values[i] == "" || data.values[i] == undefined) {
                data.values[i] = values[i];
            }
        }
        if (data.ancestorAccession) {
            updateAncestorValues(data.ancestorAccession, values);
        }
    }

    function addAnnotToHeatMapTable(data, annot) {
        if (data.cvTermAccessionCode === annot.cvTermAccessionCode) {
            for(var i = 0; i < annot.evidences.length; i++) {

                var evidence = annot.evidences[i]; //There might be more than one evidence for each "statement", this should be reflected on the heatMapTable table as well

                if (evidence.evidenceCodeName === "microarray RNA expression level evidence" && evidence.expressionLevel === "positive") {
                    data.values[0] = "Positive"
                } else if (evidence.evidenceCodeName === "microarray RNA expression level evidence" && evidence.expressionLevel === "not detected") {
                    data.values[1] = "NotDetected"
                } else if (evidence.evidenceCodeName === "transcript expression evidence" && evidence.expressionLevel === "positive") {
                    data.values[2] = "Positive"
                } else if (evidence.evidenceCodeName === "immunolocalization evidence" && evidence.expressionLevel === "high") {
                    data.values[3] = "Strong"
                } else if (evidence.evidenceCodeName === "immunolocalization evidence" && evidence.expressionLevel === "medium") {
                    data.values[4] = "Moderate"
                } else if (evidence.evidenceCodeName === "immunolocalization evidence" && evidence.expressionLevel === "low") {
                    data.values[5] = "Weak"
                } else if (evidence.evidenceCodeName === "immunolocalization evidence" && evidence.expressionLevel === "not detected") {
                    data.values[6] = "NotDetected"
                }


                // Can be immunolocalization evidence -> IHC
                // Can be microarray RNA expression level evidence -> Microarray
                // Can be transcript expression evidence -> EST
                // console.log("\tmethod: " + evidence.evidenceCodeName); 

                // It depends on the methodology, can be weak / low, moderate / medium, strong / high, not detected, positive
                // console.log("\tvalue: " + evidence.expressionLevel);

                //Don't worry about quality for now, but see it will need to be present on the filters: http://www.nextprot.org/db/entry/NX_P01308/expression
                // console.log("\tquality: " + evidence.qualityQualifier);
                // console.log("\t");
         
            }

            if (data.ancestorAccession) {
                updateAncestorValues(data.ancestorAccession, data.values);
            }
        }

        for (var i = 0; i < data.children.length; i++) {
            addAnnotToHeatMapTable(data.children[i], annot);
        }
    }

    for(var i = 0; i < data.annot.length; i++) {
        var annot = data.annot[i];
        addAnnotToHeatMapTable(heatMapTableTree[0], annot);        
    }

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
