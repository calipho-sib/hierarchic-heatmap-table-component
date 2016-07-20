;(function(global) {

    'use strict';

    var HeatMapTable = function(argv) { 
        return new HeatMapTable.init(argv);
    }

    HeatMapTable.prototype = {

        initHandlebars : function() {
            var self = this;
            //Share template for recursively generate children
            Handlebars.registerPartial('create-children', HBtemplates['templates/heatmap-tree.tmpl']);

            Handlebars.registerHelper('createRow', function(data) {
                var rowTemplate = HBtemplates['templates/heatmap-row.tmpl']
                
                var iconHtml = null;
                var result = {};
                result.rowLabel = data.rowLabel;
                result.linkURL = data.linkURL;
                result.linkLabel = data.linkLabel;

                if (data.children.length > 0 || (data.detailData && data.detailData.length > 0)) {
                    result.iconHtml = '<span class="glyphicon glyphicon-plus"></span>';
                } else {
                    result.class = "heatmap-no-cursor";
                    result.iconHtml ='<span class="glyphicon glyphicon-record"></span>';
                }
                return new Handlebars.SafeString(rowTemplate(result));
            }); 

            Handlebars.registerHelper('showValue', function(value, block) {
                var accum = '';

                var valueTemplate = HBtemplates['templates/heatmap-value.tmpl'];
                var circleTemplate = HBtemplates['templates/heatmap-circle.tmpl'];

                var result = {};

                result.columnWidth = self.columnWidth;
                if (self.valueToStyle[value]) {
                    if (self.valueToStyle[value].cssClass) {
                        result.circleColorClass = self.valueToStyle[value].cssClass;
                    } else if (self.valueToStyle[value].color) {
                        result.circleColorStyle = self.valueToStyle[value].color;
                    } else if (self.valueToStyle[value].html) {
                        result.valueStyle = self.valueToStyle[value].html;
                        return new Handlebars.SafeString(valueTemplate(result));
                    } else {
                        result.circleColorStyle = "black";
                        return new Handlebars.SafeString(valueTemplate(result));
                    }
                } else {
                    return new Handlebars.SafeString(valueTemplate(result));
                }

                result.valueStyle = circleTemplate(result);

                return new Handlebars.SafeString(valueTemplate(result));
            });

            Handlebars.registerHelper('addDetail', function(detailData) {
                return new Handlebars.SafeString(self.detailTemplate(detailData));
            });

           Handlebars.registerHelper('heatmapCreateHeader', function() {
                if (self.headerTemplate) {
                    return new Handlebars.SafeString(self.headerTemplate(self.headerTemplateData));
                }
            });
        },

        showHeatmapBody: function() {
            $(this.heatmapTable).find(".heatmap-body").remove();

            if (this.heatmapBody) {
                $(this.heatmapTable).append(this.heatmapBody);
            } else {
                var template = HBtemplates['templates/heatmap-body.tmpl'];
                this.heatmapBody = template();
                $(this.heatmapTable).append(this.heatmapBody);
            }
        },

        showHeatmapSkeleton: function() {
            var template = HBtemplates['templates/heatmap-skeleton.tmpl'];
            $(this.heatmapTable).append(template());
        },

        showHeatmapRows : function() {
            var self = this;

            this.showLoadingStatus();

            $(this.heatmapTable).find(".heatmap-rows").empty()
            // if (isReset && this.heatmapRowsHTML) {

            //     $(this.heatmapTable).find(".heatmap-body").append(this.heatmapRowsHTML.clone());

            // } else {
           
                var heatmapRowsHTML = $('<ul class="tree heatmap-ul heatmap-rows"></ul>');
                for (var i = 0; i < this.data.length; i++) {
                    var row = this.createRow(this.data[i]);
                    heatmapRowsHTML.append(row);
                }

                // $(this.heatmapTable).find(".heatmap-body").append(heatmapRowsHTML.clone());
                $(this.heatmapTable).find(".heatmap-body").append(heatmapRowsHTML);

                // if (this.heatmapRowsHTML === null) {
                    // this.heatmapRowsHTML = heatmapRowsHTML.clone();
                // }
            // }

            // $(this.heatmapTable).find('.heatmap-rowLabel').parent().parent().children('ul.tree').toggle();

            $(this.heatmapTable).find('.heatmap-rowLabel').click(function () {
                $(this).find(".glyphicon").toggleClass("glyphicon-plus glyphicon-minus")
                $(this).parent().parent().children('ul.tree').toggleClass("heatmap-closed heatmap-opened").toggle(300);
            });

            this.hideLoadingStatus();
        },

        createRow: function(data) {
            if (data.html) return data.html;

            data.childrenHTML = [];
            if (data.children && data.children.length > 0) {
                for (var i = 0; i < data.children.length; i++) {
                    var childreRowsHTML = new Handlebars.SafeString(this.createRow(data.children[i]));
                    data.childrenHTML.push(childreRowsHTML);
                }
            }
            data.html = this.heatmapTreeTmpl(data);
            return data.html;

        },

        initSearchBoxSource: function (data) {
            this.initSearchBoxSourceList(data);
            for (var key in this.rowLabelDict) {
                this.rowLabelList.push(key);
            }
            var self = this;
            $.typeahead({
                input: '.heatmap-filterByRowName-input',
                source: {
                    data: this.rowLabelList
                },
                callback: {
                    onClick: function() {
                        $(self.heatmapTable).find(".heatmap-filterByRowName-search").click();
                    }
                }
            });
        },

        initSearchBoxSourceList: function(data) {
            for (var i = 0; i < data.length; i++) {
                this.rowLabelDict[data[i].rowLabel.toLowerCase()] = true;
                if (data[i].children && data[i].children.length > 0) {
                    this.initSearchBoxSourceList(data[i].children);
                }
            }
        },

        expandByFilterString: function(root, filterString, isRoot) {
            var children = root.children("li");
            var found = false;
            var rowLabel = root.parent().children(".heatmap-row").children(".heatmap-rowLabel").children(".rowLabel").text();
            for (var i = 0; i < children.length; i++) {
                found |= this.expandByFilterString($(children[i]).children(".heatmap-closed"), filterString, false);
            }
            if (found && isRoot === false) {
                root.show()
                   .toggleClass("heatmap-closed heatmap-opened")
                   .parent().children(".heatmap-row").find(".glyphicon").toggleClass("glyphicon-plus glyphicon-minus");
            }
            return found || rowLabel.toLowerCase().indexOf(filterString.toLowerCase()) !== -1
        },

        initClickEvent : function() {
            var self = this;

            //Add the click event of collapseAll button
            $(self.heatmapTable).find(".heatmap-collapseAll-btn").click(function() {
                self.showLoadingStatus();
                $(self.heatmapTable).find(".heatmap-opened").each(function() {
                    $(this).hide()
                           .toggleClass("heatmap-opened heatmap-closed")
                           .parent().children(".heatmap-row").find(".glyphicon").toggleClass("glyphicon-minus glyphicon-plus");
                });
                self.hideLoadingStatus();
            });

            //Add the click event of expandAll button
            $(self.heatmapTable).find(".heatmap-expandAll-btn").click(function() {
                self.showLoadingStatus();
                $(self.heatmapTable).find(".heatmap-closed").each(function() {
                    $(this).show()
                           .toggleClass("heatmap-closed heatmap-opened")
                           .parent().children(".heatmap-row").find(".glyphicon").toggleClass("glyphicon-plus glyphicon-minus");
                });
                self.hideLoadingStatus();
            })

            $(self.heatmapTable).find(".heatmap-reset-btn").click(function() {
                self.data = self.originData;
                self.resetHeatMap();
            });

            $(self.heatmapTable).find(".heatmap-filterByRowName-input").keydown(function(e) {
                if(e.keyCode==13){
                    $(self.heatmapTable).find(".heatmap-filterByRowName-search").click();
                }
            });

            $(self.heatmapTable).find(".heatmap-filterByRowName-search").click(function() {
                var filterString = $(self.heatmapTable).find(".heatmap-filterByRowName-input").val();
                if (filterString === "") return ;

                self.showLoadingStatus();
                // self.data = self.filterByRowsLabel(self.originData, filterString);
                self.data = self.filterBySearch(self.originData, filterString);
                self.hideLoadingStatus();

                // self.show();
                // self.showHeatmapRows();
                self.showHeatmapBody();
                self.showHeatmapRows();

                self.expandByFilterString($(self.heatmapTable).find(".heatmap-rows"), filterString, true);
                if (self.data.length === 0) {
                    $(self.heatmapTable).find(".heatmap-rows").append("<p>No result be found.</p>");
                }

            });

        },

        loadJSONData : function(data) {
            this.originData = data;
            this.data = this.originData;
            this.initSearchBoxSource(this.data);
        },

        loadJSONDataFromURL : function(filePath) {
            var self = this;
            $.getJSON(filePath, function(data) {
                self.loadJSONData(data);
            });
            this.initSearchBoxSource(this.data);
        },

        initInitialState: function() {
            $(".heatmap-filterByRowName-input").text("");
        },

        clear: function() {
            $(this.heatmapTable).empty();
        },

        resetHeatMap: function() {
            this.clear();
            this.showHeatmapSkeleton();
            this.initInitialState();
            // this.show(true);
            this.showHeatmapBody();
            this.showHeatmapRows();
            this.initClickEvent();
            this.initSearchBoxSource(this.data);
        },

        show : function() {
            this.showHeatmapBody();
            this.showHeatmapRows();
            this.initClickEvent();
            if (this.data.length === 0) {
                this.showNoFoundInfo();
                return;
            }
        },

        showNoFoundInfo: function() {
            $(this.heatmapTable).find(".heatmap-rows").append("<p>No result be found.</p>");
        },

        getValueToStyle: function(valuesSetting) {
            var valueToStyle = {}
            for (var i = 0; i < valuesSetting.length; i++) {
                valueToStyle[valuesSetting[i].value] = {};
                if (valuesSetting[i].color) {
                    valueToStyle[valuesSetting[i].value].color = valuesSetting[i].color;
                } else if (valuesSetting[i].cssClass) {
                    valueToStyle[valuesSetting[i].value].cssClass = valuesSetting[i].cssClass;
                } else if (valuesSetting[i].html) {
                    valueToStyle[valuesSetting[i].value].html = valuesSetting[i].html;
                } else {
                    throw "The value" + values[j].value + "has no color or cssClass";
                }
            }
            return valueToStyle
        },

        filterBySearch: function(data, filterString) {
            var newDataList = [];

            for (var i = 0; i < data.length; i++) {
                var curNewData = {};
                for (var key in data[i]) {
                    curNewData[key] = data[i][key];
                }

                curNewData.childrenHTML = null;
                curNewData.html = null;

                if (data[i].children && data[i].children.length !== 0) {
                    var newChildren = this.filterBySearch(data[i].children, filterString);
                    if (newChildren.length !== 0) {
                        curNewData.children = newChildren;
                    } else {
                        curNewData.children = [];
                    }
                }

                if (curNewData.children && curNewData.children.length !== 0) {
                    newDataList.push(curNewData);
                } else if (curNewData.rowLabel.toLowerCase().indexOf(filterString.toLowerCase()) !== -1) {
                    newDataList.push(curNewData);
                }
            }
            return newDataList;
        },

        showLoadingStatus: function() {
            $(".heatmap-info").show();
        },

        hideLoadingStatus: function() {
            $(".heatmap-info").hide();
        }
    }

    HeatMapTable.init = function(argv) {
        this.heatmapTreeTmpl = HBtemplates['templates/heatmap-tree.tmpl'];
        this.heatmapRowsHTML = null;
        this.dataIndexToHtml = {};
        this.rowLabelList = [];
        this.rowLabelDict = {};

        this.originData = [];
        this.data = [];
        this.heatmapTable = $("#" + argv.tableID)[0];
        if (argv.options) {
            this.detailTemplateID = argv.options.detailTemplate;
            this.headerTemplateID = argv.options.headerTemplate || null;
            this.headerTemplateData = argv.options.headerTemplateData;
            this.columnWidth = argv.options.columnWidth || "70px";
            this.valueToStyle = this.getValueToStyle(argv.options.valuesSetting);
        }

        this.initHandlebars();
        this.showHeatmapSkeleton();
        this.initInitialState();

        if (this.detailTemplateID) {
            var source   = $('#'+this.detailTemplateID).html();
            this.detailTemplate = Handlebars.compile(source);
        }
        if (this.headerTemplateID) {
            var source   = $('#'+this.headerTemplateID).html();
            this.headerTemplate = Handlebars.compile(source);
        }
    }

    HeatMapTable.init.prototype = HeatMapTable.prototype;

    global.HeatMapTable = HeatMapTable;

}(window));