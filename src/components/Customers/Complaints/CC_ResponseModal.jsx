import React, { useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import { MdSend } from "react-icons/md";
import "./CC_ResponseModal.css";

const CC_ResponseModal = ({
  isOpen,
  onClose,
  complaint,
  customer,
  onSubmitResponse,
}) => {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!response.trim()) return;

    setIsSubmitting(true);

    try {
      await onSubmitResponse({
        complaintId: complaint.complaint_id,
        responseText: response.trim(),
      });

      // Reset form and close modal
      setResponse("");
      onClose();
    } catch (error) {
      console.error("Error submitting response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setResponse("");
      onClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  // Modal content
  const modalContent = (
    <div className="crm-modal-overlay" onClick={handleClose}>
      <div className="crm-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="crm-modal-header">
          <h2 className="crm-modal-title">Respond to Complaint</h2>
          <button
            className="crm-close-button"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <IoClose className="crm-close-icon" />
          </button>
        </div>

        <div className="crm-modal-content">
          {/* Complaint Summary */}
          <div className="crm-complaint-summary">
            <div className="crm-complaint-header">
              <div className="crm-user-avatar">
                <BiUser className="crm-user-icon" />
              </div>
              <div className="crm-complaint-info">
                <h3 className="crm-complaint-title">{complaint?.title}</h3>
                <div className="crm-complaint-meta">
                  <span className="crm-customer-name">
                    {customer
                      ? `${customer.first_name} ${customer.last_name}`
                      : "Unknown Customer"}
                  </span>
                  <span className="crm-complaint-date">
                    • {complaint ? formatDate(complaint.created_date) : ""}
                  </span>
                </div>
              </div>
              <div
                className={`crm-status-badge crm-status-${complaint?.status}`}
              >
                {complaint?.status}
              </div>
            </div>

            <div className="crm-complaint-description">
              <p>{complaint?.description}</p>
            </div>

            <div className="crm-complaint-category">
              Category:{" "}
              <span className="crm-category-text">{complaint?.category}</span>
            </div>
          </div>

          {/* Response Form */}
          <form onSubmit={handleSubmit} className="crm-response-form">
            <div className="crm-form-group">
              <label htmlFor="response" className="crm-form-label">
                Your Response
              </label>
              <textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response to this complaint..."
                className="crm-response-textarea"
                rows="6"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="crm-form-actions">
              <button
                type="button"
                onClick={handleClose}
                className="crm-cancel-button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="crm-submit-button"
                disabled={!response.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="crm-loading-spinner"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <MdSend className="crm-send-icon" />
                    Send Response
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render modal using portal to document.body
  return createPortal(modalContent, document.body);
};

export default CC_ResponseModal;
