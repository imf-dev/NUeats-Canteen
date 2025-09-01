import React, { useState } from "react";
import { FaUser, FaStore } from "react-icons/fa";
import SettingsAdmin from "./set_components/SettingsAdmin";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("admin");

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage admin profile and canteen settings</p>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === "admin" ? "active" : ""}`}
          onClick={() => setActiveTab("admin")}
        >
          <FaUser className="tab-icon" />
          Admin Profile & Credentials
        </button>
        <button
          className={`tab-button ${activeTab === "store" ? "active" : ""}`}
          onClick={() => setActiveTab("store")}
        >
          <FaStore className="tab-icon" />
          Store Settings
        </button>
      </div>

      <div className="settings-content">
        {activeTab === "admin" && <SettingsAdmin />}
        {activeTab === "store" && (
          <div className="coming-soon">
            <h3>Store Settings</h3>
            <p>This section is coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
