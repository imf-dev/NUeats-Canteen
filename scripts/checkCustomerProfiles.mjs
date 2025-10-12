// Script to check customer profiles in the database
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

async function checkCustomerProfiles() {
  console.log("🔍 Checking customer profiles in database...\n");

  try {
    // Get all profiles with customer role
    console.log("📊 Profiles with 'customer' role:");
    const { data: customerProfiles, error: customerError } = await supabase
      .from('profiles')
      .select('id, display_name, email, phone, role, created_at, is_suspended')
      .eq('role', 'customer');

    if (customerError) {
      console.error("❌ Error fetching customer profiles:", customerError);
      return;
    }

    console.log(`  Total customer profiles: ${customerProfiles?.length || 0}`);
    
    if (customerProfiles && customerProfiles.length > 0) {
      console.log("\n📋 Customer profiles:");
      customerProfiles.forEach((profile, index) => {
        console.log(`  ${index + 1}. ${profile.display_name || 'No name'}`);
        console.log(`     Email: ${profile.email || 'Missing'}`);
        console.log(`     Phone: ${profile.phone || 'Missing'}`);
        console.log(`     Suspended: ${profile.is_suspended ? 'Yes' : 'No'}`);
        console.log(`     Created: ${profile.created_at}`);
        console.log("");
      });
    }

    // Get all profiles
    console.log("📊 All profiles by role:");
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('role')
      .not('role', 'is', null);

    if (!allError && allProfiles) {
      const roleCounts = allProfiles.reduce((acc, profile) => {
        acc[profile.role] = (acc[profile.role] || 0) + 1;
        return acc;
      }, {});

      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`  ${role}: ${count}`);
      });
    }

    // Check which customers have orders
    console.log("\n📊 Customers with orders:");
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('user_id')
      .not('user_id', 'is', null);

    if (!ordersError && orders) {
      const uniqueOrderUsers = new Set(orders.map(order => order.user_id));
      console.log(`  Total unique users with orders: ${uniqueOrderUsers.size}`);
      
      // Check how many customer profiles have orders
      const customersWithOrders = customerProfiles?.filter(profile => 
        uniqueOrderUsers.has(profile.id)
      ) || [];
      
      console.log(`  Customer profiles with orders: ${customersWithOrders.length}`);
      console.log(`  Customer profiles without orders: ${(customerProfiles?.length || 0) - customersWithOrders.length}`);
    }

  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

checkCustomerProfiles().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});
