import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { amount, payment_method_type } = body;

    console.log('=== Payment Request ===');
    console.log('Amount:', amount);
    console.log('Payment Method:', payment_method_type);

    // Validate inputs
    if (!amount || amount < 1) {
      return new Response(
        JSON.stringify({ error: 'Amount must be at least 1' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!payment_method_type) {
      return new Response(
        JSON.stringify({ error: 'Payment method is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Handle cash payment
    if (payment_method_type.toLowerCase() === 'cash') {
      console.log('Cash payment selected - returning success');
      return new Response(
        JSON.stringify({ 
          status: 'success', 
          message: 'Cash payment selected' 
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Handle PayMongo payment
    if (payment_method_type.toLowerCase() === 'paymongo') {
      const PAYMONGO_SECRET_KEY = Deno.env.get('PAYMONGO_SECRET_KEY');
      
      if (!PAYMONGO_SECRET_KEY) {
        console.error('PAYMONGO_SECRET_KEY environment variable not set');
        return new Response(
          JSON.stringify({ error: 'Payment gateway not configured' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('PayMongo key found, creating checkout session...');

      // Encode secret key for Basic Auth
      const encoder = new TextEncoder();
      const data = encoder.encode(`${PAYMONGO_SECRET_KEY}:`);
      const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));

      // Create checkout session
      const paymongoPayload = {
        data: {
          attributes: {
            line_items: [
              {
                currency: 'PHP',
                amount: Math.round(amount * 100), // Convert to centavos
                name: 'Order Payment',
                quantity: 1
              }
            ],
            payment_method_types: ['gcash', 'paymaya', 'card'],
            success_url: 'https://yourapp.com/payment-success',
            cancel_url: 'https://yourapp.com/payment-failed',
            description: 'Order Payment'
          }
        }
      };

      console.log('Sending request to PayMongo...');

      const paymongoResponse = await fetch(
        'https://api.paymongo.com/v1/checkout_sessions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64}`
          },
          body: JSON.stringify(paymongoPayload)
        }
      );

      const paymongoData = await paymongoResponse.json();

      console.log('PayMongo response status:', paymongoResponse.status);
      console.log('PayMongo response data:', JSON.stringify(paymongoData, null, 2));

      if (!paymongoResponse.ok) {
        console.error('PayMongo API error');
        return new Response(
          JSON.stringify({ 
            error: 'Payment gateway error', 
            details: paymongoData 
          }), 
          { 
            status: paymongoResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const checkoutUrl = paymongoData?.data?.attributes?.checkout_url;

      if (!checkoutUrl) {
        console.error('No checkout URL in response');
        return new Response(
          JSON.stringify({ 
            error: 'Invalid payment gateway response',
            details: 'No checkout URL received'
          }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Success! Checkout URL:', checkoutUrl);

      return new Response(
        JSON.stringify({ 
          status: 'success', 
          redirect_url: checkoutUrl 
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Invalid payment method
    return new Response(
      JSON.stringify({ error: 'Invalid payment method' }), 
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});