import React, { useState } from "react";
import "./IO_TopStockLevel.css";

const I_TopStockLevel = ({ inventoryData }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });

  // Get top 5 items by stock
  const topStockItems = [...inventoryData]
    .sort((a, b) => b.currentStock - a.currentStock)
    .slice(0, 5);

  const handleMouseEnter = (item, event) => {
    // Use the original positioning strategy
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredItem(item);
    setHoveredPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="topstock_chart-card">
      <h3>Top Stock Levels</h3>
      <div className="topstock_stock-chart">
        {topStockItems.map((item, index) => (
          <div
            key={item.id}
            className="topstock_stock-bar"
            onMouseEnter={(e) =>
              handleMouseEnter(
                {
                  type: "stock",
                  ...item,
                },
                e
              )
            }
            onMouseLeave={handleMouseLeave}
          >
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

      {/* Hover Tooltip */}
      {hoveredItem && (
        <div
          className="topstock_hover-tooltip"
          style={{
            left: hoveredPosition.x,
            top: hoveredPosition.y - 10,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          <div className="topstock_tooltip-title">{hoveredItem.name}</div>
          <div className="topstock_tooltip-content">
            <div>
              Current: {hoveredItem.currentStock} {hoveredItem.unit}
            </div>
            <div>
              Min: {hoveredItem.minStock} {hoveredItem.unit}
            </div>
            <div>
              Max: {hoveredItem.maxStock} {hoveredItem.unit}
            </div>
            <div>
              Cost: {formatCurrency(hoveredItem.costPerUnit)}/{hoveredItem.unit}
            </div>
            <div>Supplier: {hoveredItem.supplier}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default I_TopStockLevel;
