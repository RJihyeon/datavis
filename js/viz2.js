const width = 900;
const height = 500;
const margin = 30;
const legendHeight = 50;

// d3.csv("./data_famtype/test_simple.csv").then((dataset) => {
//     showBarChart(dataset);
// });

//     //아래부터 쓰시면 됩니다. 아래 코드는 예시입니다.
const svg = d3.select("#viz2").append("svg")
    .attr("width", width + margin + margin)
    .attr("height", height + margin + margin + legendHeight)
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

svg.selectAll("rect")
    .data([3, 9, 4, 2])
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 40)
    .attr("y", d => 400 - 10 * d)
    .attr("width", 35)
    .attr("height", d => 10 * d)
    .attr("fill", "teal");
