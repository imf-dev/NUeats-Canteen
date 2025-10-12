// Quick script to check order_cancellations table
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
  console.log("🔍 Checking order_cancellations table...\n");

  // Get all cancelled orders
  const { data: cancelledOrders, error: ordersError } = await supabase
    .from("orders")
    .select("order_id, status, created_at")
    .eq("status", "Cancelled");

  if (ordersError) {
    console.error("❌ Error fetching cancelled orders:", ordersError);
    return;
  }

  console.log(`Found ${cancelledOrders?.length || 0} cancelled orders\n`);

  // Get all cancellation records
  const { data: cancellations, error: cancelError } = await supabase
    .from("order_cancellations")
    .select("*");

  if (cancelError) {
    console.error("❌ Error fetching cancellations:", cancelError);
    return;
  }

  console.log(`Found ${cancellations?.length || 0} cancellation records\n`);

  if (cancellations && cancellations.length > 0) {
    console.log("📋 Sample cancellation records:");
    cancellations.slice(0, 3).forEach((c) => {
      console.log(`  Order #${c.order_id}: ${c.reason}`);
      if (c.additional_notes) {
        console.log(`    Notes: ${c.additional_notes}`);
      }
    });
  } else {
    console.log("⚠️  No cancellation records found!");
    console.log("💡 Run 'npm run seed' to populate the database with test data");
  }

  // Check for cancelled orders without cancellation records
  if (cancelledOrders && cancelledOrders.length > 0) {
    const cancellationOrderIds = new Set(
      (cancellations || []).map((c) => c.order_id)
    );
    const missingCancellations = cancelledOrders.filter(
      (o) => !cancellationOrderIds.has(o.order_id)
    );

    if (missingCancellations.length > 0) {
      console.log(
        `\n⚠️  Found ${missingCancellations.length} cancelled orders WITHOUT cancellation records:`
      );
      missingCancellations.slice(0, 5).forEach((o) => {
        console.log(`  Order #${o.order_id}`);
      });
      console.log("\n💡 Run 'npm run seed' to fix this");
    }
  }
}

check().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});

