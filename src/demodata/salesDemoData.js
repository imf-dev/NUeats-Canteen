// src/demodata/salesDemoData.js
import { menuItems } from "./menuDemoData.js";

// Individual sales transactions (raw data)
export const salesTransactions = [
  // Chop Suey transactions (menuItemId: 1)
  {
    id: 1,
    menuItemId: 1,
    quantity: 2,
    timestamp: "2024-01-15T08:30:00Z",
    orderId: "ORD001",
  },
  {
    id: 2,
    menuItemId: 1,
    quantity: 1,
    timestamp: "2024-01-15T12:15:00Z",
    orderId: "ORD002",
  },
  {
    id: 3,
    menuItemId: 1,
    quantity: 3,
    timestamp: "2024-01-15T18:45:00Z",
    orderId: "ORD003",
  },
  {
    id: 4,
    menuItemId: 1,
    quantity: 1,
    timestamp: "2024-01-16T09:20:00Z",
    orderId: "ORD004",
  },
  {
    id: 5,
    menuItemId: 1,
    quantity: 2,
    timestamp: "2024-01-16T13:30:00Z",
    orderId: "ORD005",
  },
  {
    id: 6,
    menuItemId: 1,
    quantity: 1,
    timestamp: "2024-01-16T19:15:00Z",
    orderId: "ORD006",
  },
  {
    id: 7,
    menuItemId: 1,
    quantity: 4,
    timestamp: "2024-01-17T11:00:00Z",
    orderId: "ORD007",
  },
  {
    id: 8,
    menuItemId: 1,
    quantity: 2,
    timestamp: "2024-01-17T14:20:00Z",
    orderId: "ORD008",
  },
  {
    id: 9,
    menuItemId: 1,
    quantity: 1,
    timestamp: "2024-01-17T20:30:00Z",
    orderId: "ORD009",
  },
  {
    id: 10,
    menuItemId: 1,
    quantity: 3,
    timestamp: "2024-01-18T10:45:00Z",
    orderId: "ORD010",
  },

  // Continue with more Chop Suey transactions to reach ~145 units
  ...Array.from({ length: 35 }, (_, i) => ({
    id: 11 + i,
    menuItemId: 1,
    quantity: Math.floor(Math.random() * 4) + 1, // 1-4 items per transaction
    timestamp: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(
      2,
      "0"
    )}T${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(
      Math.floor(Math.random() * 60)
    ).padStart(2, "0")}:00Z`,
    orderId: `ORD${String(11 + i).padStart(3, "0")}`,
  })),

  // Fried Rice transactions (menuItemId: 3) - targeting ~98 units
  ...Array.from({ length: 28 }, (_, i) => ({
    id: 100 + i,
    menuItemId: 3,
    quantity: Math.floor(Math.random() * 4) + 1,
    timestamp: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(
      2,
      "0"
    )}T${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(
      Math.floor(Math.random() * 60)
    ).padStart(2, "0")}:00Z`,
    orderId: `ORD${String(100 + i).padStart(3, "0")}`,
  })),

  // Iced Coffee transactions (menuItemId: 7) - targeting ~87 units
  ...Array.from({ length: 25 }, (_, i) => ({
    id: 200 + i,
    menuItemId: 7,
    quantity: Math.floor(Math.random() * 4) + 1,
    timestamp: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(
      2,
      "0"
    )}T${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(
      Math.floor(Math.random() * 60)
    ).padStart(2, "0")}:00Z`,
    orderId: `ORD${String(200 + i).padStart(3, "0")}`,
  })),

  // Cookies transactions (menuItemId: 2) - targeting ~76 units
  ...Array.from({ length: 22 }, (_, i) => ({
    id: 300 + i,
    menuItemId: 2,
    quantity: Math.floor(Math.random() * 4) + 1,
    timestamp: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(
      2,
      "0"
    )}T${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(
      Math.floor(Math.random() * 60)
    ).padStart(2, "0")}:00Z`,
    orderId: `ORD${String(300 + i).padStart(3, "0")}`,
  })),

  // Spring Rolls transactions (menuItemId: 8) - targeting ~54 units
  ...Array.from({ length: 18 }, (_, i) => ({
    id: 400 + i,
    menuItemId: 8,
    quantity: Math.floor(Math.random() * 4) + 1,
    timestamp: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(
      2,
      "0"
    )}T${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(
      Math.floor(Math.random() * 60)
    ).padStart(2, "0")}:00Z`,
    orderId: `ORD${String(400 + i).padStart(3, "0")}`,
  })),

  // Nachos transactions (menuItemId: 6) - targeting ~42 units
  ...Array.from({ length: 15 }, (_, i) => ({
    id: 500 + i,
    menuItemId: 6,
    quantity: Math.floor(Math.random() * 3) + 1,
    timestamp: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(
      2,
      "0"
    )}T${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(
      Math.floor(Math.random() * 60)
    ).padStart(2, "0")}:00Z`,
    orderId: `ORD${String(500 + i).padStart(3, "0")}`,
  })),

  // Chocolate Cake transactions (menuItemId: 5) - targeting ~38 units
  ...Array.from({ length: 12 }, (_, i) => ({
    id: 600 + i,
    menuItemId: 5,
    quantity: Math.floor(Math.random() * 4) + 1,
    timestamp: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(
      2,
      "0"
    )}T${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(
      Math.floor(Math.random() * 60)
    ).padStart(2, "0")}:00Z`,
    orderId: `ORD${String(600 + i).padStart(3, "0")}`,
  })),

  // Fresh Orange Juice transactions (menuItemId: 4) - targeting ~34 units
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 700 + i,
    menuItemId: 4,
    quantity: Math.floor(Math.random() * 4) + 1,
    timestamp: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(
      2,
      "0"
    )}T${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(
      Math.floor(Math.random() * 60)
    ).padStart(2, "0")}:00Z`,
    orderId: `ORD${String(700 + i).padStart(3, "0")}`,
  })),
];

