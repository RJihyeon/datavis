// violenceExp.js
class ViolenceExpChart {
  constructor(containerId) {
    this.containerId = containerId;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (container) {
      // Your chart rendering logic here

      // Load and process the CSV data
      d3.csv(
        "domestic_violence/만_18세_이전_보호자로부터_폭력_피해_경험_20240503232633_utf8.csv"
      ).then(function (data) {
        // 데이터 매핑 state-피해별 / gender : value / value : value
        const processedData = data.flatMap((d) => [
          {
            state: d["피해별(1)"],
            gender: "여자",
            value: +d["여자유"],
          },
          {
            state: d["피해별(1)"],
            gender: "남자",
            value: +d["남자유"],
          },
        ]);

        console.log(processedData);

        visualizeData(processedData);

        function visualizeData(data) {
          const width = 928;
          const height = 600;
          const marginTop = 10;
          const marginRight = 200; // Increased margin for legend
          const marginBottom = 20;
          const marginLeft = 40;

          // State for sorting order by gender
          const sortingOrders = {
            여자: null,
            남자: null,
          };

          // Prepare the scales for positional and color encodings.
          const fx = d3
            .scaleBand()
            .domain(Array.from(new Set(data.map((d) => d.state))))
            .rangeRound([marginLeft, width - marginRight])
            .paddingInner(0.1);

          // Both x and color encode the gender class.
          const genders = Array.from(new Set(data.map((d) => d.gender)));

          const x = d3
            .scaleBand()
            .domain(genders)
            .rangeRound([0, fx.bandwidth()])
            .padding(0.05);

          const colorRange =
            genders.length <= 2
              ? d3.schemeCategory10
              : d3.schemeSpectral[genders.length];
          const color = d3
            .scaleOrdinal()
            .domain(genders)
            .range(colorRange)
            .unknown("#ccc");

          // Y encodes the height of the bar.
          const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .nice()
            .rangeRound([height - marginBottom, marginTop]);

          // Create the SVG container.
          const svg = d3
            .select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

          // Append a group for each state, and a rect for each value.
          const stateGroups = svg
            .append("g")
            .selectAll("g")
            .data(d3.group(data, (d) => d.state))
            .join("g")
            .attr("transform", ([state]) => `translate(${fx(state)},0)`);

          const rects = stateGroups
            .selectAll("rect")
            .data(([, d]) => d)
            .join("rect")
            .attr("x", (d) => x(d.gender))
            .attr("y", (d) => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", (d) => y(0) - y(d.value))
            .attr("fill", (d) => color(d.gender));

          // Append the horizontal axis.
          svg
            .append("g")
            .attr("class", "violenceExp-x-axis")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(fx).tickSizeOuter(0))
            .call((g) => g.selectAll(".domain").remove());

          // Append the vertical axis.
          svg
            .append("g")
            .attr("class", "violenceExp-y-axis")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(null, "s"))
            .call((g) => g.selectAll(".domain").remove());

          // Append the legend.
          const legend = svg
            .append("g")
            .attr(
              "transform",
              `translate(${width - marginRight + 20},${marginTop})`
            )
            .attr("class", "violenceExp-legend")
            .selectAll("g")
            .data(genders)
            .join("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`)
            .style("cursor", "pointer")
            .on("click", function (event, d) {
              // Toggle sorting order for the clicked gender
              sortingOrders[d] =
                sortingOrders[d] === null ? false : !sortingOrders[d];

              // Filter data by gender
              const filteredData = data.filter((item) => item.gender === d);

              // Sort filtered data based on the current order
              filteredData.sort((a, b) =>
                sortingOrders[d]
                  ? d3.ascending(a.value, b.value)
                  : d3.descending(a.value, b.value)
              );

              // Update the fx scale domain
              fx.domain(Array.from(new Set(filteredData.map((d) => d.state))));

              // Transition the rectangles
              stateGroups
                .transition()
                .duration(1000)
                .attr("transform", ([state]) => `translate(${fx(state)},0)`);
            });

          legend
            .append("rect")
            .attr("x", -18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color);

          legend
            .append("text")
            .attr("x", -24)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text((d) => d);
        }
      });

    }
  }
}

export default ViolenceExpChart;
