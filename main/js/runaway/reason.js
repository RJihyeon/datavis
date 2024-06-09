d3.csv("./data/runaway/runaway_reason.csv")
  .then((data) => {
    console.log("CSV data loaded successfully:", data); // CSV 데이터 로드 성공 시 콘솔 출력
    const groupedData1 = d3.group(data, (d) => d["응답자유형별(1)"]);

    // Create buttons for 응답자유형별(1)
    const buttonContainer1 = d3.select("#dataSelect1");
    d3.select("#dataSelect1").classed("text", false);
    d3.select("#dataSelect1").append("p").text("응답자유형별");
    buttonContainer1
      .selectAll("button")
      .data(Array.from(groupedData1.keys()))
      .enter()
      .append("button")
      .attr("class", "btn btn-primary m-1")
      .text((d) => d)
      .on("click", function (event, d) {
        // Remove existing buttons and chart
        d3.select("#dataSelect2").selectAll("button").remove();
        d3.select("#reason-chart").selectAll("*").remove();

        const groupedData2 = d3.group(
          groupedData1.get(d),
          (d) => d["응답자유형별(2)"]
        );

        // Create buttons for 응답자유형별(2)
        const buttonContainer2 = d3.select("#dataSelect2");

        buttonContainer2
          .selectAll("button")
          .data(Array.from(groupedData2.keys()))
          .enter()
          .append("button")
          .attr("class", "btn btn-secondary m-1")
          .text((d) => d)
          .on("click", function (event, d) {
            const filteredData = groupedData2.get(d);
            console.log("Filtered data for chart:", filteredData); // 필터링된 데이터 콘솔 출력

            highlightChart(d);
          });

        // Add highlight class if 전체 is clicked
        if (d === "성별") {
          d3.select("#reason-chart")
            .classed("gender", true)
            .append("p")
            .text("성별에 따른 가출 이유 비율");
        } else {
          d3.select("#reason-chart").classed("gender", false);
        }
        if (d === "전체") {
          d3.select("#reason-chart")
            .classed("all", true)
            .append("p")
            .text("전체 가출 이유 비율");
        } else {
          d3.select("#reason-chart").classed("all", false);
        }

        // Add highlight class if 전체 is clicked
        if (d === "학교급별") {
          d3.select("#reason-chart")
            .classed("school-level", true)
            .append("p")
            .text("학교급별 가출 이유 비율");
        } else {
          d3.select("#reason-chart").classed("school-level", false);
        }

        // Add highlight class if 전체 is clicked
        if (d === "고교유형별") {
          d3.select("#reason-chart")
            .classed("school", true)
            .append("p")
            .text("고교유형별 가출 이유 비율");
        } else {
          d3.select("#reason-chart").classed("gender", false);
        }
        // Add highlight class if 전체 is clicked
        if (d === "지역규모별") {
          d3.select("#reason-chart")
            .classed("region", true)
            .append("p")
            .text("지역규모별 가출 이유 비율");
        } else {
          d3.select("#reason-chart").classed("gender", false);
        }
        // Add highlight class if 전체 is clicked
        if (d === "가족유형별") {
          d3.select("#reason-chart")
            .classed("famtype", true)
            .append("p")
            .text("가족유형별 가출 이유 비율");
        } else {
          d3.select("#reason-chart").classed("gender", false);
        }
        // Add highlight class if 전체 is clicked
        if (d === "학업성적별") {
          d3.select("#reason-chart")
            .classed("grade", true)
            .append("p")
            .text("학업성적별 가출 이유 비율");
        } else {
          d3.select("#reason-chart").classed("gender", false);
        }
        // Add highlight class if 전체 is clicked
        if (d === "경제적수준별") {
          d3.select("#reason-chart")
            .classed("eco-level", true)
            .append("p")
            .text("경제수준별 가출 이유 비율");
        } else {
          d3.select("#reason-chart").classed("gender", false);
        }

        // Remove initial load class when a button is clicked
        d3.select("#reason-chart").classed("initial-load", false);
        d3.select("#reason-chart").append("p").text("가출 이유 비율");

        // Render all charts for the selected category
        renderAllCharts(groupedData2);
      });

    d3.select("#reason-chart").append("p").text("응답자 유형별 가출 이유 비율");

    // Render all charts initially
    renderAllCharts(groupedData1);

    // Add initial load class
    d3.select("#reason-chart").classed("initial-load", true);
  })
  .catch((error) => {
    console.error("Error loading CSV data:", error); // CSV 데이터 로드 실패 시 에러 출력
  });

function renderAllCharts(groupedData) {
  d3.select("#dataSelect input[type='button'][data-group='g4']").classed(
    "active",
    true
  ); // 초기 버튼 활성화
  const chartContainer = d3.select("#reason-chart");

  const chartGroups = Array.from(groupedData.entries());
  chartGroups.forEach(([key, data], index) => {
    const component = chartContainer
      .append("div")
      .attr("class", "chart-component")
      .attr("id", `chart-component-${key}`)
      .style("display", "inline-block")
      .style("margin", "20px");

    showBarChart(data, `chart-component-${key}`);
  });
}

function highlightChart(selectedKey) {
  d3.selectAll(".chart-component").style("border", "none");

  d3.select(`#chart-component-${selectedKey}`)
    .style("border", "2px solid #F08080")
    .style("border-radius", "10px");
}

function showBarChart(data, containerId) {
  const keys = [
    "학업문제",
    "보호자문제",
    "학교갈등/폭력",
    "경제적 문제",
    "친구들과 함께하기 위해",
    "기타",
  ];

  // Convert numeric data
  data.forEach((d) => {
    keys.forEach((key) => {
      d[key] = +d[key];
    });
  });

  const margin = { top: 30, right: 30, bottom: 70, left: 60 };
  const width = 350 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select(`#${containerId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  const x0 = d3
    .scaleBand()
    .domain(data.map((d) => d["응답자유형별(2)"]))
    .range([0, width])
    .padding(0.2);

  const x1 = d3
    .scaleBand()
    .domain(keys)
    .range([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d3.max(keys, (key) => d[key]))])
    .nice()
    .range([height, 0]);

  const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

  svg
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${x0(d["응답자유형별(2)"])},0)`)
    .selectAll("rect")
    .data((d) => keys.map((key) => ({ key: key, value: d[key] })))
    .enter()
    .append("rect")
    .attr("x", (d) => x1(d.key))
    .attr("y", (d) => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", (d) => color(d.key));

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "12px")
    .style("font-weight", "bold");
  svg
    .append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickFormat((d) => d + "%"))
    .style("font-size", "12px")
    .style("font-weight", "bold");

  const legend = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legend
    .append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", color);

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text((d) => d);
}
