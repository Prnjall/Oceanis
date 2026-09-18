import React from 'react';
import { motion } from 'framer-motion';
import { ParallaxHeroImages } from "@/components/ui/parallax-hero-images";

const images = [
  "/hero/360_F_610553429_BENOXFh6Sf686q5tFNOl5oYpFwULLCTy.jpg",
  "/hero/Gemini_Generated_Image_od00k4od00k4od00.png",
  "/hero/Grande_America_oil_spill_imaged_pillars.jpg",
  "/hero/oilspill_06_slide-eabd95204cc8edd577b7febe292ba1e64645598e.jpg",
  "/hero/sentinel-2.jpg",
  "/hero/winds_merra_1988.jpg"
];

export const Hero: React.FC = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden" id="overview">
      <ParallaxHeroImages images={images} />

      {/* Main Hero Text Content — CENTERED */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center space-y-5"
        >
          {/* Eyebrow */}
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-accent-blue font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            AI/ML-BASED OIL SPILL DETECTION
          </p>

          {/* Project Title & System Descriptor */}
          <div className="space-y-2">
            <h1 className="text-6xl sm:text-8xl lg:text-[7.5rem] font-mango font-bold tracking-tight text-white leading-[0.95] uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              OCEANIS
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-[0.22em] text-gray-300 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Ocean Intelligence & Spill Investigation System
            </p>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg font-normal text-gray-200 leading-relaxed tracking-tight pt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-2xl">
            Detect potential oil spills from satellite observations, analyse their movement, and connect the evidence with environmental and vessel data.
          </p>

          {/* Pipeline Capabilities Tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-[11px] font-mono text-gray-300">
            <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-sm drop-shadow-md">Sentinel-1 SAR</span>
            <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-sm drop-shadow-md">Drift Hindcasting</span>
            <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-sm drop-shadow-md">AIS Attribution</span>
          </div>

          {/* Action CTAs */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-colors rounded-none w-full sm:w-auto shadow-xl" 
              href="#launch-console"
            >
              LAUNCH INVESTIGATION
            </a>
            <a 
              className="inline-flex items-center justify-center px-8 py-4 border border-white/40 text-white text-xs uppercase tracking-widest font-semibold hover:bg-white/15 bg-black/30 backdrop-blur-md transition-colors rounded-none w-full sm:w-auto shadow-xl" 
              href="#how-it-works"
            >
              HOW IT WORKS ↓
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
