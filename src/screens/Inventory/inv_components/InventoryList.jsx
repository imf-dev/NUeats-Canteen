import React, { useState, useEffect } from "react";
import "./InventoryList.css";
import { Edit3, Trash2, Package } from "lucide-react";
import { inventoryData, categories } from "../../../demodata/inventoryDemoData";
import Inventory_EditModal from "./Inventory_EditModal";

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
      <div className="inventorylist_controls">
        <div className="inventorylist_search-container">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="inventorylist_search-input"
          />
        </div>

        <div className="inventorylist_category-dropdown">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="inventorylist_category-select"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="inventorylist_items-list">
        {filteredItems.map((item) => (
          <div key={item.id} className="inventorylist_item-card">
            <div className="inventorylist_item-header">
              <div className="inventorylist_item-main-info">
                <h3 className="inventorylist_item-name">{item.name}</h3>
                <span
                  className="inventorylist_category-badge"
                  style={{ backgroundColor: getCategoryColor(item.category) }}
                >
                  {item.category}
                </span>
              </div>
              <div className="inventorylist_item-actions">
                <button
                  className="inventorylist_action-btn inventorylist_edit-btn"
                  title="Edit"
                  onClick={() => handleEditClick(item)}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  className="inventorylist_action-btn inventorylist_delete-btn"
                  title="Delete"
                  onClick={() => handleDeleteClick(item)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="inventorylist_item-details-grid">
              <div className="inventorylist_detail-section">
                <div className="inventorylist_detail-label">Current Stock</div>
                <div className="inventorylist_detail-value current-stock">
                  {item.currentStock} {item.unit}
                </div>
              </div>

              <div className="inventorylist_detail-section">
                <div className="inventorylist_detail-label">Min/Max</div>
                <div className="inventorylist_detail-value">
                  {item.minStock} / {item.maxStock} {item.unit}
                </div>
              </div>

              <div className="inventorylist_detail-section">
                <div className="inventorylist_detail-label">Cost per Unit</div>
                <div className="inventorylist_detail-value price">
                  ₱{item.costPerUnit}
                </div>
              </div>

              <div className="inventorylist_detail-section">
                <div className="inventorylist_detail-label">Supplier</div>
                <div className="inventorylist_detail-value">
                  {item.supplier}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="inventorylist_no-results">
          <div className="inventorylist_no-results-icon">
            <Package size={64} strokeWidth={1} />
          </div>
          <h3>No items found</h3>
          <p>Try adjusting your search terms or category filter</p>
        </div>
      )}

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
