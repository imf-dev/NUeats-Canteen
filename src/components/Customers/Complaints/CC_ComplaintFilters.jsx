import React, { useState } from "react";
import "./CC_ComplaintFilters.css";

const CC_ComplaintFilters = ({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
}) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "resolved", label: "Resolved" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Food Quality", label: "Food Quality" },
    { value: "Service", label: "Service" },
    { value: "App Issue", label: "App Issue" },
    { value: "Billing", label: "Billing" },
    { value: "Pickup Delay", label: "Pickup Delay" },
    { value: "Other", label: "Other" },
  ];

  const handleStatusSelect = (value) => {
    setStatusFilter(value);
    setIsStatusDropdownOpen(false);
  };

  const handleCategorySelect = (value) => {
    setCategoryFilter(value);
    setIsCategoryDropdownOpen(false);
  };

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
    setIsCategoryDropdownOpen(false); // Close other dropdown
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    setIsStatusDropdownOpen(false); // Close other dropdown
  };

  const getStatusDisplayText = () => {
    const option = statusOptions.find((opt) => opt.value === statusFilter);
    return option ? option.label : "All Status";
  };

  const getCategoryDisplayText = () => {
    const option = categoryOptions.find((opt) => opt.value === categoryFilter);
    return option ? option.label : "All Categories";
  };

  return (
    <div className="ccf-complaint-filters">
      <div className="ccf-complaint-filters-row">
        <div className="ccf-complaint-filters-left">
          <h2 className="ccf-complaint-filters-title">All Complaints</h2>
          <p className="ccf-complaint-filters-description">
            Track and resolve customer complaints
          </p>
        </div>

        <div className="ccf-complaint-filters-controls">
          <div className="ccf-filter-group">
            <label className="ccf-filter-label">Status</label>
            <div className="ccf-filter-dropdown-container">
              <button
                className="ccf-filter-dropdown-btn"
                onClick={toggleStatusDropdown}
              >
                {getStatusDisplayText()}
                <svg
                  className={`ccf-dropdown-arrow ${
                    isStatusDropdownOpen ? "ccf-open" : ""
                  }`}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isStatusDropdownOpen && (
                <div className="ccf-dropdown-menu">
                  {statusOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`ccf-dropdown-item ${
                        statusFilter === option.value ? "ccf-selected" : ""
                      }`}
                      onClick={() => handleStatusSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="ccf-filter-group">
            <label className="ccf-filter-label">Category</label>
            <div className="ccf-filter-dropdown-container">
              <button
                className="ccf-filter-dropdown-btn"
                onClick={toggleCategoryDropdown}
              >
                {getCategoryDisplayText()}
                <svg
                  className={`ccf-dropdown-arrow ${
                    isCategoryDropdownOpen ? "ccf-open" : ""
                  }`}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isCategoryDropdownOpen && (
                <div className="ccf-dropdown-menu">
                  {categoryOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`ccf-dropdown-item ${
                        categoryFilter === option.value ? "ccf-selected" : ""
                      }`}
                      onClick={() => handleCategorySelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CC_ComplaintFilters;
