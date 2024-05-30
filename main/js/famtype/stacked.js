// INITIALIZE
d3.csv("./data/famtype/element_alone(o).csv").then((data) => { // 초기 csv 파일 표시
    d3.select("button[data-src='./data/famtype/element_alone(o).csv']").classed('active', true);

    const groupedData = {};

    data.forEach((d) => {
        const group = d.특성별;
        if (!groupedData[group]) {
            groupedData[group] = [];
        }
        
        groupedData[group].push(d);
        
    });
    
    showStackedBarChart(groupedData["한부모 연령별"]);// 초기 차트 표시
    d3.select("#dataSelect input[type='button'][data-group='g1']").classed('active', true); // 초기 버튼 활성화
    
    d3.selectAll("#dataSelect input[type='button']")
        .on("click", function () {

            d3.selectAll("#dataSelect input[type='button']").classed('active', false);
            d3.select(this).classed('active', true);

            const group = d3.select(this).attr("data-group");
            switch (group) {
                case "g1": showStackedBarChart(groupedData["한부모 연령별"]); break;
                case "g2": showStackedBarChart(groupedData["한부모 학력별"]); break;
                case "g3": showStackedBarChart(groupedData["혼인 상태별"]); break;
                case "g4": showStackedBarChart(groupedData["가구 구성별"]); break;
                case "g5": showStackedBarChart(groupedData["가장 어린 자녀별"]); break;
                case "g6": showStackedBarChart(groupedData["종사상 지위별"]); break;
                case "g7": showStackedBarChart(groupedData["정부 지원 유형별"]); break;
                case "g8": showStackedBarChart(groupedData["소득 수준별"]); break;
                case "g9": showStackedBarChart(groupedData["한부모가된 기간별"]); break;
            }
        });
});


// START (interaction: button click -> choosing 1. csv file 2. type)
d3.selectAll("button").on("click", function () {

    d3.selectAll("button").classed('active', false);
    d3.select(this).classed('active', true);

    // 새로운 csv 파일 버튼이 눌리면, type 버튼은 초기화
    csvFile = this.getAttribute("data-src");
    const type = this.getAttribute("data-type");
    d3.selectAll("#dataSelect input[type='button']").each(function () {
        if (this.getAttribute("data-group") === type) {
            d3.select(this).classed('active', true);
        } else {
            d3.select(this).classed('active', false);
        }
    });

    loadData(csvFile);
});



function loadData(csvFile) {
    d3.csv(csvFile).then((data) => {

        const groupedData = {};

        data.forEach((d) => {
            const group = d.특성별;
            if (!groupedData[group]) {
                groupedData[group] = [];
            }
            groupedData[group].push(d);
        });

        showStackedBarChart(groupedData["한부모 연령별"]); // 초기 차트 표시
        d3.select("#dataSelect input[type='button'][data-group='g1']").classed('active', true); // 초기 버튼 활성화

        d3.selectAll("#dataSelect input[type='button']")
            .on("click", function () {

                d3.selectAll("#dataSelect input[type='button']").classed('active', false);
                d3.select(this).classed('active', true);

                const group = d3.select(this).attr("data-group");
                switch (group) {
                    case "g1": showStackedBarChart(groupedData["한부모 연령별"]); break;
                    case "g2": showStackedBarChart(groupedData["한부모 학력별"]); break;
                    case "g3": showStackedBarChart(groupedData["혼인 상태별"]); break;
                    case "g4": showStackedBarChart(groupedData["가구 구성별"]); break;
                    case "g5": showStackedBarChart(groupedData["가장 어린 자녀별"]); break;
                    case "g6": showStackedBarChart(groupedData["종사상 지위별"]); break;
                    case "g7": showStackedBarChart(groupedData["정부 지원 유형별"]); break;
                    case "g8": showStackedBarChart(groupedData["소득 수준별"]); break;
                    case "g9": showStackedBarChart(groupedData["한부모가된 기간별"]); break;
                }
            });
    });
}

function showStackedBarChart(data) {
    const width = 800;
    const height = 500;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const legendHeight = 50;
    d3.select("svg").remove(); // 기존 SVG 제거

    // COLOR
    const customColors = ["#87CEFA", "#4169E1", "#00008B"];
    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(["1~3시간", "4~6시간", "7시간 이상"])
        .range(customColors);


    // SVG
    const svg = d3.select("#data-container-fam")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + legendHeight)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.구분))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d["1~3시간"] + +d["4~6시간"] + +d["7시간 이상"])])
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
        .keys(["1~3시간", "4~6시간", "7시간 이상"]);

    const stackedData = stack(data);

    svg.selectAll(".layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.data.구분))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("data-xLabel", d => d.data.구분)
        .on("click", (event, d) => {
            event.stopPropagation(); // 이벤트 전파 중지
            sortBars(d);
        })
        .on("mouseover", (event, d) => {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <div class="tooltip-label">
                        <div>${d3.select(event.target.parentNode).datum().key}: ${Math.floor(d[1] - d[0])}${" %"}</div>
                    </div>`);
        })
        .on("mousemove", (event) => {
            d3.select("#tooltip")
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");
        })
        .on("mouseleave", () => {
            d3.select("#tooltip").style("display", "none");
        });


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
        .style("cursor", "pointer")
        .on("click", (event, d) => {
            sortBars(d);
        });

    legendItem.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d)
        .attr("class", "legend-text")
        .style("cursor", "pointer")
        .on("click", (event, d) => {
            sortBars(d);
        });

    // SORTING
    let sortDescending = false;
    let sortCategory = "";

    function sortBars(category) {
        if (sortCategory === category) {
            sortDescending = !sortDescending;
        } else {
            sortDescending = false;
        }
        sortCategory = category;

        data.sort((a, b) => {
            return sortDescending ? b[category] - a[category] : a[category] - b[category];
        });

        xScale.domain(data.map(d => d.구분));

        svg.selectAll(".layer")
            .selectAll("rect")
            .data(d => d)
            .transition()
            .duration(1000)
            .attr("x", d => xScale(d.data.구분));

        xAxisGroup.transition()
            .duration(1000)
            .call(xAxis);
    }
}

d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("display", "none");