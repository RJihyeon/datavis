(function(){// 스크립트의 변수를 로컬로 제한하는 IIFE방식으로 충돌 방지

  //아래부터 쓰시면 됩니다. 아래 코드는 예시입니다.
const svg = d3.select("#viz1").append("svg")
    .attr("width", 600)
    .attr("height", 400);

svg.selectAll("rect")
    .data([10, 15, 20, 25, 30])
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 40)
    .attr("y", d => 400 - 10 * d)
    .attr("width", 35)
    .attr("height", d => 10 * d)
    .attr("fill", "teal");

    console.log("SVG added", svg);
})();