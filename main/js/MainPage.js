document.addEventListener("DOMContentLoaded", function() {
  function renderActiveComponent(activeComponent) {
    const contentArea = document.getElementById("content-area");
    contentArea.innerHTML = ""; // Clear previous content
    switch (activeComponent) {
      case "family-type":
        contentArea.innerHTML = `
          <div>
            <button data-src="./data/famtype/kids_alone(o).csv">미취학 자녀가 혼자 있는 시간</button>
            <button data-src="./data/famtype/element_alone(o).csv">초등학생 자녀가 혼자 있는 시간</button>
            <button data-src="./data/famtype/middle_alone(o).csv">중학생 이상 자녀가 혼자 있는 시간</button>
          </div>
          <div id="data-container"></div>
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
        `;
        // Append script dynamically
        const script = document.createElement("script");
        script.src = "js/famtype/stacked.js";
        contentArea.appendChild(script);
        break;
        
      case "dom-violence":
        contentArea.innerHTML = "<div>가정환경 콘텐츠</div>"; // Replace with actual HTML content
        break;
      case "school-violence":
        contentArea.innerHTML = "<div>학교폭력 콘텐츠</div>"; // Replace with actual HTML content
        break;
      default:
        contentArea.innerHTML = "<div>기본 콘텐츠</div>"; // Replace with actual HTML content
    }
  }

  renderMenuComponent();
  renderActiveComponent("dom-violence"); // Default component

  function setActiveComponent(component) {
    renderActiveComponent(component);
  }

  window.setActiveComponent = setActiveComponent; // Expose to global scope for menu to use
});
