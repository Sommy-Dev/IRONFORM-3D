import React from 'react';
import { ArrowRight, Clock, Users } from 'lucide-react';
import { CLASSES } from '../data/gymData';
import { SafeImage } from './SafeImage';

interface ClassesSectionProps {
  onSelectClass: (className: string) => void;
}

export const ClassesSection: React.FC<ClassesSectionProps> = ({ onSelectClass }) => {
  return (
    <section id="classes" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-[#A3E635] uppercase font-semibold mb-2">
            <span>Specialized Conditioning</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white text-balance">
            DAILY PROGRAMMING BUILT FOR ATHLETES
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Four daily class formats engineered to systematically advance raw power, metabolic endurance, mobility, and functional grit.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-display">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" />
          <span>Eleiko Barbell Rigs · Concept2 Rowers & Bikes</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CLASSES.map((item) => (
          <div
            key={item.id}
            className="flex flex-col bg-[#111827] border border-[#1F2937] hover:border-[#374151] rounded-lg overflow-hidden transition-all duration-200 group shadow-md"
          >
            {/* Card Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#181C21]">
              <SafeImage
                src={item.image}
                alt={`${item.title} class at IRONFORM Owerri`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                fallbackLabel={item.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />
              
              <div className="absolute top-3 left-3 bg-[#0B0F14]/90 border border-[#1F2937] px-2.5 py-1 rounded text-[11px] font-display font-semibold uppercase tracking-wider text-[#A3E635]">
                {item.category}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl font-bold font-display text-white group-hover:text-[#A3E635] transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Class Intensity Meter */}
              <div className="pt-2 border-t border-[#1F2937]">
                <div className="flex items-center justify-between text-xs font-display text-slate-300 mb-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Intensity Level</span>
                  <span className="text-[#A3E635] font-bold">{item.intensity}/5</span>
                </div>
                {/* Segmented bar chart */}
                <div className="grid grid-cols-5 gap-1.5 h-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-full rounded-sm transition-colors ${
                        level <= item.intensity
                          ? 'bg-[#A3E635]'
                          : 'bg-[#1F2937]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Metadata strip */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.capacity}</span>
                </div>
              </div>

              {/* Coach and Schedule */}
              <div className="text-[11px] text-slate-400 bg-[#0B0F14]/60 p-2.5 rounded border border-[#1F2937]/50">
                <div className="font-semibold text-slate-300 font-display">{item.coach}</div>
                <div className="text-slate-400 mt-0.5">{item.schedule}</div>
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={() => onSelectClass(item.title)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#181C21] hover:bg-[#A3E635] text-white hover:text-[#0B0F14] border border-[#374151] hover:border-[#A3E635] text-xs font-display uppercase tracking-wider font-semibold rounded-md transition-all active:scale-[0.98] group-hover:bg-[#A3E635] group-hover:text-[#0B0F14] group-hover:border-[#A3E635]"
              >
                <span>Reserve Spot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
