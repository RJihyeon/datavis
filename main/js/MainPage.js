document.addEventListener("DOMContentLoaded", function() {
  function renderActiveComponent(activeComponent) {
    const contentArea = document.getElementById("content-area");
    contentArea.innerHTML = ""; // Clear previous content
    switch (activeComponent) {
      case "family-type":
        contentArea.innerHTML = "<div>가정유형 콘텐츠</div>"; // Replace with actual HTML content
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
