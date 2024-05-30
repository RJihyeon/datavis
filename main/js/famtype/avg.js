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

        showBarChart(groupedData["한부모 연령별"]); // 초기 차트 표시
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
}


function showBarChart(data) {
    const width = 400;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    d3.select("svg").remove(); // 기존 SVG 제거
    let = sortAscending = true;

    const svg = d3.select("#data-container-avg")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.구분))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain(data.map((d) => d.평균))
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

    // Add the label '개수' above the y-axis
    svg.append("text")
        .attr("x", -margin.left + 50)  // Align with the y-axis
        .attr("y", -15)                // Position above the y-axis
        .style("text-anchor", "end")
        .style("font-size", "14px")    // Adjust the font size as needed
        .style("fill", "black")        // Adjust the text color as needed
        .text("%");

    //Bar 추가
    const bars = svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => xScale(d.구분))
        .attr("y", d => yScale(d.평균))
        .attr("height", d => yScale(0) - yScale(d.평균))
        .attr("width", xScale.bandwidth())
        .attr("data-xLabel", d => d.구분);
        // .on("click", (event, d) => {
        //     event.stopPropagation(); // 이벤트 전파 중지
        //     sortBars(d);
        // })
        // .on("mouseover", (event, d) => {
        //     d3.select("#tooltip")
        //         .style("display", "block")
        //         .html(`
        //             <div class="tooltip-label">
        //                 <div>${d3.select(event.target.parentNode).datum().key}: ${Math.floor(d[1] - d[0])}${" %"}</div>
        //             </div>`);
        // })
        // .on("mousemove", (event) => {
        //     d3.select("#tooltip")
        //         .style("left", event.pageX + 10 + "px")
        //         .style("top", event.pageY + 10 + "px");
        // })
        // .on("mouseleave", () => {
        //     d3.select("#tooltip").style("display", "none");
        // });

        
    // function sortBars() {
    //     data.sort((a, b) => {
    //         return sortAscending
    //             ? d3.ascending(a.age, b.age)
    //             : d3.descending(a.age, b.age);
    //     });
    //     yScale.domain(data.map((d) => d.name));
    //     svg
    //         .selectAll("rect")
    //         .data(data, (d) => d.name)
    //         .transition()
    //         .duration(1000)
    //         .attr("y", (d) => yScale(d.name));
    //     yAxisGroup.transition().duration(1000).call(yAxis);
    //     sortAscending = !sortAscending;

    // }

    bars.on("click", () => {
        console.log();
        sortBars();
    });
}

