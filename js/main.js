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
//creating a tooltip
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("padding", "8px")
  .style("background", "rgba(0, 0, 0, 0.8)")
  .style("color", "white")
  .style("border-radius", "4px")
  .style("pointer-events", "none")
  .style("font-size", "0.85rem")
  .style("z-index", "1000")
  .style("display", "none");

const selectedCountries = new Set();

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

// Global function to update visuals across all charts
function updateHighlighting() {
  const hasSelection = selectedCountries.size > 0;

  //Update Scatterplot
  d3.selectAll(".dot").classed(
    "dimmed",
    (d) => hasSelection && !selectedCountries.has(d.country),
  );

  //Update Map
  d3.selectAll(".country").classed("dimmed", (d) => {
    let name = d.properties.name;
    if (countryNameMap[name]) name = countryNameMap[name];
    return hasSelection && !selectedCountries.has(name);
  });

  //Update Histograms
  d3.selectAll(".bar").classed("dimmed", (d) => {
    if (!hasSelection) return false;
    return !d.some((item) => selectedCountries.has(item.country));
  });
}

function create4DBubbleChart(data) {
  // Clear the container
  d3.select("#scatterplot").html("");

  // Update the title
  document.querySelector(
    "#visualizations .chart-container.full-width h2",
  ).textContent =
    "4D Analysis: Internet vs Life Expectancy (Size: Health $, Color: Infant Mortality)";

  const margin = { top: 20, right: 40, bottom: 110, left: 100 };
  const width = 1300 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Hardcode the 4 dimensions for this specific chart
  const attrX = "Internet";
  const attrY = "LifeExpectancy";
  const attrSize = "HealthcareSpending";
  const attrColor = "InfantMortality";

  const confX = attributeConfigs[attrX];
  const confY = attributeConfigs[attrY];
  const confSize = attributeConfigs[attrSize];

  //Create Scales
  const xScale = d3
    .scaleLinear()
    .domain([confX.min, confX.max])
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([confY.min, confY.max])
    .range([height, 0]);

  //Use scaleSqrt for accurate area representation
  const sizeScale = d3.scaleSqrt().domain([0, confSize.max]).range([3, 25]); // Minimum 3px radius, maximum 25px radius

  const brush = d3
    .brush()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("start brush end", brushed);

  svg.append("g").attr("class", "brush").call(brush);

  function brushed({ selection }) {
    if (!selection) {
      selectedCountries.clear();
      updateHighlighting();
      return;
    }

    const [[x0, y0], [x1, y1]] = selection;
    selectedCountries.clear();

    svg.selectAll(".dot").each(function (d) {
      const cx = xScale(d[attrX]);
      const cy = yScale(d[attrY]);
      if (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1) {
        selectedCountries.add(d.country);
      }
    });

    updateHighlighting();
  }

  // bubbles after brush because I had issues with it in the reverse order
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d[attrX]))
    .attr("cy", (d) => yScale(d[attrY]))
    .attr("r", (d) => sizeScale(d[attrSize]))
    .style("fill", (d) =>
      infantMortalityColorScale(getInfantMortalityBin(d[attrColor])),
    )
    .style("stroke", "#333")
    .style("stroke-width", "0.5px")
    .on("mouseover", function (event, d) {
      d3.select(this).style("stroke-width", "2px");

      // Detailed 4D Tooltip
      tooltip
        .style("display", "block")
        .html(
          `<strong>${d.country}</strong><br/>
               Internet: ${d[attrX].toFixed(1)}%<br/>
               Life Exp: ${d[attrY].toFixed(1)} yrs<br/>
               Health Spend: $${d[attrSize].toFixed(0)}<br/>
               Infant Mortality: ${d[attrColor].toFixed(2)}%`,
        )
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 15 + "px");
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 15 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).style("stroke-width", "0.5px");
      tooltip.style("display", "none");
    });

  //Axes
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .text(confX.label);

  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .text(confY.label);

  //legend below x axis
  const legendY = height + 65; // sits below the x-axis label
  const legendG = svg.append("g").attr("transform", `translate(0, ${legendY})`);

  const mortalityDomain = infantMortalityColorScale.domain();
  const mortalityRange = infantMortalityColorScale.range();
  const swatchSize = 12;
  const swatchGap = 4;

  // Calculate total width of color section so we can center everything
  // Each swatch: swatchSize + swatchGap + textWidth + padding
  const swatchLabelWidths = mortalityDomain.map((label) => label.length * 6.2); // approx px per char
  const colorSectionWidth = mortalityDomain.reduce((acc, label, i) => {
    return acc + swatchSize + swatchGap + swatchLabelWidths[i] + 10;
  }, 0);

  // Size bubble samples
  const sizeSamples = [
    { label: "$100", value: 100 },
    { label: "$2,500", value: 2500 },
    { label: "$10k+", value: 10000 },
  ];
  const bubbleMaxR = sizeScale(10000);
  const bubbleSectionWidth = sizeSamples.reduce((acc, s) => {
    return acc + sizeScale(s.value) * 2 + 4 + s.label.length * 6.2 + 12;
  }, 0);

  const totalLegendWidth = colorSectionWidth + 60 + bubbleSectionWidth; // 60px gap between sections
  const startX = (width - totalLegendWidth) / 2;

  // Label: "Infant Mortality:"
  legendG
    .append("text")
    .attr("x", startX)
    .attr("y", swatchSize - 1)
    .attr("font-size", "0.72rem")
    .attr("font-weight", "bold")
    .attr("fill", "#444")
    .text("Infant Mortality:");

  let cursorX = startX + 105;

  mortalityDomain.forEach((label, i) => {
    legendG
      .append("rect")
      .attr("x", cursorX)
      .attr("y", 0)
      .attr("width", swatchSize)
      .attr("height", swatchSize)
      .attr("rx", 2)
      .attr("fill", mortalityRange[i])
      .attr("stroke", "#999")
      .attr("stroke-width", 0.5);

    legendG
      .append("text")
      .attr("x", cursorX + swatchSize + swatchGap)
      .attr("y", swatchSize - 1)
      .attr("font-size", "0.68rem")
      .attr("fill", "#333")
      .text(label);

    cursorX += swatchSize + swatchGap + swatchLabelWidths[i] + 10;
  });

  cursorX += 10;
  legendG
    .append("line")
    .attr("x1", cursorX)
    .attr("y1", -2)
    .attr("x2", cursorX)
    .attr("y2", swatchSize + 2)
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1);
  cursorX += 14;

  // Label: "Health Spend:"
  legendG
    .append("text")
    .attr("x", cursorX)
    .attr("y", swatchSize - 1)
    .attr("font-size", "0.72rem")
    .attr("font-weight", "bold")
    .attr("fill", "#444")
    .text("Health Spend:");
  cursorX += 82;

  sizeSamples.forEach((s) => {
    const r = sizeScale(s.value);
    legendG
      .append("circle")
      .attr("cx", cursorX + r)
      .attr("cy", swatchSize / 2)
      .attr("r", r)
      .attr("fill", "#aac8e4")
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5);

    legendG
      .append("text")
      .attr("x", cursorX + r * 2 + 4)
      .attr("y", swatchSize - 1)
      .attr("font-size", "0.68rem")
      .attr("fill", "#333")
      .text(s.label);

    cursorX += r * 2 + 4 + s.label.length * 6.2 + 10;
  });
}

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

    // Helper function to render the correct bottom chart based on toggle
    function renderBottomChart() {
      // Find the currently selected chart mode
      const modeRadio = document.querySelector(
        'input[name="chartMode"]:checked',
      );
      const mode = modeRadio ? modeRadio.value : "2d";

      if (mode === "2d") {
        const attr1 = document.querySelector(
          'input[name="attribute1"]:checked',
        ).value;
        const attr2 = document.querySelector(
          'input[name="attribute2"]:checked',
        ).value;

        document.querySelector(
          "#visualizations .chart-container.full-width h2",
        ).textContent =
          attributeConfigs[attr1].label +
          " vs " +
          attributeConfigs[attr2].label;

        createScatterplot(data, attr1, attr2);
      } else {
        create4DBubbleChart(data);
      }
    }

    // Create initial visualizations
    createChoropleth(geoData, data, "Internet", "#map-internet");
    createChoropleth(geoData, data, "LifeExpectancy", "#map-life");
    createHistogram(data, "Internet", "#histogram-internet");
    createHistogram(data, "LifeExpectancy", "#histogram-life");
    renderBottomChart();

    // Event Listeners for controls

    // Toggle for 2D/4D chart
    const chartModeInputs = document.querySelectorAll(
      'input[name="chartMode"]',
    );
    if (chartModeInputs.length > 0) {
      chartModeInputs.forEach((radio) => {
        radio.addEventListener("change", () => {
          selectedCountries.clear();
          updateHighlighting();
          renderBottomChart();
        });
      });
    }

    document.querySelectorAll('input[name="attribute1"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const attr1 = e.target.value;

        // Update titles
        document.querySelector(
          "#maps-section .map-container:first-child h2",
        ).textContent = attributeConfigs[attr1].label + " Distribution";
        document.querySelector(
          "#visualizations .chart-container:first-child h2",
        ).textContent = attributeConfigs[attr1].label + " Distribution";

        // Clear and redraw
        d3.select("#histogram-internet").html("");
        d3.select("#map-internet").html("");

        createHistogram(data, attr1, "#histogram-internet");
        createChoropleth(geoData, data, attr1, "#map-internet");
        renderBottomChart();
      });
    });

    document.querySelectorAll('input[name="attribute2"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const attr2 = e.target.value;

        // Update titles
        document.querySelector(
          "#maps-section .map-container:nth-child(2) h2",
        ).textContent = attributeConfigs[attr2].label + " Distribution";
        document.querySelector(
          "#visualizations .chart-container:nth-child(2) h2",
        ).textContent = attributeConfigs[attr2].label + " Distribution";

        // Clear and redraw
        d3.select("#histogram-life").html("");
        d3.select("#map-life").html("");

        createHistogram(data, attr2, "#histogram-life");
        createChoropleth(geoData, data, attr2, "#map-life");
        renderBottomChart();
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

  // Clear the container first
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
    .value((d) => d[attributeName]) // Tell D3 which property to bin by
    .domain([config.min, config.max])
    .thresholds(config.bins);

  const bins = histogram(data); // Pass the whole array of objects, not just numbers

  // Create scales
  const xScale = d3
    .scaleLinear()
    .domain([config.min, config.max])
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length)])
    .range([height, 0]);

  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("start brush end", brushed);

  svg.append("g").attr("class", "brush").call(brush);

  function brushed({ selection }) {
    if (!selection) {
      selectedCountries.clear();
      updateHighlighting();
      return;
    }

    const [x0, x1] = selection;
    selectedCountries.clear();

    svg.selectAll(".bar").each(function (d) {
      const px0 = xScale(d.x0);
      const px1 = xScale(d.x1);

      if (x1 >= px0 && x0 <= px1) {
        d.forEach((item) => selectedCountries.add(item.country));
      }
    });

    updateHighlighting();
  }
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
    .attr("height", (d) => height - yScale(d.length))
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", "darkblue");

      // Show tooltip
      tooltip
        .style("display", "block")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px")
        .html(
          `<strong>${config.label}</strong><br/>Range: ${d.x0.toFixed(1)} - ${d.x1.toFixed(1)}<br/>Countries: ${d.length}`,
        );
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).style("fill", "steelblue");
      tooltip.style("display", "none");
    });
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

  const brush = d3
    .brush()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("start brush end", brushed);

  svg.append("g").attr("class", "brush").call(brush);

  function brushed({ selection }) {
    if (!selection) {
      selectedCountries.clear();
      updateHighlighting();
      return;
    }

    const [[x0, y0], [x1, y1]] = selection;
    selectedCountries.clear();

    svg.selectAll(".dot").each(function (d) {
      const cx = xScale(d[attribute1Name]);
      const cy = yScale(d[attribute2Name]);
      if (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1) {
        selectedCountries.add(d.country);
      }
    });

    updateHighlighting();
  }
  // Draw dots
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d[attribute1Name]))
    .attr("cy", (d) => yScale(d[attribute2Name]))
    .attr("r", 5)
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", "darkblue").style("opacity", "1");

      // Show tooltip
      tooltip
        .style("display", "block")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px")
        .html(
          `<strong>${d.country}</strong><br/>${config1.label}: ${d[attribute1Name].toFixed(2)}<br/>${config2.label}: ${d[attribute2Name].toFixed(2)}`,
        );
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).style("fill", "steelblue").style("opacity", "0.6");
      tooltip.style("display", "none");
    });
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
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -80)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
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

  const brush = d3
    .brush()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("start brush end", brushed);

  svg.append("g").attr("class", "brush").call(brush);

  function brushed({ selection }) {
    if (!selection) {
      selectedCountries.clear();
      updateHighlighting();
      return;
    }

    const [[x0, y0], [x1, y1]] = selection;
    selectedCountries.clear();

    // Check which countries fall inside the brush box
    svg.selectAll(".country").each(function (d) {
      // Find the [x, y] center point of the country path
      const centroid = path.centroid(d);

      // Make sure the centroid is valid (some maps have missing geometry data)
      if (!isNaN(centroid[0])) {
        const cx = centroid[0];
        const cy = centroid[1];

        // If the country's center is inside the brush box
        if (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1) {
          let countryName = d.properties.name;
          // Apply mapping if the name doesn't match our dataset
          if (countryNameMap[countryName]) {
            countryName = countryNameMap[countryName];
          }
          selectedCountries.add(countryName);
        }
      }
    });

    updateHighlighting();
  }
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

      //show tooltip
      if (value != undefined) {
        tooltip
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .html(
            `<strong>${countryName}</strong><br/>${config.label}: ${value.toFixed(2)}`,
          );
      } else {
        // Show tooltip for no-data countries
        tooltip
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .html(`<strong>${countryName}</strong><br/>No data available`);
      }
    })
    .on("mousemove", function (event) {
      // Update tooltip position as mouse moves
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).style("stroke", "#fff").style("stroke-width", "0.5px");

      // Hide tooltip
      tooltip.style("display", "none");
    });

  // Add legend
  addLegend(svg, colorScale, config, width, height, getBinFunction);
}

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
