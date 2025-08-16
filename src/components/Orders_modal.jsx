import React from "react";
import "../styles/Orders_modal.css";

const OrdersModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

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
          titleClass: "timeline-cancelled",
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
          titleClass: "timeline-completed",
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
          rightTime: "1:15 PM",
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
          rightTime: "1:15 PM",
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
            <button className="modal-btn btn-primary">Mark Ready</button>
            <button className="modal-btn btn-danger">Cancel Order</button>
          </>
        );
      case "ready":
        return (
          <>
            <button className="modal-btn btn-primary">Complete Order</button>
            <button className="modal-btn btn-danger">Cancel Order</button>
          </>
        );
      case "pending":
        return (
          <>
            <button className="modal-btn btn-primary">Start Preparing</button>
            <button className="modal-btn btn-danger">Cancel Order</button>
          </>
        );
      case "completed":
        return (
          <p className="no-actions">
            No actions available for completed orders
          </p>
        );
      case "cancelled":
        return (
          <p className="no-actions">
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2>Order Details - #{order.id}</h2>
            <span className={`modal-status-badge ${statusConfig.class}`}>
              {statusConfig.label}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-subtitle">
          Complete order information and customer details
        </div>

        <div className="modal-content">
          {/* Customer Information */}
          <section className="modal-section">
            <div className="section-header">
              <span className="section-icon">👤</span>
              <h3>Customer Information</h3>
            </div>

            <div className="customer-details">
              <div className="detail-row">
                <div className="detail-group">
                  <label>Name</label>
                  <p>{order.customer}</p>
                </div>
                <div className="detail-group">
                  <label>Phone</label>
                  <p>{order.phone}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Order Timeline */}
          <section className="modal-section">
            <div className="section-header">
              <span className="section-icon">📅</span>
              <h3>Order Timeline</h3>
              {timelineInfo.title && (
                <span className={`timeline-status ${timelineInfo.titleClass}`}>
                  {timelineInfo.title}
                </span>
              )}
            </div>

            <div className="timeline-details">
              <div className="timeline-item">
                <label>{timelineInfo.leftLabel}</label>
                <div className="timeline-time">
                  <span className="time-icon">{timelineInfo.leftIcon}</span>
                  <span>{timelineInfo.leftTime}</span>
                </div>
              </div>
              <div className="timeline-item">
                <label>{timelineInfo.rightLabel}</label>
                <div className={`timeline-time ${timelineInfo.rightClass}`}>
                  <span className="time-icon">{timelineInfo.rightIcon}</span>
                  <span>{timelineInfo.rightTime}</span>
                </div>
              </div>
            </div>

            {/* Show cancellation reason for cancelled orders */}
            {order.status === "cancelled" && order.cancelReason && (
              <div className="cancellation-reason">
                <label>Cancellation Reason</label>
                <p>{order.cancelReason}</p>
              </div>
            )}
          </section>

          {/* Ordered Items */}
          <section className="modal-section">
            <div className="section-header">
              <span className="section-icon">🛒</span>
              <h3>Ordered Items</h3>
            </div>

            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="item-card">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-unit-price">{item.price} each</span>
                    {/* Show special instructions if they exist */}
                    {item.instructions && (
                      <div className="special-instructions">
                        <span className="instructions-label">
                          Special Instructions:
                        </span>
                        <span className="instructions-text">
                          {item.instructions}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="item-price">{item.price}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Order Summary */}
          <section className="modal-section">
            <div className="section-header">
              <span className="section-icon">💰</span>
              <h3>Order Summary</h3>
            </div>

            <div className="summary-details">
              <div className="summary-row total-row">
                <span>TOTAL</span>
                <span>₱{total.toFixed(2)}</span>
              </div>

              {order.status === "cancelled" && (
                <div className="payment-notice">
                  ⚠️ This order was cancelled - no payment was processed
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="modal-section">
            <div className="section-header">
              <h3>Quick Actions</h3>
            </div>

            <div className="quick-actions">{getQuickActions(order.status)}</div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;
