import allcustomersDemoData from "./allcustomersDemoData.js";

// Demo data simulating a MySQL complaints database structure
// This creates a relational connection to the existing customer data
const complaintsDemoData = [
  {
    complaint_id: "COMP-001",
    customer_id: "CUST001", // References allcustomersDemoData
    title: "Main complaint/ topic",
    description: "Complaint details",
    category: "App Issue",
    status: "open", // open, resolved, pending
    priority: "medium", // low, medium, high
    created_date: "2024-01-08T10:30:00Z",
    updated_date: "2024-01-08T10:30:00Z",
    resolved_date: null,
    admin_responses: [],
  },
  {
    complaint_id: "COMP-002",
    customer_id: "CUST002", // References Jane Smith
    title: "Pickup took much longer than estimated",
    description:
      "Was told my order would be ready at 12:30 PM but had to wait until 12:50 PM. This made me late for my meeting.",
    category: "Pickup Delay",
    status: "resolved",
    priority: "high",
    created_date: "2024-01-07T12:55:00Z",
    updated_date: "2024-01-08T10:18:00Z",
    resolved_date: "2024-01-08T10:18:00Z",
    admin_responses: [
      {
        response_id: "RESP-001",
        admin_id: "ADMIN-001",
        admin_name: "Admin",
        response_text:
          "Thank you for bringing this to our attention. We sincerely apologize for the cold food. We are reviewing our warming procedures to prevent this from happening again.",
        response_date: "2024-01-08T10:18:00Z",
      },
    ],
    resolution:
      "Apologized to customer and provided 10% discount on next order. Reviewed kitchen timing procedures.",
  },
  {
    complaint_id: "COMP-003",
    customer_id: "CUST003", // References Mike Johnson
    title: "Food was cold when delivered",
    description:
      "Ordered lunch delivery and the food arrived completely cold. Very disappointing experience.",
    category: "Food Quality",
    status: "open",
    priority: "high",
    created_date: "2024-01-08T14:20:00Z",
    updated_date: "2024-01-08T14:20:00Z",
    resolved_date: null,
    admin_responses: [],
  },
  {
    complaint_id: "COMP-004",
    customer_id: "CUST004", // References Sarah Wilson
    title: "App keeps crashing during checkout",
    description:
      "Every time I try to complete my order, the app crashes and I have to start over. Very frustrating!",
    category: "App Issue",
    status: "open",
    priority: "medium",
    created_date: "2024-01-08T16:45:00Z",
    updated_date: "2024-01-08T16:45:00Z",
    resolved_date: null,
    admin_responses: [],
  },
  {
    complaint_id: "COMP-005",
    customer_id: "CUST005", // References David Brown
    title: "Charged twice for the same order",
    description:
      "I was charged twice on my credit card for order #12345. Please refund the duplicate charge immediately.",
    category: "Billing",
    status: "resolved",
    priority: "high",
    created_date: "2024-01-06T09:30:00Z",
    updated_date: "2024-01-07T14:22:00Z",
    resolved_date: "2024-01-07T14:22:00Z",
    admin_responses: [
      {
        response_id: "RESP-002",
        admin_id: "ADMIN-001",
        admin_name: "Admin",
        response_text:
          "We have identified the duplicate charge and processed a full refund. You should see the credit within 3-5 business days. We apologize for the inconvenience.",
        response_date: "2024-01-07T14:22:00Z",
      },
    ],
    resolution:
      "Refunded duplicate charge. Updated payment processing to prevent future duplicate charges.",
  },
  {
    complaint_id: "COMP-006",
    customer_id: "CUST006", // References Lisa Garcia
    title: "Rude delivery driver",
    description:
      "The delivery driver was very rude and unprofessional. He threw my food at the door and left without saying anything.",
    category: "Service",
    status: "open",
    priority: "high",
    created_date: "2024-01-08T19:20:00Z",
    updated_date: "2024-01-08T19:20:00Z",
    resolved_date: null,
    admin_responses: [],
  },
  {
    complaint_id: "COMP-007",
    customer_id: "CUST007", // References Robert Martinez
    title: "Missing items in delivery",
    description:
      "I ordered 3 items but only received 2. The missing item was the most expensive one. This is unacceptable.",
    category: "Service",
    status: "resolved",
    priority: "medium",
    created_date: "2024-01-05T18:30:00Z",
    updated_date: "2024-01-06T11:15:00Z",
    resolved_date: "2024-01-06T11:15:00Z",
    admin_responses: [
      {
        response_id: "RESP-003",
        admin_id: "ADMIN-001",
        admin_name: "Admin",
        response_text:
          "We sincerely apologize for the missing item. We have processed a full refund for the missing item and sent a replacement order at no charge.",
        response_date: "2024-01-06T11:15:00Z",
      },
    ],
    resolution:
      "Refunded missing item and sent replacement order. Updated order verification procedures.",
  },
  {
    complaint_id: "COMP-008",
    customer_id: "CUST008", // References Amanda Lee
    title: "Cannot update payment method",
    description:
      "I've been trying to update my payment method for weeks but the app won't let me. Please fix this bug.",
    category: "App Issue",
    status: "open",
    priority: "low",
    created_date: "2024-01-07T21:10:00Z",
    updated_date: "2024-01-07T21:10:00Z",
    resolved_date: null,
    admin_responses: [],
  },
];

export default complaintsDemoData;
