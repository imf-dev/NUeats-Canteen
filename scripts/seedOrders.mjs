// scripts/seedOrders.mjs
import "dotenv/config";
// Seed the orders, order_items, and payments tables in Supabase

import { createClient } from "@supabase/supabase-js";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Resolve project root to import the demo data reliably
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Import menu demo data (ESM) - convert Windows path to file:// URL for Node ESM loader
const demoDataPath = path.join(projectRoot, "src/demodata/menuDemoData.js");
const demoDataUrl = pathToFileURL(demoDataPath).href;
const { menuItems } = await import(demoDataUrl);

// Read env vars
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error("❌ SUPABASE_URL (or VITE_SUPABASE_URL) is not set in the environment.");
  process.exit(1);
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is not set in the environment.");
  console.error("   Create a service role key in Supabase and set it before running this script.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// User IDs
const USER_IDS = [
  "667c3e89-f82e-4509-8dfa-811bb214bf26",
  "ae7c8e68-af55-49da-af66-c7a18f069694",
];

// Payment methods
const PAYMENT_METHODS = ["Cash", "Paymongo"];

// Order statuses
const ORDER_STATUSES = {
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
  PREPARING: "Preparing",
  READY: "Ready",
};

// Payment statuses
const PAYMENT_STATUSES = {
  PAID: "paid",
  FAILED: "failed",
  PENDING: "pending",
  PROCESSING: "processing",
  CANCELLED: "cancelled",
};

// Available menu items (filter out unavailable ones)
const availableMenuItems = menuItems.filter((item) => item.isAvailable);

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random element from an array
 */
function randomPick(array) {
  return array[randomInt(0, array.length - 1)];
}

/**
 * Generate a random time between 8am and 5pm on a given date
 */
function randomTimeInBusinessHours(date) {
  const hour = randomInt(8, 16); // 8am to 4pm (so orders can be at 4:59pm)
  const minute = randomInt(0, 59);
  const second = randomInt(0, 59);
  
  const newDate = new Date(date);
  newDate.setHours(hour, minute, second, 0);
  return newDate;
}

/**
 * Generate order items for a single order
 */
function generateOrderItems(orderId, orderIdCounter) {
  const numItems = randomInt(1, 4); // 1-4 items per order
  const items = [];
  const usedProductIds = new Set();

  for (let i = 0; i < numItems; i++) {
    // Pick a unique menu item for this order
    let menuItem;
    let attempts = 0;
    do {
      menuItem = randomPick(availableMenuItems);
      attempts++;
    } while (usedProductIds.has(menuItem.id) && attempts < 10);

    if (usedProductIds.has(menuItem.id)) continue; // Skip if we can't find unique item

    usedProductIds.add(menuItem.id);

    const quantity = randomInt(1, 3);
    items.push({
      order_id: orderId,
      product_id: menuItem.id,
      quantity: quantity,
      price: menuItem.price,
    });
  }

  return items;
}

/**
 * Calculate total amount for order items
 */
function calculateTotalAmount(orderItems) {
  return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Generate payment for an order
 */
function generatePayment(orderId, userId, paymentMethod, totalAmount, orderStatus, createdAt) {
  let paymentStatus;
  let provider = null;
  let providerIntentId = null;
  let providerReference = null;
  let failureReason = null;
  let metadata = {};

  // Determine payment status based on order status
  if (orderStatus === ORDER_STATUSES.COMPLETED) {
    paymentStatus = PAYMENT_STATUSES.PAID;
  } else if (orderStatus === ORDER_STATUSES.CANCELLED) {
    // Cancelled orders can have failed or cancelled payments
    paymentStatus = Math.random() > 0.5 ? PAYMENT_STATUSES.FAILED : PAYMENT_STATUSES.CANCELLED;
    if (paymentStatus === PAYMENT_STATUSES.FAILED) {
      failureReason = randomPick([
        "Insufficient funds",
        "Payment declined",
        "Transaction timeout",
        "User cancelled",
      ]);
    }
  } else {
    // Pending, Preparing, Ready orders have pending or processing payments
    paymentStatus = Math.random() > 0.5 ? PAYMENT_STATUSES.PENDING : PAYMENT_STATUSES.PROCESSING;
  }

  // Set provider details for Paymongo payments
  if (paymentMethod === "Paymongo") {
    provider = "paymongo";
    if (paymentStatus === PAYMENT_STATUSES.PAID) {
      providerIntentId = `pi_${generateRandomId(24)}`;
      providerReference = `ref_${generateRandomId(16)}`;
      metadata = {
        payment_method_type: randomPick(["gcash", "card", "grab_pay"]),
        payment_intent_id: providerIntentId,
      };
    } else if (paymentStatus === PAYMENT_STATUSES.PENDING || paymentStatus === PAYMENT_STATUSES.PROCESSING) {
      providerIntentId = `pi_${generateRandomId(24)}`;
      metadata = {
        payment_method_type: randomPick(["gcash", "card", "grab_pay"]),
        payment_intent_id: providerIntentId,
      };
    }
  } else {
    // Cash payments
    provider = "cash";
    metadata = {
      payment_method_type: "cash",
    };
  }

  return {
    order_id: orderId,
    user_id: userId,
    method: paymentMethod,
    amount: totalAmount,
    status: paymentStatus,
    provider: provider,
    provider_intent_id: providerIntentId,
    provider_reference: providerReference,
    failure_reason: failureReason,
    metadata: metadata,
    created_at: createdAt.toISOString(),
    updated_at: createdAt.toISOString(),
  };
}

/**
 * Generate a random alphanumeric ID
 */
function generateRandomId(length) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Main seeding function
 */
async function seed() {
  console.log("🌱 Seeding orders, order_items, and payments...");

  const orders = [];
  const allOrderItems = [];
  const payments = [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let orderIdCounter = 1;

  // Generate orders for the past 7 days
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);

    // Determine number of orders for this day
    let numOrdersForDay;
    let numCompletedToday = 0;
    let numActiveToday = 0;
    
    if (dayOffset === 0) {
      // Today: some completed orders + 5 active/current orders
      numCompletedToday = randomInt(25, 40); // Completed orders for today
      numActiveToday = 5; // Active orders (Pending, Preparing, Ready)
      numOrdersForDay = numCompletedToday + numActiveToday;
    } else {
      // Past days: 40-80 orders
      numOrdersForDay = randomInt(40, 80);
    }

    console.log(`  📅 Generating ${numOrdersForDay} orders for ${date.toDateString()}...`);

    for (let i = 0; i < numOrdersForDay; i++) {
      const orderId = orderIdCounter++;
      const userId = randomPick(USER_IDS);
      const paymentMethod = randomPick(PAYMENT_METHODS);
      const createdAt = randomTimeInBusinessHours(date);

      // Determine order status
      let orderStatus;
      if (dayOffset === 0) {
        // Today's orders: first batch are completed, last 5 are active
        if (i < numCompletedToday) {
          // Completed orders (mostly completed, some cancelled)
          const rand = Math.random();
          if (rand < 0.85) {
            orderStatus = ORDER_STATUSES.COMPLETED;
          } else {
            orderStatus = ORDER_STATUSES.CANCELLED;
          }
        } else {
          // Active/current orders (Pending, Preparing, Ready)
          orderStatus = randomPick([
            ORDER_STATUSES.PENDING,
            ORDER_STATUSES.PREPARING,
            ORDER_STATUSES.READY,
          ]);
        }
      } else {
        // Past orders: mostly Completed, some Cancelled
        const rand = Math.random();
        if (rand < 0.85) {
          // 85% Completed
          orderStatus = ORDER_STATUSES.COMPLETED;
        } else {
          // 15% Cancelled
          orderStatus = ORDER_STATUSES.CANCELLED;
        }
      }

      // Generate order items
      const orderItems = generateOrderItems(orderId, orderIdCounter);
      const totalAmount = calculateTotalAmount(orderItems);

      // Create order
      const order = {
        order_id: orderId,
        user_id: userId,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: orderStatus,
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString(),
      };

      orders.push(order);
      allOrderItems.push(...orderItems);

      // Generate payment
      const payment = generatePayment(
        orderId,
        userId,
        paymentMethod,
        totalAmount,
        orderStatus,
        createdAt
      );
      payments.push(payment);
    }
  }

  console.log(`\n📊 Generated:`);
  console.log(`   ${orders.length} orders`);
  console.log(`   ${allOrderItems.length} order items`);
  console.log(`   ${payments.length} payments`);

  // Insert orders
  console.log("\n💾 Inserting orders...");
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .upsert(orders, { onConflict: "order_id" })
    .select("order_id");

  if (orderError) {
    console.error("❌ Failed to insert orders:", orderError);
    process.exit(1);
  }
  console.log(`✅ Inserted ${orderData?.length ?? 0} orders`);

  // Insert order items
  console.log("\n💾 Inserting order items...");
  const { data: itemData, error: itemError } = await supabase
    .from("order_items")
    .insert(allOrderItems)
    .select("order_item_id");

  if (itemError) {
    console.error("❌ Failed to insert order items:", itemError);
    process.exit(1);
  }
  console.log(`✅ Inserted ${itemData?.length ?? 0} order items`);

  // Insert payments
  console.log("\n💾 Inserting payments...");
  const { data: paymentData, error: paymentError } = await supabase
    .from("payments")
    .insert(payments)
    .select("payment_id");

  if (paymentError) {
    console.error("❌ Failed to insert payments:", paymentError);
    process.exit(1);
  }
  console.log(`✅ Inserted ${paymentData?.length ?? 0} payments`);

  console.log("\n🎉 Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("💥 Unexpected error while seeding:", err);
  process.exit(1);
});
