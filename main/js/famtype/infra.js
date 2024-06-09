infra();

function infra() {
    d3.select("#centerSelect input[type='button'][center-group='c0']").classed('active', true); // 초기 버튼 활성화
    drawMap("시설 전체", "#e98b1f");
    drawBar("시설 전체(수)", "#e98b1f");
    drawBox("./data/famtype/생활지원시설.csv", "#e98b1f");

    d3.selectAll("#centerSelect input[type='button']")
        .on("click", function () {
            d3.selectAll("#centerSelect input[type='button']").classed('active', false);
            d3.select(this).classed('active', true);

            const group = d3.select(this).attr("center-group");
            switch (group) {
                case "c0": facilityName = "시설 전체"; color = "#e98b1f"; facilityNum = "시설 전체(수)"; break;
                case "c1": facilityName = "생활지원시설"; color = "#F08080"; facilityNum = "생활지원시설(수)"; src = "./data/famtype/생활지원시설.csv"; break;
                case "c2": facilityName = "양육지원시설"; color = "#1E90FF"; facilityNum = "양육지원시설(수)"; src = "./data/famtype/양육지원시설.csv"; break;
                case "c3": facilityName = "일시지원 복지시설"; color = "#6A5ACD"; facilityNum = "일시지원 복지시설(수)"; src = "./data/famtype/일시지원 복지시설.csv"; break;
                case "c4": facilityName = "출산지원시설"; color = "#BA55D3"; facilityNum = "출산지원시설(수)"; src = "./data/famtype/출산지원시설.csv"; break;
                case "c5": facilityName = "한부모가족 복지상담소"; color = "#008080"; facilityNum = "한부모가족 복지상담소(수)"; break;
            }

            drawMap(facilityName, color);
            drawBar(facilityNum, color);
            drawBox(src, color);
        });

    function drawMap(count, color) {

        const width = 800;
        const height = 600;

        d3.select("#map-container").selectAll("svg").remove();

        const svg = d3.select("#map-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // 대한민국 지도 데이터 로드
        d3.json("./data/famtype/provinces-topo.json").then(mapData => {
            const projection = d3.geoMercator()
                .center([127.766922, 35.907757])
                .scale(5000)
                .translate([width / 2, height / 2]);

            const path = d3.geoPath().projection(projection);

            d3.csv("./data/famtype/center.csv").then(data => {
                data.forEach(d => {
                    d[count] = +d[count];
                });

                // 지도 그리기
                const mapLayer = svg.append("g")
                    .attr("class", "map-layer");

                const features = topojson.feature(mapData, mapData.objects['provinces-geo']).features;

                mapLayer.selectAll("path")
                    .data(features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .attr("fill", "#9ACD32")
                    .attr("stroke", "white")
                    .attr("stroke-width", "1.5px");

                // 버블 차트 추가
                const bubbleLayer = svg.append("g")
                    .attr("class", "bubble-layer");

                bubbleLayer.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", d => projection([+d.lon, +d.lat])[0])
                    .attr("cy", d => projection([+d.lon, +d.lat])[1])
                    .attr("r", d => Math.sqrt(d[count]) * 7)
                    .attr("class", "bubble")
                    .attr("fill", color)
                    .attr("stroke-width", "1px")
                    .attr("opacity", "0.6");

                // 지역 이름 표시
                const labelLayer = svg.append("g")
                    .attr("class", "label-layer");

                labelLayer.selectAll("text")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("x", d => projection([+d.lon, +d.lat])[0])
                    .attr("y", d => projection([+d.lon, +d.lat])[1])
                    .attr("dy", ".35em")
                    .attr("class", "region-label")
                    .text(d => d.region)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "#333")
                    .attr("cursor", "pointer")
                    .on("mouseover", function () {
                        d3.select(this).attr("fill", "lemonchiffon")
                            .style("text-shadow", "1px 1px 2px #000");
                        const regionName = d3.select(this).text();
                        const regionBubble = bubbleLayer.selectAll("circle")
                            .filter(d => d.region === regionName);
                        regionBubble.attr("stroke", "lemonchiffon")
                            .attr("stroke-width", "2px")
                            .attr("stroke-dasharray", "3,3");

                    })
                    .on("click", function (d) {
                        // 기존에 추가된 텍스트 제거
                        svg.selectAll(".guide-label").remove();
                        // 클릭한 지역명 가져오기
                        const clickedRegionName = d3.select(this).text();
                        // 클릭한 지역의 데이터 가져오기
                        const clickedRegionData = data.find(item => item.region === clickedRegionName);
                        // 클릭한 지역명과 해당 데이터를 텍스트로 표시
                        svg.append("text")
                            .attr("class", "guide-label")
                            .attr("x", width / 2) // 가운데 정렬
                            .attr("y", 17) // 상단에 위치
                            .attr("text-anchor", "middle")
                            .text(`${clickedRegionName}: ${Math.floor(clickedRegionData[count])}%`)
                            .attr("fill", "black")
                            .attr("font-weight", "bold");
                    })

                    .on("mouseout", function () {
                        if (!d3.select(this).classed('active')) { // active 상태가 아닌 경우에만 적용
                            d3.select(this).attr("fill", "#333")
                                .style("text-shadow", "none");
                            const regionName = d3.select(this).text();
                            const regionBubble = bubbleLayer.selectAll("circle")
                                .filter(d => d.region === regionName);
                            regionBubble.attr("stroke", "none");
                        }
                    });

                // 클릭 이벤트를 svg 레이어에 바인딩
                svg.on("click", function (event) {
                    const [x, y] = d3.pointer(event);
                    const clickedRegion = mapLayer.selectAll("path").filter(function (d) {
                        return d3.geoContains(d, projection.invert([x, y]));
                    }).data();

                    if (clickedRegion.length > 0) {
                        const regionName = clickedRegion[0].properties.name;
                        const regionData = data.find(item => item.region === regionName);
                        console.log(regionData);
                    }
                });
            });
        });
    };
    function drawBar(center, color) {
        const container = d3.select("#bar-container1");
        container.selectAll("svg").remove();

        // SVG 요소의 너비와 높이 설정
        const margin = { top: 50, right: 50, bottom: 70, left: 50 };
        const width = 530 - margin.left - margin.right;
        const height = 330 - margin.top - margin.bottom;

        // SVG 요소 추가
        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // 데이터 로드
        d3.csv("./data/famtype/center.csv").then(data => {
            // 선택된 기관의 데이터 필터링 및 정렬
            const facilityData = data.map(d => ({
                region: d.region,
                count: +d[center] // count 값을 숫자로 변환
            })).filter(d => d.count > 0) // count가 0보다 큰 데이터만 포함
                .sort((a, b) => b.count - a.count); // 내림차순 정렬

            // X 스케일 설정
            const x = d3.scaleBand()
                .domain(facilityData.map(d => d.region))
                .range([0, width])
                .padding(0.1);

            // Y 스케일 설정
            const y = d3.scaleLinear()
                .domain([0, d3.max(facilityData, d => d.count)])
                .nice() // 최대값을 적절히 조정하여 눈금 표시
                .range([height, 0]);

            // 고유한 y 값만 추출
            const uniqueYValues = Array.from(new Set(facilityData.map(d => d.count)));

            // X 축 생성
            const xAxisGroup = svg.append("g")
                .attr("class", "x-axis") // x 축에 클래스 추가
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end")
                .style("font-weight", "bold")
                .style("font-size", "13px");

            svg.append("text")
                .attr("x", width / 24 - 20)
                .attr("y", -15)
                .style("text-anchor", "end")
                .style("font-size", "11px")
                .style("fill", "black")
                .text("개수");

                //제목추가
                svg.append("text")
                .attr("x", (width + margin.left + margin.right) / 2 - 40)
                .attr("y", 0 - (margin.top - 20))
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("font-weight", "bold")
                .text("지역별 각 시설의 개수 (수)");

            // Y 축 생성 및 보조선 추가
            svg.append("g")
                .call(d3.axisLeft(y).tickValues(uniqueYValues).tickFormat(d3.format("d"))) // 고유한 y 값만 사용하여 축 설정
                .selectAll("text")
                .attr("fill", "black")
                .style("font-size", "11px"); // y 축 텍스트 크기 설정

            // 보조선 추가
            svg.selectAll("line.grid")
                .data(uniqueYValues)
                .enter()
                .append("line")
                .attr("class", "grid")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => y(d))
                .attr("y2", d => y(d))
                .attr("stroke", "lightgray")
                .attr("stroke-dasharray", "2,2");

                const tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("background", "#fff")
                .style("padding", "3px")
                .style("border", "1px solid #ddd")
                .style("border-radius", "5px")
                .style("pointer-events", "none")
                .style("font-size", "12px")
                .style("opacity", 0);
            
            // 막대 생성
            const bars = svg.selectAll(".bar")
                .data(facilityData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.region))
                .attr("width", x.bandwidth())
                .attr("fill", color)
                .attr("y", height) // 초기 높이 설정
                .attr("height", 0) // 초기 높이 설정
                .on("mouseover", function (d, i) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                        tooltip.html(i.region + ": 총 " + i.count + "개") // 수정된 부분
                        .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
                })
                    .on("mouseout", function (d) {
                        tooltip.transition(300)
                            .style("opacity", 0);
                    })
                .transition()
                .duration(500)
                .delay((d, i) => i * 100)
                .attr("height", d => height - y(d.count)) // 올바른 높이 계산
                .attr("y", d => y(d.count)); // 막대의 최종 위치

        });
    }
    function drawBox(dataSrc, color) {
        const container = d3.select("#bar-container2");
        container.selectAll("svg").remove();

        // SVG 요소의 너비와 높이 설정
        const margin = { top: 50, right: 50, bottom: 70, left: 50 };
        const width = 530 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // SVG 요소 추가
        const svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // 데이터 로드
        d3.csv(dataSrc).then(data => {
            data.sort((a, b) => d3.descending(+a.정원, +b.정원));

            // X 스케일 설정
            const x = d3.scaleBand()
                .domain(data.map(d => d.region))
                .range([0, width])
                .padding(0.1);

            // Y 스케일 설정
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => +d.정원)])
                .nice()
                .range([height, 0]);

            // X 축 생성
            const xAxisGroup = svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end")
                .style("font-weight", "bold")
                .style("font-size", "13px");

            svg.append("text")
                .attr("x", width / 24 - 20)
                .attr("y", -15)
                .style("text-anchor", "end")
                .style("font-size", "11px")
                .style("fill", "black")
                .text("정원 총수");


            // Y 축 생성 및 보조선 추가
            svg.append("g")
                .call(d3.axisLeft(y).tickFormat(d3.format("d")).tickSizeInner(-width))
                .selectAll(".tick line")
                .attr("stroke", "#ddd")
                .style("font-size", "11px");


            // SVG에 제목 추가
            svg.append("text")
                .attr("x", (width + margin.left + margin.right) / 2 - 40)
                .attr("y", 0 - (margin.top - 20))
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("font-weight", "bold")
                .text("지역별 시설 정원 분포 (명)");
            // 툴팁 요소 추가
            const tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("background", "#fff")
                .style("padding", "3px")
                .style("border", "1px solid #ddd")
                .style("border-radius", "5px")
                .style("pointer-events", "none")
                .style("font-size", "12px")
                .style("opacity", 0);
            

            // 막대 생성
            const bars = svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.region))
                .attr("width", x.bandwidth())
                .attr("fill", color)
                .attr("y", height) // 초기 높이 설정
                .attr("height", 0) // 초기 높이 설정
                .on("mouseover", function (d, i) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                        tooltip.html(i.region + ": 총 " + i.정원 + "명") // 수정된 부분
                        .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px");
                })
                    .on("mouseout", function (d) {
                        tooltip.transition(300)
                            .style("opacity", 0);
                    })
                    .transition()
                    .duration(500)
                    .delay((d, i) => i * 100)
                    .attr("y", d => y(+d.정원)) // 정상적인 높이 설정
                    .attr("height", d => height - y(+d.정원));



        });
    }



}
