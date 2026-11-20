import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { StoreNavbar } from './components/StoreNavbar';
import { StoreHero } from './components/StoreHero';
import { HomeIntroStrip } from './components/HomeIntroStrip';
import { HomeCategoryCards } from './components/HomeCategoryCards';
import { HomeFeaturedProducts } from './components/HomeFeaturedProducts';
import { HomeBenefits } from './components/HomeBenefits';
import { HomeNumbersStrip } from './components/HomeNumbersStrip';
import { HomeTestimonials } from './components/HomeTestimonials';
import { HomeCTA } from './components/HomeCTA';
import { StoreFooter } from './components/StoreFooter';
import { CartDrawer } from './components/CartDrawer';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShopPage } from './pages/Shop';
import { CheckoutPage } from './pages/Checkout';
import { OrderSuccessPage } from './pages/OrderSuccess';
import { OrdersPage } from './pages/Orders';
import { fetchProducts, type Product } from './data/products';

const SteelRack = React.lazy(() =>
  import('./components/SteelRack').then((mod) => ({ default: mod.SteelRack })),
);

class SteelRackErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: string | null }
> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(_error: Error): { hasError: boolean; error: string | null } {
    return { hasError: true, error: _error.message };
  }
  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }
    return <>{this.props.children}</>;
  }
}

function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchProducts();
        if (!cancelled) {
          setFeatured(data.slice(0, 3));
        }
      } catch {
        if (!cancelled) setFeatured([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <>
        <StoreNavbar />
        <main className="flex-1">
          <section className="py-20 bg-[#0B0F14] text-center">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="h-8 w-32 bg-[#1F2937] rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-[#1F2937] rounded animate-pulse" />
            </div>
          </section>
        </main>
        <StoreFooter />
      </>
    );
  }

  return (
    <>
      <StoreNavbar />
      <main className="flex-1">
        <StoreHero />
        <SteelRackErrorBoundary
          fallback={
            <section className="w-full bg-[#0B0F14] text-[#E0E2EA] py-20 text-center">
              <p className="text-sm font-medium text-white">3D section unavailable</p>
              <p className="text-xs mt-1 text-slate-500 break-words">
                The steel rack 3D view could not be displayed.
              </p>
            </section>
          }
        >
          <Suspense fallback={
            <section className="w-full bg-[#0B0F14] text-[#E0E2EA] py-20 text-center">
              <p className="text-sm text-slate-400">Loading 3D section…</p>
            </section>
          }>
            <SteelRack />
          </Suspense>
        </SteelRackErrorBoundary>
        <HomeIntroStrip />
        <HomeCategoryCards />
        <ErrorBoundary
          fallback={
            <section className="w-full bg-[#0B0F14] text-[#E0E2EA] py-20 text-center">
              <p className="text-sm font-medium text-white">Featured products unavailable</p>
            </section>
          }
        >
          <HomeFeaturedProducts products={featured} />
        </ErrorBoundary>
        <HomeBenefits />
        <HomeNumbersStrip />
        <HomeTestimonials />
        <HomeCTA />
      </main>
      <StoreFooter />
    </>
  );
}

function ShopLayout() {
  return (
    <>
      <StoreNavbar />
      <main className="flex-1">
        <ScrollToTop />
        <ShopPage />
      </main>
      <StoreFooter />
    </>
  );
}

function CheckoutLayout() {
  return (
    <>
      <StoreNavbar />
      <main className="flex-1">
        <CheckoutPage />
      </main>
      <StoreFooter />
    </>
  );
}

function OrderSuccessLayout() {
  return (
    <>
      <StoreNavbar />
      <main className="flex-1">
        <OrderSuccessPage />
      </main>
      <StoreFooter />
    </>
  );
}

function OrdersLayout() {
  return (
    <>
      <StoreNavbar />
      <main className="flex-1">
        <OrdersPage />
      </main>
      <StoreFooter />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopLayout />} />
          <Route path="/checkout" element={<CheckoutLayout />} />
          <Route path="/order/success" element={<OrderSuccessLayout />} />
          <Route path="/orders" element={<OrdersLayout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
