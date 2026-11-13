import React from 'react';
import { FadeUp } from './FadeUp';

type Stat = { label: string; value: string };

const STATS: Stat[] = [
  { label: 'Products', value: '500+' },
  { label: 'Warranty', value: '10-year' },
  { label: 'Support', value: '24/7' },
];

export const HomeNumbersStrip: React.FC = () => {
  return (
    <FadeUp className="py-16 border-y border-[#1F2937]/40 bg-[#0B0F14]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-sm text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FadeUp>
  );
};
