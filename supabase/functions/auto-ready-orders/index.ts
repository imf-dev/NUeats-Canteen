import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface MenuItem {
  id: string;
  prep_time: number;
}

interface Order {
  order_id: number;
  user_id: string;
  status: string;
  created_at: string;
  total_amount: number;
  payment_method: string;
}

/**
 * Calculate the maximum prep time for an order based on its items
 */
function calculateOrderPrepTime(orderItems: OrderItem[], menuItems: MenuItem[]): number {
  let maxPrepTime = 0;
  
  for (const orderItem of orderItems) {
    const menuItem = menuItems.find(item => item.id === orderItem.product_id);
    if (menuItem && menuItem.prep_time) {
      maxPrepTime = Math.max(maxPrepTime, menuItem.prep_time);
    }
  }
  
  return maxPrepTime; // Returns prep time in minutes
}

/**
 * Check if an order should be automatically moved to "Ready" status
 */
function shouldAutoReadyOrder(order: Order, orderItems: OrderItem[], menuItems: MenuItem[]): boolean {
  // Only process orders that are currently "Preparing"
  if (order.status !== "Preparing") {
    return false;
  }
  
  // Calculate the prep time for this order
  const prepTimeMinutes = calculateOrderPrepTime(orderItems, menuItems);
  
  if (prepTimeMinutes <= 0) {
    return false; // No prep time set, don't auto-ready
  }
  
  // Calculate when the order should be ready
  const orderCreatedAt = new Date(order.created_at);
  const readyAt = new Date(orderCreatedAt.getTime() + (prepTimeMinutes * 60 * 1000));
  const now = new Date();
  
  // Check if current time has passed the ready time
  return now >= readyAt;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    console.log("🔄 Starting auto-ready orders check...");

    // 1. Fetch all orders that are currently "Preparing"
    const { data: preparingOrders, error: ordersError } = await supabase
      .from("orders")
      .select("order_id, user_id, status, created_at, total_amount, payment_method")
      .eq("status", "Preparing");

    if (ordersError) {
      throw new Error(`Failed to fetch preparing orders: ${ordersError.message}`);
    }

    if (!preparingOrders || preparingOrders.length === 0) {
      console.log("✅ No preparing orders found");
      return new Response(JSON.stringify({
        success: true,
        message: "No preparing orders found",
        updatedOrders: 0
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log(`📋 Found ${preparingOrders.length} preparing orders`);

    // 2. Get all order items for these orders
    const orderIds = preparingOrders.map(order => order.order_id);
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("order_id, product_id, quantity, price")
      .in("order_id", orderIds);

    if (itemsError) {
      throw new Error(`Failed to fetch order items: ${itemsError.message}`);
    }

    // 3. Get all menu items with prep times
    const productIds = [...new Set(orderItems?.map(item => item.product_id) || [])];
    const { data: menuItems, error: menuError } = await supabase
      .from("menu_items")
      .select("id, prep_time")
      .in("id", productIds);

    if (menuError) {
      throw new Error(`Failed to fetch menu items: ${menuError.message}`);
    }

    // 4. Group order items by order_id
    const itemsByOrderId = new Map<number, OrderItem[]>();
    orderItems?.forEach(item => {
      if (!itemsByOrderId.has(item.order_id)) {
        itemsByOrderId.set(item.order_id, []);
      }
      itemsByOrderId.get(item.order_id)!.push(item);
    });

    // 5. Check which orders should be auto-ready
    const ordersToUpdate: number[] = [];
    
    for (const order of preparingOrders) {
      const orderItemsForOrder = itemsByOrderId.get(order.order_id) || [];
      
      if (shouldAutoReadyOrder(order, orderItemsForOrder, menuItems || [])) {
        ordersToUpdate.push(order.order_id);
        console.log(`⏰ Order #${order.order_id} is ready (prep time exceeded)`);
      }
    }

    if (ordersToUpdate.length === 0) {
      console.log("✅ No orders are ready yet");
      return new Response(JSON.stringify({
        success: true,
        message: "No orders are ready yet",
        updatedOrders: 0
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // 6. Update orders to "Ready" status
    console.log(`🔄 Updating ${ordersToUpdate.length} orders to Ready status...`);
    
    const { error: updateError } = await supabase
      .from("orders")
      .update({ 
        status: "Ready",
        updated_at: new Date().toISOString()
      })
      .in("order_id", ordersToUpdate);

    if (updateError) {
      throw new Error(`Failed to update orders: ${updateError.message}`);
    }

    // 7. Send email notifications for each updated order
    for (const orderId of ordersToUpdate) {
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke("send-emails", {
          body: {
            orderId: orderId,
            newStatus: "Ready",
          },
        });

        if (emailError) {
          console.error(`❌ Failed to send email for order #${orderId}:`, emailError);
        } else {
          console.log(`✅ Email sent for order #${orderId}`);
        }
      } catch (emailErr) {
        console.error(`❌ Email error for order #${orderId}:`, emailErr);
      }
    }

    console.log(`✅ Successfully updated ${ordersToUpdate.length} orders to Ready status`);

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully updated ${ordersToUpdate.length} orders to Ready status`,
      updatedOrders: ordersToUpdate.length,
      orderIds: ordersToUpdate
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (err) {
    console.error("💥 Error in auto-ready-orders function:", err);
    return new Response(JSON.stringify({
      error: err.message || "Internal server error"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
