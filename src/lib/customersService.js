// src/lib/customersService.js
import { supabase } from "./supabaseClient";

/**
 * Determine customer status based on last login
 * - active: logged in within last 30 days
 * - inactive: logged in 30-90 days ago
 * - suspended: no login for 90+ days
 */
function determineStatus(lastLogin) {
  if (!lastLogin) return "inactive";
  
  const daysSinceLogin = Math.floor(
    (new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceLogin <= 30) return "active";
  if (daysSinceLogin <= 90) return "inactive";
  return "suspended";
}

/**
 * Fetch all customers with their order summaries
 */
export async function getAllCustomers() {
  try {
    // First, get all profiles with 'customer' role
    const { data: customerProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "customer");

    if (profilesError) {
      console.error("Error fetching customer profiles:", profilesError);
      return [];
    }

    if (!customerProfiles || customerProfiles.length === 0) {
      console.log("No customer profiles found in database");
      return [];
    }

    // Get all orders to calculate order statistics for each customer
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("user_id, created_at, status");

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      // Continue without order data
    }

    // Create a map of user_id to their order data
    const orderMap = new Map();
    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        const userId = order.user_id;
        
        if (!orderMap.has(userId)) {
          orderMap.set(userId, {
            first_order_date: order.created_at,
            last_order_date: order.created_at,
            total_orders: 0,
          });
        }

        const orderData = orderMap.get(userId);
        orderData.total_orders++;

        // Update first and last order dates
        if (new Date(order.created_at) < new Date(orderData.first_order_date)) {
          orderData.first_order_date = order.created_at;
        }
        if (new Date(order.created_at) > new Date(orderData.last_order_date)) {
          orderData.last_order_date = order.created_at;
        }
      });
    }

    // Convert profiles to customers with order data
    const customers = customerProfiles.map((profile) => {
      const orderData = orderMap.get(profile.id) || {
        first_order_date: profile.created_at,
        last_order_date: profile.created_at,
        total_orders: 0,
      };

      // Determine status based on last order date or profile creation
      const lastActivityDate = orderData.total_orders > 0 ? orderData.last_order_date : profile.created_at;
      const daysSinceLastActivity = Math.floor(
        (new Date() - new Date(lastActivityDate)) / (1000 * 60 * 60 * 24)
      );
      
      let status = "active";
      if (daysSinceLastActivity > 90) {
        status = "suspended";
      } else if (daysSinceLastActivity > 30) {
        status = "inactive";
      }

      // If profile marks user as suspended, override computed status
      if (profile.is_suspended === true) {
        status = "suspended";
      }

      // Parse display name
      const displayName = profile.display_name || null;
      let firstName = "Customer";
      let lastName = profile.id.substring(0, 8);
      if (displayName && typeof displayName === "string") {
        const parts = displayName.trim().split(/\s+/);
        firstName = parts[0] || firstName;
        lastName = parts.slice(1).join(" ") || lastName;
      }

      return {
        customer_id: profile.id,
        first_name: firstName,
        last_name: lastName,
        email: profile.email || `${profile.id.substring(0, 8)}@user.com`,
        phone: profile.phone || "N/A",
        avatar_url: profile.avatar_url || null,
        is_suspended: profile.is_suspended === true,
        status: status,
        account_info: {
          date_joined: profile.created_at,
          last_login: orderData.total_orders > 0 ? orderData.last_order_date : profile.created_at,
          last_app_activity: orderData.total_orders > 0 ? orderData.last_order_date : profile.created_at,
        },
        order_summary: {
          total_orders: orderData.total_orders,
          last_order_date: orderData.total_orders > 0 ? orderData.last_order_date : null,
        },
      };
    });

    // Sort by date joined (newest first)
    customers.sort((a, b) => {
      return new Date(b.account_info.date_joined) - new Date(a.account_info.date_joined);
    });

    console.log(`Found ${customers.length} customers`);
    return customers;
  } catch (error) {
    console.error("Unexpected error fetching customers:", error);
    return [];
  }
}

/**
 * Get customer statistics
 */
export async function getCustomerStats() {
  try {
    // Get all customers
    const customers = await getAllCustomers();
    
    // Total customers
    const totalCustomers = customers.length;
    
    // New customers this week (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const newCustomersThisWeek = customers.filter((customer) => {
      return new Date(customer.account_info.date_joined) >= oneWeekAgo;
    }).length;
    
    // Active customers (active status)
    const activeCustomers = customers.filter((c) => c.status === "active").length;
    
    // Total orders - query directly from orders table
    const { count: totalOrders, error: ordersError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    if (ordersError) {
      console.error("Error fetching orders count:", ordersError);
    }
    
    // Total feedbacks - query from ratings table
    const { count: totalFeedbacks, error: feedbacksError } = await supabase
      .from("ratings")
      .select("*", { count: "exact", head: true })
      .not("feedback", "is", null);

    if (feedbacksError) {
      console.error("Error fetching feedbacks count:", feedbacksError);
    }

    return {
      totalCustomers,
      newCustomersThisWeek,
      activeCustomers,
      totalOrders: totalOrders || 0,
      totalFeedbacks: totalFeedbacks || 0,
    };
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    return {
      totalCustomers: 0,
      newCustomersThisWeek: 0,
      activeCustomers: 0,
      totalOrders: 0,
      totalFeedbacks: 0,
    };
  }
}

/**
 * Get customer by ID with detailed information
 */
export async function getCustomerById(customerId) {
  try {
    // Fetch all orders for this user
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(`
        order_id,
        total_amount,
        status,
        created_at,
        order_items (
          quantity,
          price,
          product_id,
          menu_items (
            name,
            category
          )
        )
      `)
      .eq("user_id", customerId)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      return null;
    }

    if (!orders || orders.length === 0) {
      return null;
    }

    const firstOrderDate = orders[orders.length - 1].created_at;
    const lastOrderDate = orders[0].created_at;
    
    // Determine status based on last order date
    const daysSinceLastOrder = Math.floor(
      (new Date() - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24)
    );
    
    let status = "active";
    if (daysSinceLastOrder > 90) {
      status = "suspended";
    } else if (daysSinceLastOrder > 30) {
      status = "inactive";
    }
    
    const orderSummary = {
      total_orders: orders.length,
      last_order_date: lastOrderDate,
    };

    return {
      customer_id: customerId,
      first_name: "Customer",
      last_name: customerId.substring(0, 8),
      email: `${customerId.substring(0, 8)}@user.com`,
      phone: "N/A",
      status: status,
      account_info: {
        date_joined: firstOrderDate,
        last_login: lastOrderDate,
        last_app_activity: lastOrderDate,
      },
      order_summary: orderSummary,
      orders: orders,
    };
  } catch (error) {
    console.error("Unexpected error fetching customer details:", error);
    return null;
  }
}

/**
 * Suspend/Unsuspend a customer by updating profiles.is_suspended
 */
export async function setCustomerSuspended(customerId, isSuspended) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ is_suspended: !!isSuspended })
      .eq("id", customerId);

    if (error) {
      console.error("Failed to update suspension status:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error("Unexpected error updating suspension status:", err);
    return { success: false, error: err };
  }
}
