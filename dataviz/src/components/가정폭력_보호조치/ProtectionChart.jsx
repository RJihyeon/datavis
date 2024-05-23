import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function ProtectionChart({voronoi = false }) {
  const ref = useRef();
  ///data mapping
  const [unemployment, setData] = useState([]);

  useEffect(() => {
    d3.csv(
      "/domestic_violence/경찰청_가정폭력 피해자 보호조치 현황_20221231_utf8.csv"
    ).then((loadedData) => {
      console.log(loadedData); // 데이터 구조 확인
      setData(loadedData);
    });
  }, []);

  useEffect(() => {
    if (!unemployment.length) {
      return;
    }

    const width = 928;
    const height = 600;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 30;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // 초기화

    const x = d3
      .scaleUtc()
      .domain(d3.extent(unemployment, (d) => d.date))
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(unemployment, (d) => d.unemployment)])
      .nice()
      .range([height - marginBottom, marginTop]);

    svg.attr("viewBox", [0, 0, width, height]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Unemployment (%)")
      );

    const points = unemployment.map((d) => [
      x(d.date),
      y(d.unemployment),
      d.division,
    ]);

    if (voronoi) {
      svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr(
          "d",
          d3.Delaunay.from(points).voronoi([0, 0, width, height]).render()
        );
    }

    const line = d3.line();
    const path = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(
        d3
          .rollup(
            points,
            (v) => ({ points: v, z: v[0][2] }),
            (d) => d[2]
          )
          .values()
      )
      .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", (d) => line(d.points.map((p) => [p[0], p[1]])));

    // 이벤트 핸들러와 상호작용은 빼두었습니다. 필요하다면 추가해야 할 것입니다.
  }, [unemployment, voronoi]); // 종속성 배열에 voronoi 추가

  return <svg ref={ref} style={{ width: "100%", height: "auto" }}></svg>;
}

export default ProtectionChart;
