import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdEmail, MdPhone, MdClose } from "react-icons/md";
import CustomModal from "../../common/CustomModal"; // Import your existing CustomModal
import "./CAC_CustomerDetails.css";

const CAC_CustomerDetailsModal = ({
  customer,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'suspend' or 'unsuspend'

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const getCustomerInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: "active", className: "cac-customer-status-active" },
      inactive: { text: "inactive", className: "cac-customer-status-inactive" },
      suspended: {
        text: "suspended",
        className: "cac-customer-status-suspended",
      },
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span className={`cac-customer-status-badge ${config.className}`}>
        {config.text}
      </span>
    );
  };

  const handleToggleClick = () => {
    if (customer.status === "suspended") {
      setPendingAction("unsuspend");
    } else {
      setPendingAction("suspend");
    }
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (pendingAction && onStatusUpdate && customer) {
      const newStatus = pendingAction === "suspend" ? "suspended" : "active";
      onStatusUpdate(customer.customer_id, newStatus);
    }
    setShowConfirmModal(false);
    setPendingAction(null);
    onClose(); // Close the details modal after status update
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const getToggleButtonText = () => {
    return customer?.status === "suspended" ? "Unsuspend" : "Suspend";
  };

  const getToggleButtonClass = () => {
    return customer?.status === "suspended"
      ? "cac-toggle-button cac-unsuspend"
      : "cac-toggle-button cac-suspend";
  };

  const getConfirmModalProps = () => {
    const isSuspending = pendingAction === "suspend";
    return {
      type: "confirm",
      title: `${isSuspending ? "Suspend" : "Unsuspend"} Customer`,
      message: `Are you sure you want to ${
        isSuspending ? "suspend" : "unsuspend"
      } ${customer?.first_name} ${customer?.last_name}? ${
        isSuspending
          ? "This will restrict their account access."
          : "This will restore their account access."
      }`,
      confirmText: isSuspending ? "Suspend" : "Unsuspend",
    };
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !customer) return null;

  const modalContent = (
    <div className="cac-customer-modal-overlay" onClick={handleOverlayClick}>
      <div className="cac-customer-modal-content">
        <div className="cac-customer-modal-header">
          <div className="cac-customer-modal-title-section">
            <h2 className="cac-customer-modal-title">Customer Details</h2>
            <p className="cac-customer-modal-subtitle">
              Complete customer information and order history
            </p>
          </div>
          <button className="cac-customer-modal-close-button" onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        <div className="cac-customer-main-info">
          <div className="cac-customer-avatar-large">
            <span className="cac-customer-avatar-initials-large">
              {getCustomerInitials(customer.first_name, customer.last_name)}
            </span>
          </div>

          <div className="cac-customer-basic-info">
            <div className="cac-customer-name-status">
              <h3 className="cac-customer-full-name">
                {customer.first_name} {customer.last_name}
              </h3>
              {getStatusBadge(customer.status)}
            </div>

            <div className="cac-customer-contact-info">
              <div className="cac-customer-contact-item">
                <MdEmail className="cac-customer-contact-icon" />
                <span className="cac-customer-contact-text">
                  {customer.email}
                </span>
              </div>
              <div className="cac-customer-contact-item">
                <MdPhone className="cac-customer-contact-icon" />
                <span className="cac-customer-contact-text">
                  {customer.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="cac-customer-details-grid">
          <div className="cac-customer-details-section">
            <h4 className="cac-customer-section-title">Order Summary</h4>
            <div className="cac-customer-section-content">
              <div className="cac-customer-info-item">
                <span className="cac-customer-info-label">Total Orders:</span>
                <span className="cac-customer-info-value">
                  {customer.order_summary.total_orders}
                </span>
              </div>
              <div className="cac-customer-info-item">
                <span className="cac-customer-info-label">Last Order:</span>
                <span className="cac-customer-info-value">
                  {formatDate(customer.order_summary.last_order_date)}
                </span>
              </div>
            </div>
          </div>

          <div className="cac-customer-details-section">
            <h4 className="cac-customer-section-title">Account Info</h4>
            <div className="cac-customer-section-content">
              <div className="cac-customer-info-item">
                <span className="cac-customer-info-label">Joined:</span>
                <span className="cac-customer-info-value">
                  {formatDate(customer.account_info.date_joined)}
                </span>
              </div>
              <div className="cac-customer-info-item">
                <span className="cac-customer-info-label">Customer ID:</span>
                <span className="cac-customer-info-value">
                  {customer.customer_id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Button Section */}
        <div className="cac-customer-actions">
          <button
            className={getToggleButtonClass()}
            onClick={handleToggleClick}
          >
            {getToggleButtonText()}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <CustomModal
        isOpen={showConfirmModal}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        {...getConfirmModalProps()}
      />
    </div>
  );

  // Render modal using portal to document.body
  return createPortal(modalContent, document.body);
};

export default CAC_CustomerDetailsModal;
