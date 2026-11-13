import React from 'react';
import { Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { TRAINERS } from '../data/gymData';
import { SafeImage } from './SafeImage';

interface TrainersSectionProps {
  onSelectTrainer: (trainerName: string) => void;
}

export const TrainersSection: React.FC<TrainersSectionProps> = ({ onSelectTrainer }) => {
  return (
    <section id="trainers" className="py-20 md:py-28 bg-[#0B0F14] border-t border-[#1F2937]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-[#A3E635] uppercase font-semibold mb-2">
            <span>Elite Coaching Staff</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white text-balance">
            MEET YOUR CONDITIONING DIRECTORS
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Every coach at IRONFORM possesses accredited strength and conditioning credentials, biomechanical expertise, and an uncompromising standard for lifting form.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRAINERS.map((trainer) => (
            <div
              key={trainer.id}
              className="flex flex-col bg-[#111827] border border-[#1F2937] hover:border-[#374151] rounded-lg overflow-hidden transition-all duration-200 group shadow-lg"
            >
              {/* Trainer Portrait Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#181C21]">
                <SafeImage
                  src={trainer.image}
                  alt={`${trainer.name} - ${trainer.title} at IRONFORM Owerri`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  fallbackLabel={trainer.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-85" />

                {/* Experience Badge */}
                <div className="absolute top-3 right-3 bg-[#0B0F14]/90 border border-[#1F2937] px-2.5 py-1 rounded text-xs font-display font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span className="tabular-nums">{trainer.experienceYears} Years Exp</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    {trainer.name}
                  </h3>
                  <p className="text-xs font-display font-semibold text-[#A3E635] uppercase tracking-wider mt-0.5">
                    {trainer.title}
                  </p>

                  <div className="text-xs text-slate-300 font-medium mt-2 bg-[#0B0F14]/50 py-1 px-2 rounded inline-block border border-[#1F2937]">
                    Specialty: {trainer.specialty}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
                    {trainer.bio}
                  </p>
                </div>

                {/* Credentials */}
                <div className="pt-3 border-t border-[#1F2937]">
                  <div className="text-[11px] font-display font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#A3E635]" />
                    <span>Accreditations</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.credentials.map((cred, i) => (
                      <span
                        key={i}
                        className="text-[11px] text-slate-300 bg-[#0B0F14] border border-[#1F2937] px-2 py-0.5 rounded"
                      >
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Train with Coach Button */}
                <button
                  type="button"
                  onClick={() => onSelectTrainer(trainer.name)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#181C21] hover:bg-[#A3E635] text-white hover:text-[#0B0F14] border border-[#374151] hover:border-[#A3E635] text-xs font-display uppercase tracking-wider font-semibold rounded-md transition-all active:scale-[0.98] group-hover:bg-[#A3E635] group-hover:text-[#0B0F14] group-hover:border-[#A3E635]"
                >
                  <span>Train with {trainer.name.split(' ')[1]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
