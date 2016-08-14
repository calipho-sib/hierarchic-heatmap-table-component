var heatmapTableOptions = {
  valuesSetting: [
    { value: 'Positive', html: '<div>\
      <img style="width:15px" src="./static/img/chili.gif">\
      <img style="width:15px" src="./static/img/chili.gif">\
      </div>'
    },
    { value: 'High', cssClass: 'red'},
    { value: 'NotDetected', color: 'lightgray'}
    ],
    columnWidth: "120px",
    headerTemplate: "headerTemplate",
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