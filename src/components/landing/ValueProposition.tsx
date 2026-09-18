import React from 'react';
import { motion } from 'framer-motion';
import { CircularCarousel } from '../ui/circular-carousel';

export const ValueProposition: React.FC = () => {
  const carouselItems = [
    {
      id: "detect-characterise",
      title: "DETECT & CHARACTERISE",
      tag: "SATELLITE AI",
      description: "Identify potential oil slicks from satellite imagery using AI-based segmentation, then characterise the detected slick region and account for possible low-wind look-alikes."
    },
    {
      id: "hindcast-origin",
      title: "HINDCAST ORIGIN",
      tag: "ORIGIN ANALYSIS",
      description: "Use ensemble drift modelling to work backward from the detected slick and estimate probable origin locations and origin-time uncertainty."
    },
    {
      id: "forecast-movement",
      title: "FORECAST MOVEMENT",
      tag: "DRIFT MODELLING",
      description: "Use ocean currents, wind conditions and drift modelling to estimate how the detected slick may move over time."
    },
    {
      id: "reconstruct-ais",
      title: "RECONSTRUCT AIS",
      tag: "AIS FORENSICS",
      description: "Reconstruct historical vessel activity around the probable origin window and identify possible dark-vessel gaps where AIS evidence is absent."
    },
    {
      id: "score-rank",
      title: "SCORE & RANK",
      tag: "EVIDENCE FUSION",
      description: "Combine satellite, drift, AIS and behavioural evidence to score candidate vessels and compare their consistency with the observed spill."
    },
    {
      id: "explain-decide",
      title: "EXPLAIN & DECIDE",
      tag: "INVESTIGATOR REVIEW",
      description: "Present the evidence chain and calibrated attribution result for investigator review, including INCONCLUSIVE when the evidence is insufficient."
    }
  ];

  return (
    <section className="w-full bg-transparent text-white py-16 lg:py-28" id="how-it-works">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* The Problem */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16 lg:mb-24 [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]"
        >
          <p className="text-[11px] uppercase tracking-widest font-mono text-accent-blue font-semibold mb-3">
            THE CHALLENGE
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mango tracking-tight leading-[1.1] text-white">
            Investigating oil spills across vast oceans
          </h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal pt-4">
            Oil spills can be extremely difficult to detect and investigate across large marine areas. While satellite observations can help identify potential slicks, determining exactly where the spill came from and which vessel may be associated with it requires connecting multiple complex sources of evidence.
          </p>
        </motion.div>

        {/* What OCEANIS Does */}
        <div className="border-t border-white/10 pt-12 lg:pt-16 pb-4 lg:pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-8 [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)] flex flex-col items-center mx-auto text-center"
          >
            <p className="text-[11px] uppercase tracking-widest font-mono text-accent-blue font-semibold mb-2">
              WHAT OCEANIS DOES
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mango tracking-tight leading-[1.1] text-white">
              From signal to evidence
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-normal pt-3 max-w-2xl">
              OCEANIS connects satellite observations, environmental conditions and vessel activity into a single investigation workflow.
            </p>
          </motion.div>
          
          <div className="w-full pb-12 overflow-hidden sm:overflow-visible relative z-10">
            <CircularCarousel items={carouselItems} />
          </div>
        </div>

      </div>
    </section>
  );
};
