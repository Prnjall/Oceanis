"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const ParallaxHeroImages = ({ images }: { images: string[] }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position between -1 and 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Map the 6 images to specific positions around the screen
  const configs = [
    // Top row (inward)
    { top: "10%", left: "15%", width: "clamp(230px, 19vw, 330px)", depth: 25, delay: 0.1 },
    { top: "12%", right: "15%", width: "clamp(250px, 22vw, 350px)", depth: 35, delay: 0.2 },
    // Middle row (outward to clear center safe-zone)
    { top: "40%", left: "5%", width: "clamp(205px, 16vw, 305px)", depth: 40, delay: 0.3 },
    { top: "42%", right: "5%", width: "clamp(275px, 25vw, 410px)", depth: 20, delay: 0.4 },
    // Bottom row (inward)
    { bottom: "10%", left: "16%", width: "clamp(300px, 27vw, 430px)", depth: 30, delay: 0.5 },
    { bottom: "2%", right: "16%", width: "clamp(240px, 20vw, 340px)", depth: 35, delay: 0.6 },
  ];

  // Mobile specific configuration (vertical cluster, kept out of center text zone)
  const mobileConfigs = [
    // Top row
    { top: "2%", left: "3%", width: "clamp(100px, 28vw, 150px)", depth: 10, delay: 0.1 },
    { top: "5%", right: "3%", width: "clamp(110px, 30vw, 160px)", depth: 15, delay: 0.2 },
    // Middle row (bottom clustered)
    { bottom: "22%", left: "2%", width: "clamp(105px, 28vw, 145px)", depth: 20, delay: 0.3 },
    { bottom: "26%", right: "2%", width: "clamp(115px, 32vw, 155px)", depth: 8, delay: 0.4 },
    // Bottom row
    { bottom: "2%", left: "5%", width: "clamp(120px, 34vw, 165px)", depth: 15, delay: 0.5 },
    { bottom: "4%", right: "4%", width: "clamp(100px, 28vw, 140px)", depth: 20, delay: 0.6 },
  ];

  return (
    <>
      {/* DESKTOP WRAPPER (Locked completely to md and above) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
        {images.map((src, idx) => {
          const config = configs[idx % configs.length];
          return (
            <motion.div
              key={`desktop-${idx}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 0.9,
                scale: 1,
                x: mousePosition.x * config.depth,
                y: mousePosition.y * config.depth,
              }}
              transition={{
                opacity: { duration: 1.2, delay: config.delay },
                scale: { duration: 1.2, delay: config.delay },
                x: { type: "spring", stiffness: 40, damping: 30 },
                y: { type: "spring", stiffness: 40, damping: 30 },
              }}
              style={{
                position: "absolute",
                top: config.top,
                left: config.left,
                right: config.right,
                bottom: config.bottom,
                width: config.width,
              }}
              className="rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.8)] border border-white/20"
            >
              {/* Subtle gradient overlay to push images back visually */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
              <img src={src} alt="Hero Parallax Element" className="w-full h-auto object-cover opacity-100" />
            </motion.div>
          );
        })}
      </div>

      {/* MOBILE WRAPPER (Visible only under md breakpoint) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden block md:hidden">
        {images.map((src, idx) => {
          const config = mobileConfigs[idx % mobileConfigs.length];
          return (
            <motion.div
              key={`mobile-${idx}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 0.9,
                scale: 1,
                x: mousePosition.x * config.depth,
                y: mousePosition.y * config.depth,
              }}
              transition={{
                opacity: { duration: 1.2, delay: config.delay },
                scale: { duration: 1.2, delay: config.delay },
                x: { type: "spring", stiffness: 40, damping: 30 },
                y: { type: "spring", stiffness: 40, damping: 30 },
              }}
              style={{
                position: "absolute",
                top: config.top,
                left: config.left,
                right: config.right,
                bottom: config.bottom,
                width: config.width,
              }}
              className="rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.8)] border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
              <img src={src} alt="Hero Parallax Element" className="w-full h-auto object-cover opacity-100" />
            </motion.div>
          );
        })}
      </div>
    </>
  );
};
