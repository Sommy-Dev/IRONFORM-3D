import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Mail, Phone } from 'lucide-react';
import { formatNaira } from '../data/products';
import { useCart } from '../context/CartContext';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [reference, setReference] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    const ref = searchParams.get('reference') || null;
    setReference(ref);
  }, [searchParams]);

  const verifyOrder = useCallback(async () => {
    if (!reference) {
      setError('No reference provided');
      setLoading(false);
      setStatus('failed');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/orders/verify/${reference}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setOrder(data.order);
      setStatus(data.verified ? 'success' : 'failed');

      if (data.verified) {
        clearCart();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  }, [reference, API_BASE, clearCart]);

  useEffect(() => {
    verifyOrder();
  }, [verifyOrder]);

  if (loading) {
    return (
      <section className="py-20 bg-[#0B0F14] text-center">
        <div className="max-w-xl mx-auto px-6">
          <div className="h-10 w-10 rounded-full border-4 border-[#A3E635]/30 border-t-[#A3E635] animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Verifying payment…</h2>
          <p className="text-slate-400">Please wait while we confirm your order.</p>
        </div>
      </section>
    );
  }

  if (error || status === 'failed') {
    return (
      <section className="py-20 bg-[#0B0F14] text-center">
        <div className="max-w-xl mx-auto px-6">
          <XCircle className="w-10 h-10 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Payment failed
          </h2>
          {error && (
            <p className="text-slate-400 mb-6">{error}</p>
          )}
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] rounded-md transition-all"
          >
            Try again <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  if (status === 'success' && order) {
    return (
      <section className="py-20 bg-[#0B0F14] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-[#A3E635]" />
            <h2 className="text-3xl font-bold text-white mb-2">
              Payment successful
            </h2>
            <p className="text-slate-400">
              Your order has been confirmed. Thank you for shopping with
              IRONFORM Gear!
            </p>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-6">
            <h3 className="font-bold text-white mb-6">Order Summary</h3>

            <div className="mb-6">
              <p className="text-sm text-slate-400">Order reference</p>
              <p className="font-mono text-white">{order.paystack_reference || order.id}</p>
            </div>

            <div className="space-y-4 mb-6">
              {order.order_items?.map((item: any) => (
                <div
                  key={item.product_id}
                  className="flex justify-between items-center border-b border-[#1F2937] pb-3"
                >
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      {item.product?.name || item.product_id}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {item.quantity}x
                    </p>
                  </div>
                  <span className="font-semibold text-white">
                    {formatNaira(((item.unit_price || item.product?.price_ngn || 0) * item.quantity))}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span>{formatNaira(order.total)}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 mb-4">
              A confirmation has been sent to{' '}
              <span className="text-white font-medium">{order.customer_email}</span>
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] rounded-md transition-all"
            >
              Continue shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return null;
};
