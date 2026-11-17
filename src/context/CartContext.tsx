import React, { createContext, useContext, useReducer, useCallback, ReactNode, useState, useEffect } from 'react';
import { type Product, formatNaira } from '../data/products';

type CartItem = {
  id: string;
  name: string;
  price_ngn: number;
  image_url: string | null;
  quantity: number;
};

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

function isValidCartItem(item: any): item is CartItem {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price_ngn === 'number' &&
    typeof item.quantity === 'number'
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
          drawerOpen: true,
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: action.product.id,
            name: action.product.name,
            price_ngn: action.product.price_ngn,
            image_url: action.product.image_url ?? null,
            quantity: 1,
          },
        ],
        drawerOpen: true,
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'CHANGE_QTY': {
      const next = state.items.map((i) => {
        if (i.id !== action.id) return i;
        return { ...i, quantity: Math.max(0, i.quantity + action.delta) };
      });
      return { ...state, items: next.filter((i) => i.quantity > 0) };
    }
    case 'OPEN_DRAWER':
      return { ...state, drawerOpen: true };
    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false };
    case 'TOGGLE_DRAWER':
      return { ...state, drawerOpen: !state.drawerOpen };
    case 'HYDRATE':
      return { ...state, items: action.items.filter(isValidCartItem) };
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

  // Load cart from localStorage on mount, with migration guard
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ironform_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.items)) {
          // Migration: if any item has old 'price' field instead of 'price_ngn', reset
          const hasOldShape = parsed.items.some(
            (i: any) => i.price !== undefined && i.price_ngn === undefined,
          );
          if (hasOldShape) {
            localStorage.removeItem('ironform_cart');
            dispatch({ type: 'CLEAR' });
          } else {
            dispatch({ type: 'HYDRATE', items: parsed.items });
          }
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

  const total = state.items.reduce((sum, i) => sum + i.price_ngn * i.quantity, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

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

export { formatNaira };
