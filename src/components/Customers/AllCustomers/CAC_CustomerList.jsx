import React, { useState } from "react";
import CAC_CustomerDetailsModal from "./CAC_CustomerDetails";
import "./CAC_CustomerList.css";

const CAC_CustomerList = ({
  customers,
  onCustomerClick,
  onCustomerStatusUpdate,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: "active", className: "cac-status-active" },
      inactive: { text: "inactive", className: "cac-status-inactive" },
      suspended: { text: "suspended", className: "cac-status-suspended" },
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span className={`cac-status-badge ${config.className}`}>
        {config.text}
      </span>
    );
  };

  const getCustomerInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const handleViewClick = (e, customer) => {
    e.stopPropagation(); // Prevent card click from firing
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleStatusUpdate = (customerId, newStatus) => {
    // Call the parent component's callback to update the customer status
    if (onCustomerStatusUpdate) {
      onCustomerStatusUpdate(customerId, newStatus);
    }
    // Close the modal after status update
    handleModalClose();
  };

  if (!customers || customers.length === 0) {
    return (
      <div className="cac-no-customers">
        <p>No customers found</p>
      </div>
    );
  }

  return (
    <>
      <div className="cac-customer-list-container">
        {customers.map((customer) => (
          <div
            key={customer.customer_id}
            className={`cac-customer-card cac-${customer.status}`}
            onClick={() => onCustomerClick && onCustomerClick(customer)}
          >
            <div className="cac-customer-info">
              <div className="cac-customer-avatar">
                {customer.avatar_url ? (
                  <img
                    src={customer.avatar_url}
                    alt={`${customer.first_name} ${customer.last_name}`}
                    className="cac-avatar-image"
                  />
                ) : (
                  <span className="cac-avatar-initials">
                    {getCustomerInitials(customer.first_name, customer.last_name)}
                  </span>
                )}
              </div>

              <div className="cac-customer-details">
                <div className="cac-customer-name">
                  {customer.first_name} {customer.last_name}
                </div>

                <div className="cac-customer-contact">
                  <div className="cac-contact-item">
                    <svg
                      className="cac-contact-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="22,6 12,13 2,6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{customer.email}</span>
                  </div>

                  <div className="cac-contact-item">
                    <svg
                      className="cac-contact-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M22 16.92V19.92C22 20.51 21.76 21.07 21.33 21.48C20.9 21.89 20.33 22.13 19.75 22.12C16.48 21.82 13.35 20.69 10.65 18.85C8.19 17.18 6.18 15.17 4.51 12.71C2.68 10.01 1.55 6.87 1.25 3.59C1.24 3.01 1.47 2.44 1.88 2.01C2.29 1.58 2.84 1.34 3.43 1.34H6.43C7.29 1.33 8.02 1.92 8.11 2.77C8.28 4.48 8.68 6.15 9.29 7.74C9.53 8.38 9.38 9.1 8.9 9.58L7.68 10.8C9.1 13.26 11.25 15.41 13.71 16.83L14.93 15.61C15.41 15.13 16.13 14.98 16.77 15.22C18.36 15.83 20.03 16.23 21.74 16.4C22.6 16.49 23.19 17.23 23.18 18.1L22 16.92Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cac-customer-stats">
              <div className="cac-orders-info">
                <div className="cac-order-count">
                  {customer.order_summary.total_orders} orders
                </div>
                <div className="cac-last-order">
                  Last order:{" "}
                  {formatDate(customer.order_summary.last_order_date)}
                </div>
              </div>

              <div className="cac-customer-status">
                {getStatusBadge(customer.status)}
              </div>

              <button
                className="cac-view-button"
                onClick={(e) => handleViewClick(e, customer)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <CAC_CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
};

export default CAC_CustomerList;
