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
import Analytics from "./screens/Analytics.jsx";
import Customers from "./screens/Customers.jsx";
import Settings from "./screens/Settings.jsx";
import Sidebar from "./components/common/Sidebar.jsx";

import ProtectedRoute from "./components/ProtectedRoute";

const AppWrapper = () => {
  const location = useLocation();

  // 🔥 Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Hide sidebar on login page
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const hideSidebar = location.pathname === "/NUeats-Canteen/";

  return (
    <div className="app-container">
      {/*} show sidebar only if logged in AND not on login page*/}
      {isAuthenticated && !hideSidebar && <Sidebar />}
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          {/* Public Route */}
          <Route
            path="/NUeats-Canteen/"
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

          {/* Protected Routes */}
          <Route
            path="/NUeats-Canteen/dashboard/"
            element={
              <ProtectedRoute>
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Dashboard />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/NUeats-Canteen/orders/"
            element={
              <ProtectedRoute>
                <motion.div
                  key="orders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Orders />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/NUeats-Canteen/menu/"
            element={
              <ProtectedRoute>
                <motion.div
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Menu />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/NUeats-Canteen/inventory/"
            element={
              <ProtectedRoute>
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Inventory />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/NUeats-Canteen/analytics/"
            element={
              <ProtectedRoute>
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Analytics />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/NUeats-Canteen/customers/"
            element={
              <ProtectedRoute>
                <motion.div
                  key="customers"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Customers />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/NUeats-Canteen/settings/"
            element={
              <ProtectedRoute>
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Settings />
                </motion.div>
              </ProtectedRoute>
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
