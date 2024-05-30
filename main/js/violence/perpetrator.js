class PerpetratorChart {
  constructor(containerId) {
    this.containerId = containerId;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (container) {
      // Load and process the CSV data
      d3.csv("data/domestic_violence/폭력목격+주가해자.csv").then(function (
        data
      ) {
        // 데이터 매핑 perpetrator --> perpetrator / category : category / value : value
        const processedData = data.flatMap((d) => [
          {
            categoryGender: `${d["폭력별(1)"]}-${d["성별(1)"]}`,
            perpetrator: "주로 아버지가",
            value: +d["주로 아버지가"],
          },
          {
            categoryGender: `${d["폭력별(1)"]}-${d["성별(1)"]}`,
            perpetrator: "주로 어머니가",
            value: +d["주로 어머니가"],
          },
          {
            categoryGender: `${d["폭력별(1)"]}-${d["성별(1)"]}`,
            perpetrator: "아버지와 어머니가 비슷하게",
            value: +d["아버지와 어머니가 비슷하게"],
          },
          {
            categoryGender: `${d["폭력별(1)"]}-${d["성별(1)"]}`,
            perpetrator: "본 적이 없다",
            value: +d["본 적이 없다"],
          },
        ]);

        visualizeData(processedData);

        function visualizeData(data) {
          const width = 1300;
          const height = 500; // Adjusted height
          const margin = { top: 30, right: 20, bottom: 100, left: 330 };

          // Create SVG
          const svg = d3
            .select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

          // Create scales
          const x = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .range([0, width - margin.left - margin.right]);

          const y = d3
            .scaleBand()
            .domain(data.map((d) => d.categoryGender))
            .range([0, height - margin.top - margin.bottom])
            .padding(0.1);

          const color = d3
            .scaleOrdinal()
            .domain(data.map((d) => d.perpetrator))
            .range(["#8794e5", "#f0d3ed", "#e2e2e2", "#eff0f5"]);

          // Group data by categoryGender to stack
          const stack = d3
            .stack()
            .keys(color.domain())
            .value((d, key) => d[key] || 0)(
            d3
              .groups(data, (d) => d.categoryGender)
              .map(([key, values]) => ({
                categoryGender: key,
                ...Object.fromEntries(
                  values.map((d) => [d.perpetrator, d.value])
                ),
              }))
          );

          // Draw bars
          svg
            .append("g")
            .selectAll("g")
            .data(stack)
            .join("g")
            .attr("fill", (d) => color(d.key))
            .selectAll("rect")
            .data((d) => d)
            .join("rect")
            .attr("x", (d) => x(d[0]))
            .attr("y", (d) => y(d.data.categoryGender))
            .attr("height", y.bandwidth())
            .attr("width", (d) => x(d[1]) - x(d[0]))
            .append("title")
            .text((d) => `${d.data.categoryGender} ${d.key}: ${d[1] - d[0]}`);

          // Add axes
          svg
            .append("g")
            .attr(
              "transform",
              `translate(0,${height - margin.bottom - margin.top})`
            )
            .call(d3.axisBottom(x))
            .attr("class", "perpetrator-x-axis")
            .call((g) => g.selectAll(".domain").remove())
            .selectAll(".tick text")
            .attr("class", "perpetrator-x-text"); // Draw the x-axis

          svg
            .append("g")
            .call(d3.axisLeft(y))
            .attr("class", "perpetrator-y-axis")
            .call((g) => g.selectAll(".domain").remove())
            .selectAll(".tick text")
            .attr("class", "perpetrator-y-text"); // Draw the y-axis

          // Add tooltips
          const tooltip = d3
            .select(container)
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "white")
            .style("border", "1px solid #ddd")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("text-align", "left")
            .style("font-size", "12px");

          svg
            .selectAll("rect")
            .on("mouseover", (event, d) => {
              tooltip
                .style("visibility", "visible")
                .html(`Value: ${(d[1] - d[0]).toFixed(2)}`);
            })
            .on("mousemove", (event) => {
              tooltip
                .style("top", event.pageY - 10 + "px")
                .style("left", event.pageX + 10 + "px");
            })
            .on("mouseout", () => {
              tooltip.style("visibility", "hidden");
            });

          // Add legend
          // Add legend
          const legend = svg
            .selectAll(".legend")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr(
              "transform",
              (d, i) => `translate(${i * 250}, ${height - margin.bottom + 20})`
            );

          legend
            .append("rect")
            .attr("x", -300)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

          legend
            .append("text")
            .attr("x", -280)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text((d) => d);
        }
      });
    }
  }
}
