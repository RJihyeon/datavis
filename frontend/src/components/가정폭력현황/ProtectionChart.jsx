import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../main.css";

function ProtectionChart({ voronoi = false }) {
  const ref = useRef();
  ///data mapping
  const [protection, setData] = useState([]);

  useEffect(() => {
    let isMounted = true; // 마운트 상태를 추적하는 플래그

    d3.csv(
      "/domestic_violence/경찰청_가정폭력 피해자 보호조치 현황_20221231_utf8.csv"
    ).then((loadedData) => {
      const parsedData = loadedData.map((d) => ({
        year: +d.연도, // 연도를 숫자로 파싱
        emergencyMeasure2: +d["응급조치 2호(보호기관)"], // 응급조치 2호 데이터를 숫자로 파싱
        emergencyMeasure3: +d["응급조치 3호(의료기관)"], // 응급조치 3호 데이터를 숫자로 파싱
        urgentTemporaryMeasure: +d.긴급임시조치, // 긴급임시조치 데이터를 숫자로 파싱
        temporaryMeasureApplication: +d["임시조치 신청"], // 임시조치 신청 데이터를 숫자로 파싱
      }));
      setData(parsedData); // 상태 업데이트
    });

    return () => {
      isMounted = false; // 컴포넌트가 언마운트되면 플래그를 false로 설정
    };
  }, []);

  useEffect(() => {
    if (!protection.length) return;

    const width = 330;
    const height = 300;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 50;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // 초기화

    const x = d3
      .scaleBand()
      .domain(protection.map((d) => d.year))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const maxMeasure = Math.max(
      ...protection.flatMap((d) => [
        d.emergencyMeasure2,
        d.emergencyMeasure3,
        d.urgentTemporaryMeasure,
        d.temporaryMeasureApplication,
      ])
    );

    const y = d3
      .scaleLinear()
      .domain([0, maxMeasure])
      .nice()
      .range([height - marginBottom, marginTop]);

    svg.attr("viewBox", [0, 0, width, height]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y));

    // const lineGenerator = d3
    //   .line()
    //   .x((d) => x(d.year) + x.bandwidth() / 2) // 센터 정렬
    //   .y((d) => y(d.value));

    // const measures = [
    //   { key: "emergencyMeasure2", color: "blue" },
    //   { key: "emergencyMeasure3", color: "red" },
    //   { key: "urgentTemporaryMeasure", color: "green" },
    //   { key: "temporaryMeasureApplication", color: "purple" },
    // ];

    // measures.forEach((measure) => {
    //   svg
    //     .append("path")
    //     .datum(protection)
    //     .attr("fill", "none")
    //     .attr("stroke", measure.color)
    //     .attr("stroke-width", 1.5)
    //     .attr(
    //       "d",
    //       lineGenerator.y((d) => y(d[measure.key]))
    //     );
    // });

    //자이제 포인터를 만들러 갈거예요
    //일단은 x,y,z를 만들어 줍니다.
    const points = [];
    protection.forEach((d) => {
      points.push([
        x(new Date(d.year)),
        y(d.emergencyMeasure2),
        "응급조치 2호(보호기관)",
      ]);
      points.push([
        x(new Date(d.year)),
        y(d.emergencyMeasure3),
        "응급조치 3호(의료기관)",
      ]);
      points.push([
        x(new Date(d.year)),
        y(d.urgentTemporaryMeasure),
        "긴급임시조치",
      ]);
      points.push([
        x(new Date(d.year)),
        y(d.temporaryMeasureApplication),
        "임시조치 신청",
      ]);
    });

    //그룹 생성하기
    const groups = d3.rollup(
      points,
      (v) => Object.assign(v, { z: v[0][2] }),
      (d) => d[2] //각 포인트의 카테고리 이름
    );

    // Draw the lines.
    const line = d3.line();
    const path = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(groups.values())
      .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", line);

    // Add an invisible layer for the interactive tip.
    const dot = svg.append("g").attr("display", "none");
    dot.append("circle").attr("r", 2.5);

    dot.append("text").attr("text-anchor", "middle").attr("y", -8);

    svg
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", (event) => event.preventDefault());
    return () => {
      svg
        .selectAll("*")
        .on("pointerenter", null)
        .on("pointermove", null)
        .on("pointerleave", null);
    };

    return svg.node();

    // When the pointer moves, find the closest point, update the interactive tip, and highlight
    // the corresponding line. Note: we don't actually use Voronoi here, since an exhaustive search
    // is fast enough.

    function pointermoved(event) {
      const [xm, ym] = d3.pointer(event);
      const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
      const [x, y, k] = points[i];
      path
        .style("stroke", ({ z }) => (z === k ? null : "#ddd"))
        .filter(({ z }) => z === k)
        .raise();
      dot.attr("transform", `translate(${x},${y})`);
      dot.select("text").text(k);
      svg.property("value", protection[i]).dispatch("input", { bubbles: true });
    }

    function pointerentered() {
      path.style("mix-blend-mode", null).style("stroke", "#ddd");
      dot.attr("display", null);
    }

    function pointerleft() {
      path.style("mix-blend-mode", "multiply").style("stroke", null);
      dot.attr("display", "none");
      svg.node().value = null;
      svg.dispatch("input", { bubbles: true });
    }
  }, [protection, [voronoi]]);

  return (
    <div className="graph-protection">
      <p className="protection-title">경찰청 가정폭력 피해자 보호조치 현황</p>
      <svg ref={ref} style={{ width: "100%", height: "auto" }}></svg>
    </div>
  );
}

export default ProtectionChart;
