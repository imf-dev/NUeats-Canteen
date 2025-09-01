import React from "react";
import "./D_TopSellingCard.css";

const DashboardTopSellingCard = ({ topSellingItems }) => {
  return (
    <div className="dashboard_top-selling-container">
      <div className="dashboard_top-selling-header">
        <h3>Top 5 Selling Items This Week</h3>
        <p>Most popular menu items by quantity sold</p>
      </div>
      <div className="dashboard_top-selling-list">
        {topSellingItems.map((item, index) => (
          <div key={item.id} className="dashboard_selling-item">
            <div className="dashboard_item-header">
              <span className="dashboard_item-name">{item.name}</span>
              <span className="dashboard_item-quantity">
                {item.quantity} sold
              </span>
            </div>

            <div className="dashboard_progress-container">
              <div
                className="dashboard_progress-bar"
                style={{
                  width: `${
                    (item.quantity / topSellingItems[0]?.quantity) * 100
                  }%`,
                  backgroundColor: item.color,
                }}
              ></div>
            </div>
          </div>
        ))}

        <div className="dashboard_progress-scale">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopSellingCard;
