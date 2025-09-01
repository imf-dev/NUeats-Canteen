import React, { useState } from "react";
import "./IO_CategoryDistribution.css";

const I_CategoryDistribution = ({ inventoryData, categories }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });

  const totalItems = inventoryData.length;

  // Get category statistics
  const categoryStats = categories.slice(1).map((category) => {
    const categoryItems = inventoryData.filter(
      (item) => item.category === category
    );
    const totalStock = categoryItems.reduce(
      (sum, item) => sum + item.currentStock,
      0
    );
    const lowStock = categoryItems.filter(
      (item) => item.currentStock <= 10
    ).length;
    return {
      category,
      totalItems: categoryItems.length,
      totalStock,
      lowStock,
      percentage:
        totalItems > 0 ? (categoryItems.length / totalItems) * 100 : 0,
    };
  });

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

  return (
    <div className="category_chart-card">
      <h3>Category Distribution</h3>
      <div className="category_category-chart">
        {categoryStats.map((stat, index) => (
          <div
            key={stat.category}
            className="category_category-bar"
            onMouseEnter={(e) =>
              handleMouseEnter(
                {
                  type: "category",
                  name: stat.category,
                  totalItems: stat.totalItems,
                  totalStock: stat.totalStock,
                  lowStock: stat.lowStock,
                  percentage: stat.percentage,
                },
                e
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            <div className="category_category-label">{stat.category}</div>
            <div className="category_bar-container">
              <div
                className="category_bar"
                style={{
                  width: `${stat.percentage}%`,
                  backgroundColor: `hsl(${index * 50}, 70%, 60%)`,
                }}
              ></div>
            </div>
            <div className="category_category-value">{stat.totalItems}</div>
          </div>
        ))}
      </div>

      {/* Hover Tooltip */}
      {hoveredItem && (
        <div
          className="category_hover-tooltip"
          style={{
            left: hoveredPosition.x,
            top: hoveredPosition.y - 10,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          <div className="category_tooltip-title">{hoveredItem.name}</div>
          <div className="category_tooltip-content">
            <div>Items: {hoveredItem.totalItems}</div>
            <div>Total Stock: {hoveredItem.totalStock}</div>
            <div>Low Stock: {hoveredItem.lowStock}</div>
            <div>Percentage: {hoveredItem.percentage.toFixed(1)}%</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default I_CategoryDistribution;
