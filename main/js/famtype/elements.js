// INITIALIZE - KIDS
d3.csv("./data/famtype/kids_alone.csv").then((data) => { // 초기 csv 파일 표시
    const groupedData = {};

    data.forEach((d) => {
        const group = d.특성별;
        if (!groupedData[group]) {
            groupedData[group] = [];
        }
        groupedData[group].push(d);
    });

    kids(groupedData["한부모 연령별"]);// 초기 차트 표시

    d3.select("#dataSelect input[type='button'][data-group='g1']").classed('active', true); // 초기 버튼 활성화

    d3.selectAll("#dataSelect input[type='button']")
        .on("click", function () {

            d3.selectAll("#dataSelect input[type='button']").classed('active', false);
            d3.select(this).classed('active', true);

            const group = d3.select(this).attr("data-group");
            switch (group) {
                case "g1": kids(groupedData["한부모 연령별"]); break;
                case "g2": kids(groupedData["한부모 학력별"]); break;
                case "g3": kids(groupedData["혼인 상태별"]); break;
                case "g4": kids(groupedData["가구 구성별"]); break;
                case "g5": kids(groupedData["가장 어린 자녀별"]); break;
                case "g6": kids(groupedData["종사상 지위별"]); break;
                case "g7": kids(groupedData["정부 지원 유형별"]); break;
                case "g8": kids(groupedData["소득 수준별"]); break;
                case "g9": kids(groupedData["한부모가된 기간별"]); break;
            }
        });
});

// INITIALIZE - Elements
d3.csv("./data/famtype/elements_alone.csv").then((data) => { // 초기 csv 파일 표시
    const groupedData = {};

    data.forEach((d) => {
        const group = d.특성별;
        if (!groupedData[group]) {
            groupedData[group] = [];
        }
        groupedData[group].push(d);
    });

    elements(groupedData["한부모 연령별"]);// 초기 차트 표시

    d3.select("#dataSelect input[type='button'][data-group='g1']").classed('active', true); // 초기 버튼 활성화

    d3.selectAll("#dataSelect input[type='button']")
        .on("click", function () {

            d3.selectAll("#dataSelect input[type='button']").classed('active', false);
            d3.select(this).classed('active', true);

            const group = d3.select(this).attr("data-group");
            switch (group) {
                case "g1": elements(groupedData["한부모 연령별"]); break;
                case "g2": elements(groupedData["한부모 학력별"]); break;
                case "g3": elements(groupedData["혼인 상태별"]); break;
                case "g4": elements(groupedData["가구 구성별"]); break;
                case "g5": elements(groupedData["가장 어린 자녀별"]); break;
                case "g6": elements(groupedData["종사상 지위별"]); break;
                case "g7": elements(groupedData["정부 지원 유형별"]); break;
                case "g8": elements(groupedData["소득 수준별"]); break;
                case "g9": elements(groupedData["한부모가된 기간별"]); break;
            }
        });
});

// INITIALIZE - Middles
d3.csv("./data/famtype/middles_alone.csv").then((data) => { // 초기 csv 파일 표시
    const groupedData = {};

    data.forEach((d) => {
        const group = d.특성별;
        if (!groupedData[group]) {
            groupedData[group] = [];
        }
        groupedData[group].push(d);
    });

    middles(groupedData["한부모 연령별"]);// 초기 차트 표시

    d3.select("#dataSelect input[type='button'][data-group='g1']").classed('active', true); // 초기 버튼 활성화

    d3.selectAll("#dataSelect input[type='button']")
        .on("click", function () {

            d3.selectAll("#dataSelect input[type='button']").classed('active', false);
            d3.select(this).classed('active', true);

            const group = d3.select(this).attr("data-group");
            switch (group) {
                case "g1": middles(groupedData["한부모 연령별"]); break;
                case "g2": middles(groupedData["한부모 학력별"]); break;
                case "g3": middles(groupedData["혼인 상태별"]); break;
                case "g4": middles(groupedData["가구 구성별"]); break;
                case "g5": middles(groupedData["가장 어린 자녀별"]); break;
                case "g6": middles(groupedData["종사상 지위별"]); break;
                case "g7": middles(groupedData["정부 지원 유형별"]); break;
                case "g8": middles(groupedData["소득 수준별"]); break;
                case "g9": middles(groupedData["한부모가된 기간별"]); break;
            }
        });
});

