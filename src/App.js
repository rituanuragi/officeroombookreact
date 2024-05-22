import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IndexPage from "./components/IndexPage";
import DataPage from "./components/DataPage";
import ThankYouPage from "./components/ThankYouPage";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />}></Route>
        <Route path="/data" element={<DataPage />}></Route>
        <Route path="/thankyou" element={<ThankYouPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
