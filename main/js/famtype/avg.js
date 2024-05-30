d3.csv("./data/famtype/age.csv").then((dataset) => {
    console.log(dataset);
    showBarChart(dataset);
});

function showBarChart(data) {
    const width = 300;
    const height = 300;
    const margin = 30;
    let = sortAscending = true;

    // Define 'svg' as a child-element (g) from the drawing area and include spaces
    const svg = d3
        .select("#data-container-avg")
        .append("svg")
        .attr("width", width + margin * 2)
        .attr("height", width + margin * 2)
        .append("g")
        .attr("transform", `translate(${margin + 100}, ${margin + 50})`);

    // Initialize linear and ordinal scales (input domain and output range)
    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.age)])
        .range([0, width]);

    const yScale = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, height])
        .paddingInner(0.1);

    // Initialize axes
    const xAxis = d3.axisBottom().scale(xScale);
    const xAxisGroup = svg
        .append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);

    //Draw the axis
    const yAxis = d3.axisLeft(yScale);
    const yAxisGroup = svg.append("g").call(yAxis);

    //Bar 추가
    const bars = svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("fill", "steelblue")
        .attr("width", 0) // ** 여기를 처음에 0으로 설정해줘야 animation 들어감
        .attr("height", yScale.bandwidth())
        .attr("y", (d) => yScale(d.name))
        .attr("x", 0);
    bars
        // ** transition 이전에 mouseover가 올라와야 함
        .on("mouseover", (event, d) => {
            d3
                .select("#tooltip")
                .style("display", "block").html(`
        <div class="tooltip-label">
        <div class = "tooltip-label">
            <div>Age</div>
            <div>${d.name}: ${d.age}</div></div>
        </div>`);
        })
        .on("mousemove", (event) => {
            d3.select("#tooltip")
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");
        })
        .on("mouseleave", () => {
            d3.select("#tooltip").style("display", "none");
        })
        
        //transition을 생성합니다.
        .transition()
        .attr("width", (d) => xScale(d.age)) //animation이 끝났을 때 있어야 하는 값 넣어주기
        //500ms동안 bar의 width를 늘려줍니다.
        .duration(500)
        //두 번째 인자 i는 현재 bar의 index를 의미합니다. 0, 1, 2, 3 ...
        .delay((d, i) => { // ** 첫 번째부터 순차적으로 나오게 순서별 delay를 줌. 각각 시작 시간 다르게
            return (i / data.length) * 1000;
        })


    function sortBars() {
        data.sort((a, b) => {
            //sortAscending가 true라면 오름차순, false라면 내림차순으로 data를 정렬합니다.
            //a, b는 비교되는 두 요소입니다
            //d3.ascending, d3.descending 함수에 a, b값을 넘겨주면 정렬된 data를 반환합니다.
            return sortAscending
                ? d3.ascending(a.age, b.age)
                : d3.descending(a.age, b.age);
        });
        //정렬된 data에 맞게 yScale을 재정의해줍니다.
        yScale.domain(data.map((d) => d.name));
        //bar y값을 transition하여 위치를 변경합니다.
        svg
            .selectAll("rect")
            .data(data, (d) => d.name)
            .transition()
            .duration(1000)
            .attr("y", (d) => yScale(d.name));
        //axis group의 위치를 변경합니다.
        yAxisGroup.transition().duration(1000).call(yAxis);
        //sortAscending의 값이 true라면 false로, false라면 true로 값을 뒤집습니다.
        sortAscending = !sortAscending;

    }

    bars.on("click", () => {
        console.log();
        sortBars();
    });
}

