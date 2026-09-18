import React from 'react';
import { motion } from 'framer-motion';

export const LaunchCta: React.FC = () => {
  return (
    <section className="w-full bg-[#07131D] text-white py-20 border-t border-gray-800" id="launch-console">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl space-y-3"
        >
          <p className="text-xs uppercase tracking-widest font-mono text-accent-blue font-semibold">Ready for operational deployment</p>
          <h2 className="text-3xl sm:text-4xl font-mango tracking-tight text-white">
            Access the OCEANIS Investigation Console
          </h2>
          <p className="text-base text-gray-300 leading-relaxed">
            Enter the prototype environment to trace probability regions, analyse AIS vessel activity, and evaluate counterfactual simulations for spill attribution.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full md:w-auto mt-6 md:mt-0"
        >
          <a className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors rounded-none w-full sm:w-auto text-center" href="#">
            Launch Investigation Console →
          </a>
          <a className="inline-flex items-center justify-center px-8 py-4 border border-gray-600 text-white text-xs uppercase tracking-widest font-bold hover:bg-white/10 transition-colors rounded-none w-full sm:w-auto text-center" href="#">
            Schedule Operational Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
};
