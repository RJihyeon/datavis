infra();

function infra() {
    const width = 800;
    const height = 600;

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

        // CSV 데이터 로드
        d3.csv("./data/famtype/center.csv").then(data => {
            data.forEach(d => {
                d.count = +d.count;
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
                .attr("fill", "#ddd")
                .attr("stroke", "#999");

            // 지역 이름 표시
            mapLayer.selectAll("text")
                .data(features)
                .enter()
                .append("text")
                .attr("transform", function(d) {
                    return `translate(${path.centroid(d)})`;
                })
                .attr("dy", ".35em")
                .attr("class", "region-label")
                .text(d => d.properties.name)
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .attr("fill", "#333");

            // 클릭 이벤트를 svg 레이어에 바인딩
            svg.on("click", function(event) {
                const [x, y] = d3.pointer(event);
                const clickedRegion = mapLayer.selectAll("path").filter(function(d) {
                    return d3.geoContains(d, projection.invert([x, y]));
                }).data();

                if (clickedRegion.length > 0) {
                    const regionName = clickedRegion[0].properties.name;
                    const regionData = data.find(item => item.region === regionName);
                    console.log(regionData);
                }
            });

            // 버블 차트 추가
            svg.append("g")
                .selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => projection([+d.lon, +d.lat])[0])
                .attr("cy", d => projection([+d.lon, +d.lat])[1])
                .attr("r", d => Math.sqrt(d.count) * 7)
                .attr("class", "bubble")
                .append("title")
                .text(d => `${d.region}: ${d.count}`);
        });
    });
}
