var width = 960,
  height = 500;

var svg = d3
  .select("#map-chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3
  .geoMercator()
  .center([128, 36]) // 한국 중심 좌표
  .scale(4000)
  .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

var quantize = d3
  .scaleQuantize()
  .domain([0, 1000])
  .range(d3.range(9).map((i) => "p" + i));

// 동시에 여러 데이터 로드
Promise.all([
  d3.json("./data/map/municipalities-topo-simple.json"),
  d3.csv("./data/domestic_violence/report_신고건수.csv"),
])
  .then(function ([topoData, reportData]) {
    // CSV 데이터를 이름을 키로 사용하는 맵으로 변환
    var popByName = d3.map(reportData, function (d) {
      return d.name;
    });

    // 토포제이슨 데이터 처리
    var features = topojson.feature(
      topoData,
      topoData.objects["municipalities-geo"]
    ).features;
    features.forEach(function (d) {
      var population = popByName.get(d.properties.name) || 0;
      d.properties["2023_population"] = population;
      d.properties.density = population / path.area(d);
      d.properties.quantized = quantize(d.properties.density);
    });

    // 지도 그리기
    svg
      .selectAll("path")
      .data(features)
      .enter()
      .append("path")
      .attr("class", (d) => "municipality " + d.properties.quantized)
      .attr("d", path)
      .attr("id", (d) => d.properties.name)
      .append("title")
      .text(
        (d) =>
          `${d.properties.name}: ${
            d.properties["2023_population"] / 10000
          }만 명`
      );

    // 지역 레이블 추가
    svg
      .selectAll("text")
      .data(features.filter((d) => d.properties.name.endsWith("시")))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${path.centroid(d)})`)
      .attr("dy", ".35em")
      .attr("class", "region-label")
      .text((d) => d.properties.name);
  })
  .catch(function (error) {
    console.log("Error loading data:", error);
  });
