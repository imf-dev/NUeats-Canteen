import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaUser, FaStore } from "react-icons/fa";
import SettingsAdmin from "./set_components/SettingsAdmin";
import SettingsStore from "./set_components/SettingsStore";
import "./Settings.css";
import ScrollUpButton from "../../components/common/ScrollUpButton";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const location = useLocation();

  // Check if there's a state passed from navigation and set the active tab
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const tabs = [
    { id: "admin", label: "Admin Profile & Credentials", icon: FaUser },
    { id: "store", label: "Store Settings", icon: FaStore },
  ];

  return (
    <div className="settings_management">
      <header className="settings_header">
        <div className="settings_header_content">
          <h1>Settings</h1>
          <p>Manage admin profile and canteen settings</p>
        </div>
      </header>

      <div className="settings_tabs_container">
        <div className="settings_tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings_tab ${
                activeTab === tab.id ? "settings_active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`settings_tab_content ${
          activeTab ? "settings_switching" : ""
        }`}
        key={activeTab}
      >
        {activeTab === "admin" && (
          <div className="settings_tab_panel">
            <SettingsAdmin />
          </div>
        )}
        {activeTab === "store" && (
          <div className="settings_tab_panel">
            <SettingsStore />
          </div>
        )}
      </div>

      <ScrollUpButton />
    </div>
  );
};

export default Settings;
