function activateFilters(heatmapData, heatMapTable) {
    $(".filters a:not(.collapse-title)").click(function () {
        var filters = getFilters();
        console.log(filters);
        autoCheckAll($(this));

        var data = filterByEvidences(heatmapData, filters)

        heatMapTable.showLoadingStatus();
        heatMapTable.loadJSONData(data);
        heatMapTable.show();
        heatMapTable.hideLoadingStatus();
    })
}

function addSelectAll() {
        $(".subtypes a").click(function () {
            $(this).toggleClass("active");
            $("i", this).toggleClass("fa-circle-thin fa-check");
        })

        $(".select-all").click(function () {
            $("i", this).toggleClass("fa-circle-thin fa-check");
            var matchingList = $(this).attr("referTo");
            if ($("i", this).hasClass("fa-check")) {
                $(matchingList + " a").each(function () {
                    if (!$(this).hasClass("active")) {
                        $(this).addClass("active");
                        $("i", this).toggleClass("fa-circle-thin fa-check");
                    }

                })
            } else {
                $(matchingList + " a").each(function () {
                    if ($(this).hasClass("active")) {
                        $(this).removeClass("active");
                        $("i", this).toggleClass("fa-circle-thin fa-check");
                    }

                })
            }
        })
}

function getFilters() {
    var filters = {};
    filters['Microarray'] = []
    filters['IHC'] = []
    filters['EST'] = []
    $(".filters .subtypes a").each(function () {
        if ($(this).hasClass("active")) {
            var type = $(this).find(".phenAnnot").attr('type');
            var value = $(this).find(".phenAnnot").attr('value');
            filters[type].push(value);
        }
    });
    return filters;
}

function autoCheckAll(elem) {
    var panel = $(elem).closest(".panel-group");
    var all = panel.find(".select-all i");
    var activeFilters = panel.find(".subtypes a.active");
    if (!activeFilters.length && all.hasClass("fa-check")) {
        all.toggleClass("fa-circle-thin fa-check");
    } else if (activeFilters.length === panel.find(".subtypes a").length) {
        if (all.hasClass("fa-circle-thin")) {
            all.toggleClass("fa-circle-thin fa-check");
        }
    }
}

function filterByEvidences(data, filters) {
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
            evidencesCodeName = data[i].detailData[j].evidenceCodeName;
            value = data[i].detailData[j].value;
            isFilterThisType = false;
            for (var k = 0; k < filters[evidencesCodeName].length; k++) {
                if (filters[evidencesCodeName][k] === 'true') isFilterThisType = true
            }
            if (isFilterThisType) {
                for (var k = 0; k < filters[evidencesCodeName].length; k++) {
                    if (filters[evidencesCodeName][k] === value) {
                        curNewData.detailData.push(data[i].detailData[j]);
                        break
                    }
                }
            }
        }

        if (data[i].children && data[i].children.length !== 0) {
            var newChildren = filterByEvidences(data[i].children, filters);
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
