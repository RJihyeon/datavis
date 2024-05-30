//bubble chart

//데이터 형식 다시 저장하기

d3.csv("./data/domestic_violence/report.csv").then(function (data) {
  const processedData = data.flatMap((d) => {
    const year = d["연도"];
    return Object.keys(d).filter(key => key!=='연도').map(city => ({
      year,
      city,
      value: +d[city]
    }))

});

  console.log(processedData);
});
