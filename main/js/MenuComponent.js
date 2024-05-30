function renderMenuComponent() {
  const menuComponent = document.getElementById("menu-component");
  menuComponent.innerHTML = `
    <div class="menu_div">
      <p class="menu_title">가출 청소년 잠재적 원인 분석</p>
      <ul>
        <li class="side-nav__list on">
          <button class="menu fst_button">청소년 가출 현황</button>
          <ul class="sub_menu">
            <li>
              <button class="sub_button" id="runaway">- 가출 여부</button>
            </li>
          </ul>
        </li>
        <ul>
          <li class="side-nav__list on">
            <button class="menu fst_button">잠재적 원인 관련 데이터</button>
            <ul class="sub_menu">
              <li>
                <button class="sub_button click" id="famtype" onclick="setActiveComponent('family-type')">- 가정유형</button>
              </li>
              <li>
                <button class="sub_button click" id="domviolence" onclick="setActiveComponent('dom-violence')">- 가정환경</button>
              </li>
              <li>
                <button class="sub_button click" id="school" onclick="setActiveComponent('school-violence')">- 학교폭력</button>
              </li>
            </ul>
          </li>
        </ul>
      </ul>
    </div>
  `;
}