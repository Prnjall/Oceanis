import React from 'react';
import { motion } from 'framer-motion';
import highlightVideo from '../../images/Oil-Spill-highlight-bw.mp4';
import highlightPoster from '../../images/Oil-spill-monitoring_01_comparison-slider-bw.webp';

export const SarAnalysis: React.FC = () => {
  return (
    <section className="relative w-full bg-transparent text-white py-16 lg:py-24" id="satellite-data">
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: Structured Information Panel (~38% width) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-6 [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]"
          >
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-mono text-accent-blue font-semibold mb-3">
                SATELLITE OBSERVATION & AI DETECTION
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-mango font-bold tracking-tight text-white leading-[1.08] uppercase max-w-lg">
                From Surface Anomaly To Candidate Slick
              </h2>
            </div>

            {/* Information Blocks */}
            <div className="space-y-5 pt-2">
              <div>
                <h3 className="text-xs font-mono font-bold tracking-[0.16em] uppercase text-white mb-2">
                  WHAT THIS SHOWS
                </h3>
                <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed font-normal">
                  The video demonstrates the visual interpretation of a satellite-observed surface anomaly and the identification of a suspected oil-slick region.
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h3 className="text-xs font-mono font-bold tracking-[0.16em] uppercase text-white mb-2">
                  DETECTION & CHARACTERISATION
                </h3>
                <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed font-normal">
                  OCEANIS uses segmentation to identify and characterise candidate slick regions after SAR preprocessing.
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h3 className="text-xs font-mono font-bold tracking-[0.16em] uppercase text-white mb-2">
                  UNCERTAINTY MATTERS
                </h3>
                <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed font-normal">
                  Low-wind conditions can create look-alike features in SAR imagery. OCEANIS therefore treats detection as a confidence-aware analysis rather than assuming every surface anomaly is oil.
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h3 className="text-xs font-mono font-bold tracking-[0.16em] uppercase text-white mb-2">
                  WHAT HAPPENS NEXT
                </h3>
                <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed font-normal">
                  A detected slick becomes an input to the subsequent origin, drift, AIS reconstruction and attribution stages of the investigation workflow.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Large Editorial Video (~62% width) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full relative bg-gray-950 overflow-hidden shadow-2xl border border-white/10"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              poster={highlightPoster}
              className="w-full h-auto object-cover block"
            >
              <source src={highlightVideo} type="video/mp4" />
              <img 
                src={highlightPoster} 
                alt="SAR imagery comparison showing oil spill highlight" 
                className="w-full h-auto object-cover block" 
              />
            </video>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
