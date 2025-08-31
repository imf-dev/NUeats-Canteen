// src/demodata/salesDemoData.js
import { menuItems } from "./menuDemoData.js";

// Sales data with references to menu item IDs (relational structure)
export const salesData = [
  {
    id: 1,
    menuItemId: 1, // References Chop Suey
    unitsSold: 145,
    growth: 12.5,
    rank: 1,
  },
  {
    id: 2,
    menuItemId: 3, // References Fried Rice
    unitsSold: 98,
    growth: 8.3,
    rank: 2,
  },
  {
    id: 3,
    menuItemId: 7, // References Iced Coffee
    unitsSold: 87,
    growth: -2.1,
    rank: 3,
  },
  {
    id: 4,
    menuItemId: 2, // References Cookies
    unitsSold: 76,
    growth: 15.2,
    rank: 4,
  },
  {
    id: 5,
    menuItemId: 8, // References Spring Rolls
    unitsSold: 54,
    growth: 6.7,
    rank: 5,
  },
  {
    id: 6,
    menuItemId: 6, // References Nachos
    unitsSold: 42,
    growth: 4.2,
    rank: 6,
  },
  {
    id: 7,
    menuItemId: 5, // References Chocolate Cake
    unitsSold: 38,
    growth: -1.5,
    rank: 7,
  },
  {
    id: 8,
    menuItemId: 4, // References Fresh Orange Juice
    unitsSold: 34,
    growth: 9.8,
    rank: 8,
  },
];

// Helper function to get enriched sales data with menu item details
export const getEnrichedSalesData = () => {
  return salesData
    .map((sale) => {
      const menuItem = menuItems.find((item) => item.id === sale.menuItemId);
      if (!menuItem) return null;

      return {
        ...sale,
        itemName: menuItem.name,
        itemDescription: menuItem.description,
        itemPrice: menuItem.price,
        itemCategory: menuItem.category,
        itemImage: menuItem.image,
        isAvailable: menuItem.isAvailable,
        revenue: sale.unitsSold * menuItem.price,
      };
    })
    .filter(Boolean); // Remove any null entries
};

// Helper function to get top selling items (default top 5)
export const getTopSellingItems = (limit = 5) => {
  return getEnrichedSalesData()
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit);
};

// Helper function to get sales data by category
export const getSalesByCategory = (category) => {
  return getEnrichedSalesData()
    .filter((item) => item.itemCategory === category)
    .sort((a, b) => b.unitsSold - a.unitsSold);
};

// Helper function to get total revenue
export const getTotalRevenue = () => {
  return getEnrichedSalesData().reduce(
    (total, item) => total + item.revenue,
    0
  );
};

// Helper function to get total units sold
export const getTotalUnitsSold = () => {
  return salesData.reduce((total, sale) => total + sale.unitsSold, 0);
};
