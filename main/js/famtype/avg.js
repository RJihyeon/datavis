// INITIALIZE
d3.csv("./data/famtype/element_alone(avg).csv").then((data) => { // 초기 csv 파일 표시
    d3.select("button[data-src='./data/famtype/element_alone(avg).csv']").classed('active', true);

    const groupedData = {};

    data.forEach((d) => {
        const group = d.특성별;
        if (!groupedData[group]) {
            groupedData[group] = [];
        }

        groupedData[group].push(d);

    });

    showBarChart(groupedData["한부모 연령별"]);// 초기 차트 표시
    d3.select("#dataSelect input[type='button'][data-group='g1']").classed('active', true); // 초기 버튼 활성화

    d3.selectAll("#dataSelect input[type='button']")
        .on("click", function () {

            d3.selectAll("#dataSelect input[type='button']").classed('active', false);
            d3.select(this).classed('active', true);

            const group = d3.select(this).attr("data-group");
            switch (group) {
                case "g1": showBarChart(groupedData["한부모 연령별"]); break;
                case "g2": showBarChart(groupedData["한부모 학력별"]); break;
                case "g3": showBarChart(groupedData["혼인 상태별"]); break;
                case "g4": showBarChart(groupedData["가구 구성별"]); break;
                case "g5": showBarChart(groupedData["가장 어린 자녀별"]); break;
                case "g6": showBarChart(groupedData["종사상 지위별"]); break;
                case "g7": showBarChart(groupedData["정부 지원 유형별"]); break;
                case "g8": showBarChart(groupedData["소득 수준별"]); break;
                case "g9": showBarChart(groupedData["한부모가된 기간별"]); break;
            }
        });
});


// START (interaction: button click -> choosing 1. csv file 2. type)
d3.selectAll("button").on("click", function () {

    d3.selectAll("button").classed('active', false);
    d3.select(this).classed('active', true);

    // 새로운 csv 파일 버튼이 눌리면, type 버튼은 초기화
    check = this.getAttribute("data-src");
    if (check == "./data/famtype/kids_alone(o).csv")
        csvFile = "./data/famtype/kids_alone(avg).csv";
    else if (check == "./data/famtype/element_alone(o).csv")
        csvFile = "./data/famtype/element_alone(avg).csv";
    else if (check == "./data/famtype/middle_alone(o).csv")
        csvFile = "./data/famtype/middle_alone(avg).csv";

    const type = this.getAttribute("value");
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

        showBarChart(groupedData["한부모 연령별"]); // 초기 차트 표시
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



function showBarChart(data) {
    const width = 500;
    const height = 400;
    const margin = { top: 30, right: 50, bottom: 50, left: 70 };
    d3.select("svg").remove(); // 기존 SVG 제거
    let = sortAscending = true;

    const svg = d3.select("#data-container-avg")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const yScale = d3.scaleBand() // xScale과 yScale을 반전시킵니다.
        .domain(data.map(d => d.구분))
        .range([0, height])
        .padding(0.2);

    const xScale = d3.scaleLinear() // xScale과 yScale을 반전시킵니다.
        .domain([0, d3.max(data, d => d.평균)])
        .range([0, width]);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    const yAxisGroup = svg.append("g") // x축과 y축을 반전시킵니다.
        .attr("class", "yAxis-style")
        .call(yAxis);

    const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "xAxis-style")
        .call(xAxis);

    // Add the label '개수' above the y-axis
    svg.append("text")
        .attr("x", width + 30)  // 가운데 정렬
        .attr("y", height + margin.bottom / 2)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "black")
        .text("시간");

    // Bar 추가
    const bars = svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("fill", "#3CB371")
        .attr("y", d => yScale(d.구분))
        .attr("x", 0) // 막대의 x 위치를 0으로 설정
        .attr("width", d => xScale(d.평균)) // 막대의 너비는 데이터에 따라 달라집니다.
        .attr("height", yScale.bandwidth()) // 막대의 높이는 yScale의 bandwidth로 설정됩니다.
        .attr("data-xLabel", d => d.구분)
        .on("click", () => {
            sortBars();
        });

    // 각 막대의 데이터 값을 텍스트로 추가
    svg.selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.평균))
        .attr("y", d => yScale(d.구분) + yScale.bandwidth() / 2)
        .attr("dx", -80)
        .attr("dy", "0.35em")
        .style("font-size", "18px")
        .style("fill", "white")
        .style("font-weight", "bold")
        .text(d => d.평균 + " 시간");


    // SORTING
    let sortDescending = false;

    function sortBars() {

        data.sort((a, b) => {
            return sortDescending ? b.평균 - a.평균 : a.평균 - b.평균;
        });

        yScale.domain(data.map((d) => d.구분));

        svg
            .selectAll("rect")
            .data(data, (d) => d.구분)
            .transition()
            .duration(1000)
            .attr("y", (d) => yScale(d.구분));

        svg
            .selectAll(".bar-label")
            .data(data, (d) => d.구분)
            .transition()
            .duration(1000)
            .attr("x", (d) => xScale(d.평균)) // 막대의 오른쪽에 텍스트를 위치시킵니다.
            .attr("y", (d) => yScale(d.구분) + yScale.bandwidth() / 2);

        yAxisGroup.transition().duration(1000).call(yAxis);
        sortDescending = !sortDescending;

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
