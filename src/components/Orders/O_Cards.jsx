import React from "react";
import "./O_Cards.css";

const OrderCard = ({ order, onViewDetails }) => {
  const getStatusConfig = (status) => {
    const configs = {
      preparing: {
        label: "preparing",
        class: "orders_preparing",
        bgClass: "orders_bg_preparing",
      },
      ready: {
        label: "ready",
        class: "orders_ready",
        bgClass: "orders_bg_ready",
      },
      pending: {
        label: "pending",
        class: "orders_pending",
        bgClass: "orders_bg_pending",
      },
      completed: {
        label: "completed",
        class: "orders_completed",
        bgClass: "orders_bg_completed",
      },
      cancelled: {
        label: "cancelled",
        class: "orders_cancelled",
        bgClass: "orders_bg_cancelled",
      },
    };
    return configs[status] || { label: status, class: status, bgClass: "" };
  };

  const getActionButtons = (status, order) => {
    switch (status) {
      case "preparing":
        return (
          <>
            <button className="orders_btn orders_btn_primary">
              Mark Ready
            </button>
            <button
              className="orders_btn orders_btn_secondary"
              onClick={() => onViewDetails(order)}
            >
              👁 View Details
            </button>
            <button className="orders_btn orders_btn_danger">Cancel</button>
          </>
        );
      case "ready":
        return (
          <>
            <button className="orders_btn orders_btn_primary">
              Complete Order
            </button>
            <button
              className="orders_btn orders_btn_secondary"
              onClick={() => onViewDetails(order)}
            >
              👁 View Details
            </button>
            <button className="orders_btn orders_btn_danger">Cancel</button>
          </>
        );
      case "pending":
        return (
          <>
            <button className="orders_btn orders_btn_primary">
              Start Preparing
            </button>
            <button
              className="orders_btn orders_btn_secondary"
              onClick={() => onViewDetails(order)}
            >
              👁 View Details
            </button>
            <button className="orders_btn orders_btn_danger">Cancel</button>
          </>
        );
      case "completed":
      case "cancelled":
        return (
          <button
            className="orders_btn orders_btn_secondary"
            onClick={() => onViewDetails(order)}
          >
            👁 View Details
          </button>
        );
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className={`orders_card ${statusConfig.bgClass}`}>
      {/* Header */}
      <div className="orders_header_card">
        <div className="orders_title">
          <h3>Order #{order.id}</h3>
          <span className={`orders_status_badge ${statusConfig.class}`}>
            {statusConfig.label}
          </span>
        </div>
        <div className="orders_meta">
          <span
            className={
              order.status === "cancelled" ? "orders_cancelled_price" : ""
            }
          >
            {order.total}
          </span>
          <p className="orders_ordered_time">Ordered: {order.orderedTime}</p>
        </div>
      </div>

      <hr className="orders_divider" />

      {/* Customer Info */}
      <div className="orders_customer_info">
        <p>
          Customer: {order.customer} • Phone: {order.phone}
        </p>
        {order.completedTime && (
          <p className="orders_completion_info">
            ✓ Completed at {order.completedTime}
          </p>
        )}
        {order.cancelledTime && (
          <p className="orders_cancellation_info">
            ✗ Cancelled at {order.cancelledTime}
          </p>
        )}
        {order.cancelReason && (
          <p className="orders_cancel_reason">Reason: {order.cancelReason}</p>
        )}
      </div>

      <hr className="orders_divider" />

      {/* Items */}
      <div className="orders_items">
        <h4>Order Items:</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name}
              <span className="orders_item_price">{item.price}</span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="orders_divider" />

      {/* Actions */}
      <div className="orders_actions">
        {getActionButtons(order.status, order)}
      </div>
    </div>
  );
};

export default OrderCard;
