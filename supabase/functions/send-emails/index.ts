import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import nodemailer from "npm:nodemailer@6.9.7";
import { jsPDF } from "npm:jspdf@2.5.1";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

interface OrderEmailBody {
  orderId: number;
  newStatus: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate PDF receipt
async function generateReceiptPDF(order: any, items: any[], userEmail: string) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('NuEats', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('Official Receipt', 105, 30, { align: 'center' });
  
  // Divider
  doc.line(20, 35, 190, 35);
  
  // Order Details
  doc.setFontSize(10);
  let yPos = 45;
  
  doc.text(`Receipt #: ${order.order_id}`, 20, yPos);
  doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 20, yPos + 7);
  doc.text(`Customer: ${userEmail}`, 20, yPos + 14);
  doc.text(`Payment Method: ${order.payment_method || 'N/A'}`, 20, yPos + 21);
  
  // Items Header
  yPos = 80;
  doc.setFont(undefined, 'bold');
  doc.text('Item', 20, yPos);
  doc.text('Qty', 120, yPos);
  doc.text('Price', 145, yPos);
  doc.text('Total', 170, yPos);
  
  doc.line(20, yPos + 2, 190, yPos + 2);
  
  // Items
  doc.setFont(undefined, 'normal');
  yPos += 10;
  let subtotal = 0;
  
  for (const item of items) {
    const itemTotal = item.quantity * item.price;
    subtotal += itemTotal;
    
    doc.text(item.name.substring(0, 30), 20, yPos);
    doc.text(String(item.quantity), 120, yPos);
    doc.text(`₱${Number(item.price).toFixed(2)}`, 145, yPos);
    doc.text(`₱${itemTotal.toFixed(2)}`, 170, yPos);
    
    yPos += 7;
    
    // Add new page if needed
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  }
  
  // Totals
  yPos += 5;
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Subtotal:', 145, yPos, { align: 'right' });
  doc.text(`₱${subtotal.toFixed(2)}`, 190, yPos, { align: 'right' });
  
  yPos += 7;
  doc.text('Tax (0%):', 145, yPos, { align: 'right' });
  doc.text('₱0.00', 190, yPos, { align: 'right' });
  
  yPos += 10;
  doc.setFontSize(12);
  doc.text('TOTAL:', 145, yPos, { align: 'right' });
  doc.text(`₱${Number(order.total_amount).toFixed(2)}`, 190, yPos, { align: 'right' });
  
  // Footer
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for your order!', 105, 280, { align: 'center' });
  doc.text('This is a computer-generated receipt.', 105, 285, { align: 'center' });
  
  // Return as buffer
  return doc.output('arraybuffer');
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }), 
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD");
    
    if (!gmailUser || !gmailPass) {
      throw new Error("Gmail credentials not configured");
    }

    const { orderId, newStatus }: OrderEmailBody = await req.json();
    
    if (!orderId || !newStatus) {
      throw new Error("Missing required fields");
    }

    console.log(`Processing email for Order #${orderId} - Status: ${newStatus}`);

    // Fetch order with full details
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (orderErr || !order) {
      throw new Error("Order not found");
    }

    // Fetch order items
    const { data: orderItems, error: itemsErr } = await supabase
      .from("order_items")
      .select("product_id, quantity, price")
      .eq("order_id", orderId);

    if (itemsErr) {
      throw new Error("Failed to fetch order items");
    }

    // Fetch product details
    const productIds = orderItems.map(item => item.product_id);
    const { data: products, error: productsErr } = await supabase
      .from("menu_items")
      .select("id, name, price")
      .in("id", productIds);

    if (productsErr) {
      throw new Error("Failed to fetch products");
    }

    // Map items with product names
    const items = orderItems.map(item => {
      const product = products.find(p => p.id === item.product_id);
      return {
        name: product?.name || `Product ${item.product_id}`,
        quantity: item.quantity,
        price: Number(item.price || product?.price || 0)
      };
    });

    // Fetch user email
    const { data: userResp, error: userErr } = await supabase.auth.admin.getUserById(order.user_id);
    
    if (userErr || !userResp.user?.email) {
      throw new Error("User email not found");
    }

    const userEmail = userResp.user.email;
    console.log(`Sending to: ${userEmail}`);

    // Email messages
    const emailStatusMap: Record<string, string> = {
      Pending: "Your order has been received and is being processed.",
      Preparing: "Great news! Your order is now being prepared by our kitchen staff.",
      Ready: "Your order is ready for pickup! Please come collect it at your earliest convenience.",
      Completed: "Thank you for your order! We hope you enjoyed your meal. Please find your receipt attached.",
      Cancelled: "Your order has been cancelled. If you have any questions, please contact us.",
    };

    const message = emailStatusMap[newStatus] || "Your order has been updated.";

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Prepare email options
    const mailOptions: any = {
      from: `"NuEats" <${gmailUser}>`,
      to: userEmail,
      subject: `Order #${orderId} Update: ${newStatus}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4CAF50; color: white; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0;">Order Update</h1>
            </div>
            <div style="padding: 30px 20px; background-color: #f9f9f9;">
              <p style="font-size: 16px; color: #333;">${message}</p>
              <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Order ID:</strong> #${orderId}</p>
                <p><strong>Status:</strong> ${newStatus}</p>
                <p><strong>Total:</strong> ₱${Number(order.total_amount).toFixed(2)}</p>
              </div>
              ${newStatus === 'Completed' ? '<p style="color: #666; font-size: 14px;">Your receipt is attached to this email.</p>' : ''}
            </div>
            <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">Thank you for choosing NuEats!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Generate and attach PDF if order is completed
    if (newStatus === 'Completed') {
      console.log('Generating receipt PDF...');
      const pdfBuffer = await generateReceiptPDF(order, items, userEmail);
      
      mailOptions.attachments = [
        {
          filename: `receipt-${orderId}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf'
        }
      ];
      console.log('PDF generated and attached');
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        pdfAttached: newStatus === 'Completed'
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (err) {
    console.error("Error:", err);

    return new Response(
      JSON.stringify({ error: (err as Error).message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});