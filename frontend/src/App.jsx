import MainPage from "./pages/MainPage";
import FamtypePage from "./pages/FamtypePage";
import DomViolencePage from "./pages/DomViolencePage";
import SchoolViolencePage from "./pages/SchoolViolencePage";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/famtype" element={<FamtypePage />} />
        <Route path="/domviolence" element={<DomViolencePage />} />
        <Route path="/schoolviolence" element={<SchoolViolencePage />} />
      </Routes>
    </Router>
  );
}

export default App;
