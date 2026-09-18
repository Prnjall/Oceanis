"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
}

export interface CircularCarouselProps {
  items: CarouselItem[];
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

// ─── 6-item circular positioning ─────────────────────────────────────────────
//
// With 6 items we use 6 orbital slots arranged symmetrically:
//
//   slot -2      slot -1      slot 0       slot +1      slot +2      slot +3(back)
// (outer left) (inner left)  (ACTIVE)   (inner right) (outer right) (hidden behind)
//
// The "back" card (slot +3) sits directly behind the active card
// at scale 0.5 and opacity 0.0 — effectively hidden.
// During transition, cards move smoothly through these slots around the 3D arc.

function getSlot(itemIndex: number, activeIndex: number, total: number): number {
  const raw = ((itemIndex - activeIndex) % total + total) % total;
  // raw: 0=active, 1=inner right, 2=outer right, 3=back, 4=outer left, 5=inner left
  if (raw === 0) return 0;
  if (raw === 1) return 1;
  if (raw === 2) return 2;
  if (raw === 3) return 3;
  if (raw === 4) return -2;
  if (raw === 5) return -1;
  return 3;
}

// Slot geometry — angles from vertical axis, positive = clockwise (right)
interface SlotStyle {
  angleDeg: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

const SLOT_STYLES: Record<number, SlotStyle> = {
  [-2]: { angleDeg: -60, scale: 0.70, opacity: 0.35, zIndex: 2 },    // outer left
  [-1]: { angleDeg: -30, scale: 0.85, opacity: 0.85, zIndex: 6 },    // inner left
  [0]:  { angleDeg: 0,   scale: 1.0,  opacity: 1.0,  zIndex: 10 },   // active (top center)
  [1]:  { angleDeg: 30,  scale: 0.85, opacity: 0.85, zIndex: 6 },    // inner right
  [2]:  { angleDeg: 60,  scale: 0.70, opacity: 0.35, zIndex: 2 },    // outer right
  [3]:  { angleDeg: 0,   scale: 0.50, opacity: 0.0,  zIndex: 1 },    // back (hidden behind active)
};

function computePosition(slot: number, rX: number, rY: number, isMobile?: boolean, cardW?: number) {
  const style = SLOT_STYLES[slot] ?? SLOT_STYLES[3];
  
  if (isMobile && cardW) {
    // Horizontal arrangement on mobile: no overlapping, active card in center
    // Inactive cards sit to the left/right
    let x = 0;
    let opacity = 0;
    let scale = 0.9;
    let zIndex = 1;

    const offset = cardW + 24;

    if (slot === 0) { 
      x = 0; opacity = 1; scale = 1; zIndex = 10; 
    }
    else if (slot === -1) { 
      x = -offset; opacity = 0.5; scale = 0.95; zIndex = 5; 
    }
    else if (slot === 1) { 
      x = offset; opacity = 0.5; scale = 0.95; zIndex = 5; 
    }
    else if (slot === -2) { 
      x = -(offset * 2); opacity = 0; scale = 0.9; zIndex = 1;
    }
    else if (slot === 2) { 
      x = (offset * 2); opacity = 0; scale = 0.9; zIndex = 1;
    }

    return { x, y: 0, scale, opacity, zIndex };
  }

  const rad = (style.angleDeg * Math.PI) / 180;
  return {
    x: Math.sin(rad) * rX,
    y: -(1 - Math.cos(rad)) * rY, // curve UPWARDS for depth effect
    scale: style.scale,
    opacity: style.opacity,
    zIndex: style.zIndex,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CircularCarousel({
  items,
  activeIndex: controlledIndex,
  onActiveChange,
  autoPlay = true,
  autoPlayInterval = 4000,
  className,
}: CircularCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ── Responsive dimensions ──────────────────────────────────────────────────
  const [dims, setDims] = useState({
    rX: 620, rY: 100, cardW: 360, cardH: 220, trackH: 420, isMobile: false
  });

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      if (vw < 768) {
        // Mobile horizontal layout
        setDims({ rX: 0, rY: 0, cardW: Math.min(vw - 48, 340), cardH: 260, trackH: 280, isMobile: true });
      } else if (vw < 1024) {
        setDims({ rX: 320, rY: 60, cardW: 260, cardH: 165, trackH: 280, isMobile: false });
      } else if (vw < 1440) {
        setDims({ rX: 460, rY: 80, cardW: 300, cardH: 195, trackH: 360, isMobile: false });
      } else {
        setDims({ rX: 620, rY: 100, cardW: 360, cardH: 220, trackH: 420, isMobile: false });
      }
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  const activeIndex = controlledIndex ?? internalIndex;
  const total = items.length;

  const goTo = useCallback(
    (idx: number) => {
      const next = ((idx % total) + total) % total;
      if (controlledIndex === undefined) setInternalIndex(next);
      onActiveChange?.(next);
    },
    [total, controlledIndex, onActiveChange]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // ── Autoplay ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay || isHovered || isFocused) return;
    intervalRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, isHovered, isFocused, next]);

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const el = containerRef.current;
    el?.addEventListener("keydown", handler);
    return () => el?.removeEventListener("keydown", handler);
  }, [next, prev]);

