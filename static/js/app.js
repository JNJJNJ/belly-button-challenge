// Build the metadata panel
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

function buildMetadata(selectedValue) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // get the metadata field
        let metadata = data.metadata;
        
        // Filter the metadata for the object with the desired sample number
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
  
        let obj = filteredData[0]
        
        // Use d3 to select the panel with id of `#sample-metadata`
        let metapanel = d3.select("#sample-metadata")

        // Use `.html("") to clear any existing metadata
        metapanel.html("")

        // Inside a loop, you will need to use d3 to append new
        // tags for each key-value in the filtered metadata.
        let entries = Object.entries(obj);

        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        console.log(entries);
    });
  }

// Make the bubble chart
function buildChart(selectedValue) {
  d3.json(url).then((data) => {

      // Get the samples field
      let samples = data.samples;
  
      // Filter the samples for the object with the desired sample number
      let filteredData = samples.filter((sample) => sample.id === selectedValue);
      
      let obj = filteredData[0];
      
      // Construct Bubble Chart
      let trace = [{
          x: obj.otu_ids,
          y: obj.sample_values,
          text: obj.otu_labels,
          mode: "markers",
          marker: {
              color: obj.otu_ids,
              colorscale: 'Earth',
              size: obj.sample_values
          }
      }];
  
      let bubble_layout = {
          title: "Bacteria Cultures Per Sample",
          xaxis: {title: "OTU ID"},
          yaxis: {title: "Number of Bacteria"}
      };
  
      // Render the Bubble Chart
      Plotly.newPlot("bubble", trace, bubble_layout);

    });
  }

// Build a Bar Chart
// Don't forget to slice and reverse the input data appropriately
function buildBar(selectedValue) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Get the samples field
        let samples = data.samples;

        // Filter the samples for the object with the desired sample number 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        let obj = filteredData[0];
        
        // Construct Bar Chart
        let trace2 = [{
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h", 
        }];
        
        let bar_layout = {
          title: "Top 10 Bacteria Cultures Found",
          xaxis: {title: "Number of Bacteria"},
      };

        //Render the Bar Chart
        Plotly.newPlot("bar", trace2, bar_layout);
    });
}


// Function to run on page load
function init() {
  d3.json(url).then((data) => {
    console.log(`Data: ${data}`);

      // Get the names field
      let names = data.names;

      // Use D3 to select the dropdown with id of `#selDataset`
      let dropdownMenu = d3.select("#selDataset");

      // Use the list of sample names to populate the select options
      names.forEach((name) => {
      // Hint: Inside a loop, you will need to use d3 to append a new
      // option for each sample name.
          dropdownMenu.append("option").text(name).property("value", name);
      });

      // Get the first sample from the list
      let name = names[0];

      // Build charts and metadata panel with the first sample
      buildMetadata(name);
      buildChart(name);
      buildBar(name);
  });
}

// Function for event listener
function optionChanged(selectedValue) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(selectedValue);
  buildChart(selectedValue);
  buildBar(selectedValue);
}

// Initialize the dashboard
init();