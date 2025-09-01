import React from "react";
import {
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import "../styles/CustomModal.css";

const CustomModal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmText = "OK",
}) => {
  if (!isOpen) return null;

  const getModalIcon = () => {
    switch (type) {
      case "success":
        return (
          <FaCheck className="custommodal_modal-icon custommodal_success" />
        );
      case "warning":
        return (
          <FaExclamationTriangle className="custommodal_modal-icon custommodal_warning" />
        );
      case "error":
        return (
          <FaExclamationTriangle className="custommodal_modal-icon custommodal_error" />
        );
      case "confirm":
        return (
          <FaInfoCircle className="custommodal_modal-icon custommodal_info" />
        );
      default:
        return (
          <FaInfoCircle className="custommodal_modal-icon custommodal_info" />
        );
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={`custommodal_custom-modal-overlay ${isOpen ? "open" : ""}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`custommodal_custom-modal-content ${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custommodal_modal-header">
          {getModalIcon()}
          <h3>{title}</h3>
          <button className="custommodal_modal-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        <div className="custommodal_modal-body">
          <p>{message}</p>
        </div>
        <div className="custommodal_modal-footer">
          {type === "confirm" || type === "error" ? (
            <>
              <button
                className="custommodal_modal-btn custommodal_secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="custommodal_modal-btn custommodal_primary"
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              className="custommodal_modal-btn custommodal_primary"
              onClick={handleClose}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
