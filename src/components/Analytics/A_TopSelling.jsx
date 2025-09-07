// src/components/Analytics/A_TopSelling.jsx
import React from "react";
import "./A_TopSelling.css";

const A_TopSelling = ({ popularItems }) => {
  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`;
  };

  return (
    <div className="topselling_analytics-card topselling_popular-items-card">
      <div className="topselling_card-header">
        <h3>Top Selling Items</h3>
        <p>Based on total units sold</p>
      </div>
      <div className="topselling_bar-chart-container">
        <div className="topselling_bar-chart">
          {popularItems.map((item, index) => {
            const barHeight =
              (item.unitsSold / popularItems[0].unitsSold) * 200;

            return (
              <div key={item.menuItemId} className="topselling_bar-item">
                <div className="topselling_bar-wrapper">
                  <div
                    className="topselling_bar"
                    style={{ height: `${barHeight}px` }}
                    data-tooltip={JSON.stringify({
                      name: item.itemName,
                      units: item.unitsSold,
                      revenue: item.revenue,
                      rank: index + 1,
                    })}
                  >
                    <div className="topselling_bar-fill"></div>
                  </div>
                  {/* Hover tooltip */}
                  <div className="topselling_bar-tooltip">
                    <div className="topselling_tooltip-header">
                      #{index + 1} {item.itemName}
                    </div>
                    <div className="topselling_tooltip-stats">
                      <div>
                        Units Sold: <span>{item.unitsSold}</span>
                      </div>
                      <div>
                        Revenue: <span>{formatCurrency(item.revenue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="topselling_bar-label">
                  <div className="topselling_bar-name">
                    {item.itemName.length > 12
                      ? item.itemName.substring(0, 10) + "..."
                      : item.itemName}
                  </div>
                  <div className="topselling_bar-units">
                    {item.unitsSold} sold
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default A_TopSelling;
