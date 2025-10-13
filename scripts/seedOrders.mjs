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
  "e680211f-776e-4002-95d7-ed54f6c4a9da",
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

// Create weighted distribution for menu items (some are more popular)
const menuItemWeights = [];
let totalWeight = 0;

// Assign weights: first item gets 20%, second gets 10%, rest decrease exponentially
for (let i = 0; i < availableMenuItems.length; i++) {
  let weight;
  if (i === 0) weight = 20; // 20% most popular
  else if (i === 1) weight = 10; // 10% second most popular
  else if (i === 2) weight = 8;
  else if (i === 3) weight = 7;
  else if (i === 4) weight = 6;
  else if (i === 5) weight = 5;
  else weight = Math.max(1, 5 - (i - 5) * 0.5); // Decreasing weights for rest
  
  totalWeight += weight;
  menuItemWeights.push({ item: availableMenuItems[i], weight, cumulativeWeight: totalWeight });
}

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
 * Pick a menu item using weighted random selection
 */
function weightedRandomMenuItem() {
  const rand = Math.random() * totalWeight;
  for (const entry of menuItemWeights) {
    if (rand <= entry.cumulativeWeight) {
      return entry.item;
    }
  }
  return availableMenuItems[0]; // Fallback
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
    // Pick a unique menu item for this order using weighted selection
    let menuItem;
    let attempts = 0;
    do {
      menuItem = weightedRandomMenuItem(); // Use weighted selection
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
 * Generate rating for a completed order
 */
function generateRating(orderId, createdAt) {
  const stars = randomInt(1, 5);
  
  // Higher ratings are more likely to have feedback
  const shouldHaveFeedback = stars >= 4 ? Math.random() < 0.4 : Math.random() < 0.7;
  
  const positiveFeedbacks = [
    "Great food and fast service!",
    "Delicious meal, will order again.",
    "Perfect portion size and taste.",
    "Always consistent quality.",
    "My favorite canteen!",
    "Fast preparation and friendly staff.",
    "Worth the price, highly recommended.",
    "Fresh ingredients and well-cooked.",
  ];
  
  const neutralFeedbacks = [
    "It was okay, nothing special.",
    "Average food quality.",
    "Good but could be better.",
    "Decent meal for the price.",
  ];
  
  const negativeFeedbacks = [
    "Food was cold when I received it.",
    "Portion size was smaller than expected.",
    "Too salty for my taste.",
    "Long wait time.",
    "Not as good as before.",
    "Expected better quality.",
    "Service could be improved.",
    "Disappointed with the taste.",
  ];
  
  let feedback = null;
  if (shouldHaveFeedback) {
    if (stars >= 4) {
      feedback = randomPick(positiveFeedbacks);
    } else if (stars === 3) {
      feedback = randomPick(neutralFeedbacks);
    } else {
      feedback = randomPick(negativeFeedbacks);
    }
  }
  
  // Rating created a few minutes to a few hours after order
  const ratingCreatedAt = new Date(createdAt);
  ratingCreatedAt.setMinutes(ratingCreatedAt.getMinutes() + randomInt(15, 180));
  
  return {
    order_id: orderId,
    stars: stars,
    feedback: feedback,
    created_at: ratingCreatedAt.toISOString(),
    updated_at: ratingCreatedAt.toISOString(),
  };
}

/**
 * Main seeding function
 */
async function seed() {
  console.log("🌱 Seeding orders, order_items, payments, and ratings (excluding today)...");

  // Clear existing data (in correct order due to foreign key constraints)
  console.log("\n🧹 Clearing existing data...");
  
  const { error: ratingsDeleteError } = await supabase
    .from("ratings")
    .delete()
    .neq("rating_id", 0); // Delete all ratings
  
  if (ratingsDeleteError) {
    console.error("⚠️  Warning: Could not clear ratings:", ratingsDeleteError.message);
  } else {
    console.log("✅ Cleared ratings");
  }

  const { error: cancellationsDeleteError } = await supabase
    .from("order_cancellations")
    .delete()
    .neq("cancellation_id", 0); // Delete all cancellations
  
  if (cancellationsDeleteError) {
    console.error("⚠️  Warning: Could not clear order_cancellations:", cancellationsDeleteError.message);
  } else {
    console.log("✅ Cleared order_cancellations");
  }

  const { error: paymentsDeleteError } = await supabase
    .from("payments")
    .delete()
    .neq("payment_id", 0); // Delete all payments
  
  if (paymentsDeleteError) {
    console.error("⚠️  Warning: Could not clear payments:", paymentsDeleteError.message);
  } else {
    console.log("✅ Cleared payments");
  }

  const { error: itemsDeleteError } = await supabase
    .from("order_items")
    .delete()
    .neq("order_item_id", 0); // Delete all order items
  
  if (itemsDeleteError) {
    console.error("⚠️  Warning: Could not clear order_items:", itemsDeleteError.message);
  } else {
    console.log("✅ Cleared order_items");
  }

  const { error: ordersDeleteError } = await supabase
    .from("orders")
    .delete()
    .neq("order_id", 0); // Delete all orders
  
  if (ordersDeleteError) {
    console.error("⚠️  Warning: Could not clear orders:", ordersDeleteError.message);
  } else {
    console.log("✅ Cleared orders");
  }

  const orders = [];
  const allOrderItems = [];
  const payments = [];
  const ratings = [];
  const cancellations = [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let orderIdCounter = 1;

  // Cancellation reasons
  const CANCEL_REASONS = [
    "Customer requested cancellation",
    "Payment failed",
    "Item out of stock",
    "Customer changed mind",
    "Duplicate order",
    "Long wait time",
    "Wrong order placed",
    "Store closing early",
  ];

  const CANCEL_NOTES = [
    "Customer called to cancel",
    "Payment processing timeout",
    "Informed customer via phone",
    "Refund processed",
    "No response from customer",
    "Kitchen issue - unable to prepare",
    null, // Some orders may not have additional notes
    null,
    null,
  ];

  // Generate orders for the past 6 days (excluding today)
  for (let dayOffset = 6; dayOffset >= 1; dayOffset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);

    // Determine number of orders for this day
    let numOrdersForDay;
    
    // Past days: 12-16 orders per day (~72-96 total for the week)
    numOrdersForDay = randomInt(12, 16);

    console.log(`  📅 Generating ${numOrdersForDay} orders for ${date.toDateString()}...`);

    for (let i = 0; i < numOrdersForDay; i++) {
      const orderId = orderIdCounter++;
      const userId = randomPick(USER_IDS);
      const paymentMethod = randomPick(PAYMENT_METHODS);
      const createdAt = randomTimeInBusinessHours(date);

      // Determine order status
      let orderStatus;
      // Past orders: mostly Completed, some Cancelled
      const rand = Math.random();
      if (rand < 0.85) {
        // 85% Completed
        orderStatus = ORDER_STATUSES.COMPLETED;
      } else {
        // 15% Cancelled
        orderStatus = ORDER_STATUSES.CANCELLED;
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

      // Generate cancellation record for cancelled orders
      if (orderStatus === ORDER_STATUSES.CANCELLED) {
        const cancelledAt = new Date(createdAt);
        // Cancellation happens a few minutes after order was placed
        cancelledAt.setMinutes(cancelledAt.getMinutes() + randomInt(5, 30));
        
        const cancellation = {
          order_id: orderId,
          user_id: userId,
          reason: randomPick(CANCEL_REASONS),
          additional_notes: randomPick(CANCEL_NOTES),
          cancelled_at: cancelledAt.toISOString(),
        };
        cancellations.push(cancellation);
      }

      // Generate rating for completed orders (80% of completed orders get rated)
      if (orderStatus === ORDER_STATUSES.COMPLETED && Math.random() < 0.8) {
        const rating = generateRating(orderId, createdAt);
        ratings.push(rating);
      }
    }
  }

  console.log(`\n📊 Generated (past 6 days, excluding today):`);
  console.log(`   ${orders.length} orders`);
  console.log(`   ${allOrderItems.length} order items`);
  console.log(`   ${payments.length} payments`);
  console.log(`   ${cancellations.length} cancellations`);
  console.log(`   ${ratings.length} ratings`);

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

  // Insert cancellations
  if (cancellations.length > 0) {
    console.log("\n💾 Inserting cancellations...");
    const { data: cancellationData, error: cancellationError } = await supabase
      .from("order_cancellations")
      .insert(cancellations)
      .select("cancellation_id");

    if (cancellationError) {
      console.error("❌ Failed to insert cancellations:", cancellationError);
      process.exit(1);
    }
    console.log(`✅ Inserted ${cancellationData?.length ?? 0} cancellations`);
  }

  // Insert ratings
  if (ratings.length > 0) {
    console.log("\n💾 Inserting ratings...");
    const { data: ratingData, error: ratingError } = await supabase
      .from("ratings")
      .insert(ratings)
      .select("rating_id");

    if (ratingError) {
      console.error("❌ Failed to insert ratings:", ratingError);
      process.exit(1);
    }
    console.log(`✅ Inserted ${ratingData?.length ?? 0} ratings`);
  }

  console.log("\n🎉 Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("💥 Unexpected error while seeding:", err);
  process.exit(1);
});
