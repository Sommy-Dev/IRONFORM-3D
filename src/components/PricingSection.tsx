import React from 'react';
import { Check, Zap, Sparkles } from 'lucide-react';
import { PRICING_PLANS } from '../data/gymData';
import { PlanId } from '../types';

interface PricingSectionProps {
  onSelectPlan: (planId: PlanId) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#111827]/40 border-t border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-[#A3E635] uppercase font-semibold mb-2">
            <span>Transparent Memberships</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white text-balance">
            MEMBERSHIP TIERS FOR SERIOUS COMMITMENT
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            No hidden maintenance fees, no sign-up registration surcharges. Clean Nigerian Naira pricing with guaranteed facility standards.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-lg p-7 sm:p-8 transition-all duration-200 ${
                  isPopular
                    ? 'bg-[#111827] border-2 border-[#A3E635] shadow-[0_0_30px_-5px_rgba(163,230,53,0.18)] lg:-translate-y-2'
                    : 'bg-[#111827] border border-[#1F2937] hover:border-[#374151]'
                }`}
              >
                {/* Popular Pill Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#A3E635] text-[#0B0F14] text-xs font-display font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{plan.badge || 'MOST POPULAR'}</span>
                  </div>
                )}

                {/* Plan Header */}
                <div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-5 pb-6 border-b border-[#1F2937]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-bold font-display text-white tracking-tight tabular-nums">
                        {plan.price}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-display uppercase tracking-wider block mt-1">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="py-6 flex-1">
                  <p className="text-xs font-display font-semibold uppercase tracking-wider text-slate-300 mb-4">
                    What&apos;s Included:
                  </p>
                  <ul className="space-y-3.5" role="list">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                        <div
                          className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                            isPopular ? 'text-[#0B0F14] bg-[#A3E635]' : 'text-[#A3E635] bg-[#1F2937]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Action */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan.id)}
                    className={`w-full py-3.5 px-4 text-xs uppercase font-display tracking-wider font-semibold rounded-md transition-all active:scale-[0.98] ${
                      isPopular
                        ? 'bg-[#A3E635] hover:bg-[#b2f746] text-[#0B0F14] shadow-md shadow-[#A3E635]/20'
                        : 'bg-[#181C21] hover:bg-[#A3E635] text-white hover:text-[#0B0F14] border border-[#374151] hover:border-[#A3E635]'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                  </button>
                  
                  {isPopular && (
                    <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3 text-[#A3E635]" />
                      <span>Instant reservation with zero registration fee</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
