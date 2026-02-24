// Internet Access vs Life Expectancy Visualization
// Attribute configurations
const attributeConfigs = {
  Internet: {
    attribute: "Internet",
    label: "Internet Access (%)",
    min: 0,
    max: 100,
    bins: d3.range(0, 105, 10),
    format: ".1f", // Format for displaying values
  },
  LifeExpectancy: {
    attribute: "LifeExpectancy",
    label: "Life Expectancy (years)",
    min: 50,
    max: 90,
    bins: d3.range(50, 92, 2),
    format: ".1f",
  },
  HealthcareSpending: {
    attribute: "HealthcareSpending",
    label: "Healthcare Spending ($ per capita)",
    min: 0,
    max: 13000,
    bins: d3.range(0, 13500, 1000),
    format: ".0f",
  },
  InfantMortality: {
    attribute: "InfantMortality",
    label: "Infant Mortality Rate (per 1,000 births)",
    min: 0,
    max: 9,
    bins: d3.range(0, 9.5, 0.5),
    format: ".2f",
  },
};
// Function to bin healthcare spending
function getHealthcareSpendingBin(value) {
  if (value < 50) return "$0-$50";
  if (value < 100) return "$50-$100";
  if (value < 250) return "$100-$250";
  if (value < 500) return "$250-$500";
  if (value < 1000) return "$500-$1000";
  if (value < 2500) return "$1000-$2500";
  if (value < 5000) return "$2500-$5000";
  if (value < 10000) return "$5000-$10000";
  return "$10000+";
}

// Function to bin infant mortality
function getInfantMortalityBin(value) {
  if (value < 0.2) return "0-0.2%";
  if (value < 0.5) return "0.2-0.5%";
  if (value < 1) return "0.5-1%";
  if (value < 2) return "1-2%";
  if (value < 5) return "2-5%";
  if (value < 10) return "5-10%";
  return "10%+";
}

// Function to bin life expectancy
function getLifeExpectancyBin(value) {
  if (value < 55) return "50-55";
  if (value < 60) return "55-60";
  if (value < 65) return "60-65";
  if (value < 70) return "65-70";
  if (value < 75) return "70-75";
  if (value < 80) return "75-80";
  if (value < 85) return "80-85";
  return "85-90";
}

// Ordinal color scale for life expectancy (same as healthcare spending)
const lifeExpectancyColorScale = d3
  .scaleOrdinal()
  .domain([
    "50-55",
    "55-60",
    "60-65",
    "65-70",
    "70-75",
    "75-80",
    "80-85",
    "85-90",
  ])
  .range([
    "#ffffd9",
    "#edf8b1",
    "#c7e9b4",
    "#7fcdbb",
    "#41b6c4",
    "#1d91c0",
    "#225ea8",
    "#0c2c84",
  ]);
// Ordinal color scales
const healthcareColorScale = d3
  .scaleOrdinal()
  .domain([
    "$0-$50",
    "$50-$100",
    "$100-$250",
    "$250-$500",
    "$500-$1000",
    "$1000-$2500",
    "$2500-$5000",
    "$5000-$10000",
    "$10000+",
  ])
  .range([
    "#ffffd9",
    "#edf8b1",
    "#c7e9b4",
    "#7fcdbb",
    "#41b6c4",
    "#1d91c0",
    "#225ea8",
    "#0c2c84",
    "#051b4a",
  ]);

