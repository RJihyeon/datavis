import React, { useEffect } from "react";
import * as d3 from "d3";
import "./ReasonComponent.css";
import { Link } from "react-router-dom";

function ReasonComponent() {
  useEffect(() => {
    // 데이터 로드와 차트 그리기를 위한 함수
    const loadData = async () => {
      const data = await d3.csv("/domestic_violence/가출이유.csv");
      const firstRow = data[0];

      const categories = [
        "학업문제",
        "보호자와의 문제",
        "학교 갈등/폭력",
        "가정 경제적 어려움",
        "친구들과 함께하기 위해",
        "기타",
      ];
      const mappedData = categories.map((category) => ({
        category: category,
        value: +firstRow[category],
      }));

      const chartArea = d3.select("#chart");
      // 기존에 있던 SVG 제거
      chartArea.select("svg").remove();

      const width = 800;
      const height = 400;
      const margin = { top: 40, right: 20, bottom: 40, left: 60 };

      const svg = chartArea
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const xScale = d3
        .scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.1)
        .domain(mappedData.map((d) => d.category));

      const yScale = d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, d3.max(mappedData, (d) => d.value)]);
      // X 축 설정
      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("path, line")
        .style("stroke", "rgb(48, 36, 47)"); // 선 스타일 적용
      svg.selectAll(".tick text").style("fill", "rgb(48, 36, 47)");
      // 텍스트 스타일 적용

      // Y 축 설정
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))
        .selectAll("path, line")
        .style("stroke", "rgb(48, 36, 47)"); // 선 스타일 적용
      svg
        .selectAll(".tick text")
        .style("fill", "rgb(48, 36, 47)")
        .style("font-size", "11px");
      // 텍스트 스타일 적용

      // 바 차트 생성 및 링크 추가
      svg
        .selectAll(".bar")
        .data(mappedData)
        .enter()
        .append("rect")
        .attr("class", "reason-bar")
        .attr("x", (d) => xScale(d.category))
        .attr("y", (d) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - margin.bottom - yScale(d.value))
        .attr("fill", (d) =>
          [
            "보호자와의 문제",
            "학교 갈등/폭력",
            "기타",
            "친구들과 함께하기 위해",
          ].includes(d.category)
            ? "rgb(48, 36, 47)"
            : "#C1AECD"
        );

      // 툴팁 설정
      const tooltip = d3
        .select("#chart")
        .append("div")
        .attr("class", "tooltip1")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

      // 막대에 툴팁 이벤트 추가
      svg
        .selectAll(".bar")
        .on("mouseover", function (event, d) {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip
            .html(`Category: ${d.category}<br>Value: ${d.value}%`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    };

    loadData();
  }, []); // 의존성 배열이 빈 배열이면 컴포넌트 마운트 시 한 번만 실행됩니다.

  return (
    <div className="reason-body">
      <h1 className="reason-title">청소년 가출 이유</h1>
      <div id="chart" />
      <div className="reason-link">
        <Link to="/domviolence" className="link-button">
          가정폭력
        </Link>
        <Link to="/famtype" className="link-button">
          가정유형
        </Link>
        <Link to="/schoolviolence" className="link-button">
          학교폭력
        </Link>
      </div>
    </div>
  );
}

export default ReasonComponent;
