import React, { useState } from "react";
import ReactDOM from "react-dom";
import CustomModal from "../common/CustomModal";
import "./D_CurrentOrders.css";

const DashboardCurrentOrders = ({ currentOrders, onOrderStatusChange }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    orderId: null,
    newStatus: null,
    actionText: "",
  });

  const openConfirmationModal = (orderId, currentStatus, customerName) => {
    let title, message, newStatus, actionText;

    switch (currentStatus) {
      case "pending":
        title = "Start Preparing Order";
        message = `Are you sure you want to start preparing order #${orderId} for ${customerName}?`;
        newStatus = "preparing";
        actionText = "Start Preparing";
        break;
      case "preparing":
        title = "Mark Order as Ready";
        message = `Are you sure you want to mark order #${orderId} for ${customerName} as ready?`;
        newStatus = "ready";
        actionText = "Mark Ready";
        break;
      case "ready":
        title = "Complete Order";
        message = `Are you sure you want to complete order #${orderId} for ${customerName}?`;
        newStatus = "completed";
        actionText = "Complete Order";
        break;
      default:
        return;
    }

    setModalState({
      isOpen: true,
      type: "confirm",
      title,
      message,
      orderId,
      newStatus,
      actionText,
    });
  };

  const handleConfirmAction = () => {
    if (onOrderStatusChange && modalState.orderId && modalState.newStatus) {
      onOrderStatusChange(modalState.orderId, modalState.newStatus);
    }
    closeModal();
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: "confirm",
      title: "",
      message: "",
      orderId: null,
      newStatus: null,
      actionText: "",
    });
  };

  const getStatusButton = (status, orderId, customerName) => {
    const statusConfig = {
      preparing: { text: "Mark Ready", class: "dashboard_btn-primary" },
      ready: { text: "Complete Order", class: "dashboard_btn-success" },
      pending: { text: "Start Preparing", class: "dashboard_btn-warning" },
      completed: { text: "", class: "dashboard_status-completed" },
      cancelled: { text: "", class: "dashboard_status-cancelled" },
    };

    const config = statusConfig[status] || { text: "", class: "" };

    if (status === "completed" || status === "cancelled") {
      return (
        <span className={`dashboard_status-badge ${config.class}`}>
          {status === "completed" ? "✓ completed" : "✗ cancelled"}
        </span>
      );
    }

    return config.text ? (
      <button
        className={`dashboard_action-btn ${config.class}`}
        onClick={() => openConfirmationModal(orderId, status, customerName)}
      >
        {config.text}
      </button>
    ) : null;
  };

  return (
    <div className="dashboard_current-orders">
      <div className="dashboard_section-header">
        <h3>Current Orders</h3>
        <p>Manage and track orders in real-time</p>
      </div>
      <div className="dashboard_orders-list">
        {currentOrders.map((order, index) => (
          <div
            key={`${order.id}-${index}`}
            className={`dashboard_order-card ${order.status}`}
          >
            <div className="dashboard_order-info">
              <div className="dashboard_customer-details">
                <h4>{order.customerName}</h4>
                <span className="dashboard_order-id">Order #{order.id}</span>
              </div>
              <div className="dashboard_order-details">
                <span className="dashboard_order-items">
                  {order.items} ({order.itemCount} items)
                </span>
                <span className="dashboard_order-time">{order.time}</span>
                {order.hasSpecialInstructions && (
                  <span className="dashboard_special-instructions">
                    ⚠️ Special instructions
                  </span>
                )}
              </div>
            </div>
            <div className="dashboard_order-actions">
              <span className="dashboard_order-amount">{order.amount}</span>
              <div className="dashboard_status-section">
                {order.status === "preparing" && (
                  <span className="dashboard_status-indicator preparing">
                    🔵 preparing
                  </span>
                )}
                {order.status === "ready" && (
                  <span className="dashboard_status-indicator ready">
                    🟢 ready
                  </span>
                )}
                {order.status === "pending" && (
                  <span className="dashboard_status-indicator pending">
                    🟡 pending
                  </span>
                )}
                {getStatusButton(order.status, order.id, order.customerName)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Portal the modal to document.body */}
      {modalState.isOpen &&
        ReactDOM.createPortal(
          <CustomModal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            type={modalState.type}
            title={modalState.title}
            message={modalState.message}
            onConfirm={handleConfirmAction}
            confirmText={modalState.actionText}
          />,
          document.body
        )}
    </div>
  );
};

export default DashboardCurrentOrders;
