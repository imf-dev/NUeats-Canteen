import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const PAYMONGO_WEBHOOK_SECRET = Deno.env.get("PAYMONGO_WEBHOOK_SECRET");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(
  async (req) => {
    try {
      if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }

      const rawBody = await req.text();
      const payload = JSON.parse(rawBody);
      console.log("=== Webhook Received ===", payload);

      const eventType = payload?.data?.type;
      const attributes = payload?.data?.attributes;
      const checkoutData = attributes?.data;
      const checkoutSessionId = checkoutData?.id || attributes?.id;
      const status = attributes?.status;

      const { error: logError } = await supabase.from("webhook_logs").insert({
        event_type: eventType,
        payload,
        processed: false,
      });

      if (logError) console.error("Error logging webhook:", logError);

      if (eventType === "checkout_session.payment.paid" || eventType === "payment.paid") {
        const { error } = await supabase
          .from("payment_sessions")
          .update({
            status: "success",
            updated_at: new Date().toISOString(),
          })
          .eq("checkout_session_id", checkoutSessionId);

        if (error) throw error;

        await supabase
          .from("webhook_logs")
          .update({ processed: true })
          .eq("payload->data->attributes->data->id", checkoutSessionId);

        return new Response(JSON.stringify({ message: "Payment success processed" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (eventType === "payment.failed") {
        const { error } = await supabase
          .from("payment_sessions")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("checkout_session_id", checkoutSessionId);

        if (error) throw error;

        await supabase
          .from("webhook_logs")
          .update({ processed: true })
          .eq("payload->data->attributes->data->id", checkoutSessionId);

        return new Response(JSON.stringify({ message: "Payment failure recorded" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (eventType === "payment.refunded" || eventType === "payment.refund.updated") {
        const { error } = await supabase
          .from("payment_sessions")
          .update({
            status: "refunded",
            updated_at: new Date().toISOString(),
          })
          .eq("checkout_session_id", checkoutSessionId);

        if (error) throw error;

        await supabase
          .from("webhook_logs")
          .update({ processed: true })
          .eq("payload->data->attributes->data->id", checkoutSessionId);

        return new Response(JSON.stringify({ message: "Refund processed" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log("No matching handler for event:", eventType);
      return new Response(JSON.stringify({ message: "Event received but not processed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Webhook error:", error);

      await supabase.from("webhook_logs").insert({
        event_type: "error",
        payload: { error: error.message },
        processed: false,
        error: error.message,
      });

      return new Response(JSON.stringify({ error: "Internal server error", message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
  {
    verifyJWT: false, // ✅ THIS is what stops the 401
  },
);