// Helper function to get menu item details
const getMenuItem = (menuItemId) => {
  return menuItems.find((item) => item.id === menuItemId);
};

// Helper function to compute sales summary from transactions
export const computeSalesSummary = () => {
  const summary = {};

  // Group transactions by menu item
  salesTransactions.forEach((transaction) => {
    const menuItemId = transaction.menuItemId;

    if (!summary[menuItemId]) {
      summary[menuItemId] = {
        menuItemId,
        transactions: [],
        totalUnits: 0,
        totalRevenue: 0,
      };
    }

    summary[menuItemId].transactions.push(transaction);
    summary[menuItemId].totalUnits += transaction.quantity;
  });

  // Calculate revenue for each item
  Object.values(summary).forEach((item) => {
    const menuItem = getMenuItem(item.menuItemId);
    if (menuItem) {
      item.totalRevenue = item.totalUnits * menuItem.price;
      item.menuItem = menuItem;
    }
  });

  // Convert to array and sort by total units sold
  const summaryArray = Object.values(summary)
    .filter((item) => item.menuItem) // Only include items that exist in menu
    .sort((a, b) => b.totalUnits - a.totalUnits)
    .map((item, index) => ({
      id: index + 1,
      menuItemId: item.menuItemId,
      unitsSold: item.totalUnits,
      revenue: item.totalRevenue,
      rank: index + 1,
      itemName: item.menuItem.name,
      itemDescription: item.menuItem.description,
      itemPrice: item.menuItem.price,
      itemCategory: item.menuItem.category,
      itemImage: item.menuItem.image,
      isAvailable: item.menuItem.isAvailable,
      transactionCount: item.transactions.length,
      // Calculate growth (simulated based on rank for demo purposes)
      growth:
        index === 0
          ? 12.5
          : index === 1
          ? 8.3
          : index === 2
          ? -2.1
          : index === 3
          ? 15.2
          : index === 4
          ? 6.7
          : index === 5
          ? 4.2
          : index === 6
          ? -1.5
          : index === 7
          ? 9.8
          : 0,
    }));

  return summaryArray;
};

// Legacy compatibility functions (these now compute from transactions)
export const getEnrichedSalesData = () => {
  return computeSalesSummary();
};

export const getTopSellingItems = (limit = 5) => {
  return computeSalesSummary()
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit);
};

export const getSalesByCategory = (category) => {
  return computeSalesSummary()
    .filter((item) => item.itemCategory === category)
    .sort((a, b) => b.unitsSold - a.unitsSold);
};

