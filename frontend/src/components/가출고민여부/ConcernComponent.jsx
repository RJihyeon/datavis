import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./ConcernComponent.css";

function ConcernComponent() {
  const [data, setData] = useState([]);
  const [categoryKey, setCategoryKey] = useState("학교급별");

  useEffect(() => {
    d3.csv(
      "/domestic_violence/가출을_고민해_본_경험_20240503235457_utf8.csv"
    ).then((loadedData) => {
      console.log(loadedData); // 데이터 구조 확인
      setData(loadedData);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      updatePieChartAndLegend(categoryKey);
    }
  }, [data, categoryKey]);

  const allCategories = {
    성별: ["남자", "여자"],
    학교급별: ["초등학교", "초등(5~6학년)", "중학교", "고등학교"],
    고교유형별: ["일반/특목/자율", "특성화/마이스터고"],
  };

  function updatePieChartAndLegend(categoryKey) {
    const categories = allCategories[categoryKey];
    const pieData = categories.map((category) => {
      const foundData = data.find((d) => d["특성별(2)"] === category);
      return {
        category,
        value: foundData ? parseFloat(foundData["2022.2"]) : 0, // "가출한 적이 있다"에 해당하는 값
        no: foundData ? 100 - parseFloat(foundData["2022.2"]) : 0, // "가출한 적이 없다"에 해당하는 값
      };
    });

    console.log(categories);
    console.log("piedata21211221", pieData[0]);
    createPieChart(pieData[0], "#viz2"); //초기 차트 생성
    createLegend(categoryKey, allCategories, "#viz2");
  }
  function createPieChart(data, selector) {
    console.log(data.value, data.no);
    d3.select(selector).select("svg").remove();
    const width = 300; // SVG의 너비
    const height = 300; // SVG의 높이
    const radius = Math.min(width, height) / 2; // 파이 차트 반지름

    const svg = d3
      .select(selector)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // 색상 스케일 정의
    const customColors = ["#C1AECD", "#7D7085"];
    const color = d3.scaleOrdinal(customColors);
    const pieData = [
      { category: "가출을 고민한 적이 있다", value: data.value },
      { category: "가출을 고민한 적이 없다", value: data.no },
    ];

    const pie = d3.pie().value((d) => d.value);
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius * 0.8); // 외부 반지름 조정

    const data_ready = pie(pieData);

    svg
      .selectAll("path")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    svg
      .selectAll("text")
      .data(data_ready)
      .enter()
      .append("text")
      .text((d) => `${d.data.category} (${d.data.value}%)`)
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px"); // 텍스트 크기 조정
  }

  function createLegend(categoryKey, categories, selector) {
    // 기존의 레전드 요소를 모두 삭제
    d3.select(selector).selectAll(".legend").remove();

    // 새 범례 컨테이너 추가
    const legend = d3.select(selector).append("div").attr("class", "legend");

    // 범례 항목을 새로 추가
    const legendEntries = legend
      .selectAll(".legend-entry1")
      .data(categories[categoryKey]) // 카테고리 키에 해당하는 카테고리 데이터 바인딩
      .enter()
      .append("div")
      .attr("class", "legend-entry1")
      .text((d) => d);

    // 레전드 클릭 이벤트 리스너 추가
    legendEntries.on("click", (event, d) => {
      // 클릭된 카테고리에 해당하는 데이터로 차트 업데이트
      const pieData = categories[categoryKey].map((category) => {
        const foundData = data.find(
          (dataItem) => dataItem["특성별(2)"] === category
        );
        return {
          category,
          value: foundData ? parseFloat(foundData["2022.2"]) : 0,
          no: foundData ? parseFloat(foundData["2022.1"]) : 0,
        };
      });

      // 클릭한 카테고리에 해당하는 데이터로 파이 차트 업데이트
      const selectedData = pieData.find((p) => p.category === d);
      createPieChart(selectedData, "#viz2");
    });
  }

  return (
    <div>
      <h2 className="Runaway-title">가출을 고민해 본 경험</h2>
      <select
        value={categoryKey}
        onChange={(e) => setCategoryKey(e.target.value)}
      >
        {Object.keys(allCategories).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <div id="viz2" style={{ width: "400px", height: "400px" }}></div>
    </div>
  );
}

export default ConcernComponent;
