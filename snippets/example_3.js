headerTemplateSrc = 
    '<div style="overflow:hidden">\
        {{#each header}}\
          {{#createHeader this}}\
           <div class="heatmap-column {{columnClass}}" style="width: {{columnWidth}};text-align:center;font-weight:600;font-size:1.2em;">\
               {{columnName}}\
           </div>\
          {{/createHeader}}\
        {{/each}}\
      </div>';

detailTemplateSrc = 
    '<div class="evidence-block">\
      <div class="evidence-line">\
         <div class="evidenceArrow">⤵</div>\
         <span class="evidence-index">Evidence {{@index}}</span>\
         <span class="evidence-code">{{evidenceCodeName}}</span>\
         <span class="evidence-source">{{resourceDb}}</span>\
      </div>\
      <div class="evidence-detail"><span class="evidence-intensity">INTENSITY</span> <strong>{{intensity}}</strong></div>\
      <div class="evidence-detail"><span class="evidence-origin">Subject Protein Origin</span> <strong>{{origin}}</strong></div>\
      <div class="evidence-detail"><span class="evidence-quality">QUALITY</span> <strong>{{quality}}</strong></div>\
      <div class="evidence-detail"><span class="evidence-note">Note</span> <strong>{{note}}</strong></div>\
      <div class="evidence-link"><a href="{{resourceLink}}">{{resourceAccession}}</a>\
      </div>\
    </div>';

formTemplate = '<div>\
        <h3 class="filter-title second-title">{{total}} PHENOTYPES <span id="count-phenotype-selected">({{total}} selected)</span></h3> {{#each annotations}} {{#if name}}\
        <div id="panel{{@index}}" class="panel-group">\
            <div class="panel panel-default">\
                <div class="panel-heading">\
                    <a class="select-all pull-left" referTo="#collapse{{@index}}">All <i class="fa fa-check" aria-hidden="true"></i></a>\
                    <a class="collapse-title collapsed" data-toggle="collapse" href="#collapse{{@index}}">\
                        <div class="panel-title">\
                            <span class="chevron pull-right"><i class="fa"></i></span> {{{badge}}}\
                            <span class="typeName">{{name}}</span>\
                            <span class="badge phenoCount pull-right">{{count}} phenotypes</span>\
                        </div>\
                    </a>\
                </div>\
                <div id="collapse{{@index}}" class="panel-collapse collapse">\
                    <ul class="list-group subtypes">\
                        {{#data}}\
                        <li class="list-group-item"><a class="active"><i class="fa fa-check" aria-hidden="true"></i><span class="phenAnnot">{{phenotype}}</span> <span class="badge phenoCount pull-right">{{count}} variants</span></a>\
                        </li>\
                        {{/data}}\
                    </ul>\
                </div>\
            </div>\
        </div>\
        {{/if}} {{/each}}\
    </div>';

Handlebars.registerHelper('createHeader', function (columnName, block) { 
        var result = {}; 
        result.columnWidth = "160px"; 
        result.columnName = columnName; 
        return block.fn(result); 
    }); 


//NX DATA PARSING UTILS


function hashingNormalAnnotations(type) {
    var hashNormalAnnotation = {};
    for (var a in type) {
        //                if (a !== "phenotype"){
        var annotations = type[a];
        annotations.forEach(function (a) {
                hashNormalAnnotation[a.annotationHash] = a;
            })
            //                }
    }
    return hashNormalAnnotation;
}

function getMinPos(subjects) {
    var min = 100000;
    subjects.forEach(function (s) {
        var pos = s.locationBegin;
        if (min > pos) min = pos;
    })
    return min;
}

function sortPhenotypesByPosition(a, b) {
    var minPosA = getMinPos(a.subjectComponents);
    var minPosB = getMinPos(b.subjectComponents);
    return minPosA - minPosB;
}

function getListAnnotRef(phenotypes) {
    var list = [];
    for (var p in phenotypes) {
        var distincts = [];
        phenotypes[p]["modification-effect"].forEach(function (a) {
            if (distincts.indexOf(a.bioObject.annotationHash) === -1) {
                distincts.push(a.bioObject.annotationHash);
                list.push(a.bioObject.annotationHash);
            }
        })
    };
    return list;
}

