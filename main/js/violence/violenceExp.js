class ViolenceExpChart {
  constructor(containerId) {
    this.containerId = containerId;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (container) {
      // Load and process the CSV data
      d3.csv(
        "data/domestic_violence/만_18세_이전_보호자로부터_폭력_피해_경험_20240503232633_utf8.csv"
      ).then(function (data) {
        // 데이터 매핑
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

        visualizeData(processedData);

        function visualizeData(data) {
          const width = 1000;
          const height = 600;
          const marginTop = 10;
          const marginRight = 100; // Increased margin for legend
          const marginBottom = 20;
          const marginLeft = 40;

          // State for sorting order by gender
          const sortingOrders = {
            여자: null,
            남자: null,
          };

          const genders = Array.from(new Set(data.map((d) => d.gender)));

          const svg = d3
            .select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

          const fx = d3
            .scaleBand()
            .domain(data.map((d) => d.state))
            .rangeRound([marginLeft, width - marginRight])
            .paddingInner(0.1);

          const x = d3
            .scaleBand()
            .domain(["여자", "남자"])
            .rangeRound([0, fx.bandwidth()])
            .padding(0.05);

          const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .nice()
            .range([height - marginBottom, marginTop]);

          const color = d3
            .scaleOrdinal()
            .domain(["여자", "남자"])
            .range(["#ff9393", "#313e79"]);

          // Create a tooltip
          const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "rgba(255, 255, 255, 0.8)")
            .style("border", "1px solid #ddd")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("text-align", "left")
            .style("font-size", "12px");

          const stateGroups = svg
            .selectAll(".state-group")
            .data(
              d3.group(data, (d) => d.state),
              (d) => d[0]
            )
            .enter()
            .append("g")
            .attr("class", "state-group")
            .attr("transform", (d) => `translate(${fx(d[0])},0)`);

          stateGroups
            .selectAll("rect")
            .data(
              (d) => d[1],
              (d) => d.gender
            )
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.gender))
            .attr("y", (d) => y(0))
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("fill", (d) => color(d.gender))
            .on("mouseover", (event, d) => {
              tooltip
                .style("visibility", "visible")
                .text(`${d.gender}: ${d.value}`);
            })
            .on("mousemove", (event) => {
              tooltip
                .style("top", event.pageY - 10 + "px")
                .style("left", event.pageX + 10 + "px");
            })
            .on("mouseout", () => {
              tooltip.style("visibility", "hidden");
            })
            .transition() // Add transition for the initial rendering
            .duration(1000)
            .attr("y", (d) => y(d.value))
            .attr("height", (d) => height - marginBottom - y(d.value));

          svg
            .append("g")
            .attr("class", "violenceExp-x-axis")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(fx).tickSizeOuter(0))
            .call((g) => g.selectAll(".domain").remove())
            .selectAll(".tick text")
            .attr("class", "violenceExp-x-text");

          svg
            .append("g")
            .attr("class", "violenceExp-y-axis")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(null, "s"))
            .call((g) => g.selectAll(".domain").remove())
            .selectAll(".tick text")
            .attr("class", "violenceExp-y-text");

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
            .on("click", function (event, genderClicked) {
              // Toggle sorting order for the clicked gender
              sortingOrders[genderClicked] =
                sortingOrders[genderClicked] === null
                  ? false
                  : !sortingOrders[genderClicked];

              // Prepare the sorting function
              const sortByGender = sortingOrders[genderClicked]
                ? d3.ascending
                : d3.descending;

              // Sort all data based on the clicked gender and recompute the state group order
              const sortedStates = Array.from(
                d3.group(data, (d) => d.state).values()
              )
                .sort((a, b) =>
                  sortByGender(
                    a.find((d) => d.gender === genderClicked).value,
                    b.find((d) => d.gender === genderClicked).value
                  )
                )
                .map((group) => group[0].state);

              // Update the fx scale domain with the new sorted order of states
              fx.domain(sortedStates);

              // Transition state groups to new positions
              const stateGroups = svg
                .selectAll("g.state-group")
                .data(sortedStates, (state) => state)
                .join(
                  (enter) =>
                    enter
                      .append("g")
                      .classed("state-group", true)
                      .attr(
                        "transform",
                        (state) => `translate(${fx(state)},0)`
                      ),
                  (update) =>
                    update.call((update) =>
                      update
                        .transition()
                        .duration(1000)
                        .attr(
                          "transform",
                          (state) => `translate(${fx(state)},0)`
                        )
                    ),
                  (exit) => exit.remove()
                );

              // Update rectangles within each state group based on the new sorting
              stateGroups.each(function (state) {
                const group = d3.select(this);
                const rects = group.selectAll("rect").data(
                  data.filter((d) => d.state === state),
                  (d) => d.gender
                );

                rects
                  .enter()
                  .append("rect")
                  .attr("x", (d) => x(d.gender))
                  .attr("y", (d) => y(0))
                  .attr("width", x.bandwidth())
                  .attr("height", 0)
                  .attr("fill", (d) => color(d.gender))
                  .on("mouseover", (event, d) => {
                    tooltip
                      .style("visibility", "visible")
                      .text(`${d.gender}: ${d.value}`);
                  })
                  .on("mousemove", (event) => {
                    tooltip
                      .style("top", event.pageY - 10 + "px")
                      .style("left", event.pageX + 10 + "px");
                  })
                  .on("mouseout", () => {
                    tooltip.style("visibility", "hidden");
                  })
                  .merge(rects)
                  .transition()
                  .duration(1000)
                  .attr("y", (d) => y(d.value))
                  .attr("height", (d) => y(0) - y(d.value));

                rects.exit().remove();
              });

              // Update the x-axis
              svg
                .select(".violenceExp-x-axis")
                .transition()
                .duration(1000)
                .call(d3.axisBottom(fx).tickSizeOuter(0))
                .call((g) => g.selectAll(".domain").remove())
                .selectAll(".tick text")
                .attr("class", "violenceExp-x-text");
            });

          legend
            .append("rect")
            .attr("x", -18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color);

          legend
            .append("text")
            .attr("x", 50)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text((d) => d);
        }
      });
    }
  }
}
