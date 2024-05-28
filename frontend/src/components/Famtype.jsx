//다운

// import Alone from "./famtype/test";

// function Alone() {
//   return (
//     <div>
//       <h1>초등학생 이유</h1>
//       <Alone />
//     </div>
//   );
// }

// export default Famtype;

import React, { useEffect } from "react";
import * as d3 from "d3";
import test from "./famtype/test";
import "./famtype/Alone.css"; // CSS 파일 경로에 맞게 수정해주세요.

function Alone() {
  useEffect(() => {
    d3.csv("/domestic_famtype/element_alone(o).csv").then((data) => {
    });
  }, []);

  const handleButtonClick = (dataSrc) => {
    d3.csv(dataSrc).then((data) => {
    });
  };

  const handleGroupButtonClick = (group) => {
  };

  return (
    <div>
      <div>
        <button onClick={() => handleButtonClick("/domestic_famtype/kids_alone(o).csv")}>미취학 자녀가 혼자 있는 시간</button>
        <button onClick={() => handleButtonClick("/domestic_famtype/element_alone(o).csv")}>초등학생 자녀가 혼자 있는 시간</button>
        <button onClick={() => handleButtonClick("/domestic_famtype/middle_alone(o).csv")}>중학생 이상 자녀가 혼자 있는 시간</button>
      </div>

      <div id="data-container"></div>

      <form id="dataSelect">
        <input type="button" onClick={() => handleGroupButtonClick("g1")} value="한부모 연령별" />
        <input type="button" onClick={() => handleGroupButtonClick("g2")} value="한부모 학력별" />
        <input type="button" onClick={() => handleGroupButtonClick("g3")} value="혼인 상태별" />
        <input type="button" onClick={() => handleGroupButtonClick("g4")} value="가구 구성별" />
        <input type="button" onClick={() => handleGroupButtonClick("g5")} value="가장 어린 자녀별" />
        <input type="button" onClick={() => handleGroupButtonClick("g6")} value="종사상 지위별" />
        <input type="button" onClick={() => handleGroupButtonClick("g7")} value="정부 지원 유형별" />
        <input type="button" onClick={() => handleGroupButtonClick("g8")} value="소득 수준별" />
        <input type="button" onClick={() => handleGroupButtonClick("g9")} value="한부모가된 기간별" />
      </form>
    </div>
  );
}

export default test;