// KIDS
function kids(data) {
    compare(data);
    hours(data);
    avg(data);
    
    function compare(data) {
        if (!data || data.length === 0) {
            return;
        }

        const container = d3.select("#kids-compare");
        container.selectAll("svg").remove();

        const width = 300;
        const height = 200;
        const margin = { top: 30, right: 70, bottom: 80, left: 50 };

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.구분))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(+d["2018"], +d["2021"]))])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        svg.append("g")
            .call(yAxis);

        const barWidth = xScale.bandwidth() / 2;

        // Draw bars for 2018
        svg.selectAll(".bar-2018")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2018")
            .attr("x", d => xScale(d.구분))
            .attr("y", d => yScale(+d["2018"]))
            .attr("width", barWidth)
            .attr("height", d => height - yScale(+d["2018"]))
            .attr("fill", "#FFDAB9");

        // Draw bars for 2021
        svg.selectAll(".bar-2021")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2021")
            .attr("x", d => xScale(d.구분) + barWidth)
            .attr("y", d => yScale(+d["2021"]))
            .attr("width", barWidth)
            .attr("height", d => height - yScale(+d["2021"]))
            .attr("fill", "#3CB371");

        // LEGEND
        const legend = svg.append("g")
            .attr("transform", `translate(${width + 1}, 0)`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 10)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", "#FFDAB9");

        legend.append("text")
            .attr("x", 25)
            .attr("y", 19)
            .text("2018");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 40)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", "#3CB371");

        legend.append("text")
            .attr("x", 25)
            .attr("y", 49)
            .text("2021");
    }

    function hours(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#kids-hours"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 30, right: 30, bottom: 30, left: 80 };
        const legendHeight = 50;
        container.select("svg").remove(); // 수정된 부분

        // COLOR
        const customColors = ["#8CE889", "#3CB371", "#135731"];
        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(["1~3시간", "4~6시간", "7시간 이상"])
            .range(customColors);


        // SVG
        const svg = d3.select("#kids-hours")
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

        svg.append("text")
            .attr("x", -margin.left + 70)
            .attr("y", -15)
            .style("text-anchor", "end")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("%");


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
            .attr("y", 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                sortBars(d);
            });

        legendItem.append("text")
            .attr("x", 24)
            .attr("y", 19)
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

    function avg(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#kids-avg"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 20, right: 50, bottom: 30, left: 150 };
        container.select("svg").remove(); // 수정된 부분


        const svg = d3.select("#kids-avg")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.구분))
            .range([0, height])
            .padding(0.2);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.평균)])
            .range([0, width]);

        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale);

        const yAxisGroup = svg.append("g")
            .style("font-size", "16px")
            .call(yAxis);

        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .attr("class", "xAxis-style")
            .call(xAxis);

        svg.append("text")
            .attr("x", width + 35)
            .attr("y", height + margin.bottom / 2 - 5)
            .style("text-anchor", "middle")
            .style("font-size", "16px")
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
            .attr("x", 0)
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .attr("data-xLabel", d => d.구분)
            .on("click", () => {
                sortBars();
            })
            .transition()
            .attr("width", d => xScale(d.평균))
            .duration(500)
            .delay((d, i) => { // ** 첫 번째부터 순차적으로 나오게 순서별 delay를 줌. 각각 시작 시간 다르게
                return (i / data.length) * 100;
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
                .attr("x", (d) => xScale(d.평균))
                .attr("y", (d) => yScale(d.구분) + yScale.bandwidth() / 2);

            yAxisGroup.transition().duration(1000).call(yAxis);
            sortDescending = !sortDescending;
        }

    }
}

// ELEMENTS
function elements(data) {
    compare(data);
    hours(data);
    avg(data);

    function compare(data) {
        if (!data || data.length === 0) {
            return;
        }

        const container = d3.select("#elements-compare");
        container.selectAll("svg").remove();

        const width = 300;
        const height = 200;
        const margin = { top: 30, right: 70, bottom: 80, left: 50 };

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.구분))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(+d["2018"], +d["2021"]))])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        svg.append("g")
            .call(yAxis);

        const barWidth = xScale.bandwidth() / 2;

        // Draw bars for 2018
        svg.selectAll(".bar-2018")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2018")
            .attr("x", d => xScale(d.구분))
            .attr("y", d => yScale(+d["2018"]))
            .attr("width", barWidth)
            .attr("height", d => height - yScale(+d["2018"]))
            .attr("fill", "#FFDAB9");

        // Draw bars for 2021
        svg.selectAll(".bar-2021")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2021")
            .attr("x", d => xScale(d.구분) + barWidth)
            .attr("y", d => yScale(+d["2021"]))
            .attr("width", barWidth)
            .attr("height", d => height - yScale(+d["2021"]))
            .attr("fill", "#3CB371");

        // LEGEND
        const legend = svg.append("g")
            .attr("transform", `translate(${width + 1}, 0)`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 10)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", "#FFDAB9");

        legend.append("text")
            .attr("x", 25)
            .attr("y", 19)
            .text("2018");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 40)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", "#3CB371");

        legend.append("text")
            .attr("x", 25)
            .attr("y", 49)
            .text("2021");
    }


    function hours(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#elements-hours"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 30, right: 30, bottom: 30, left: 80 };
        const legendHeight = 50;
        container.select("svg").remove(); // 수정된 부분

        // COLOR
        const customColors = ["#8CE889", "#3CB371", "#135731"];
        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(["1~3시간", "4~6시간", "7시간 이상"])
            .range(customColors);


        // SVG
        const svg = d3.select("#elements-hours")
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

        svg.append("text")
            .attr("x", -margin.left + 70)
            .attr("y", -15)
            .style("text-anchor", "end")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("%");


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
            .attr("y", 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                sortBars(d);
            });

        legendItem.append("text")
            .attr("x", 24)
            .attr("y", 19)
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

    function avg(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#elements-avg"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 20, right: 50, bottom: 30, left: 150 };
        container.select("svg").remove(); // 수정된 부분


        const svg = d3.select("#elements-avg")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.구분))
            .range([0, height])
            .padding(0.2);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.평균)])
            .range([0, width]);

        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale);

        const yAxisGroup = svg.append("g")
            .style("font-size", "16px")
            .call(yAxis);

        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .attr("class", "xAxis-style")
            .call(xAxis);

        svg.append("text")
            .attr("x", width + 35)
            .attr("y", height + margin.bottom / 2 - 5)
            .style("text-anchor", "middle")
            .style("font-size", "16px")
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
            .attr("x", 0)
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .attr("data-xLabel", d => d.구분)
            .on("click", () => {
                sortBars();
            })
            .transition()
            .attr("width", d => xScale(d.평균))
            .duration(500)
            .delay((d, i) => { // ** 첫 번째부터 순차적으로 나오게 순서별 delay를 줌. 각각 시작 시간 다르게
                return (i / data.length) * 100;
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
                .attr("x", (d) => xScale(d.평균))
                .attr("y", (d) => yScale(d.구분) + yScale.bandwidth() / 2);

            yAxisGroup.transition().duration(1000).call(yAxis);
            sortDescending = !sortDescending;
        }

    }
}

