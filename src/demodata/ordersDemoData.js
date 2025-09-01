// Demo data for orders - replace with actual API calls later
export const ordersData = [
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
