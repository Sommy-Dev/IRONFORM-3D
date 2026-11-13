import React from 'react';

export const StoreFooter: React.FC = () => {
  return (
    <footer className="border-t border-[#1F2937] bg-[#0B0F14] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#A3E635] rounded-sm" />
            <span className="font-bold font-display text-lg text-white tracking-tight">
              IRONFORM<span className="text-[#A3E635]"> Gear</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Premium gym equipment. Built to last.
          </p>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} IRONFORM Gear. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