// ELEMENTS
function middles(data) {
    compare(data);
    hours(data);
    avg(data);

    function compare(data) {
        if (!data || data.length === 0) {
            return;
        }

        const container = d3.select("#middles-compare");
        container.selectAll("svg").remove();

        const width = 300;
        const height = 200;
        const margin = { top: 30, right: 70, bottom: 80, left: 50 };

        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.구분))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(+d["2018"], +d["2021"]))])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        svg.append("g")
            .call(yAxis);

        const barWidth = xScale.bandwidth() / 2;

        // Draw bars for 2018
        svg.selectAll(".bar-2018")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2018")
            .attr("x", d => xScale(d.구분))
            .attr("y", d => yScale(+d["2018"]))
            .attr("width", barWidth)
            .attr("height", d => height - yScale(+d["2018"]))
            .attr("fill", "#FFDAB9");

        // Draw bars for 2021
        svg.selectAll(".bar-2021")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2021")
            .attr("x", d => xScale(d.구분) + barWidth)
            .attr("y", d => yScale(+d["2021"]))
            .attr("width", barWidth)
            .attr("height", d => height - yScale(+d["2021"]))
            .attr("fill", "#3CB371");

        // LEGEND
        const legend = svg.append("g")
            .attr("transform", `translate(${width + 1}, 0)`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 10)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", "#FFDAB9");

        legend.append("text")
            .attr("x", 25)
            .attr("y", 19)
            .text("2018");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 40)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", "#3CB371");

        legend.append("text")
            .attr("x", 25)
            .attr("y", 49)
            .text("2021");
    }


    function hours(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#middles-hours"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 30, right: 30, bottom: 30, left: 80 };
        const legendHeight = 50;
        container.select("svg").remove(); // 수정된 부분

        // COLOR
        const customColors = ["#8CE889", "#3CB371", "#135731"];
        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(["1~3시간", "4~6시간", "7시간 이상"])
            .range(customColors);


        // SVG
        const svg = d3.select("#middles-hours")
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

        svg.append("text")
            .attr("x", -margin.left + 70)
            .attr("y", -15)
            .style("text-anchor", "end")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("%");


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
            .attr("y", 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                sortBars(d);
            });

        legendItem.append("text")
            .attr("x", 24)
            .attr("y", 19)
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

    function avg(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#middles-avg"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 20, right: 50, bottom: 30, left: 150 };
        container.select("svg").remove(); // 수정된 부분


        const svg = d3.select("#middles-avg")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.구분))
            .range([0, height])
            .padding(0.2);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.평균)])
            .range([0, width]);

        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale);

        const yAxisGroup = svg.append("g")
            .style("font-size", "16px")
            .call(yAxis);

        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .attr("class", "xAxis-style")
            .call(xAxis);

        svg.append("text")
            .attr("x", width + 35)
            .attr("y", height + margin.bottom / 2 - 5)
            .style("text-anchor", "middle")
            .style("font-size", "16px")
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
            .attr("x", 0)
            .attr("width", 0)
            .attr("height", yScale.bandwidth())
            .attr("data-xLabel", d => d.구분)
            .on("click", () => {
                sortBars();
            })
            .transition()
            .attr("width", d => xScale(d.평균))
            .duration(500)
            .delay((d, i) => { // ** 첫 번째부터 순차적으로 나오게 순서별 delay를 줌. 각각 시작 시간 다르게
                return (i / data.length) * 100;
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
                .attr("x", (d) => xScale(d.평균))
                .attr("y", (d) => yScale(d.구분) + yScale.bandwidth() / 2);

            yAxisGroup.transition().duration(1000).call(yAxis);
            sortDescending = !sortDescending;
        }

    }
}

d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background-color", "#f9f9f9")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("display", "none");

