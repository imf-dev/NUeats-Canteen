// src/components/Analytics/A_SummaryCards.jsx
import React from "react";
import "./A_SummaryCards.css";
import {
  FiDollarSign,
  FiShoppingCart,
  FiClock,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

const A_SummaryCards = ({ analytics }) => {
  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`;
  };

  return (
    <div className="summary_stats-grid">
      <div className="summary_stat-card summary_revenue-card">
        <div className="summary_stat-icon">
          <FiDollarSign />
        </div>
        <div className="summary_stat-content">
          <h3>Today's Revenue</h3>
          <div className="summary_stat-value">
            {formatCurrency(analytics.revenue)}
          </div>
          <div
            className={`summary_stat-change ${
              analytics.revenueGrowth >= 0
                ? "summary_positive"
                : "summary_negative"
            }`}
          >
            {analytics.revenueGrowth >= 0 ? (
              <FiTrendingUp />
            ) : (
              <FiTrendingDown />
            )}
            {analytics.revenueGrowth >= 0 ? "+" : ""}
            {analytics.revenueGrowth}% from yesterday
          </div>
        </div>
      </div>

      <div className="summary_stat-card summary_orders-card">
        <div className="summary_stat-icon">
          <FiShoppingCart />
        </div>
        <div className="summary_stat-content">
          <h3>Orders Today</h3>
          <div className="summary_stat-value">{analytics.orders}</div>
          <div
            className={`summary_stat-change ${
              analytics.ordersGrowth >= 0
                ? "summary_positive"
                : "summary_negative"
            }`}
          >
            {analytics.ordersGrowth >= 0 ? (
              <FiTrendingUp />
            ) : (
              <FiTrendingDown />
            )}
            {analytics.ordersGrowth >= 0 ? "+" : ""}
            {analytics.ordersGrowth}% from yesterday
          </div>
        </div>
      </div>

      <div className="summary_stat-card summary_completion-card">
        <div className="summary_stat-icon">
          <FiClock />
        </div>
        <div className="summary_stat-content">
          <h3>Completion Rate</h3>
          <div className="summary_stat-value">{analytics.completionRate}%</div>
          <div className="summary_stat-subtitle">
            Average order time: {analytics.avgOrderTime} min
          </div>
        </div>
      </div>

      <div className="summary_stat-card summary_customers-card">
        <div className="summary_stat-icon">
          <FiUsers />
        </div>
        <div className="summary_stat-content">
          <h3>Total Customers</h3>
          <div className="summary_stat-value">
            {analytics.totalCustomers.toLocaleString()}
          </div>
          <div className="summary_stat-subtitle">
            {analytics.newCustomersToday} new today
          </div>
        </div>
      </div>
    </div>
  );
};

export default A_SummaryCards;
