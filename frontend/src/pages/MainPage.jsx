import React, { useState } from "react";
import MenuComponent from "../components/MenuComponent/MenuComponent";
import Famtype from "../components/Famtype";
import DomViolence from "../components/DomViolence";
import SchoolViolence from "../components/SchoolViolence";
import "./MainPage.css";

function MainPage() {
  const [activeComponent, setActiveComponent] = useState("");
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "family-type":
        return <Famtype />;
      case "dom-violence":
        return <DomViolence />;
      case "school-violence":
        return <SchoolViolence />;
      default:
        //여기는 이제 intro 페이지에 따라서 수정할 것임.
        //걍 임시로 domviolence로 해놓음
        return <DomViolence />;
    }
  };

  return (
    <div className="main-layout">
      <MenuComponent setActiveComponent={setActiveComponent} />
      <div className="content-area">{renderActiveComponent()}</div>
    </div>
  );
}

export default MainPage;
