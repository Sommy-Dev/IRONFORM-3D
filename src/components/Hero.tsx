import React from 'react';
import { ArrowRight, ShieldCheck, Zap, MapPin } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface HeroProps {
  onClaimFreeWeek: () => void;
  onExploreClasses: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onClaimFreeWeek, onExploreClasses }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-[#1F2937]/60">
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#A3E635]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location & Trust Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#111827] border border-[#1F2937] text-xs font-display tracking-wider text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#A3E635]" />
              <span className="text-[#A3E635] font-semibold uppercase">Owerri, Nigeria</span>
              <span className="text-slate-500">·</span>
              <span>New Owerri Conditioning Arena</span>
            </div>

            {/* Display Hero Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.1] text-balance">
              DISCIPLINED POWER. <br />
              <span className="text-[#A3E635]">ELITE CONDITIONING.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Owerri’s premier strength & conditioning arena. High-intensity MetCon, 
              Olympic lifting platforms, certified coaching, and guaranteed 24/7 power. 
              Built for athletes who refuse mediocre workouts.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onClaimFreeWeek}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm uppercase font-semibold font-display tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] transition-all rounded-md shadow-lg shadow-[#A3E635]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap"
              >
                <span>Claim Free Week</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClasses}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm uppercase font-semibold font-display tracking-wider text-white bg-[#111827] hover:bg-[#181C21] border border-[#374151] hover:border-slate-500 active:scale-[0.98] transition-all rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] whitespace-nowrap"
              >
                <span>Explore Classes</span>
              </button>
            </div>

            {/* Trust Signals Strip */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#A3E635] shrink-0" />
                <span>24/7 Zero Power Outages (Dual Generators)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A3E635] shrink-0" />
                <span>Certified Strength & Conditioning Coaches</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden border border-[#1F2937] bg-[#111827] shadow-2xl">
              {/* Image Frame */}
              <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full relative">
                <SafeImage
                  src="/images/hero.jpg"
                  alt="Elite Black Nigerian athlete deadlifting barbell at IRONFORM Gym Owerri"
                  className="w-full h-full object-cover object-top"
                  fallbackLabel="IRONFORM Gym Owerri"
                />
                
                {/* Atmospheric gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-black/20" />

                {/* Floating Telemetry Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#111827]/90 backdrop-blur-md border border-[#1F2937] p-3.5 rounded-md flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-display uppercase tracking-wider text-[#A3E635] font-semibold">
                      Live Facility Status
                    </p>
                    <p className="text-sm font-semibold text-white">
                      Rigs & Platforms Open
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-[#A3E635]" />
                    <span>New Owerri</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
