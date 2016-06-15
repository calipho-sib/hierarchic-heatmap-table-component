function convertNextProtDataIntoHeatMapTableFormat (data) {
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


    var experimentalContext = {};
    $.ajax(
        {
            type: "get",
            // url: "https://api.nextprot.org/terminology/nextprot-anatomy-cv.json",
            url: "data/experimental-context.json",
            async: false,
            success: function (data) {
                data = data['entry']['experimentalContexts'];
                console.log("Get experimental-context.")
                for (var i = 0; i < data.length; i++) {
                	if (data[i].developmentalStage && data[i].developmentalStage.name != "unknown") {
		                experimentalContext[data[i].contextId] = data[i].developmentalStage.name;
   					}
                }
                // console.log(experimentalContext);
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
            heatMapTableTree.push(node);
            queue.push(heatMapTableTree[0]);
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

    function createDetailWithEvidence(evidence, value) {
		var detail = {};
        detail['evidenceCodeName'] = evidence.evidenceCodeName;
        detail['dbSource'] = evidence.resourceDb;
        detail['value'] = value;
        detail['ensemblLink'] = xrefDict[evidence.resourceId].resolvedUrl.replace(/amp;/g, "");
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
			detail['description'] = "Expression " + evidence.expressionLevel
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
                    data.values[3] = "Strong";
                    detail = createDetailWithEvidence(evidence, data.values[3]);
                } else if (evidence.evidenceCodeName === "immunolocalization evidence" && evidence.expressionLevel === "medium") {
                    data.values[4] = "Moderate";
                    detail = createDetailWithEvidence(evidence, data.values[4]);
                } else if (evidence.evidenceCodeName === "immunolocalization evidence" && evidence.expressionLevel === "low") {
                    data.values[5] = "Weak";
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

    // var heatMapTableDict = {};

    // function findHeatMapData(data, step) {
    //     if (step > 2) return;
    //     if (rowLabelsToheatMapTable[data.rowLabel]) {
    //         heatMapTableDict[rowLabelsToheatMapTable[data.rowLabel]] = {'data': [data]};
    //     }
    //     for (var i = 0; i < data.children.length; i++) {
    //         findHeatMapData(data.children[i], step+1);
    //     }
    // }

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

    findHeatMapData(heatMapTableTree[0], 0);

    // return heatMapTableDict;
    console.log(heatmapData);
    return {'data': heatmapData};
}
