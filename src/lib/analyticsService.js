// src/lib/analyticsService.js
import { supabase } from "./supabaseClient";

/**
 * Get today's analytics summary
 */
export async function getTodaysAnalytics() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    // Fetch today's orders
    const { data: todayOrders, error: todayError } = await supabase
      .from("orders")
      .select("order_id, total_amount, status, created_at")
      .gte("created_at", todayStart.toISOString())
      .lt("created_at", todayEnd.toISOString());

    if (todayError) throw todayError;

    // Fetch yesterday's orders for comparison
    const { data: yesterdayOrders, error: yesterdayError } = await supabase
      .from("orders")
      .select("order_id, total_amount, status")
      .gte("created_at", yesterdayStart.toISOString())
      .lt("created_at", todayStart.toISOString());

    if (yesterdayError) throw yesterdayError;

    // Calculate today's metrics
    const todayCompleted = todayOrders?.filter((o) => o.status === "Completed") || [];
    const todayRevenue = todayCompleted.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    const todayOrderCount = todayOrders?.length || 0;

    // Calculate yesterday's metrics
    const yesterdayCompleted = yesterdayOrders?.filter((o) => o.status === "Completed") || [];
    const yesterdayRevenue = yesterdayCompleted.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    const yesterdayOrderCount = yesterdayOrders?.length || 0;

    // Calculate growth percentages
    const revenueGrowth = yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1)
      : 0;

    const ordersGrowth = yesterdayOrderCount > 0
      ? ((todayOrderCount - yesterdayOrderCount) / yesterdayOrderCount * 100).toFixed(1)
      : 0;

    // Calculate completion rate
    const completedCount = todayCompleted.length;
    const totalOrders = todayOrderCount;
    const completionRate = totalOrders > 0
      ? ((completedCount / totalOrders) * 100).toFixed(0)
      : 0;

    // Calculate average order time (mock for now - would need order timestamps)
    const avgOrderTime = 24; // Placeholder

    // Get total unique customers (all time)
    const { data: allOrders, error: allOrdersError } = await supabase
      .from("orders")
      .select("user_id");

    if (allOrdersError) throw allOrdersError;

    const uniqueCustomers = new Set(allOrders?.map((o) => o.user_id) || []);
    const totalCustomers = uniqueCustomers.size;

    // Get new customers today (first order today)
    const todayUserIds = new Set(todayOrders?.map((o) => o.user_id) || []);
    const oldUserIds = new Set(
      allOrders
        ?.filter((o) => !todayOrders?.find((to) => to.order_id === o.order_id))
        ?.map((o) => o.user_id) || []
    );

    const newCustomersToday = [...todayUserIds].filter((id) => !oldUserIds.has(id)).length;

    console.log("Analytics:", {
      todayRevenue,
      todayOrderCount,
      revenueGrowth: parseFloat(revenueGrowth),
      ordersGrowth: parseFloat(ordersGrowth),
      completionRate: parseInt(completionRate),
    });

    return {
      revenue: todayRevenue,
      revenueGrowth: parseFloat(revenueGrowth),
      orders: todayOrderCount,
      ordersGrowth: parseFloat(ordersGrowth),
      completionRate: parseInt(completionRate),
      avgOrderTime: avgOrderTime,
      totalCustomers: totalCustomers,
      newCustomersToday: newCustomersToday,
    };
  } catch (error) {
    console.error("Error fetching today's analytics:", error);
    return {
      revenue: 0,
      revenueGrowth: 0,
      orders: 0,
      ordersGrowth: 0,
      completionRate: 0,
      avgOrderTime: 0,
      totalCustomers: 0,
      newCustomersToday: 0,
    };
  }
}

/**
 * Get top selling items (all time)
 */
export async function getTopSellingItems(limit = 5) {
  try {
    // Fetch all completed order items
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        product_id,
        quantity,
        price,
        order_id,
        orders!inner(status)
      `)
      .eq("orders.status", "Completed");

    if (itemsError) throw itemsError;

    // Fetch menu items
    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select("id, name, category, price");

    if (menuError) throw menuError;

    // Create menu items map
    const menuMap = {};
    menuItems?.forEach((item) => {
      menuMap[item.id] = item;
    });

    // Aggregate sales by product
    const salesByProduct = {};
    orderItems?.forEach((item) => {
      const productId = item.product_id;
      if (!salesByProduct[productId]) {
        salesByProduct[productId] = {
          unitsSold: 0,
          revenue: 0,
        };
      }
      salesByProduct[productId].unitsSold += item.quantity;
      salesByProduct[productId].revenue += item.quantity * parseFloat(item.price);
    });

    // Convert to array and add menu item details
    const topItems = Object.entries(salesByProduct)
      .map(([productId, stats]) => {
        const menuItem = menuMap[productId];
        return {
          menuItemId: parseInt(productId),
          itemName: menuItem?.name || "Unknown Item",
          itemCategory: menuItem?.category || "Unknown",
          itemPrice: menuItem?.price || 0,
          unitsSold: stats.unitsSold,
          revenue: stats.revenue,
        };
      })
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, limit);

    console.log("Top selling items:", topItems.length);
    return topItems;
  } catch (error) {
    console.error("Error fetching top selling items:", error);
    return [];
  }
}

/**
 * Get hourly performance for today
 */
export async function getHourlyPerformance() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Fetch today's orders
    const { data: todayOrders, error } = await supabase
      .from("orders")
      .select("order_id, total_amount, status, created_at")
      .gte("created_at", todayStart.toISOString())
      .lt("created_at", todayEnd.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Initialize hourly buckets (8 AM to 5 PM = 10 hours)
    const hourlyData = [];
    for (let hour = 8; hour <= 17; hour++) {
      hourlyData.push({
        hour: hour,
        orders: 0,
        revenue: 0,
      });
    }

    // Group orders by hour
    todayOrders?.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const hour = orderDate.getHours();
      
      // Only count hours between 8 AM and 5 PM
      if (hour >= 8 && hour <= 17) {
        const hourIndex = hour - 8;
        hourlyData[hourIndex].orders++;
        if (order.status === "Completed") {
          hourlyData[hourIndex].revenue += parseFloat(order.total_amount || 0);
        }
      }
    });

    console.log("Hourly performance data:", hourlyData.length, "hours");
    return hourlyData;
  } catch (error) {
    console.error("Error fetching hourly performance:", error);
    // Return empty data for all hours
    const emptyData = [];
    for (let hour = 8; hour <= 17; hour++) {
      emptyData.push({
        hour: hour,
        orders: 0,
        revenue: 0,
      });
    }
    return emptyData;
  }
}

/**
 * Fetch all analytics data at once
 */
export async function getAnalyticsData() {
  try {
    const [analytics, topSellingItems, hourlyPerformance] = await Promise.all([
      getTodaysAnalytics(),
      getTopSellingItems(5),
      getHourlyPerformance(),
    ]);

    return {
      analytics,
      topSellingItems,
      hourlyPerformance,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return {
      analytics: {
        revenue: 0,
        revenueGrowth: 0,
        orders: 0,
        ordersGrowth: 0,
        completionRate: 0,
        avgOrderTime: 0,
        totalCustomers: 0,
        newCustomersToday: 0,
      },
      topSellingItems: [],
      hourlyPerformance: [],
    };
  }
}
