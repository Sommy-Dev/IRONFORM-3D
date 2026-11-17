export type Product = {
  id: string;
  name: string;
  price_ngn: number; // in Naira (₦)
  image_url: string | null;
  category: string;
  active?: boolean;
  stock?: number;
};

export const WHATSAPP_NUMBER = '234XXXXXXXXXX'; // <-- change this to your number

export function formatNaira(value: number | null | undefined): string {
  return '₦' + Number(value ?? 0).toLocaleString('en-NG');
}

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
  return (data.products || []).map((p: any) => ({
    id: String(p.id),
    name: p.name,
    price_ngn: p.price_ngn,
    image_url: p.image_url ?? null,
    category: p.category,
    active: p.active,
    stock: p.stock,
  }));
}
