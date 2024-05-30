d3.csv("./data/domestic_violence/infra.csv").then(function (data) {
  const processedData = data.map((d) => ({
    특성별1: d["특성별(1)"],
    특성별2: d["특성별(2)"],
    소계: +d["소계"],
    교육경험없음: +d["교육경험 없음"],
    교육경험있음: +d["교육경험 있음"],
    전혀도움이안됨: +d["전혀 도움이 안 됨"],
    도움이안됨: +d["도움이 안 됨"],
    도움이됨: +d["도움이 됨"],
    매우도움이됨: +d["매우 도움이 됨"],
  }));
  console.log(processedData);

  function updateChart(groupBy) {
    console.log(groupBy);
    let groupedData;
    if (groupBy === "전체") {
      groupedData = [["전체", processedData]];
    } else {
      const filteredData = processedData.filter(
        (d) => d["특성별1"] === groupBy
      );
      groupedData = d3.groups(filteredData, (d) => d["특성별2"]);
      console.log(groupedData);
    }
    visualizeData(groupedData, groupBy);
  }

  function visualizeData(data, groupBy) {
    const margin = { top: 20, right: 100, bottom: 40, left: 50 };
    const width = 1100;
    const height = 600;

    const svg = d3
      .select("#vioinfra-chart")
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d[0]))
      .range([0, width])
      .padding(0.4);

    const y = d3.scaleLinear().domain([0, 100]).nice().range([height, 0]);

    const color = d3
      .scaleOrdinal()
      .domain([
        "교육경험없음",
        "교육경험있음",
        "전혀도움이안됨",
        "도움이안됨",
        "도움이됨",
        "매우도움이됨",
      ])
      .range([
        "#ffe216",
        "#fffb52",
        "#00f6ce",
        "#00b2ba",
        "#0080a0",
        "#005e87",
        "#304a76",
      ]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("class", "perpetrator-x-axis")
      .selectAll(".tick text")
      .attr("class", "perpetrator-x-text");

    svg
      .append("g")
      .call(d3.axisLeft(y))
      .attr("class", "perpetrator-y-axis")
      .selectAll(".tick text")
      .attr("class", "perpetrator-y-text");

    const bars = svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", (d) => `translate(${x(d[0])},0)`);

    bars
      .selectAll("rect")
      .data((d) =>
        Object.entries(d[1][0]).filter(
          (entry) =>
            entry[0] !== "특성별1" &&
            entry[0] !== "특성별2" &&
            entry[0] !== "소계"
        )
      )
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * (x.bandwidth() / 6))
      .attr("y", (d) => y(d[1]))
      .attr("width", x.bandwidth() / 6)
      .attr("height", (d) => height - y(d[1]))
      .attr("fill", (d) => color(d[0]));

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 20}, 20)`);

    legend
      .selectAll("rect")
      .data(color.domain())
      .enter()
      .append("rect")
      .attr("x", -230)
      .attr("y", (d, i) => i * 20)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", color);

    legend
      .selectAll("text")
      .data(color.domain())
      .enter()
      .append("text")
      .attr("x", -200)
      .attr("y", (d, i) => i * 20 + 9)
      .attr("dy", "0.35em")
      .text((d) => d);
  }

  document.querySelectorAll(".group-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const groupBy = this.getAttribute("data-group");
      updateChart(groupBy);
    });
  });

  // Initially render the chart by grouping by 전체
  updateChart("전체");
});
