import React from "react";
import "./IO_LowStockAlerts.css";
import { FaExclamationTriangle } from "react-icons/fa";

const I_LowStockAlerts = ({ inventoryData }) => {
  const lowStockItems = inventoryData.filter((item) => item.currentStock <= 10);
  const lowStockList = [...lowStockItems].slice(0, 5);

  return (
    <div className="lowstock_alert-card">
      <div className="lowstock_alert-header">
        <h3>
          <FaExclamationTriangle style={{ marginRight: "8px" }} />
          Low Stock Alerts
        </h3>
        <span className="lowstock_alert-count">
          {lowStockItems.length} items
        </span>
      </div>
      <div className="lowstock_alert-list">
        {lowStockList.map((item) => (
          <div key={item.id} className="lowstock_alert-item">
            <div className="lowstock_alert-info">
              <span className="lowstock_alert-name">{item.name}</span>
              <span className="lowstock_alert-category">{item.category}</span>
            </div>
            <div className="lowstock_alert-stock">
              <span
                className={`lowstock_stock-level ${
                  item.currentStock <= 5 ? "lowstock_critical" : "lowstock_low"
                }`}
              >
                {item.currentStock} {item.unit}
              </span>
            </div>
          </div>
        ))}
        {lowStockList.length === 0 && (
          <div className="lowstock_no-alerts">
            <span>No low stock alerts</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default I_LowStockAlerts;
