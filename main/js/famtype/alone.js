// Data Loading
const loadKidsData = d3.csv("./data/famtype/kids_alone.csv");
const loadElementsData = d3.csv("./data/famtype/elements_alone.csv");
const loadMiddlesData = d3.csv("./data/famtype/middles_alone.csv");

Promise.all([loadKidsData, loadElementsData, loadMiddlesData]).then((results) => {
    const [kidsData, elementsData, middlesData] = results;

    const groupedData_kids = {};
    kidsData.forEach((d) => {
        const group = d.특성별;
        if (!groupedData_kids[group]) {
            groupedData_kids[group] = [];
        }
        groupedData_kids[group].push(d);
    });

    const groupedData_elements = {};
    elementsData.forEach((d) => {
        const group = d.특성별;
        if (!groupedData_elements[group]) {
            groupedData_elements[group] = [];
        }
        groupedData_elements[group].push(d);
    });

    const groupedData_middles = {};
    middlesData.forEach((d) => {
        const group = d.특성별;
        if (!groupedData_middles[group]) {
            groupedData_middles[group] = [];
        }
        groupedData_middles[group].push(d);
    });

    d3.select("#dataSelect input[type='button'][data-group='g1']").classed('active', true); // 초기 버튼 활성화
    kids(groupedData_kids["한부모 연령별"]); // 초기 차트 표시
    elements(groupedData_elements["한부모 연령별"]); // 초기 차트 표시
    middles(groupedData_middles["한부모 연령별"]); // 초기 차트 표시

    d3.selectAll("#dataSelect input[type='button']")
        .on("click", function () {
            d3.selectAll("#dataSelect input[type='button']").classed('active', false);
            d3.select(this).classed('active', true);

            const group = d3.select(this).attr("data-group");
            switch (group) {
                case "g1": kids(groupedData_kids["한부모 연령별"]); elements(groupedData_elements["한부모 연령별"]); middles(groupedData_middles["한부모 연령별"]); break;
                case "g2": kids(groupedData_kids["한부모 학력별"]); elements(groupedData_elements["한부모 학력별"]); middles(groupedData_middles["한부모 학력별"]); break;
                case "g3": kids(groupedData_kids["혼인 상태별"]); elements(groupedData_elements["혼인 상태별"]); middles(groupedData_middles["혼인 상태별"]); break;
                case "g4": kids(groupedData_kids["가구 구성별"]); elements(groupedData_elements["가구 구성별"]); middles(groupedData_middles["가구 구성별"]); break;
                case "g5": kids(groupedData_kids["가장 어린 자녀별"]); elements(groupedData_elements["가장 어린 자녀별"]); middles(groupedData_middles["가장 어린 자녀별"]); break;
                case "g6": kids(groupedData_kids["종사상 지위별"]); elements(groupedData_elements["종사상 지위별"]); middles(groupedData_middles["종사상 지위별"]); break;
                case "g7": kids(groupedData_kids["정부 지원 유형별"]); elements(groupedData_elements["정부 지원 유형별"]); middles(groupedData_middles["정부 지원 유형별"]); break;
                case "g8": kids(groupedData_kids["소득 수준별"]); elements(groupedData_elements["소득 수준별"]); middles(groupedData_middles["소득 수준별"]); break;
                case "g9": kids(groupedData_kids["한부모가된 기간별"]); elements(groupedData_elements["한부모가된 기간별"]); middles(groupedData_middles["한부모가된 기간별"]); break;
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
        const margin = { top: 30, right: 50, bottom: 90, left: 120 };

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
            .domain([0, 100])
            .range([height, 0]);

        const yAxis = d3.axisLeft(yScale)
            // .tickValues([0, 50, 100]); // 0, 50, 100만 표시

        const yAxisGroup = svg.append("g")
            .call(yAxis)
            .attr("class", "yAxis-style");

        const xAxis = d3.axisBottom(xScale);

        // x축을 추가하고 xAxisGroup 변수에 저장
        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        // x축 텍스트 스타일 설정
        xAxisGroup.selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)")
            .attr("class", "xAxis-style");
            
        svg.append("text")
            .attr("x", -margin.left + 100)
            .attr("y", -15)
            .style("text-anchor", "end")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("%");

        const barWidth = xScale.bandwidth() / 2;

        // Draw bars for 2018
        svg.selectAll(".bar-2018")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2018")
            .attr("x", d => xScale(d.구분))
            .attr("y", d => yScale(0)) // 초기 y 위치를 0
            .attr("width", barWidth)
            .attr("height", 0) // 초기 높이를 0으로 설정
            .attr("fill", "#FFDAB9")
            .on("mouseover", (event, d) => {
                d3.select("#tooltip")
                    .style("display", "block")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY}px`)
                    .html(`
    <div class="tooltip-label">
        <div>${d.구분}: ${d["2018"]}${" %"}</div>
    </div>`);
            })
            .on("mousemove", (event) => {
                d3.select("#tooltip")
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseleave", () => {
                d3.select("#tooltip").style("display", "none");
            })
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2018"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2018"])); // 높이를 데이터 값에 맞게 조정


        // 막대 위에 데이터 값 표기
        svg.selectAll(".text-2018")
            .data(data)
            .enter().append("text")
            .attr("class", "text-2018")
            .attr("x", d => xScale(d.구분) + barWidth / 2) // 막대의 중앙에 위치
            .attr("y", d => yScale(0)) // 막대의 상단보다 조금 위에 위치
            .attr("text-anchor", "middle") // 텍스트를 중앙 정렬
            .text(d => `${d["2018"]}`) // 표시할 텍스트
            .attr("fill", "black") // 텍스트 색상
            .style("font-size", "12px")
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2018"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2018"]) - 5); // 높이를 데이터 값에 맞게 조정

        // Draw bars for 2021
        svg.selectAll(".bar-2021")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2021")
            .attr("x", d => xScale(d.구분) + barWidth)
            .attr("y", d => yScale(0))
            .attr("width", barWidth)
            .attr("height", 0)
            .attr("fill", "#3CB371")
            .on("mouseover", (event, d) => {
                d3.select("#tooltip")
                    .style("display", "block")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY}px`)
                    .html(`
                    <div class="tooltip-label">
                        <div>${d.구분}: ${d["2021"]}${" %"}</div>
                    </div>`);
            })
            .on("mousemove", (event) => {
                d3.select("#tooltip")
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseleave", () => {
                d3.select("#tooltip").style("display", "none");
            })
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2021"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2021"])); // 높이를 데이터 값에 맞게 조정

        // 2021 데이터에 대한 막대 위에 데이터 값을 표시
        svg.selectAll(".text-2021")
            .data(data)
            .enter().append("text")
            .attr("class", "text-2021")
            .attr("x", d => xScale(d.구분) + barWidth * 1.5) // 막대의 중앙에 위치
            .attr("y", d => yScale(0)) // 막대의 상단보다 조금 위에 위치, 차트 바깥쪽을 향해 더 많은 간격 제공
            .attr("text-anchor", "middle") // 텍스트를 중앙 정렬
            .text(d => `${d["2021"]}`) // 표시할 텍스트
            .attr("fill", "black")
            .style("font-size", "12px")
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2021"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2021"]) ); // 높이를 데이터 값에 맞게 조정

        // LEGEND
        const legend = svg.append("g")
            .attr("transform", `translate(80, -30)`)
            .attr("class", "legend-text");

        const legendData = [
            { year: "2018", color: "#FFDAB9" },
            { year: "2021", color: "#3CB371" }
        ];

        const legendItem = legend.selectAll(".legend")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${i * 80}, 0)`) // Adjust the spacing between items if needed
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                sortBars(d.year);
            });

        legendItem.append("rect")
            .attr("x", 0)
            .attr("y", 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => d.color);

        legendItem.append("text")
            .attr("x", 25)
            .attr("y", 23)
            .text(d => d.year)
            .attr("class", "legend-text");

        let sortDescending = false;
        let sortCategory = "";

        function sortBars(category) {
            if (sortCategory === category) {
                sortDescending = !sortDescending;
            } else {
                sortDescending = false;
            }
            sortCategory = category;

            // 데이터 정렬
            data.sort((a, b) => {
                return sortDescending ? b[category] - a[category] : a[category] - b[category];
            });

            xScale.domain(data.map(d => d.구분));

            svg.selectAll(".bar-2021")
                .data(data, d => d.구분)
                .transition()
                .duration(1000)
                .attr("x", d => xScale(d.구분) + barWidth);

            svg.selectAll(".bar-2018")
                .data(data, d => d.구분)
                .transition()
                .duration(1000)
                .attr("x", d => xScale(d.구분));

            xAxisGroup.transition()
                .duration(1000)
                .call(xAxis);
        }
        // SVG 내에 필터 정의 부분
        const defs = svg.append("defs");

        const dropShadowFilter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "150%")  // 필터 높이를 조절하여 그림자 범위를 조정
            .attr("width", "150%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

        // 가우시안 블러로 그림자 부드러움 조절
        dropShadowFilter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 5)  // 그림자의 흐림 정도 조절
            .attr("result", "blur");

        // 그림자의 위치 조절
        dropShadowFilter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 5)  // 수평 거리 조절
            .attr("dy", 5)  // 수직 거리 조절
            .attr("result", "offsetBlur");

        // 그림자의 색상 및 투명도 조절
        dropShadowFilter.append("feFlood")
            .attr("flood-color", "black")
            .attr("flood-opacity", 0.5)
            .attr("result", "offsetColor");
        dropShadowFilter.append("feComposite")
            .attr("in", "offsetColor")
            .attr("in2", "offsetBlur")
            .attr("operator", "in")
            .attr("result", "offsetBlur");

        // 원본 그래픽과 그림자 병합
        const feMerge = dropShadowFilter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        // 범례의 크기와 위치 계산하여 네모 테두리 추가 및 그림자 적용
        const legendBox = legend.node().getBBox();
        legend.append("rect")
            .attr("x", legendBox.x - 5)
            .attr("y", legendBox.y - 5)
            .attr("width", legendBox.width + 15)
            .attr("height", legendBox.height + 15)
            .attr("stroke", "black")
            .attr("fill", "none")
            .style("filter", "url(#drop-shadow)");  // 여기에 그림자 필터 적용
    }

    function hours(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#kids-hours"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 50, right: 50, bottom: 90, left: 120 };
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
            .attr("height", height + margin.top + margin.bottom)
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
            .call(xAxis);

        xAxisGroup.selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)")
            .attr("class", "xAxis-style");

        const yAxisGroup = svg.append("g")
            .attr("class", "yAxis-style")
            .call(yAxis);

        svg.append("text")
            .attr("x", -margin.left + 100)
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
            .attr("y", d => yScale(0))
            .attr("height", 0)
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
            })
            .transition()
            .duration(500)
            .delay((d, i, nodes) => {
                return (i / nodes.length) * 100; // nodes.length를 사용해 현재 그룹의 막대 수를 기준으로 delay 계산
            })
            .attr("height", d => yScale(d[0]) - yScale(d[1])) // 올바른 높이 계산
            .attr("y", d => yScale(d[1])); // 막대의 최종 위치


        // LEGEND
        const legendWidth = color.domain().length * 100;
        const legendX = (width - legendWidth) / 2;

        const legend = svg.append("g")
            .attr("transform", `translate(0,-55)`);

        const legendItem = legend.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${i * 100}, 0)`);

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

        // SVG 내에 필터 정의 부분
        const defs = svg.append("defs");

        const dropShadowFilter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "150%")  // 필터 높이를 조절하여 그림자 범위를 조정
            .attr("width", "150%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

        // 가우시안 블러로 그림자 부드러움 조절
        dropShadowFilter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 5)  // 그림자의 흐림 정도 조절
            .attr("result", "blur");

        // 그림자의 위치 조절
        dropShadowFilter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 5)  // 수평 거리 조절
            .attr("dy", 5)  // 수직 거리 조절
            .attr("result", "offsetBlur");

        // 그림자의 색상 및 투명도 조절
        dropShadowFilter.append("feFlood")
            .attr("flood-color", "black")
            .attr("flood-opacity", 0.5)
            .attr("result", "offsetColor");
        dropShadowFilter.append("feComposite")
            .attr("in", "offsetColor")
            .attr("in2", "offsetBlur")
            .attr("operator", "in")
            .attr("result", "offsetBlur");

        // 원본 그래픽과 그림자 병합
        const feMerge = dropShadowFilter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        // 범례의 크기와 위치 계산하여 네모 테두리 추가 및 그림자 적용
        const legendBox = legend.node().getBBox();
        legend.append("rect")
            .attr("x", legendBox.x - 5)
            .attr("y", legendBox.y - 5)
            .attr("width", legendBox.width + 15)
            .attr("height", legendBox.height + 15)
            .attr("stroke", "black")
            .attr("fill", "none")
            .style("filter", "url(#drop-shadow)");  // 여기에 그림자 필터 적용

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
        const margin = { top: 0, right: 50, bottom: 30, left: 120 };
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
            .domain([0, 5])
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
        const margin = { top: 30, right: 50, bottom: 90, left: 120 };

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
            .domain([0, 100])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // x축을 추가하고 xAxisGroup 변수에 저장
        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        // x축 텍스트 스타일 설정
        xAxisGroup.selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)")
            .attr("class", "xAxis-style");

        const yAxisGroup = svg.append("g")
            .call(yAxis)
            .attr("class", "yAxis-style");

        svg.append("text")
            .attr("x", -margin.left + 100)
            .attr("y", -15)
            .style("text-anchor", "end")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("%");

        const barWidth = xScale.bandwidth() / 2;

        // Draw bars for 2018
        svg.selectAll(".bar-2018")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2018")
            .attr("x", d => xScale(d.구분))
            .attr("y", d => yScale(0))
            .attr("width", barWidth)
            .attr("height", 0)
            .attr("fill", "#FFDAB9")
            .on("mouseover", (event, d) => {
                d3.select("#tooltip")
                    .style("display", "block")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY}px`)
                    .html(`
        <div class="tooltip-label">
            <div>${d.구분}: ${d["2018"]}${" %"}</div>
        </div>`);
            })
            .on("mousemove", (event) => {
                d3.select("#tooltip")
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseleave", () => {
                d3.select("#tooltip").style("display", "none");
            })
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2018"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2018"])); // 높이를 데이터 값에 맞게 조정

        // 막대 위에 데이터 값 표기
        svg.selectAll(".text-2018")
            .data(data)
            .enter().append("text")
            .attr("class", "text-2018")
            .attr("x", d => xScale(d.구분) + barWidth / 2) // 막대의 중앙에 위치
            .attr("y", d => yScale(0)) // 막대의 상단보다 조금 위에 위치
            .attr("text-anchor", "middle") // 텍스트를 중앙 정렬
            .text(d => `${d["2018"]}`) // 표시할 텍스트
            .attr("fill", "black")
            .style("font-size", "12px")
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2018"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2018"]) - 5); // 높이를 데이터 값에 맞게 조정

        // Draw bars for 2021
        svg.selectAll(".bar-2021")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2021")
            .attr("x", d => xScale(d.구분) + barWidth)
            .attr("y", d => yScale(0))
            .attr("width", barWidth)
            .attr("height",0)
            .attr("fill", "#3CB371")
            .on("mouseover", (event, d) => {
                d3.select("#tooltip")
                    .style("display", "block")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY}px`)
                    .html(`
                <div class="tooltip-label">
                    <div>${d.구분}: ${d["2021"]}${" %"}</div>
                </div>`);
            })
            .on("mousemove", (event) => {
                d3.select("#tooltip")
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseleave", () => {
                d3.select("#tooltip").style("display", "none");
            })
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2021"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2021"])); // 높이를 데이터 값에 맞게 조정

        svg.selectAll(".text-2021")
            .data(data)
            .enter().append("text")
            .attr("class", "text-2021")
            .attr("x", d => xScale(d.구분) + barWidth * 1.5) // 막대의 중앙에 위치
            .attr("y", d => yScale(0)) // 막대의 상단보다 조금 위에 위치, 차트 바깥쪽을 향해 더 많은 간격 제공
            .attr("text-anchor", "middle") // 텍스트를 중앙 정렬
            .text(d => `${d["2021"]}`) // 표시할 텍스트
            .attr("fill", "black")
            .style("font-size", "12px")
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2021"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2021"]) - 10); // 높이를 데이터 값에 맞게 조정

        // LEGEND
        const legend = svg.append("g")
            .attr("transform", `translate(80, -30)`)
            .attr("class", "legend-text");

        const legendData = [
            { year: "2018", color: "#FFDAB9" },
            { year: "2021", color: "#3CB371" }
        ];

        const legendItem = legend.selectAll(".legend")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${i * 80}, 0)`) // Adjust the spacing between items if needed
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                sortBars(d.year);
            });

        legendItem.append("rect")
            .attr("x", 0)
            .attr("y", 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => d.color);

        legendItem.append("text")
            .attr("x", 25)
            .attr("y", 23)
            .text(d => d.year)
            .attr("class", "legend-text");

        let sortDescending = false;
        let sortCategory = "";

        function sortBars(category) {
            if (sortCategory === category) {
                sortDescending = !sortDescending;
            } else {
                sortDescending = false;
            }
            sortCategory = category;

            // 데이터 정렬
            data.sort((a, b) => {
                return sortDescending ? b[category] - a[category] : a[category] - b[category];
            });

            xScale.domain(data.map(d => d.구분));

            svg.selectAll(".bar-2021")
                .data(data, d => d.구분)
                .transition()
                .duration(1000)
                .attr("x", d => xScale(d.구분) + barWidth);

            svg.selectAll(".bar-2018")
                .data(data, d => d.구분)
                .transition()
                .duration(1000)
                .attr("x", d => xScale(d.구분));

            xAxisGroup.transition()
                .duration(1000)
                .call(xAxis);
        }

        // SVG 내에 필터 정의 부분
        const defs = svg.append("defs");

        const dropShadowFilter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "150%")  // 필터 높이를 조절하여 그림자 범위를 조정
            .attr("width", "150%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

        // 가우시안 블러로 그림자 부드러움 조절
        dropShadowFilter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 5)  // 그림자의 흐림 정도 조절
            .attr("result", "blur");

        // 그림자의 위치 조절
        dropShadowFilter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 5)  // 수평 거리 조절
            .attr("dy", 5)  // 수직 거리 조절
            .attr("result", "offsetBlur");

        // 그림자의 색상 및 투명도 조절
        dropShadowFilter.append("feFlood")
            .attr("flood-color", "black")
            .attr("flood-opacity", 0.5)
            .attr("result", "offsetColor");
        dropShadowFilter.append("feComposite")
            .attr("in", "offsetColor")
            .attr("in2", "offsetBlur")
            .attr("operator", "in")
            .attr("result", "offsetBlur");

        // 원본 그래픽과 그림자 병합
        const feMerge = dropShadowFilter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        // 범례의 크기와 위치 계산하여 네모 테두리 추가 및 그림자 적용
        const legendBox = legend.node().getBBox();
        legend.append("rect")
            .attr("x", legendBox.x - 5)
            .attr("y", legendBox.y - 5)
            .attr("width", legendBox.width + 15)
            .attr("height", legendBox.height + 15)
            .attr("stroke", "black")
            .attr("fill", "none")
            .style("filter", "url(#drop-shadow)");  // 여기에 그림자 필터 적용
    }


    function hours(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#elements-hours"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 50, right: 50, bottom: 90, left: 120 };
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
            .attr("height", height + margin.top + margin.bottom)
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

        xAxisGroup.selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)")
            .attr("class", "xAxis-style");

        const yAxisGroup = svg.append("g")
            .attr("class", "yAxis-style")
            .call(yAxis);

        svg.append("text")
            .attr("x", -margin.left + 100)
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
            .attr("y", d => yScale(0))
            .attr("height", 0)
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
            })
            .transition()
            .duration(500)
            .delay((d, i, nodes) => {
                return (i / nodes.length) * 100; // nodes.length를 사용해 현재 그룹의 막대 수를 기준으로 delay 계산
            })
            .attr("height", d => yScale(d[0]) - yScale(d[1])) // 올바른 높이 계산
            .attr("y", d => yScale(d[1])); // 막대의 최종 위치


        // LEGEND
        const legendWidth = color.domain().length * 100;
        const legendX = (width - legendWidth) / 2;

        const legend = svg.append("g")
            .attr("transform", `translate(0, -55)`);

        const legendItem = legend.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${i * 100}, 0)`);

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
        // SVG 내에 필터 정의 부분
        const defs = svg.append("defs");

        const dropShadowFilter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "150%")  // 필터 높이를 조절하여 그림자 범위를 조정
            .attr("width", "150%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

        // 가우시안 블러로 그림자 부드러움 조절
        dropShadowFilter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 5)  // 그림자의 흐림 정도 조절
            .attr("result", "blur");

        // 그림자의 위치 조절
        dropShadowFilter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 5)  // 수평 거리 조절
            .attr("dy", 5)  // 수직 거리 조절
            .attr("result", "offsetBlur");

        // 그림자의 색상 및 투명도 조절
        dropShadowFilter.append("feFlood")
            .attr("flood-color", "black")
            .attr("flood-opacity", 0.5)
            .attr("result", "offsetColor");
        dropShadowFilter.append("feComposite")
            .attr("in", "offsetColor")
            .attr("in2", "offsetBlur")
            .attr("operator", "in")
            .attr("result", "offsetBlur");

        // 원본 그래픽과 그림자 병합
        const feMerge = dropShadowFilter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        // 범례의 크기와 위치 계산하여 네모 테두리 추가 및 그림자 적용
        const legendBox = legend.node().getBBox();
        legend.append("rect")
            .attr("x", legendBox.x - 5)
            .attr("y", legendBox.y - 5)
            .attr("width", legendBox.width + 15)
            .attr("height", legendBox.height + 15)
            .attr("stroke", "black")
            .attr("fill", "none")
            .style("filter", "url(#drop-shadow)");  // 여기에 그림자 필터 적용
    }

    function avg(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#elements-avg"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 0, right: 50, bottom: 30, left: 120 };
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
            .domain([0, 5])
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

// MIDDLES
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
        const margin = { top: 30, right: 50, bottom: 90, left: 120 };

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
            .domain([0, 100])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // x축을 추가하고 xAxisGroup 변수에 저장
        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        // x축 텍스트 스타일 설정
        xAxisGroup.selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)")
            .attr("class", "xAxis-style");

        const yAxisGroup = svg.append("g")
            .call(yAxis)
            .attr("class", "yAxis-style");

        svg.append("text")
            .attr("x", -margin.left + 100)
            .attr("y", -15)
            .style("text-anchor", "end")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("%");

        const barWidth = xScale.bandwidth() / 2;

        // Draw bars for 2018
        svg.selectAll(".bar-2018")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2018")
            .attr("x", d => xScale(d.구분))
            .attr("y", d => yScale(0))
            .attr("width", barWidth)
            .attr("height", 0)
            .attr("fill", "#FFDAB9")
            .on("mouseover", (event, d) => {
                d3.select("#tooltip")
                    .style("display", "block")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY}px`)
                    .html(`
        <div class="tooltip-label">
            <div>${d.구분}: ${d["2018"]}${" %"}</div>
        </div>`);
            })
            .on("mousemove", (event) => {
                d3.select("#tooltip")
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseleave", () => {
                d3.select("#tooltip").style("display", "none");
            })
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2018"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2018"])); // 높이를 데이터 값에 맞게 조정

        // 막대 위에 데이터 값 표기
        svg.selectAll(".text-2018")
            .data(data)
            .enter().append("text")
            .attr("class", "text-2018")
            .attr("x", d => xScale(d.구분) + barWidth / 2) // 막대의 중앙에 위치
            .attr("y", d => yScale(0)) // 막대의 상단보다 조금 위에 위치
            .attr("text-anchor", "middle") // 텍스트를 중앙 정렬
            .text(d => `${d["2018"]}`) // 표시할 텍스트
            .attr("fill", "black")
            .style("font-size", "12px")
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2018"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2018"]) - 5); // 높이를 데이터 값에 맞게 조정

        // Draw bars for 2021
        svg.selectAll(".bar-2021")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-2021")
            .attr("x", d => xScale(d.구분) + barWidth)
            .attr("y", d => yScale(0))
            .attr("width", barWidth)
            .attr("height", 0)
            .attr("fill", "#3CB371")
            .on("mouseover", (event, d) => {
                d3.select("#tooltip")
                    .style("display", "block")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY}px`)
                    .html(`
                <div class="tooltip-label">
                    <div>${d.구분}: ${d["2021"]}${" %"}</div>
                </div>`);
            })
            .on("mousemove", (event) => {
                d3.select("#tooltip")
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
            })
            .on("mouseleave", () => {
                d3.select("#tooltip").style("display", "none");
            })
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2021"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2021"])); // 높이를 데이터 값에 맞게 조정

        svg.selectAll(".text-2021")
            .data(data)
            .enter().append("text")
            .attr("class", "text-2021")
            .attr("x", d => xScale(d.구분) + barWidth * 1.5) // 막대의 중앙에 위치
            .attr("y", d => yScale(0)) // 막대의 상단보다 조금 위에 위치, 차트 바깥쪽을 향해 더 많은 간격 제공
            .attr("text-anchor", "middle") // 텍스트를 중앙 정렬
            .text(d => `${d["2021"]}`) // 표시할 텍스트
            .attr("fill", "black")
            .style("font-size", "12px")
            .transition()
            .duration(500)
            .delay((d, i) => {
                return (i / data.length) * 100;
            })
            .attr("y", d => yScale(d["2021"])) // y 위치를 데이터 값에 맞게 조정
            .attr("height", d => yScale(0) - yScale(d["2021"]) - 10); // 높이를 데이터 값에 맞게 조정


        // LEGEND
        const legend = svg.append("g")
            .attr("transform", `translate(80, -30)`)
            .attr("class", "legend-text");

        const legendData = [
            { year: "2018", color: "#FFDAB9" },
            { year: "2021", color: "#3CB371" }
        ];

        const legendItem = legend.selectAll(".legend")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${i * 80}, 0)`) // Adjust the spacing between items if needed
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                sortBars(d.year);
            });

        legendItem.append("rect")
            .attr("x", 0)
            .attr("y", 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => d.color);

        legendItem.append("text")
            .attr("x", 25)
            .attr("y", 23)
            .text(d => d.year)
            .attr("class", "legend-text");

        let sortDescending = false;
        let sortCategory = "";

        function sortBars(category) {
            if (sortCategory === category) {
                sortDescending = !sortDescending;
            } else {
                sortDescending = false;
            }
            sortCategory = category;

            // 데이터 정렬
            data.sort((a, b) => {
                return sortDescending ? b[category] - a[category] : a[category] - b[category];
            });

            xScale.domain(data.map(d => d.구분));

            svg.selectAll(".bar-2021")
                .data(data, d => d.구분)
                .transition()
                .duration(1000)
                .attr("x", d => xScale(d.구분) + barWidth);

            svg.selectAll(".bar-2018")
                .data(data, d => d.구분)
                .transition()
                .duration(1000)
                .attr("x", d => xScale(d.구분));

            xAxisGroup.transition()
                .duration(1000)
                .call(xAxis);
        }
        // SVG 내에 필터 정의 부분
        const defs = svg.append("defs");

        const dropShadowFilter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "150%")  // 필터 높이를 조절하여 그림자 범위를 조정
            .attr("width", "150%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

        // 가우시안 블러로 그림자 부드러움 조절
        dropShadowFilter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 5)  // 그림자의 흐림 정도 조절
            .attr("result", "blur");

        // 그림자의 위치 조절
        dropShadowFilter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 5)  // 수평 거리 조절
            .attr("dy", 5)  // 수직 거리 조절
            .attr("result", "offsetBlur");

        // 그림자의 색상 및 투명도 조절
        dropShadowFilter.append("feFlood")
            .attr("flood-color", "black")
            .attr("flood-opacity", 0.5)
            .attr("result", "offsetColor");
        dropShadowFilter.append("feComposite")
            .attr("in", "offsetColor")
            .attr("in2", "offsetBlur")
            .attr("operator", "in")
            .attr("result", "offsetBlur");

        // 원본 그래픽과 그림자 병합
        const feMerge = dropShadowFilter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        // 범례의 크기와 위치 계산하여 네모 테두리 추가 및 그림자 적용
        const legendBox = legend.node().getBBox();
        legend.append("rect")
            .attr("x", legendBox.x - 5)
            .attr("y", legendBox.y - 5)
            .attr("width", legendBox.width + 15)
            .attr("height", legendBox.height + 15)
            .attr("stroke", "black")
            .attr("fill", "none")
            .style("filter", "url(#drop-shadow)");  // 여기에 그림자 필터 적용
    }


    function hours(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#middles-hours"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 50, right: 50, bottom: 90, left: 120 };
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
            .attr("height", height + margin.top + margin.bottom)
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

        xAxisGroup.selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)")
            .attr("class", "xAxis-style");

        const yAxisGroup = svg.append("g")
            .attr("class", "yAxis-style")
            .call(yAxis);

        svg.append("text")
            .attr("x", -margin.left + 100)
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
            .attr("y", d => yScale(0))
            .attr("height", 0)
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
            })
            .transition()
            .duration(500)
            .delay((d, i, nodes) => {
                return (i / nodes.length) * 100; // nodes.length를 사용해 현재 그룹의 막대 수를 기준으로 delay 계산
            })
            .attr("height", d => yScale(d[0]) - yScale(d[1])) // 올바른 높이 계산
            .attr("y", d => yScale(d[1])); // 막대의 최종 위치


        // LEGEND
        const legendWidth = color.domain().length * 100;
        const legendX = (width - legendWidth) / 2;

        const legend = svg.append("g")
            .attr("transform", `translate(0,-55)`);

        const legendItem = legend.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${i * 100}, 0)`);

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
        // SVG 내에 필터 정의 부분
        const defs = svg.append("defs");

        const dropShadowFilter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "150%")  // 필터 높이를 조절하여 그림자 범위를 조정
            .attr("width", "150%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

        // 가우시안 블러로 그림자 부드러움 조절
        dropShadowFilter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 5)  // 그림자의 흐림 정도 조절
            .attr("result", "blur");

        // 그림자의 위치 조절
        dropShadowFilter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 5)  // 수평 거리 조절
            .attr("dy", 5)  // 수직 거리 조절
            .attr("result", "offsetBlur");

        // 그림자의 색상 및 투명도 조절
        dropShadowFilter.append("feFlood")
            .attr("flood-color", "black")
            .attr("flood-opacity", 0.5)
            .attr("result", "offsetColor");
        dropShadowFilter.append("feComposite")
            .attr("in", "offsetColor")
            .attr("in2", "offsetBlur")
            .attr("operator", "in")
            .attr("result", "offsetBlur");

        // 원본 그래픽과 그림자 병합
        const feMerge = dropShadowFilter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        // 범례의 크기와 위치 계산하여 네모 테두리 추가 및 그림자 적용
        const legendBox = legend.node().getBBox();
        legend.append("rect")
            .attr("x", legendBox.x - 5)
            .attr("y", legendBox.y - 5)
            .attr("width", legendBox.width + 15)
            .attr("height", legendBox.height + 15)
            .attr("stroke", "black")
            .attr("fill", "none")
            .style("filter", "url(#drop-shadow)");  // 여기에 그림자 필터 적용
    }

    function avg(data) {
        if (!data || data.length === 0) {
            return;
        }
        const container = d3.select("#middles-avg"); // 수정된 부분
        const width = 300;
        const height = 200;
        const margin = { top: 0, right: 50, bottom: 30, left: 120 };
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
            .domain([0, 5])
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

