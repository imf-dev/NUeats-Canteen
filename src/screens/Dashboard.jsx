import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ScrollUpButton from "../components/common/ScrollUpButton";
import { getDashboardData } from "../demodata/dashboardDemoData";

// Import the new components
import DashboardSummaryCards from "../components/Dashboard/D_SummaryCards";
import DashboardWeeklyCard from "../components/Dashboard/D_WeeklyCard";
import DashboardTopSellingCard from "../components/Dashboard/D_TopSellingCard";
import DashboardCurrentOrders from "../components/Dashboard/D_CurrentOrders";

import "../styles/Dashboard.css";

// Fade-in transition variants
const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = { type: "tween", duration: 0.5 };

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    statsCards: [],
    weeklyData: [],
    topSellingItems: [],
    currentOrders: [],
  });

  useEffect(() => {
    const data = getDashboardData();
    setDashboardData(data);
  }, []);

  return (
    <motion.div
      className="dashboard_layout"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <main className="dashboard_main">
        <div className="dashboard_header">
          <h1>Dashboard</h1>
          <p>Here's what's happening today</p>
        </div>

        {/* Stats Cards */}
        <DashboardSummaryCards statsCards={dashboardData.statsCards} />

        {/* Charts Section */}
        <div className="dashboard_charts-section">
          {/* Weekly Sales Chart */}
          <DashboardWeeklyCard weeklyData={dashboardData.weeklyData} />

          {/* Top Selling Items */}
          <DashboardTopSellingCard
            topSellingItems={dashboardData.topSellingItems}
          />
        </div>

        {/* Current Orders */}
        <DashboardCurrentOrders currentOrders={dashboardData.currentOrders} />
      </main>
      <ScrollUpButton />
    </motion.div>
  );
};

export default Dashboard;
