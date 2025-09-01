import React, { useState } from "react";
import "./InventoryOverview.css";
import { inventoryData, categories } from "../../../demodata/inventoryDemoData";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaTimes,
  FaDollarSign,
} from "react-icons/fa";

const InventoryOverview = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });

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

  // Get top 5 items by stock
  const topStockItems = [...inventoryData]
    .sort((a, b) => b.currentStock - a.currentStock)
    .slice(0, 5);

  // Get low stock items
  const lowStockList = [...lowStockItems].slice(0, 5);

  const handleMouseEnter = (item, event) => {
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
    <div className="inventoryover_inventory-overview">
      {/* Stats Cards */}
      <div className="inventoryover_stats-grid">
        <div className="inventoryover_stat-card">
          <div className="inventoryover_stat-icon inventoryover_total">
            <FaBoxes />
          </div>
          <div className="inventoryover_stat-content">
            <h3>{totalItems}</h3>
            <p>Total Items</p>
          </div>
        </div>

        <div className="inventoryover_stat-card">
          <div className="inventoryover_stat-icon inventoryover_low-stock">
            <FaExclamationTriangle />
          </div>
          <div className="inventoryover_stat-content">
            <h3>{lowStockItems.length}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>

        <div className="inventoryover_stat-card">
          <div className="inventoryover_stat-icon inventoryover_out-of-stock">
            <FaTimes />
          </div>
          <div className="inventoryover_stat-content">
            <h3>{outOfStockItems.length}</h3>
            <p>Out of Stock</p>
          </div>
        </div>

        <div className="inventoryover_stat-card">
          <div className="inventoryover_stat-icon inventoryover_value">
            <FaDollarSign />
          </div>
          <div className="inventoryover_stat-content">
            <h3>{formatCurrency(totalValue)}</h3>
            <p>Total Inventory Value</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="inventoryover_charts-section">
        {/* Category Distribution */}
        <div className="inventoryover_chart-card">
          <h3>Category Distribution</h3>
          <div className="inventoryover_category-chart">
            {categoryStats.map((stat, index) => (
              <div
                key={stat.category}
                className="inventoryover_category-bar"
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
                <div className="inventoryover_category-label">
                  {stat.category}
                </div>
                <div className="inventoryover_bar-container">
                  <div
                    className="inventoryover_bar"
                    style={{
                      width: `${stat.percentage}%`,
                      backgroundColor: `hsl(${index * 50}, 70%, 60%)`,
                    }}
                  ></div>
                </div>
                <div className="inventoryover_category-value">
                  {stat.totalItems}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Levels */}
        <div className="inventoryover_chart-card">
          <h3>Top Stock Levels</h3>
          <div className="inventoryover_stock-chart">
            {topStockItems.map((item, index) => (
              <div
                key={item.id}
                className="inventoryover_stock-bar"
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
                <div className="inventoryover_stock-label">{item.name}</div>
                <div className="inventoryover_bar-container">
                  <div
                    className="inventoryover_bar"
                    style={{
                      width: `${(item.currentStock / item.maxStock) * 100}%`,
                      backgroundColor:
                        item.currentStock <= 10 ? "#ef4444" : "#22c55e",
                    }}
                  ></div>
                </div>
                <div className="inventoryover_stock-value">
                  {item.currentStock} {item.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="inventoryover_alerts-section">
        <div className="inventoryover_alert-card">
          <div className="inventoryover_alert-header">
            <h3>
              <FaExclamationTriangle style={{ marginRight: "8px" }} />
              Low Stock Alerts
            </h3>
            <span className="inventoryover_alert-count">
              {lowStockItems.length} items
            </span>
          </div>
          <div className="inventoryover_alert-list">
            {lowStockList.map((item) => (
              <div key={item.id} className="inventoryover_alert-item">
                <div className="inventoryover_alert-info">
                  <span className="inventoryover_alert-name">{item.name}</span>
                  <span className="inventoryover_alert-category">
                    {item.category}
                  </span>
                </div>
                <div className="inventoryover_alert-stock">
                  <span
                    className={`inventoryover_stock-level ${
                      item.currentStock <= 5
                        ? "inventoryover_critical"
                        : "inventoryover_low"
                    }`}
                  >
                    {item.currentStock} {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="inventoryover_updates-card">
          <h3>Recent Updates</h3>
          <div className="inventoryover_updates-list">
            {inventoryData
              .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
              .slice(0, 5)
              .map((item) => (
                <div key={item.id} className="inventoryover_update-item">
                  <div className="inventoryover_update-info">
                    <span className="inventoryover_update-name">
                      {item.name}
                    </span>
                    <span className="inventoryover_update-date">
                      {new Date(item.lastUpdated).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="inventoryover_update-stock">
                    {item.currentStock} {item.unit}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredItem && (
        <div
          className="inventoryover_hover-tooltip"
          style={{
            left: hoveredPosition.x,
            top: hoveredPosition.y - 10,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          {hoveredItem.type === "category" ? (
            <>
              <div className="inventoryover_tooltip-title">
                {hoveredItem.name}
              </div>
              <div className="inventoryover_tooltip-content">
                <div>Items: {hoveredItem.totalItems}</div>
                <div>Total Stock: {hoveredItem.totalStock}</div>
                <div>Low Stock: {hoveredItem.lowStock}</div>
                <div>Percentage: {hoveredItem.percentage.toFixed(1)}%</div>
              </div>
            </>
          ) : (
            <>
              <div className="inventoryover_tooltip-title">
                {hoveredItem.name}
              </div>
              <div className="inventoryover_tooltip-content">
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
                  Cost: {formatCurrency(hoveredItem.costPerUnit)}/
                  {hoveredItem.unit}
                </div>
                <div>Supplier: {hoveredItem.supplier}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryOverview;
