import React, { useState } from "react";
import { FaStar, FaSearch, FaChevronDown } from "react-icons/fa";
import { ordersData } from "../../../demodata/ordersDemoData";
import "./CA_CustomerFeedback.css";

const CA_CustomerFeedback = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter feedback based on search and rating
  const getFilteredFeedback = () => {
    let feedback = ordersData.filter((order) => order.feedback && order.rating);

    // Filter by search term
    if (searchTerm) {
      feedback = feedback.filter(
        (order) =>
          order.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rating
    if (selectedRating !== "all") {
      feedback = feedback.filter(
        (order) => order.rating === parseInt(selectedRating)
      );
    }

    return feedback;
  };

  const filteredFeedback = getFilteredFeedback();

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`ca-customer-feedback-star ${
          index < rating ? "filled" : "empty"
        }`}
      />
    ));
  };

  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ];

  return (
    <div className="ca-customer-feedback-section">
      <div className="ca-customer-feedback-section-header">
        <h3>All Customer Feedback</h3>
        <p>View customer ratings and feedback from pickup orders</p>
      </div>

      <div className="ca-customer-feedback-controls">
        <div className="ca-customer-feedback-search-container">
          <FaSearch className="ca-customer-feedback-search-icon" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ca-customer-feedback-search-input"
          />
        </div>

        <div className="ca-customer-feedback-filter-dropdown">
          <button
            className="ca-customer-feedback-dropdown-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {
              ratingOptions.find((option) => option.value === selectedRating)
                ?.label
            }
            <FaChevronDown
              className={`ca-customer-feedback-dropdown-arrow ${
                isDropdownOpen ? "open" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="ca-customer-feedback-dropdown-menu">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  className={`ca-customer-feedback-dropdown-item ${
                    selectedRating === option.value ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedRating(option.value);
                    setIsDropdownOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ca-customer-feedback-list">
        {filteredFeedback.length === 0 ? (
          <div className="ca-customer-feedback-no-feedback">
            <p>No feedback found matching your criteria.</p>
          </div>
        ) : (
          filteredFeedback.map((order, index) => (
            <div
              key={order.id}
              className="ca-customer-feedback-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="ca-customer-feedback-header">
                <div className="ca-customer-feedback-stars-container">
                  {renderStars(order.rating)}
                  <span className="ca-customer-feedback-rating-text">
                    {order.rating}/5
                  </span>
                </div>
                <div className="ca-customer-feedback-meta">
                  <span className="ca-customer-feedback-customer-name">
                    Customer: {order.customer}
                  </span>
                  <span className="ca-customer-feedback-date">
                    Date: {order.date}
                  </span>
                </div>
              </div>
              <div className="ca-customer-feedback-text">{order.feedback}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CA_CustomerFeedback;
