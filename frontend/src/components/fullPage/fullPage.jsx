import React, { useState } from "react";
import "./IntroComponent.css"; // 스타일 시트 임포트
import RunExpComp from "../가출여부/RunExpComp";
import ConcernComponent from "../가출고민여부/ConcernComponent";
import ReasonComponent from "../가출이유순위/ReasonComponent";

function IntroComponent() {
  const [currentSection, setCurrentSection] = useState(0);
  const numSections = 3; // 섹션의 총 개수 정의

  const handleScroll = (event) => {
    if (event.deltaY > 0) {
      setCurrentSection((prev) => Math.min(prev + 1, numSections - 1));
    } else {
      setCurrentSection((prev) => Math.max(prev - 1, 0));
    }
  };

  const moveToSection = (index) => {
    setCurrentSection(index);
  };

  return (
    <div onWheel={handleScroll} className="fullpage-container">
      <div
        style={{
          transform: `translateY(-${currentSection * 100}vh)`,
          transition: "transform 0.8s ease",
        }}
      >
        {/* section 1 */}
        <div className="section" style={{ backgroundColor: "#F0EEF1" }}>
          <div className="intro-text">
            <h1 className="intro-title">당신의 이웃은 안녕하십니까?</h1>
            <h1 className="intro-details">
              류지현, 목종원, 정다운(CSI4150 데이터시각화입문)
            </h1>
          </div>
        </div>

        {/* section2 */}
        <div className="section" style={{ backgroundColor: "#E9E6EA" }}>
          <RunExpComp />
          <ConcernComponent />
        </div>

        {/* section3 */}
        <div className="section" style={{ backgroundColor: "#DDD8E0" }}>
          <ReasonComponent/>
        </div>
      </div>
      <div className="navigation">
        {[...Array(numSections).keys()].map((index) => (
          <button
            key={index}
            onClick={() => moveToSection(index)}
            className={currentSection === index ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default IntroComponent;
