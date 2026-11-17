import React, { createContext, useContext, useReducer, useCallback, ReactNode, useState, useEffect } from 'react';
import { type Product } from '../data/products';

type CartItem = Product & { qty: number };

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
};

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: string }
  | { type: 'CHANGE_QTY'; id: string; delta: number }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'CLEAR' };

const initialState: CartState = { items: [], drawerOpen: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i,
          ),
          drawerOpen: true,
        };
      }
      return {
        items: [...state.items, { ...action.product, qty: 1 }],
        drawerOpen: true,
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'CHANGE_QTY': {
      const next = state.items.map((i) => {
        if (i.id !== action.id) return i;
        return { ...i, qty: Math.max(0, i.qty + action.delta) };
      });
      return { ...state, items: next.filter((i) => i.qty > 0) };
    }
    case 'OPEN_DRAWER':
      return { ...state, drawerOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false };
    case 'TOGGLE_DRAWER':
      return { ...state, drawerOpen: !state.drawerOpen };
    case 'HYDRATE':
      return { ...state, items: action.items };
    case 'CLEAR':
      return { ...state, items: [], drawerOpen: false };
    default:
      return state;
  }
}

const CartContext = createContext<{
  items: CartItem[];
  total: number;
  itemCount: number;
  drawerOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  clearCart: () => void;
} | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ironform_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.items)) {
          dispatch({ type: 'HYDRATE', items: parsed.items });
        }
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(
        'ironform_cart',
        JSON.stringify({ items: state.items }),
      );
    } catch {
      // ignore localStorage errors
    }
  }, [state.items]);

  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);

  const addToCart = useCallback((product: Product) => {
    dispatch({ type: 'ADD', product });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    dispatch({ type: 'CHANGE_QTY', id, delta });
  }, []);

  const openDrawer = useCallback(() => dispatch({ type: 'OPEN_DRAWER' }), []);
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), []);
  const toggleDrawer = useCallback(() => dispatch({ type: 'TOGGLE_DRAWER' }), []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
    try {
      localStorage.removeItem('ironform_cart');
    } catch {
      // ignore
    }
  }, []);

  return (
    <CartContext.Provider value={{
      items: state.items,
      total,
      itemCount,
      drawerOpen: state.drawerOpen,
      addToCart,
      removeFromCart,
      changeQty,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
