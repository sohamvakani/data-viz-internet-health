// Internet Access vs Life Expectancy Visualization

//load geojson map data
const geojsonUrl =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

d3.json(geojsonUrl).then((geoData) => {
  // Loading country data
  d3.csv("data/merged-data.csv").then((data) => {
    // Processing data to convert strings to numbers and remove World
    data = data
      .filter((d) => d.Country !== "World")
      .map((d) => ({
        country: d.Country,
        code: d.Code,
        internet: +d.InternetAccess,
        life: +d.LifeExpectancy,
      }))
      .filter((d) => !isNaN(d.internet) && !isNaN(d.life));

    console.log("Data loaded:", data.length, "countries");

    // Create visualizations
    createChoroplethInternet(geoData, data);
    createChoroplethLife(geoData, data);
    createHistogramInternet(data);
    createHistogramLife(data);
    createScatterplot(data);
  });
});

function createHistogramInternet(data) {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 500 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = d3
    .select("#histogram-internet")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //creating bins
  const histogram = d3
    .histogram()
    .domain([0, 100])
    .thresholds(d3.range(0, 105, 10));
  const bins = histogram(data.map((d) => d.internet));

  console.log("Number of bins created:", bins.length);
  console.log("Bins:", bins);

  const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length)])
    .range([height, 0]);

  console.log("Y Scale Domain:", yScale.domain());

  //Bars
  svg
    .selectAll(".bar")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.x0) + 1)
    .attr("width", (d) => xScale(d.x1) - xScale(d.x0) - 1)
    .attr("y", (d) => {
      const yPos = yScale(d.length);
      console.log(
        `Bin with ${d.length} countries: y=${yPos}, height=${height - yPos}`,
      );
      return yPos;
    })
    .attr("height", (d) => height - yScale(d.length));

  //X axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 35)
    .attr("fill", "black")
    .text("Internet Access (%)");

  //Y axis
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -height / 2)
    .attr("fill", "black")
    .text("Number of Countries");
}

function createHistogramLife(data) {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 500 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = d3
    .select("#histogram-life")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //creating bins
  const histogram = d3
    .histogram()
    .domain([50, 90])
    .thresholds(d3.range(50, 91, 2));

  const bins = histogram(data.map((d) => d.life));

  const xScale = d3.scaleLinear().domain([50, 90]).range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length)])
    .range([height, 0]);

  //Bars
  svg
    .selectAll(".bar")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.x0) + 1)
    .attr("width", (d) => xScale(d.x1) - xScale(d.x0) - 1)
    .attr("y", (d) => yScale(d.length))
    .attr("height", (d) => height - yScale(d.length));

  //X axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 35)
    .attr("fill", "black")
    .text("Life Expectancy (years)");

  //Y axis
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -height / 2)
    .attr("fill", "black")
    .text("Number of Countries");
}

function createScatterplot(data) {
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = 1300 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  //Scales
  const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
  const yScale = d3.scaleLinear().domain([50, 90]).range([height, 0]);

  //Dots
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.internet))
    .attr("cy", (d) => yScale(d.life))
    .attr("r", 5);

  //X axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .text("Internet Access (%)");

  //Y axis
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", -height / 2)
    .attr("fill", "black")
    .text("Life Expectancy (years)");
}
