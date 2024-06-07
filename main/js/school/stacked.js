// 데이터 초기화 함수
function initialize(csvFile, defaultGroup) {
    d3.csv(csvFile).then((data) => {
        groupedData = {};
        data.forEach((d) => {
            const group = d.group;
            if (!groupedData[group]) {
                groupedData[group] = [];
            }
            groupedData[group].push(d);
        });
        // 그룹 버튼 생성
        const groupSelect = document.getElementById('groupSelect');
        groupSelect.innerHTML = ''; // 기존 내용을 지움
        const groups = Object.keys(groupedData);
        groups.forEach(group => {
            const button = document.createElement('button');
            button.textContent = group;
            button.setAttribute('data-group', group);
            button.addEventListener('click', function() {
                // 모든 버튼에서 'active' 클래스 제거
                document.querySelectorAll('#groupSelect button').forEach(btn => btn.classList.remove('active'));
                // 클릭된 버튼에 'active' 클래스 추가
                button.classList.add('active');
                // 해당 그룹의 데이터 표시
                showStackedBarChart(groupedData[group]);
            });
            groupSelect.appendChild(button);
        });
        if (groupedData[defaultGroup]) {
            originalData = [...groupedData[defaultGroup]];
            showStackedBarChart(groupedData[defaultGroup]); // 초기 차트 표시
            d3.select(`#groupSelect button[data-group='${defaultGroup}']`).classed('active', false ); // 초기 버튼 활성화
        } else {
        d3.selectAll("#groupSelect button")
            .on("click", function (event) {
                event.preventDefault();
                d3.selectAll("#groupSelect button").classed('active', true);
                d3.select(this).classed('active', true);
                const group = d3.select(this).attr("data-group");
                 if (groupedData[group]) {
                    originalData = [...groupedData[group]];  // 원래 데이터를 저장
                    showStackedBarChart(groupedData[group]);
                } else {
                    console.error("Selected group data not found:", group);
                } // 선택된 그룹 출력
  
            });
    }
});
}

// 차트 렌더링 함수
function showStackedBarChart(data) {
    const width = 800;
    const height = 500;
    const margin = { top: 100, right: 30, bottom: 50, left: 60 };

    d3.select("#school-violence-container svg").remove(); // 기존 SVG 제거
    d3.select("#sort-buttons").remove(); // 기존 버튼 제거

    // COLOR
    const color = "#87CEFA";
    console.log("data", data);
    const svg = d3.select("#school-violence-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("style", "position: absolute; left: 350px;") // 왼쪽으로 붙이기
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d["학폭피해경험 유"])])
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => d + '%'); 

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "14px"); // x축 글자 크기 키우기


    svg.append("g")
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "14px"); // y축 글자 크기 키우기

    const bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d["학폭피해경험 유"]))
        .attr("height", d => height - yScale(d["학폭피해경험 유"]))
        .attr("width", xScale.bandwidth())
        .attr("fill", color)
        .on("click", function(event, d) {
            const sortedData = [...data].sort((a, b) => a["학폭피해경험 유"] - b["학폭피해경험 유"]);
            showStackedBarChart(sortedData);
        });
    // 막대 그래프에 값 표시
    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => xScale(d.year) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d["학폭피해경험 유"]) - 5)
        .attr("text-anchor", "middle")
        .text(d => `${(+d["학폭피해경험 유"]).toFixed(2)}%`); // 숫자로 변환

    //막대그래프의 제목달기
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -40) // 상단 여백을 줌
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("font-weight", "bold")
        .text(`(Group : ${data[0].group})의 연도별 학교폭력 피해 경험 비율`);
    
    // 추세선 그리기
    drawTrendLine(svg, xScale, yScale, data);

    // 학폭피해경험 유의 경우 추세선 그려주는 함수
    function drawTrendLine(svg, xScale, yScale, data) {
    const trendData = data.map(d => ({ year: d.year, value: +d["학폭피해경험 유"] }));

    const line = d3.line()
        .x(d => xScale(d.year) + xScale.bandwidth() / 2)
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(trendData)
        .attr("class", "trend-line")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "red")
        .style("stroke-width", 2)
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1);
        
    svg.selectAll(".dot")
        .data(trendData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.year) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.value))
        .attr("r", 5)
        .attr("fill", "red");
    }
    const svgHeight = height + margin.top + margin.bottom-150;
    console.log("svgHeight", svgHeight);
    const buttonTop = svgHeight + 100; // SVG 하단 아래 20px에 버튼 배치

    const buttonContainer = d3.select("#school-violence-container")
        .append("div")
        .attr("id", "sort-buttons")
        .style("text-align", "left") // 버튼을 왼쪽으로 정렬
        .style("margin-top", "10px")
        .style("position", "relative")
        .style("top", `${svgHeight}px`); // SVG 바로 아래에 위치시키기 

    
    // SVG의 실제 높이를 계산하여 버튼 위치를 조정
    
    buttonContainer.selectAll("button")
        .data(["오름차순 정렬", "내림차순 정렬"])
        .enter()
        .append("button")
        .text(d => d)
        .on("click", function(event, d) {
            if (d === "오름차순 정렬") {
                isAscending = true;
                const sortedData = [...originalData].sort((a, b) => +a["학폭피해경험 유"] - +b["학폭피해경험 유"]); // 숫자로 변환
                showStackedBarChart(sortedData);
            } else if (d === "내림차순 정렬") {
                isAscending = false;
                const sortedData = [...originalData].sort((a, b) => +b["학폭피해경험 유"] - +a["학폭피해경험 유"]); // 숫자로 변환
                showStackedBarChart(sortedData);
            }
        });

        // 버튼 컨테이너 아래에 텍스트 추가
    buttonContainer.append("div")
    .attr("id", "chart-info")
    .style("margin-top", "10px")
    .text("(출처: 여성가족부 「청소년매체이용및유해환경실태조사」 )");

}

document.getElementById('school-violence-container').addEventListener('click', function(event) {
    if (event.target.closest('.data-btn') && event.target.hasAttribute('data-groups')) {
        
        const groups = event.target.getAttribute('data-groups').split(',');
        const src = event.target.getAttribute('data-src');
        const groupSelect = document.getElementById('groupSelect');
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

document.getElementById('groupSelect').addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON' && event.target.hasAttribute('data-group')) {
        event.preventDefault();  // 페이지 초기화를 막음
        const group = event.target.getAttribute('data-group');
        showStackedBarChart(groupedData[group]);  // 선택된 그룹에 맞게 차트 업데이트
    }
});
