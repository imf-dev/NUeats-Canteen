import React, { useState } from "react";
import { BiUser } from "react-icons/bi";
import { MdOutlineAccessTime } from "react-icons/md";
import CC_ResponseModal from "./CC_ResponseModal";
import "./CC_ComplaintCards.css";

const CC_ComplaintCards = ({ complaints, customers, onResponseSubmit, onOpenComplaint }) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to get customer info
  const getCustomerInfo = (customerId) => {
    return customers.find((customer) => customer.customer_id === customerId);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle respond button click
  const handleRespondClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  // Handle response submission
  const handleResponseSubmit = async (responseData) => {
    try {
      // Call the parent component's response submit handler
      if (onResponseSubmit) {
        await onResponseSubmit(responseData);
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      throw error; // Re-throw to let modal handle the error state
    }
  };

  if (complaints.length === 0) {
    return (
      <div className="cc-no-complaints">
        <p>No complaints found matching your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="cc-complaint-cards-container">
        {complaints.map((complaint, index) => {
          const customer = getCustomerInfo(complaint.customer_id);
          const hasResponse =
            complaint.admin_responses && complaint.admin_responses.length > 0;

          return (
            <div
              key={complaint.complaint_id}
              className="cc-complaint-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="cc-complaint-header">
                <div className="cc-complaint-user-info">
                  <div className="cc-user-avatar">
                    <BiUser className="cc-user-icon" />
                  </div>
                  <div className="cc-complaint-main-info">
                    <h3 className="cc-complaint-title">{complaint.title}</h3>
                    <div className="cc-complaint-meta">
                      <span className="cc-customer-name">
                        {customer
                          ? `${customer.first_name} ${customer.last_name}`
                          : "Unknown Customer"}
                      </span>
                      <span className="cc-complaint-id">
                        • {complaint.complaint_id}
                      </span>
                      <span className="cc-complaint-date">
                        • {formatDate(complaint.created_at)}
                      </span>
                    </div>
                    <p className="cc-complaint-description">
                      {complaint.description}
                    </p>
                  </div>
                </div>
                <div className={`cc-status-badge cc-status-${complaint.status}`}>
                  {complaint.status}
                </div>
              </div>

              {hasResponse && (
                <div className="cc-admin-response">
                  <div className="cc-response-header">
                    <BiUser className="cc-admin-icon" />
                    <span className="cc-response-text">
                      {complaint.admin_responses[0].response_text}
                    </span>
                  </div>
                  <div className="cc-response-meta">
                    <span className="cc-admin-name">
                      {complaint.admin_responses[0].admin_name}
                    </span>
                    <span className="cc-response-time">
                      • {formatDate(complaint.admin_responses[0].response_date)}{" "}
                      at{" "}
                      {formatTime(complaint.admin_responses[0].response_date)}
                    </span>
                  </div>
                </div>
              )}

              {complaint.status === "Resolved" && complaint.resolution && (
                <div className="cc-resolution-box">
                  <strong>Resolution:</strong> {complaint.resolution}
                </div>
              )}

              <div className="cc-complaint-footer">
                <div className="cc-complaint-category">
                  <span>Category: {complaint.category}</span>
                </div>
                {complaint.status === "Pending" && (
                  <button
                    className="cc-respond-button"
                    onClick={() => onOpenComplaint && onOpenComplaint(complaint.complaint_id)}
                  >
                    <MdOutlineAccessTime className="cc-respond-icon" />
                    Open
                  </button>
                )}
                {complaint.status === "Open" && (
                  <button
                    className="cc-respond-button"
                    onClick={() => handleRespondClick(complaint)}
                  >
                    <MdOutlineAccessTime className="cc-respond-icon" />
                    Respond
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Response Modal */}
      <CC_ResponseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        complaint={selectedComplaint}
        customer={
          selectedComplaint
            ? getCustomerInfo(selectedComplaint.customer_id)
            : null
        }
        onSubmitResponse={handleResponseSubmit}
      />
    </>
  );
};

export default CC_ComplaintCards;
