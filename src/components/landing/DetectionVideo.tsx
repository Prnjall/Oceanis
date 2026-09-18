import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import spillVideo from '../../images/Oil spill video.mp4';

export const DetectionVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { margin: "200px" });

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (!isInView && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <section className="relative w-full bg-transparent text-white py-16 lg:py-24" id="detection-video">
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: Large Editorial Video (~62% width) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full relative bg-gray-950 overflow-hidden shadow-2xl border border-white/10"
          >
            <video 
              ref={videoRef}
              loop 
              muted 
              playsInline
              preload="metadata"
              className="w-full h-auto object-cover block"
            >
              <source src={spillVideo} type="video/mp4" />
            </video>
          </motion.div>

          {/* Right Column: Structured Information Panel (~38% width) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-6 [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]"
          >
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-mono text-emerald-400 font-semibold mb-3">
                SATELLITE OIL-SPILL DETECTION
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-mango font-bold tracking-tight text-white leading-[1.08] uppercase max-w-lg">
                Identifying Potential Oil Slicks From Satellite Observations
              </h2>
            </div>

            {/* Information Blocks */}
            <div className="space-y-5 pt-2">
              <div>
                <h3 className="text-xs font-mono font-bold tracking-[0.16em] uppercase text-white mb-2">
                  WHAT THIS SHOWS
                </h3>
                <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed font-normal">
                  Sentinel-1 SAR imagery provides the primary satellite view used to identify potential oil-slick patterns on the ocean surface.
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h3 className="text-xs font-mono font-bold tracking-[0.16em] uppercase text-white mb-2">
                  WHAT OCEANIS ANALYSES
                </h3>
                <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed font-normal">
                  The detection stage preprocesses SAR imagery through radiometric calibration, speckle reduction and georeferencing, with VV/VH information used for analysis. AI-based segmentation identifies and characterises candidate slick regions.
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h3 className="text-xs font-mono font-bold tracking-[0.16em] uppercase text-white mb-2">
                  WHAT TO NOTICE
                </h3>
                <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed font-normal">
                  The suspected slick appears as a surface anomaly against the surrounding ocean. OCEANIS also considers possible low-wind look-alikes because not every dark SAR feature is necessarily oil.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
