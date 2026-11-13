import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';
import { FadeUp } from './FadeUp';

export const HomeCTA: React.FC = () => {
  const message = encodeURIComponent(
    `Hi IRONFORM Gear, I'd like to equip my gym. Please send me a catalogue and pricing.`,
  );

  return (
    <FadeUp className="py-24 border-y border-[#1F2937]/40 bg-[#0B0F14]/50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Equip your gym today
        </h2>
        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Commercial and home gym equipment built to take daily punishment.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm uppercase font-semibold tracking-wider text-[#0B0F14] bg-[#A3E635] hover:bg-[#b2f746] active:scale-[0.98] transition-all rounded-md shadow-lg shadow-[#A3E635]/20"
          >
            Shop now <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm uppercase font-semibold tracking-wider text-white border border-[#374151] hover:border-[#A3E635] hover:text-[#A3E635] active:scale-[0.98] transition-all rounded-md"
          >
            <Phone className="w-4 h-4" /> Order on WhatsApp
          </a>
        </div>
      </div>
    </FadeUp>
  );
};
