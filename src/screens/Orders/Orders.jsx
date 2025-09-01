import React, { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import OrdersModal from "./Orders_modal";
import "./Orders.css";
import ScrollUpButton from "../../components/common/ScrollUpButton";

import { FiSearch } from "react-icons/fi";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isFiltering, setIsFiltering] = useState(false);

  const statusOptions = [
    "All Status",
    "Pending",
    "Preparing",
    "Ready",
    "Completed",
    "Cancelled",
  ];

  // Demo data - replace with actual API calls later
  const ordersData = [
    {
      id: "001",
      status: "preparing",
      customer: "Johnny Bravo",
      phone: "(+63)992-666-9999",
      total: "₱ 32.98",
      orderedTime: "12:30 PM",
      items: [
        {
          name: "Margherita Pizza",
          price: "₱ 16.99",
          instructions: "Extra basil, thin crust",
        },
        { name: "Coca Cola", price: "₱ 7.00" },
        { name: "Tiramisu", price: "₱ 8.99" },
      ],
    },
    {
      id: "002",
      status: "ready",
      customer: "Maria Santos",
      phone: "(+63)917-123-4567",
      total: "₱ 45.50",
      orderedTime: "12:30 PM",
      items: [
        {
          name: "Pepperoni Pizza",
          price: "₱ 18.99",
          instructions: "Extra cheese, well done",
        },
        { name: "Orange Juice", price: "₱ 8.00" },
        { name: "Chocolate Cake", price: "₱ 18.51" },
      ],
    },
    {
      id: "003",
      status: "pending",
      customer: "Carlos Rodriguez",
      phone: "(+63)905-987-6543",
      total: "₱ 28.75",
      orderedTime: "12:30 PM",
      items: [
        {
          name: "Hawaiian Pizza",
          price: "₱ 15.99",
          instructions: "Light pineapple, extra ham",
        },
        { name: "Iced Tea", price: "₱ 5.00" },
        { name: "Garlic Bread", price: "₱ 7.76" },
      ],
    },
    {
      id: "004",
      status: "completed",
      customer: "Ana Dela Cruz",
      phone: "(+63)928-555-0123",
      total: "₱ 52.25",
      orderedTime: "11:45 AM",
      completedTime: "12:20 PM",
      items: [
        {
          name: "Supreme Pizza",
          price: "₱ 22.99",
          instructions: "No onions, extra olives",
        },
        { name: "Sprite", price: "₱ 7.00" },
        { name: "Cheesecake", price: "₱ 22.26" },
      ],
    },
    {
      id: "005",
      status: "cancelled",
      customer: "Miguel Torres",
      phone: "(+63)939-777-8888",
      total: "₱ 41.20",
      orderedTime: "11:45 AM",
      cancelledTime: "12:45 PM",
      cancelReason: "Customer requested cancellation - dietary restrictions",
      items: [
        {
          name: "Meat Lovers Pizza",
          price: "₱ 24.99",
          instructions: "Extra spicy, double meat",
        },
        { name: "Coke", price: "₱ 7.00" },
        { name: "Brownies", price: "₱ 9.21" },
      ],
    },
  ];

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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
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
              onClick={() => handleViewDetails(order)}
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
              onClick={() => handleViewDetails(order)}
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
              onClick={() => handleViewDetails(order)}
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
            onClick={() => handleViewDetails(order)}
          >
            👁 View Details
          </button>
        );
      default:
        return null;
    }
  };

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm);
    const matchesStatus =
      statusFilter === "All Status" ||
      order.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="orders_layout">
      <Sidebar />

      <main className="orders_main">
        <div className="orders_header">
          <h1>Orders Management</h1>
          <p>Track and manage all orders</p>
        </div>

        {/* Search + Filter */}
        <div className="orders_controls">
          <div className="orders_search_container">
            <input
              type="text"
              placeholder="Search orders by customer name or order ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsFiltering(true);
                setTimeout(() => setIsFiltering(false), 100);
              }}
              className="orders_search_input"
            />
            <span className="orders_search_icon">
              <FiSearch />
            </span>
          </div>

          <div className="orders_status_filter">
            <button
              className="orders_status_dropdown_btn"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            >
              {statusFilter}
              <span className="dropdown-arrow">▼</span>
            </button>
            {isStatusDropdownOpen && (
              <div className="orders_status_dropdown">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    className={`orders_dropdown_item ${
                      statusFilter === status ? "orders_active" : ""
                    }`}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsStatusDropdownOpen(false);
                      setIsFiltering(true);
                      setTimeout(() => setIsFiltering(false), 100);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className={`orders_list ${isFiltering ? "orders_filtering" : ""}`}>
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <div
                key={order.id}
                className={`orders_card ${statusConfig.bgClass}`}
              >
                {/* Header */}
                <div className="orders_header_card">
                  <div className="orders_title">
                    <h3>Order #{order.id}</h3>
                    <span
                      className={`orders_status_badge ${statusConfig.class}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="orders_meta">
                    <span
                      className={
                        order.status === "cancelled"
                          ? "orders_cancelled_price"
                          : ""
                      }
                    >
                      {order.total}
                    </span>
                    <p className="orders_ordered_time">
                      Ordered: {order.orderedTime}
                    </p>
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
                    <p className="orders_cancel_reason">
                      Reason: {order.cancelReason}
                    </p>
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
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="orders_no_orders">
            <p>No orders found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Modal */}
      <OrdersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
      <ScrollUpButton />
    </div>
  );
};

export default Orders;
