import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Clock, Lock } from 'lucide-react';
import { formatNaira } from '../data/products';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const STATUS_COLORS: Record<string, string> = {
  paid: 'bg-[#A3E635]/20 text-[#A3E635] border-[#A3E635]/50',
  pending: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50',
  failed: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50',
  shipped: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/50',
  delivered: 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/50',
  cancelled: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50',
};

type OrderItem = {
  name: string;
  quantity: number;
  unit_price_ngn: number;
};

type Order = {
  id: string;
  customer_email: string;
  delivery_address: string;
  total_ngn: number;
  status: string;
  paystack_reference: string | null;
  created_at: string;
  order_items: OrderItem[];
};

export const OrdersPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'orders'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = useCallback(async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/customer/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send code');
      }
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }, [email, API_BASE]);

  const verifyOtp = useCallback(async () => {
    if (!otp.trim()) {
      setError('Please enter the code');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/customer/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid code');
      }
      setToken(data.token);
      setStep('orders');
      loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  }, [otp, email, API_BASE]);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setToken(null);
          setStep('email');
          return;
        }
        throw new Error(data.error || 'Failed to load orders');
      }
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE]);

  const logout = () => {
    setToken(null);
    setStep('email');
    setEmail('');
    setOtp('');
    setOrders([]);
    setError(null);
  };

  if (step === 'email') {
    return (
      <section className="py-20 bg-[#0B0F14] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-[#A3E635] rounded-sm" />
              <span className="font-bold font-display text-xl text-white tracking-tight">
                IRONFORM<span className="text-[#A3E635]"> Gear</span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">View my orders</h2>
            <p className="text-sm text-slate-400 mb-6">
              Enter your email to receive a verification code
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#0B0F14] border border-[#1F2937] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all"
                  required
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-[#7F1D1D]/20 border border-[#7F1D1D]/50 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                onClick={requestOtp}
                disabled={loading}
                className="w-full py-3 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md transition-all"
              >
                {loading ? 'Sending…' : 'Send code'}
              </button>
            </form>
            <Link
              to="/shop"
              className="block text-center mt-6 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              ← Back to shop
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (step === 'otp') {
    return (
      <section className="py-20 bg-[#0B0F14] min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-[#A3E635] rounded-sm" />
              <span className="font-bold font-display text-xl text-white tracking-tight">
                IRONFORM<span className="text-[#A3E635]"> Gear</span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Code</h2>
            <p className="text-sm text-slate-400 mb-6">
              Enter the 6-digit code sent to{' '}
              <span className="text-[#A3E635] font-medium">{email}</span>
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Verification code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg bg-[#0B0F14] border border-[#1F2937] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all text-center text-xl font-mono letter-spacing-widest"
                  required
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-[#7F1D1D]/20 border border-[#7F1D1D]/50 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-3 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md transition-all"
              >
                {loading ? 'Verifying…' : 'Verify code'}
              </button>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Change email
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // Orders dashboard
  return (
    <section className="py-12 bg-[#0B0F14] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/shop"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to shop
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white border border-[#1F2937] rounded-lg hover:bg-[#181C21] transition-colors"
            >
              <Lock className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-10 h-10 mx-auto mb-4 text-slate-500" />
            <h2 className="text-xl font-bold text-white mb-2">No orders found</h2>
            <p className="text-slate-400">
              No orders found for {email}. Start shopping to place your first order.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] rounded-md transition-all mt-6"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#111827] border border-[#1F2937] rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium border ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  {order.order_items?.map((item: OrderItem) => (
                    <div key={item.name} className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">{item.name}</span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span>{item.quantity}x</span>
                        <span>{formatNaira(item.unit_price_ngn)}</span>
                      </div>
                      <span className="font-medium text-white">
                        {formatNaira(item.unit_price_ngn * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-lg font-bold text-white border-t border-[#1F2937] pt-4">
                  <span>Total</span>
                  <span>{formatNaira(order.total_ngn)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
