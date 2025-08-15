import React from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./screens/LoginPage.jsx";
//import Sidebar from "./components/Sidebar";
//import Sidebar from "../src/screens/Dashboard.jsx";

import Dashboard from "../src/screens/Dashboard.jsx";

function App() {
  return (
    <>
      <Router>
        <AnimatePresence exitBeforeEnter>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </>
  );
}

export default App;
