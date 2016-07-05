function initFilter(originData, heatMapTable) {
	var valueTofiltersListID = {"Microarray": "MicroArrayFilter", "EST": "ESTFilter", "IHC": "IHCFilter"}
    for (var value in valueTofiltersListID) {
        $("#" + valueTofiltersListID[value]).click((function(value) {
            return function() {
                var valueDict = {};
                var isFilter = false;
                for (var key in valueTofiltersListID) {
                    if ($("#" + valueTofiltersListID[key]).is(':checked')) {
                        valueDict[key] = true;
                        isFilter = true;
                    }
                }

                if (isFilter) {
                    data = filterByEvidences(originData, valueDict);
                } else {
                    data = originData;
                }

                heatMapTable.showLoadingStatus();
                heatMapTable.loadJSONData(data);
				heatMapTable.show();
				heatMapTable.hideLoadingStatus();
            }
        })(value));
    }
}	

function filterByEvidences(data, evidencesDict) {
    var newDataList = [];

    for (var i = 0; i < data.length; i++) {
        var curNewData = {};
        for (var key in data[i]) {
            curNewData[key] = data[i][key];
        }

        curNewData.detailData = [];
        curNewData.childrenHTML = null;
        curNewData.html = null;
        for (var j = 0; j < data[i].detailData.length; j++) {
        	for (var value in evidencesDict) {
        		if (data[i].detailData[j].evidenceCodeName.toLowerCase() === value.toLowerCase()) {
        			curNewData.detailData.push(data[i].detailData[j]);
        		}
        	}
        }

        if (data[i].children && data[i].children.length !== 0) {
            var newChildren = filterByEvidences(data[i].children, evidencesDict);
            if (newChildren.length !== 0) {
                curNewData.children = newChildren;
            } else {
                curNewData.children = [];
            }
        }

        if (curNewData.children && curNewData.children.length !== 0) {
            newDataList.push(curNewData);
        } else if (curNewData.detailData.length !== 0) {
        	newDataList.push(curNewData);
        }
    }
    return newDataList;
}