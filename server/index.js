import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cron from 'node-cron';

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

// ---- Auth middleware ----

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function authenticateCustomer(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    if (!decoded.customerEmail || decoded.purpose !== 'customer_orders') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.customerEmail = decoded.customerEmail;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// ---- Routes ----

app.get('/api/health', async (_req, res) => {
  try {
    await supabase.from('products').select('id').limit(1);
    res.json({ ok: true, time: new Date().toISOString() });
  } catch {
    res.json({ ok: false, time: new Date().toISOString() });
  }
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

app.get('/api/orders', authenticateCustomer, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(
        'id, customer_email, delivery_address, total_ngn, status, paystack_reference, created_at, order_items(name, quantity, unit_price_ngn)',
      )
      .eq('customer_email', req.customerEmail)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ orders: data || [] });
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

// ---- Admin auth ----

const otpRequestCounts = new Map(); // email -> { count, firstRequestTime }

app.post('/api/admin/request-otp', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generic response - never reveal whether email is the admin
    const genericMessage = 'If this email is allowed, a code was sent';

    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return res.json({ message: genericMessage });
    }

    // Rate limit: max 3 requests per 15 minutes per email
    const now = Date.now();
    const record = otpRequestCounts.get(email);
    if (record) {
      if (now - record.firstRequestTime < 15 * 60 * 1000) {
        if (record.count >= 3) {
          return res.json({ message: genericMessage });
        }
        record.count += 1;
      } else {
        otpRequestCounts.set(email, { count: 1, firstRequestTime: now });
      }
    } else {
      otpRequestCounts.set(email, { count: 1, firstRequestTime: now });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate any previous unused OTPs for this email
    await supabase.from('admin_otps').update({ used: true }).eq('email', email).eq('used', false);

    // Store new OTP
    const { error: insertError } = await supabase
      .from('admin_otps')
      .insert({
        email,
        otp_hash: otpHash,
        expires_at: expiresAt,
        attempts: 0,
        used: false,
      });

    if (insertError) throw insertError;

    // Send OTP via Brevo
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { email: process.env.BREVO_SENDER_EMAIL, name: 'IRONFORM Gear' },
          to: [{ email }],
          subject: 'Your IRONFORM admin code',
          htmlContent: `<p>Your IRONFORM admin verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
        }),
      });
    } catch (brevoErr) {
      // Don't fail the request if email sending fails; OTP is still stored
      console.error('Brevo email send failed');
    }

    res.json({ message: 'If this email is allowed, a code was sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!otp || typeof otp !== 'string') {
      return res.status(400).json({ error: 'OTP is required' });
    }

    const { data: otpRows, error: fetchError } = await supabase
      .from('admin_otps')
      .select('*')
      .eq('email', email)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    if (!otpRows || otpRows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired code' });
    }

    const otpRecord = otpRows[0];

    // Check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Code expired' });
    }

    // Check attempts
    if ((otpRecord.attempts || 0) >= 5) {
      await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id);
      return res.status(401).json({ error: 'Too many wrong attempts' });
    }

    // Verify OTP hash
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (otpHash !== otpRecord.otp_hash) {
      await supabase
        .from('admin_otps')
        .update({ attempts: (otpRecord.attempts || 0) + 1 })
        .eq('id', otpRecord.id);
      return res.status(401).json({ error: 'Invalid code' });
    }

    // Mark OTP as used
    await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id);

    // Generate JWT
    const token = jwt.sign(
      { email: ADMIN_EMAIL, purpose: 'admin' },
      ADMIN_JWT_SECRET,
      { expiresIn: '2h' },
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Admin orders ----

app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(
        'id, customer_name, customer_email, customer_phone, delivery_address, total_ngn, status, paystack_reference, created_at, order_items(name, quantity, unit_price_ngn)',
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ orders: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Order not found' });

    res.json({ order: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Cron jobs ----

// Every hour: cancel pending orders older than 24 hours
cron.schedule('0 * * * *', async () => {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('status', 'pending')
      .lt('created_at', cutoff)
      .select('id');

    if (error) {
      console.error('Cron cancel pending orders failed:', error.message);
      return;
    }
    console.log(`Cron: cancelled ${(data || []).length} pending orders older than 24h`);
  } catch (err) {
    console.error('Cron cancel pending orders error:', err.message);
  }
});

// Every day: delete expired and used OTP rows
cron.schedule('0 3 * * *', async () => {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('admin_otps')
      .delete()
      .or(`expires_at.lt.${now},used.eq.true`);

    if (error) {
      console.error('Cron cleanup OTPs failed:', error.message);
      return;
    }
    console.log('Cron: cleaned up expired/used OTP rows');
  } catch (err) {
    console.error('Cron cleanup OTPs error:', err.message);
  }
});

// ---- Admin OTP for customer orders ----

app.post('/api/customer/request-otp', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generic response
    const genericMessage = 'If you have orders, a code was sent';

    // Rate limit
    const now = Date.now();
    const record = otpRequestCounts.get(email);
    if (record) {
      if (now - record.firstRequestTime < 15 * 60 * 1000) {
        if (record.count >= 3) {
          return res.json({ message: genericMessage });
        }
        record.count += 1;
      } else {
        otpRequestCounts.set(email, { count: 1, firstRequestTime: now });
      }
    } else {
      otpRequestCounts.set(email, { count: 1, firstRequestTime: now });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate previous unused OTPs
    await supabase.from('admin_otps').update({ used: true }).eq('email', email).eq('used', false);

    const { error: insertError } = await supabase
      .from('admin_otps')
      .insert({
        email,
        otp_hash: otpHash,
        expires_at: expiresAt,
        attempts: 0,
        used: false,
        purpose: 'customer_orders',
      });

    if (insertError) throw insertError;

    // Send via Brevo
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { email: process.env.BREVO_SENDER_EMAIL, name: 'IRONFORM Gear' },
          to: [{ email }],
          subject: 'Your IRONFORM order access code',
          htmlContent: `<p>Your IRONFORM order verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`,
        }),
      });
    } catch {
      console.error('Brevo email send failed');
    }

    res.json({ message: genericMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customer/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const { data: otpRows, error: fetchError } = await supabase
      .from('admin_otps')
      .select('*')
      .eq('email', email)
      .eq('purpose', 'customer_orders')
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    if (!otpRows || otpRows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired code' });
    }

    const otpRecord = otpRows[0];

    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Code expired' });
    }

    if ((otpRecord.attempts || 0) >= 5) {
      await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id);
      return res.status(401).json({ error: 'Too many wrong attempts' });
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (otpHash !== otpRecord.otp_hash) {
      await supabase
        .from('admin_otps')
        .update({ attempts: (otpRecord.attempts || 0) + 1 })
        .eq('id', otpRecord.id);
      return res.status(401).json({ error: 'Invalid code' });
    }

    await supabase.from('admin_otps').update({ used: true }).eq('id', otpRecord.id);

    // Customer token valid for 30 minutes
    const token = jwt.sign(
      { customerEmail: email, purpose: 'customer_orders' },
      ADMIN_JWT_SECRET,
      { expiresIn: '30m' },
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Keep-alive note:
// On a free Render service, the server sleeps after 15 minutes without traffic.
// An external pinger should call GET /api/health every 10 minutes to keep it awake.
// Do not implement self-pinging from within the server.

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
