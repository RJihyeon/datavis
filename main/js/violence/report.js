// 전역 변수 선언을 한번만 합니다.
if (typeof data === "undefined") {
  var data = {}; // 전역 변수로 선언
}
if (typeof sortOrder === "undefined") {
  var sortOrder = "desc"; // 초기 정렬 순서
}
if (typeof years === "undefined") {
  var years = [2019, 2020, 2021, 2022];
}

Promise.all([
  d3.csv("./data/domestic_violence/2019_report.csv"),
  d3.csv("./data/domestic_violence/2020_report.csv"),
  d3.csv("./data/domestic_violence/2021_report.csv"),
  d3.csv("./data/domestic_violence/2022_report.csv"),
])
  .then(function (files) {
    data = {}; // Promise가 완료된 후 데이터 초기화
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

    const data_heatmap = files.flatMap((file, index) =>
      file.map((row) => ({
        시도청: row.시도청,
        year: years[index],
        검거건수: +row.검거건수,
      }))
    );

    // 초기 상태에 차트 대신 안내 문구를 표시합니다.
    years.forEach((year) => {
      const chartTitle = document.getElementById(`chart-title-${year}`);
      const chartContainer = document.getElementById(`report-chart-${year}`);
      if (chartTitle) {
        chartTitle.innerText = `${year}`;
      }
      if (chartContainer) {
        chartContainer.innerHTML = `<p class="loading-chart">히트맵을 클릭하면 차트가 로드됩니다.</p>`;
      }
    });

    drawHeatmap(data_heatmap);

    // 정렬 버튼 이벤트 리스너 추가
    const sortButtons = document.querySelectorAll(".sort-button");
    if (sortButtons.length > 0) {
      sortButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const year = this.getAttribute("data-year");
          sortOrder = sortOrder === "asc" ? "desc" : "asc";
          drawChart(
            data,
            year,
            currentCity,
            `report-chart`,
            sortOrder,
            highlightedYear === parseInt(year)
          );
        });
      });
    }

    const sortButton1 = document.querySelector(".sort-button1");
    if (sortButton1) {
      sortButton1.addEventListener("click", function () {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
        years.forEach((year) => {
          drawChart(
            data,
            year,
            currentCity,
            `report-chart`,
            sortOrder,
            highlightedYear === year
          );
        });
      });
    }
  })
  .catch(function (error) {
    console.error("Error loading the CSV files:", error);
  });

function updateChart(year, city) {
  currentCity = city;
  highlightedYear = year;
  years.forEach((y) => {
    drawChart(data, y, city, `report-chart`, sortOrder, y === year);
  });
}

