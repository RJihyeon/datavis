let groupedData = {};
console.log("bar");
function initialize(csvFile, defaultGroup) {
  d3.csv(csvFile).then((data) => {
      let groupedData = {};
      data.forEach((d) => {
          const group = d.characteristic;
          if (!groupedData[group]) {
              groupedData[group] = [];
          }
          groupedData[group].push({
              year: d.year,
              help_exp_no: +d.help_exp_no,
              help_exp_yes: +d.help_exp_yes
          });
      });

      console.log("groupedData", groupedData);
      if (groupedData[defaultGroup]) {
          console.log("defaultGroup", defaultGroup);
          showStackedBarChart(groupedData[defaultGroup]); // 초기 차트 표시
          d3.select(`#groupSelect button[data-group='${defaultGroup}']`).classed('active', true); // 초기 버튼 활성화
      } else {
          console.error("Default group data not found:", defaultGroup);
      }

      d3.selectAll("#groupSelect button")
          .on("click", function (event) {
              event.preventDefault();
              d3.selectAll("#groupSelect button").classed('active', false);
              d3.select(this).classed('active', true);
              const group = d3.select(this).attr("data-group");
              if (groupedData[group]) {
                  showStackedBarChart(groupedData[group]);
              } else {
                  console.error("Selected group data not found:", group);
              } // 선택된 그룹 출력
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

  console.log("Data for chart:", data); // 데이터 구조를 확인하기 위해 로그 추가

  years.forEach(year => {
    const yearData = data.find(d => d.year === year);
    if (yearData) { // 데이터가 존재하는지 확인
      const yearGroup = g.append("g")
        .attr("transform", `translate(${x0(year)},0)`);

      yearGroup.selectAll("rect")
        .data(categories.map(category => ({ category: category, value: +yearData[category] })))
        .enter().append("rect")
        .attr("x", d => x1(d.category))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => z(d.category));
    } else {
      console.warn(`No data for year: ${year}`);
    }
  });

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0));

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(10));

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


// 데이터 버튼 클릭 이벤트 추가
document.getElementById('after-bully-container').addEventListener('click', function(event) {
  if (event.target.closest('.data-btn') && event.target.hasAttribute('data-groups')) {
    const groups = event.target.getAttribute('data-groups').split(',');
    const src = event.target.getAttribute('data-src');
    const groupSelect = document.getElementById('groupSelect');
    console.log("groupSelect", groupSelect);
    groupSelect.innerHTML = '';  // 기존 내용을 지움

    groups.forEach(group => {
      const input = document.createElement('input');
      input.type = 'button';
      input.value = group;
      input.dataset.src = src;  // data-src 속성 추가
      input.dataset.group = group;  // data-group 속성 추가
      groupSelect.appendChild(input);
    });

    initialize(src, groups[0]);  // 초기 그룹 설정
  }
});

// 그룹 선택 버튼 클릭 이벤트 추가
document.getElementById('groupSelect').addEventListener('click', function(event) {
  group=event.target.dataset.group;
  
  console.log("Group Select Clicked:", group);
  console.log("event.target", event.target.tagName);
  console.log("event.targetB", event.target.hasAttribute('data-group'));
  console.log("event.targetC", event.target.dataset.src);
  console.log("event.targetD", groupedData);
  event.preventDefault(); // 페이지 초기화를 막음
  if (event.target.tagName === 'BUTTON' && event.target.hasAttribute('data-group')) {
    console.log("Group Selected");
    const src = event.target.dataset.src;
    const group = event.target.dataset.group;
    console.log("Group Selected:B", groupedData[group]);
    showBarChart(groupedData[group]);  // 선택된 그룹에 맞게 차트 업데이트
  }
});
