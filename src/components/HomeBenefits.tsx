import React from 'react';
import {
  ShieldCheck,
  Truck,
  Headphones,
  LifeBuoy,
} from 'lucide-react';
import { FadeUp } from './FadeUp';

type Benefit = {
  name: string;
  desc: string;
  Icon: React.ElementType;
};

const BENEFITS: Benefit[] = [
  {
    name: 'Heavy-duty steel build',
    desc: 'Commercial-grade frames built to take daily punishment.',
    Icon: ShieldCheck,
  },
  {
    name: 'Warranty',
    desc: 'Up to 10-year warranty on frames and structural parts.',
    Icon: LifeBuoy,
  },
  {
    name: 'Delivery nationwide',
    desc: 'We ship to gyms and homes across the country.',
    Icon: Truck,
  },
  {
    name: 'Expert advice',
    desc: 'Coaching-backed guidance to pick the right gear.',
    Icon: Headphones,
  },
];

export const HomeBenefits: React.FC = () => {
  return (
    <FadeUp className="py-20 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Why IRONFORM Gear
          </h2>
          <p className="text-slate-400">Built for athletes, backed by service.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.Icon;
            return (
              <div
                key={benefit.name}
                className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] text-center hover:border-[#A3E635]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-white mb-2">
                  {benefit.name}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </FadeUp>
  );
};
