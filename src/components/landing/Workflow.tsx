import React from 'react';
import { motion } from 'framer-motion';

export const Workflow: React.FC = () => {
  const steps = [
    {
      title: "DETECT",
      desc: "Satellite imagery is analysed to identify and characterise a potential slick."
    },
    {
      title: "ORIGIN",
      desc: "Backward drift modelling estimates a probability region for where and when the spill may have started."
    },
    {
      title: "AIS",
      desc: "Vessel traffic is reconstructed around the estimated origin window."
    },
    {
      title: "VERIFY",
      desc: "Candidate vessels are compared using multiple evidence sources and counterfactual simulation."
    },
    {
      title: "FORECAST",
      desc: "Forward drift modelling estimates the possible future movement of the spill."
    }
  ];

  return (
    <section className="w-full bg-white py-24 lg:py-32 border-t border-gray-100" id="analysis">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-24"
        >
          <p className="text-[11px] uppercase tracking-widest font-mono text-accent-blue font-semibold mb-3">OCEANIS PIPELINE</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mango tracking-tight text-primary">
            How the investigation workflow works
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gray-200 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex flex-col"
              >
                <div className="w-24 h-24 bg-surface-canvas-light border border-gray-200 flex items-center justify-center text-accent-blue font-mango text-3xl mb-6 shadow-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase font-mono text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
