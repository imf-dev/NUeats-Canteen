import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import LoginPage from "./screens/LoginPage.jsx";
import Dashboard from "./screens/Dashboard.jsx";
import Orders from "./screens/Orders.jsx";
import Menu from "./screens/Menu.jsx";
import Sidebar from "./components/Sidebar.jsx"; // make sure to import

const AppWrapper = () => {
  const location = useLocation();

  // Hide sidebar on login page
  const hideSidebar = location.pathname === "/";

  return (
    <div className="app-container">
      {!hideSidebar && <Sidebar />}
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoginPage />
              </motion.div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Dashboard />
              </motion.div>
            }
          />
          <Route
            path="/orders"
            element={
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Orders />
              </motion.div>
            }
          />
          <Route
            path="/menu"
            element={
              <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Menu />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
