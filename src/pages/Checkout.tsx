import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone, Home, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export const CheckoutPage: React.FC = () => {
  const { items, total, itemCount } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  if (itemCount === 0) {
    return (
      <section className="py-20 bg-[#0B0F14] text-center">
        <div className="max-w-xl mx-auto px-6">
          <Home className="w-10 h-10 mx-auto mb-4 text-slate-500" />
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-8">Add some products before checking out.</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] rounded-md transition-all"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE}/api/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: formData,
            items: items.map((i) => ({
              productId: i.id,
              quantity: i.qty,
            })),
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.authorization_url) {
          throw new Error(data.error || 'Checkout failed');
        }

        window.location.href = data.authorization_url;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
        setLoading(false);
      }
    },
    [items, formData, API_BASE],
  );

  return (
    <section className="py-12 bg-[#0B0F14] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/shop"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to shop
          </Link>
          <span className="text-sm text-slate-500">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Your Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#1F2937] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#1F2937] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="08012345678"
                    className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#1F2937] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Delivery address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Street, City, State"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-[#1F2937] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#A3E635] outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-[#7F1D1D]/20 border border-[#7F1D1D]/50 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md transition-all shadow-lg shadow-[#A3E635]/20"
            >
              {loading ? 'Processing…' : 'Pay with Paystack'}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-6">
            <h3 className="font-bold text-white mb-6">Order Summary</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {item.qty}x ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-semibold text-white">
                    ₦{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[#1F2937]">
              <div className="flex justify-between text-lg font-bold text-white mb-1">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-500">
                You’ll be redirected to Paystack to complete payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