const infantMortalityColorScale = d3
  .scaleOrdinal()
  .domain(["0-0.2%", "0.2-0.5%", "0.5-1%", "1-2%", "2-5%", "5-10%", "10%+"])
  .range([
    "#fef0d9",
    "#fdd49e",
    "#fdbb84",
    "#fc8d59",
    "#e34a33",
    "#b30000",
    "#7f0000",
  ]);
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
        Internet: +d.Internet,
        LifeExpectancy: +d.LifeExpectancy,
        HealthcareSpending: +d.HealthcareSpending,
        InfantMortality: +d.InfantMortality,
      }))
      .filter(
        (d) =>
          !isNaN(d.Internet) &&
          !isNaN(d.LifeExpectancy) &&
          !isNaN(d.HealthcareSpending) &&
          !isNaN(d.InfantMortality),
      );

    console.log("Data loaded:", data.length, "countries");

    // Create initial visualizations
    createChoropleth(geoData, data, "Internet", "#map-internet");
    createChoropleth(geoData, data, "LifeExpectancy", "#map-life");
    createHistogram(data, "Internet", "#histogram-internet");
    createHistogram(data, "LifeExpectancy", "#histogram-life");
    createScatterplot(data, "Internet", "LifeExpectancy");

    // ADD EVENT LISTENERS HERE (inside the callback so data and geoData are accessible)
    document.querySelectorAll('input[name="attribute1"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const attr1 = e.target.value;
        const attr2 = document.querySelector(
          'input[name="attribute2"]:checked',
        ).value;

        // Update titles
        document.querySelector(
          "#maps-section .map-container:first-child h2",
        ).textContent = attributeConfigs[attr1].label + " Distribution";
        document.querySelector(
          "#visualizations .chart-container:first-child h2",
        ).textContent = attributeConfigs[attr1].label + " Distribution";
        document.querySelector(
          "#visualizations .chart-container.full-width h2",
        ).textContent =
          attributeConfigs[attr1].label +
          " vs " +
          attributeConfigs[attr2].label;

        // Clear and redraw
        d3.select("#histogram-internet").html("");
        d3.select("#map-internet").html("");
        d3.select("#scatterplot").html("");

        createHistogram(data, attr1, "#histogram-internet");
        createChoropleth(geoData, data, attr1, "#map-internet");
        createScatterplot(data, attr1, attr2);
      });
    });

    document.querySelectorAll('input[name="attribute2"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const attr1 = document.querySelector(
          'input[name="attribute1"]:checked',
        ).value;
        const attr2 = e.target.value;

        // Update titles
        document.querySelector(
          "#maps-section .map-container:nth-child(2) h2",
        ).textContent = attributeConfigs[attr2].label + " Distribution";
        document.querySelector(
          "#visualizations .chart-container:nth-child(2) h2",
        ).textContent = attributeConfigs[attr2].label + " Distribution";
        document.querySelector(
          "#visualizations .chart-container.full-width h2",
        ).textContent =
          attributeConfigs[attr1].label +
          " vs " +
          attributeConfigs[attr2].label;

        // Clear and redraw
        d3.select("#histogram-life").html("");
        d3.select("#map-life").html("");
        d3.select("#scatterplot").html("");

        createHistogram(data, attr2, "#histogram-life");
        createChoropleth(geoData, data, attr2, "#map-life");
        createScatterplot(data, attr1, attr2);
      });
    });
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
function createHistogram(data, attributeName, containerId) {
  const config = attributeConfigs[attributeName];

  if (!config) {
    console.error(`No config found for ${attributeName}`);
    return;
  }

  // Clear the container first (in case we're updating)
  d3.select(containerId).html("");

  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 500 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create bins using the config
  const histogram = d3
    .histogram()
    .domain([config.min, config.max])
    .thresholds(config.bins);

  const bins = histogram(data.map((d) => d[attributeName]));

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain([config.min, config.max])
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length)])
    .range([height, 0]);

  // Draw bars
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

  // X axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 35)
    .attr("fill", "black")
    .text(config.label);

  // Y axis
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

