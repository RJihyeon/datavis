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

        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(mapData, mapData.objects['provinces-geo']).features) // 수정된 부분
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#ddd")
            .attr("stroke", "#999");
        // CSV 데이터 로드
        d3.csv("./data/famtype/center.csv").then(data => {
            data.forEach(d => {
                d.count = +d.count;
            });

            // 버블 차트 추가
            svg.append("g")
                .selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => projection([+d.lon, +d.lat])[0])
                .attr("cy", d => projection([+d.lon, +d.lat])[1])
                .attr("r", d => Math.sqrt(d.count) * 2)
                .attr("class", "bubble")
                .append("title")
                .text(d => `${d.region}: ${d.count}`);
        });
    });
}