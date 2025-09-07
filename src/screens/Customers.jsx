import React, { useState } from "react";
import ScrollUpButton from "../components/common/ScrollUpButton";
import CustomerStats from "../components/Customers/CustomerStats";
import AllCustomers from "../components/Customers/AllCustomers";
import Complaints from "../components/Customers/Complaints";
import CustomerAnalytics from "../components/Customers/CustomerAnalytics";
import "../styles/Customers.css";

const Customers = () => {
  const [activeTab, setActiveTab] = useState("all-customers");

  const tabs = [
    { id: "all-customers", label: "All Customers" },
    { id: "complaints", label: "Complaints" },
    { id: "analytics", label: "Analytics" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="cust-customers-container">
      {/* Header Section */}
      <div className="cust-customers-header">
        <h1 className="cust-customers-title">Customer Management</h1>
        <p className="cust-customers-description">
          Manage app users, feedbacks, and customer complaints
        </p>
      </div>

      {/* Stats Section */}
      <CustomerStats />

      {/* Tabs Section */}
      <div className="cust-tabs-container">
        <div className="cust-tabs-wrapper">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`cust-tab-button ${
                activeTab === tab.id ? "cust-active" : ""
              }`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="cust-tab-content">
        {activeTab === "all-customers" && (
          <div className="cust-tab-panel cust-fade-in">
            <AllCustomers />
          </div>
        )}

        {activeTab === "complaints" && (
          <div className="cust-tab-panel cust-fade-in cust-complaints-tab-panel">
            <Complaints />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="cust-tab-panel cust-fade-in cust-analytics-tab-panel">
            <CustomerAnalytics />
          </div>
        )}
      </div>
      <ScrollUpButton />
    </div>
  );
};

export default Customers;