function createScatterplot(data, attribute1Name, attribute2Name) {
  const config1 = attributeConfigs[attribute1Name];
  const config2 = attributeConfigs[attribute2Name];

  if (!config1 || !config2) {
    console.error(
      `Config not found for ${attribute1Name} or ${attribute2Name}`,
    );
    return;
  }

  // Clear the container first
  d3.select("#scatterplot").html("");

  const margin = { top: 20, right: 20, bottom: 50, left: 100 };
  const width = 1300 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales using config values
  const xScale = d3
    .scaleLinear()
    .domain([config1.min, config1.max])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([config2.min, config2.max])
    .range([height, 0]);

  // Draw dots
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d[attribute1Name]))
    .attr("cy", (d) => yScale(d[attribute2Name]))
    .attr("r", 5);

  // X axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .text(config1.label);

  // Y axis
  // Y axis
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -80) // Changed from -50 to -80
    .attr("x", -height / 2)
    .attr("text-anchor", "middle") // Add this
    .attr("fill", "black")
    .text(config2.label);
}

function createChoropleth(geoData, data, attributeName, containerId) {
  const config = attributeConfigs[attributeName];

  if (!config) {
    console.error(`No config found for ${attributeName}`);
    return;
  }

  // Determine which color scale and bin function to use FIRST
  let colorScale;
  let getBinFunction;

  if (attributeName === "HealthcareSpending") {
    colorScale = healthcareColorScale;
    getBinFunction = getHealthcareSpendingBin;
  } else if (attributeName === "InfantMortality") {
    colorScale = infantMortalityColorScale;
    getBinFunction = getInfantMortalityBin;
  } else if (attributeName === "LifeExpectancy") {
    colorScale = lifeExpectancyColorScale;
    getBinFunction = getLifeExpectancyBin;
  } else {
    // Default sequential scale for other attributes
    const minValue = d3.min(data, (d) => d[attributeName]);
    const maxValue = d3.max(data, (d) => d[attributeName]);
    colorScale = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .range(["#ffffff", "#08519c"])
      .clamp(true);
    getBinFunction = null;
  }

  console.log("Attribute:", attributeName);
  console.log("ColorScale:", colorScale);
  console.log("getBinFunction:", getBinFunction);
  // Create a lookup object for fast data access
  const dataLookup = {};
  data.forEach((d) => {
    dataLookup[d.country] = d[attributeName];
  });

  // Country name mapping for mismatches
  const countryNameMap = {
    Antarctica: "Antarctica",
    "French Southern and Antarctic Lands": "French Guiana",
    "The Bahamas": "Bahamas",
    "Central African Republic": "Central African Republic",
    "Ivory Coast": "Côte d'Ivoire",
    "Democratic Republic of the Congo": "Democratic Republic of Congo",
    "Republic of the Congo": "Congo",
    "Northern Cyprus": "Cyprus",
    "Czech Republic": "Czechia",
    Ethiopia: "Ethiopia",
    "Falkland Islands": "Falkland Islands",
    England: "United Kingdom",
    "Guinea Bissau": "Guinea-Bissau",
    Greenland: "Greenland",
    Haiti: "Haiti",
    India: "India",
    Kosovo: "Kosovo",
    Macedonia: "North Macedonia",
    "New Caledonia": "New Caledonia",
    "Puerto Rico": "Puerto Rico",
    "North Korea": "North Korea",
    "Western Sahara": "Western Sahara",
    Sudan: "Sudan",
    "South Sudan": "South Sudan",
    Somaliland: "Somalia",
    Somalia: "Somalia",
    "Republic of Serbia": "Serbia",
    Swaziland: "Eswatini",
    Syria: "Syria",
    Turkmenistan: "Turkmenistan",
    Taiwan: "Taiwan",
    "United Republic of Tanzania": "Tanzania",
    USA: "United States",
    Venezuela: "Venezuela",
    "West Bank": "Palestine",
    Yemen: "Yemen",
  };

  // Clear container
  d3.select(containerId).html("");

  const margin = { top: 20, right: 20, bottom: 80, left: 20 };
  const width = 600 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svgElement = d3
    .select(containerId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
    )
    .attr("preserveAspectRatio", "xMidYMid meet");

  const svg = svgElement
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Add dashed pattern for no-data countries
  const defs = svg.append("defs");
  defs
    .append("pattern")
    .attr("id", "diagonal-hatch")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 5)
    .attr("height", 5)
    .append("path")
    .attr("d", "M-1,1 l2,-2 M1,3 l2,-2 M3,5 l2,-2 M5,7 l2,-2")
    .attr("stroke", "#999")
    .attr("stroke-width", 0.3);

  // Create projection and path
  const projection = d3.geoMercator().fitSize([width, height], geoData);
  const path = d3.geoPath().projection(projection);

  // Filter out Antarctica
  const countriesForMap = geoData.features.filter((feature) => {
    return feature.properties.name !== "Antarctica";
  });

  // Draw countries
  svg
    .selectAll(".country")
    .data(countriesForMap)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", (d) => {
      let countryName = d.properties.name;

      if (countryNameMap[countryName]) {
        countryName = countryNameMap[countryName];
      }

      const value = dataLookup[countryName];

      if (value !== undefined) {
        // If we have a bin function, use it; otherwise use the linear scale
        if (getBinFunction) {
          const bin = getBinFunction(value);
          return colorScale(bin);
        } else {
          return colorScale(value);
        }
      } else {
        return "url(#diagonal-hatch)";
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
  addLegend(svg, colorScale, config, width, height, getBinFunction);
}

