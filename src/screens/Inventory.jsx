import React, { useState } from "react";
import "../styles/Inventory.css";
import InventoryList from "../components/Inventory/InventoryList";
import InventoryOverview from "../components/Inventory/InventoryOverview";
import InventoryTopSelling from "../components/Inventory/InventoryTop";
import ScrollUpButton from "../components/common/ScrollUpButton";
import Inventory_EditModal from "../components/Inventory/InventoryList/IL_EditModal";

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
    <div className="inventory_management">
      <header className="inventory_header">
        <div className="inventory_header_content">
          <h1>Inventory Management</h1>
          <p>Track inventory levels and monitor top selling items</p>
        </div>
        {/* Only show the Add New Item button when inventory-list tab is active */}
        {activeTab === "inventory-list" && (
          <button
            className="inventory_add_item_btn inventory_add_item_btn_animated"
            onClick={handleAddNewItem}
          >
            <span className="inventory_btn_icon">+</span>
            Add New Item
          </button>
        )}
      </header>

      <div className="inventory_tabs_container">
        <div className="inventory_tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`inventory_tab ${
                activeTab === tab.id ? "inventory_active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`inventory_tab_content ${
          activeTab ? "inventory_switching" : ""
        }`}
        key={activeTab}
      >
        {activeTab === "overview" && (
          <div className="inventory_tab_panel">
            <InventoryOverview />
          </div>
        )}
        {activeTab === "top-selling" && (
          <div className="inventory_tab_panel">
            <InventoryTopSelling />
          </div>
        )}
        {activeTab === "inventory-list" && (
          <div className="inventory_tab_panel">
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
      <ScrollUpButton />
    </div>
  );
};

export default Inventory;
