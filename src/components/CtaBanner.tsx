import React from 'react';
import { ArrowRight, CheckCircle2, Flame } from 'lucide-react';

interface CtaBannerProps {
  onClaimFreeWeek: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onClaimFreeWeek }) => {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-r from-[#111827] via-[#181C21] to-[#111827] border-y border-[#1F2937]">
      {/* Subtle lime glow accent */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-[#A3E635]/10 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0F14] border border-[#A3E635]/40 text-xs font-display font-bold uppercase tracking-wider text-[#A3E635]">
            <Flame className="w-3.5 h-3.5" />
            <span>Limited Introductory Opportunity</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white leading-tight text-balance">
            YOUR FIRST WEEK IS FREE. <br className="hidden sm:inline" />
            <span className="text-[#A3E635]">TEST OUR STANDARD IN OWERRI.</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Experience 7 consecutive days of unrestricted access: attend daily MetCon and strength classes, lift on our Olympic platforms, and experience zero power interruption. No bank card required.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onClaimFreeWeek}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm uppercase font-semibold font-display tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] transition-all rounded-md shadow-xl shadow-[#A3E635]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap"
            >
              <span>Claim Your Free Week</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Full class timetable included</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>1-on-1 Movement assessment</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Zero cancellation hassle</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
