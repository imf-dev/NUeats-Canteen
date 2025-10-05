import { supabase } from "../lib/supabase"; // your initialized supabase client

export const sendOrderEmail = async ({
  userEmail,
  orderId,
  oldStatus,
  newStatus,
  orderDetails,
  receiptPath,
}) => {
  try {
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: {
        userEmail,
        orderId,
        oldStatus,
        newStatus,
        orderDetails,
        receiptPath,
      },
    });

    if (error) throw error;

    console.log("Order email sent successfully:", data);
  } catch (err) {
    console.error("Failed to send order email:", err);
  }
};
