import React from "react";
import {
  FiShoppingBag,
  FiCheckCircle,
  FiDollarSign,
  FiBox,
} from "react-icons/fi";
import "./D_SummaryCards.css";

const DashboardSummaryCards = ({ statsCards }) => {
  const getIcon = (iconName) => {
    const icons = {
      FiShoppingBag: <FiShoppingBag size={24} />,
      FiCheckCircle: <FiCheckCircle size={24} />,
      FiDollarSign: <FiDollarSign size={24} />,
      FiBox: <FiBox size={24} />,
    };
    return icons[iconName];
  };

  return (
    <div className="dashboard_stats-grid">
      {statsCards.map((card) => (
        <div key={card.id} className={`dashboard_stats-card ${card.color}`}>
          <div className="dashboard_stats-content">
            <div className="dashboard_stats-header">
              <span className="dashboard_stats-title">{card.title}</span>
              <span className="dashboard_stats-icon">{getIcon(card.icon)}</span>
            </div>
            <div className="dashboard_stats-value">{card.value}</div>
            <div className="dashboard_stats-subtitle">{card.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummaryCards;
