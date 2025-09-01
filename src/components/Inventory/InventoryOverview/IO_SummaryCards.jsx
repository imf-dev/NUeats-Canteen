import React from "react";
import "./IO_SummaryCards.css";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaTimes,
  FaDollarSign,
} from "react-icons/fa";

const I_SummaryCards = ({ inventoryData }) => {
  // Calculate statistics
  const totalItems = inventoryData.length;
  const lowStockItems = inventoryData.filter((item) => item.currentStock <= 10);
  const outOfStockItems = inventoryData.filter(
    (item) => item.currentStock === 0
  );
  const totalValue = inventoryData.reduce(
    (sum, item) => sum + item.currentStock * item.costPerUnit,
    0
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const summaryData = [
    {
      icon: <FaBoxes />,
      value: totalItems,
      label: "Total Items",
      iconClass: "summary_total",
    },
    {
      icon: <FaExclamationTriangle />,
      value: lowStockItems.length,
      label: "Low Stock Items",
      iconClass: "summary_low-stock",
    },
    {
      icon: <FaTimes />,
      value: outOfStockItems.length,
      label: "Out of Stock",
      iconClass: "summary_out-of-stock",
    },
    {
      icon: <FaDollarSign />,
      value: formatCurrency(totalValue),
      label: "Total Inventory Value",
      iconClass: "summary_value",
    },
  ];

  return (
    <div className="summary_stats-grid">
      {summaryData.map((item, index) => (
        <div key={index} className="summary_stat-card">
          <div className={`summary_stat-icon ${item.iconClass}`}>
            {item.icon}
          </div>
          <div className="summary_stat-content">
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default I_SummaryCards;
