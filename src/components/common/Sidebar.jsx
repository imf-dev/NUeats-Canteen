import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import nueatsLogo from "../../assets/NUeats_wshadow.png";
import nuOnlyYellow from "../../assets/nu_only_yellow.png";

import {
  FiHome,
  FiShoppingCart,
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
    if (item.path) navigate(item.path);
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const handleModalClose = () => {
    setIsProfileModalOpen(false);
  };

  const clearBrowserHistory = () => {
    // Clear browser history completely
    if (window.history && window.history.pushState) {
      // Get the current history length
      const historyLength = window.history.length;

      // Go back to the first entry and replace it
      window.history.go(-historyLength);

      // Replace the current state to clear history
      setTimeout(() => {
        window.history.replaceState(null, null, "/");
      }, 100);

      // Push a new clean state
      setTimeout(() => {
        window.history.pushState(null, null, "/");

        // Set up back button prevention for login page
        const handleBackButton = (event) => {
          event.preventDefault();
          window.history.pushState(null, null, "/");
        };

        window.addEventListener("popstate", handleBackButton);

        // Clean up after a short delay (user should be on login page by then)
        setTimeout(() => {
          window.removeEventListener("popstate", handleBackButton);
        }, 1000);
      }, 200);
    }
  };

  const handleProfileAction = (action) => {
    setIsProfileModalOpen(false);

    switch (action) {
      case "profile":
        // Navigate to Settings page with admin tab active
        navigate("/settings", { state: { activeTab: "admin" } });
        setActiveItem("SETTINGS");
        break;
      case "restaurant":
        // Navigate to Settings page with store tab active
        navigate("/settings", { state: { activeTab: "store" } });
        setActiveItem("SETTINGS");
        break;
      case "signout":
        // Clear any stored user data (localStorage, sessionStorage, etc.)
        localStorage.clear();
        sessionStorage.clear();

        // Clear browser history completely
        clearBrowserHistory();

        // Navigate to login page with replace to prevent back navigation
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 300);
        break;
      default:
        console.log(`Profile action: ${action}`);
        break;
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <img src={nueatsLogo} alt="NUeats Logo" className="sidebar-logo" />
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar-nav-item">
              <button
                className={`sidebar-nav-link ${
                  activeItem === item.id ? "active" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div
          className={`sidebar-admin-profile ${
            isProfileModalOpen ? "active" : ""
          }`}
          onClick={handleProfileClick}
        >
          <div className="sidebar-admin-avatar">
            <img
              src={nuOnlyYellow}
              alt="Admin Avatar"
              className="sidebar-admin-avatar-img"
            />
          </div>
          <div className="sidebar-admin-info">
            <div className="sidebar-admin-name">NUeats admin</div>
            <div className="sidebar-admin-email">nueats@gmail.com</div>
          </div>
        </div>

        {isProfileModalOpen && (
          <>
            <div
              className="sidebar-modal-overlay"
              onClick={handleModalClose}
            ></div>
            <div className="sidebar-profile-modal">
              <div className="sidebar-modal-header">
                <h3>My Account</h3>
              </div>
              <div className="sidebar-modal-content">
                <button
                  className="sidebar-modal-item"
                  onClick={() => handleProfileAction("profile")}
                >
                  <span className="sidebar-modal-icon">
                    <FiUser />
                  </span>
                  <span>Profile Settings</span>
                </button>
                <button
                  className="sidebar-modal-item"
                  onClick={() => handleProfileAction("restaurant")}
                >
                  <span className="sidebar-modal-icon">
                    <GrRestaurant />
                  </span>
                  <span>Store Settings</span>
                </button>
                <button
                  className="sidebar-modal-item sidebar-sign-out"
                  onClick={() => handleProfileAction("signout")}
                >
                  <span className="sidebar-modal-icon">↗</span>
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
