document.addEventListener("DOMContentLoaded", function () {
  function renderActiveComponent(activeComponent) {
    const contentArea = document.getElementById("content-area");
    contentArea.innerHTML = ""; // Clear previous content
    switch (activeComponent) {
      case "family-type":
        contentArea.innerHTML = `
        <div id="famtype-container">
          <div>
            <button data-src="./data/famtype/kids_alone(o).csv">미취학 자녀가 혼자 있는 시간</button>
            <button data-src="./data/famtype/element_alone(o).csv">초등학생 자녀가 혼자 있는 시간</button>
            <button data-src="./data/famtype/middle_alone(o).csv">중학생 이상 자녀가 혼자 있는 시간</button>
          </div>
          <div id="data-container-fam"></div>
          <form id="dataSelect">
            <input type="button" data-group="g1" value="한부모 연령별">
            <input type="button" data-group="g2" value="한부모 학력별">
            <input type="button" data-group="g3" value="혼인 상태별">
            <input type="button" data-group="g4" value="가구 구성별">
            <input type="button" data-group="g5" value="가장 어린 자녀별">
            <input type="button" data-group="g6" value="종사상 지위별">
            <input type="button" data-group="g7" value="정부 지원 유형별">
            <input type="button" data-group="g8" value="소득 수준별">
            <input type="button" data-group="g9" value="한부모가된 기간별">
          </form>
        </div>
        `;
        // Append script dynamically
        const scriptFamtype = document.createElement("script");
        scriptFamtype.src = "js/famtype/stacked.js";
        contentArea.appendChild(scriptFamtype);
        break;

      // 가정폭력 케이스
      case "dom-violence":
        contentArea.innerHTML = `
        <div class="container1">
  <!-- 경찰청 가정폭력 피해자 보호조치 현황 -->
  <div id="chart-container" class="graph-protection">
      <p class="protection-title">경찰청 가정폭력 피해자 보호조치 현황</p>
      <div id="chart"></div> 
  </div>

  <!-- 만 18세 이전 보호자로부터의 폭력 피해 경험 -->
  <div id="chart-container" class="graph-violenceExp">
      <p class="violenceExp-title">만 18세 이전 보호자로부터의 폭력 피해 경험</p>
      <div id="violenceExp-chart"></div>
  </div>
  </div>
  `;

        // 보호조치 현황 차트 스크립트 로드
        const script1 = document.createElement("script");
        script1.src = "js/violence/ProtectionChart.js";
        script1.onload = () => {
          const protectionChart = new ProtectionChart();
          const chartContainer = document.getElementById("chart");
          chartContainer.appendChild(protectionChart.render());
        };
        document.body.appendChild(script1);

        // 폭력 피해 경험 차트 스크립트 로드
        const script2 = document.createElement("script");
        script2.src = "js/violence/violenceExp.js";
        script2.onload = () => {
          const violenceExpChart = new ViolenceExpChart("violenceExp-chart");
          violenceExpChart.render();
        };
        document.body.appendChild(script2);
        break;

      case "school-violence":
        contentArea.innerHTML = `
        <div id="school-violence-container">
          <div>
              <button class="data-btn" data-groups="초4,초5,초6,중1,중2,중3,고1,고2,고3" data-src="./data/school/bully_exp_grade.csv">학년별 피해경험</button>
              <button class="data-btn" data-groups="남자,여자" data-src="./data/school/bully_exp_sex.csv">성별 피해경험</button>
              <button class="data-btn" data-groups="남학교,여학교,남녀공학" data-src="./data/school/bully_exp_school_type.csv">학교유형별 피해경험</button>
              <button class="data-btn" data-groups="초등학교,중학교,고등학교" data-src="./data/school/bully_exp_school_step.csv">진학단계별 피해경험</button>
          </div>
          <form id="groupSelect">
              <!-- 버튼 클릭 시 여기에 data-group 값이 표시됩니다 -->
          </form>
          <canvas id="chart"></canvas>
        </div>

      `; // Replace with actual HTML content

        const scriptschool = document.createElement("script");
        scriptschool.src = "js/school/stacked.js";
        contentArea.appendChild(scriptschool);
        break;
      default:
        contentArea.innerHTML = "<div>기본 콘텐츠</div>"; // Replace with actual HTML content
    }
  }
  document.addEventListener("click", function (event) {
    if (
      event.target.hasAttribute("data-src") &&
      event.target.closest("#famtype-container")
    ) {
      // family-type 관련 로직
      const groups = event.target.getAttribute("data-groups").split(",");
      const groupSelect = document.getElementById("groupSelect");

      groupSelect.innerHTML = "";
      groups.forEach((group) => {
        const button = document.createElement("button");
        button.textContent = group;
        button.setAttribute("data-group", group);
        groupSelect.appendChild(button);
      });
      const dataSrc = event.target.getAttribute("data-src");
      console.log("Selected CSV: ", dataSrc); // CSV 파일 경로 출력
      console.log("Default Group: ", groups[0]); // 기본 그룹 출력
      loadAndRenderChart(dataSrc);
    } else if (
      event.target.hasAttribute("data-src") &&
      event.target.closest("#school-violence-container")
    ) {
      // school-violence 관련 로직
      const groups = event.target.getAttribute("data-groups").split(",");
      const groupSelect = document.getElementById("groupSelect");

      groupSelect.innerHTML = "";
      groups.forEach((group) => {
        const button = document.createElement("button");
        button.textContent = group;
        button.setAttribute("data-group", group);
        groupSelect.appendChild(button);
      })
      //else if로 dom-violence 관련 로직 추가하시면됩니다.;

      const dataSrc = event.target.getAttribute("data-src");
      console.log("Selected CSV (school-violence)main:", dataSrc); // CSV 파일 경로 출력
      console.log("Default Group (school-violence)main:", groups); // 기본 그룹 출력

      // 그룹 버튼 클릭 이벤트 핸들러 추가
      d3.selectAll("#groupSelect button").on("click", function () {
        d3.selectAll("#groupSelect button").classed("active", false);
        d3.select(this).classed("active", true);

        const group = d3.select(this).attr("data-group");
        console.log("Selected Group (school-violence):", group); // 선택된 그룹 출력
        loadAndRenderChartSchoolViolence(dataSrc, group); // school-violence 관련 차트 로드 함수 호출
      });
      groupSelect.style.display = "block";
    }
  });

  renderMenuComponent();
  renderActiveComponent("dom-violence"); // Default component

  function setActiveComponent(component) {
    renderActiveComponent(component);
  }

  window.setActiveComponent = setActiveComponent; // Expose to global scope for menu to use
});