import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

//import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";
import { motion } from "framer-motion";
import ScrollUpButton from "../components/common/ScrollUpButton";

import {
  FiShoppingBag,
  FiCheckCircle,
  FiDollarSign,
  FiBox,
} from "react-icons/fi";

// Fade-in transition variants
const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = { type: "tween", duration: 0.5 };

const Dashboard = () => {
  // Demo data
  const statsCards = [
    {
      id: "active-orders",
      title: "Active Orders",
      value: "9",
      subtitle: "3 Pending Orders",
      icon: <FiShoppingBag size={24} />,
      color: "blue",
    },
    {
      id: "completed-orders",
      title: "Completed Orders",
      value: "9",
      subtitle: "Today",
      icon: <FiCheckCircle size={24} />,
      color: "green",
    },
    {
      id: "revenue",
      title: "Today's Revenue",
      value: "₱ 5,600",
      subtitle: "+12% from yesterday",
      icon: <FiDollarSign size={24} />,
      color: "yellow",
    },
    {
      id: "low-stock",
      title: "Low Stock Items",
      value: "5",
      subtitle: "5 different items are low in stock",
      icon: <FiBox size={24} />,
      color: "orange",
    },
  ];

  const weeklyData = [
    { day: "MON", revenue: 5000, orders: 45 },
    { day: "TUE", revenue: 8500, orders: 65 },
    { day: "WED", revenue: 7200, orders: 55 },
    { day: "THU", revenue: 12400, orders: 80 },
    { day: "FRI", revenue: 9800, orders: 70 },
    { day: "SAT", revenue: 11200, orders: 75 },
    { day: "SUN", revenue: 8900, orders: 60 },
  ];

  const topSellingItems = [
    { name: "Margherita Pizza", quantity: 85, color: "#FFD700" },
    { name: "Silog", quantity: 72, color: "#DDA0DD" },
    { name: "Coffee", quantity: 58, color: "#4169E1" },
    { name: "Cookie", quantity: 43, color: "#DAA520" },
    { name: "Siomai", quantity: 35, color: "#CD853F" },
  ];

  const currentOrders = [
    {
      id: "001",
      customerName: "Name Lastname",
      items: "Margherita Pizza, Coca Cola, Tiramisu",
      time: "12:30 PM",
      amount: "₱ 32.98",
      status: "preparing",
      statusColor: "blue",
    },
    {
      id: "002",
      customerName: "Name Lastname",
      items: "Margherita Pizza, Coca Cola, Tiramisu",
      time: "12:45 PM",
      amount: "₱ 32.98",
      status: "ready",
      statusColor: "green",
    },
    {
      id: "002",
      customerName: "Name Lastname",
      items: "Margherita Pizza, Coca Cola, Tiramisu",
      time: "12:45 PM",
      amount: "₱ 32.98",
      status: "pending",
      statusColor: "orange",
    },
    {
      id: "002",
      customerName: "Name Lastname",
      items: "Margherita Pizza, Coca Cola, Tiramisu",
      time: "12:45 PM",
      amount: "₱ 32.98",
      status: "completed",
      statusColor: "green",
    },
    {
      id: "002",
      customerName: "Name Lastname",
      items: "Margherita Pizza, Coca Cola, Tiramisu",
      time: "12:45 PM",
      amount: "₱ 32.98",
      status: "cancelled",
      statusColor: "red",
    },
  ];

  const getMaxRevenue = () => Math.max(...weeklyData.map((d) => d.revenue));
  const getMaxOrders = () => Math.max(...weeklyData.map((d) => d.orders));

  const getStatusButton = (status) => {
    const statusConfig = {
      preparing: { text: "Mark Ready", class: "dashboard_btn-primary" },
      ready: { text: "Complete Order", class: "dashboard_btn-success" },
      pending: { text: "Start Preparing", class: "dashboard_btn-warning" },
      completed: { text: "", class: "dashboard_status-completed" },
      cancelled: { text: "", class: "dashboard_status-cancelled" },
    };

    const config = statusConfig[status] || { text: "", class: "" };

    if (status === "completed" || status === "cancelled") {
      return (
        <span className={`dashboard_status-badge ${config.class}`}>
          {status === "completed" ? "✓ completed" : "✗ cancelled"}
        </span>
      );
    }

    return config.text ? (
      <button className={`dashboard_action-btn ${config.class}`}>
        {config.text}
      </button>
    ) : null;
  };

  return (
    <motion.div
      className="dashboard_action-btndashboard_layout"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/*<Sidebar /> */}

      <main className="dashboard_main">
        <div className="dashboard_header">
          <h1>Dashboard</h1>
          <p>Here's what's happening today</p>
        </div>

        {/* Stats Cards */}
        <div className="dashboard_stats-grid">
          {statsCards.map((card) => (
            <div key={card.id} className={`dashboard_stats-card ${card.color}`}>
              <div className="dashboard_stats-content">
                <div className="dashboard_stats-header">
                  <span className="dashboard_stats-title">{card.title}</span>
                  <span className="dashboard_stats-icon">{card.icon}</span>
                </div>
                <div className="dashboard_stats-value">{card.value}</div>
                <div className="dashboard_stats-subtitle">{card.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="dashboard_charts-section">
          {/* Weekly Sales Chart */}
          <div className="dashboard_chart-container">
            <div className="dashboard_chart-header">
              <h3>Weekly Sales Overview</h3>
              <p>Daily sales and order volume for this week</p>
            </div>
            <div className="dashboard_weekly-chart">
              <div className="dashboard_chart-y-axis">
                <span>₱20K</span>
                <span>₱15K</span>
                <span>₱10K</span>
                <span>₱5K</span>
                <span>₱1K</span>
                <span>0</span>
              </div>
              <div className="dashboard_chart-area">
                {weeklyData.map((data, index) => (
                  <div key={data.day} className="dashboard_chart-day">
                    <div className="dashboard_chart-bars">
                      <div
                        className="dashboard_revenue-bar"
                        style={{
                          height: `${(data.revenue / getMaxRevenue()) * 100}%`,
                        }}
                      ></div>
                      <div
                        className="dashboard_orders-line-point"
                        style={{
                          bottom: `${(data.orders / getMaxOrders()) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="dashboard_day-label">{data.day}</span>
                  </div>
                ))}
                <div className="dashboard_orders-line">
                  <svg width="100%" height="100%">
                    <path
                      d={`M ${(0 / (weeklyData.length - 1)) * 100}% ${
                        100 - (weeklyData[0].orders / getMaxOrders()) * 100
                      }% ${weeklyData
                        .map(
                          (data, index) =>
                            `L ${(index / (weeklyData.length - 1)) * 100}% ${
                              100 - (data.orders / getMaxOrders()) * 100
                            }%`
                        )
                        .join(" ")}`}
                      stroke="#4F46E5"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="dashboard_chart-legend">
                <div className="dashboard_legend-item">
                  <span className="dashboard_legend-color dashboard_revenue"></span>
                  <span>Revenue</span>
                </div>
                <div className="dashboard_legend-item">
                  <span className="dashboard_legend-color dashboard_orders"></span>
                  <span>Orders</span>
                </div>
                <div className="dashboard_chart-highlight">
                  <div className="dashboard_highlight-box">
                    <span className="dashboard_highlight-day">Thursday</span>
                    <span className="dashboard_highlight-orders">
                      Orders: 80
                    </span>
                    <span className="dashboard_highlight-revenue">
                      Revenue: ₱12,400
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="dashboard_top-selling-container">
            <div className="dashboard_top-selling-header">
              <p>Most popular menu items by quantity sold</p>
              <h3>Top 5 Selling Items This Week</h3>
            </div>
            <div className="dashboard_top-selling-list">
              {topSellingItems.map((item, index) => (
                <div key={index} className="dashboard_selling-item">
                  <span className="dashboard_item-name">{item.name}</span>
                  <div className="dashboard_progress-container">
                    <div
                      className="dashboard_progress-bar"
                      style={{
                        width: `${
                          (item.quantity / topSellingItems[0].quantity) * 100
                        }%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="dashboard_progress-scale">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Orders */}
        <div className="dashboard_current-orders">
          <div className="dashboard_section-header">
            <h3>Current Orders</h3>
            <p>Manage and track orders in real-time</p>
          </div>
          <div className="dashboard_orders-list">
            {currentOrders.map((order, index) => (
              <div
                key={index}
                className={`dashboard_order-card ${order.status}`}
              >
                <div className="dashboard_order-info">
                  <div className="dashboard_customer-details">
                    <h4>{order.customerName}</h4>
                    <span className="dashboard_order-id">
                      Order # {order.id}
                    </span>
                  </div>
                  <div className="dashboard_order-details">
                    <span className="dashboard_order-items">{order.items}</span>
                    <span className="dashboard_order-time">{order.time}</span>
                  </div>
                </div>
                <div className="dashboard_order-actions">
                  <span className="dashboard_order-amount">{order.amount}</span>
                  <div className="dashboard_status-section">
                    {order.status === "preparing" && (
                      <span className="dashboard_status-indicator preparing">
                        🔵 preparing
                      </span>
                    )}
                    {order.status === "ready" && (
                      <span className="dashboard_status-indicator ready">
                        🟢 ready
                      </span>
                    )}
                    {order.status === "pending" && (
                      <span className="dashboard_status-indicator pending">
                        🟡 pending
                      </span>
                    )}
                    {getStatusButton(order.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <ScrollUpButton />
    </motion.div>
  );
};

export default Dashboard;
