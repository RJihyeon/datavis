// 데이터 로드 및 처리
Promise.all([
  d3.csv("data/domestic_violence/2019_report.csv"),
  d3.csv("data/domestic_violence/2020_report.csv"),
  d3.csv("data/domestic_violence/2021_report.csv"),
  d3.csv("data/domestic_violence/2022_report.csv"),
])
  .then(function (files) {
    const data = {};
    files.forEach((file, index) => {
      file.forEach((d) => {
        const year = 2019 + index;
        if (!data[d.시도청]) {
          data[d.시도청] = {};
        }
        Object.assign(data[d.시도청], {
          [`검거건수_${year}`]: +d.검거건수,
          [`기소_구속_${year}`]: +d.기소_구속,
          [`기소_불구속_${year}`]: +d.기소_불구속,
          [`불기소_${year}`]: +d.불기소,
          [`가정보호_${year}`]: +d["가정보호 사건송치"],
          [`기타_${year}`]: +d.기타,
          [`기소율_${year}`]: +d.기소율,
        });
      });
    });
    const years = [2019, 2020, 2021, 2022];
    const data_heatmap = files.flatMap((file, index) =>
      file.map((row) => ({
        시도청: row.시도청,
        year: years[index],
        검거건수: +row.검거건수,
      }))
    );

    //update logic
    window.updateChart = function (year) {
      drawChart(data, year);
    };

    // 초기 차트는 2019년 데이터로 설정
    updateChart(2019);
    drawHeatmap(data_heatmap);
  })
  .catch(function (error) {
    console.error("Error loading the CSV files:", error);
  });

function drawChart(data, year) {
  const svg = d3
    .select("#report-chart")
    .html("")
    .append("svg")
    .attr("width", 800)
    .attr("height", 400);

  const margin = { top: 20, right: 30, bottom: 40, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 준비된 데이터를 바탕으로 동적으로 차트 업데이트
  const processedData = Object.keys(data).map((key) => ({
    시도청: key,
    기소율: data[key][`기소율_${year}`],
  }));

  x.domain(processedData.map((d) => d.시도청));
  y.domain([0, d3.max(processedData, (d) => d.기소율)]);

  // x축과 y축 그리기
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  g.append("g").call(d3.axisLeft(y));

  // 바 차트의 바 생성
  g.selectAll(".bar")
    .data(processedData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.시도청))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.기소율))
    .attr("height", (d) => height - y(d.기소율))
    .attr("fill", "steelblue"); // 바의 색상 설정

  // 각 바 위에 데이터 값을 표시하는 텍스트 추가
  g.selectAll(".text")
    .data(processedData)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => x(d.시도청) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.기소율) - 5)
    .attr("text-anchor", "middle")
    .text((d) => d.기소율);
}

function drawHeatmap(data) {
  const margin = { top: 50, right: 0, bottom: 100, left: 70 },
    width = 800 - margin.left - margin.right,
    height = 400;
  (gridSize = Math.floor(width / 24)),
    (legendElementWidth = gridSize * 2),
    (buckets = 9),
    (colors = [
      "#ffffd9",
      "#edf8b1",
      "#c7e9b4",
      "#7fcdbb",
      "#41b6c4",
      "#1d91c0",
      "#225ea8",
      "#253494",
      "#081d58",
    ]), // ColorBrewer 색상
    (years = [...new Set(data.map((d) => d.year))]), // 모든 연도 추출
    (regions = [...new Set(data.map((d) => d.시도청))]); // 모든 시도청 추출

  const svg = d3
    .select("#heatmap-report")
    .html("")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 데이터 정렬
  data.sort((a, b) => a.시도청.localeCompare(b.시도청, "ko")); // 한글 정렬

  const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.05);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.시도청).sort((a, b) => a.localeCompare(b, "ko"))) // 한글 정렬
    .range([0, height])
    .padding(0.05);

  // 축 추가
  svg
    .append("g")
    .attr("class", "heatmap-x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("font-size", "15px"); // X축 폰트 크기 조정

  svg
    .append("g")
    .attr("class", "heatmap-y-axis")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("font-size", "15px"); // X축 폰트 크기 조정

  const colorScale = d3
    .scaleQuantile()
    .domain([0, d3.max(data, (d) => d.검거건수)])
    .range(colors);

  svg
    .selectAll(".tile")
    .data(data, (d) => d.year + ":" + d.시도청)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.시도청))
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("class", "tile")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .style("fill", (d) => colorScale(d.검거건수))
    .append("title")
    .text((d) => `검거건수: ${d.검거건수}`);

  // 추가: 범례, 축 등을 그릴 수 있습니다.

  // Draw heat squares
  const cards = svg
    .selectAll(".heatSquare")
    .data(data, (d) => d.시도청 + ":" + d.year);

  cards
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.시도청))
    .attr("class", "heatSquare bordered")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .style("fill", colors[0])
    .merge(cards)
    .transition()
    .duration(1000)
    .style("fill", (d) => colorScale(d.검거건수));

  cards.exit().remove();
  // 범례 생성
  const legendData = [0].concat(colorScale.quantiles());
  const legendWidth = legendElementWidth * legendData.length;
  const legendX = (width - legendWidth) / 2; // 범례를 중앙에 위치

  const legend = svg
    .selectAll(".legend")
    .data(legendData, (d) => d)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr(
      "transform",
      (d, i) => `translate(${legendX + i * legendElementWidth}, ${height + 40})`
    );

  legend
    .append("rect")
    .attr("width", legendElementWidth)
    .attr("height", gridSize / 2 + 10)
    .style("fill", (d, i) => colors[i]);

  legend
    .append("text")
    .attr("class", "mono")
    .text((d) => `   ${Math.round(d)}건`)
    .attr("x", legendElementWidth / 2)
    .attr("y", gridSize / 2 + 30) // 조금 더 아래에 텍스트 위치
    .attr("text-anchor", "middle"); // 텍스트를 사각형의 중앙에 위치

  // 셀 그리기

  const tooltip = d3.select("#report-tooltip");
  svg
    .selectAll(".cell")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.시도청))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .style("fill", (d) => colorScale(d.검거건수))
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `시도청: ${d.시도청}<br/>검거건수: ${d.검거건수}<br/>연도: ${d.year}`
        )
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
}
