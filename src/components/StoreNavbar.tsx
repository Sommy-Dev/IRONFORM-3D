import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
];

export const StoreNavbar: React.FC = () => {
  const { itemCount, toggleDrawer } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1F2937]/50 bg-[#0B0F14]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#A3E635] rounded-sm" />
            <Link to="/" className="font-bold font-display text-xl text-white tracking-tight">
              IRONFORM<span className="text-[#A3E635]"> Gear</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-[#A3E635]' : 'hover:text-[#A3E635]'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={toggleDrawer}
              className="relative p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#A3E635] text-[#0B0F14] text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={toggleDrawer}
              className="relative p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#A3E635] text-[#0B0F14] text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[#1F2937]/50 bg-[#0B0F14] py-6 px-4">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(link.to);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-300 hover:text-[#A3E635] transition-colors rounded-lg"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  toggleDrawer();
                }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-300 hover:text-[#A3E635] transition-colors rounded-lg flex items-center justify-between"
              >
                <span>Cart ({itemCount})</span>
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
