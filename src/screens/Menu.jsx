import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/Menu.css";
//import { FaEdit, FaTrash } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [isMobileTabsOpen, setIsMobileTabsOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Chop Suey",
      description:
        "A delicious and healthy Chop Suey with thick yummy sauce good for special occasions or for an everyday healthy meal.",
      price: 120,
      category: "Meals",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
    },
    {
      id: 2,
      name: "Cookies",
      description:
        "A sweet and chewy cookie baked to perfection, perfect for a quick treat or to share on any occasion.",
      price: 25,
      category: "Desserts",
      image:
        "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      isAvailable: false,
    },
    {
      id: 3,
      name: "Fried Rice",
      description:
        "Perfectly seasoned fried rice with mixed vegetables and your choice of protein. A satisfying meal for any time of day.",
      price: 95,
      category: "Meals",
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
    },
    {
      id: 4,
      name: "Fresh Orange Juice",
      description:
        "Freshly squeezed orange juice packed with vitamin C. The perfect refreshing drink to start your day.",
      price: 45,
      category: "Beverages",
      image:
        "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
    },
    {
      id: 5,
      name: "Chocolate Cake",
      description:
        "Rich and moist chocolate cake layered with creamy frosting. Perfect for celebrations and special moments.",
      price: 150,
      category: "Desserts",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
    },
    {
      id: 6,
      name: "Nachos",
      description:
        "Crispy tortilla chips loaded with cheese, jalapeños, and your favorite toppings. Perfect for sharing.",
      price: 85,
      category: "Snacks",
      image:
        "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      isAvailable: false,
    },
    {
      id: 7,
      name: "Iced Coffee",
      description:
        "Premium coffee served over ice with your choice of milk and sweetener. The perfect pick-me-up drink.",
      price: 65,
      category: "Beverages",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
    },
    {
      id: 8,
      name: "Spring Rolls",
      description:
        "Fresh and crispy spring rolls filled with vegetables and served with our signature dipping sauce.",
      price: 75,
      category: "Snacks",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      isAvailable: true,
    },
  ]);

  const tabs = [
    "All",
    "Meals",
    "Snacks",
    "Beverages",
    "Desserts",
    "Unavailable",
  ];

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

  const handleEdit = (id) => {
    console.log("Edit item with id:", id);
    // Add edit functionality later
  };

  const handleDelete = (id) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleAddMenuItem = () => {
    console.log("Add new menu item");
    // Add functionality later
  };

  return (
    <div className="menu-layout">
      <div className="menu-main">
        <div className="menu-header">
          <div className="header-content">
            <h1>Menu Management</h1>
            <p>Manage menu items and categories</p>
          </div>
          <button className="add-menu-btn" onClick={handleAddMenuItem}>
            <span className="plus-icon">+</span>
            Add Menu Item
          </button>
        </div>

        <div className="menu-controls">
          <div className="menu-tabs-wrapper" ref={hamburgerRef}>
            <button
              className="hamburger-btn"
              onClick={() => setIsMobileTabsOpen(!isMobileTabsOpen)}
            >
              ☰
            </button>

            <div className={`menu-tabs ${isMobileTabsOpen ? "open" : ""}`}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""} ${
                    tab === "Unavailable" ? "unavailable-tab" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search by food name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="menu-items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-item-card">
              <div className="item-image-container">
                <img src={item.image} alt={item.name} className="item-image" />
                {!item.isAvailable && (
                  <div className="unavailable-overlay">
                    <span className="unavailable-badge">Unavailable</span>
                  </div>
                )}
              </div>

              <div className="item-content">
                <div className="item-category">
                  <span className="category-badge">{item.category}</span>
                </div>

                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>

                <div className="item-footer">
                  <span className="item-price">₱{item.price}</span>

                  <div className="item-actions">
                    <button
                      className={`availability-btn ${
                        item.isAvailable ? "disable" : "enable"
                      }`}
                      onClick={() => toggleAvailability(item.id)}
                    >
                      {item.isAvailable ? "Disable" : "Enable"}
                    </button>

                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(item.id)}
                    >
                      <MdEdit />
                    </button>

                    <button
                      className="action-btn delete-btn"
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
    </div>
  );
};

export default MenuManagement;
