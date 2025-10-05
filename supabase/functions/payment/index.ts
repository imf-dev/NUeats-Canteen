import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // ✅ Handle PayMongo redirects (GET requests)
  if (req.method === "GET") {
    const redirect = url.searchParams.get("redirect");
    const sessionId = url.searchParams.get("session_id");
    
    // 🔍 DEBUG: Log all query parameters
    console.log("=== GET Request Debug ===");
    console.log("Full URL:", req.url);
    console.log("Redirect param:", redirect);
    console.log("Session ID param:", sessionId);
    console.log("All params:", Object.fromEntries(url.searchParams));

    if (redirect === "success" || redirect === "failed") {
      console.log(`Payment ${redirect} redirect received`);

      // Try to find and update the payment session
      if (sessionId) {
        console.log("Attempting to update payment session with checkout_session_id:", sessionId);
        
        // First, try to find the session
        const { data: findResult, error: findError } = await supabase
          .from("payment_sessions")
          .select("*")
          .eq("checkout_session_id", sessionId);

        console.log("Find result:", findResult);
        console.log("Find error:", findError);

        if (findResult && findResult.length > 0) {
          // Update the found session
          const { data: updateResult, error: updateError } = await supabase
            .from("payment_sessions")
            .update({ 
              status: redirect === "success" ? "success" : "failed",
              updated_at: new Date().toISOString()
            })
            .eq("checkout_session_id", sessionId)
            .select();

          console.log("Update result:", updateResult);
          console.log("Update error:", updateError);
        } else {
          console.error("No payment session found with checkout_session_id:", sessionId);
        }
      } else {
        console.error("No session_id parameter in redirect URL");
      }

      // Return success page
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Payment ${redirect === "success" ? "Successful" : "Failed"}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: ${redirect === "success" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"};
                padding: 20px;
              }
              .container {
                background: white;
                padding: 48px 32px;
                border-radius: 24px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
                max-width: 400px;
                width: 100%;
              }
              .icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                background: ${redirect === "success" ? "#10b981" : "#ef4444"};
                color: white;
              }
              h1 {
                color: #1f2937;
                font-size: 28px;
                margin-bottom: 12px;
                font-weight: 700;
              }
              p {
                color: #6b7280;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 32px;
              }
              .debug {
                background: #f3f4f6;
                padding: 16px;
                border-radius: 12px;
                margin-bottom: 24px;
                font-size: 12px;
                color: #4b5563;
                text-align: left;
                font-family: monospace;
              }
              .button {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 14px 32px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">${redirect === "success" ? "✓" : "✕"}</div>
              <h1>Payment ${redirect === "success" ? "Successful" : "Failed"}</h1>
              <p>${redirect === "success" 
                ? "Your payment has been processed successfully!" 
                : "Your payment could not be processed."}</p>
              <div class="debug">
                Session ID: ${sessionId || 'Not provided'}<br>
                Check your app logs for updates
              </div>
              <a href="#" onclick="window.close(); return false;" class="button">Close Window</a>
            </div>
          </body>
        </html>
      `;

      return new Response(html, {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "text/html" }
      });
    }

    return new Response("Payment redirect handler active", {
      headers: { ...corsHeaders, "Content-Type": "text/plain" }
    });
  }

  // ✅ Handle payment initiation (POST requests)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { amount, payment_method_type, order_id, user_id } = body;

      console.log("=== Payment Request ===");
      console.log("Amount:", amount);
      console.log("Payment Method:", payment_method_type);
      console.log("Order ID:", order_id);
      console.log("User ID:", user_id);

      if (!amount || amount < 1) {
        return new Response(
          JSON.stringify({ error: "Amount must be at least 1" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (payment_method_type.toLowerCase() === "cash") {
        console.log("Creating cash payment session...");
        
        const { data: paymentSession, error: dbError } = await supabase
          .from("payment_sessions")
          .insert({
            order_id,
            amount,
            status: "success",
            payment_method: "cash",
            user_id
          })
          .select()
          .single();

        console.log("Cash payment session created:", paymentSession);
        console.log("Database error:", dbError);

        if (dbError) {
          return new Response(
            JSON.stringify({ error: "Failed to create payment session", details: dbError }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            status: "success",
            message: "Cash payment selected",
            payment_session_id: paymentSession.id
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (payment_method_type.toLowerCase() === "paymongo") {
        const PAYMONGO_SECRET_KEY = Deno.env.get("PAYMONGO_SECRET_KEY");

        if (!PAYMONGO_SECRET_KEY) {
          return new Response(
            JSON.stringify({ error: "Payment gateway not configured" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("Creating PayMongo checkout session...");

        const encoder = new TextEncoder();
        const data = encoder.encode(`${PAYMONGO_SECRET_KEY}:`);
        const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));

        const paymongoPayload = {
          data: {
            attributes: {
              line_items: [{
                currency: "PHP",
                amount: Math.round(amount * 100),
                name: "NuEats Order Payment",
                quantity: 1
              }],
              payment_method_types: ["gcash", "paymaya", "card"],
              success_url: `${SUPABASE_URL}/functions/v1/payment-redirect?status=success`,
              cancel_url: `${SUPABASE_URL}/functions/v1/payment-redirect?status=failed`,
              description: `Order #${order_id}`
            }
          }
        };

        console.log("PayMongo request payload:", JSON.stringify(paymongoPayload, null, 2));

        const paymongoResponse = await fetch(
          "https://api.paymongo.com/v1/checkout_sessions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${base64}`
            },
            body: JSON.stringify(paymongoPayload)
          }
        );

        const paymongoData = await paymongoResponse.json();
        console.log("PayMongo response status:", paymongoResponse.status);
        console.log("PayMongo response data:", JSON.stringify(paymongoData, null, 2));

        if (!paymongoResponse.ok) {
          return new Response(
            JSON.stringify({ error: "Payment gateway error", details: paymongoData }),
            { status: paymongoResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const checkoutUrl = paymongoData?.data?.attributes?.checkout_url;
        const checkoutSessionId = paymongoData?.data?.id;

        console.log("Checkout URL:", checkoutUrl);
        console.log("Checkout Session ID:", checkoutSessionId);

        if (!checkoutUrl || !checkoutSessionId) {
          return new Response(
            JSON.stringify({ error: "Invalid payment gateway response" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Create payment session in database
        console.log("Creating payment session in database...");
        const { data: paymentSession, error: dbError } = await supabase
          .from("payment_sessions")
          .insert({
            order_id,
            checkout_session_id: checkoutSessionId,
            amount,
            status: "pending",
            payment_method: "paymongo",
            user_id
          })
          .select()
          .single();

        console.log("Payment session created:", paymentSession);
        console.log("Database error:", dbError);

        if (dbError) {
          return new Response(
            JSON.stringify({ error: "Failed to create payment session", details: dbError }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            status: "success",
            redirect_url: checkoutUrl,
            payment_session_id: paymentSession.id,
            checkout_session_id: checkoutSessionId
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Invalid payment method" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error", message: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
});