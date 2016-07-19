function activateFilters(heatmapData, heatMapTable) {
    $(".filters a:not(.collapse-title)").click(function () {
        $(this).toggleClass("active");
        $("i", this).toggleClass("fa-circle-thin fa-check");
        if ($(this).find(".phenAnnot").attr('type') == "Microarray" ||
            $(this).find(".phenAnnot").attr('type') == "IHC" ||
            $(this).find(".phenAnnot").attr('type') == "EST" ) {
            resetFilterStatus(heatmapData, heatMapTable);
        }
        clickEvent(heatmapData, heatMapTable);
    });
}

function clickEvent(heatmapData, heatMapTable) {
    var filters = getFilters();
    // autoCheckAll($(this));

    var filteredData = filterByEvidences(heatmapData, filters)
    heatMapTable.showLoadingStatus();
    heatMapTable.loadJSONData(filteredData);
    heatMapTable.show();
    heatMapTable.hideLoadingStatus();
}

function resetFilterStatus(heatmapData, heatMapTable) {
    var filters = {};
    filters['Microarray'] = false;
    filters['IHC'] = false;
    filters['EST'] = false;
    $(".filters .methodology a").each(function () {
        if ($(this).hasClass("active")) {
            var type = $(this).find(".phenAnnot").attr('type');
            filters[type] = true;
        }
    });
    // unable
    $(".filters .subtypes-values a").each(function() {
        $(this).unbind("click");
        $(this).css("cursor", "default");
        if ($("i", this).hasClass("fa-check")) {
            $("i", this).toggleClass("fa-circle-thin fa-check");
        }
        if ($(this).hasClass("clickable")) {
            $(this).toggleClass("clickable unclickable");
        }
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    //enable
    if (filters['Microarray']) {
        $(".filters .subtypes-values a").each(function() {
            if ($(this).find(".phenAnnot").attr('value') == "NotDetected" ||
                $(this).find(".phenAnnot").attr('value') == "Positive") {
                $(this).css("cursor", "pointer");
                if ($(this).hasClass("unclickable")) {
                    $(this).toggleClass("clickable unclickable");
                }
                if ($("i", this).hasClass("fa-circle-thin")) {
                    $("i", this).toggleClass("fa-circle-thin fa-check");
                }
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");
                }
                $(this).unbind("click");
                $(this).click(function() {
                    $(this).toggleClass("active");
                    $("i", this).toggleClass("fa-circle-thin fa-check");
                    clickEvent(heatmapData, heatMapTable);
                });
            }
        });
    }

    if (filters['EST']) {
        $(".filters .subtypes-values a").each(function() {
            if ($(this).find(".phenAnnot").attr('value') == "Positive") {
                $(this).css("cursor", "pointer");
                if ($(this).hasClass("unclickable")) {
                    $(this).toggleClass("clickable unclickable");
                }
                if ($("i", this).hasClass("fa-circle-thin")) {
                    $("i", this).toggleClass("fa-circle-thin fa-check");
                }
                $(this).unbind("click");
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");
                }
                $(this).click(function() {
                    $(this).toggleClass("active");
                    $("i", this).toggleClass("fa-circle-thin fa-check");
                    clickEvent(heatmapData, heatMapTable);
                });
            }
        });
    }

    if (filters['IHC']) {
        $(".filters .subtypes-values a").each(function() {
            if ($(this).find(".phenAnnot").attr('value') == "Positive" ||
                $(this).find(".phenAnnot").attr('value') == "NotDetected" ||
                $(this).find(".phenAnnot").attr('value') == "High" ||
                $(this).find(".phenAnnot").attr('value') == "Medium" ||
                $(this).find(".phenAnnot").attr('value') == "Low") {
                $(this).css("cursor", "pointer");
                if ($(this).hasClass("unclickable")) {
                    $(this).toggleClass("clickable unclickable");
                }
                if ($("i", this).hasClass("fa-circle-thin")) {
                    $("i", this).toggleClass("fa-circle-thin fa-check");
                }
                $(this).unbind("click");
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");
                }
                $(this).click(function() {
                    $(this).toggleClass("active");
                    $("i", this).toggleClass("fa-circle-thin fa-check");
                    clickEvent(heatmapData, heatMapTable);
                });
            }
        });
    }
}

function addSelectAll() {
    // $(".subtypes-values a").click(function () {
    //     $(this).toggleClass("active");
    //     $("i", this).toggleClass("fa-circle-thin fa-check");
    // })

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
    $(".filters .methodology a").each(function () {
        if ($(this).hasClass("active")) {
            var type = $(this).find(".phenAnnot").attr('type');
            // filters[type] = [];
            filters[type].push(true);
        }
    });
    $(".filters .subtypes-values a").each(function () {
        if ($(this).hasClass("active")) {
            var value = $(this).find(".phenAnnot").attr('value');
            for (var type in filters) {
                filters[type].push(value);
            }
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

function autoUnCheckAll(elem) {
    var panel = $(elem).closest(".panel-group");
    var all = panel.find(".select-all i");
    var activeFilters = panel.find(".subtypes-values a.active");
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
                if (filters[evidencesCodeName][k] === true) isFilterThisType = true
            }
            if (isFilterThisType) {
                for (var k = 0; k < filters[evidencesCodeName].length; k++) {
                    if (filters[evidencesCodeName][k] === value ||
                            (
                                filters[evidencesCodeName][k] === "Positive" && 
                                (value === "High" || value === "Medium" || value === "Low")
                            )
                        ) {
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

