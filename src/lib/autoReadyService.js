import { supabase } from './supabaseClient';

/**
 * Manually trigger the auto-ready orders function
 * This can be called from the admin interface to check for orders that should be ready
 */
export async function triggerAutoReadyOrders() {
  try {
    console.log('🔄 Triggering auto-ready orders check...');
    
    const { data, error } = await supabase.functions.invoke('auto-ready-orders', {
      body: {}
    });

    if (error) {
      console.error('❌ Error triggering auto-ready orders:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Auto-ready orders check completed:', data);
    return { success: true, data };
  } catch (err) {
    console.error('💥 Unexpected error triggering auto-ready orders:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Check if an order should be ready based on its prep time
 * This is a client-side helper function for UI display
 */
export function isOrderReady(order, orderItems = []) {
  if (order.status !== 'preparing') {
    return false;
  }

  // Calculate max prep time from order items
  let maxPrepTime = 0;
  orderItems.forEach(item => {
    if (item.prepTime && item.prepTime > maxPrepTime) {
      maxPrepTime = item.prepTime;
    }
  });

  if (maxPrepTime <= 0) {
    return false;
  }

  // Calculate ready time
  const orderCreatedAt = new Date(order.created_at);
  const readyAt = new Date(orderCreatedAt.getTime() + (maxPrepTime * 60 * 1000));
  const now = new Date();

  return now >= readyAt;
}

/**
 * Get the estimated ready time for an order
 */
export function getEstimatedReadyTime(order, orderItems = []) {
  if (order.status !== 'preparing') {
    return null;
  }

  // Calculate max prep time from order items
  let maxPrepTime = 0;
  orderItems.forEach(item => {
    if (item.prepTime && item.prepTime > maxPrepTime) {
      maxPrepTime = item.prepTime;
    }
  });

  if (maxPrepTime <= 0) {
    return null;
  }

  // Calculate ready time
  const orderCreatedAt = new Date(order.created_at);
  const readyAt = new Date(orderCreatedAt.getTime() + (maxPrepTime * 60 * 1000));
  
  return readyAt.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit' 
  });
}
