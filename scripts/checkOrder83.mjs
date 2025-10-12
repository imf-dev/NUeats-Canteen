// Quick script to check a specific order
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function check() {
  console.log("🔍 Checking Order #83...\n");

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", 83)
    .single();

  if (orderError) {
    console.error("❌ Error fetching order:", orderError);
    return;
  }

  console.log("📋 Order #83:");
  console.log(`  Status: ${order.status}`);
  console.log(`  User ID: ${order.user_id}`);
  console.log(`  Created: ${order.created_at}`);

  // Get cancellation record
  const { data: cancellation, error: cancelError } = await supabase
    .from("order_cancellations")
    .select("*")
    .eq("order_id", 83)
    .single();

  if (cancelError) {
    if (cancelError.code === "PGRST116") {
      console.error("\n❌ No cancellation record found for Order #83!");
      console.log("💡 This order is cancelled but has no cancellation record.");
    } else {
      console.error("\n❌ Error fetching cancellation:", cancelError);
    }
    return;
  }

  console.log("\n✅ Cancellation record found:");
  console.log(`  Reason: ${cancellation.reason}`);
  console.log(`  Additional Notes: ${cancellation.additional_notes || "(none)"}`);
  console.log(`  Cancelled At: ${cancellation.cancelled_at}`);
}

check().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});

