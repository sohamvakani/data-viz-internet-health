// Internet Access vs Life Expectancy Visualization

//load geojson map data
const geojsonUrl =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

d3.json(geojsonUrl).then((geoData) => {
  d3.csv("data/merged-data.csv").then((data) => {
    // Process data
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

    // DEBUG: Find mismatches
    const unmatched = debugCountryMatches(geoData, data);

    // Create visualizations
    createChoroplethInternet(geoData, data);
    createChoroplethLife(geoData, data);
    createHistogramInternet(data);
    createHistogramLife(data);
    createScatterplot(data);
  });
});

function debugCountryMatches(geoData, data) {
  // Create a lookup object from your data
  const dataLookup = {};
  data.forEach((d) => {
    dataLookup[d.country] = true;
  });

  // Check which GeoJSON countries don't match
  const unmatchedGeoCountries = [];
  geoData.features.forEach((feature) => {
    const geoName = feature.properties.name;
    if (!dataLookup[geoName]) {
      unmatchedGeoCountries.push(geoName);
    }
  });

  console.log("GeoJSON countries with NO match in your data:");
  console.log(unmatchedGeoCountries);

  return unmatchedGeoCountries;
}

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

function createChoroplethInternet(geoData, data) {
  // Create a lookup object for fast data access
  const dataLookup = {};
  data.forEach((d) => {
    dataLookup[d.country] = d.internet;
  });

  // Create a country name mapping for mismatches
  const countryNameMap = {
    "United States of America": "United States",
    Korea: "South Korea",
    "Democratic Republic of the Congo": "Democratic Republic of Congo",
    "Republic of the Congo": "Congo",
    Czechia: "Czech Republic",
    Palestine: "Palestine",
    Tanzania: "Tanzania",
    "Bosnia and Herzegovina": "Bosnia and Herzegovina",
    "Micronesia (Federated States of)": "Micronesia",
    Kyrgyzstan: "Kyrgyzstan",
    Turkmenistan: "Turkmenistan",
    "Timor-Leste": "East Timor",
  };

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select("#map-internet")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create projection and path
  const projection = d3.geoMercator().fitSize([width, height], geoData);

  const path = d3.geoPath().projection(projection);

  // Get min and max values for color scale
  const minInternet = d3.min(data, (d) => d.internet);
  const maxInternet = d3.max(data, (d) => d.internet);
  const midInternet = (minInternet + maxInternet) / 2;

  // Create diverging color scale (red-white-blue)
  const colorScale = d3
    .scaleLinear()
    .domain([minInternet, midInternet, maxInternet])
    .range(["#d73027", "#ffffff", "#4575b4"])
    .clamp(true);

  // Draw countries
  svg
    .selectAll(".country")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", (d) => {
      // Try to find the country's data
      let countryName = d.properties.name;

      // Check if we need to map the name
      if (countryNameMap[countryName]) {
        countryName = countryNameMap[countryName];
      }

      const value = dataLookup[countryName];

      if (value !== undefined) {
        return colorScale(value);
      } else {
        return "#ccc"; // Gray for no data
      }
    })
    .on("mouseover", function (event, d) {
      let countryName = d.properties.name;
      if (countryNameMap[countryName]) {
        countryName = countryNameMap[countryName];
      }
      const value = dataLookup[countryName];

      d3.select(this).style("stroke", "#333").style("stroke-width", "1.5px");

      // Show tooltip (optional - we'll add this later)
    })
    .on("mouseout", function () {
      d3.select(this).style("stroke", "#fff").style("stroke-width", "0.5px");
    });

  // Add legend
  addLegend(
    svg,
    colorScale,
    minInternet,
    maxInternet,
    "Internet Access (%)",
    width,
  );
}

