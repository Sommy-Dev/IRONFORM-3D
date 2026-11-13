import React from 'react';
import { Quote } from 'lucide-react';
import { FadeUp } from './FadeUp';

type Testimonial = { quote: string; name: string; role: string };

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The rack is solid as a rock. Best purchase I've made for my home gym.",
    name: 'Tunde A.',
    role: 'Lagos, Nigeria',
  },
  {
    quote: 'Delivery was fast and the bench feels commercial-grade.',
    name: 'Chinwe O.',
    role: 'Abuja, Nigeria',
  },
  {
    quote: 'Great equipment at fair prices. Highly recommend IRONFORM Gear.',
    name: 'Samuel E.',
    role: 'Port Harcourt, Nigeria',
  },
];

export const HomeTestimonials: React.FC = () => {
  return (
    <FadeUp className="py-20 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            What Our Customers Say
          </h2>
          <p className="text-slate-400">Real feedback from real lifters.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] relative"
            >
              <div className="w-8 h-8 text-[#A3E635]/30 mb-4">
                <Quote className="w-8 h-8" />
              </div>
              <p className="text-slate-300 italic leading-relaxed mb-4">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-slate-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeUp>
  );
};
