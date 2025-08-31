// src/demodata/menuDemoData.js

export const menuItems = [
  {
    id: 1,
    name: "Chop Suey",
    description:
      "A delicious and healthy Chop Suey with thick yummy sauce good for special occasions or for an everyday healthy meal.",
    price: 120,
    category: "Meals",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Cookies",
    description:
      "A sweet and chewy cookie baked to perfection, perfect for a quick treat or to share on any occasion.",
    price: 25,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isAvailable: false,
  },
  {
    id: 3,
    name: "Fried Rice",
    description:
      "Perfectly seasoned fried rice with mixed vegetables and your choice of protein. A satisfying meal for any time of day.",
    price: 95,
    category: "Meals",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isAvailable: true,
  },
  {
    id: 4,
    name: "Fresh Orange Juice",
    description:
      "Freshly squeezed orange juice packed with vitamin C. The perfect refreshing drink to start your day.",
    price: 45,
    category: "Beverages",
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isAvailable: true,
  },
  {
    id: 5,
    name: "Chocolate Cake",
    description:
      "Rich and moist chocolate cake layered with creamy frosting. Perfect for celebrations and special moments.",
    price: 150,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isAvailable: true,
  },
  {
    id: 6,
    name: "Nachos",
    description:
      "Crispy tortilla chips loaded with cheese, jalapeños, and your favorite toppings. Perfect for sharing.",
    price: 85,
    category: "Snacks",
    image:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isAvailable: false,
  },
  {
    id: 7,
    name: "Iced Coffee",
    description:
      "Premium coffee served over ice with your choice of milk and sweetener. The perfect pick-me-up drink.",
    price: 65,
    category: "Beverages",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isAvailable: true,
  },
  {
    id: 8,
    name: "Spring Rolls",
    description:
      "Fresh and crispy spring rolls filled with vegetables and served with our signature dipping sauce.",
    price: 75,
    category: "Snacks",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    isAvailable: true,
  },
];

export const categories = [
  "All",
  "Meals",
  "Snacks",
  "Beverages",
  "Desserts",
  "Unavailable",
];

// Optional: Menu item structure for reference/validation
export const menuItemSchema = {
  id: "number", // Primary key
  name: "string", // Menu item name
  description: "string", // Menu item description
  price: "number", // Price in your currency
  category: "string", // Category (Meals, Snacks, etc.)
  image: "string", // Image URL
  isAvailable: "boolean", // Availability status
  // Future fields your backend dev might add:
  // createdAt: "datetime",
  // updatedAt: "datetime",
  // ingredients: "array",
  // allergens: "array",
  // nutritionInfo: "object",
  // preparationTime: "number",
  // calories: "number"
};
