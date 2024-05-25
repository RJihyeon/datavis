import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../main.css";

function ElementAlone({ voronoi = false }) {
    const svgRef = useRef();
    const width = 1500;
    const height = 500;
    const margin = 30;
    const legendHeight = 50;

    useEffect(() => {
        d3.csv("/domestic_famtype/element_alone.csv").then((data) => {
            showStackedBarChart(data);
        });
    }, []);

    function showStackedBarChart(data) {

        // VARIABLES
        const firstRow = data[0];
        const xLabel = Object.keys(firstRow)[1]; // 0행 1열
        console.log(xLabel); // 구분 (30대 이상, 40대 이상,. ...)

        const stackKeys = Object.keys(firstRow).slice(6, 9); // stack할 값들 = legend
        console.log(stackKeys);

        const columnCount = Object.keys(firstRow).length;

        // COLOR
        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(data.map(d => d.categories));

        // SVG
        const svg = d3.select(svgRef.current);

        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d[xLabel]))
            .range([0, width])
            .paddingInner(0.4)
            .paddingOuter(0.4);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d3.sum(Object.values(d).slice(6, 9)))])
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
            .on("click", function (event, d) {
                console.log(d.key);
                sortBars(d.key);
            })
            .selectAll("rect")
            .data(d => d)
            .enter();

        const rect = bars.append("rect")
            .attr("x", d => xScale(d.data[xLabel]))
            .attr("y", d => yScale(d[1]))
            .attr("height", d => yScale(d[0]) - yScale(d[1]))
            .attr("width", (xScale.bandwidth()))
            .attr("data-xLabel", d => d.data[xLabel]);

        // LEGEND
        let legend = svg.selectAll(".legend")
            .data(stackKeys)
            .enter().append("g")
            .attr("transform", (d, i) => "translate(" + i * 150 + ",0)");

        const legendRect = legend.append("rect")
            .attr("x", margin + 80)
            .attr("y", height + legendHeight)
            .attr("width", 15)
            .attr("height", 15)
            .style("cursor", "pointer")
            .style("fill", d => color(d))
            .on("click", (event, d) => {
                sortBars(d);
                console.log(d);
            });

        const legendText = legend.append("text")
            .attr("x", margin + 100)
            .attr("y", height + legendHeight + 5)
            .attr("dy", ".35em")
            .attr("class", "legend-text")
            .style("text-anchor", "start")
            .style("cursor", "pointer")
            .text(d => d)
            .on("click", (event, d) => {
                sortBars(d);
                console.log(d);
            });

        // SORTING
        let sortDescending = false;
        let sortCategory = {};

        function sortBars(i) {
            for (let index = 0; index < columnCount; index++) {
                if (i === stackKeys[index]) {
                    let nowCategory = stackKeys[index];

                    if (sortCategory === nowCategory) {
                        sortDescending = !sortDescending;
                    } else { sortDescending = false; }

                    if (sortDescending) {
                        data.sort((a, b) => a[nowCategory] - b[nowCategory]);
                        sortCategory = nowCategory;
                    } else if (!sortDescending) {
                        data.sort((a, b) => b[nowCategory] - a[nowCategory]);
                        sortCategory = nowCategory;
                    }
                }
            }

            xScale.domain(data.map(d => d[xLabel]));

            svg.selectAll(".bar")
                .selectAll("rect")
                .data(d => d)
                .transition()
                .duration(1000)
                .attr("x", d => xScale(d.data[xLabel]))
                .attr("y", d => yScale(d[1]));

            xAxisGroup.transition()
                .duration(1000)
                .call(xAxis);
        }
    }
    return <svg ref={svgRef} width={width} height={height}></svg>;

}

export default ElementAlone;
