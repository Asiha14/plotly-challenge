d3.json("samples.json").then((data) =>{

    var sampData = data.samples;
    var otuIDs = [];
    var otuLabels = [];
    var sampValues = [];
    var ID = [];

    sampData.forEach((samp) => {
        ID.push(samp.id);
        otuIDs.push(samp.otu_ids);
        otuLabels.push(samp.otu_labels);
        sampValues.push(samp.sample_values);
    });

    var fullDataObjs = [];
    var fullsubjectIDs = [];

    for (i = 0; i < otuIDs.length; i++){
        var id = ID[i];
        fullsubjectIDs.push(id)
        for (j = 0; j < otuIDs[i].length; j++){
   
        fullDataObjs.push({"ID":id,
                    "otu_id":otuIDs[i][j],
                    "otu_label":otuLabels[i][j],
                    "sampVal":sampValues[i][j]});
        
        };
    };

    otuIDs.forEach(value => {
        value.splice(10);
    });
    otuLabels.forEach(value => {
        value.splice(10);
    });
    sampValues.forEach(value => {
        value.splice(10);
    });

    var dataObjs = [];
    var subjectIDs = [];

    for (i = 0; i < otuIDs.length; i++){
        var id = ID[i];
        subjectIDs.push(id)
        for (j = 0; j < otuIDs[i].length; j++){
   
        dataObjs.push({"ID":id,
                    "otu_id":otuIDs[i][j],
                    "otu_label":otuLabels[i][j],
                    "sampVal":sampValues[i][j]});
        
        };
    };
    

    var select = d3.select("select")
    ID.forEach( d =>{
        var opt = select.append("option");
        opt.property("value",d);
        opt.text(d);

    });

    var metadata = data.metadata;
    var infoTable = d3.select("#sample-metadata");

    function init() {
        var filtered = dataObjs.filter(function(obj) {
            return obj.ID === "940";
        });

        var fullFiltered = fullDataObjs.filter(function(obj) {
            return obj.ID === "940";
        });
        var labels = filtered.map(d =>d.otu_id)
        var l = labels.map(d =>{
            return d = "OTU " + d.toString(); 
        });
      
     
        var trace1 = [{
          x: filtered.map(d =>d.sampVal).reverse(),
          y: l.reverse(),
          text: filtered.map(d =>d.otu_label).reverse(),
          orientation: "h",
          type: "bar"
        }];

        var trace2 = [{
            x: fullFiltered.map(d =>d.otu_id).reverse(),
            y: fullFiltered.map(d =>d.sampVal).reverse(),
            text: fullFiltered.map(d =>d.otu_label).reverse(),
            mode: 'markers',
            marker: {
                color:fullFiltered.map(d =>d.otu_id).reverse(),
                size: fullFiltered.map(d =>d.sampVal).reverse()
            }
        }];

        var layout = {
          height: 600,
          width: 800,

        };
      
        Plotly.newPlot("bar", trace1, layout );
        Plotly.newPlot("bubble", trace2, layout );


        var info = metadata.filter(d => d.id === 940);
        console.log(info)
        info.forEach( sample =>{
            var ul = infoTable.append("ul")
            
            Object.entries(sample).forEach(([key, value]) =>{
                var li=ul.append("li")
                li.text(`${key}: ${value}`)
            });
        });
    };

    d3.selectAll("#selDataset").on("change", getData)

    function getData() {
        var dropdownMenu = d3.select("select");
        // Assign the value of the dropdown menu option to a variable
        var option = dropdownMenu.property("value");
        // Initialize an empty array for the country's data
        var filtered = dataObjs.filter(function(obj) {
            return obj.ID === option;
        });
        var fullFiltered = fullDataObjs.filter(function(obj) {
            return obj.ID === option;
        });

        // Call function to update the chart
        updatePlotly(filtered, fullFiltered);

        d3.selectAll("ul").remove()
        d3.selectAll("li").remove()
        var info = metadata.filter(d => d.id === +option);
  
        info.forEach( sample =>{
            var ul = infoTable.append("ul")
            
            Object.entries(sample).forEach(([key, value]) =>{
                var li=ul.append("li")
                li.text(`${key}: ${value}`)
            });
        });

        
    };

    function updatePlotly(newdata, fullnewdata) {
        var labels = newdata.map(d =>d.otu_id)
        var l = labels.map(d =>{
            return d = "OTU " + d.toString(); 
        });
        var updateBar = {
            x: [newdata.map(d =>d.sampVal).reverse()],
            y: [l.reverse()],
            text: [newdata.map(d =>d.otu_label).reverse()],
            orientation: "h",
            type: "bar"
        }
        Plotly.update("bar", updateBar);
        
        var updateBubble = {
            x: [fullnewdata.map(d =>d.otu_id).reverse()],
            y: [fullnewdata.map(d =>d.sampVal).reverse()],
            text: [fullnewdata.map(d =>d.otu_label).reverse()],
            mode: 'markers',
            marker: {
                color:fullnewdata.map(d =>d.otu_id).reverse(),
                size: fullnewdata.map(d =>d.sampVal).reverse()
            }
        }
        Plotly.update("bubble", updateBubble);

    };

    

    init();
});