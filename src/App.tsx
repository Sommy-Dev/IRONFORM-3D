import React from 'react';
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

const FEATURED = PRODUCTS.slice(0, 3);

function HomePage() {
  return (
    <>
      <StoreNavbar />
      <main className="flex-1">
        <StoreHero />
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