function getAllAnnotationTypes(annots, phenotypes) {
    //            console.log("phenotypes");
    //            console.log(phenotypes);
    var listAnnotRef = getListAnnotRef(phenotypes);
    //            console.log("listAnnotRef");
    //            console.log(listAnnotRef);
    //            console.log("annots");
    //            console.log(annots);
    var listingPhenotype = {
        "annotations": {
            "GO_MOLECULAR_FUNCTION": {},
            "GO_BIOLOGICAL_PROCESS": {},
            "GO_CELLULAR_COMPONENT": {},
            "BINARY_INTERACTION": {},
            "PROTEIN_PROPERTY": {},
            "SMALL_MOLECULE_INTERACTION": {}
        },
        "total": 0
    };
    //            var listingPhenotype = {};
    console.log("JON SNOW");
    console.log(annots);
    console.log(phenotypes);
    //            console.log(annots);
    listAnnotRef.forEach(function (a) {
        if (annots.hasOwnProperty(a)) {
            if (!listingPhenotype.annotations.hasOwnProperty(annots[a].apicategory)) {
                console.warn("couldn't find the api category : " + annots[a].apicategory);
            }
            if (jQuery.isEmptyObject(listingPhenotype.annotations[annots[a].apicategory])) {
                listingPhenotype.annotations[annots[a].apicategory] = {
                    badge: annotTypeTemplate[annots[a].apicategory],
                    name: annotTypeDescription[annots[a].apicategory],
                    count: 0,
                    data: {}
                };
            }
            if (annots[a].category === 'BinaryInteraction' || annots[a].category === "SmallMoleculeInteraction") {
                if (annots[a].category === "SmallMoleculeInteraction") {
                    console.log("HODOR");
                    console.log(annots[a]);
                }

                var pheno = annots[a].bioObject.accession;
                //                        console.log(annots[a]);
            } else {
                var pheno = annots[a].cvTermName;
            }
            if (listingPhenotype.annotations[annots[a].apicategory].data.hasOwnProperty(pheno)) {
                listingPhenotype.annotations[annots[a].apicategory].data[pheno].count += 1;
                //                        listingPhenotype.total += 1;
            } else {
                listingPhenotype.annotations[annots[a].apicategory].data[pheno] = {
                    "phenotype": pheno,
                    "count": 1
                };
                //                        listingPhenotype.total += 1;
            }
        }
    });
    for (var type in listingPhenotype.annotations) {
        if (!jQuery.isEmptyObject(listingPhenotype.annotations[type])) {
            listingPhenotype.annotations[type].count = Object.keys(listingPhenotype.annotations[type].data).length;
            listingPhenotype.total += Object.keys(listingPhenotype.annotations[type].data).length;
        }
        var sortedData = [];
        for (var a in listingPhenotype.annotations[type].data) {
            sortedData.push(listingPhenotype.annotations[type].data[a]);
        }
        console.log("Daenerys");
        console.log(sortedData);
        sortedData.sort(function (a, b) {
            if (a.count < b.count) return 1;
            if (a.count > b.count) return -1;
            if (a["modification-effect"] < b["modification-effect"]) return -1;
            if (a["modification-effect"] > b["modification-effect"]) return 1;
            return 0;
        })
        listingPhenotype.annotations[type].data = sortedData;
    }
    //            var secArr = listingPhenotype.annotations.map(function(a){return a});
    //            console.log("Daenerys");
    //            console.log(secArr);
    //console.log("listingPhenotype");
    //console.log(listingPhenotype);
    return listingPhenotype;
}


function getVariantInfos(annots, variants) {

    var variantInfos = {
        fullName: "",
        evidences: []
    };
    var subjectName = "";
    var varList = variants.map(function (id, i, array) {
        //Only get the first position, dont check if there is others isoforms
        var v = annots[id];
        var pos = v.locationBegin;
        var original = v.variant.original;
        var variant = v.variant.variant;
        var hgvs = v.annotationName;
        //                var evidences = v.evidences.map(function(e){
        //                    return {
        //                        evidenceCodeName : e.evidenceCodeName,
        //                        resourceDb : e.resourceDb,
        //                        resourceAccession : e.resourceAccession
        //                    }
        //                })
        return {
            pos: pos,
            original: original,
            variant: variant,
            hgvs : hgvs
                //                    evidences: evidences
        };
    });
    varList.sort(function (a, b) {
        return a.pos - b.pos
    });

    varList.forEach(function (v, i, array) {
        var variantAA = v.variant === "-" ? "del" : v.variant;
        var name = "<span class='varDisplay'><span class='varPos'>" + v.pos + "</span><span class='varSeq'>" + v.original + " → " + variantAA + "</span><a href='#' class='varHGVS'>" + v.hgvs + "</a></span>";
        if (i < array.length - 1) name += " ";
        variantInfos.fullName += name;
        //                variantInfos.evidences = variantInfos.evidences.concat(v.evidences);
    })
    return variantInfos;
}

