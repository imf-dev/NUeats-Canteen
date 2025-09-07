import React, { useState } from "react";
import "./CAC_SearchFilters.css";

const CAC_SearchFilters = ({
  onSearchChange,
  onFilterChange,
  searchValue,
  filterValue,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleFilterSelect = (status) => {
    onFilterChange(status);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getDisplayText = () => {
    switch (filterValue) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "suspended":
        return "Suspended";
      default:
        return "All Status";
    }
  };

  return (
    <div className="cac-search-filters-container">
      <div className="cac-search-bar-container">
        <div className="cac-search-input-wrapper">
          <svg
            className="cac-search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search customers by customer name, email or ID..."
            value={searchValue}
            onChange={handleSearchChange}
            className="cac-search-input"
          />
        </div>
      </div>

      <div className="cac-filter-dropdown-container">
        <button className="cac-filter-dropdown-btn" onClick={toggleDropdown}>
          {getDisplayText()}
          <svg
            className={`cac-dropdown-arrow ${isDropdownOpen ? "cac-open" : ""}`}
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

        {isDropdownOpen && (
          <div className="cac-dropdown-menu">
            <div
              className={`cac-dropdown-item ${
                filterValue === "all" ? "cac-selected" : ""
              }`}
              onClick={() => handleFilterSelect("all")}
            >
              All Status
            </div>
            <div
              className={`cac-dropdown-item ${
                filterValue === "active" ? "cac-selected" : ""
              }`}
              onClick={() => handleFilterSelect("active")}
            >
              Active
            </div>
            <div
              className={`cac-dropdown-item ${
                filterValue === "inactive" ? "cac-selected" : ""
              }`}
              onClick={() => handleFilterSelect("inactive")}
            >
              Inactive
            </div>
            <div
              className={`cac-dropdown-item ${
                filterValue === "suspended" ? "cac-selected" : ""
              }`}
              onClick={() => handleFilterSelect("suspended")}
            >
              Suspended
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CAC_SearchFilters;
