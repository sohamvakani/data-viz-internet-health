# Does Internet Access Drive Better Health Outcomes? A Global Look at 176 Countries

**By Soham Vakani** | Data Year: 2022 | 176 Countries

🔗 [Live Demo](https://data-viz-project1-soham-vakani.vercel.app/)

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

## Skethces used for visualization

I did not use any sketches to draw out the way these visualizations would look on the screen but just had a general idea of wanting the world maps next to each other followed by the histograms and then followed by the scatterplot at the end.

## Features and How to interact with the application.

-**Control Panel** - This panel at the top lets you select the attributes you want in all your various charts.

- **Choropleth maps** — visualize the global distribution of any two attributes side by side
- **Histograms** — see how countries are distributed across each attribute's range
- **2D Scatterplot** — compare any two attributes against each other
- **4D Bubble Chart** — encode all four attributes at once using X position, Y position, bubble size, and bubble color
- **Brushing & linking** — click and drag on any chart or map to select countries; all other views highlight your selection in real time

---

## What does this application enables you to discover?

This application lets you discover various geographic patterns in the data as well as the data distribution and checking if the attributes are correlated. Based on my findings all the attributes are very closely positively or negatively related to each other.

Higher life expectancy is directly related to higher internet share , higher healthcare spending leads to lower infant mortality rate which can be seen in the scatterplot in the application.

An interesting thing to note is that United States spends dramatically more per capita on healthcare than any other country in the dataset, yet countries like Norway, Switzerland, and Japan achieve equal or superior life expectancy at a fraction of the cost. When comparing Healthcare Spending vs Life Expectancy on the scatterplot, the US emerges as a notable outlier—positioned far to the right (highest spending) but not at the top (life expectancy). This suggests that higher healthcare spending alone does not guarantee better health outcomes.

--

## Challenges faced and future work

Figuring out the choropleth maps and the brushing was definitely the toughest part of this project but with the help of documentation and looking at some examples of similar projects on Github I was able to work through them

Some future enhancements I want to incorporate is time linked data which would give the user the ability to scroll through various years and see how the data develops. I also want to incorporate dark mode since the interface looks cooler.

--

## Use of AI to build this project

I used Claude Code to help me debug some of my code and also used it to help me code the choropleth maps and figure out why my scatterplot wasn't fitting within my window. I also used it a lot to figure out color schemes and how to get the control panel to look nice and uniform.

--

## Demo Video

Please find my demo video here in my onedrive link:

[Soham Data Viz Project 1 Demo Video](https://mailuc-my.sharepoint.com/:v:/g/personal/vakanisa_mail_uc_edu/IQAGYaR7GJHYSoOxxovQG2nfASV6OqVISV3D_hWIWP7Y8Ak?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=r9OzmB)

## Built With

- [D3.js v7](https://d3js.org/)
- [TopoJSON](https://github.com/topojson/topojson)
- Vanilla HTML, CSS, JavaScript

---
