import React from 'react';
import { X, Minus, Plus, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type Product } from '../data/products';
import { WHATSAPP_NUMBER } from '../data/products';
import { useCart } from '../context/CartContext';

type CartItem = Product & { qty: number };

export const CartDrawer: React.FC = () => {
  const { items, total, itemCount, drawerOpen, closeDrawer, removeFromCart, changeQty } = useCart();
  const navigate = useNavigate();

  const buildMessage = () => {
    const lines = items
      .map(
        (i) =>
          `- ${i.qty}x ${i.name} - ₦${(i.price * i.qty).toLocaleString()}`,
      )
      .join('%0A');
    return `Hi IRONFORM Gear,%0A%0AI'd like to order:%0A${lines}%0A%0ATotal: ₦${total.toLocaleString()}`;
  };

  if (!drawerOpen) return null;

  return (
    <>
      <button
        onClick={closeDrawer}
        className="fixed inset-0 z-40 bg-black/60 transition-opacity opacity-100 pointer-events-auto"
        aria-label="Close cart"
      />
      <div
        className="fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-[#111827] border-l border-[#1F2937] shadow-2xl transform transition-transform duration-300 translate-x-0 flex flex-col"
        aria-label="Cart"
      >
        <div className="p-5 border-b border-[#1F2937] flex items-center justify-between">
          <h2 className="font-bold text-xl text-white">Cart ({itemCount})</h2>
          <button onClick={closeDrawer} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded bg-[#0B0F14]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h4 className="font-semibold text-white text-sm truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-500 hover:text-[#A3E635]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      ₦{item.price.toLocaleString()} each
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="w-7 h-7 rounded border border-[#374151] flex items-center justify-center text-xs font-bold text-white hover:bg-[#A3E635] hover:text-[#0B0F14] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-white">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="w-7 h-7 rounded border border-[#374151] flex items-center justify-center text-xs font-bold text-white hover:bg-[#A3E635] hover:text-[#0B0F14] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-5 border-t border-[#1F2937] bg-[#0B0F14]/50">
          <div className="flex justify-between text-lg font-bold text-white mb-1">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => {
              if (items.length === 0) return;
              navigate('/checkout');
              closeDrawer();
            }}
            disabled={items.length === 0}
            className="w-full mt-4 py-3 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md transition-all shadow-lg shadow-[#A3E635]/20"
          >
            Checkout
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-3 py-3 text-sm uppercase font-semibold tracking-wider text-white border border-[#374151] hover:border-[#A3E635] hover:text-[#A3E635] active:scale-[0.98] transition-all rounded-md text-center"
          >
            <Phone className="w-4 h-4 inline mr-2" /> Ask on WhatsApp
          </a>
          <p className="mt-3 text-xs text-slate-500 text-center">
            Opens WhatsApp to{' '}
            <span className="text-[#A3E635] font-medium">{WHATSAPP_NUMBER}</span>
          </p>
        </div>
      </div>
    </>
  );
};
