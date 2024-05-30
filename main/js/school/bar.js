let groupedData = {};

function initialize(csvFile, defaultGroup) {
  d3.csv(csvFile).then((data) => {
    groupedData = {};

    data.forEach((d) => {
      const group = d.characteristic;
      if (!groupedData[group]) {
        groupedData[group] = [];
      }
      groupedData[group].push(d);
    });

    console.log("groupedData", groupedData);
    if (groupedData[defaultGroup]) {
      showBarChart(groupedData[defaultGroup][0]); // 초기 차트 표시
      d3.select(`#groupSelect button[data-group='${defaultGroup}']`).classed('active', true); // 초기 버튼 활성화
    } else {
      console.error("기본 그룹 데이터가 없습니다:", defaultGroup);
    }

    d3.selectAll("#groupSelect button")
      .on("click", function (event) {
        event.preventDefault();
        d3.selectAll("#groupSelect button").classed('active', false);
        d3.select(this).classed('active', true);

        const group = d3.select(this).attr("data-group");
        if (groupedData[group]) {
          showBarChart(groupedData[group][0]);
        } else {
          console.error("선택된 그룹 데이터가 없습니다:", group);
        }
      });
  });
}

function showBarChart(data) {
  const svg = d3.select("#chart")
    .attr("width", 800)
    .attr("height", 500);

  svg.selectAll("*").remove(); // 이전 차트를 삭제

  const margin = { top: 40, right: 30, bottom: 50, left: 60 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const years = ["2016", "2018", "2020", "2022"];
  const categories = ["help_exp_yes", "help_exp_no"];

  const x0 = d3.scaleBand()
    .domain(years)
    .rangeRound([0, width])
    .padding(0.1);

  const x1 = d3.scaleBand()
    .domain(categories)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .rangeRound([height, 0]);

  const z = d3.scaleOrdinal()
    .range(["#1f77b4", "#ff7f0e"])
    .domain(categories);

  years.forEach(year => {
    const yearGroup = g.append("g")
      .attr("transform", `translate(${x0(year)},0)`);

    yearGroup.selectAll("rect")
      .data(categories.map(category => ({ category: category, value: +data[`${category}_${year}`] })))
      .enter().append("rect")
      .attr("x", d => x1(d.category))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => z(d.category));
  });

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0));

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(10, "%"));

  const legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(categories.slice().reverse())
    .enter().append("g")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(d => d);
}


