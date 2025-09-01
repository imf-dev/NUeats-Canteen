import React, { useEffect } from "react";
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
import Inventory from "./screens/Inventory.jsx";
import Analytics from "./screens/Analytics/Analytics.jsx";
import Settings from "./screens/Settings.jsx";
import Sidebar from "./components/common/Sidebar.jsx";

const AppWrapper = () => {
  const location = useLocation();

  // 🔥 Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

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
          <Route
            path="/inventory"
            element={
              <motion.div
                key="inventory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Inventory />
              </motion.div>
            }
          />
          <Route
            path="/analytics"
            element={
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Analytics />
              </motion.div>
            }
          />
          <Route
            path="/settings"
            element={
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Settings />
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
