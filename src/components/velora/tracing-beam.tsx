"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

interface TracingBeamProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A gradient line that draws itself down the side of long-form content as you
 * read. Pairs well with blog posts and changelogs.
 */
export function TracingBeam({ children, className, style }: TracingBeamProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 10%", "end 85%"],
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Track height so the beam stays accurate as images and fonts settle.
    const observer = new ResizeObserver(() =>
      setHeight(element.getBoundingClientRect().height)
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const drawn = useSpring(useTransform(scrollYProgress, [0, 1], [0, height]), {
    stiffness: 480,
    damping: 90,
  });

  return (
    <div
      ref={ref}
      data-slot="tracing-beam"
      className={cn("relative w-full", className)}
      style={style}
    >
      <div
        aria-hidden
        className="absolute left-[10px] top-[14px] bottom-4 hidden w-[2px] -translate-x-1/2 bg-white/10 md:block"
      >
        <motion.div
          style={{ height: drawn }}
          className="w-[2px] bg-gradient-to-b from-[#0066FF] via-[#0099FF] to-[#00E5FF] shadow-[0_0_8px_rgba(0,102,255,0.7)]"
        />
      </div>
      {children}
    </div>
  );
}
