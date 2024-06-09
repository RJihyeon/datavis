alone();
function alone() {

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

        d3.selectAll("#dataSelect input[type='button'][data-group='g3']")
        .on("mouseover", function () {
            // 버튼 위에 마우스를 올렸을 때 실행될 코드
            const dataSelectRect = document.getElementById("dataSelect").getBoundingClientRect();
            const tooltip = d3.select("#tooltip");
            const tooltipWidth = tooltip.node().offsetWidth;
            const tooltipHeight = tooltip.node().offsetHeight;

            const tooltipLeft = dataSelectRect.left + dataSelectRect.width / 2 - tooltipWidth / 2;
            const tooltipTop = dataSelectRect.top - tooltipHeight - 10; // 위에 여백을 줄 수 있습니다.

            tooltip
                .classed("category", true)
                .style("display", "block")
                .html("'기타'는 이혼, 사별을 제외한 기타 사유(예: 미혼모, 미혼부 등)를 의미한다.")
                .style("left", `${event.pageX}px`)
                .style("top", `${event.pageY}px`);
        })
        .on("mouseout", function () {
            // 버튼에서 마우스를 제거했을 때 실행될 코드
            d3.select("#tooltip")
                .style("display", "none")
                .classed("category", false);
        });
    
        d3.selectAll("#dataSelect input[type='button'][data-group='g4']")
            .on("mouseover", function () {
                // 버튼 위에 마우스를 올렸을 때 실행될 코드
                const dataSelectRect = document.getElementById("dataSelect").getBoundingClientRect();
                const tooltip = d3.select("#tooltip");
                const tooltipWidth = tooltip.node().offsetWidth;
                const tooltipHeight = tooltip.node().offsetHeight;

                const tooltipLeft = dataSelectRect.left + dataSelectRect.width / 2 - tooltipWidth / 2;
                const tooltipTop = dataSelectRect.top - tooltipHeight - 10; // 위에 여백을 줄 수 있습니다.

                tooltip
                    .classed("category", true)
                    .style("display", "block")
                    .html("'기타'는 부, 모, 자녀를 제외한 기타 가족 구성원을 의미한다.")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY}px`);
            })
            .on("mouseout", function () {
                // 버튼에서 마우스를 제거했을 때 실행될 코드
                d3.select("#tooltip")
                    .style("display", "none")
                    .classed("category", false);
            });

        d3.selectAll("#dataSelect input[type='button'][data-group='g5']")
            .on("mouseover", function () {
                // 버튼 위에 마우스를 올렸을 때 실행될 코드
                const dataSelectRect = document.getElementById("dataSelect").getBoundingClientRect();
                const tooltip = d3.select("#tooltip");
                const tooltipWidth = tooltip.node().offsetWidth;
                const tooltipHeight = tooltip.node().offsetHeight;

                const tooltipLeft = dataSelectRect.left + dataSelectRect.width / 2 - tooltipWidth / 2;
                const tooltipTop = dataSelectRect.top - tooltipHeight - 10; // 위에 여백을 줄 수 있습니다.

                tooltip
                    .classed("category", true)
                    .style("display", "block")
                    .html("각 차트의 데이터는 한부모 가정 내 가장 나이가 많은 자녀를 기준으로 수합하였다.")
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY}px`);
            })
            .on("mouseout", function () {
                // 버튼에서 마우스를 제거했을 때 실행될 코드
                d3.select("#tooltip")
                    .style("display", "none")
                    .classed("category", false);
            });

        d3.select("#dataSelect input[type='button'][data-group='g4']").classed('active', true); // 초기 버튼 활성화
        kids(groupedData_kids["가구 구성별"]); // 초기 차트 표시
        elements(groupedData_elements["가구 구성별"]); // 초기 차트 표시
        middles(groupedData_middles["가구 구성별"]); // 초기 차트 표시

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

            const width = 250;
            const height = 150;
            const margin = { top: 60, right: 50, bottom: 90, left: 120 };

            const svg = container.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -40)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("fill", "gray")
                .style("font-weight", "bold")
                .text("미취학 자녀");

            const xScale = d3.scaleBand()
                .domain(data.map(d => d.구분))
                .range([0, width])
                .padding(0.2);

            const yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);

            const yAxis = d3.axisLeft(yScale)
                .ticks(6);

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
                .attr("x", width / 24 - 20)
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
                .attr("fill", "gray") // 텍스트 색상
                .attr("font-weight", "bold")
                .style("font-size", "11px")
                .transition()
                .duration(500)
                .delay((d, i) => {
                    return (i / data.length) * 100;
                })
                .attr("y", d => yScale(d["2018"]) - 5) // y 위치를 데이터 값에 맞게 조정
                .attr("height", d => yScale(0) - yScale(d["2018"])); // 높이를 데이터 값에 맞게 조정

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
                .attr("fill", "gray")
                .style("font-size", "11px")
                .attr("font-weight", "bold")
                .transition()
                .duration(500)
                .delay((d, i) => {
                    return (i / data.length) * 100;
                })
                .attr("y", d => yScale(d["2021"]) - 5) // y 위치를 데이터 값에 맞게 조정
                .attr("height", d => yScale(0) - yScale(d["2021"])); // 높이를 데이터 값에 맞게 조정

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
                .attr("transform", (d, i) => `translate(${i * 70}, 0)`) // Adjust the spacing between items if needed
                .style("cursor", "pointer")
                .on("click", (event, d) => {
                    sortBars(d.year);
                });

            legendItem.append("rect")
                .attr("x", 0)
                .attr("y", 10)
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", d => d.color);

            legendItem.append("text")
                .attr("x", 25)
                .attr("y", 23)
                .text(d => d.year)
                .attr("class", "legend-text");

            const defs = svg.append("defs");

            const dropShadowFilter = defs.append("filter")
                .attr("id", "drop-shadow")
                .attr("height", "125%")  // 필터 높이를 적절히 조절하여 그림자의 범위를 조정
                .attr("width", "125%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

            // 가우시안 블러로 그림자 부드러움 조절
            dropShadowFilter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 3)  // 그림자의 흐림 정도를 적절히 조절
                .attr("result", "blur");

            // 그림자의 위치 조절
            dropShadowFilter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 2)  // 수평 거리를 적절히 조절
                .attr("dy", 3)  // 수직 거리를 적절히 조절
                .attr("result", "offsetBlur");

            // 그림자의 색상 및 투명도 조절
            dropShadowFilter.append("feFlood")
                .attr("flood-color", "rgba(0, 0, 0, 0.1)") // 그림자의 색상을 조절하고 투명도를 높임
                .attr("flood-opacity", 1)
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

            const legendBox = legend.node().getBBox();
            legend.append("rect")
                .attr("x", -70)
                .attr("y", 6.5)
                .attr("width", width)
                .attr("height", legendBox.height + 10)
                .attr("stroke", "gray")
                .attr("stroke-width", 1.5) // 테두리의 두께를 설정
                .attr("rx", 7)  // 라운드 코너 반지름을 설정하여 네모를 라운딩
                .attr("ry", 7)
                .attr("fill", "none")
                .style("filter", "url(#drop-shadow)");  // 여기에 그림자 필터 적용


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

                svg.selectAll(".bar-2018")
                    .data(data, d => d.구분)
                    .transition()
                    .duration(1000)
                    .attr("x", d => xScale(d.구분));

                svg.selectAll(".bar-2021")
                    .data(data, d => d.구분)
                    .transition()
                    .duration(1000)
                    .attr("x", d => xScale(d.구분) + barWidth);

                svg.selectAll(".text-2018")
                    .data(data, d => d.구분) // key 함수를 사용하여 데이터 바인딩
                    .transition() // 위치 변경을 위한 트랜지션
                    .duration(1000) // 트랜지션 지속 시간
                    .attr("x", d => xScale(d.구분) + barWidth / 2) // 정렬된 데이터에 따라 x 위치 업데이트
                    .attr("y", d => yScale(d["2018"])); // 정렬된 데이터에 따라 y 위치 업데이트

                svg.selectAll(".text-2021")
                    .data(data, d => d.구분) // key 함수를 사용하여 데이터 바인딩
                    .transition() // 위치 변경을 위한 트랜지션
                    .duration(1000) // 트랜지션 지속 시간
                    .attr("x", d => xScale(d.구분) + barWidth * 1.5) // 정렬된 데이터에 따라 x 위치 업데이트
                    .attr("y", d => yScale(d["2021"])); // 정렬된 데이터에 따라 y 위치 업데이트


                xAxisGroup.transition()
                    .duration(1000)
                    .call(xAxis);
            }

        }

        function hours(data) {
            if (!data || data.length === 0) {
                return;
            }
            const container = d3.select("#kids-hours"); // 수정된 부분
            const width = 250;
            const height = 150;
            const margin = { top: 80, right: 50, bottom: 90, left: 120 };
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

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -60)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("fill", "gray")
                .style("font-weight", "bold")
                .text("미취학 자녀");

            const xScale = d3.scaleBand()
                .domain(data.map(d => d.구분))
                .range([0, width])
                .padding(0.2);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => +d["1~3시간"] + +d["4~6시간"] + +d["7시간 이상"])])
                .range([height, 0]);

            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale)
                .ticks(5);

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
                .attr("x", width / 24 - 20)
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
                .attr("transform", (d, i) => `translate(${i * 80}, 0)`);

            legendItem.append("rect")
                .attr("x", 5)
                .attr("y", 11)
                .attr("width", 15)
                .attr("height", 15)
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

            const defs = svg.append("defs");

            const dropShadowFilter = defs.append("filter")
                .attr("id", "drop-shadow")
                .attr("height", "125%")  // 필터 높이를 적절히 조절하여 그림자의 범위를 조정
                .attr("width", "125%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

            // 가우시안 블러로 그림자 부드러움 조절
            dropShadowFilter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 3)  // 그림자의 흐림 정도를 적절히 조절
                .attr("result", "blur");

            // 그림자의 위치 조절
            dropShadowFilter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 2)  // 수평 거리를 적절히 조절
                .attr("dy", 3)  // 수직 거리를 적절히 조절
                .attr("result", "offsetBlur");

            // 그림자의 색상 및 투명도 조절
            dropShadowFilter.append("feFlood")
                .attr("flood-color", "rgba(0, 0, 0, 0.1)") // 그림자의 색상을 조절하고 투명도를 높임
                .attr("flood-opacity", 1)
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

            const legendBox = legend.node().getBBox();
            legend.append("rect")
                .attr("x", 0)
                .attr("y", 7)
                .attr("width", width + 3)
                .attr("height", legendBox.height + 10)
                .attr("stroke", "gray")
                .attr("stroke-width", 1.5) // 테두리의 두께를 설정
                .attr("rx", 7)  // 라운드 코너 반지름을 설정하여 네모를 라운딩
                .attr("ry", 7)
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
            const width = 220;
            const height = 150;
            const margin = { top: 40, right: 40, bottom: 30, left: 125 };
            container.select("svg").remove(); // 수정된 부분


            const svg = d3.select("#kids-avg")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -20)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("fill", "gray")
                .style("font-weight", "bold")
                .text("미취학 자녀");

            const yScale = d3.scaleBand()
                .domain(data.map(d => d.구분))
                .range([0, height])
                .padding(0.2);

            const xScale = d3.scaleLinear()
                .domain([0, 5])
                .range([0, width]);

            const yAxis = d3.axisLeft(yScale)
            const xAxis = d3.axisBottom(xScale)
                .ticks(5);


            const yAxisGroup = svg.append("g")
                .attr("class", "xAxis-style")
                .call(yAxis);

            const xAxisGroup = svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .style("font-size", "14px")
                .call(xAxis);

            svg.append("text")
                .attr("x", width + 25)
                .attr("y", height + margin.bottom / 2 - 5)
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
                .attr("dx", 5)
                .attr("dy", "0.35em")
                .style("font-size", "14px")
                .style("fill", "gray")
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

            const width = 250;
            const height = 150;
            const margin = { top: 60, right: 50, bottom: 90, left: 50 };


            const svg = container.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -40)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("fill", "gray")
                .style("font-weight", "bold")
                .text("초등학생 자녀");

            const xScale = d3.scaleBand()
                .domain(data.map(d => d.구분))
                .range([0, width])
                .padding(0.2);

            const yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);


            const yAxis = d3.axisLeft(yScale)
                .ticks(5);

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
                .attr("x", width / 24 - 20)
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
                .attr("fill", "gray")
                .attr("font-weight", "bold")
                .style("font-size", "11px")
                .transition()
                .duration(500)
                .delay((d, i) => {
                    return (i / data.length) * 100;
                })
                .attr("y", d => yScale(d["2018"]) - 5) // y 위치를 데이터 값에 맞게 조정
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
                .attr("fill", "gray")
                .attr("font-weight", "bold")
                .style("font-size", "11px")
                .transition()
                .duration(500)
                .delay((d, i) => {
                    return (i / data.length) * 100;
                })
                .attr("y", d => yScale(d["2021"]) - 5) // y 위치를 데이터 값에 맞게 조정
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
                .attr("transform", (d, i) => `translate(${i * 70}, 0)`) // Adjust the spacing between items if needed
                .style("cursor", "pointer")
                .on("click", (event, d) => {
                    sortBars(d.year);
                });

            legendItem.append("rect")
                .attr("x", 0)
                .attr("y", 10)
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", d => d.color);

            legendItem.append("text")
                .attr("x", 25)
                .attr("y", 23)
                .text(d => d.year)
                .attr("class", "legend-text");

            const defs = svg.append("defs");

            const dropShadowFilter = defs.append("filter")
                .attr("id", "drop-shadow")
                .attr("height", "125%")  // 필터 높이를 적절히 조절하여 그림자의 범위를 조정
                .attr("width", "125%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

            // 가우시안 블러로 그림자 부드러움 조절
            dropShadowFilter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 3)  // 그림자의 흐림 정도를 적절히 조절
                .attr("result", "blur");

            // 그림자의 위치 조절
            dropShadowFilter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 2)  // 수평 거리를 적절히 조절
                .attr("dy", 3)  // 수직 거리를 적절히 조절
                .attr("result", "offsetBlur");

            // 그림자의 색상 및 투명도 조절
            dropShadowFilter.append("feFlood")
                .attr("flood-color", "rgba(0, 0, 0, 0.1)") // 그림자의 색상을 조절하고 투명도를 높임
                .attr("flood-opacity", 1)
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

            const legendBox = legend.node().getBBox();
            legend.append("rect")
                .attr("x", -70)
                .attr("y", 6.5)
                .attr("width", width)
                .attr("height", legendBox.height + 10)
                .attr("stroke", "gray")
                .attr("stroke-width", 1.5) // 테두리의 두께를 설정
                .attr("rx", 7)  // 라운드 코너 반지름을 설정하여 네모를 라운딩
                .attr("ry", 7)
                .attr("fill", "none")
                .style("filter", "url(#drop-shadow)");  // 여기에 그림자 필터 적용



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

                svg.selectAll(".bar-2018")
                    .data(data, d => d.구분)
                    .transition()
                    .duration(1000)
                    .attr("x", d => xScale(d.구분));

                svg.selectAll(".bar-2021")
                    .data(data, d => d.구분)
                    .transition()
                    .duration(1000)
                    .attr("x", d => xScale(d.구분) + barWidth);

                svg.selectAll(".text-2018")
                    .data(data, d => d.구분) // key 함수를 사용하여 데이터 바인딩
                    .transition() // 위치 변경을 위한 트랜지션
                    .duration(1000) // 트랜지션 지속 시간
                    .attr("x", d => xScale(d.구분) + barWidth / 2) // 정렬된 데이터에 따라 x 위치 업데이트
                    .attr("y", d => yScale(d["2018"])); // 정렬된 데이터에 따라 y 위치 업데이트

                svg.selectAll(".text-2021")
                    .data(data, d => d.구분) // key 함수를 사용하여 데이터 바인딩
                    .transition() // 위치 변경을 위한 트랜지션
                    .duration(1000) // 트랜지션 지속 시간
                    .attr("x", d => xScale(d.구분) + barWidth * 1.5) // 정렬된 데이터에 따라 x 위치 업데이트
                    .attr("y", d => yScale(d["2021"])); // 정렬된 데이터에 따라 y 위치 업데이트

                xAxisGroup.transition()
                    .duration(1000)
                    .call(xAxis);
            }

        }


        function hours(data) {
            if (!data || data.length === 0) {
                return;
            }
            const container = d3.select("#elements-hours"); // 수정된 부분
            const width = 250;
            const height = 150;
            const margin = { top: 80, right: 50, bottom: 90, left: 50 };
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

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -60)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("fill", "gray")
                .style("font-weight", "bold")
                .text("초등학생 자녀");

            const xScale = d3.scaleBand()
                .domain(data.map(d => d.구분))
                .range([0, width])
                .padding(0.2);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => +d["1~3시간"] + +d["4~6시간"] + +d["7시간 이상"])])
                .range([height, 0]);

            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale)
                .ticks(5);

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
                .attr("x", width / 24 - 20)
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
                .attr("transform", (d, i) => `translate(${i * 80}, 0)`);

            legendItem.append("rect")
                .attr("x", 5)
                .attr("y", 11)
                .attr("width", 15)
                .attr("height", 15)
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

            const defs = svg.append("defs");

            const dropShadowFilter = defs.append("filter")
                .attr("id", "drop-shadow")
                .attr("height", "125%")  // 필터 높이를 적절히 조절하여 그림자의 범위를 조정
                .attr("width", "125%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

            // 가우시안 블러로 그림자 부드러움 조절
            dropShadowFilter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 3)  // 그림자의 흐림 정도를 적절히 조절
                .attr("result", "blur");

            // 그림자의 위치 조절
            dropShadowFilter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 2)  // 수평 거리를 적절히 조절
                .attr("dy", 3)  // 수직 거리를 적절히 조절
                .attr("result", "offsetBlur");

            // 그림자의 색상 및 투명도 조절
            dropShadowFilter.append("feFlood")
                .attr("flood-color", "rgba(0, 0, 0, 0.1)") // 그림자의 색상을 조절하고 투명도를 높임
                .attr("flood-opacity", 1)
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

            const legendBox = legend.node().getBBox();
            legend.append("rect")
                .attr("x", 0)
                .attr("y", 7)
                .attr("width", width + 3)
                .attr("height", legendBox.height + 10)
                .attr("stroke", "gray")
                .attr("stroke-width", 1.5) // 테두리의 두께를 설정
                .attr("rx", 7)  // 라운드 코너 반지름을 설정하여 네모를 라운딩
                .attr("ry", 7)
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
            const container = d3.select("#elements-avg"); // 수정된 부분
            const width = 220;
            const height = 150;
            const margin = { top: 40, right: 40, bottom: 30, left: 125 };
            container.select("svg").remove(); // 수정된 부분


            const svg = d3.select("#elements-avg")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -20)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("fill", "gray")
                .style("font-weight", "bold")
                .text("초등학생 자녀");

            const yScale = d3.scaleBand()
                .domain(data.map(d => d.구분))
                .range([0, height])
                .padding(0.2);

            const xScale = d3.scaleLinear()
                .domain([0, 5])
                .range([0, width]);

            const yAxis = d3.axisLeft(yScale);
            const xAxis = d3.axisBottom(xScale)
                .ticks(5);

            const yAxisGroup = svg.append("g")
                .attr("class", "xAxis-style")
                .call(yAxis);

            const xAxisGroup = svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .style("font-size", "14px")
                .call(xAxis);

            svg.append("text")
                .attr("x", width + 25)
                .attr("y", height + margin.bottom / 2 - 5)
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
                .attr("dx", 5)
                .attr("dy", "0.35em")
                .style("font-size", "14px")
                .style("fill", "gray")
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

            const width = 250;
            const height = 150;
            const margin = { top: 60, right: 30, bottom: 90, left: 50 };

            const svg = container.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -40)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("fill", "gray")
                .style("font-weight", "bold")
                .text("중학생 이상 자녀");

            const xScale = d3.scaleBand()
                .domain(data.map(d => d.구분))
                .range([0, width])
                .padding(0.2);

            const yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);

            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale)
                .ticks(6);

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
                .attr("x", width / 24 - 20)
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
                .attr("fill", "gray")
                .attr("font-weight", "bold")
                .style("font-size", "11px")
                .transition()
                .duration(500)
                .delay((d, i) => {
                    return (i / data.length) * 100;
                })
                .attr("y", d => yScale(d["2018"]) - 5) // y 위치를 데이터 값에 맞게 조정
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
                .attr("fill", "gray")
                .attr("font-weight", "bold")
                .style("font-size", "11px")
                .transition()
                .duration(500)
                .delay((d, i) => {
                    return (i / data.length) * 100;
                })
                .attr("y", d => yScale(d["2021"]) - 5) // y 위치를 데이터 값에 맞게 조정
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
                .attr("transform", (d, i) => `translate(${i * 70}, 0)`) // Adjust the spacing between items if needed
                .style("cursor", "pointer")
                .on("click", (event, d) => {
                    sortBars(d.year);
                });

            legendItem.append("rect")
                .attr("x", 0)
                .attr("y", 10)
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", d => d.color);

            legendItem.append("text")
                .attr("x", 25)
                .attr("y", 23)
                .text(d => d.year)
                .attr("class", "legend-text");

            const defs = svg.append("defs");

            const dropShadowFilter = defs.append("filter")
                .attr("id", "drop-shadow")
                .attr("height", "125%")  // 필터 높이를 적절히 조절하여 그림자의 범위를 조정
                .attr("width", "125%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

            // 가우시안 블러로 그림자 부드러움 조절
            dropShadowFilter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 3)  // 그림자의 흐림 정도를 적절히 조절
                .attr("result", "blur");

            // 그림자의 위치 조절
            dropShadowFilter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 2)  // 수평 거리를 적절히 조절
                .attr("dy", 3)  // 수직 거리를 적절히 조절
                .attr("result", "offsetBlur");

            // 그림자의 색상 및 투명도 조절
            dropShadowFilter.append("feFlood")
                .attr("flood-color", "rgba(0, 0, 0, 0.1)") // 그림자의 색상을 조절하고 투명도를 높임
                .attr("flood-opacity", 1)
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

            const legendBox = legend.node().getBBox();
            legend.append("rect")
                .attr("x", -70)
                .attr("y", 6.5)
                .attr("width", width)
                .attr("height", legendBox.height + 10)
                .attr("stroke", "gray")
                .attr("stroke-width", 1.5) // 테두리의 두께를 설정
                .attr("rx", 7)  // 라운드 코너 반지름을 설정하여 네모를 라운딩
                .attr("ry", 7)
                .attr("fill", "none")
                .style("filter", "url(#drop-shadow)");  // 여기에 그림자 필터 적용



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

                svg.selectAll(".bar-2018")
                    .data(data, d => d.구분)
                    .transition()
                    .duration(1000)
                    .attr("x", d => xScale(d.구분));

                svg.selectAll(".bar-2021")
                    .data(data, d => d.구분)
                    .transition()
                    .duration(1000)
                    .attr("x", d => xScale(d.구분) + barWidth);

                svg.selectAll(".text-2018")
                    .data(data, d => d.구분) // key 함수를 사용하여 데이터 바인딩
                    .transition() // 위치 변경을 위한 트랜지션
                    .duration(1000) // 트랜지션 지속 시간
                    .attr("x", d => xScale(d.구분) + barWidth / 2) // 정렬된 데이터에 따라 x 위치 업데이트
                    .attr("y", d => yScale(d["2018"])); // 정렬된 데이터에 따라 y 위치 업데이트

                svg.selectAll(".text-2021")
                    .data(data, d => d.구분) // key 함수를 사용하여 데이터 바인딩
                    .transition() // 위치 변경을 위한 트랜지션
                    .duration(1000) // 트랜지션 지속 시간
                    .attr("x", d => xScale(d.구분) + barWidth * 1.5) // 정렬된 데이터에 따라 x 위치 업데이트
                    .attr("y", d => yScale(d["2021"])); // 정렬된 데이터에 따라 y 위치 업데이트

                xAxisGroup.transition()
                    .duration(1000)
                    .call(xAxis);
            }
        }


        function hours(data) {
            if (!data || data.length === 0) {
                return;
            }
            const container = d3.select("#middles-hours"); // 수정된 부분
            const width = 250;
            const height = 150;
            const margin = { top: 80, right: 30, bottom: 90, left: 50 };
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

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -60)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("fill", "gray")
                .style("font-weight", "bold")
                .text("중학생 이상 자녀");

            const xScale = d3.scaleBand()
                .domain(data.map(d => d.구분))
                .range([0, width])
                .padding(0.2);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => +d["1~3시간"] + +d["4~6시간"] + +d["7시간 이상"])])
                .range([height, 0]);

            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale)
                .ticks(5);

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
                .attr("x", width / 24 - 20)
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
                .attr("transform", (d, i) => `translate(${i * 80}, 0)`);

            legendItem.append("rect")
                .attr("x", 5)
                .attr("y", 11)
                .attr("width", 15)
                .attr("height", 15)
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

            const defs = svg.append("defs");

            const dropShadowFilter = defs.append("filter")
                .attr("id", "drop-shadow")
                .attr("height", "125%")  // 필터 높이를 적절히 조절하여 그림자의 범위를 조정
                .attr("width", "125%");  // 필터 너비 또한 그림자의 범위를 조정하기 위해 조절

            // 가우시안 블러로 그림자 부드러움 조절
            dropShadowFilter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 3)  // 그림자의 흐림 정도를 적절히 조절
                .attr("result", "blur");

            // 그림자의 위치 조절
            dropShadowFilter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 2)  // 수평 거리를 적절히 조절
                .attr("dy", 3)  // 수직 거리를 적절히 조절
                .attr("result", "offsetBlur");

            // 그림자의 색상 및 투명도 조절
            dropShadowFilter.append("feFlood")
                .attr("flood-color", "rgba(0, 0, 0, 0.1)") // 그림자의 색상을 조절하고 투명도를 높임
                .attr("flood-opacity", 1)
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

            const legendBox = legend.node().getBBox();
            legend.append("rect")
                .attr("x", 0)
                .attr("y", 7)
                .attr("width", width + 3)
                .attr("height", legendBox.height + 10)
                .attr("stroke", "gray")
                .attr("stroke-width", 1.5) // 테두리의 두께를 설정
                .attr("rx", 7)  // 라운드 코너 반지름을 설정하여 네모를 라운딩
                .attr("ry", 7)
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
            const container = d3.select("#middles-avg"); // 수정된 부분
            const width = 220;
            const height = 150;
            const margin = { top: 40, right: 40, bottom: 30, left: 125 };
            container.select("svg").remove(); // 수정된 부분


            const svg = d3.select("#middles-avg")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -20)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("fill", "gray")
                .style("font-weight", "bold")
                .text("중학생 이상 자녀");

            const yScale = d3.scaleBand()
                .domain(data.map(d => d.구분))
                .range([0, height])
                .padding(0.2);

            const xScale = d3.scaleLinear()
                .domain([0, 5])
                .range([0, width]);

            const yAxis = d3.axisLeft(yScale);
            const xAxis = d3.axisBottom(xScale)
                .ticks(5);

            const yAxisGroup = svg.append("g")
                .attr("class", "xAxis-style")
                .call(yAxis);

            const xAxisGroup = svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .style("font-size", "14px")
                .call(xAxis);

            svg.append("text")
                .attr("x", width + 25)
                .attr("y", height + margin.bottom / 2 - 5)
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
                .attr("dx", 5)
                .attr("dy", "0.35em")
                .style("font-size", "14px")
                .style("fill", "gray")
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

}