  if (total === 0) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Circular carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "relative flex flex-col items-center w-full outline-none select-none",
        className
      )}
    >
      {/* ── Card arc track ────────────────────────────────────────────────── */}
      <div
        className="relative w-full mx-auto"
        style={{ height: dims.trackH, maxWidth: dims.rX * 2 + dims.cardW + 40 }}
      >
        {items.map((item, i) => {
          const currentSlot = getSlot(i, activeIndex, total);
          const pos = computePosition(currentSlot, dims.rX, dims.rY, dims.isMobile, dims.cardW);
          const isActive = currentSlot === 0;

          return (
            <motion.button
              key={item.id}
              animate={{
                x: pos.x,
                y: pos.y,
                scale: pos.scale,
                opacity: pos.opacity,
                zIndex: pos.zIndex,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              onClick={() => goTo(i)}
              aria-label={item.title}
              aria-selected={isActive}
              role="option"
              className={cn(
                "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2",
                "cursor-pointer flex-col items-start justify-between text-left",
                "rounded-2xl p-6",
                isActive
                  ? "bg-[#070D14] border-2 border-[#1E6FFF] shadow-[0_0_40px_-8px_rgba(30,111,255,0.5)]"
                  : "bg-[#060B10]/90 border border-white/[0.08] shadow-xl"
              )}
              style={{
                width: isActive ? dims.cardW + 20 : dims.cardW,
                height: isActive ? dims.cardH + 12 : dims.cardH,
                transformOrigin: "center center",
                pointerEvents: currentSlot === 3 ? "none" : "auto",
              }}
            >
              {/* Tag */}
              {item.tag && (
                <span
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest shrink-0",
                    isActive
                      ? "bg-[#1E6FFF]/20 text-[#5B9FFF]"
                      : "bg-white/10 text-white/40"
                  )}
                >
                  {item.tag}
                </span>
              )}

              {/* Content */}
              <div className="w-full mt-auto">
                <h3
                  className={cn(
                    "font-bold leading-tight tracking-wide",
                    isActive ? "text-white text-[22px]" : "text-white/65 text-[17px]"
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "mt-2.5 line-clamp-3 leading-relaxed",
                    isActive ? "text-gray-300 text-[15px]" : "text-white/30 text-[13px]"
                  )}
                >
                  {item.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Center index — strictly below the card arc ────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.28 }}
          className="flex flex-col items-center pointer-events-none mt-4 z-20"
        >
          <span className="text-[72px] font-bold leading-none tracking-tight text-white">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="mt-1.5 text-[14px] font-mono tracking-[0.2em] uppercase text-white/35">
            of {String(total).padStart(2, "0")}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* ── Controls ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-5 mt-5 z-20">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={prev}
          aria-label="Previous item"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 transition-colors hover:bg-[#1E6FFF]/20 hover:text-white hover:border-[#1E6FFF]/50 focus-visible:ring-2 focus-visible:ring-[#1E6FFF]/50"
        >
          <ChevronLeft className="size-4" />
        </motion.button>

        <div className="flex items-center gap-2" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => goTo(i)}
              aria-label={`Go to item ${i + 1}`}
              className={cn(
                "h-[6px] rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-7 bg-[#1E6FFF]"
                  : "w-[6px] bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={next}
          aria-label="Next item"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 transition-colors hover:bg-[#1E6FFF]/20 hover:text-white hover:border-[#1E6FFF]/50 focus-visible:ring-2 focus-visible:ring-[#1E6FFF]/50"
        >
          <ChevronRight className="size-4" />
        </motion.button>
      </div>
    </div>
  );
}
