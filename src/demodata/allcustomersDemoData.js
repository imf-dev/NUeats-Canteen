// Demo data simulating a MySQL database structure
const allcustomersDemoData = [
  {
    customer_id: "CUST001",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@gmail.com",
    phone: "(+63) 123-4567",
    status: "active", // active, inactive, suspended
    account_info: {
      date_joined: "2025-09-02T08:30:00Z", // This week - new user
      last_login: "2025-09-08T14:22:00Z",
      last_app_activity: "2025-09-08T15:45:00Z",
    },
    order_summary: {
      total_orders: 47,
      last_order_date: "2025-09-08T12:00:00Z",
    },
  },
  {
    customer_id: "CUST002",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@gmail.com",
    phone: "(+63) 123-4567",
    status: "suspended",
    account_info: {
      date_joined: "2025-09-03T10:15:00Z", // This week - new user
      last_login: "2025-09-07T09:30:00Z",
      last_app_activity: "2025-09-07T11:20:00Z",
    },
    order_summary: {
      total_orders: 47,
      last_order_date: "2025-09-08T10:30:00Z",
    },
  },
  {
    customer_id: "CUST003",
    first_name: "Mike",
    last_name: "Johnson",
    email: "mike.johnson@gmail.com",
    phone: "(+63) 123-4567",
    status: "inactive",
    account_info: {
      date_joined: "2023-07-10T16:45:00Z",
      last_login: "2023-12-20T13:15:00Z",
      last_app_activity: "2023-12-20T14:30:00Z",
    },
    order_summary: {
      total_orders: 47,
      last_order_date: "2025-09-08T16:45:00Z",
    },
  },
  {
    customer_id: "CUST004",
    first_name: "Sarah",
    last_name: "Wilson",
    email: "sarah.wilson@gmail.com",
    phone: "(+63) 123-4567",
    status: "active",
    account_info: {
      date_joined: "2023-09-05T11:20:00Z",
      last_login: "2025-09-08T16:10:00Z",
      last_app_activity: "2025-09-08T17:25:00Z",
    },
    order_summary: {
      total_orders: 47,
      last_order_date: "2025-09-08T14:20:00Z",
    },
  },
  {
    customer_id: "CUST005",
    first_name: "David",
    last_name: "Brown",
    email: "david.brown@gmail.com",
    phone: "(+63) 123-4567",
    status: "suspended",
    account_info: {
      date_joined: "2023-02-18T09:30:00Z",
      last_login: "2025-09-06T12:45:00Z",
      last_app_activity: "2025-09-06T13:20:00Z",
    },
    order_summary: {
      total_orders: 47,
      last_order_date: "2025-09-08T09:15:00Z",
    },
  },
  {
    customer_id: "CUST006",
    first_name: "Lisa",
    last_name: "Garcia",
    email: "lisa.garcia@gmail.com",
    phone: "(+63) 123-4567",
    status: "active",
    account_info: {
      date_joined: "2023-06-12T14:00:00Z",
      last_login: "2025-09-08T18:30:00Z",
      last_app_activity: "2025-09-08T19:15:00Z",
    },
    order_summary: {
      total_orders: 47,
      last_order_date: "2025-09-08T11:40:00Z",
    },
  },
  {
    customer_id: "CUST007",
    first_name: "Robert",
    last_name: "Martinez",
    email: "robert.martinez@gmail.com",
    phone: "(+63) 123-4567",
    status: "inactive",
    account_info: {
      date_joined: "2023-04-28T07:45:00Z",
      last_login: "2023-11-15T10:20:00Z",
      last_app_activity: "2023-11-15T11:55:00Z",
    },
    order_summary: {
      total_orders: 47,
      last_order_date: "2025-09-08T13:25:00Z",
    },
  },
  {
    customer_id: "CUST008",
    first_name: "Amanda",
    last_name: "Lee",
    email: "amanda.lee@gmail.com",
    phone: "(+63) 123-4567",
    status: "active",
    account_info: {
      date_joined: "2023-08-14T12:30:00Z",
      last_login: "2025-09-08T20:15:00Z",
      last_app_activity: "2025-09-08T21:00:00Z",
    },
    order_summary: {
      total_orders: 47,
      last_order_date: "2025-09-08T15:50:00Z",
    },
  },
  // Adding more customers for this week to show more new users
  {
    customer_id: "CUST009",
    first_name: "Emily",
    last_name: "Davis",
    email: "emily.davis@gmail.com",
    phone: "(+63) 123-4567",
    status: "active",
    account_info: {
      date_joined: "2025-09-04T09:15:00Z", // This week - new user
      last_login: "2025-09-08T11:30:00Z",
      last_app_activity: "2025-09-08T12:45:00Z",
    },
    order_summary: {
      total_orders: 5,
      last_order_date: "2025-09-08T10:20:00Z",
    },
  },
  {
    customer_id: "CUST010",
    first_name: "Chris",
    last_name: "Taylor",
    email: "chris.taylor@gmail.com",
    phone: "(+63) 123-4567",
    status: "active",
    account_info: {
      date_joined: "2025-09-05T14:20:00Z", // This week - new user
      last_login: "2025-09-08T16:45:00Z",
      last_app_activity: "2025-09-08T17:30:00Z",
    },
    order_summary: {
      total_orders: 3,
      last_order_date: "2025-09-08T13:15:00Z",
    },
  },
  {
    customer_id: "CUST011",
    first_name: "Maria",
    last_name: "Rodriguez",
    email: "maria.rodriguez@gmail.com",
    phone: "(+63) 123-4567",
    status: "active",
    account_info: {
      date_joined: "2025-09-06T16:30:00Z", // This week - new user
      last_login: "2025-09-08T19:20:00Z",
      last_app_activity: "2025-09-08T20:10:00Z",
    },
    order_summary: {
      total_orders: 2,
      last_order_date: "2025-09-08T18:30:00Z",
    },
  },
  {
    customer_id: "CUST012",
    first_name: "Alex",
    last_name: "Thompson",
    email: "alex.thompson@gmail.com",
    phone: "(+63) 123-4567",
    status: "active",
    account_info: {
      date_joined: "2025-09-07T10:45:00Z", // This week - new user
      last_login: "2025-09-08T15:30:00Z",
      last_app_activity: "2025-09-08T16:15:00Z",
    },
    order_summary: {
      total_orders: 1,
      last_order_date: "2025-09-08T14:45:00Z",
    },
  },
  // Adding users from previous days for weekly data
  {
    customer_id: "CUST013",
    first_name: "Jessica",
    last_name: "White",
    email: "jessica.white@gmail.com",
    phone: "(+63) 123-4567",
    status: "active",
    account_info: {
      date_joined: "2025-09-01T08:00:00Z", // Last week
      last_login: "2025-09-08T12:30:00Z",
      last_app_activity: "2025-09-08T13:15:00Z",
    },
    order_summary: {
      total_orders: 8,
      last_order_date: "2025-09-08T11:20:00Z",
    },
  },
  {
    customer_id: "CUST014",
    first_name: "Kevin",
    last_name: "Anderson",
    email: "kevin.anderson@gmail.com",
    phone: "(+63) 123-4567",
    status: "active",
    account_info: {
      date_joined: "2025-08-31T15:30:00Z", // Last week
      last_login: "2025-09-08T17:45:00Z",
      last_app_activity: "2025-09-08T18:30:00Z",
    },
    order_summary: {
      total_orders: 12,
      last_order_date: "2025-09-08T16:45:00Z",
    },
  },
];

export default allcustomersDemoData;

/*
Note about MySQL and tracking last app activity:
Yes, with MySQL you can definitely track when users last opened your app! Here's how:

1. **last_login**: Track when user logs in by updating this timestamp during authentication
2. **last_app_activity**: Update this whenever user performs any action in the app (API calls, page views, etc.)
3. **session_tracking**: You can also create a sessions table to track detailed user activity

Common approaches:
- Update last_activity on every API request
- Use heartbeat/ping endpoints to track active sessions
- Track page views and user interactions
- Use WebSocket connections to monitor real-time activity

The data structure above mimics what you'd have in MySQL tables like:
- customers (main customer info)
- customer_activity (login/activity tracking) 
- orders (order history)
*/
