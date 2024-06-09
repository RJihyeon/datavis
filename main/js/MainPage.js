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
        <p class="title">한부모 가정 자녀의 연령대별 혼자 있는 시간 (2021)</p>
        
        <form id="dataSelect">
          <div class="button-title">한부모 특성별</div>
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
        <p class="explain">범례(2018, 2011)를 눌러 오름차순 혹은 내림차순으로 정렬할 수 있습니다.</p>

        <div class="container">
          <div id="chart1" class="chart-graph">
            <div id="kids-compare"></div>
          </div>
          <div id="chart2" class="chart-graph">
            <div id="elements-compare"></div>
          </div>
          <div id="chart3" class="chart-graph">
            <div id="middles-compare"></div>
          </div>
        </div>

        <p class="sub-title">자녀의 혼자 있는 시간 비율 (%)</p>
        <p class="explain">범례(1~3시간, 4~6시간, 6시간 이상)를 눌러 오름차순 혹은 내림차순으로 정렬할 수 있습니다.</p>

        <div class="container">
          <div id="char4" class="chart-graph">
            <div id="kids-hours"></div>
          </div>
          <div id="chart5" class="chart-graph">
            <div id="elements-hours"></div>
          </div>
          <div id="chart6" class="chart-graph">
            <div id="middles-hours"></div>
          </div>
        </div>

        <p class="sub-title">한부모 가정 특성별 자녀의 혼자 있는 평균 시간 (시간)</p>
        <p class="explain">막대를 눌러 오름차순 혹은 내림차순으로 정렬할 수 있습니다.</p>

        <div class="container">
          <div id="char7" class="chart-graph">
            <div id="kids-avg"></div>
          </div>
          <div id="chart8" class="chart-graph">
            <div id="elements-avg"></div>
          </div>
          <div id="chart9" class="chart-graph">
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

      // 한부모가정 복지기관 인프라
      case "social-infra":
        contentArea.innerHTML = `
      <div id="social-container">
        <p class="title">한부모 가정 자녀의 연령대별 혼자 있는 시간 (2021)</p>
        <div id="map-container"></div>
      </div>`;

        const socialInfra = document.createElement("script");
        socialInfra.src = "js/famtype/infra.js";
        contentArea.appendChild(socialInfra);

        break;
      

      // 가정폭력 케이스
      case "dom-violence":
        contentArea.innerHTML = `

        <div id="chart-container" class="report-container">
        <div id="chart-container1" class="graph-report">
        <p class="perpetrator-title">2019-2022 검찰청 전국 가정폭력 </br>검거건수 히트맵</p>
        <div id="heatmap-report"></div>
        <div id="report-tooltip" style="opacity:0; position: absolute;"></div>
    </div>
    
        <div id="chart-container2" class="graph-report1">
        <p class="report-title">검찰청 가정폭력 조치 현황</p>
        <p class="report-title1">검거 100건 당 조치 건수, 단위(건)</p>
        <div  class="report-wrapper">
        <div class="chart-wrapper">
    <p class="chart-title" id="chart-title-2019"></p>
    <div id="report-chart-2019" class="report-chart" data-year="2019"></div>
    <button type="button" class="sort-button" data-year="2019">정렬</button>
    </div>
  <div class="chart-wrapper">
    <p class="chart-title" id="chart-title-2020"></p>
    <div id="report-chart-2020" class="report-chart" data-year="2020"></div>
    <button type="button" class="sort-button" data-year="2020">정렬</button>
    </div>
  </div>
  <div class="report-wrapper">
  <div class="chart-wrapper">
    <p class="chart-title" id="chart-title-2021"></p>
    <div id="report-chart-2021" class="report-chart" data-year="2021"></div>
    <button type="button" class="sort-button" data-year="2021">정렬</button>
    </div>
  <div class="chart-wrapper">
    <p class="chart-title" id="chart-title-2022"></p>
    <div id="report-chart-2022" class="report-chart" data-year="2022"></div>
    <button type="button" class="sort-button" data-year="2022">정렬</button>
    </div>

  </div>
  <button
  <button class="sort-button1" data-sort="all">전체 정렬</button>
    </div>
    </div>

    
  
    
</div>

  `;

        // 보호조치 현황 차트 스크립트 로드
        const script1 = document.createElement("script");
        script1.src = "js/violence/report.js";
        contentArea.appendChild(script1);

        break;

      //가정폭력 인프라 케이스
      case "violence-infra":
        contentArea.innerHTML = `
        <div class="container1"> 
        <div id="chart-container4" class="graph-vioinfra">
            <p class="vioinfra-title">가정폭력/아동학대 예방교육 만족도</p>
            <p class="vioinfra-title1">가정폭력 교육 경험있는 2945명 대상 만족도 조사</p>
            <div class="button-container">
            <button class="group-btn" data-group="전체">전체</button>
            <button class="group-btn" data-group="성별">성별</button>
            <button class="group-btn" data-group="연령">연령</button>
            <button class="group-btn" data-group="기관유형">기관유형</button>
            <p class="vioinfra-guide">아래 범례를 눌러 오름차순 혹은 내림차순으로 정렬할 수 있습니다.</p>
           
            </div>
            <div id="groupSelect"></div>
            <div id="education-pie-chart"></div> <!-- 파이 차트를 위한 div 추가 -->
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
            <div id="chart-container">
              <canvas id="chart"></canvas>
            </div>
          </div>
          `;
        const script_after_bully = document.createElement("script");
        script_after_bully.src = "js/school/bar.js";
        contentArea.appendChild(script_after_bully);

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
      event.target.hasAttribute("data-src") &&
      event.target.closest("#school-violence-container")
    ) {
      // school-violence 로직
      const groups = event.target.getAttribute("data-groups").split(",");
      const groupSelect = document.getElementById("groupSelect");
      groupSelect.innerHTML = "";
      groups.forEach((group) => {
        const button = document.createElement("button");
        button.textContent = group;
        button.setAttribute("data-group", group);
        groupSelect.appendChild(button);
      });
      // data-btn 클래스 활성화
      d3.selectAll(".data-btn").classed("active", false);
      d3.select(event.target).classed("active", true);

      d3.selectAll("#groupSelect button").on("click", function (event) {
        event.preventDefault();
        d3.selectAll("#groupSelect button").classed("active", false);
        d3.select(this).classed("active", true);
      });
    } else if (
      event.target.hasAttribute("data-src") &&
      event.target.closest("#after-bully-container")
    ) {
      // school-violence-a 로직
      const groups = event.target.getAttribute("data-groups").split(",");
      const groupSelect = document.getElementById("groupSelect");
      console.log("groupSelect", groupSelect);
      groupSelect.innerHTML = "";
      groups.forEach((group) => {
        const button = document.createElement("button");
        button.textContent = group;
        button.setAttribute("data-group", group);
        groupSelect.appendChild(button);
      });
      // data-btn 클래스 활성화
      d3.selectAll(".data-btn").classed("active", false);
      d3.select(event.target).classed("active", true);

      d3.selectAll("#groupSelect button").on("click", function (event) {
        event.preventDefault();
        d3.selectAll("#groupSelect button").classed("active", false);
        d3.select(this).classed("active", true);
      });
    }
  });
  renderMenuComponent();
  renderActiveComponent("violence-infra"); // Default component

  function setActiveComponent(component) {
    renderActiveComponent(component);
  }

  window.setActiveComponent = setActiveComponent; // Expose to global scope for menu to use
});