export const getTotalRevenue = () => {
  return computeSalesSummary().reduce((total, item) => total + item.revenue, 0);
};

export const getTotalUnitsSold = () => {
  return salesTransactions.reduce(
    (total, transaction) => total + transaction.quantity,
    0
  );
};

// New helper functions for transaction-level analysis
export const getTransactionsByDateRange = (startDate, endDate) => {
  return salesTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.timestamp);
    return (
      transactionDate >= new Date(startDate) &&
      transactionDate <= new Date(endDate)
    );
  });
};

export const getTransactionsByMenuItem = (menuItemId) => {
  return salesTransactions.filter(
    (transaction) => transaction.menuItemId === menuItemId
  );
};

export const getDailySales = () => {
  const dailySales = {};

  salesTransactions.forEach((transaction) => {
    const date = transaction.timestamp.split("T")[0]; // Get YYYY-MM-DD
    const menuItem = getMenuItem(transaction.menuItemId);

    if (!dailySales[date]) {
      dailySales[date] = {
        date,
        totalUnits: 0,
        totalRevenue: 0,
        transactions: [],
      };
    }

    dailySales[date].totalUnits += transaction.quantity;
    if (menuItem) {
      dailySales[date].totalRevenue += transaction.quantity * menuItem.price;
    }
    dailySales[date].transactions.push(transaction);
  });

  return Object.values(dailySales).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};

export const getHourlySales = () => {
  const hourlySales = {};

  salesTransactions.forEach((transaction) => {
    const hour = new Date(transaction.timestamp).getHours();
    const menuItem = getMenuItem(transaction.menuItemId);

    if (!hourlySales[hour]) {
      hourlySales[hour] = {
        hour,
        totalUnits: 0,
        totalRevenue: 0,
        transactionCount: 0,
      };
    }

    hourlySales[hour].totalUnits += transaction.quantity;
    hourlySales[hour].transactionCount += 1;
    if (menuItem) {
      hourlySales[hour].totalRevenue += transaction.quantity * menuItem.price;
    }
  });

  return Object.values(hourlySales).sort((a, b) => a.hour - b.hour);
};

// Analytics dashboard specific functions
export const getTodaysAnalytics = () => {
  const today = new Date().toISOString().split("T")[0];
  const todaysTransactions = salesTransactions.filter((transaction) =>
    transaction.timestamp.startsWith(today)
  );

  const totalRevenue = todaysTransactions.reduce((total, transaction) => {
    const menuItem = getMenuItem(transaction.menuItemId);
    return total + (menuItem ? transaction.quantity * menuItem.price : 0);
  }, 0);

  const totalOrders = new Set(todaysTransactions.map((t) => t.orderId)).size;

  return {
    revenue: 5600, // Demo data
    revenueGrowth: 6.0,
    orders: 50,
    ordersGrowth: -9.6,
    completionRate: 94,
    avgOrderTime: 24,
    totalCustomers: 1847,
    newCustomersToday: 8,
  };
};

export const getPopularMenuItems = () => {
  // Using demo data to match the design exactly
  return [
    { id: 1, name: "Margherita Pizza", orders: 23, revenue: 2184 },
    { id: 2, name: "Silog", orders: 18, revenue: 1680 },
    { id: 3, name: "Coffee", orders: 15, revenue: 1400 },
    { id: 4, name: "Cookie", orders: 12, revenue: 1288 },
    { id: 5, name: "Siomai", orders: 10, revenue: 1120 },
  ];
};

export const getHourlyPerformance = () => {
  // Demo data to match the design exactly
  return [
    { hour: 8, orders: 9, revenue: 2145 },
    { hour: 9, orders: 13, revenue: 2548 },
    { hour: 10, orders: 17, revenue: 5502 },
    { hour: 11, orders: 22, revenue: 8778 },
    { hour: 12, orders: 35, revenue: 14970 },
    { hour: 13, orders: 25, revenue: 11098 },
    { hour: 14, orders: 19, revenue: 7546 },
    { hour: 15, orders: 11, revenue: 4900 },
    { hour: 16, orders: 19, revenue: 2240 },
    { hour: 17, orders: 9, revenue: 2105 },
  ];
};