function drawChart(data, year, city, chartClass, sortOrder, highlight = false) {
  const chartContainer = document.getElementById(`${chartClass}-${year}`);
  if (chartContainer) {
    chartContainer.innerHTML = ""; // 기존 차트 초기화
  }

  const cityTitle = document.getElementById("city-title");
  if (cityTitle) {
    cityTitle.innerText = `${city}`;
  }

  const chartTitle = document.getElementById(`chart-title-${year}`);
  if (chartTitle) {
    chartTitle.innerText = `${year}년 ${city} 데이터`;
  }

  const margin = { top: 50, right: 30, bottom: 40, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const svg = d3
    .select(`#${chartClass}-${year}`)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`
    )
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  const cityData = data[city];
  const xValues = ["기소_구속", "기소_불구속", "불기소", "가정보호", "기타"];
  const yValues = xValues.map((x) =>
    Math.round((cityData[x + "_" + year] / cityData["검거건수_" + year]) * 100)
  );

  const dataToPlot = xValues.map((x, i) => ({
    category: x,
    value: yValues[i],
  }));

  // 데이터 정렬
  dataToPlot.sort((a, b) =>
    sortOrder === "asc" ? a.value - b.value : b.value - a.value
  );

  x.domain(dataToPlot.map((d) => d.category));
  y.domain([0, d3.max(dataToPlot, (d) => d.value)]).nice();

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "28px")
    .style("font-weight", "bold");

  svg
    .append("g")
    .call(d3.axisLeft(y).ticks(10).tickSize(-width))
    .selectAll("text")
    .style("font-size", "30px")
    .style("font-weight", "bold");

  // 막대 설정
  const bars = svg.selectAll(".bar").data(dataToPlot, (d) => d.category);

  // 기존 막대 업데이트
  bars
    .transition()
    .duration(750)
    .attr("x", (d) => x(d.category))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.value))
    .attr("height", (d) => height - y(d.value));

  // 새로운 막대 추가
  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.category))
    .attr("width", x.bandwidth())
    .attr("y", height)
    .attr("height", 0)
    .transition()
    .duration(750)
    .attr("y", (d) => y(d.value))
    .attr("height", (d) => height - y(d.value))
    .attr("fill", (d) => (highlight ? "#FF6347" : "#20B2AA"));

  svg
    .selectAll(".label")
    .data(dataToPlot)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => x(d.category) + x.bandwidth() / 2)
    .attr("y", height)
    .attr("text-anchor", "middle")
    .attr("font-size", "33px")
    .attr("font-weight", "bold")
    .transition()
    .duration(1000)
    .attr("y", (d) => y(d.value) - 5)
    .text((d) => `${d.value}건`)
    .attr("fill", (d) => (highlight ? "#FF6347" : "#000000"));
}

function drawHeatmap(data) {
  const margin = { top: 50, right: 120, bottom: 100, left: 100 },
    width = 600 - margin.left - margin.right, // 폭을 좁게 조정
    height = 700 - margin.top - margin.bottom, // 세로를 길게 조정
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize * 4,
    colors = [
      "#f7fbff",
      "#deebf7",
      "#c6dbef",
      "#9ecae1",
      "#6baed6",
      "#4292c6",
      "#2171b5",
      "#08519c",
      "#08306b",
    ],
    years = [...new Set(data.map((d) => d.year))];

  const regions1 = {
    수도권: ["서울", "인천", "경기남부", "경기북부"],
    강원: ["강원"],
    경상도: ["부산", "대구", "울산", "경남", "경북"],
    전라도: ["광주", "전남", "전북"],
    충청도: ["대전", "세종", "충남", "충북"],
    제주: ["제주"],
  };

  const regionOrder = ["수도권", "강원", "경상도", "전라도", "충청도", "제주"];

  const regionIndex = {};
  regionOrder.forEach((region, idx) => {
    regions1[region].forEach((city) => {
      regionIndex[city] = idx;
    });
  });

  data.sort((a, b) => {
    const regionComparison = regionIndex[a.시도청] - regionIndex[b.시도청];
    if (regionComparison !== 0) {
      return regionComparison;
    }
    return a.시도청.localeCompare(b.시도청, "ko");
  });

  const svg = d3
    .select("#heatmap-report")
    .html("")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`
    )
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.05);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.시도청))
    .range([0, height])
    .paddingInner(0.1); // 패딩을 더 크게 설정

  const regionPadding = 10;

  svg
    .append("g")
    .attr("class", "heatmap-x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("font-size", "20px");

  svg
    .append("g")
    .attr("class", "heatmap-y-axis")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("font-size", "20px");

  const colorScale = d3
    .scaleQuantile()
    .domain([0, 1500, 3000, 4500, 6000, 7500, 9000, 10500, 12000, 12674])
    .range(colors);

  // Adding border to each region
  const regionBorders = [];
  let currentRegion = regionIndex[data[0].시도청];
  let startY = yScale(data[0].시도청);

  for (let i = 1; i < data.length; i++) {
    const region = regionIndex[data[i].시도청];
    if (region !== currentRegion) {
      const endY = yScale(data[i - 1].시도청) + yScale.bandwidth();
      regionBorders.push({
        y: startY,
        height: endY - startY,
        region: currentRegion,
      });
      currentRegion = region;
      startY = yScale(data[i].시도청);
    }
  }
  const endY = yScale(data[data.length - 1].시도청) + yScale.bandwidth();
  regionBorders.push({
    y: startY,
    height: endY - startY,
    region: currentRegion,
  });

  svg
    .selectAll(".region-border")
    .data(regionBorders)
    .enter()
    .append("rect")
    .attr("class", "region-border")
    .transition() // 여기에서 전환을 시작합니다.
    .duration(1000) // 전환 기간을 설정합니다.
    .attr("x", 0)
    .attr("y", (d) => d.y)
    .attr("width", width)
    .attr("height", (d) => d.height)
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", "2px");

  // Draw heat squares

  // 범례 생성
  const legendData = [0].concat(colorScale.quantiles());

  const legendWidth = legendElementWidth * legendData.length;
  const legendX = (width - legendWidth) / 2;

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
    .attr("height", gridSize - 2)
    .style("fill", (d, i) => colors[i])
    .attr("y", 20);

  legend
    .append("text")
    .text((d) => `≥${Math.round(d)}건`)
    .style("font-size", "13px")
    .attr("x", gridSize / 2)
    .attr("y", gridSize / 2 + 37)
    .attr("text-anchor", "start");

  const tooltip = d3.select("#report-tooltip");

  // 통합된 이벤트 핸들러
  // 히트맵 셀 추가
  svg
    .selectAll(".cell")
    .data(data, (d) => d.year + ":" + d.시도청)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.시도청) + regionIndex[d.시도청] * 0.1)
    .attr("class", "cell")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .style("fill", (d) => colorScale(d.검거건수))
    .on("click", (event, d) => {
      updateChart(d.year, d.시도청);
      console.log(d.시도청);
    })
    .on("mouseover", function (event, d) {
      d3.select(this).classed("hover", true);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `시도청: ${d.시도청}<br/>검거건수: ${d.검거건수}<br/>연도: ${d.year}`
        )
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).classed("hover", false);
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .duration(1000)
    .style("fill", (d) => colorScale(d.검거건수));

  svg
    .selectAll(".cell")
    .append("title")
    .text((d) => `검거건수: ${d.검거건수}`);

  // 권역별 배경 텍스트 추가
  regionOrder.forEach((region) => {
    const cities = regions1[region];
    const firstCity = cities[0];
    const yPosition = yScale(firstCity) + yScale.bandwidth() / 2;

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", yPosition + 15)
      .attr("class", "region-label")
      .attr("text-anchor", "middle")
      .attr("font-size", "35px")
      .attr("fill", "#dddddd")
      .attr("transform", `rotate(0, ${-margin.left / 2}, ${yPosition})`)
      .text(region);
  });
}
