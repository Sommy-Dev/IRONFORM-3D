import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase service role client (server-only, never exposed to frontend)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// CORS: allow only FRONTEND_URL, plus localhost dev URLs in development
const isDev = process.env.NODE_ENV !== 'production';
const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(isDev ? ['http://localhost:3000', 'http://localhost:4173'] : []),
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

// Raw body parser for Paystack webhook (needed for HMAC verification)
app.use('/api/paystack/webhook', express.raw({ type: '*/*' }));

// ---- Routes ----

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ products: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Checkout validation schema ----
const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(1, 'Phone is required'),
    address: z.string().min(1, 'Address is required'),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Invalid product ID'),
        quantity: z.number().int().positive('Quantity must be positive'),
      }),
    )
    .min(1, 'At least one item required'),
});

app.post('/api/checkout', async (req, res) => {
  try {
    const parsed = checkoutSchema.parse(req.body);
    const { customer, items } = parsed;

    // Load products from Supabase (ignore any price sent by client)
    const productIds = items.map((i) => i.productId);
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (error) throw error;

    const productMap = new Map((products || []).map((p) => [p.id, p]));

    // Validate existence, active, and stock
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (!product.active) {
        return res
          .status(400)
          .json({ error: `Product ${product.name} is not active` });
      }
      if ((product.stock || 0) < item.quantity) {
        return res
          .status(400)
          .json({ error: `Product ${product.name} is out of stock` });
      }
    }

    // Compute total server-side
    const total = items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + product.price_ngn * item.quantity;
    }, 0);

    // Insert order (status pending)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        delivery_address: customer.address,
        total_ngn: total,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId);
      return {
        order_id: order.id,
        product_id: item.productId,
        name: product.name,
        unit_price_ngn: product.price_ngn,
        quantity: item.quantity,
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Call Paystack Initialize
    const paystackRes = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // naira -> kobo
          email: customer.email,
          metadata: { order_id: order.id },
          callback_url: `${process.env.FRONTEND_URL}/order/success`,
        }),
      },
    );

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      throw new Error(paystackData.message || 'Paystack initialization failed');
    }

    // Save paystack reference on order
    const { error: updateError } = await supabase
      .from('orders')
      .update({ paystack_reference: paystackData.data.reference })
      .eq('id', order.id);

    if (updateError) throw updateError;

    res.json({
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    // Call Paystack Verify
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.status) {
      throw new Error(verifyData.message || 'Paystack verification failed');
    }

    const transaction = verifyData.data;

    // Find order by paystack reference
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('paystack_reference', reference)
      .single();

    if (orderError) throw orderError;

    const amountMatches = transaction.amount === order.total_ngn * 100;

    if (transaction.status === 'success' && amountMatches) {
      // Mark order paid
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', order.id);

      // Reduce stock for each ordered item
      for (const item of order.order_items || []) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        await supabase
          .from('products')
          .update({
            stock: Math.max(0, (product.stock || 0) - item.quantity),
          })
          .eq('id', item.product_id);
      }

      res.json({ order, status: 'paid', verified: true });
    } else {
      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', order.id);

      res.json({ order, status: 'failed', verified: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/paystack/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const rawBody = req.body; // Buffer from express.raw

    if (!signature) {
      return res.status(401).json({ error: 'Missing signature header' });
    }

    // Verify HMAC SHA512 signature
    const hmac = crypto.createHmac(
      'sha512',
      process.env.PAYSTACK_SECRET_KEY,
    );
    hmac.update(rawBody);
    const digest = hmac.digest('hex');

    if (signature !== digest) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody.toString());

    if (event.event === 'charge.success') {
      const reference = event.data.reference;

      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('paystack_reference', reference)
        .single();

      if (order && order.status !== 'paid') {
        await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', order.id);

        // Reduce stock
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        for (const item of items || []) {
          const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .single();

          await supabase
            .from('products')
            .update({
              stock: Math.max(0, (product.stock || 0) - item.quantity),
            })
            .eq('id', item.product_id);
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
