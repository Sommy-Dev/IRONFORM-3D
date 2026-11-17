import React, { Suspense } from 'react';
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
import { ShopPage } from './pages/Shop';
import { PRODUCTS } from './data/products';

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

const FEATURED = PRODUCTS.slice(0, 3);

function HomePage() {
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
        <HomeFeaturedProducts products={FEATURED} />
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

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopLayout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
