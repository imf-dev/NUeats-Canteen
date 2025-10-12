import React, { useEffect, useMemo, useState } from "react";
import OrdersModal from "../components/Orders/O_Modal";
import OrderCard from "../components/Orders/O_Cards";
import "../styles/Orders.css";
import ScrollUpButton from "../components/common/ScrollUpButton";
import { supabase } from "../lib/supabaseClient";

import { FiSearch } from "react-icons/fi";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

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

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      console.log("🔄 Starting to load orders...");
      
      // Debug Supabase connection
      console.log("🔧 Supabase client:", supabase);
      console.log("🔧 Supabase URL:", supabase.supabaseUrl);
      console.log("🔧 Environment check:", {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Not set"
      });
      
      // Check authentication status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log("🔐 Authentication status:", { user, authError });
      
      // Check if user has admin privileges
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("🔑 Session data:", session);
        console.log("👑 Admin claim:", session?.access_token ? JSON.parse(atob(session.access_token.split('.')[1])) : "No token");
      }
      
      try {
        // 1) Fetch orders
        console.log("📡 Fetching orders from database...");
        const { data: ordersRows, error: ordersErr } = await supabase
          .from("orders")
          .select("order_id, user_id, total_amount, payment_method, status, created_at, updated_at")
          .order("created_at", { ascending: false });
        
        console.log("📊 Orders query result:", { ordersRows, ordersErr });
        
        if (ordersErr) {
          console.error("❌ Failed to fetch orders:", ordersErr);
          setOrders([]);
          return;
        }
        
        console.log(`✅ Successfully fetched ${ordersRows?.length || 0} orders`);

        const orderIds = (ordersRows || []).map((o) => o.order_id);
        console.log("🔍 Order IDs to fetch items for:", orderIds);

        // 2) Fetch order items for these orders
        let itemsByOrderId = new Map();
        let productIdSet = new Set();
        if (orderIds.length > 0) {
          console.log("📡 Fetching order items...");
          const { data: itemsRows, error: itemsErr } = await supabase
            .from("order_items")
            .select("order_id, product_id, quantity, price")
            .in("order_id", orderIds);
          
          console.log("📊 Order items query result:", { itemsRows, itemsErr });
          
          if (itemsErr) {
            console.error("❌ Failed to fetch order_items:", itemsErr);
          } else {
            console.log(`✅ Successfully fetched ${itemsRows?.length || 0} order items`);
            
            // Check if Order #416 items are in the results
            const order416ItemsInResults = itemsRows?.filter(item => item.order_id === 416) || [];
            console.log("🔍 Order #416 items in main query results:", order416ItemsInResults);
            
            for (const row of itemsRows || []) {
              if (!itemsByOrderId.has(row.order_id)) itemsByOrderId.set(row.order_id, []);
              itemsByOrderId.get(row.order_id).push(row);
              if (row?.product_id != null) productIdSet.add(row.product_id);
            }
            console.log("🗂️ Items grouped by order ID:", Object.fromEntries(itemsByOrderId));
            
            // Fallback: Check for orders with no items and fetch them individually
            const ordersWithNoItems = orderIds.filter(orderId => !itemsByOrderId.has(orderId));
            if (ordersWithNoItems.length > 0) {
              console.log("⚠️ Found orders with no items, fetching individually:", ordersWithNoItems);
              
              for (const orderId of ordersWithNoItems) {
                try {
                  const { data: individualItems, error: individualError } = await supabase
                    .from("order_items")
                    .select("order_id, product_id, quantity, price")
                    .eq("order_id", orderId);
                  
                  if (!individualError && individualItems && individualItems.length > 0) {
                    console.log(`✅ Fetched ${individualItems.length} items for Order #${orderId} individually`);
                    itemsByOrderId.set(orderId, individualItems);
                    individualItems.forEach(item => {
                      if (item?.product_id != null) productIdSet.add(item.product_id);
                    });
                  } else {
                    console.log(`❌ No items found for Order #${orderId} even with individual query`);
                  }
                } catch (err) {
                  console.error(`❌ Error fetching items for Order #${orderId}:`, err);
                }
              }
            }
          }
        } else {
          console.log("⚠️ No order IDs found, skipping order items fetch");
        }

        // 3) Fetch product names and prep times for items
        let productMap = new Map();
        const productIds = Array.from(productIdSet);
        console.log("🔍 Product IDs to fetch details for:", productIds);
        
        if (productIds.length > 0) {
          console.log("📡 Fetching menu items...");
          const { data: products, error: prodErr } = await supabase
            .from("menu_items")
            .select("id, name, price, prep_time")
            .in("id", productIds);
          
          console.log("📊 Menu items query result:", { products, prodErr });
          
          if (prodErr) {
            console.error("⚠️ Could not fetch product names:", prodErr);
          } else {
            console.log(`✅ Successfully fetched ${products?.length || 0} menu items`);
            for (const p of products || []) {
              productMap.set(p.id, { 
                name: p.name, 
                price: Number(p.price),
                prepTime: p.prep_time || 0
              });
            }
          }
        } else {
          console.log("⚠️ No product IDs found, skipping menu items fetch");
        }

        // 4) Fetch display names from profiles table
        let userMap = new Map();
        const userIds = Array.from(new Set((ordersRows || []).map((o) => o.user_id).filter(Boolean)));
        const DEFAULT_PHONE = "(+63) 000-0000";
        console.log("🔍 User IDs to fetch profiles for:", userIds);
        
        if (userIds.length > 0) {
          console.log("📡 Fetching user profiles...");
          const { data: profiles, error: profErr } = await supabase
            .from("profiles")
            .select("id, display_name")
            .in("id", userIds);
          
          console.log("📊 Profiles query result:", { profiles, profErr });
          
          if (!profErr && profiles) {
            console.log(`✅ Successfully fetched ${profiles.length} user profiles`);
            for (const u of profiles) {
              userMap.set(u.id, { name: u.display_name || "Unknown", phone: DEFAULT_PHONE });
            }
          } else {
            console.log("⚠️ Could not fetch user profiles:", profErr);
          }
        } else {
          console.log("⚠️ No user IDs found, skipping profiles fetch");
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

        console.log("🔄 Processing and mapping order data...");
        const mapped = (ordersRows || []).map((o) => {
          const rawItems = itemsByOrderId.get(o.order_id) || [];
          console.log(`🔍 Order ${o.order_id}: Found ${rawItems.length} raw items:`, rawItems);
          
          // Special debug for orders with no items
          if (rawItems.length === 0) {
            console.log(`⚠️ Order ${o.order_id} has NO items - this will show "No items found" in UI`);
          }
          
          const items = rawItems.map((it) => {
            const product = productMap.get(it.product_id) || {};
            console.log(`  📦 Item ${it.product_id}: product=${product}, price=${it.price}`);
            const unitOrLinePrice = Number(it.price ?? product.price ?? 0);
            return {
              name: product.name || `Item ${it.product_id}`,
              price: peso(unitOrLinePrice),
              quantity: it.quantity ?? 1,
              prepTime: product.prepTime || 0,
            };
          });
          
          console.log(`✅ Order ${o.order_id}: Mapped to ${items.length} items:`, items);
          
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
            orderedTime: toTime(o.created_at),
            estimatedReadyTime,
            completedTime: undefined,
            cancelledTime: undefined,
            items,
            itemsSummary,
          };
        });

        console.log("📋 Final mapped orders:", mapped);
        
        // Test: Try to fetch order items for a specific recent order to debug RLS
        if (ordersRows && ordersRows.length > 0) {
          const recentOrder = ordersRows[0]; // Most recent order
          console.log("🧪 Testing direct order_items query for recent order:", recentOrder.order_id);
          
          const { data: testItems, error: testError } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", recentOrder.order_id);
          
          console.log("🧪 Direct order_items test result:", { testItems, testError });
        }
        
        // Special test for Order #416 specifically
        console.log("🔍 Special test for Order #416:");
        const { data: order416Items, error: order416Error } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", 416);
        
        console.log("🔍 Order #416 items from database:", { order416Items, order416Error });
        
        // Check if Order #416 is in the ordersRows
        const order416 = ordersRows?.find(o => o.order_id === 416);
        console.log("🔍 Order #416 in ordersRows:", order416);
        
        // Check if Order #416 is in the itemsByOrderId map
        const order416ItemsFromMap = itemsByOrderId.get(416);
        console.log("🔍 Order #416 items from itemsByOrderId map:", order416ItemsFromMap);
        
        if (isMounted) {
          setOrders(mapped);
          console.log("✅ Orders state updated successfully");
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

  const filteredOrders = useMemo(() => {
    const src = orders || [];
    return src.filter((order) => {
      const matchesSearch =
        (order.customer || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(order.id).includes(searchTerm);
      const matchesStatus =
        statusFilter === "All Status" ||
        order.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

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
