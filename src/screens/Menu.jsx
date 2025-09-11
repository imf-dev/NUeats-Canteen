import React, { useState, useRef, useEffect } from "react";
import "../styles/Menu.css";
import MenuAddEdit from "../components/Menu/MenuAddEdit";
import M_Cards from "../components/Menu/M_Cards";
import CustomModal from "../components/common/CustomModal";
import ScrollUpButton from "../components/common/ScrollUpButton";

// Import demo data
import {
  menuItems as initialMenuItems,
  categories,
} from "../demodata/menuDemoData";

const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [isMobileTabsOpen, setIsMobileTabsOpen] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [itemToEdit, setItemToEdit] = useState(null);

  // Confirmation deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Initialize with demo data
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  // Filter out "Unavailable" from categories and use as tabs - Fixed to avoid duplicate "All"
  const filteredCategories = categories.filter(
    (cat) => cat !== "Unavailable" && cat !== "All"
  );
  const tabs = ["All", ...filteredCategories];

  // Updated availability filter options without emojis and better labels
  const availabilityOptions = [
    {
      value: "All",
      label: "All Items",
    },
    {
      value: "Available",
      label: "Available Only",
    },
    {
      value: "Unavailable",
      label: "Unavailable Only",
    },
  ];

  // Close mobile tabs and dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMobileTabsOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enhanced filtering logic
  const filteredItems = menuItems.filter((item) => {
    // Search filter
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Category filter
    let matchesCategory = true;
    if (activeTab !== "All") {
      matchesCategory = item.category === activeTab;
    }

    // Availability filter
    let matchesAvailability = true;
    if (availabilityFilter === "Available") {
      matchesAvailability = item.isAvailable === true;
    } else if (availabilityFilter === "Unavailable") {
      matchesAvailability = item.isAvailable === false;
    }
    // If "All" is selected, matchesAvailability stays true

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Get counts for each availability status
  const getAvailabilityCounts = () => {
    const currentCategoryItems =
      activeTab === "All"
        ? menuItems
        : menuItems.filter((item) => item.category === activeTab);

    const available = currentCategoryItems.filter(
      (item) => item.isAvailable
    ).length;
    const unavailable = currentCategoryItems.filter(
      (item) => !item.isAvailable
    ).length;
    const total = currentCategoryItems.length;

    return { available, unavailable, total };
  };

  const counts = getAvailabilityCounts();

  const toggleAvailability = (id) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

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
      const newId = Math.max(...menuItems.map((item) => item.id)) + 1;
      const newItem = {
        ...menuItemData,
        id: newId,
      };
      setMenuItems((prevItems) => [...prevItems, newItem]);
    } else {
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === menuItemData.id ? menuItemData : item
        )
      );
    }
  };

  const handleAvailabilityFilterChange = (value) => {
    setAvailabilityFilter(value);
    setIsDropdownOpen(false);
  };

  // Get the current filter option for display
  const getCurrentFilterOption = () => {
    return availabilityOptions.find((opt) => opt.value === availabilityFilter);
  };

  return (
    <div className="menu_layout">
      <div className="menu_main">
        <div className="menu_header">
          <div className="menu_header-content">
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
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Updated Availability Filter Dropdown */}
          <div className="menu_filter-dropdown" ref={dropdownRef}>
            <button
              className="menu_filter-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="menu_filter-label">
                {getCurrentFilterOption()?.label}
              </span>
              <span
                className={`menu_dropdown-arrow ${
                  isDropdownOpen ? "menu_open" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <div className="menu_dropdown-menu">
                {availabilityOptions.map((option) => {
                  let count;
                  if (option.value === "All") count = counts.total;
                  else if (option.value === "Available")
                    count = counts.available;
                  else count = counts.unavailable;

                  return (
                    <button
                      key={option.value}
                      className={`menu_dropdown-item ${
                        availabilityFilter === option.value ? "menu_active" : ""
                      }`}
                      onClick={() =>
                        handleAvailabilityFilterChange(option.value)
                      }
                    >
                      <span className="menu_dropdown-item-content">
                        <span className="menu_dropdown-text">
                          {option.label}
                        </span>
                        <span className="menu_dropdown-count">({count})</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
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

        {/* Results Summary */}
        <div className="menu_results-summary">
          Showing {filteredItems.length} item
          {filteredItems.length !== 1 ? "s" : ""}
          {activeTab !== "All" && ` in ${activeTab}`}
          {availabilityFilter !== "AllItems" &&
            ` (${availabilityFilter.toLowerCase()})`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {/* Use the M_Cards component */}
        <M_Cards
          menuItems={filteredItems}
          onToggleAvailability={toggleAvailability}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit Modal */}
      <MenuAddEdit
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        itemToEdit={itemToEdit}
        onSave={handleSaveMenuItem}
      />

      {/* Delete Confirmation Modal using CustomModal */}
      <CustomModal
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        type="error"
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
      />

      <ScrollUpButton />
    </div>
  );
};

export default MenuManagement;