function getAnnotationById(annotations, id) {
    if (annotations.hasOwnProperty(id)) {
        return {
            category: annotations[id].apicategory,
            cvTermName: annotations[id].apicategory === "BINARY_INTERACTION" || annotations[id].apicategory === "SMALL_MOLECULE_INTERACTION" ? annotations[id].bioObject.accession : annotations[id].cvTermName
        }
    } else console.warn("couldn't find normal annotation " + id);
}

function generateEvidence(evList) {
    var evidences = [];
    //            var count = Math.floor((Math.random() * 3));
    //            for (var i = 0; i < count; i++) {
    for (ev in evList) {
        //console.log("Baratheon");
        //console.log(evList[ev].intensity);
//                if (evList[ev].intensity !== "NA") {
            var ev = {
                evidenceCodeName: evList[ev].evidenceCodeName,
                resourceDb: "neXtProt",
                resourceAccession: evList[ev].sourceAccession_TODEBUG,
                resourceLink: "https://gauss.isb-sib.ch/bioeditor/annotations#query="+evList[ev].sourceAccession_TODEBUG,
                intensity: evList[ev].intensity,
                note: evList[ev].note,
                quality: evList[ev].qualityQualifier,
                origin: evList[ev].subjectProteinOrigin,
                
            }
            evidences.push(ev);
//                }
    }
    return evidences;
}

function getWorstIntensity(list) {
    var worst = "";
    var intensityRange = ["", "no-impact", "NA", "normal", "mild", "moderate", "severe"];
    list.forEach(function (i) {
        if (intensityRange.indexOf(i.toLowerCase()) > intensityRange.indexOf(worst)) {
            worst = i.toLowerCase();
        }
    })
    return worst;
}

function getImpact(impacts, annots, template, filters) {
    var listPhenotypes = [];
    var fakeEvidences = []
    impacts.forEach(function (i) {
        var category = i.category;
        var cvTermName = i.cvTermName.toLowerCase();
        var intensityList = i.evidences.map(function (e) {
            if (!e.intensity) return "NA";
            return e.intensity
        });
        //                console.log("Sansa");
        //                console.log(i);

        var worstIntensity = getWorstIntensity(intensityList);
        var annotationAffected = getAnnotationById(annots, i.bioObject.annotationHash);
        if (!filters || filters.indexOf(annotationAffected.cvTermName) !== -1) {
            var customTemplate = jQuery.extend(true, {}, template);
            //                    DEPRECATED
            //                    customTemplate.rowLabel = "<strong>" + cvTermToSentence[cvTermName] + "</strong> " + annotationAffected.cvTermName + " " + annotTypeTemplate[annotationAffected.category];
            customTemplate.rowLabel = "<strong>" + i.description + "</strong> " + annotTypeTemplate[annotationAffected.category];
            customTemplate.values[0] = cvTermName !== "no-impact" ? worstIntensity : "no-impact";
            customTemplate.detailData = generateEvidence(i.evidences);
            listPhenotypes.push(customTemplate);
        }
    })
    return listPhenotypes;
}

function propagateImpact(children) {
    var values = ["", ""];
    for (var c in children) {
        if (children[c].values[1] !== "") {
            values[1] = "impact";
            return values;
        }
    }
    values[0] = "no-impact";
    return values;
}


function parseNxDataForTreeTable(phenotypes, annotations, template, filters) {
    //            console.log('phenotypes');
    //            console.log(phenotypes);
    var treeTable = [];
    
    for (var a in phenotypes) {
        var p = phenotypes[a];
        //                phenotypes[a].phenotype.forEach(function (p) {
        var varTemplate = jQuery.extend(true, {}, template);
        varTemplate.children = getImpact(p["modification-effect"], annotations, template, filters);
        if (varTemplate.children.length) {
            //Since phenotypes are grouped by subject, simply take the first one
            var varInfos = getVariantInfos(annotations, p["modification-effect"][0].subjectComponents);
            var intensityList = varTemplate.children.map(function (c) {
                return c.values[0]
            });
            varTemplate.rowLabel = varInfos.fullName;
            varTemplate.detailData = varInfos.evidences;
            varTemplate.values[0] = getWorstIntensity(intensityList);
            treeTable.push(varTemplate);
        }
        //                })
    }

    return treeTable;
}

