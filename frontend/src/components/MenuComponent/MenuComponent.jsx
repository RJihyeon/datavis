import "./MenuComponent.css";

function MenuComponent({ setActiveComponent }) {
  return (
    <div className="menu_body">
      <div className="menu_div">
        <p className="menu_title">가출 청소년 잠재적 원인 분석</p>
        <ul>
          <li className="side-nav__list on">
            <button className="menu fst_button">청소년 가출 현황</button>
            <ul className="sub_menu">
              <li>
                <button className="sub_button" id="runaway">
                  - 가출 여부
                </button>
              </li>
            </ul>
          </li>
          <ul>
            <li className="side-nav__list on">
              <button className="menu fst_button">
                잠재적 원인 관련 데이터
              </button>
              <ul className="sub_menu">
                <li>
                  <button
                    className="sub_button click"
                    id="famtype"
                    onClick={() => setActiveComponent("family-type")}
                  >
                    - 가정유형
                  </button>
                </li>
                <li>
                  <button
                    className="sub_button click"
                    id="domviolence"
                    onClick={() => setActiveComponent("dom-violence")}
                  >
                    - 가정환경
                  </button>
                </li>
                <li>
                  <button
                    className="sub_button click"
                    id="school"
                    onClick={() => setActiveComponent("school-violence")}
                  >
                    - 학교폭력
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </ul>
      </div>
    </div>
  );
}

export default MenuComponent;