function createChoroplethLife(geoData, data) {
  // Create a lookup object for fast data access
  const dataLookup = {};
  data.forEach((d) => {
    dataLookup[d.country] = d.life;
  });

  // Create a country name mapping for mismatches
  const countryNameMap = {
    "United States of America": "United States",
    Korea: "South Korea",
    "Democratic Republic of the Congo": "Democratic Republic of Congo",
    "Republic of the Congo": "Congo",
    Czechia: "Czech Republic",
    Palestine: "Palestine",
    Tanzania: "Tanzania",
    "Bosnia and Herzegovina": "Bosnia and Herzegovina",
    "Micronesia (Federated States of)": "Micronesia",
    Kyrgyzstan: "Kyrgyzstan",
    Turkmenistan: "Turkmenistan",
    "Timor-Leste": "East Timor",
  };

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select("#map-life")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create projection and path
  const projection = d3.geoMercator().fitSize([width, height], geoData);

  const path = d3.geoPath().projection(projection);

  // Get min and max values for color scale
  const minLife = d3.min(data, (d) => d.life);
  const maxLife = d3.max(data, (d) => d.life);
  const midLife = (minLife + maxLife) / 2;

  // Create diverging color scale (red-white-blue)
  const colorScale = d3
    .scaleLinear()
    .domain([minLife, midLife, maxLife])
    .range(["#d73027", "#ffffff", "#4575b4"])
    .clamp(true);

  // Draw countries
  svg
    .selectAll(".country")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", (d) => {
      // Try to find the country's data
      let countryName = d.properties.name;

      // Check if we need to map the name
      if (countryNameMap[countryName]) {
        countryName = countryNameMap[countryName];
      }

      const value = dataLookup[countryName];

      if (value !== undefined) {
        return colorScale(value);
      } else {
        return "#ccc"; // Gray for no data
      }
    })
    .on("mouseover", function (event, d) {
      let countryName = d.properties.name;
      if (countryNameMap[countryName]) {
        countryName = countryNameMap[countryName];
      }
      const value = dataLookup[countryName];

      d3.select(this).style("stroke", "#333").style("stroke-width", "1.5px");
    })
    .on("mouseout", function () {
      d3.select(this).style("stroke", "#fff").style("stroke-width", "0.5px");
    });

  // Add legend
  addLegend(
    svg,
    colorScale,
    minLife,
    maxLife,
    "Life Expectancy (years)",
    width,
  );
}

// Helper function to add legend
function addLegend(svg, colorScale, min, max, label, width) {
  const legendHeight = 20;
  const legendWidth = 200;
  const legendX = width - legendWidth - 10;
  const legendY = 10;

  // Legend background
  svg
    .append("rect")
    .attr("x", legendX)
    .attr("y", legendY)
    .attr("width", legendWidth)
    .attr("height", 80)
    .attr("fill", "white")
    .attr("stroke", "#ccc")
    .attr("stroke-width", "1px");

  // Legend title
  svg
    .append("text")
    .attr("x", legendX + 10)
    .attr("y", legendY + 20)
    .attr("font-size", "0.9rem")
    .attr("font-weight", "bold")
    .text(label);

  // Color gradient
  const gradientSteps = 5;
  const stepWidth = legendWidth - 20;

  for (let i = 0; i < gradientSteps; i++) {
    const value = min + (max - min) * (i / (gradientSteps - 1));

    svg
      .append("rect")
      .attr("x", legendX + 10 + (i * stepWidth) / gradientSteps)
      .attr("y", legendY + 30)
      .attr("width", stepWidth / gradientSteps)
      .attr("height", legendHeight)
      .attr("fill", colorScale(value));
  }

  // Legend labels
  svg
    .append("text")
    .attr("x", legendX + 10)
    .attr("y", legendY + 65)
    .attr("font-size", "0.75rem")
    .text(min.toFixed(1));

  svg
    .append("text")
    .attr("x", legendX + legendWidth - 30)
    .attr("y", legendY + 65)
    .attr("font-size", "0.75rem")
    .attr("text-anchor", "end")
    .text(max.toFixed(1));
}
