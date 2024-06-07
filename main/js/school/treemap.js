
function showTreemap(dataFilePath, group) {
  d3.csv(dataFilePath).then(data => {
    const width = 1000; // 너비를 조정
    const height = 600;
    const treemapWidth = width - 400; // 트리맵의 너비 조정
    const treemapHeight = 450; // 트리맵 높이 // 트리맵 높이
    
    // 데이터 필터링
    const filteredData = data.filter(row => row.chracteristic === group);
    // 데이터 구조 변환
    const formattedData = filteredData.flatMap(row => 
      [
        { name: row.year, parent: null, value: 0, group:row.year }, // 각 year에 대한 항목 추가
        ...Object.keys(row)
          .filter(key => key !== 'year' && key !== 'chracteristic') // help_admin_bully 항목을 필터링
          .map(key => ({
            name: key,          // 각 항목의 이름
            parent: row.year,   // 부모 항목을 year로 설정
            value: +row[key],
            group: row.group    // 항목의 값
          }))
      ]
    );
 
    // 데이터 정렬
    const treemapData = formattedData.slice(0, 7);
    const root = d3.stratify()
      .id(d => d.name)       // 각 항목의 고유 ID
      .parentId(d => d.parent) // 각 항목의 부모 ID
      (treemapData)
      .sum(d => d.value)     // 각 항목의 값
      .sort((a, b) => b.value - a.value); // 값에 따라 정렬

    d3.treemap()
      .size([treemapWidth, treemapHeight])
      .padding(1)
      (root);

    // 툴팁 요소 추가
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "10px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    

      // 미리 정의된 색상
      const predefinedColors = [
        '#08306b', // Dark blue
        '#2171b5', // Blue
        '#4292c6', // Light blue
        '#6baed6', // Lighter blue
        '#9ecae1', // Even lighter blue
        '#c6dbef'  // Lightest blue
      ];
      // 데이터 정렬
      let sortedData = treemapData.sort((a, b) => b.value - a.value);
      
      // 색상 스케일 함수를 직접 구현
      function getColorForValue(value) {
        const index = sortedData.findIndex(d => d.value === value);
        return predefinedColors[index % 6];
      }
    d3.select("#after-bully-container").html("");
    const svg = d3.select("#after-bully-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("font", "10px sans-serif");
    
    // 제목 추가
    const years = [...new Set(formattedData.map(d => d.parent).filter(d => d !== null))]; // unique year values
    const yearText = years.join(', '); // join years with comma
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`${yearText}년도 유형별 학교폭력 피해 지원기관 (Group:${group})`); // 원하는 제목으로 변경

    // 중앙에 트리맵 배치
    const treemapGroup = svg.append("g")
    .attr("transform", `translate(${50}, ${(height - treemapHeight) / 2 + 20})`); // 왼쪽으로 50만큼 이동
    
    // 트리맵 셀 생성
    const cell = treemapGroup.selectAll("g")
      .data(root.leaves()) // 각 노드를 바인딩, 여기서 d는 각 노드
      .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`); // 각 셀의 위치 설정

    // 사각형 추가
    cell.append("rect")
      .attr("width", d => d.x1 - d.x0) // 셀의 너비
      .attr("height", d => d.y1 - d.y0) // 셀의 높이
      .attr("fill", d => getColorForValue(d.data.value)) // 색상 설정
      .on("mouseover", function(event, d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`${d.data.name}의 피해지원 비율: ${d.data.value}%`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // 텍스트 추가
    cell.append("text")
      .attr("x", d => (d.x1 - d.x0) / 2) // 셀의 중앙에 위치
      .attr("y", d => (d.y1 - d.y0) / 2)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .text(d => d.data.value !== null ? `${d.data.value}%` : "") // 값이 null이 아닐 때만 텍스트 표시
      .style("fill", d => {
        const value = d.data.value;
        return value >= 50 ? "white" : "black";
      })
      .style("font-size", d => Math.min((d.x1 - d.x0) / 5, (d.y1 - d.y0) / 5) + "px"); // 크기를 셀에 비례하게 설정

    // 범례 생성
   const legendData = root.leaves().map(d => ({
        name: d.data.name,
        color: getColorForValue(d.data.value)
      }));
    
    const legendGroup = svg.append("g")
      .attr("transform", `translate(${width-250}, ${150})`); // 트리맵 오른쪽에 범례를 배치

    // 범례 아이템 추가
    const legendItemSize = 30;
    const legendSpacing = 10;
    legendGroup.selectAll("rect")
      .data(legendData)
      .enter().append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * (legendItemSize + legendSpacing))
      .attr("width", legendItemSize)
      .attr("height", legendItemSize)
      .attr("fill", d => d.color);

    legendGroup.selectAll("text")
      .data(legendData)
      .enter().append("text")
      .attr("x", legendItemSize + legendSpacing)
      .attr("y", (d, i) => i * (legendItemSize + legendSpacing) + legendItemSize / 1.5)
      .attr("text-anchor", "start")
      .style("font-size", "14px") // 범례 글씨 크기 증가
      .text(d => `${d.name}`);

    // SVG 요소를 포함하는 부모 요소를 선택
    const parent = d3.select("#after-bully-container");

    // SVG 요소 아래에 버튼 추가
    parent.append("button")
      .text("메인 화면으로 이동하기")
      .on("click", function() {
      });
    parent.select("button").on("click", function() {
      window.history.back();
    });
  });
}

