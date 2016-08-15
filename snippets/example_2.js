headerTemplateSrc = 
    '<div style="overflow:hidden">\
        <div class="pull-left" style="margin-top:15px; margin-left: 50px; font-size: 18px; font-weight: bold">Tissue/ Cell type</div>\
        <div class="pull-right">\
            <div style="overflow:hidden">\
                <div style="float:left; width:90px; text-align:center; color: white; background-color:#163eef">mRNA</div><div style="float:left; width:120px; text-align:center; color: white; background-color:#1537d2">Protein</div>\
            </div>\
            <div style="overflow:hidden">\
                <div class="methodology-header MicroArray-header" data-placement="top" data-toggle="tooltip" data-html="true" data-original-title="<img src=\"vendor\/images\/MA_legend.png\"\/>">MA</div><div class="methodology-header EST-header" data-placement="top" data-toggle="tooltip" data-html="true" data-original-title="<img src="vendor\/images\/EST_legend.png"\/>">EST</div><div class="methodology-header IHC-header" data-placement="top" data-toggle="tooltip" data-html="true" data-original-title="<img src="vendor\/images\/IHC_legend.png"\/>">IHC</div>\
            </div>\
        </div>\
    </div>'
;

var heatmapTableOptions = {
  valuesSetting: [
    { value: 'NotDetected', color: 'lightgray'},
    { value: 'Positive', color: 'FFA10A'},
    { value: 'High', color: 'red'}
    ],
    columnWidth: "120px",
    headerTemplateSrc: headerTemplateSrc,
    headerTemplateData: {header:['MANotDetected',
                        'MAPositive',
                        'ESTPositive']}
}
var heatMapTable = new HeatMapTable({
                tableID: "heatmap-table-1",
                options: heatmapTableOptions
            });
var data = [
    {
      "rowLabel": "Human anatomical entity",
      "values": ["NotDetected", "High", "Positive"],
      "children": [
        {
          "rowLabel": "Fluid and secretion",
          "values": ["NotDetected", "High", "Positive"],
          "children": [ 
            {
              "rowLabel": "Blood", 
              "values": ["", "High", "Positive"],
              "children": []
            }
          ]
        }
      ], 
    }
  ];
        
heatMapTable.loadJSONData(data);
heatMapTable.show();