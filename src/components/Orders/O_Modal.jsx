import React from "react";
import "./O_Modal.css";

const OrdersModal = ({ isOpen, onClose, order, onOrderStatusChange }) => {
  if (!isOpen || !order) return null;

  const handleStatusChange = (newStatus) => {
    if (onOrderStatusChange) {
      onOrderStatusChange(order.id, newStatus);
    }
    onClose();
  };

  const getStatusConfig = (status) => {
    const configs = {
      preparing: {
        label: "preparing",
        class: "preparing",
      },
      ready: {
        label: "ready",
        class: "ready",
      },
      pending: {
        label: "pending",
        class: "pending",
      },
      completed: {
        label: "completed",
        class: "completed",
      },
      cancelled: {
        label: "cancelled",
        class: "cancelled",
      },
    };
    return configs[status] || { label: status, class: status };
  };

  const getTimelineInfo = (status, order) => {
    switch (status) {
      case "cancelled":
        return {
          title: "Order Cancelled",
          titleClass: "ordermodal_timeline-cancelled",
          leftLabel: "Order Placed",
          leftTime: order.orderedTime,
          leftIcon: "🕐",
          rightLabel: "Cancellation Time",
          rightTime: order.cancelledTime,
          rightIcon: "✗",
          rightClass: "cancelled-time",
        };
      case "completed":
        return {
          title: "Order Completed Successfully",
          titleClass: "ordermodal_timeline-completed",
          leftLabel: "Order Placed",
          leftTime: order.orderedTime,
          leftIcon: "🕐",
          rightLabel: "Completed Time",
          rightTime: order.completedTime,
          rightIcon: "✓",
          rightClass: "completed-time",
        };
      case "ready":
        return {
          title: "",
          titleClass: "",
          leftLabel: "Order Placed",
          leftTime: order.orderedTime,
          leftIcon: "🕐",
          rightLabel: "Estimated Ready Time",
          rightTime: order.estimatedReadyTime || "N/A",
          rightIcon: "🕐",
          rightClass: "estimated-time",
        };
      default:
        return {
          title: "",
          titleClass: "",
          leftLabel: "Order Placed",
          leftTime: order.orderedTime,
          leftIcon: "🕐",
          rightLabel: "Estimated Ready Time",
          rightTime: order.estimatedReadyTime || "N/A",
          rightIcon: "🕐",
          rightClass: "estimated-time",
        };
    }
  };

  const getQuickActions = (status) => {
    switch (status) {
      case "preparing":
        return (
          <>
            <button 
              className="ordermodal_modal-btn btn-primary"
              onClick={() => handleStatusChange("ready")}
            >
              Mark Ready
            </button>
            <button 
              className="ordermodal_modal-btn btn-danger"
              onClick={() => handleStatusChange("cancelled")}
            >
              Cancel Order
            </button>
          </>
        );
      case "ready":
        return (
          <>
            <button 
              className="ordermodal_modal-btn btn-primary"
              onClick={() => handleStatusChange("completed")}
            >
              Complete Order
            </button>
            <button 
              className="ordermodal_modal-btn btn-danger"
              onClick={() => handleStatusChange("cancelled")}
            >
              Cancel Order
            </button>
          </>
        );
      case "pending":
        return (
          <>
            <button 
              className="ordermodal_modal-btn btn-primary"
              onClick={() => handleStatusChange("preparing")}
            >
              Start Preparing
            </button>
            <button 
              className="ordermodal_modal-btn btn-danger"
              onClick={() => handleStatusChange("cancelled")}
            >
              Cancel Order
            </button>
          </>
        );
      case "completed":
        return (
          <p className="ordermodal_no-actions">
            No actions available for completed orders
          </p>
        );
      case "cancelled":
        return (
          <p className="ordermodal_no-actions">
            No actions available for cancelled orders
          </p>
        );
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const timelineInfo = getTimelineInfo(order.status, order);

  // Calculate order total (removed tax calculation)
  const total = order.items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("₱ ", ""));
    return sum + price;
  }, 0);

  return (
    <div className="ordermodal_modal-overlay" onClick={onClose}>
      <div
        className="ordermodal_modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="ordermodal_modal-header">
          <div className="ordermodal_modal-title-section">
            <h2>Order Details - #{order.id}</h2>
            <span
              className={`ordermodal_modal-status-badge ${statusConfig.class}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <button className="ordermodal_modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ordermodal_modal-subtitle">
          Complete order information and customer details
        </div>

        <div className="ordermodal_modal-content">
          {/* Customer Information */}
          <section className="ordermodal_modal-section">
            <div className="ordermodal_section-header">
              <span className="ordermodal_section-icon">👤</span>
              <h3>Customer Information</h3>
            </div>

            <div className="ordermodal_customer-details">
              <div className="ordermodal_detail-row">
                <div className="ordermodal_detail-group">
                  <label>Name</label>
                  <p>{order.customer}</p>
                </div>
                <div className="ordermodal_detail-group">
                  <label>Phone</label>
                  <p>{order.phone}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Order Timeline */}
          <section className="ordermodal_modal-section">
            <div className="ordermodal_section-header">
              <span className="ordermodal_section-icon">📅</span>
              <h3>Order Timeline</h3>
              {timelineInfo.title && (
                <span
                  className={`ordermodal_timeline-status ${timelineInfo.titleClass}`}
                >
                  {timelineInfo.title}
                </span>
              )}
            </div>

            <div className="ordermodal_timeline-details">
              <div className="ordermodal_timeline-item">
                <label>{timelineInfo.leftLabel}</label>
                <div className="ordermodal_timeline-time">
                  <span className="ordermodal_time-icon">
                    {timelineInfo.leftIcon}
                  </span>
                  <span>{timelineInfo.leftTime}</span>
                </div>
              </div>
              <div className="ordermodal_timeline-item">
                <label>{timelineInfo.rightLabel}</label>
                <div
                  className={`ordermodal_timeline-time ${timelineInfo.rightClass}`}
                >
                  <span className="ordermodal_time-icon">
                    {timelineInfo.rightIcon}
                  </span>
                  <span>{timelineInfo.rightTime}</span>
                </div>
              </div>
            </div>

            {/* Show cancellation reason for cancelled orders */}
            {order.status === "cancelled" && order.cancelReason && (
              <div className="ordermodal_cancellation-reason">
                <label>Cancellation Reason</label>
                <p>{order.cancelReason}</p>
              </div>
            )}
          </section>

          {/* Ordered Items */}
          <section className="ordermodal_modal-section">
            <div className="ordermodal_section-header">
              <span className="ordermodal_section-icon">🛒</span>
              <h3>Ordered Items</h3>
            </div>

            <div className="ordermodal_items-list">
              {order.items.map((item, index) => (
                <div key={index} className="ordermodal_item-card">
                  <div className="ordermodal_item-info">
                    <span className="ordermodal_item-name">{item.name}</span>
                    <span className="ordermodal_item-unit-price">
                      {item.price} each
                    </span>
                    {/* Show special instructions if they exist */}
                    {item.instructions && (
                      <div className="ordermodal_special-instructions">
                        <span className="ordermodal_instructions-label">
                          Special Instructions:
                        </span>
                        <span className="ordermodal_instructions-text">
                          {item.instructions}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ordermodal_item-price">{item.price}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Order Summary */}
          <section className="ordermodal_modal-section">
            <div className="ordermodal_section-header">
              <span className="ordermodal_section-icon">💰</span>
              <h3>Order Summary</h3>
            </div>

            <div className="ordermodal_summary-details">
              <div className="ordermodal_summary-row ordermodal_total-row">
                <span>TOTAL</span>
                <span>₱{total.toFixed(2)}</span>
              </div>

              {order.status === "cancelled" && (
                <div className="ordermodal_payment-notice">
                  ⚠️ This order was cancelled - no payment was processed
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="ordermodal_modal-section">
            <div className="ordermodal_section-header">
              <h3>Quick Actions</h3>
            </div>

            <div className="ordermodal_quick-actions">
              {getQuickActions(order.status)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;
