import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import nueatsLogo from "../../assets/NUeats_wshadow.png";
import nuOnlyYellow from "../../assets/nu_only_yellow.png";

import {
  FiHome,
  FiShoppingCart,
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

  useEffect(() => {
    switch (location.pathname) {
      case "/NUeats-Canteen/dashboard/":
        setActiveItem("DASHBOARD");
        break;
      case "/NUeats-Canteen/orders/":
        setActiveItem("ORDERS");
        break;
      case "/NUeats-Canteen/menu/":
        setActiveItem("MENU");
        break;
      case "/NUeats-Canteen/analytics/":
        setActiveItem("ANALYTICS");
        break;
      case "/NUeats-Canteen/customers/":
        setActiveItem("CUSTOMERS");
        break;
      case "/NUeats-Canteen/settings/":
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
      path: "/NUeats-Canteen/dashboard/",
    },
    {
      id: "ORDERS",
      label: "ORDERS",
      icon: <FiShoppingCart />,
      path: "/NUeats-Canteen/orders/",
    },
    {
      id: "MENU",
      label: "MENU",
      icon: <GiKnifeFork />,
      path: "/NUeats-Canteen/menu/",
    },
    {
      id: "ANALYTICS",
      label: "ANALYTICS",
      icon: <FiBarChart2 />,
      path: "/NUeats-Canteen/analytics/",
    },
    {
      id: "CUSTOMERS",
      label: "CUSTOMERS",
      icon: <FiUsers />,
      path: "/NUeats-Canteen/customers/",
    },
    {
      id: "SETTINGS",
      label: "SETTINGS",
      icon: <FiSettings />,
      path: "/NUeats-Canteen/settings/",
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
    if (window.history && window.history.pushState) {
      const historyLength = window.history.length;
      window.history.go(-historyLength);
      setTimeout(() => {
        window.history.replaceState(null, null, "/");
      }, 100);
      setTimeout(() => {
        window.history.pushState(null, null, "/");
        const handleBackButton = (event) => {
          event.preventDefault();
          window.history.pushState(null, null, "/");
        };
        window.addEventListener("popstate", handleBackButton);
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
        navigate("/NUeats-Canteen/settings/", {
          state: { activeTab: "admin" },
        });
        setActiveItem("SETTINGS");
        break;
      case "restaurant":
        navigate("/NUeats-Canteen/settings/", {
          state: { activeTab: "store" },
        });
        setActiveItem("SETTINGS");
        break;
      case "signout":
        localStorage.removeItem("isAuthenticated");
        sessionStorage.clear();
        navigate("/NUeats-Canteen/", { replace: true });
        window.location.reload(); // ensures fresh state
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
