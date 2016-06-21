function convertNextProtDataIntoHeatMapTableFormat (experimentalContext, data) {
    console.log(data);

    var cvTermList = {};
    var xrefDict = data['xrefs'];
    $.ajax(
        {
            type: "get",
            // url: "https://api.nextprot.org/terminology/nextprot-anatomy-cv.json",
            url: "data/nextprot-anatomy-cv.json",
            async: false,
            success: function (data) {
                console.log("Get data.")
                console.log(data);
                cvTermList = data["cvTermList"]
            },
            error: function (msg) {
                console.log(msg);
            }
        }
    );

    var termDict = {};
    var queue = [];
    var heatMapTableRoot = null;
    var detailList = [];
    for (var i = 0; i < cvTermList.length; i++) {
        termDict[cvTermList[i].accession] = cvTermList[i];
        if (cvTermList[i].ancestorAccession === null) {
            var node = {};
            node.ancestorIds = null;
            node.children = [];
            node.values = ["",  "", "", "", "", "", ""];
            node.detailData = [];
            node.rowLabel = cvTermList[i].name;
            node.id = cvTermList[i].accession;
            node.linkLabel = "[" + cvTermList[i].accession + "]"
            node.linkURL = "http://www.nextprot.org/db/term/" + cvTermList[i].name;
            heatMapTableRoot = node;
            queue.push(heatMapTableRoot);

            detailList.push(node.detailData);
        }
    }
    while (queue.length !== 0) {
        var currNode = queue.shift();
        var currTerm = termDict[currNode.id];
        if (currTerm && currTerm.childAccession) {
            for (var i = 0; i < currTerm.childAccession.length; i++) {
                var childTerm = termDict[currTerm.childAccession[i]];
                var childNode = {};
                childNode.ancestorIds = currNode;
                childNode.children = [];
                childNode.values = ["",  "", "", "", "", "", ""];
                childNode.detailData = [];
                childNode.id= childTerm.accession;
                childNode.rowLabel = childTerm.name;
                childNode.linkLabel = "[" + childTerm.accession + "]"
                childNode.linkURL = "http://www.nextprot.org/db/term/" + childTerm.name;
                queue.push(childNode);

                currNode.children.push(childNode);

                detailList.push(childNode.detailData);
            }
        }
    }

    function updateAncestorValues(data, values) {
        for (var i = 0; i < data.values.length; i++) {
            if (data.values[i] == "" || data.values[i] == undefined) {
                data.values[i] = values[i];
            }
        }
        if (data.ancestorIds) {
            updateAncestorValues(data.ancestorIds, values);
        }
    }

    var codeNameToShortName = {
        "microarray RNA expression level evidence": "Microarray",
        "transcript expression evidence": "EST",
        "immunolocalization evidence": "IHC"
    }

    function createDetailWithEvidence(evidence, value) {
        var detail = {};
        detail['evidenceCodeName'] = codeNameToShortName[evidence.evidenceCodeName];
        detail['dbSource'] = evidence.resourceDb;
        detail['value'] = value;
        detail['ensemblLink'] = xrefDict[evidence.resourceId].resolvedUrl.replace(/amp;/g, "");
        
        //setting ensembl
        if (evidence.antibodies) {
            detail['ensembl'] = evidence.antibodies;
        } else {
            detail['ensembl'] = evidence.resourceAccession.slice(evidence.resourceAccession.indexOf("gene_id=")+8);
            if (detail['ensembl'].indexOf("&amp") !== -1) {
                detail['ensembl'] = detail['ensembl'].substring(0, detail['ensembl'].indexOf("&amp"));
            }
        }
        
        if (evidence.qualityQualifier === "SILVER") {
            detail['qualityQualifier'] = evidence.qualityQualifier;
        }

        if (experimentalContext[evidence.experimentalContextId]) {
            if (evidence.expressionLevel === "negative") {
                detail['description'] = "Expression not detected at " + experimentalContext[evidence.experimentalContextId];
            } else {
                detail['description'] = "Expression " + evidence.expressionLevel + " at " + experimentalContext[evidence.experimentalContextId];
            }
        } else {
            if (evidence.expressionLevel === "negative") {
                detail['description'] = "Expression not detected";
            } else {
                detail['description'] = "Expression " + evidence.expressionLevel
            }
        }
        return detail;
    }

    function addAnnotToHeatMapTable(data, annot) {
        if (data.id === annot.cvTermAccessionCode) {
            for(var i = 0; i < annot.evidences.length; i++) {

                var evidence = annot.evidences[i]; //There might be more than one evidence for each "statement", this should be reflected on the heatMapTable table as well
                var detail = {};

                if (evidence.evidenceCodeName === "microarray RNA expression level evidence" && evidence.expressionLevel === "positive") {
                    data.values[0] = "Positive";
                    detail = createDetailWithEvidence(evidence, data.values[0]);       
                } else if ((evidence.evidenceCodeName === "microarray RNA expression level evidence" && evidence.expressionLevel === "not detected") 
                            || (evidence.evidenceCodeName === "microarray RNA expression level evidence" && evidence.expressionLevel === "negative" && evidence.negativeEvidence === true)) {
                    data.values[1] = "NotDetected";
                    detail = createDetailWithEvidence(evidence, data.values[1]);
                } else if (evidence.evidenceCodeName === "transcript expression evidence" && evidence.expressionLevel === "positive") {
                    data.values[2] = "Positive";
                    detail = createDetailWithEvidence(evidence, data.values[2]);
                } else if (evidence.evidenceCodeName === "immunolocalization evidence" && evidence.expressionLevel === "high") {
                    data.values[3] = "High";
                    detail = createDetailWithEvidence(evidence, data.values[3]);
                } else if (evidence.evidenceCodeName === "immunolocalization evidence" && evidence.expressionLevel === "medium") {
                    data.values[4] = "Medium";
                    detail = createDetailWithEvidence(evidence, data.values[4]);
                } else if (evidence.evidenceCodeName === "immunolocalization evidence" && evidence.expressionLevel === "low") {
                    data.values[5] = "Low";
                    detail = createDetailWithEvidence(evidence, data.values[5]);
                } else if (evidence.evidenceCodeName === "immunolocalization evidence" && evidence.expressionLevel === "not detected") {
                    data.values[6] = "NotDetected";
                    detail = createDetailWithEvidence(evidence, data.values[6]);
                    detail['description'] = "Expression not detected";
                }

                data.detailData.push(detail);
            }

            if (data.ancestorIds) {
                updateAncestorValues(data.ancestorIds, data.values);
            }
        }

        for (var i = 0; i < data.children.length; i++) {
            addAnnotToHeatMapTable(data.children[i], annot);
        }
    }

    for(var i = 0; i < data.annot.length; i++) {
        var annot = data.annot[i];
        addAnnotToHeatMapTable(heatMapTableRoot, annot);        
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

    var heatmapData = [];
    function findHeatMapData(data, step) {
        if (step > 2) return;
        if (rowLabelsToheatMapTable[data.rowLabel]) {
            heatmapData.push(data);
        }
        for (var i = 0; i < data.children.length; i++) {
            findHeatMapData(data.children[i], step+1);
        }
    }

    findHeatMapData(heatMapTableRoot, 0);

    heatmapData.sort(function(a, b) {
        if(a.rowLabel < b.rowLabel) return -1;
        if(a.rowLabel > b.rowLabel) return 1;
        return 0;
    });

    function sortDetail(detailList) {
        var levelPriorityDict = {
            "High": 5,
            "Medium": 4,
            "Low": 3,
            "Positive": 2,
            "NotDetected": 1
        }
        var codePriorityDict = {
            "Microarray": 3,
            "EST": 2,
            "IHC": 1
        }

        for (var i = 0; i < detailList.length; i++) {
            if (detailList[i].length > 0) {
                detailList[i].sort(function(a, b) {
                    if (levelPriorityDict[a.value] === levelPriorityDict[b.value]) {
                        if (codePriorityDict[a.evidenceCodeName] === codePriorityDict[b.evidenceCodeName]) return 0;
                        if (codePriorityDict[a.evidenceCodeName] < codePriorityDict[b.evidenceCodeName]) return -1;
                        if (codePriorityDict[a.evidenceCodeName] > codePriorityDict[b.evidenceCodeName]) return 1;
                    } else if (levelPriorityDict[a.value] < levelPriorityDict[b.value]) {
                        return 1;
                    } else if (levelPriorityDict[a.value] > levelPriorityDict[b.value]) {
                        return -1;
                    }
                });
            }
        }
    }

    sortDetail(detailList);

    return {'data': heatmapData};
}
