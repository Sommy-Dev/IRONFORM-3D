export type Product = {
  id: string;
  name: string;
  price: number; // in Naira (₦)
  image: string;
  category: string;
  active?: boolean;
  stock?: number;
};

export const WHATSAPP_NUMBER = '234XXXXXXXXXX'; // <-- change this to your number

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export async function fetchProducts(category?: string): Promise<Product[]> {
  const url = category
    ? `${API_BASE}/api/products?category=${encodeURIComponent(category)}`
    : `${API_BASE}/api/products`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }
  const data = await res.json();
  return data.products || [];
}
