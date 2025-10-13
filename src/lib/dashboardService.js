// src/lib/dashboardService.js
import { supabase } from "./supabaseClient";

/**
 * Get stats cards data for the dashboard
 */
export async function getStatsCards() {
  try {
    // Get active orders count (Pending, Preparing, Ready)
    const { data: activeOrders, error: activeError } = await supabase
      .from("orders")
      .select("order_id, status")
      .in("status", ["Pending", "Preparing", "Ready"]);

    if (activeError) {
      console.error("Error fetching active orders:", activeError);
      throw activeError;
    }

    const pendingCount = activeOrders?.filter((o) => o.status === "Pending").length || 0;

    // Get completed orders (all time for now, since seeder doesn't create completed orders for today)
    const { data: completedOrders, error: completedError } = await supabase
      .from("orders")
      .select("order_id, created_at, total_amount")
      .eq("status", "Completed");

    if (completedError) {
      console.error("Error fetching completed orders:", completedError);
      throw completedError;
    }

    // Calculate today's completed orders and revenue
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayCompleted = completedOrders?.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= todayStart && orderDate < todayEnd;
    }) || [];

    const todayRevenue = todayCompleted.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

    // Calculate yesterday's revenue
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const yesterdayCompleted = completedOrders?.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= yesterdayStart && orderDate < todayStart;
    }) || [];

    const yesterdayRevenue = yesterdayCompleted.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    
    const revenueChange = yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(0)
      : 0;

    console.log("Dashboard Stats:", {
      activeOrders: activeOrders?.length || 0,
      todayCompleted: todayCompleted.length,
      todayRevenue,
      yesterdayRevenue,
    });

    return [
      {
        id: "active-orders",
        title: "Active Orders",
        value: (activeOrders?.length || 0).toString(),
        subtitle: `${pendingCount} Pending Orders`,
        icon: "FiShoppingBag",
        color: "blue",
      },
      {
        id: "completed-orders",
        title: "Completed Orders",
        value: todayCompleted.length.toString(),
        subtitle: "Today",
        icon: "FiCheckCircle",
        color: "green",
      },
      {
        id: "revenue",
        title: "Today's Revenue",
        value: `₱ ${todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        subtitle: revenueChange >= 0 ? `+${revenueChange}% from yesterday` : `${revenueChange}% from yesterday`,
        icon: "FiDollarSign",
        color: "yellow",
      },
    ];
  } catch (error) {
    console.error("Error fetching stats cards:", error);
    return [];
  }
}

/**
 * Get weekly sales data (last 7 days)
 */
export async function getWeeklyData() {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Fetch orders from the last 7 days
    const { data: orders, error } = await supabase
      .from("orders")
      .select("order_id, total_amount, created_at, status")
      .gte("created_at", sevenDaysAgo.toISOString())
      .lte("created_at", today.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Group orders by day
    const weeklyMap = {};
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Initialize all 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      weeklyMap[dateStr] = {
        day: dayNames[date.getDay()],
        date: dateStr,
        revenue: 0,
        orders: 0,
        avgOrderValue: 0,
      };
    }

    // Populate with actual data
    orders.forEach((order) => {
      const dateStr = order.created_at.split("T")[0];
      if (weeklyMap[dateStr]) {
        weeklyMap[dateStr].orders++;
        if (order.status === "Completed") {
          weeklyMap[dateStr].revenue += parseFloat(order.total_amount || 0);
        }
      }
    });

    // Calculate average order values
    Object.keys(weeklyMap).forEach((dateStr) => {
      const data = weeklyMap[dateStr];
      data.avgOrderValue = data.orders > 0 ? (data.revenue / data.orders).toFixed(2) : 0;
    });

    return Object.values(weeklyMap);
  } catch (error) {
    console.error("Error fetching weekly data:", error);
    return [];
  }
}

/**
 * Get top 5 selling items this week
 */
export async function getTopSellingItems() {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Fetch order items from the last 7 days with menu item details
    const { data: orderItems, error } = await supabase
      .from("order_items")
      .select(`
        product_id,
        quantity,
        price,
        order_id,
        orders!inner(created_at, status)
      `)
      .gte("orders.created_at", sevenDaysAgo.toISOString())
      .lte("orders.created_at", today.toISOString())
      .eq("orders.status", "Completed");

    if (error) throw error;

    // Get menu items
    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select("id, name, category, price");

    if (menuError) throw menuError;

    // Create a map of menu items
    const menuMap = {};
    menuItems.forEach((item) => {
      menuMap[item.id] = item;
    });

    // Aggregate by product_id
    const productStats = {};
    orderItems.forEach((item) => {
      const productId = item.product_id;
      if (!productStats[productId]) {
        productStats[productId] = {
          quantity: 0,
          revenue: 0,
        };
      }
      productStats[productId].quantity += item.quantity;
      productStats[productId].revenue += item.quantity * parseFloat(item.price);
    });

    // Convert to array and sort by quantity
    const topItems = Object.entries(productStats)
      .map(([productId, stats]) => {
        const menuItem = menuMap[productId];
        return {
          id: productId,
          name: menuItem?.name || "Unknown Item",
          quantity: stats.quantity,
          revenue: stats.revenue,
          category: menuItem?.category || "Unknown",
          price: menuItem?.price || 0,
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Add colors
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    return topItems.map((item, index) => ({
      ...item,
      color: colors[index] || "#6B7280",
    }));
  } catch (error) {
    console.error("Error fetching top selling items:", error);
    return [];
  }
}

/**
 * Get current active orders (Pending, Preparing, Ready only)
 */
export async function getCurrentOrders() {
  try {
    // Fetch only active orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("order_id, user_id, total_amount, status, created_at")
      .in("status", ["Pending", "Preparing", "Ready"])
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      throw ordersError;
    }

    console.log("Current Orders fetched:", orders?.length || 0);

    if (!orders || orders.length === 0) {
      return [];
    }

    // Fetch order items for these orders
    const orderIds = orders.map((o) => o.order_id);

    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("order_id, product_id, quantity, price")
      .in("order_id", orderIds);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      throw itemsError;
    }

    // Fetch menu items to get names
    const productIds = [...new Set(orderItems?.map(item => item.product_id) || [])];
    
    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select("id, name")
      .in("id", productIds);

    if (menuError) {
      console.error("Error fetching menu items:", menuError);
      throw menuError;
    }

    // Create menu items map
    const menuMap = {};
    menuItems?.forEach(item => {
      menuMap[item.id] = item.name;
    });

    // Group items by order_id
    const itemsByOrder = {};
    orderItems?.forEach((item) => {
      if (!itemsByOrder[item.order_id]) {
        itemsByOrder[item.order_id] = [];
      }
      itemsByOrder[item.order_id].push({
        ...item,
        name: menuMap[item.product_id] || "Unknown Item"
      });
    });

    // Create user map with customer names (fetch from profiles.display_name)
    const userIds = [...new Set(orders.map(o => o.user_id).filter(Boolean))];
    const userMap = {};
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles for customer names:", profilesError);
      } else {
        (profiles || []).forEach((p) => {
          const fallback = p.id ? `Customer ${String(p.id).slice(0, 8)}` : "Customer";
          userMap[p.id] = p.display_name || fallback;
        });
      }
    }

    // Format orders for display
    const formattedOrders = orders.map((order) => {
      const items = itemsByOrder[order.order_id] || [];
      const itemNames = items.map((item) => item.name).join(", ");
      
      const customerName = userMap[order.user_id] || "Guest";

      // Format time
      const createdAt = new Date(order.created_at);
      const timeStr = createdAt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return {
        id: order.order_id,
        customerName: customerName,
        items: itemNames,
        itemCount: items.length,
        time: timeStr,
        amount: `₱ ${parseFloat(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        status: order.status.toLowerCase(),
        hasSpecialInstructions: false,
      };
    });

    console.log("Formatted current orders:", formattedOrders.length);
    return formattedOrders;
  } catch (error) {
    console.error("Error fetching current orders:", error);
    return [];
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId, newStatus) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("order_id", orderId)
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error };
  }
}

/**
 * Fetch all dashboard data at once
 */
export async function getDashboardData() {
  try {
    const [statsCards, weeklyData, topSellingItems, currentOrders] = await Promise.all([
      getStatsCards(),
      getWeeklyData(),
      getTopSellingItems(),
      getCurrentOrders(),
    ]);

    return {
      statsCards,
      weeklyData,
      topSellingItems,
      currentOrders,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      statsCards: [],
      weeklyData: [],
      topSellingItems: [],
      currentOrders: [],
    };
  }
}