function addSelectAll() {
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

function fillFilters(data) {
    var source = formTemplate;
    // var source = $("#form-template").html();
    var template = Handlebars.compile(source);
    var html = template(data);
    $(".filters").html(html);
    $(".subtypes a").click(function () {
        $(this).toggleClass("active");
        $("i", this).toggleClass("fa-circle-thin fa-check");
    })
    addSelectAll();
}

function getFilters() {
    var filters = [];
    $(".filters .subtypes a").each(function () {
        //                console.log("one");
        if ($(this).hasClass("active")) {
            var uniqueFilter = $(this).find(".phenAnnot").text();
            filters.push(uniqueFilter);
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

function activateFilters(data, annots, listingPhenotypes) {
    $(".filters a:not(.collapse-title)").click(function () {
        var filters = getFilters();
        //console.log("Tyrion");
        //                console.log(filters);
        $("#count-phenotype-selected").text("(" + filters.length + " selected)");

        autoCheckAll($(this));

        resetTreeViewer(data, annots, listingPhenotypes, filters);
    })
}

function countVariants(data) {
    var count = 0;
    //console.log("LANNISTER");
    //            console.log(data);
    data.forEach(function (d) {
        count += d.children.length;
    })
    $("#count-pheno").text(count);
    $("#count-variant-selected").text(data.length);
}

function countPhenotypes(phenotypeList, filters) {
    var count = 0;
    console.log("Sir Davos");
    //            console.log(phenotypeList);
    for (var type in phenotypeList.annotations) {
        for (var phen in phenotypeList.annotations[type].data) {
            if (filters.indexOf(phen) !== -1) {
                count += phenotypeList.annotations[type].data[phen];
            }
        }
    }

    $("#count-phenotype-selected").text("(" + count + " selected)");
}

var nx = new Nextprot.Client("neXtProt proteomics view", "Calipho-Team");
if (nx.getEnvironment() !== "bed") {
    nx.setApiBaseUrl("http://bed-api.nextprot.org");
    // nx.setApiBaseUrl("http://localhost:8080/nextprot-api-web");
}



//        function changeGoldParam(gold){
//            var url = window.location.href;
//            
//            // If key exists updates the value
//            if (url.indexOf('goldOnly=') > -1) {
//                url = url.replace('goldOnly='+!gold, 'goldOnly='+gold);
//
//            // If not, append
//            } else {
//                if (url.indexOf('?') > -1) url = url + '&goldOnly='+gold;
//                else url = url + '?goldOnly='+gold;
//            }
//            
//            return url;
//        }
//
//        
//        $("body").prepend('<div class="qualityToggle pull-right">\
//            <ul class="nav nav-pills">\
//                <li role="presentation" id="quality-gold"><a href=' + changeGoldParam(true) + '>GOLD</a></li>\
//                <li role="presentation" id="quality-goldAndSilver"><a href=' + changeGoldParam(false) +'>GOLD & SILVER</a></li>\
//            </ul>\
//        </div>');
//        
//        var goldOnly = nx.getQualityParam();
//        console.log("goldOnly");
//        console.log(goldOnly);
//        
//        if (goldOnly === "true") {
//            $("#quality-gold").addClass("active");
//            $("#quality-goldAndSilver").removeClass("active");
//        }
//        else{
//            $("#quality-goldAndSilver").addClass("active");
//            $("#quality-gold").removeClass("active");
//        }


var entry = 'NX_Q15858-2';
console.log(entry);

var heatmapTableOptions0 = {
    valuesSetting: [

        {
            value: 'severe',
//                    html: '<div>\
//                              <img style="width:15px" src="http://www.downtowntomsriver.com/chili/images/chili_icon.gif">\
//                              <img style="width:15px" src="http://www.downtowntomsriver.com/chili/images/chili_icon.gif">\
//                              <img style="width:15px" src="http://www.downtowntomsriver.com/chili/images/chili_icon.gif">\
//                              <img style="width:15px" src="http://www.downtowntomsriver.com/chili/images/chili_icon.gif">\
//                          </div>',
            html: '<div class="progress">\
              <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"\ style="width: 100%"> Severe\
                <span class="sr-only">20% Complete</span>\
              </div>\
            </div>',
            filterID: ["positiveFilter"]
        },
        {
            value: 'moderate',
//                    html: '<div>\
//                              <img style="width:15px" src="http://www.downtowntomsriver.com/chili/images/chili_icon.gif">\
//                              <img style="width:15px" src="http://www.downtowntomsriver.com/chili/images/chili_icon.gif">\
//                              <img style="width:15px" src="http://www.downtowntomsriver.com/chili/images/chili_icon.gif">\
//                          </div>',
            html: '<div class="progress">\
              <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"\ style="width: 70%"> Moderate\
                <span class="sr-only">20% Complete</span>\
              </div>\
            </div>',
            filterID: ["positiveFilter"]
        },
        {
            value: 'mild',
//                    html: '<div>\
//                              <img style="width:15px" src="http://www.downtowntomsriver.com/chili/images/chili_icon.gif">\
//                              <img style="width:15px" src="http://www.downtowntomsriver.com/chili/images/chili_icon.gif">\
//                          </div>',
            html: '<div class="progress">\
              <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"\ style="width: 40%"> Mild\
                <span class="sr-only">20% Complete</span>\
              </div>\
            </div>',
            filterID: ["positiveFilter"]
        },
        {
            value: 'normal',
//                    html: '<div>\
//                              <img style="width:15px" src="http://www.downtowntomsriver.com/chili/images/chili_icon.gif">\
//                          </div>',
            html: '<div class="progress">\
              <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"\ style="width: 10%"> Normal\
                <span class="sr-only">20% Complete</span>\
              </div>\
            </div>',
            filterID: ["positiveFilter"]
        },
        {
            value: 'no-impact',
//                    html: '<div>\
//                              <img style="width:15px" src="http://www.urdu-english.com/images/lessons/beginner/vegetables/vegetable-pics/chilli.png">\
//                          </div>',
            html: '<div class="progress">\
              <div class="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"\ style="width: 100%;background-color:transparent;box-shadow:none;color:#aaa"> No impact\
                <span class="sr-only">20% Complete</span>\
              </div>\
            </div>',
            filterID: ["positiveFilter"]
        },
        {
            value: 'NA',
            color: '#1effff',
            filterID: ["positiveFilter"]
        }
    ],
    columnWidth: "160px",
    detailTemplateSrc: detailTemplateSrc,
    headerTemplateSrc: headerTemplateSrc,
    headerTemplateData: {
        header: ['IMPACT']
    },
    extractTypeaheadStrCallBack: function(node) {
        return $(node).text();
    }
}

var cvTermToSentence = {
    "impact": "has impact on",
    "no-impact": "has no impact on",
    "decrease": "decreases",
    "increase": "increases",
    "gain": "gains"
}

var annotTypeTemplate = {
    "GO_MOLECULAR_FUNCTION": "<span class='badge gmf' data-toggle='tooltip' data-placement='top' title='Go Molecular Function'>GO-MF</span>",
    "GO_CELLULAR_COMPONENT": "<span class='badge gcc' data-toggle='tooltip' data-placement='top' title='Go Cellular Component'>GO-CC</span>",
    "PROTEIN_PROPERTY": "<span class='badge gcc' data-toggle='tooltip' data-placement='top' title='Protein Property'>PP</span>",
    "GO_BIOLOGICAL_PROCESS": "<span class='badge gbp' data-toggle='tooltip' data-placement='top' title='Go Biological process'>GO-BP</span>",
    "BINARY_INTERACTION": "<span class='badge pp' data-toggle='tooltip' data-placement='top' title='Binary Interaction' style='z-index:30'>BI</span>",
    "SMALL_MOLECULE_INTERACTION": "<span class='badge smi' data-toggle='tooltip' data-placement='top' title='Small Molecule Interaction'>SMI</span>",
    "MAMMALIAN_PHENOTYPE": "<span class='badge smi' data-toggle='tooltip' data-placement='top' title='Mammalian Phenotype'>MP</span>"
}
var annotTypeDescription = {
    "GO_MOLECULAR_FUNCTION": "Impact on molecular function",
    "GO_CELLULAR_COMPONENT": "Impact on cellular component",
    "PROTEIN_PROPERTY":  "Impact on protein property",
    "GO_BIOLOGICAL_PROCESS": "Impact on biological process",
    "BINARY_INTERACTION": "Impact on binary interaction",
    "SMALL_MOLECULE_INTERACTION": "Impact on small molecule interaction",
    "MAMMALIAN_PHENOTYPE": "Associated with mammlian phenotype"
}


var template = {
    "rowLabel": "",
    "linkLabel": "",
    "linkURL": "",
    "values": [""],
    "children": []
};

function resetTreeViewer(data, annots, listingPhenotypes, filters) {
    $("#heatmap-table0").html("");
    // parse Data to fit the template of treeData - WITH FILTERS
    var treeDataFiltered = parseNxDataForTreeTable(data, annots, template, filters);

    // add count box - WITH FILTERS ON
    //            countPhenotypes(listingPhenotypes, filters);
    countVariants(treeDataFiltered);

    var heatMapTable0 = new HeatMapTable({
        tableID: "heatmap-table0",
        options: heatmapTableOptions0
    });

    heatMapTable0.loadJSONData(treeDataFiltered);
    heatMapTable0.show();

    $('[data-toggle="tooltip"]').tooltip();
    //            addIconToButton();
}

//        function addIconToButton(){
//            
//            var wait = setInterval(function(){ searchElem() }, 50);
//            
//            function searchElem(){
//                var elem = $("#heatmap-table0 .heatmap-reset-btn");
//                if ($(elem).length>0) {
//                    $(".heatmap-filterByRowName-search").prepend('<span class="fa fa-search treeBtn" aria-hidden="true"></span>');
//                    $(".heatmap-reset-btn").prepend('<span class="fa fa-refresh treeBtn" aria-hidden="true"></span>');
//                    $(".heatmap-collapseAll-btn").prepend('<span class="fa fa-compress treeBtn" aria-hidden="true"></span>');
//                    $(".heatmap-expandAll-btn").prepend('<span class="fa fa-expand treeBtn" aria-hidden="true"></span>');
//                    console.log("clearInterval");
//                    clearInterval(wait);
//                }
//            }
//        }

// nx.getFullAnnotationsByCategory(entry, "proteoform").then(function (data) {
           // jQuery.getJSON("../modified-entry-annotation.json", function(temp){
    jQuery.getJSON("https://cdn.rawgit.com/calipho-sib/hierarchic-heatmap-table-component/v0.0.7/data/proteoform.json", function(temp){
               var data = temp.entry;
    console.log("data");
    console.log(data);

    // Transform annotations into hashMap to ease the access by id
    var normalAnnotations = hashingNormalAnnotations(data.annotationsByIsoformAndCategory[entry]);

    // Sort phenotypes by smallest position
    //            var filterPhenotypes = 

    //REPLACE MODIFIED ISOFORM ANNOTATIONS OBJECT WITH ARRAY !!!!!!!! T_T

    var phenoArray = [];
    for (var v in data.proteoformAnnotations) {
        
        var newArrayElem = data.proteoformAnnotations[v];
//                var newArrayElem;
//                if (onlyGold){
//                    newArrayElem = nx.filterGoldOnlyAnnotations(data.modifiedIsoformAnnotations[v]);
//                }
//                else {
//                    newArrayElem = data.modifiedIsoformAnnotations[v];
//                }
        phenoArray.push(data.proteoformAnnotations[v]);
    }

    phenoArray.sort(function (a, b) {
        var sbjA = a["modification-effect"][0].subjectComponents.map(function (s) {
            return normalAnnotations[s]
        });
        var sbjB = b["modification-effect"][0].subjectComponents.map(function (s) {
            return normalAnnotations[s]
        });
        var minPosA = getMinPos(sbjA);
        var minPosB = getMinPos(sbjB);
        return minPosA - minPosB;
    });
    //console.log("Arya");
    //console.log(phenoArray);
    var phenotypes = {};

    phenoArray.forEach(function (p) {
        phenotypes[p["modification-effect"][0].subjectName] = p;
    });

    //console.log("Brann");
    //console.log(phenotypes);
    // Get all phenotypes by type in order to add them into the filter block
    var listingPhenotypes = getAllAnnotationTypes(normalAnnotations, phenotypes);
    fillFilters(listingPhenotypes);

    // parse Data to fit the template of treeData
    var treeData = parseNxDataForTreeTable(phenotypes, normalAnnotations, template);

    // add count box

    $("#count-variant").text(treeData.length);
    countVariants(treeData);

    activateFilters(phenotypes, normalAnnotations, listingPhenotypes);

    //console.log("treeData");
    //console.log(treeData);

    var heatMapTable0 = new HeatMapTable({
        tableID: "heatmap-table0",
        options: heatmapTableOptions0
    });

    
    console.log("treeData");
    console.log(treeData);
    console.log(heatmapTableOptions0);
    console.log(heatMapTable0);
    heatMapTable0.loadJSONData(treeData);
    heatMapTable0.show();

    $('[data-toggle="tooltip"]').tooltip();

})