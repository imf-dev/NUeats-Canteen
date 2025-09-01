import React from "react";
import "./IO_RecentUpdates.css";

const I_RecentUpdates = ({ inventoryData }) => {
  const recentUpdates = inventoryData
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    .slice(0, 5);

  return (
    <div className="updates_updates-card">
      <h3>Recent Updates</h3>
      <div className="updates_updates-list">
        {recentUpdates.map((item) => (
          <div key={item.id} className="updates_update-item">
            <div className="updates_update-info">
              <span className="updates_update-name">{item.name}</span>
              <span className="updates_update-date">
                {new Date(item.lastUpdated).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="updates_update-stock">
              {item.currentStock} {item.unit}
            </div>
          </div>
        ))}
        {recentUpdates.length === 0 && (
          <div className="updates_no-updates">
            <span>No recent updates</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default I_RecentUpdates;
