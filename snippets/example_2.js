var heatmapTableOptions = {
  valuesSetting: [
    { value: 'NotDetected', color: 'lightgray'},
    { value: 'Positive', color: 'FFA10A'},
    { value: 'High', color: 'red'}
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