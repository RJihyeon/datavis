(function () {
  document.addEventListener("DOMContentLoaded", function () {
    d3.csv("domestic_violence/가출_여부_및_이유_20240503234321_utf8.csv").then(
      function (data) {
        console.log(data); // 데이터 구조 확인
        const allCategories = {
          학교급별: ["초등학교", "중학교", "고등학교"],
          고교유형별: ["일반계고", "특성화계고"],
          지역규모별: ["대도시", "중소도시", "읍면지역"],
          가족유형별: ["양부모가정", "한부모가정", "조손가정", "기타"],
        };

        // 메인 카테고리 드롭다운 생성
        createMainCategoryDropdown(Object.keys(allCategories));

        const initialCategory = "학교급별";
        updatePieChartAndLegend(initialCategory);

        function updatePieChartAndLegend(categoryKey) {
          const categories = allCategories[categoryKey];
          const pieData = categories.map((category) => {
            const foundData = data.find(
              (d) => d["응답자유형별(2)"] === category
            );
            return {
              category,
              value: foundData ? parseFloat(foundData["2023"]) : 0,
              no: foundData ? parseFloat(foundData["2023.1"]) : 0,
            };
          });

          createPieChart(pieData[0], "#viz3");
          createLegend(categories, "#viz3");
        }

        d3.selectAll(".legend-entry").on("click", function (event, d) {
          const selectedData = pieData.find((p) => p.category === d);
          createPieChart(selectedData, "#viz3");
        });

        d3.select("#category-selector").on("change", function (event) {
          updatePieChartAndLegend(event.target.value);
        });
      }
    );

    function createMainCategoryDropdown(categories) {
      const selector = d3
        .select("body")
        .append("select")
        .attr("id", "category-selector");
      selector
        .selectAll("option")
        .data(categories)
        .enter()
        .append("option")
        .text((d) => d)
        .attr("value", (d) => d);

      selector.on("change", function (event) {
        updatePieChartAndLegend(event.target.value);
      });
    }

    function createPieChart(data, selector) {
      d3.select(selector).select("svg").remove();
      const svg = d3
        .select(selector)
        .append("svg")
        .attr("width", 450)
        .attr("height", 450)
        .append("g")
        .attr("transform", "translate(225, 225)");
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const pieData = [
        { category: "가출한 적이 있다", value: data.value },
        { category: "가출한 적이 없다", value: data.no },
      ];
      const pie = d3.pie().value((d) => d.value);
      const arc = d3.arc().innerRadius(0).outerRadius(225);
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
        .style("font-size", 15);
    }

    function createLegend(categories, selector) {
      const legend = d3.select(selector).append("div").attr("class", "legend");
      legend
        .selectAll(".legend-entry")
        .data(categories)
        .enter()
        .append("div")
        .attr("class", "legend-entry")
        .text((d) => d)
        .style("color", (d, i) => d3.schemeCategory10[i % 10]);
    }
  });
})();
