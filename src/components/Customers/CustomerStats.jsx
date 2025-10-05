import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiShoppingCart,
  FiUserPlus,
  FiMessageSquare,
} from "react-icons/fi";
import "./CustomerStats.css";
import { getCustomerStats } from "../../lib/customersService";

const CustomerStats = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    newCustomersThisWeek: 0,
    totalFeedbacks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCustomerStats();
        setStats({
          totalCustomers: data.totalCustomers,
          totalOrders: data.totalOrders,
          newCustomersThisWeek: data.newCustomersThisWeek,
          totalFeedbacks: data.totalFeedbacks,
        });
      } catch (error) {
        console.error("Error fetching customer stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: <FiUsers />,
      color: "blue",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: <FiShoppingCart />,
      color: "green",
    },
    {
      title: "New Customers",
      value: stats.newCustomersThisWeek.toString(),
      icon: <FiUserPlus />,
      color: "yellow",
    },
    {
      title: "Total Feedbacks",
      value: stats.totalFeedbacks.toString(),
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
