import React, { useState, useEffect } from "react";
import "./InventoryList.css";
import { inventoryData, categories } from "../../demodata/inventoryDemoData";
import Inventory_EditModal from "./InventoryList/IL_EditModal";
import IL_SearchFilters from "./InventoryList/IL_SearchFilters";
import IL_StockCards from "./InventoryList/IL_StockCards";

const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [filteredItems, setFilteredItems] = useState(inventoryData);
  const [items, setItems] = useState(inventoryData);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Delete confirmation states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    let filtered = items;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, items]);

  const getCategoryColor = (category) => {
    const colors = {
      Vegetables: "#10b981",
      Meat: "#ef4444",
      Dairy: "#3b82f6",
      Pantry: "#f59e0b",
      Grains: "#8b5cf6",
      Seasonings: "#06b6d4",
    };
    return colors[category] || "#64748b";
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaveChanges = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  // Delete functionality
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemToDelete.id)
      );
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  return (
    <div className="inventorylist_inventory-list">
      <IL_SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <IL_StockCards
        filteredItems={filteredItems}
        getCategoryColor={getCategoryColor}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />

      <Inventory_EditModal
        isOpen={editModalOpen}
        onClose={handleEditModalClose}
        item={selectedItem}
        onSave={handleSaveChanges}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="inventorylist_confirmation-overlay inventorylist_open">
          <div className="inventorylist_confirmation-modal">
            <h3 className="inventorylist_confirmation-title">
              Delete Inventory Item
            </h3>
            <p className="inventorylist_confirmation-message">
              Are you sure you want to delete "{itemToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="inventorylist_confirmation-actions">
              <button
                className="inventorylist_confirmation-btn inventorylist_confirm-cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="inventorylist_confirmation-btn inventorylist_confirm-ok"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
