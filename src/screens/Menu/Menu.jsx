import React, { useState, useRef, useEffect } from "react";
import "./Menu.css";
import { MdEdit, MdDelete } from "react-icons/md";
import MenuAddEdit from "./Menu_AddEdit";
import ScrollUpButton from "../../components/common/ScrollUpButton";

// Import demo data
import {
  menuItems as initialMenuItems,
  categories,
} from "../../demodata/menuDemoData";

const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [isMobileTabsOpen, setIsMobileTabsOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [itemToEdit, setItemToEdit] = useState(null);

  //confirmation deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Initialize with demo data
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  // Use imported categories instead of hardcoded tabs
  const tabs = categories;

  // Close mobile tabs when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMobileTabsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered items based on active tab AND search term
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (activeTab === "All") return matchesSearch;
    if (activeTab === "Unavailable") return !item.isAvailable && matchesSearch;
    return item.category === activeTab && matchesSearch;
  });

  const toggleAvailability = (id) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  //delete feat
  const handleEdit = (id) => {
    const item = menuItems.find((item) => item.id === id);
    setItemToEdit(item);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const item = menuItems.find((item) => item.id === id);
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setMenuItems((prevItems) =>
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

  const handleAddMenuItem = () => {
    setItemToEdit(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setItemToEdit(null);
  };

  const handleSaveMenuItem = (menuItemData, mode) => {
    if (mode === "add") {
      // Generate new ID (in real app, this would come from backend)
      const newId = Math.max(...menuItems.map((item) => item.id)) + 1;
      const newItem = {
        ...menuItemData,
        id: newId,
      };
      setMenuItems((prevItems) => [...prevItems, newItem]);
    } else {
      // Update existing item
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === menuItemData.id ? menuItemData : item
        )
      );
    }
  };

  return (
    <div className="menu_layout">
      <div className="menu_main">
        <div className="menu_header">
          <div className="header-content">
            <h1>Menu Management</h1>
            <p>Manage menu items and categories</p>
          </div>
          <button className="menu_add-menu-btn" onClick={handleAddMenuItem}>
            <span className="menu_plus-icon">+</span>
            Add Menu Item
          </button>
        </div>

        <div className="menu_controls">
          <div className="menu_tabs-wrapper" ref={hamburgerRef}>
            <button
              className="menu_hamburger-btn"
              onClick={() => setIsMobileTabsOpen(!isMobileTabsOpen)}
            >
              ☰
            </button>

            <div className={`menu_tabs ${isMobileTabsOpen ? "menu_open" : ""}`}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`menu_tab-btn ${
                    activeTab === tab ? "menu_active" : ""
                  } ${tab === "Unavailable" ? "menu_unavailable-tab" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="menu_search-container">
            <input
              type="text"
              placeholder="Search by food name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="menu_search-input"
            />
          </div>
        </div>

        <div className="menu_items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu_item-card">
              <div className="menu_item-image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  className="menu_item-image"
                />
                {!item.isAvailable && (
                  <div className="menu_unavailable-overlay">
                    <span className="menu_unavailable-badge">Unavailable</span>
                  </div>
                )}
              </div>

              <div className="menu_item-content">
                <div className="menu_item-category">
                  <span className="menu_category-badge">{item.category}</span>
                </div>

                <h3 className="menu_item-name">{item.name}</h3>
                <p className="menu_item-description">{item.description}</p>

                <div className="menu_item-footer">
                  <span className="menu_item-price">₱{item.price}</span>

                  <div className="menu_item-actions">
                    <button
                      className={`menu_availability-btn ${
                        item.isAvailable ? "menu_disable" : "menu_enable"
                      }`}
                      onClick={() => toggleAvailability(item.id)}
                    >
                      {item.isAvailable ? "Disable" : "Enable"}
                    </button>

                    <button
                      className="menu_action-btn menu_edit-btn"
                      onClick={() => handleEdit(item.id)}
                    >
                      <MdEdit />
                    </button>

                    <button
                      className="menu_action-btn menu_delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <MenuAddEdit
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        itemToEdit={itemToEdit}
        onSave={handleSaveMenuItem}
      />

      {/* Delete Confirmation Modal - THIS IS THE POPUP MODAL */}
      {showDeleteConfirm && (
        <div className="menu_confirmation-overlay menu_open">
          <div className="menu_confirmation-modal">
            <h3 className="menu_confirmation-title">Delete Menu Item</h3>
            <p className="menu_confirmation-message">
              Are you sure you want to delete "{itemToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="menu_confirmation-actions">
              <button
                className="menu_confirmation-btn confirm-cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="menu_confirmation-btn confirm-ok"
                onClick={confirmDelete}
                style={{ background: "#ef4444" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ScrollUpButton />
    </div>
  );
};

export default MenuManagement;
