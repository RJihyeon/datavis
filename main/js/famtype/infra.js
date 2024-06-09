infra();

function infra() {
    d3.select("#centerSelect input[type='button'][center-group='c0']").classed('active', true); // 초기 버튼 활성화
    drawMap("시설 전체", "#e98b1f");
    drawBar("시설 전체");

    d3.selectAll("#centerSelect input[type='button']")
        .on("click", function () {
            d3.selectAll("#centerSelect input[type='button']").classed('active', false);
            d3.select(this).classed('active', true);

            const group = d3.select(this).attr("center-group");
            switch (group) {
                case "c0": facilityName = "시설 전체"; color = "#e98b1f"; break;
                case "c1": facilityName = "생활지원시설"; color = "#F08080"; break;
                case "c2": facilityName = "양육지원시설"; color = "#1E90FF"; break;
                case "c3": facilityName = "일시지원 복지시설"; color = "#6A5ACD"; break;
                case "c4": facilityName = "출산지원시설"; color = "#BA55D3"; break;
                case "c5": facilityName = "한부모가족 복지상담소"; color = "#008080"; break;
            }

            drawMap(facilityName, color);
            drawBar(facilityName);
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
                    .attr("opacity", "0.6")
                    .append("title")
                    .text(d => `${d.region}: ${d[count]}`);

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
                    .on("mouseout", function () {
                        if (!d3.select(this).classed('active')) { // active 상태가 아닌 경우에만 적용
                            d3.select(this).attr("fill", "#333")
                                .style("text-shadow", "none");
                            const regionName = d3.select(this).text();
                            const regionBubble = bubbleLayer.selectAll("circle")
                                .filter(d => d.region === regionName);
                            regionBubble.attr("stroke", "none");
                        }
                    })

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

    function drawBar(center) {
        console.log("center" + center);
    }
}
