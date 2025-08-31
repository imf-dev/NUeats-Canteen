// src/components/InventoryTop.jsx
import React from "react";
import "./InventoryTop.css";
import { getTopSellingItems } from "../../../demodata/salesDemoData";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const InventoryTop = () => {
  const topItems = getTopSellingItems(5);

  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`;
  };

  const formatGrowth = (growth) => {
    const isPositive = growth >= 0;
    const sign = isPositive ? "+" : "";
    return `${sign}${growth}%`;
  };

  return (
    <div className="inventory-top">
      <div className="inventory-top-header">
        <div className="header-content">
          <h2>Top Selling Items Analysis</h2>
          <p>Items ranked by sales volume with inventory impact analysis</p>
        </div>
      </div>

      <div className="top-items-list">
        {topItems.map((item, index) => (
          <div key={item.id} className="top-item-card">
            <div className="item-rank">
              <span className="rank-number">{item.rank}</span>
            </div>

            <div className="item-info">
              <h3 className="item-name">{item.itemName}</h3>
            </div>

            <div className="item-stats">
              <div className="stat-group">
                <span className="stat-label">Units Sold</span>
                <span className="stat-value">{item.unitsSold}</span>
              </div>

              <div className="stat-group">
                <span className="stat-label">Revenue</span>
                <span className="stat-value">
                  {formatCurrency(item.revenue)}
                </span>
              </div>

              <div className="stat-group">
                <span className="stat-label">Growth</span>
                <span
                  className={`stat-value growth ${
                    item.growth >= 0 ? "positive" : "negative"
                  }`}
                >
                  {item.growth >= 0 ? (
                    <FiTrendingUp className="growth-icon up" />
                  ) : (
                    <FiTrendingDown className="growth-icon down" />
                  )}
                  {formatGrowth(item.growth)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryTop;
