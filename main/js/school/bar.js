let groupedData = {};
function initialize(csvFile, defaultGroup) {
    d3.csv(csvFile).then((data) => {
        groupedData = {};
        data.forEach((d) => {
            const group = d.characteristic; // 필드명 수정
            if (!groupedData[group]) {
                groupedData[group] = [];
            }
            groupedData[group].push({
                group: d.characteristic, // 필드명 수정
                year: d.year,
                help_exp_no: +d.help_exp_no,
                help_exp_yes: +d.help_exp_yes
            });

        });

        
        if (groupedData[defaultGroup]) {
            
            showBarChart(groupedData[defaultGroup]); // 초기 차트 표시
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
                    showBarChart(groupedData[group]);
                } else {
                    console.error("Selected group data not found:", group);
                }
            });
    });
}

function showBarChart(data) {
    

  const margin = { top: 10, right: 30, bottom: 80, left: 50 }; 

  const svgContainer = d3.select("#after-bully-container");

  // 기존에 생성된 SVG 요소가 있으면 제거
  svgContainer.selectAll("svg").remove();

  const svg = svgContainer.append("svg")
      .attr("width", 800)
      .attr("height", 500)
      .attr("transform", `translate(10, 20)`);
  svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 800)
    .attr("height", 500)
    .style("stroke", "red")
    .style("fill", "none")
    .style("stroke-width", "2");

  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  const customColors = ["#87CEFA", "#4169E1"];
  const color = d3.scaleOrdinal()
      .domain(["help_exp_no", "help_exp_yes"])
      .range(customColors);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

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

  

  // 그룹 생성
  const categoryGroup = g.selectAll(".category-group")
      .data(data)
      .enter().append("g")
      .attr("class", "category-group")
      .attr("transform", d => `translate(${x0(d.year)},0)`);
  // 막대 생성
  categoryGroup.selectAll(".bar")
    .data(d => categories.map(key => ({ key: key, value: d[key], year: d.year, group: d.group})))
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x1(d.key))
    .attr("y", height) // 초기 y 위치를 아래로 설정
    .attr("width", x1.bandwidth())
    .attr("height", 0) // 초기 height를 0으로 설정
    .attr("fill", d => color(d.key))
    .on("click", function(event, d) { // 막대 클릭 이벤트 리스너 추가
        if (d.key === 'help_exp_yes') {
            
            showDetails(d.year, d.key, d.group);
            console.log("showDetails", d);
        }
    })
    .transition() // 애니메이션 시작
    .duration(1000) // 애니메이션 지속 시간 (밀리초 단위)
    .attr("y", d => y(d.value))
    .attr("height", d => height - y(d.value))
    .on("end", function(d, i, nodes) {
      // 애니메이션이 끝난 후 레이블 추가
      if (i === nodes.length - 1) { // 마지막 transition이 끝난 후에만 실행
        d3.selectAll(".bar")
          .each(function(dd, j) {
            d3.select(this.parentNode).append("text")
              .attr("class", "label")
              .attr("x", x1(dd.key) + x1.bandwidth() / 2)
              .attr("y", y(dd.value) - 5)
              .attr("text-anchor", "middle")
              .text(dd.value.toFixed(2));
          });
      }
    });
  // x축 추가
  g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0).tickSizeOuter(0))
      .selectAll("text")
      .style("font-size", "1.5em"); // 폰트 크기 조정


  // 값 표시
  // 소숫점 둘째자리까지 표시
  
    // y축 추가
  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(10));

  // 범례 추가
  const legendData = ["피해 후 기관도움 유", "피해 후 기관도움 무"];
  const legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 14)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(legendData)
      .enter().append("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", d => color(d));

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(d => d);

    // 그래프 아래에 텍스트 추가
    svg.append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", height + margin.top + margin.bottom -25) // 텍스트를 더 아래로 이동
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("짙은 색은 피해 후 기관도움을 받은 학생을 나타냅니다. 클릭하면 상세 정보를 확인할 수 있습니다.");
}
function showDetails(year, key, group) {
    const detailsContainer = document.getElementById('after-bully-care-container');
    // 트리맵 데이터를 불러올 파일 경로 생성
    const dataFilePath = `./data/school/treemap_${year}_${key}.csv`;
    showTreemap(dataFilePath,group); // 트리맵 함수 호출
  }
// 데이터 버튼 클릭 이벤트 추가
document.getElementById('after-bully-container').addEventListener('click', function(event) {
    if (event.target.closest('.data-btn') && event.target.hasAttribute('data-groups')) {
        const groups = event.target.getAttribute('data-groups').split(',');
        const src = event.target.getAttribute('data-src');
        const groupSelect = document.getElementById('groupSelect');
        groupSelect.innerHTML = ''; // 기존 내용을 지움
        groups.forEach(group => {
            const input = document.createElement('input');
            input.type = 'button';
            input.value = group;
            input.dataset.src = src; // data-src 속성 추가
            input.dataset.group = group; // data-group 속성 추가
            groupSelect.appendChild(input);
        });

        initialize(src, groups[0]); // 초기 그룹 설정
    }
});

// 그룹 선택 버튼 클릭 이벤트 추가
document.getElementById('groupSelect').addEventListener('click', function(event) {
    event.preventDefault(); // 페이지 초기화를 막음
    if (event.target.tagName === 'BUTTON' && event.target.hasAttribute('data-group')) {
        const group = event.target.dataset.group;
        showBarChart(groupedData[group]); // 선택된 그룹에 맞게 차트 업데이트
    }
});
