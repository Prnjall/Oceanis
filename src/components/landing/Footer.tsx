import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#07131D] py-16 text-white border-t border-white/10 text-sm">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-16 border-b border-gray-800">
          
          <div className="space-y-4">
            <div className="text-xl font-bold tracking-widest font-sans">OCEANIS</div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Ocean Intelligence & Spill Investigation System
            </p>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              AI/ML-Based Oil Spill Detection and Monitoring
            </p>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-[11px] gap-4">
          <div>© {new Date().getFullYear()} OCEANIS PROJECT. ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </footer>
  );
};
