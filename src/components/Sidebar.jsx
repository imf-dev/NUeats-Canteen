import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import nueatsLogo from "../assets/NUeats_wshadow.png";
import nuOnlyYellow from "../assets/nu_only_yellow.png";

import {
  FiHome,
  FiShoppingCart,
  FiList,
  FiBox,
  FiBarChart2,
  FiUsers,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";
import { GrRestaurant } from "react-icons/gr";

const Sidebar = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("DASHBOARD");

  const navigate = useNavigate();
  const location = useLocation();

  // Update activeItem based on current route
  useEffect(() => {
    switch (location.pathname) {
      case "/dashboard":
        setActiveItem("DASHBOARD");
        break;
      case "/orders":
        setActiveItem("ORDERS");
        break;
      case "/menu":
        setActiveItem("MENU");
        break;
      case "/inventory":
        setActiveItem("INVENTORY");
        break;
      case "/analytics":
        setActiveItem("ANALYTICS");
        break;
      case "/customers":
        setActiveItem("CUSTOMERS");
        break;
      case "/settings":
        setActiveItem("SETTINGS");
        break;
      default:
        setActiveItem("");
        break;
    }
  }, [location.pathname]);

  const menuItems = [
    {
      id: "DASHBOARD",
      label: "DASHBOARD",
      icon: <FiHome />,
      path: "/dashboard",
    },
    {
      id: "ORDERS",
      label: "ORDERS",
      icon: <FiShoppingCart />,
      path: "/orders",
    },
    { id: "MENU", label: "MENU", icon: <GiKnifeFork />, path: "/menu" },
    {
      id: "INVENTORY",
      label: "INVENTORY",
      icon: <FiBox />,
      path: "/inventory",
    },
    {
      id: "ANALYTICS",
      label: "ANALYTICS",
      icon: <FiBarChart2 />,
      path: "/analytics",
    },
    {
      id: "CUSTOMERS",
      label: "CUSTOMERS",
      icon: <FiUsers />,
      path: "/customers",
    },
    {
      id: "SETTINGS",
      label: "SETTINGS",
      icon: <FiSettings />,
      path: "/settings",
    },
  ];

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const handleModalClose = () => {
    setIsProfileModalOpen(false);
  };

  const handleProfileAction = (action) => {
    console.log(`Profile action: ${action}`);
    setIsProfileModalOpen(false);
    // Add your action handlers here
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={nueatsLogo} alt="NUeats Logo" className="sidebar-logo" />
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${activeItem === item.id ? "active" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div
          className={`admin-profile ${isProfileModalOpen ? "active" : ""}`}
          onClick={handleProfileClick}
        >
          <div className="admin-avatar">
            <img
              src={nuOnlyYellow}
              alt="Admin Avatar"
              className="admin-avatar-img"
            />
          </div>
          <div className="admin-info">
            <div className="admin-name">NUeats admin</div>
            <div className="admin-email">nueats@gmail.com</div>
          </div>
        </div>

        {isProfileModalOpen && (
          <>
            <div className="modal-overlay" onClick={handleModalClose}></div>
            <div className="profile-modal">
              <div className="modal-header">
                <h3>My Account</h3>
              </div>
              <div className="modal-content">
                <button
                  className="modal-item"
                  onClick={() => handleProfileAction("profile")}
                >
                  <span className="modal-icon">
                    <FiUser />
                  </span>
                  <span>Profile Settings</span>
                </button>
                <button
                  className="modal-item"
                  onClick={() => handleProfileAction("restaurant")}
                >
                  <span className="modal-icon">
                    <GrRestaurant />
                  </span>
                  <span>Restaurant Settings</span>
                </button>
                <button
                  className="modal-item sign-out"
                  onClick={() => handleProfileAction("signout")}
                >
                  <span className="modal-icon">↗</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
