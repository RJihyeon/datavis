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

  let sortAscending = true;
  let currentGroupData;

  function updateChart(groupBy) {
    let groupedData;
    if (groupBy === "전체") {
      groupedData = [
        ["소계", processedData.filter((d) => d.특성별2 === "소계")],
        ["남자", processedData.filter((d) => d.특성별2 === "남자")],
        ["여자", processedData.filter((d) => d.특성별2 === "여자")],
        ["9~11세", processedData.filter((d) => d.특성별2 === "9~11세")],
        ["12~15세", processedData.filter((d) => d.특성별2 === "12~15세")],
        ["16~18세", processedData.filter((d) => d.특성별2 === "16~18세")],
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
    currentGroupData = groupedData;
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
    updateStackedBarChart(data, groupKey, sortAscending);
  }

  function updateStackedBarChart(data, groupBy, sortAscending) {
    console.log(`Updating Stacked Bar Chart:`, data);

    const filteredData = flatMap(data, (d) => d[1]);

    const groupedData = d3.groups(filteredData, (d) => d.특성별2);

    console.log(`Filtered Data:`, filteredData);
    console.log(`Grouped Data for Stacked Bar:`, groupedData);

    visualizeStackedBarChart(groupedData, groupBy, data, sortAscending);
  }

  function flatMap(arr, callback) {
    return arr.map(callback).reduce((acc, val) => acc.concat(val), []);
  }

  function visualizeStackedBarChart(
    data,
    groupBy,
    currentGroupData,
    sortAscending
  ) {
    const margin = { top: 50, right: 30, bottom: 60, left: 50 };
    const width = 1100 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select("#vioinfra-chart")
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    let xDomain;
    if (groupBy === "전체") {
      xDomain = data.map((d) => d[0]);
    } else {
      xDomain = data.map((d) => d[0]);
    }

    console.log("xDomain: ", xDomain);

    const x = d3.scaleBand().domain(xDomain).range([0, width]).padding(0.5);

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

    console.log("Stacked Data: ", stackedData);

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

    // Enter + Update selection
    const rects = serie
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
      });

    rects
      .transition()
      .duration(1000) // Transition duration in milliseconds
      .delay((d, i) => i * 100) // Delay based on index
      .attr("x", (d) => x(d.data.특성별2))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    const legend = svg.append("g").attr("transform", `translate(0, -40)`); // Place legend above chart

    legend
      .selectAll("rect")
      .data(color.domain())
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 160)
      .attr("y", 0)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", color)
      .style("cursor", "pointer")
      .on("click", function (event, d) {
        sortBarsByLegend(d, currentGroupData, groupBy, sortAscending);
      });

    legend
      .selectAll("text")
      .data(color.domain())
      .enter()
      .append("text")
      .style("cursor", "pointer")
      .attr("x", (d, i) => i * 160 + 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text((d) => d)
      .style("font-weight", "bold")
      .on("click", function (event, d) {
        sortBarsByLegend(d, currentGroupData, groupBy, sortAscending);
      });
  }
  function sortBarsByLegend(key, currentGroupData, groupBy, sortAscending) {
    // Sorting logic based on the clicked legend
    console.log(`Sorting bars by legend: ${key}`);
    console.log("Current Group Data: ", currentGroupData);

    let sortedData;
    if (groupBy === "전체") {
      sortedData = currentGroupData.slice().sort((a, b) => {
        const totalA = a[1].reduce((sum, d) => sum + (d[key] || 0), 0);
        const totalB = b[1].reduce((sum, d) => sum + (d[key] || 0), 0);
        return sortAscending ? totalB - totalA : totalA - totalB;
      });
    } else {
      sortedData = currentGroupData.slice().sort((a, b) => {
        const totalA = a[1].reduce((sum, d) => sum + (d[key] || 0), 0);
        const totalB = b[1].reduce((sum, d) => sum + (d[key] || 0), 0);
        return sortAscending ? totalB - totalA : totalA - totalB;
      });
    }

    console.log("Sorted Data: ", sortedData);

    sortAscending = !sortAscending; // Toggle sort order

    visualizeStackedBarChart(sortedData, groupBy, sortedData, sortAscending);
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
