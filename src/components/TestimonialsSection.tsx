import React from 'react';
import { Star, Quote, MapPin } from 'lucide-react';
import { TESTIMONIALS } from '../data/gymData';
import { SafeImage } from './SafeImage';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#0B0F14] border-t border-[#1F2937]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-[#A3E635] uppercase font-semibold mb-2">
            <span>Verified Member Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white text-balance">
            PROOF FORGED ON THE RIGS
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Real professionals, entrepreneurs, and athletes in Owerri training without excuses. Here is what consistent coaching delivers.
          </p>
        </div>

        {/* Testimonials 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between bg-[#111827] border border-[#1F2937] hover:border-[#374151] rounded-lg p-7 transition-all duration-200 shadow-md relative group"
            >
              <div>
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#A3E635]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#A3E635]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-600 opacity-60" />
                </div>

                {/* Quote text */}
                <blockquote className="text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mt-6 pt-5 border-t border-[#1F2937]">
                {/* Highlighted Achievement */}
                <div className="text-xs font-display font-semibold text-[#A3E635] mb-3 bg-[#0B0F14]/70 px-2.5 py-1 rounded inline-block border border-[#1F2937]">
                  {item.achievement}
                </div>

                {/* Member Profile */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#374151] bg-[#181C21] shrink-0">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      fallbackLabel={item.name}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold font-display text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {item.role}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#A3E635]" />
                      <span>{item.location}, Owerri</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
