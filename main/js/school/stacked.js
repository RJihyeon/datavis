let groupedData = {};
console.log("stacked");

// 데이터 초기화 함수
function initialize(csvFile, defaultGroup) {
    d3.csv(csvFile).then((data) => {
        groupedData = {};
        data.forEach((d) => {
            const group = d.group;
            if (!groupedData[group]) {
                groupedData[group] = [];
            }
            groupedData[group].push(d);
        });
        console.log("groupedData", groupedData);
        if (groupedData[defaultGroup]) {
            
            showStackedBarChart(groupedData[defaultGroup]); // 초기 차트 표시
            d3.select(`#groupSelect button[data-group='${defaultGroup}']`).classed('active', true); // 초기 버튼 활성화
        } else {
            
        }
        d3.selectAll("#groupSelect button")
            .on("click", function (event) {
                event.preventDefault();
                d3.selectAll("#groupSelect button").classed('active', false);
                d3.select(this).classed('active', true);
                const group = d3.select(this).attr("data-group");
                 if (groupedData[group]) {
                    showStackedBarChart(groupedData[group]);
                } else {
                    console.error("Selected group data not found:", group);
                } // 선택된 그룹 출력
  
            });
    });
}

// 차트 렌더링 함수
function showStackedBarChart(data) {
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const legendHeight = 50;
    d3.select("#school-violence-container svg").remove(); // 기존 SVG 제거
    

    // COLOR
    const customColors = ["#87CEFA", "#4169E1"];
    const color = d3.scaleOrdinal()
        .domain(["학폭피해경험 무", "학폭피해경험 유"])
        .range(customColors);

    // SVG
    const svg = d3.select("#school-violence-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + legendHeight)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "xAxis-style")
        .call(xAxis);

    const yAxisGroup = svg.append("g")
        .attr("class", "yAxis-style")
        .call(yAxis);

    const stack = d3.stack()
        .keys(["학폭피해경험 무", "학폭피해경험 유"]);

    const stackedData = stack(data);

    const layer = svg.selectAll(".layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key));

    layer.selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.data.year))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth());

    // 막대 그래프에 값 표시
    layer.selectAll("text")
        .data(d => d)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.data.year) + xScale.bandwidth() / 2)
        .attr("y", d => {
            if (d.key == "학폭피해경험 무") {
                return yScale((d[0] + (d[1] - d[0]) / 2)); // 중간 위치
            } else {
                return yScale(d[0])-30; // 상단 위치
            }
        })
        .attr("text-anchor", "middle")
        .attr("fill", d => d.key === "학폭피해경험 무" ? "white" : "black")
        .text(d => `${(d[1] - d[0]).toFixed(2)}%`);

    // LEGEND
    const legendWidth = color.domain().length * 150;
    const legendX = (width - legendWidth) / 2;

    const legend = svg.append("g")
        .attr("transform", `translate(${legendX}, ${height + margin.bottom})`);

    const legendItem = legend.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${i * 150}, 0)`);

    legendItem.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)
        .style("cursor", "pointer");

    legendItem.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d)
        .attr("class", "legend-text")
        .style("cursor", "pointer");
//학폭피해경험 유의 경우 추세선그리기
    function drawTrendLine(data) {
           
            const trendData = data.map(d => ({ year: d.year, value: +d["학폭피해경험 무"] }));
        
            const line = d3.line()
                .x(d => xScale(d.year) + xScale.bandwidth() / 2)
                .y(d => yScale(d.value))
                .curve(d3.curveMonotoneX);
        
            svg.append("path")
                .datum(trendData)
                .attr("class", "trend-line")
                .attr("d", line)
                .style("fill", "none")
                .style("stroke", "red")
                .style("stroke-width", 2)
                .style("opacity", 0)
                .transition()
                .duration(500)
                .style("opacity", 1);
        }
        
setTimeout(() => drawTrendLine(data), 100);

}
document.getElementById('school-violence-container').addEventListener('click', function(event) {
    if (event.target.closest('.data-btn') && event.target.hasAttribute('data-groups')) {
        const groups = event.target.getAttribute('data-groups').split(',');
        const src = event.target.getAttribute('data-src');
        const groupSelect = document.getElementById('groupSelect');
        groupSelect.innerHTML = '';  // 기존 내용을 지움

        groups.forEach(group => {
            const input = document.createElement('input');
            input.type = 'button';
            input.value = group;
            input.dataset.src = src;  // data-src 속성 추가
            input.dataset.group = group;  // data-group 속성 추가
            groupSelect.appendChild(input);
        });

        initialize(src, groups[0]);  // 초기 그룹 설정
    }
});

document.getElementById('groupSelect').addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON' && event.target.hasAttribute('data-group')) {
        const src = event.target.getAttribute('data-src');
        const group = event.target.getAttribute('data-group');
        showStackedBarChart(groupedData[group]);  // 선택된 그룹에 맞게 차트 업데이트
    }
});
