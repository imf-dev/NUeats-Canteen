import React, { useState } from "react";
import "./IO_CategoryDistribution.css";

const I_CategoryDistribution = ({ inventoryData, categories }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    setHoveredItem({
      type: "category",
      name: item.name,
      totalItems: item.totalItems,
      totalStock: item.totalStock,
      lowStock: item.lowStock,
      percentage: item.percentage,
    });
    updateMousePosition(event);
  };

  const handleMouseMove = (event) => {
    if (hoveredItem) {
      updateMousePosition(event);
    }
  };

  const updateMousePosition = (event) => {
    // Get the container's bounding rect for relative positioning
    const container =
      event.currentTarget.closest(".inventoryover_inventory-overview") ||
      document.body;
    const containerRect = container.getBoundingClientRect();

    // Calculate relative position within the container
    const relativeX = event.clientX - containerRect.left;
    const relativeY = event.clientY - containerRect.top;

    // Tooltip dimensions (approximate)
    const tooltipWidth = 240;
    const tooltipHeight = 120;

    // Position tooltip to the right of cursor with relative positioning
    let x = relativeX + 15; // Right side of cursor
    let y = relativeY - tooltipHeight - 100; // Center on cursor vertically

    // Adjust if tooltip would overflow container
    if (x + tooltipWidth > containerRect.width) {
      x = relativeX - tooltipWidth - 15; // Show on left side
    }

    if (y < 0) {
      y = 10; // Minimum distance from container top
    }

    if (y + tooltipHeight > containerRect.height) {
      y = containerRect.height - tooltipHeight - 10; // Adjust for container bottom
    }

    setMousePosition({ x, y });
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
                  name: stat.category,
                  totalItems: stat.totalItems,
                  totalStock: stat.totalStock,
                  lowStock: stat.lowStock,
                  percentage: stat.percentage,
                },
                e
              )
            }
            onMouseMove={handleMouseMove}
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

      {/* Fixed Tooltip with proper positioning */}
      {hoveredItem && (
        <div
          className="category_hover-tooltip"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        >
          <div className="category_tooltip-title">{hoveredItem.name}</div>
          <div className="category_tooltip-content">
            <div>
              <span>Items:</span>
              <span>{hoveredItem.totalItems}</span>
            </div>
            <div>
              <span>Total Stock:</span>
              <span>{hoveredItem.totalStock}</span>
            </div>
            <div>
              <span>Low Stock:</span>
              <span>{hoveredItem.lowStock}</span>
            </div>
            <div>
              <span>Percentage:</span>
              <span>{hoveredItem.percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default I_CategoryDistribution;
