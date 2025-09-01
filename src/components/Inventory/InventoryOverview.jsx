import React from "react";
import "./InventoryOverview.css";
import { inventoryData, categories } from "../../demodata/inventoryDemoData";
import IO_SummaryCards from "./InventoryOverview/IO_SummaryCards";
import IO_CategoryDistribution from "./InventoryOverview/IO_CategoryDistribution";
import IO_TopStockLevel from "./InventoryOverview/IO_TopStockLevel";
import IO_LowStockAlerts from "./InventoryOverview/IO_LowStockAlerts";
import IO_RecentUpdates from "./InventoryOverview/IO_RecentUpdates";

const InventoryOverview = () => {
  return (
    <div className="inventoryover_inventory-overview">
      {/* Summary Cards */}
      <IO_SummaryCards inventoryData={inventoryData} />

      {/* Charts Section */}
      <div className="inventoryover_charts-section">
        <IO_CategoryDistribution
          inventoryData={inventoryData}
          categories={categories}
        />
        <IO_TopStockLevel inventoryData={inventoryData} />
      </div>

      {/* Alerts Section */}
      <div className="inventoryover_alerts-section">
        <IO_LowStockAlerts inventoryData={inventoryData} />
        <IO_RecentUpdates inventoryData={inventoryData} />
      </div>
    </div>
  );
};

export default InventoryOverview;
