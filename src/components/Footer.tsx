import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUp, Instagram, Facebook } from 'lucide-react';
import { GYM_INFO } from '../data/gymData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Classes', href: '#classes' },
    { label: 'Trainers', href: '#trainers' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Registration', href: '#signup' },
  ];

  return (
    <footer id="location" className="bg-[#0B0F14] border-t border-[#1F2937] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <a
              href="#"
              className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-white font-display"
            >
              <span>IRONFORM</span>
              <span className="w-2 h-2 rounded-full bg-[#A3E635] inline-block" />
            </a>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Owerri’s premier conditioning and athletic performance gym. Engineered for serious athletes with Olympic platforms, high-intensity MetCon, and guaranteed uninterrupted power.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-[#111827] border border-[#1F2937] flex items-center justify-center text-slate-300 hover:text-[#A3E635] hover:border-[#A3E635] transition-colors"
                aria-label="IRONFORM Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-[#111827] border border-[#1F2937] flex items-center justify-center text-slate-300 hover:text-[#A3E635] hover:border-[#A3E635] transition-colors"
                aria-label="IRONFORM Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Facility Location & Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-white">
              Arena Location
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A3E635] shrink-0 mt-0.5" />
                <span>{GYM_INFO.address}, Owerri, Imo State</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#A3E635] shrink-0" />
                <a
                  href={`tel:${GYM_INFO.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {GYM_INFO.phoneFormatted}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#A3E635] shrink-0" />
                <a
                  href={`mailto:${GYM_INFO.email}`}
                  className="hover:text-white transition-colors"
                >
                  {GYM_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours & 24/7 Power */}
          <div className="space-y-4">
            <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-white">
              Operating Hours
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#A3E635] shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-300 font-medium">Monday – Friday</div>
                  <div className="text-slate-500">{GYM_INFO.hours.weekdays}</div>
                </div>
              </div>
              <div className="pl-6">
                <div className="text-slate-300 font-medium">Saturday</div>
                <div className="text-slate-500">{GYM_INFO.hours.saturdays}</div>
              </div>
              <div className="pl-6">
                <div className="text-slate-300 font-medium">Sunday</div>
                <div className="text-slate-500">{GYM_INFO.hours.sundays}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} IRONFORM Athletic Club Owerri. All rights reserved.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors text-slate-400 group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
};
