document.addEventListener("DOMContentLoaded", function () {
  function renderActiveComponent(activeComponent) {
    const contentArea = document.getElementById("content-area");
    contentArea.innerHTML = ""; // Clear previous content
    switch (activeComponent) {
      case "runaway":
        contentArea.innerHTML = `
      <div></div>`;

        const exp = document.createElement("script");
        exp.src = "js/runaway/bar.js";
        contentArea.appendChild(exp);
        break; // 추가

      case "family-type":
        contentArea.innerHTML = `
      <div id="famtype-container">
        <p class="title">한부모 가정 자녀의 혼자 있는 시간 (2021)</p>
        
        <form id="dataSelect">
          <input type="button" data-group="g4" value="가구 구성별">
          <input type="button" data-group="g5" value="가장 어린 자녀별">
          <input type="button" data-group="g8" value="소득 수준별">
          <input type="button" data-group="g7" value="정부 지원 유형별">
          <input type="button" data-group="g6" value="종사상 지위별">
          <input type="button" data-group="g2" value="한부모 기관유형별">
          <input type="button" data-group="g1" value="한부모 연령별">
          <input type="button" data-group="g9" value="한부모가된 기간별">
          <input type="button" data-group="g3" value="혼인 상태별">
        </form>

        <p class="sub-title">"자녀가 혼자 있는 시간이 있다"고 응답한 비율 (%)</p>

        <div class="container">
          <div id="chart-container1" class="chart-graph">
            <p class="chart-title">미취학 자녀</p>
            <div id="kids-compare"></div>
          </div>
          <div id="chart-container2" class="chart-graph">
            <p class="chart-title">초등학생 자녀</p>
            <div id="elements-compare"></div>
          </div>
          <div id="chart-container3" class="chart-graph">
            <p class="chart-title">중학생 이상 자녀</p>
            <div id="middles-compare"></div>
          </div>
        </div>

        <p class="sub-title">자녀의 혼자 있는 시간 비율 (%)</p>

        <div class="container">
          <div id="chart-container4" class="chart-graph">
            <p class="chart-title">미취학 자녀</p>
            <div id="kids-hours"></div>
          </div>
          <div id="chart-container5" class="chart-graph">
            <p class="chart-title">초등학생 자녀</p>
            <div id="elements-hours"></div>
          </div>
          <div id="chart-container6" class="chart-graph">
            <p class="chart-title">중학생 이상 자녀</p>
            <div id="middles-hours"></div>
          </div>
        </div>

        <p class="sub-title">한부모 가정 특성별 자녀의 혼자 있는 평균 시간 (시간)</p>

        <div class="container">
          <div id="chart-container7" class="chart-graph">
            <p class="chart-title">미취학 자녀</p>
            <div id="kids-avg"></div>
          </div>
          <div id="chart-container8" class="chart-graph">
            <p class="chart-title">초등학생 자녀</p>
            <div id="elements-avg"></div>
          </div>
          <div id="chart-container9" class="chart-graph">
            <p class="chart-title">중학생 이상 자녀</p>
            <div id="middles-avg"></div>
          </div>
        </div>

        </div>
        `;
        // Append script dynamically
        const scriptFamtype_1 = document.createElement("script");
        scriptFamtype_1.src = "js/famtype/alone.js";
        contentArea.appendChild(scriptFamtype_1);
        break;

      // 가정폭력 케이스
      case "dom-violence":
        contentArea.innerHTML = `

        <div id="heatmap-container" class="graph-report">
        <p class="perpetrator-title">2019-2022 검찰청 전국 가정폭력 검거건수 히트맵</p>
        <div id="heatmap-report"></div>
        <div id="report-tooltip" style="opacity:0; position: absolute;"></div>
    </div>
    
        <div id="chart-container" class="graph-report">
        <p class="perpetrator-title">2019-2022 검찰청 전국 가정폭력 검거 및 조치 현황</p>
        <div id="report-buttons">
            <button onclick="updateChart(2019)">2019</button>
            <button onclick="updateChart(2020)">2020</button>
            <button onclick="updateChart(2021)">2021</button>
            <button onclick="updateChart(2022)">2022</button>
        </div>
        <div id="report-chart"></div>
    </div>

    
  
    <div id="chart-container" class="graph-perpetrator">
    <p class="perpetrator-title">만 18세 이전 폭력 목격 경험 및 주가해자</p>
    <div id="perpetrator-chart"></div>
</div>

  `;

        // 보호조치 현황 차트 스크립트 로드
        const script1 = document.createElement("script");
        script1.src = "js/violence/report.js";
        contentArea.appendChild(script1);

        //폭력 목격 경험 차트 스크립트 로드
        const script3 = document.createElement("script");
        script3.src = "js/violence/perpetrator.js";
        script3.onload = () => {
          const perpetratorChart = new PerpetratorChart("perpetrator-chart");
          perpetratorChart.render();
        };
        document.body.appendChild(script3);

        break;

      //가정폭력 인프라 케이스
      case "violence-infra":
        contentArea.innerHTML = `
        <div class="container1"> 
        <div id="chart-container" class="graph-vioinfra">
            <p class="vioinfra-title">가정폭력/아동학대 예방교육 여부 및 도움 정도</p>
            <div class="button-container">
            <button class="group-btn" data-group="전체">전체</button>
            <button class="group-btn" data-group="성별">성별</button>
            <button class="group-btn" data-group="연령">연령</button>
            <button class="group-btn" data-group="기관유형">기관유형</button>
            </div>
            <div id="groupSelect"></div>

            <div id="vioinfra-chart"></div>
        </div>
      `; // Replace with actual HTML content

        const scriptViolenceInfra = document.createElement("script");
        scriptViolenceInfra.src = "js/violence/infra.js";
        contentArea.appendChild(scriptViolenceInfra);
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
      
      case "after-school-bully":
        contentArea.innerHTML = `
          <div id="after-bully-container">
            <div>
                  <button class="data-btn" data-groups="초4,초5,초6,중1,중2,중3,고1,고2,고3" data-src="./data/school/after_bully_grade.csv">학년별 학교폭력 피해지원</button>
                  <button class="data-btn" data-groups="남자,여자" data-src="./data/school/after_bully_sex.csv">성별 학교폭력 피해지원</button>
                  <button class="data-btn" data-groups="남학교,여학교,남녀공학" data-src="./data/school/after_bully_type.csv">학교유형별 학교폭력 피해지원</button>
                  <button class="data-btn" data-groups="초등학교,중학교,고등학교" data-src="./data/school/after_bully_step.csv">진학단계별 학교폭력 피해지원</button>
            </div>
            <form id="groupSelect">
                  <!-- 버튼 클릭 시 여기에 data-group 값이 표시됩니다 -->
            </form>
            <canvas id="chart"></canvas>
          </div>
          `;

          const script_after_bully = document.createElement("script");
          script_after_bully.src = "js/school/bar.js";
          contentArea.appendChild(script_after_bully);
          console.log("after-bully-container", contentArea);
          
          const scriptTreemap = document.createElement("script");
          scriptTreemap.src = "js/school/treemap.js";
          document.body.appendChild(scriptTreemap);

          break;

        default:
        contentArea.innerHTML = "<div>기본 콘텐츠</div>"; // Replace with actual HTML content
    }
  }
  document.addEventListener("click", function (event) {
    if (
      event.target.closest("#famtype-container")
    ) {
      // family-type 관련 로직
      const buttons = document.querySelectorAll("#famtype-container button");
      buttons.forEach((button) => button.classList.remove("active"));
      event.target.classList.add("active");
      
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
      loadAndRenderChart(dataSrc);
    } 
  });

  renderMenuComponent();
  renderActiveComponent("dom-violence"); // Default component

  function setActiveComponent(component) {
    renderActiveComponent(component);
  }

  window.setActiveComponent = setActiveComponent; // Expose to global scope for menu to use
});
