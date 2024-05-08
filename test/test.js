const width = 900;
const height = 500;
const margin = 30;
const legendHeight = 50;

d3.csv("element_alone.csv").then((data) => {
    showStackedBarChart(data);
});

function getDomain(data) {
    const categories = data.map(d => d.category);
    return categories;
}

function getRange(data) {
    const uniquecolor = [...new Set(data.map(d => d.color))];
    return uniquecolor;
}

function showStackedBarChart(data) {
    // VARIABLES
    const firstRow = data[0];
    const xLabel = Object.keys(firstRow)[0];
    const stackKeys = Object.keys(firstRow).filter(key => key !== xLabel);
    const columnCount = Object.keys(firstRow).length;
    const category = [];
    for (let i = 1; i < columnCount; i++) {
        category[i - 1] = Object.keys(firstRow)[i];
    }

    // COLOR
    const domain = getDomain(data);
    const range = getRange(data);

    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(data.map(d => d.categories));

    // SVG
    const svg = d3
        .select("body")
        .append("svg")
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin + legendHeight)
        .append("g")
        .attr("transform", `translate(${margin}, ${margin})`);

    const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d[xLabel]))
        .range([0, width])
        .paddingInner(0.4)
        .paddingOuter(0.4);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d3.sum(Object.values(d).slice(1)))])
        .range([height, 0]);

    const xAxis = d3.axisBottom().scale(xScale);
    const xAxisGroup = svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "xAxis-style")
        .call(xAxis);

    const yAxis = d3.axisLeft().scale(yScale);
    const yAxisGroup = svg.append("g").call(yAxis);

    const stack = d3.stack()
        .keys(stackKeys)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    let stacked = stack(data);

    let bars = svg.selectAll(".bar")
        .data(stacked)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("fill", (d, i) => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter();

    const rect = bars.append("rect")
        .attr("x", d => xScale(d.data[xLabel]))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", (xScale.bandwidth()))
        .attr("data-xLabel", d => d.data[xLabel])
        .attr("data-product", d => d.key);

    // LEGEND
    let legend = svg.selectAll(".legend")
        .data(category)
        .enter().append("g")
        .attr("transform", (d, i) => "translate(" + i * 150 + ",0)");

    const legendRect = legend.append("rect")
        .attr("x", margin + 80)
        .attr("y", height + legendHeight)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", d => color(d));

    const legendText = legend.append("text")
        .attr("x", margin + 100)
        .attr("y", height + legendHeight + 5)
        .attr("dy", ".35em")
        .attr("class", "legend-text")
        .style("text-anchor", "start")
        .text(d => d);
        

}
