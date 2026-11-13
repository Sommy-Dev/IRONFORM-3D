import React from 'react';
import { FadeUp } from './FadeUp';

export const HomeIntroStrip: React.FC = () => {
  return (
    <FadeUp className="py-16 border-y border-[#1F2937]/40 bg-[#0B0F14]/30">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-lg sm:text-xl text-slate-300 leading-relaxed italic">
          IRONFORM Gear supplies commercial and home gym equipment: free weights,
          benches, racks, cardio machines and accessories, built to take daily
          punishment.
        </p>
      </div>
    </FadeUp>
  );
};
