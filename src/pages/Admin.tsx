import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock, LogOut } from 'lucide-react';
import { formatNaira } from '../data/products';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50',
  paid: 'bg-[#A3E635]/20 text-[#A3E635] border-[#A3E635]/50',
  shipped: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/50',
  delivered: 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/50',
  cancelled: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50',
};

const STATUS_OPTIONS: string[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

type AdminOrder = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  total_ngn: number;
  status: string;
  paystack_reference: string | null;
  created_at: string;
  order_items: Array<{ name: string; quantity: number; unit_price_ngn: number }>;
};

export const AdminPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'dashboard'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    total: number;
    paid: number;
    revenue: number;
  }>({ total: 0, paid: 0, revenue: 0 });

  const requestOtp = useCallback(async () => {
    if (!email.trim()) {
      setLoginError('Please enter your email address');
      return;
    }
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/request-otp`, {
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
      setLoginError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setLoginLoading(false);
    }
  }, [email, API_BASE]);

  const verifyOtp = useCallback(async () => {
    if (!otp.trim()) {
      setLoginError('Please enter the code');
      return;
    }
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid code');
      }
      setToken(data.token);
      setStep('dashboard');
      loadOrders();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoginLoading(false);
    }
  }, [otp, email, API_BASE]);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders`, {
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
      const orderList = (data.orders || []) as AdminOrder[];
      setOrders(orderList);
      const paid = orderList.filter((o) => o.status === 'paid');
      setSummary({
        total: orderList.length,
        paid: paid.length,
        revenue: paid.reduce((sum, o) => sum + o.total_ngn, 0),
      });
    } catch (err) {
      setOrdersError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  }, [token, API_BASE]);

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to update status');
        }
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
        setSummary((prev) => {
          const paid = prev.paid;
          const revenue = prev.revenue;
          if (newStatus === 'paid' && newStatus !== 'paid') {
            return { total: prev.total, paid: paid + 1, revenue: revenue };
          }
          return prev;
        });
      } catch (err) {
        setOrdersError(err instanceof Error ? err.message : 'Failed to update status');
      }
    },
    [token, API_BASE],
  );

  const logout = () => {
    setToken(null);
    setStep('email');
    setEmail('');
    setOtp('');
    setOrders([]);
    setSummary({ total: 0, paid: 0, revenue: 0 });
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
            <h2 className="text-2xl font-bold text-white mb-2">Admin Login</h2>
            <p className="text-sm text-slate-400 mb-6">Enter your admin email address</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ironform.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#0B0F14] border border-[#1F2937] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all"
                  required
                />
              </div>
              {loginError && (
                <div className="p-3 rounded-lg bg-[#7F1D1D]/20 border border-[#7F1D1D]/50 text-red-400 text-sm">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                onClick={requestOtp}
                disabled={loginLoading}
                className="w-full py-3 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md transition-all"
              >
                {loginLoading ? 'Sending…' : 'Send code'}
              </button>
            </form>
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
              Enter the 6-digit code sent to <span className="text-[#A3E635] font-medium">{email}</span>
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
              {loginError && (
                <div className="p-3 rounded-lg bg-[#7F1D1D]/20 border border-[#7F1D1D]/50 text-red-400 text-sm">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                onClick={verifyOtp}
                disabled={loginLoading}
                className="w-full py-3 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md transition-all"
              >
                {loginLoading ? 'Verifying…' : 'Verify code'}
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

  // Dashboard
  return (
    <section className="py-8 bg-[#0B0F14] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Manage orders and store settings</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Admin: {email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white border border-[#1F2937] rounded-lg hover:bg-[#181C21] transition-colors"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-6">
            <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Total orders</p>
            <p className="text-2xl font-bold text-white">{summary.total}</p>
          </div>
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-6">
            <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Paid orders</p>
            <p className="text-2xl font-bold text-[#A3E635]">{summary.paid}</p>
          </div>
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-6">
            <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Revenue (paid)</p>
            <p className="text-2xl font-bold text-white">{formatNaira(summary.revenue)}</p>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-[#1F2937]">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-[#1F2937]">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-[#1F2937]">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-[#1F2937]">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-[#1F2937]">
                    Address
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-[#1F2937]">
                    Items
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-[#1F2937]">
                    Total
                  </th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-[#1F2937]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordersLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      Loading orders…
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-[#1F2937]">
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{order.customer_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {order.customer_email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {order.customer_phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {order.delivery_address}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {order.order_items
                          .map((i) => `${i.quantity}x ${i.name}`)
                          .join(', ')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {formatNaira(order.total_ngn)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          disabled={ordersLoading}
                          className="px-3 py-1.5 text-sm rounded-lg bg-[#0B0F14] border border-[#1F2937] text-white focus:ring-2 focus:ring-[#A3E635] outline-none transition-all"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {ordersError && (
          <div className="mt-4 p-4 rounded-lg bg-[#7F1D1D]/20 border border-[#7F1D1D]/50 text-red-400 text-sm">
            {ordersError}
          </div>
        )}
      </div>
    </section>
  );
};
