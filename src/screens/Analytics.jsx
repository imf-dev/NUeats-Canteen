// src/screens/Analytics.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/Analytics.css";
import { getAnalyticsData } from "../lib/analyticsService";

// Import the new components
import A_SummaryCards from "../components/Analytics/A_SummaryCards";
import A_TopSelling from "../components/Analytics/A_TopSelling";
import A_HourlyPerformance from "../components/Analytics/A_HourlyPerformance";
import LoadingScreen from "../components/common/LoadingScreen";

// Fade-in transition variants
const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = { type: "tween", duration: 0.5 };

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    analytics: {
      revenue: 0,
      revenueGrowth: 0,
      orders: 0,
      ordersGrowth: 0,
      completionRate: 0,
      avgOrderTime: 0,
      totalCustomers: 0,
      newCustomersToday: 0,
    },
    topSellingItems: [],
    hourlyPerformance: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const data = await getAnalyticsData();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      className="analytics_analytics-container"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="analytics_analytics-header">
        <h1>Analytics & Reports</h1>
        <p>Track performance and insights</p>
      </div>

      {/* Summary Cards Component */}
      <A_SummaryCards analytics={analyticsData.analytics} />

      {/* Bottom Section */}
      <div className="analytics_analytics-grid">
        {/* Top Selling Items Component */}
        <A_TopSelling popularItems={analyticsData.topSellingItems} />

        {/* Hourly Performance Component */}
        <A_HourlyPerformance hourlyData={analyticsData.hourlyPerformance} />
      </div>
    </motion.div>
  );
};

export default Analytics;
