// Internet Access vs Life Expectancy Visualization

d3.csv("data/internet-access.csv").then((internetData) => {
  d3.csv("data/life-expectancy.csv").then((lifeExpectancyData) => {
    console.log("Internet Access Data:", internetData);
    console.log("Life Expectancy Data:", lifeExpectancyData);

    // We'll process and merge the data here
    // And create visualizations
  });
});
