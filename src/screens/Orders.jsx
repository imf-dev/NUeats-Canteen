import React, { useState } from "react";
import OrdersModal from "../components/Orders/O_Modal";
import OrderCard from "../components/Orders/O_Cards";
import "../styles/Orders.css";
import ScrollUpButton from "../components/common/ScrollUpButton";
import { ordersData } from "../demodata/ordersDemoData";

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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
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
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={handleViewDetails}
            />
          ))}
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
