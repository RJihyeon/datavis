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

  console.log("Processed Data:", processedData);

  function updateChart(groupBy) {
    let groupedData;
    if (groupBy === "전체") {
      groupedData = [
        ["전체", processedData.filter((d) => d.특성별1 !== "기관유형")],
      ];
    } else if (
      groupBy === "성별" ||
      groupBy === "연령" ||
      groupBy === "기관유형"
    ) {
      groupedData = d3.groups(processedData, (d) =>
        d.특성별1 === groupBy ? d.특성별2 : undefined
      );
      groupedData = groupedData.filter((d) => d[0] !== undefined);
    } else {
      console.error("Invalid groupBy value:", groupBy);
      return;
    }
    console.log(`Grouped Data (${groupBy}):`, groupedData);
    visualizeData(groupedData, groupBy);
  }

  function visualizeData(data, groupBy) {
    console.log(`Visualizing Data (${groupBy}):`, data);

    const groupKey = groupBy === "전체" ? "전체" : groupBy;

    const educationData = d3.rollups(
      data.flatMap((d) => d[1]),
      (v) => ({
        교육경험없음: d3.sum(v, (d) => d.교육경험없음),
        교육경험있음: d3.sum(v, (d) => d.교육경험있음),
      }),
      (d) => d.특성별2
    );

    console.log(`Education Data (${groupBy}):`, educationData);

    // Update stacked bar chart for the selected group
    updateStackedBarChart(data);
  }

  function createPieChart(data) {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3
      .scaleOrdinal()
      .domain(["교육경험없음", "교육경험있음"])
      .range(["#fffb52", "#00b2ba"]);

    const arc = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const labelArc = d3
      .arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d[1]);

    const svg = d3
      .select("#education-pie-chart")
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const g = svg
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", (d) => color(d.data[0]));

    g.append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("dy", ".35em")
      .text((d) => `${d.data[0]}: ${d.data[1].toFixed(1)}%`);

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${-height / 2 + 20})`);

    legend
      .selectAll("rect")
      .data(color.domain())
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", color);

    legend
      .selectAll("text")
      .data(color.domain())
      .enter()
      .append("text")
      .attr("x", 24)
      .attr("y", (d, i) => i * 20 + 9)
      .attr("dy", "0.35em")
      .text((d) => d);
  }

  function updateStackedBarChart(data) {
    console.log(`Updating Stacked Bar Chart:`, data);

    const filteredData = flatMap(data, (d) => d[1]);

    const groupedData = d3.groups(filteredData, (d) => d.특성별2);

    console.log(`Filtered Data:`, filteredData);
    console.log(`Grouped Data for Stacked Bar:`, groupedData);

    visualizeStackedBarChart(groupedData);
  }

  function flatMap(arr, callback) {
    return arr.map(callback).reduce((acc, val) => acc.concat(val), []);
  }
  function visualizeStackedBarChart(data) {
    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

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

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data.flatMap((d) => d[1]),
          (d) =>
            d3.sum([d.전혀도움이안됨, d.도움이안됨, d.도움이됨, d.매우도움이됨])
        ),
      ])
      .nice()
      .range([height, 0]);

    const color = d3
      .scaleOrdinal()
      .domain(["전혀도움이안됨", "도움이안됨", "도움이됨", "매우도움이됨"])
      .range(["#fffb52", "#00b2ba", "#0080a0", "#005e87"]);

    const stack = d3
      .stack()
      .keys(["전혀도움이안됨", "도움이안됨", "도움이됨", "매우도움이됨"])
      .value((d, key) => d[key]);

    const stackedData = stack(data.flatMap((d) => d[1]));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("class", "perpetrator-x-axis")
      .selectAll(".tick text")
      .attr("class", "perpetrator-x-text");

    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(10, "s")
          .tickFormat((d) => `${d}%`)
      )
      .attr("class", "perpetrator-y-axis")
      .selectAll(".tick text")
      .attr("class", "perpetrator-y-text");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(255, 255, 255, 0.8)")
      .style("border", "1px solid #ddd")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("text-align", "left")
      .style("font-size", "12px");

    const serie = svg
      .selectAll(".serie")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("class", "serie")
      .attr("fill", (d) => color(d.key));

    serie
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.특성별2))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", (event, d) => {
        tooltip
          .style("visibility", "visible")
          .text(`${d.data.특성별2}: ${(d[1] - d[0]).toFixed(1)}%`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      })
      .on("click", function (event, d) {
        sortBarsByValue(d.data.특성별2);
      });

    const legend = svg
      .append("g")
      .attr("transform", `translate(0,${height + 40})`); // Place legend below chart

    legend
      .selectAll("rect")
      .data(color.domain())
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 100)
      .attr("y", 0)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", color)
      .on("click", function (event, d) {
        sortBarsByLegend(d);
      });

    legend
      .selectAll("text")
      .data(color.domain())
      .enter()
      .append("text")
      .attr("x", (d, i) => i * 100 + 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text((d) => d);
  }

  function sortBarsByValue(key) {
    // Sorting logics based on the clicked bar value
    console.log(`Sorting bars by value: ${key}`);

    const sortedData = data.slice().sort((a, b) => {
      const aValue = a[1].find((d) => d.특성별2 === key);
      const bValue = b[1].find((d) => d.특성별2 === key);
      return (bValue ? bValue[key] : 0) - (aValue ? aValue[key] : 0);
    });

    visualizeStackedBarChart(sortedData);
  }

  function sortBarsByLegend(key) {
    // Sorting logic based on the clicked legend
    console.log(`Sorting bars by legend: ${key}`);

    const sortedData = data.slice().sort((a, b) => {
      const totalA = a[1].reduce((sum, d) => sum + (d[key] || 0), 0);
      const totalB = b[1].reduce((sum, d) => sum + (d[key] || 0), 0);
      return totalB - totalA;
    });

    visualizeStackedBarChart(sortedData);
  }

  // Initialize the chart with "전체" group
  updateChart("전체");

  // Button event listeners to group data by different categories
  document.querySelectorAll(".group-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const groupBy = this.getAttribute("data-group");
      updateChart(groupBy);
    });
  });
});
