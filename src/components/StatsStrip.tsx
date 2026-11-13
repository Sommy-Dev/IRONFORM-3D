import React from 'react';
import { GYM_INFO } from '../data/gymData';

export const StatsStrip: React.FC = () => {
  return (
    <section 
      aria-label="Performance Metrics" 
      className="bg-[#111827] border-y border-[#1F2937] py-8 sm:py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {GYM_INFO.stats.map((stat, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-start p-3 sm:p-4 rounded-md bg-[#0B0F14]/50 border border-[#1F2937]/80 hover:border-[#374151] transition-colors"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white tabular-nums">
                {stat.value}
              </span>
              <span className="text-sm font-semibold font-display uppercase tracking-wider text-[#A3E635] mt-1">
                {stat.label}
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                {stat.context}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
