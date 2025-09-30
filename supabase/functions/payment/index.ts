// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// supabase/functions/payment/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

function toBase64(str: string) {
  // Deno provides btoa, but ensure it's available
  return typeof btoa === "function" ? btoa(str) : Buffer.from(str).toString("base64");
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { amount, payment_method_type } = await req.json();

    if (!amount || !payment_method_type) {
      return new Response(
        JSON.stringify({ error: "Missing amount or payment_method_type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const PAYMONGO_SECRET_KEY = Deno.env.get("PAYMONGO_SECRET_KEY");
    if (!PAYMONGO_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: "PayMongo secret key not set" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const PAYMONGO_SECRET_KEY_BASE64 = toBase64(PAYMONGO_SECRET_KEY + ":");

    const response = await fetch("https://api.paymongo.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${PAYMONGO_SECRET_KEY_BASE64}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: Math.round(amount * 100), // PayMongo uses centavos
            payment_method_allowed: [payment_method_type],
            currency: "PHP",
          },
        },
      }),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

export const handler = async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { amount, payment_method_type } = body as {
      amount?: number;
      payment_method_type?: string;
    };

    if (!amount || !payment_method_type) {
      return new Response(
        JSON.stringify({ error: 'Missing amount or payment_method_type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const PAYMONGO_SECRET_KEY = Deno.env.get('PAYMONGO_SECRET_KEY');
    if (!PAYMONGO_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'PayMongo secret key not set' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const PAYMONGO_SECRET_KEY_BASE64 = toBase64(PAYMONGO_SECRET_KEY + ":");

    console.log("Sending request to PayMongo...");

    console.log("Sending request to PayMongo...");
    console.log("Key exists?", !!PAYMONGO_SECRET_KEY);

    const response = await fetch('https://api.paymongo.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${PAYMONGO_SECRET_KEY_BASE64}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: Math.round(amount * 100),
            currency: 'PHP',
            payment_method_allowed: [payment_method_type],
            payment_method_options: {
              card: {
                request_three_d_secure: 'automatic',
              },
            },
            description: 'Payment from Supabase Edge Function',
          },
        },
      }),
    });

    console.log("Got response from PayMongo:", response.status);

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/payment' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
