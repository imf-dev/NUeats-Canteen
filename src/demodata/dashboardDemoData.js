// src/demodata/dashboardDemoData.js
import { menuItems } from "./menuDemoData.js";
import { computeSalesSummary } from "./salesDemoData.js";
import { ordersData } from "./ordersDemoData.js";

// Stats Cards Data
export const getStatsCards = () => {
  const activeOrders = ordersData.filter((order) =>
    ["preparing", "ready", "pending"].includes(order.status)
  );

  const completedOrdersToday = ordersData.filter(
    (order) => order.status === "completed"
  );

  const pendingOrders = ordersData.filter(
    (order) => order.status === "pending"
  );

  // Low stock items - placeholder data since inventory is removed
  const lowStockItems = [];

  return [
    {
      id: "active-orders",
      title: "Active Orders",
      value: activeOrders.length.toString(),
      subtitle: `${pendingOrders.length} Pending Orders`,
      icon: "FiShoppingBag",
      color: "blue",
    },
    {
      id: "completed-orders",
      title: "Completed Orders",
      value: completedOrdersToday.length.toString(),
      subtitle: "Today",
      icon: "FiCheckCircle",
      color: "green",
    },
    {
      id: "revenue",
      title: "Today's Revenue",
      value: "₱ 5,600",
      subtitle: "+12% from yesterday",
      icon: "FiDollarSign",
      color: "yellow",
    },
    {
      id: "low-stock",
      title: "Low Stock Items",
      value: lowStockItems.length.toString(),
      subtitle: `${lowStockItems.length} different items are low in stock`,
      icon: "FiBox",
      color: "orange",
    },
  ];
};

// Weekly Sales Data with realistic revenue and order correlation
export const getWeeklyData = () => {
  return [
    {
      day: "MON",
      revenue: 5200,
      orders: 42,
      date: "2025-01-27",
      avgOrderValue: 123.81,
    },
    {
      day: "TUE",
      revenue: 8800,
      orders: 68,
      date: "2025-01-28",
      avgOrderValue: 129.41,
    },
    {
      day: "WED",
      revenue: 7100,
      orders: 54,
      date: "2025-01-29",
      avgOrderValue: 131.48,
    },
    {
      day: "THU",
      revenue: 12400,
      orders: 85,
      date: "2025-01-30",
      avgOrderValue: 145.88,
    },
    {
      day: "FRI",
      revenue: 9600,
      orders: 72,
      date: "2025-01-31",
      avgOrderValue: 133.33,
    },
    {
      day: "SAT",
      revenue: 11200,
      orders: 78,
      date: "2025-02-01",
      avgOrderValue: 143.59,
    },
    {
      day: "SUN",
      revenue: 8900,
      orders: 65,
      date: "2025-02-02",
      avgOrderValue: 136.92,
    },
  ];
};

// Top Selling Items based on sales data
export const getTopSellingItems = () => {
  const salesSummary = computeSalesSummary();

  return salesSummary.slice(0, 5).map((item, index) => {
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    return {
      id: item.menuItemId,
      name: item.itemName,
      quantity: item.unitsSold,
      revenue: item.revenue,
      growth: item.growth,
      color: colors[index],
      category: item.itemCategory,
      price: item.itemPrice,
      transactionCount: item.transactionCount,
      avgQuantityPerOrder: (item.unitsSold / item.transactionCount).toFixed(1),
    };
  });
};

// Current Orders with enriched data
export const getCurrentOrders = () => {
  return ordersData.map((order) => {
    // Calculate total from items
    const calculatedTotal = order.items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace("₱ ", ""));
      return sum + price;
    }, 0);

    return {
      id: order.id,
      customerName: order.customer,
      phone: order.phone,
      items: order.items.map((item) => item.name).join(", "),
      itemsDetail: order.items,
      time: order.orderedTime,
      amount: order.total,
      calculatedAmount: `₱ ${calculatedTotal.toFixed(2)}`,
      status: order.status,
      statusColor: getStatusColor(order.status),
      completedTime: order.completedTime || null,
      cancelledTime: order.cancelledTime || null,
      cancelReason: order.cancelReason || null,
      itemCount: order.items.length,
      hasSpecialInstructions: order.items.some((item) => item.instructions),
    };
  });
};

// Helper function for status colors
const getStatusColor = (status) => {
  const colorMap = {
    preparing: "blue",
    ready: "green",
    pending: "orange",
    completed: "green",
    cancelled: "red",
  };
  return colorMap[status] || "gray";
};

// Additional utility functions
export const getHighestRevenueDay = (weeklyData) => {
  return weeklyData.reduce(
    (max, day) => (day.revenue > max.revenue ? day : max),
    weeklyData[0] || {}
  );
};

export const getTotalWeeklyRevenue = (weeklyData) => {
  return weeklyData.reduce((total, day) => total + day.revenue, 0);
};

export const getTotalWeeklyOrders = (weeklyData) => {
  return weeklyData.reduce((total, day) => total + day.orders, 0);
};

// Export all dashboard data
export const getDashboardData = () => {
  return {
    statsCards: getStatsCards(),
    weeklyData: getWeeklyData(),
    topSellingItems: getTopSellingItems(),
    currentOrders: getCurrentOrders(),
  };
};
