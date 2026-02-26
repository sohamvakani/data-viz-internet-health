# Does Internet Access Drive Better Health Outcomes? A Global Look at 176 Countries

**By Soham Vakani** | Data Year: 2022 | 176 Countries

🔗 [Live Demo](data-viz-project1-soham-vakani.vercel.app)

---

## Motivation

As internet access expands across the globe, so does its potential to transform how people access healthcare information, connect with services, and improve their quality of life. But does greater connectivity actually correlate with better health outcomes?

This interactive visualization lets you explore those questions across 176 countries simultaneously. By bringing together four key indicators: internet access, life expectancy, healthcare spending, and infant mortality rate. It allows you to spot global patterns that wouldn't be visible from any single dataset alone. You might notice, for example, that high-income countries tend to cluster in the top-right of the scatterplot, with both high internet access and long life expectancies, while lower-income nations tell a very different story. The goal is to make these relationships easy to understand and explore.

---

## Data

All data comes from [Our World in Data](https://ourworldindata.org/), a nonprofit research organization based at the University of Oxford that publishes open-access datasets on global development indicators.

The dataset covers **176 countries** for the year **2022** and includes the following four attributes:

| Attribute                 | Description                                               | Unit             |
| ------------------------- | --------------------------------------------------------- | ---------------- |
| **Internet Access**       | Share of the population using the internet                | %                |
| **Life Expectancy**       | Average number of years a newborn is expected to live     | Years            |
| **Healthcare Spending**   | Government and private health expenditure per person      | USD per capita   |
| **Infant Mortality Rate** | Deaths of children under 1 year old per 1,000 live births | Per 1,000 births |

The four attributes were merged into a single CSV from separate Our World in Data sources and filtered to include only countries with complete data across all four indicators.

Internet Access Dataset : https://ourworldindata.org/grapher/share-of-individuals-using-the-internet?time=2022
Life Expectancy Dataset : https://ourworldindata.org/grapher/life-expectancy?tab=map&time=2022
Healthcare Spending Dataset : https://ourworldindata.org/grapher/annual-healthcare-expenditure-per-capita?time=2022
Infant Mortality Rate Dataset : https://ourworldindata.org/grapher/infant-mortality?time=2022

---

## Features

- **Choropleth maps** — visualize the global distribution of any two attributes side by side
- **Histograms** — see how countries are distributed across each attribute's range
- **2D Scatterplot** — compare any two attributes against each other
- **4D Bubble Chart** — encode all four attributes at once using X position, Y position, bubble size, and bubble color
- **Brushing & linking** — click and drag on any chart or map to select countries; all other views highlight your selection in real time

---

## Built With

- [D3.js v7](https://d3js.org/)
- [TopoJSON](https://github.com/topojson/topojson)
- Vanilla HTML, CSS, JavaScript

---

##PENDING 1 section on any sketches that you used to help design your visualization environment pending.
