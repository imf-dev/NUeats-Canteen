import React, { useState, useRef, useEffect } from "react";
import "../styles/Menu.css";
import MenuAddEdit from "../components/Menu/MenuAddEdit";
import M_Cards from "../components/Menu/M_Cards";
import CustomModal from "../components/common/CustomModal";
import ScrollUpButton from "../components/common/ScrollUpButton";

// Import demo data
import { categories } from "../demodata/menuDemoData";
import { supabase } from "../lib/supabaseClient";

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

  // Initialize with empty list and fetch from DB
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadMenuItems() {
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("id, name, description, price, category, image, is_available, prep_time")
          .order("id", { ascending: true });
        if (error) {
          console.error("❌ Failed to fetch menu_items:", error);
          return;
        }
        if (!isMounted) return;
        const mapped = (data || []).map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description ?? "",
          price: Number(row.price),
          category: row.category ?? "",
          image: row.image ?? "",
          isAvailable: !!row.is_available,
          prepTime: typeof row.prep_time === "number" ? row.prep_time : undefined,
        }));
        setMenuItems(mapped);
      } catch (err) {
        console.error("💥 Unexpected error loading menu_items:", err);
      }
    }
    loadMenuItems();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const toggleAvailability = async (id) => {
    const current = menuItems.find((i) => i.id === id);
    if (!current) return;
    const nextAvailable = !current.isAvailable;
    // optimistic update
    setMenuItems((prev) => prev.map((i) => (i.id === id ? { ...i, isAvailable: nextAvailable } : i)));
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: nextAvailable })
      .eq("id", id);
    if (error) {
      console.error("❌ Failed to toggle availability:", error);
      // revert on error
      setMenuItems((prev) => prev.map((i) => (i.id === id ? { ...i, isAvailable: !nextAvailable } : i)));
    }
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

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete.id;
    // optimistic removal
    const prev = menuItems;
    setMenuItems((items) => items.filter((i) => i.id !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      console.error("❌ Failed to delete item:", error);
      // revert on error
      setMenuItems(prev);
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

  const handleSaveMenuItem = async (menuItemData, mode) => {
    // Upload image to Supabase Storage if a File is provided
    async function uploadImageIfNeeded(file, nameHint) {
      if (!(file instanceof File)) return menuItemData.image || "";
      const allowed = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowed.includes(file.type)) {
        console.error("❌ Invalid file type:", file.type);
        return "";
      }
      const maxBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxBytes) {
        console.error("❌ File too large (max 5MB)");
        return "";
      }
      const fileExt = file.type === "image/png" ? "png" : "jpg";
      const safeName = (nameHint || "menu-item")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const uniquePath = `menu/${Date.now()}-${safeName}.${fileExt}`;
      const { data: uploadRes, error: uploadErr } = await supabase.storage
        .from("menu-images")
        .upload(uniquePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
      if (uploadErr) {
        console.error("❌ Image upload failed:", uploadErr);
        return "";
      }
      const { data: publicUrlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(uploadRes.path);
      return publicUrlData?.publicUrl || "";
    }

    if (mode === "add") {
      const imageUrl = await uploadImageIfNeeded(menuItemData.imageFile, menuItemData.name);
      const payload = {
        name: menuItemData.name,
        description: menuItemData.description,
        price: menuItemData.price,
        category: menuItemData.category,
        image: imageUrl || null,
        is_available: true,
        prep_time: typeof menuItemData.prepTime === "number" ? menuItemData.prepTime : null,
      };
      const { data, error } = await supabase
        .from("menu_items")
        .insert(payload)
        .select("id, name, description, price, category, image, is_available, prep_time")
        .single();
      if (error) {
        console.error("❌ Failed to add item:", error);
        return;
      }
      const mapped = {
        id: data.id,
        name: data.name,
        description: data.description ?? "",
        price: Number(data.price),
        category: data.category ?? "",
        image: data.image ?? "",
        isAvailable: !!data.is_available,
        prepTime: typeof data.prep_time === "number" ? data.prep_time : undefined,
      };
      setMenuItems((prev) => [...prev, mapped]);
    } else {
      let imageUrl = menuItemData.image || "";
      if (menuItemData.imageFile instanceof File) {
        imageUrl = await uploadImageIfNeeded(menuItemData.imageFile, menuItemData.name);
      }
      const payload = {
        name: menuItemData.name,
        description: menuItemData.description,
        price: menuItemData.price,
        category: menuItemData.category,
        image: imageUrl || null,
        prep_time: typeof menuItemData.prepTime === "number" ? menuItemData.prepTime : null,
      };
      const { data, error } = await supabase
        .from("menu_items")
        .update(payload)
        .eq("id", menuItemData.id)
        .select("id, name, description, price, category, image, is_available, prep_time")
        .single();
      if (error) {
        console.error("❌ Failed to update item:", error);
        return;
      }
      const mapped = {
        id: data.id,
        name: data.name,
        description: data.description ?? "",
        price: Number(data.price),
        category: data.category ?? "",
        image: data.image ?? "",
        isAvailable: !!data.is_available,
        prepTime: typeof data.prep_time === "number" ? data.prep_time : undefined,
      };
      setMenuItems((prev) => prev.map((i) => (i.id === mapped.id ? mapped : i)));
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
