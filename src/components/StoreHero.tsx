import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function useMediaQueries() {
  const [state, setState] = useState({
    isMobile:
      typeof window !== 'undefined' && window.innerWidth < 768,
    prefersReducedMotion:
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const rmq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () =>
      setState({
        isMobile: mq.matches,
        prefersReducedMotion: rmq.matches,
      });
    mq.addEventListener('change', handler);
    rmq.addEventListener('change', handler);
    return () => {
      mq.removeEventListener('change', handler);
      rmq.removeEventListener('change', handler);
    };
  }, []);

  return state;
}

export const StoreHero: React.FC = () => {
  const { isMobile, prefersReducedMotion } = useMediaQueries();
  const showFallback = isMobile || prefersReducedMotion;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  const fade = `transition-all duration-800 ease-out ${
    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
  }`;

  return (
    <section
      className="relative bg-[#0B0F14] text-[#E0E2EA] overflow-hidden h-[calc(100vh-4rem)] flex items-center justify-center"
    >
      <div className="absolute inset-0 w-full h-full">
        {!showFallback ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            aria-hidden="true"
          >
            <source src="/videos/hero.mp4.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/images/hero.jpg"
            alt="IRONFORM Gear gym equipment"
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14]/65 to-[#0B0F14]/90 pointer-events-none" />

      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#A3E635]/8 rounded-full blur-[100px] pointer-events-none"
      />

      <div className={`relative z-10 text-center px-6 ${fade}`}>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
          Gear built to last
        </h1>
        <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
          Premium gym equipment for serious training. Built tough, built to last.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] transition-all rounded-md shadow-lg shadow-[#A3E635]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Shop now
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm uppercase font-semibold tracking-wider text-white border border-[#374151] hover:border-[#A3E635] active:scale-[0.98] transition-all rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635]"
          >
            View catalog
          </Link>
        </div>
      </div>
    </section>
  );
};
