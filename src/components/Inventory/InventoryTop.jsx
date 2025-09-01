// src/components/InventoryTop.jsx
import React from "react";
import "./InventoryTop.css";
import { getTopSellingItems } from "../../demodata/salesDemoData";
import IT_TopItemsCards from "./InventoryTop/IT_TopItemsCards";

const InventoryTop = () => {
  const topItems = getTopSellingItems(5);

  return (
    <div className="inventory-top">
      <div className="inventory-top-header">
        <div className="header-content">
          <h2>Top Selling Items Analysis</h2>
          <p>Items ranked by sales volume with inventory impact analysis</p>
        </div>
      </div>

      <IT_TopItemsCards topItems={topItems} />
    </div>
  );
};

export default InventoryTop;
