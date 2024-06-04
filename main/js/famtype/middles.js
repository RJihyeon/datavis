// INITIALIZE - KIDS
d3.csv("./data/famtype/kids_alone.csv").then((data) => { // 초기 csv 파일 표시
    const groupedData_kids = {};
    data.forEach((d) => {
        const group = d.특성별;
        if (!groupedData_kids[group]) {
            groupedData_kids[group] = [];
        }
        groupedData_kids[group].push(d);
    });
});

// INITIALIZE - elements
d3.csv("./data/famtype/elements_alone.csv").then((data) => { // 초기 csv 파일 표시
    const groupedData_elements = {};

    data.forEach((d) => {
        const group = d.특성별;
        if (!groupedData_elements[group]) {
            groupedData_elements[group] = [];
        }
        groupedData_elements[group].push(d);
    });
});

// INITIALIZE - Middles
d3.csv("./data/famtype/middles_alone.csv").then((data) => { // 초기 csv 파일 표시
    const groupedData_middles = {};

    data.forEach((d) => {
        const group = d.특성별;
        if (!groupedData_middles[group]) {
            groupedData_middles[group] = [];
        }
        groupedData_middles[group].push(d);
    });
});

d3.select("#dataSelect input[type='button'][data-group='g1']").classed('active', true); // 초기 버튼 활성화
kids(groupedData_kids["한부모 연령별"]);// 초기 차트 표시
elements(groupedData_elements["한부모 연령별"]);// 초기 차트 표시
middles(groupedData_middles["한부모 연령별"]);// 초기 차트 표시


d3.selectAll("#dataSelect input[type='button']")
    .on("click", function () {

        d3.selectAll("#dataSelect input[type='button']").classed('active', false);
        d3.select(this).classed('active', true);

        const group = d3.select(this).attr("data-group");
        switch (group) {
            case "g1": kids(groupedData_kids["한부모 연령별"]); elements(groupedData_elements["한부모 연령별"]); middles(groupedData_middles["한부모 연령별"]); break;
            case "g2": kids(groupedData_kids["한부모 학력별"]); elements(groupedData_elements["한부모 학력별"]); middles(groupedData_middles["한부모 학력별"]); break;
            case "g3": kids(groupedData_kids["혼인 상태별"]); elements(groupedData_elements["혼인 상태별"]); middles(groupedData_middles["혼인 상태별"]); break;
            case "g4": kids(groupedData_kids["가구 구성별"]); elements(groupedData_elements["가구 구성별"]); middles(groupedData_middles["가구 구성별"]); break;
            case "g5": kids(groupedData_kids["가장 어린 자녀별"]); elements(groupedData_elements["가장 어린 자녀별"]); middles(groupedData_middles["가장 어린 자녀별"]); break;
            case "g6": kids(groupedData_kids["종사상 지위별"]); elements(groupedData_elements["종사상 지위별"]); middles(groupedData_middles["종사상 지위별"]); break;
            case "g7": kids(groupedData_kids["정부 지원 유형별"]); elements(groupedData_elements["정부 지원 유형별"]); middles(groupedData_middles["정부 지원 유형별"]); break;
            case "g8": kids(groupedData_kids["소득 수준별"]); elements(groupedData_elements["소득 수준별"]); middles(groupedData_middles["소득 수준별"]); break;
            case "g9": kids(groupedData_kids["한부모가된 기간별"]); elements(groupedData_elements["한부모가된 기간별"]); middles(groupedData_middles["한부모가된 기간별"]); break;
        }
    });