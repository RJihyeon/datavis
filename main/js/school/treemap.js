function showTreemap(dataFilePath, group) {
  d3.csv(dataFilePath).then(data => {
    const width = 800;
    const height = 500;

    // 데이터 필터링
    const filteredData = data.filter(row => row.chracteristic === group);
    console.log("filteredData", filteredData);
    // 데이터 구조 변환
  
    const formattedData = filteredData.flatMap(row => 
      [
        { name: row.year, parent: null, value: 0 }, // 각 year에 대한 항목 추가
        ...Object.keys(row)
          .filter(key => key !== 'year' && key !== 'chracteristic')
          .map(key => ({
            name: key,          // 각 항목의 이름
            parent: row.year,   // 부모 항목을 year로 설정
            value: +row[key]    // 항목의 값
          }))
      ]
    );
    console.log("formattedData", formattedData);
    const root = d3.stratify()
      .id(d => d.name)       // 각 항목의 고유 ID
      .parentId(d => d.parent) // 각 항목의 부모 ID
      (formattedData)
      .sum(d => d.value)     // 각 항목의 값
      .sort((a, b) => b.value - a.value); // 값에 따라 정렬

    d3.treemap()
      .size([width, height])
      .padding(1)
      (root);
      
      // 최소값과 최대값 계산
      const minValue = d3.min(formattedData, d => d.value > 0 ? d.value : Infinity);
      const maxValue = d3.max(formattedData, d => d.value);

      // 로그 스케일 생성
      const logScale = d3.scaleLog()
        .domain([minValue, maxValue])
        .range([0, 1]);
      
      // 색상 스케일 생성
      const colorScale = d3.scaleSequential()
        .domain([0, 1])
        .interpolator(d3.interpolateBlues);
      
    const svg = d3.select("#after-bully-container")
      .html("") // 기존 내용을 지움
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("font", "10px sans-serif");

    // 트리맵 셀 생성
    const cell = svg.selectAll("g")
      .data(root.leaves()) // 각 노드를 바인딩, 여기서 d는 각 노드
      .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`); // 각 셀의 위치 설정

    // 사각형 추가
    cell.append("rect")
      .attr("width", d => d.x1 - d.x0) // 셀의 너비
      .attr("height", d => d.y1 - d.y0) // 셀의 높이
      .attr("fill", d => colorScale(logScale(d.data.value))); // 색상 설정
    // 텍스트 추가
    cell.append("text")
      .attr("x", 3)
      .attr("y", 13)
      .text(d => d.data.name); // 텍스트 설정

        // SVG 요소를 포함하는 부모 요소를 선택
    const parent = d3.select("#after-bully-container");

    // SVG 요소 아래에 버튼 추가
    parent.append("button")
        .text("Click me")
        .on("click", function() {
            console.log("빡칠때마다 1번씩 클릭하기");
        });
    parent.select("button").on("click", function() {
      window.history.back();
        });     
});
}
