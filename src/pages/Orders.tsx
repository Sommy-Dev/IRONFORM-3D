import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Clock } from 'lucide-react';
import { formatNaira } from '../data/products';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const STATUS_COLORS: Record<string, string> = {
  paid: 'bg-[#A3E635]/20 text-[#A3E635] border-[#A3E635]/50',
  pending: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50',
  failed: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50',
};

export const OrdersPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewed, setViewed] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/orders?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load orders');
      }
      setOrders(data.orders || []);
      setViewed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [email, API_BASE]);

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
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">View my orders</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-[#0B0F14] border border-[#1F2937] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all"
              />
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="px-6 py-3 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md transition-all"
              >
                {loading ? 'Loading…' : 'View my orders'}
              </button>
            </div>
            {error && (
              <div className="p-4 rounded-lg bg-[#7F1D1D]/20 border border-[#7F1D1D]/50 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {viewed && orders.length === 0 ? (
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
              <div
                key={order.id}
                className="bg-[#111827] border border-[#1F2937] rounded-xl p-6"
              >
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
                  {order.order_items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
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