// Helper function to add legend
// Helper function to add legend
function addLegend(svg, colorScale, config, width, height, getBinFunction) {
  const legendHeight = 25;
  const legendWidth = 400;
  const legendX = (width - legendWidth) / 2;
  const legendY = height - 55;

  // Legend title
  svg
    .append("text")
    .attr("x", legendX + legendWidth / 2)
    .attr("y", legendY - 20)
    .attr("font-size", "0.85rem")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text(config.label);

  let legendItems;
  let legendColors;

  if (getBinFunction) {
    // For categorical data, use the domain and range from the ordinal scale
    legendItems = colorScale.domain();
    legendColors = colorScale.range();
  } else {
    // For continuous data, create 8 steps
    legendItems = [];
    legendColors = [];
    const gradientSteps = 8;
    for (let i = 0; i < gradientSteps; i++) {
      const value =
        config.min + (config.max - config.min) * (i / (gradientSteps - 1));
      legendItems.push(value.toFixed(1));
      legendColors.push(colorScale(value));
    }
  }

  // Draw legend boxes
  const stepWidth = legendWidth / legendItems.length;

  for (let i = 0; i < legendItems.length; i++) {
    svg
      .append("rect")
      .attr("x", legendX + i * stepWidth)
      .attr("y", legendY)
      .attr("width", stepWidth + 1)
      .attr("height", legendHeight)
      .attr("fill", legendColors[i])
      .attr("stroke", "#ddd")
      .attr("stroke-width", "0.5px");

    // Add labels - show every other label to avoid crowding

    // Alternate labels above and below the legend
    const isEven = i % 2 === 0;
    const labelY = isEven
      ? legendY - 5 // Above the box
      : legendY + legendHeight + 15; // Below the box

    svg
      .append("text")
      .attr("x", legendX + i * stepWidth + stepWidth / 2)
      .attr("y", labelY)
      .attr("font-size", "0.65rem")
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .text(legendItems[i]);
  }

  // Add "No Data" pattern box
  const noDataX = legendX;
  const noDataY = legendY + legendHeight + 25;

  svg
    .append("rect")
    .attr("x", noDataX)
    .attr("y", noDataY)
    .attr("width", 30)
    .attr("height", 18)
    .attr("fill", "url(#diagonal-hatch)")
    .attr("stroke", "#999")
    .attr("stroke-width", "0.5px");

  svg
    .append("text")
    .attr("x", noDataX + 35)
    .attr("y", noDataY + 14)
    .attr("font-size", "0.7rem")
    .attr("fill", "#333")
    .text("No Data");
}
