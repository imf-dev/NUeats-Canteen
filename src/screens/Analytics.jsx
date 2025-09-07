// src/components/Analytics.jsx
import React from "react";
import "../styles/Analytics.css";
import {
  getTodaysAnalytics,
  getHourlyPerformance,
  getTopSellingItems,
} from "../demodata/salesDemoData";

// Import the new components
import A_SummaryCards from "../components/Analytics/A_SummaryCards";
import A_TopSelling from "../components/Analytics/A_TopSelling";
import A_HourlyPerformance from "../components/Analytics/A_HourlyPerformance";

const Analytics = () => {
  const analytics = getTodaysAnalytics();
  const popularItems = getTopSellingItems(5); // Get top 5 items from actual data
  const hourlyData = getHourlyPerformance();

  return (
    <div className="analytics_analytics-container">
      <div className="analytics_analytics-header">
        <h1>Analytics & Reports</h1>
        <p>Track performance and insights</p>
      </div>

      {/* Summary Cards Component */}
      <A_SummaryCards analytics={analytics} />

      {/* Bottom Section */}
      <div className="analytics_analytics-grid">
        {/* Top Selling Items Component */}
        <A_TopSelling popularItems={popularItems} />

        {/* Hourly Performance Component */}
        <A_HourlyPerformance hourlyData={hourlyData} />
      </div>
    </div>
  );
};

export default Analytics;
