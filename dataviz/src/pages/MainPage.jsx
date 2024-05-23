import React, { useState } from "react";
import RunExpComp from "../components/가출여부/RunExpComp";
import ConcernComponent from "../components/가출고민여부/ConcernComponent";
import MenuComponent from "../components/MenuComponent/MenuComponent";
import DomViolencePage from "./DomViolencePage";


function MainPage() {

  const [page, setPage] = useState("/");
  return (
    <>
      <MenuComponent page={page}/>
    </>
  );
}

export default MainPage;
