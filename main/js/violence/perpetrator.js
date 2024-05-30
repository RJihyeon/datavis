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
        // 데이터 매핑 perpetrator -->prepetrator / category : category / value  : value
        const processedData = data.flatMap((d) => [
          {
            category: d["폭력별(1)"],
            gender: d["성별(1)"],
            perpetrator: "주로 아버지가",
            value: +d["주로 아버지가"],
          },
          {
            category: d["폭력별(1)"],
            gender: d["성별(1)"],
            perpetrator: "주로 어머니가",
            value: +d["주로 어머니가"],
          },
          {
            category: d["폭력별(1)"],
            gender: d["성별(1)"],
            perpetrator: "아버지와 어머니가 비슷하게",
            value: +d["아버지와 어머니가 비슷하게"],
          },
          {
            category: d["폭력별(1)"],
            gender: d["성별(1)"],
            perpetrator: "본 적이 없다",
            value: +d["본 적이 없다"],
          },
        ]);

        console.log(processedData);

        visualizeData(processedData);

        function visualizeData(data) {
          // Specify the chart’s dimensions (except for the height).
          const width = 928;
          const marginTop = 30;
          const marginRight = 20;
          const marginBottom = 0;
          const marginLeft = 30;

          // Determine the series that need to be stacked.

          // 각 가해자 유형에 대한 고유 키 배열 생성
          const keys = Array.from(
            new Set(processedData.map((d) => d.perpetrator))
          );

          // 데이터를 스택 구조로 변환
          const series = d3
            .stack()
            .keys(keys)
            .value((d, key) => d[key] || 0)(
            // 해당 키에 대응하는 값을 직접 참조하여 반환
            processedData.reduce((acc, d) => {
              // category 별로 데이터 구조화
              let entry = acc.find((entry) => entry.category === d.category);
              if (!entry) {
                entry = { category: d.category };
                keys.forEach((key) => (entry[key] = 0)); // 모든 키에 대해 초기값 0 설정
                acc.push(entry);
              }
              entry[d.perpetrator] = d.value; // 해당 가해자 키에 값을 설정
              return acc;
            }, [])
          );

          // group by stack then series key

          // Compute the height from the number of stacks.
          const height = series[0].length * 25 + marginTop + marginBottom;

          // Prepare the scales for positional and color encodings.
          const x = d3
            .scaleLinear()
            .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
            .range([marginLeft, width - marginRight]);

          const y = d3
            .scaleBand()
            .domain(
              d3.groupSort(
                data,
                (D) =>
                  -D.find((d) => d.perpetrator === "주로 어머니가").value /
                  d3.sum(D, (d) => d.value),
                (d) => d.category
              )
            )
            .range([marginTop, height - marginBottom])
            .padding(0.08);

          const color = d3
            .scaleOrdinal()
            .domain(series.map((d) => d.key))
            .range(d3.schemeSpectral[series.length])
            .unknown("#ccc");

          // A function to format the value in the tooltip.
          const formatValue = (x) =>
            isNaN(x) ? "N/A" : x.toLocaleString("en");

          // Create the SVG container.
          const svg = d3
            .select("#" + container.id)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

          // Append a group for each series, and a rect for each element in the series.
          // 가정: x, y, color 스케일은 이미 적절히 설정되어 있음

          svg
            .append("g")
            .selectAll("g")
            .data(series)
            .enter()
            .append("g")
            .attr("fill", (d) => color(d.key))
            .selectAll("rect")
            .data((d) => d)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d[0]))
            .attr("y", (d) => y(d.data.category))
            .attr("width", (d) => x(d[1]) - x(d[0]))
            .attr("height", y.bandwidth())
            .append("title")
            .text((d) => {
              console.log("Data object:", d.data);
              console.log("Key:", d.key);
              console.log("Value:", d.data[d.key]);
              return `${d.data.category} ${d.key}: ${
                d.data[d.key] ? d.data[d.key].toLocaleString() : "N/A"
              }`;
            });

          // Append the horizontal axis.
          svg
            .append("g")
            .attr("transform", `translate(0,${marginTop})`)
            .call(d3.axisTop(x).ticks(width / 100, "%"))
            .call((g) => g.selectAll(".domain").remove());

          // Append the vertical axis.
          svg
            .append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .call((g) => g.selectAll(".domain").remove());

          // Return the chart with the color scale as a property (for the legend).
          return Object.assign(svg.node(), { scales: { color } });
        }
      });
    }
  }
}
