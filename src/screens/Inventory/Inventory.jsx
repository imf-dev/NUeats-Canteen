import React, { useState } from "react";
import "./Inventory.css";
import InventoryList from "./inv_components/InventoryList";
import InventoryOverview from "./inv_components/InventoryOverview";
import InventoryTopSelling from "./inv_components/InventoryTop";
import ScrollUpButton from "../../components/common/ScrollUpButton";
import Inventory_EditModal from "./inv_components/Inventory_EditModal";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "top-selling", label: "Top Selling Items" },
    { id: "inventory-list", label: "Inventory List" },
  ];

  const handleAddNewItem = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveNewItem = (newItemData) => {
    // Here you would typically add the new item to your inventory data
    // For now, we'll just log it and close the modal
    console.log("New item to be added:", newItemData);

    // You can dispatch an action to your state management or call an API
    // Example: dispatch(addInventoryItem(newItemData));
    // Or: await addItemToInventory(newItemData);

    setIsAddModalOpen(false);

    // Optional: Show success message
    // You might want to add a toast notification here
  };

  return (
    <div className="inventory-management">
      <header className="inventory-header">
        <div className="header-content">
          <h1>Inventory Management</h1>
          <p>Track inventory levels and monitor top selling items</p>
        </div>
        <button className="add-item-btn" onClick={handleAddNewItem}>
          <span className="btn-icon">+</span>
          Add New Item
        </button>
      </header>

      <div className="tabs-container">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`tab-content ${activeTab ? "switching" : ""}`}
        key={activeTab}
      >
        {activeTab === "overview" && (
          <div className="tab-panel">
            <InventoryOverview />
          </div>
        )}
        {activeTab === "top-selling" && (
          <div className="tab-panel">
            <InventoryTopSelling />
          </div>
        )}
        {activeTab === "inventory-list" && (
          <div className="tab-panel">
            <InventoryList />
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <Inventory_EditModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        item={null} // Pass null for new items
        onSave={handleSaveNewItem}
        isAddMode={true} // Add this prop to indicate add mode
      />

      {/* ScrollUpButton placed here will work across all tabs */}
      <ScrollUpButton />
    </div>
  );
};

export default Inventory;
