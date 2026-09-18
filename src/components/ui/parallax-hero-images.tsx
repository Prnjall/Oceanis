"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

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

const ParallaxImage = ({
  src,
  config,
  smoothX,
  smoothY,
}: {
  src: string;
  config: typeof configs[0];
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}) => {
  const x = useTransform(smoothX, (v) => v * config.depth);
  const y = useTransform(smoothY, (v) => v * config.depth);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 0.9, scale: 1 }}
      transition={{
        opacity: { duration: 1.2, delay: config.delay },
        scale: { duration: 1.2, delay: config.delay },
      }}
      style={{
        position: "absolute",
        top: config.top,
        left: config.left,
        right: config.right,
        bottom: config.bottom,
        width: config.width,
        x,
        y,
      }}
      className="rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.8)] border border-white/20"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
      <img
        src={src}
        alt="Hero Parallax Element"
        className="w-full h-auto object-cover opacity-100"
        loading="eager"
      />
    </motion.div>
  );
};

export const ParallaxHeroImages = ({ images }: { images: string[] }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 40, damping: 30 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only track mouse movement on desktop to save battery/performance on mobile
    if (window.innerWidth < 768) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* DESKTOP WRAPPER (Locked completely to md and above) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
        {images.map((src, idx) => {
          const config = configs[idx % configs.length];
          return (
            <ParallaxImage
              key={`desktop-${idx}`}
              src={src}
              config={config}
              smoothX={smoothX}
              smoothY={smoothY}
            />
          );
        })}
      </div>
    </>
  );
};
