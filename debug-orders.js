// Debug script to test Supabase connection and data
import { createClient } from "@supabase/supabase-js";

// You'll need to set these environment variables or replace with actual values
const supabaseUrl = process.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugOrders() {
  console.log("🔧 Testing Supabase connection...");
  console.log("URL:", supabaseUrl);
  console.log("Key:", supabaseAnonKey ? "Set" : "Not set");
  
  try {
    // Test 1: Check if we can connect to Supabase
    console.log("\n📡 Test 1: Basic connection test");
    const { data: testData, error: testError } = await supabase
      .from("orders")
      .select("count")
      .limit(1);
    
    if (testError) {
      console.error("❌ Connection failed:", testError);
      return;
    }
    console.log("✅ Connection successful");
    
    // Test 2: Check orders table
    console.log("\n📊 Test 2: Orders table check");
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("order_id, user_id, total_amount, status, created_at")
      .limit(5);
    
    if (ordersError) {
      console.error("❌ Orders query failed:", ordersError);
    } else {
      console.log("✅ Orders query successful");
      console.log("Orders found:", orders?.length || 0);
      console.log("Sample orders:", orders);
    }
    
    // Test 3: Check order_items table
    console.log("\n🛒 Test 3: Order items table check");
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("order_id, product_id, quantity, price")
      .limit(5);
    
    if (itemsError) {
      console.error("❌ Order items query failed:", itemsError);
    } else {
      console.log("✅ Order items query successful");
      console.log("Order items found:", orderItems?.length || 0);
      console.log("Sample order items:", orderItems);
    }
    
    // Test 4: Check menu_items table
    console.log("\n🍽️ Test 4: Menu items table check");
    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select("id, name, price")
      .limit(5);
    
    if (menuError) {
      console.error("❌ Menu items query failed:", menuError);
    } else {
      console.log("✅ Menu items query successful");
      console.log("Menu items found:", menuItems?.length || 0);
      console.log("Sample menu items:", menuItems);
    }
    
    // Test 5: Check profiles table
    console.log("\n👤 Test 5: Profiles table check");
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name")
      .limit(5);
    
    if (profilesError) {
      console.error("❌ Profiles query failed:", profilesError);
    } else {
      console.log("✅ Profiles query successful");
      console.log("Profiles found:", profiles?.length || 0);
      console.log("Sample profiles:", profiles);
    }
    
  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

debugOrders();
