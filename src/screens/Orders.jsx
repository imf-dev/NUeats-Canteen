import React, { useEffect, useMemo, useState } from "react";
import OrdersModal from "../components/Orders/O_Modal";
import OrderCard from "../components/Orders/O_Cards";
import "../styles/Orders.css";
import ScrollUpButton from "../components/common/ScrollUpButton";
import { supabase } from "../lib/supabaseClient";
import { triggerAutoReadyOrders } from "../lib/autoReadyService";

import { FiSearch, FiChevronDown, FiRefreshCw } from "react-icons/fi";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  
  // Sort functionality
  const [sortBy, setSortBy] = useState("date-latest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
  // Auto-ready functionality
  const [isAutoReadyLoading, setIsAutoReadyLoading] = useState(false);

  const statusOptions = [
    "All Status",
    "Pending",
    "Preparing",
    "Ready",
    "Completed",
    "Cancelled",
  ];

  const sortOptions = [
    { value: "date-latest", label: "Date (Latest First)" },
    { value: "date-oldest", label: "Date (Oldest First)" },
    { value: "status", label: "Status" },
    { value: "customer", label: "Customer Name" },
    { value: "amount-high", label: "Amount (High to Low)" },
    { value: "amount-low", label: "Amount (Low to High)" },
  ];

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      
      try {
        // 1) Fetch orders
        const { data: ordersRows, error: ordersErr } = await supabase
          .from("orders")
          .select("order_id, user_id, total_amount, payment_method, status, created_at, updated_at");
        
        if (ordersErr) {
          console.error("❌ Failed to fetch orders:", ordersErr);
          setOrders([]);
          return;
        }

        const orderIds = (ordersRows || []).map((o) => o.order_id);

        // 2) Fetch order items for these orders
        let itemsByOrderId = new Map();
        let productIdSet = new Set();
        if (orderIds.length > 0) {
          const { data: itemsRows, error: itemsErr } = await supabase
            .from("order_items")
            .select("order_id, product_id, quantity, price")
            .in("order_id", orderIds);
          
          if (itemsErr) {
            console.error("❌ Failed to fetch order_items:", itemsErr);
          } else {
            for (const row of itemsRows || []) {
              if (!itemsByOrderId.has(row.order_id)) itemsByOrderId.set(row.order_id, []);
              itemsByOrderId.get(row.order_id).push(row);
              if (row?.product_id != null) productIdSet.add(row.product_id);
            }
          }
        }

        // 3) Fetch product names and prep times for items
        let productMap = new Map();
        const productIds = Array.from(productIdSet);
        
        if (productIds.length > 0) {
          const { data: products, error: prodErr } = await supabase
            .from("menu_items")
            .select("id, name, price, prep_time")
            .in("id", productIds);
          
          if (prodErr) {
            console.error("❌ Could not fetch product names:", prodErr);
          } else {
            for (const p of products || []) {
              productMap.set(p.id, { 
                name: p.name, 
                price: Number(p.price),
                prepTime: p.prep_time || 0
              });
            }
          }
        }

        // 4) Fetch display names from profiles table
        let userMap = new Map();
        const userIds = Array.from(new Set((ordersRows || []).map((o) => o.user_id).filter(Boolean)));
        const DEFAULT_PHONE = "(+63) 000-0000";
        
        if (userIds.length > 0) {
          const { data: profiles, error: profErr } = await supabase
            .from("profiles")
            .select("id, display_name")
            .in("id", userIds);
          
          if (!profErr && profiles) {
            for (const u of profiles) {
              userMap.set(u.id, { name: u.display_name || "Unknown", phone: DEFAULT_PHONE });
            }
          } else if (profErr) {
            console.error("❌ Could not fetch user profiles:", profErr);
          }
        }

        // 5) Fetch cancellation reasons for cancelled orders
        let cancellationMap = new Map();
        const cancelledOrderIds = (ordersRows || [])
          .filter((o) => o.status === "Cancelled")
          .map((o) => o.order_id);
        
        console.log("🔍 DEBUG: Cancelled order IDs found:", cancelledOrderIds);
        
        if (cancelledOrderIds.length > 0) {
          console.log("📡 DEBUG: Fetching cancellation data...");
          const { data: cancellations, error: cancelErr } = await supabase
            .from("order_cancellations")
            .select("order_id, reason, additional_notes, cancelled_at")
            .in("order_id", cancelledOrderIds);
          
          console.log("📊 DEBUG: Cancellation query result:", {
            cancellations,
            cancelErr,
            count: cancellations?.length || 0
          });
          
          if (!cancelErr && cancellations) {
            console.log("✅ DEBUG: Successfully fetched cancellations, mapping data...");
            for (const c of cancellations) {
              console.log(`  📝 DEBUG: Mapping cancellation for order ${c.order_id}:`, {
                reason: c.reason,
                additional_notes: c.additional_notes,
                cancelled_at: c.cancelled_at
              });
              cancellationMap.set(c.order_id, {
                reason: c.reason,
                additionalNotes: c.additional_notes,
                cancelledAt: c.cancelled_at,
              });
            }
            console.log("🗂️ DEBUG: Final cancellation map:", Object.fromEntries(cancellationMap));
          } else if (cancelErr) {
            console.error("❌ DEBUG: Could not fetch cancellation data:", cancelErr);
          } else {
            console.warn("⚠️ DEBUG: No cancellations returned (empty array)");
          }
        } else {
          console.log("⚠️ DEBUG: No cancelled orders found");
        }

        const peso = (n) => `₱ ${Number(n ?? 0).toFixed(2)}`;
        const toTime = (ts) => {
          try {
            const d = new Date(ts);
            return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
          } catch (_e) {
            return "";
          }
        };
        const toDateTime = (ts) => {
          try {
            const d = new Date(ts);
            const dateStr = d.toLocaleDateString([], { 
              year: "numeric", 
              month: "short", 
              day: "numeric" 
            });
            const timeStr = d.toLocaleTimeString([], { 
              hour: "numeric", 
              minute: "2-digit" 
            });
            return `${dateStr} at ${timeStr}`;
          } catch (_e) {
            return "";
          }
        };

        const mapped = (ordersRows || []).map((o) => {
          const rawItems = itemsByOrderId.get(o.order_id) || [];
          
          const items = rawItems.map((it) => {
            const product = productMap.get(it.product_id) || {};
            const unitOrLinePrice = Number(it.price ?? product.price ?? 0);
            return {
              name: product.name || `Item ${it.product_id}`,
              price: peso(unitOrLinePrice),
              quantity: it.quantity ?? 1,
              prepTime: product.prepTime || 0,
            };
          });
          
          // Calculate total prep time (max of all items' prep times)
          const maxPrepTime = items.reduce((max, item) => Math.max(max, item.prepTime || 0), 0);
          
          // Calculate estimated ready time (order time + prep time)
          let estimatedReadyTime = "";
          try {
            const orderDate = new Date(o.created_at);
            const readyDate = new Date(orderDate.getTime() + maxPrepTime * 60000); // prep time in minutes
            estimatedReadyTime = readyDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
          } catch (_e) {
            estimatedReadyTime = "";
          }
          
          const customerInfo = userMap.get(o.user_id) || { name: "", phone: DEFAULT_PHONE };
          const cancellationInfo = cancellationMap.get(o.order_id);
          
          // Debug cancellation info for cancelled orders
          if (o.status === "Cancelled") {
            console.log(`🔍 DEBUG: Order #${o.order_id} (${o.status}):`, {
              hasCancellationInfo: !!cancellationInfo,
              cancellationInfo,
              orderId: o.order_id,
              status: o.status
            });
          }
          
          // Create items summary
          const itemCount = items.length;
          const itemNames = items.map(it => it.name).slice(0, 3).join(", ");
          const itemsSummary = itemCount > 3 
            ? `${itemCount} items: ${itemNames}...` 
            : `${itemCount} item${itemCount !== 1 ? 's' : ''}: ${itemNames}`;
          
          return {
            id: String(o.order_id),
            status: String(o.status || "Pending").toLowerCase(), // Convert DB capitalized to lowercase for UI
            customer: customerInfo.name || "Unknown",
            phone: customerInfo.phone || "",
            total: peso(o.total_amount),
            orderedTime: toDateTime(o.created_at),
            estimatedReadyTime,
            completedTime: undefined,
            cancelledTime: cancellationInfo ? toDateTime(cancellationInfo.cancelledAt) : undefined,
            cancelReason: cancellationInfo?.reason || null,
            cancelNotes: cancellationInfo?.additionalNotes || null,
            items,
            itemsSummary,
            // Add raw data for sorting
            created_at: o.created_at,
            total_amount: o.total_amount,
          };
        });
        
        if (isMounted) {
          setOrders(mapped);
        }
      } catch (err) {
        console.error("💥 Unexpected error loading orders:", err);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-check for ready orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      // Only check if there are preparing orders
      const preparingOrders = orders.filter(order => order.status === 'preparing');
      if (preparingOrders.length > 0) {
        console.log("🔄 Auto-checking for ready orders...");
        try {
          const result = await triggerAutoReadyOrders();
          if (result.success && result.data.updatedOrders > 0) {
            console.log(`✅ Auto-updated ${result.data.updatedOrders} orders to Ready`);
            // Reload the page to show updated orders
            window.location.reload();
          }
        } catch (err) {
          console.error("❌ Auto-ready check failed:", err);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const src = orders || [];
    let filtered = src.filter((order) => {
      const matchesSearch =
        (order.customer || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(order.id).includes(searchTerm);
      const matchesStatus =
        statusFilter === "All Status" ||
        order.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-latest":
          // Sort by created_at descending (latest first)
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB.getTime() - dateA.getTime();
        case "date-oldest":
          // Sort by created_at ascending (oldest first)
          const dateA2 = new Date(a.created_at || 0);
          const dateB2 = new Date(b.created_at || 0);
          return dateA2.getTime() - dateB2.getTime();
        case "status":
          // Sort by status alphabetically
          return (a.status || "").localeCompare(b.status || "");
        case "customer":
          // Sort by customer name alphabetically
          return (a.customer || "").localeCompare(b.customer || "");
        case "amount-high":
          // Sort by amount descending (high to low)
          const amountA = Number(a.total_amount || 0);
          const amountB = Number(b.total_amount || 0);
          return amountB - amountA;
        case "amount-low":
          // Sort by amount ascending (low to high)
          const amountA2 = Number(a.total_amount || 0);
          const amountB2 = Number(b.total_amount || 0);
          return amountA2 - amountB2;
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy]);

  const handleOrderStatusChange = async (orderId, nextStatus) => {
    const capitalizedStatus = nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1);
    const previousOrders = orders;

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (String(o.id) === String(orderId) ? { ...o, status: nextStatus } : o))
    );

    try {
      // 1️⃣ Update order in DB
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: capitalizedStatus })
        .eq("order_id", orderId);

      if (updateError) {
        setOrders(previousOrders);
        console.error("❌ Failed to update order:", updateError);
        return;
      }

      // 2️⃣ Call send-emails Edge Function (it will fetch user email internally)
      const { data: emailData, error: emailError } = await supabase.functions.invoke("send-emails", {
        body: {
          orderId: orderId,
          newStatus: capitalizedStatus,
        },
      });

      if (emailError) {
        console.error("❌ Failed to send email:", emailError);
      } else {
        console.log("✅ Email sent successfully");
      }

      // 3️⃣ Cancel payment if order is cancelled
      if (nextStatus === "cancelled") {
        const { error: paymentError } = await supabase
          .from("payments")
          .update({ status: "cancelled" })
          .eq("order_id", orderId);
        
        if (paymentError) {
          console.error("❌ Failed to cancel payment:", paymentError);
        }
      }

    } catch (err) {
      console.error("💥 Unexpected error:", err);
      setOrders(previousOrders);
    }
  };

  const handleAutoReadyTrigger = async () => {
    setIsAutoReadyLoading(true);
    try {
      const result = await triggerAutoReadyOrders();
      if (result.success) {
        console.log("✅ Auto-ready check completed:", result.data);
        // Reload orders to show updated statuses
        window.location.reload();
      } else {
        console.error("❌ Auto-ready check failed:", result.error);
        alert("Failed to check for ready orders: " + result.error);
      }
    } catch (err) {
      console.error("💥 Unexpected error:", err);
      alert("Unexpected error: " + err.message);
    } finally {
      setIsAutoReadyLoading(false);
    }
  };


  return (
    <div className="orders_layout">
      <main className="orders_main">
        <div className="orders_header">
          <h1>Orders Management</h1>
          <p>Track and manage all orders</p>
        </div>

        {/* Search + Filter + Sort + Auto-Ready */}
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

          <div className="orders_filter_group">
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

            <div className="orders_sort_filter">
              <button
                className="orders_sort_dropdown_btn"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              >
                {sortOptions.find(option => option.value === sortBy)?.label || "Sort by"}
                <FiChevronDown className="dropdown-arrow-icon" />
              </button>
              {isSortDropdownOpen && (
                <div className="orders_sort_dropdown">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`orders_dropdown_item ${
                        sortBy === option.value ? "orders_active" : ""
                      }`}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortDropdownOpen(false);
                        setIsFiltering(true);
                        setTimeout(() => setIsFiltering(false), 100);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="orders_auto_ready">
            <button
              className="orders_auto_ready_btn"
              onClick={handleAutoReadyTrigger}
              disabled={isAutoReadyLoading}
              title="Check for orders that should be automatically marked as ready"
            >
              <FiRefreshCw className={isAutoReadyLoading ? "spinning" : ""} />
              {isAutoReadyLoading ? "Checking..." : "Auto-Ready"}
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className={`orders_list ${isFiltering ? "orders_filtering" : ""}`}>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={handleViewDetails}
              onOrderStatusChange={handleOrderStatusChange}
            />
          ))}
        </div>

        {(!isLoading && filteredOrders.length === 0) && (
          <div className="orders_no_orders">
            <p>No orders found matching your criteria.</p>
          </div>
        )}
        {isLoading && (
          <div className="orders_no_orders">
            <p>Loading orders...</p>
          </div>
        )}
      </main>

      {/* Modal */}
      <OrdersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        onOrderStatusChange={handleOrderStatusChange}
      />
      <ScrollUpButton />
    </div>
  );
};

export default Orders;
