import React from "react";
import "./IO_TopStockLevel.css";

const I_TopStockLevel = ({ inventoryData }) => {
  // Get top 5 items by stock
  const topStockItems = [...inventoryData]
    .sort((a, b) => b.currentStock - a.currentStock)
    .slice(0, 5);

  return (
    <div className="topstock_chart-card">
      <h3>Top Stock Levels</h3>
      <div className="topstock_stock-chart">
        {topStockItems.map((item, index) => (
          <div key={item.id} className="topstock_stock-bar">
            <div className="topstock_stock-label">{item.name}</div>
            <div className="topstock_bar-container">
              <div
                className="topstock_bar"
                style={{
                  width: `${(item.currentStock / item.maxStock) * 100}%`,
                  backgroundColor:
                    item.currentStock <= 10 ? "#ef4444" : "#22c55e",
                }}
              ></div>
            </div>
            <div className="topstock_stock-value">
              {item.currentStock} {item.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default I_TopStockLevel;
