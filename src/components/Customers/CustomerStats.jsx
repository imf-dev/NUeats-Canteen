import React from "react";
import {
  FiUsers,
  FiShoppingCart,
  FiUserPlus,
  FiMessageSquare,
} from "react-icons/fi";
import "./CustomerStats.css";
import allcustomersDemoData from "../../demodata/allcustomersDemoData";
import { ordersData } from "../../demodata/ordersDemoData";

const CustomerStats = () => {
  // Calculate total customers
  const totalCustomers = allcustomersDemoData.length;

  // Calculate total orders
  const totalOrders = ordersData.length;

  // Calculate new customers (last 7 days: Sept 2-8, 2025)
  const today = new Date("2025-09-08");
  const dates = [];

  // Generate last 7 days (same logic as CA_NewUsers)
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }

  const startDate = new Date(dates[0]);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(dates[dates.length - 1]);
  endDate.setHours(23, 59, 59, 999);

  const newCustomers = allcustomersDemoData.filter((customer) => {
    const joinDate = new Date(customer.account_info.date_joined);
    return joinDate >= startDate && joinDate <= endDate;
  }).length;

  // Calculate total feedbacks (orders that have feedback)
  const totalFeedbacks = ordersData.filter(
    (order) => order.feedback && order.feedback.trim() !== ""
  ).length;

  const statsData = [
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      icon: <FiUsers />,
      color: "blue",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: <FiShoppingCart />,
      color: "green",
    },
    {
      title: "New Customers",
      value: newCustomers.toString(),
      icon: <FiUserPlus />,
      color: "yellow",
    },
    {
      title: "Total Feedbacks",
      value: totalFeedbacks.toString(),
      icon: <FiMessageSquare />,
      color: "orange",
    },
  ];

  return (
    <div className="cs-customer-stats">
      {statsData.map((stat, index) => (
        <div key={index} className={`cs-stat-card ${stat.color}`}>
          <div className="cs-stat-header">
            <span className="cs-stat-title">{stat.title}</span>
            <div className="cs-stat-icon">{stat.icon}</div>
          </div>
          <div className="cs-stat-value">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default CustomerStats;
