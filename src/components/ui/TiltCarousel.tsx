/**
 * TiltCarousel.tsx
 *
 * Movement engine: CSS @keyframes on the track (proven, guaranteed to run).
 *   - Track = Group A + Group B (width: max-content).
 *   - Animation moves the track by -50% (= -groupWidth) over one cycle.
 *   - Group B is visually identical to Group A, so the loop is seamless.
 *   - animation-play-state is toggled for hover-pause without resetting.
 *
 * 3-D tilt: requestAnimationFrame reads each card's live screen X and sets
 *   rotateY / scale / opacity imperatively — separate from the movement.
 *
 * No Framer Motion. No React state for the offset. No manual requestAnimationFrame
 * loop for movement. CSS handles movement; RAF handles tilt only.
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CarouselIncident {
  id: string;
  year: number;
  title: string;
  location: string;
  date: string;
  quantity?: string;
  impact: string;
  image?: string;
  source?: string;
}

interface TiltCarouselProps {
  incidents: CarouselIncident[];
  /** Pixels per second. Default: 28 */
  speed?: number;
  pauseOnHover?: boolean;
  onIncidentSelect?: (id: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Card visual (no animation inside — movement and tilt are applied externally)
// ─────────────────────────────────────────────────────────────────────────────

function CardVisual({
  incident,
  cardW,
  cardH,
  cardGap,
  onClick,
  tabIndex = 0,
}: {
  incident: CarouselIncident;
  cardW: number;
  cardH: number;
  cardGap: number;
  onClick: () => void;
  tabIndex?: number;
}) {
  return (
    <div
      data-carousel-card
      onClick={onClick}
      tabIndex={tabIndex}
      style={{
        flexShrink: 0,
        width: cardW,
        height: cardH,
        marginRight: cardGap,
        cursor: "pointer",
        borderRadius: 16,
        overflow: "hidden",
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
        display: "flex",
        flexDirection: "column",
        // GPU hint; tilt will be applied imperatively by RAF
        willChange: "transform, opacity",
        transformOrigin: "center center",
      }}
    >
      {/* Image area */}
      <div
        style={{
          position: "relative",
          height: "45%",
          background: "#0a0a0a",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {incident.image ? (
          <img
            src={incident.image}
            alt={incident.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(160deg, rgba(20,60,100,0.18) 0%, transparent 70%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                style={{ width: 18, height: 18, color: "#555" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #111111 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontFamily:
              "var(--font-mango, 'Bebas Neue', 'Impact', sans-serif)",
            fontSize: 36,
            lineHeight: 1,
            color: "#4a9eff",
            marginBottom: 6,
            letterSpacing: "0.01em",
          }}
        >
          {incident.year}
        </p>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#f0f0f0",
            marginBottom: 8,
            lineHeight: 1.3,
          }}
        >
          {incident.title}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 10,
            color: "#666",
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}
        >
          <svg
            style={{ width: 10, height: 10, flexShrink: 0 }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {incident.location}
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#4a4a4a",
            lineHeight: 1.55,
            marginTop: "auto",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {incident.impact}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inject global keyframe once
// ─────────────────────────────────────────────────────────────────────────────

const KEYFRAME_ID = "__oceanis_carousel_kf";

function injectKeyframe() {
  if (document.getElementById(KEYFRAME_ID)) return;
  const style = document.createElement("style");
  style.id = KEYFRAME_ID;
  style.textContent = `
    @keyframes __carousel_scroll {
      0%   { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-50%, 0, 0); }
    }
  `;
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────────────────────
// TiltCarousel
// ─────────────────────────────────────────────────────────────────────────────

export const TiltCarousel: React.FC<TiltCarouselProps> = ({
  incidents,
  speed = 28,
  pauseOnHover = true,
  onIncidentSelect,
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // animation-play-state driven by hover
  const [paused, setPaused] = useState(false);

  // The CSS animation duration is derived from the measured group width.
  // Group A fills the left half of the track; Group B fills the right half.
  // The animation translates -50% (= one group width), looping seamlessly.
  const [groupWidth, setGroupWidth] = useState(0);
  const groupARef = useRef<HTMLDivElement>(null);

  // Responsive card dimensions
  const [containerWidth, setContainerWidth] = useState(1200);

  // ── Sizing ────────────────────────────────────────────────────────────────
  useEffect(() => {
    injectKeyframe();

    const outer = outerRef.current;
    if (!outer) return;

    const updateSize = () => {
      setContainerWidth(outer.getBoundingClientRect().width);
    };
    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(outer);
    return () => ro.disconnect();
  }, []);

  // ── Measure group width after cards render ─────────────────────────────────
  useEffect(() => {
    const gA = groupARef.current;
    if (!gA) return;

    // One paint frame to ensure layout is settled
    const id = requestAnimationFrame(() => {
      setGroupWidth(gA.getBoundingClientRect().width);
    });
    return () => cancelAnimationFrame(id);
  }, [containerWidth, incidents]); // re-measure when card sizes change

  const cardW = containerWidth < 640 ? 240 : containerWidth < 1024 ? 285 : 318;
  const cardH = containerWidth < 640 ? 330 : containerWidth < 1024 ? 390 : 450;
  const cardGap = containerWidth < 640 ? 14 : containerWidth < 1024 ? 18 : 22;

  // Duration (seconds) for one full loop = groupWidth / speed
  const duration = groupWidth > 0 ? groupWidth / speed : 0;

  // ── 3D tilt via RAF ───────────────────────────────────────────────────────
  const rafRef = useRef(0);

  const applyTilt = useCallback(() => {
    rafRef.current = requestAnimationFrame(applyTilt);

    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const outerRect = outer.getBoundingClientRect();
    const containerCx = outerRect.left + outerRect.width / 2;
    const halfW = outerRect.width * 0.52;

    const cards = track.querySelectorAll<HTMLElement>("[data-carousel-card]");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      // Skip cards fully outside the viewport (no point applying tilt to clipped cards)
      if (rect.right < outerRect.left - 100 || rect.left > outerRect.right + 100) {
        return;
      }
      const cardCx = rect.left + rect.width / 2;
      const dist = cardCx - containerCx;
      const norm = Math.max(-1, Math.min(1, dist / halfW));

      const rotateY = norm * -28;
      const scaleVal = 1 - Math.abs(norm) * 0.13;
      const opacityVal = Math.max(0.12, 1 - Math.abs(norm) * 0.55);

      card.style.transform = `perspective(1100px) rotateY(${rotateY}deg) scale(${scaleVal})`;
      card.style.opacity = String(opacityVal);
    });
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(applyTilt);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyTilt]);

  // ── prefers-reduced-motion ────────────────────────────────────────────────
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  const animStyle: React.CSSProperties =
    !reducedMotion && duration > 0
      ? {
          animation: `__carousel_scroll ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }
      : {};

  return (
    <div
      ref={outerRef}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative",
        width: "100%",
        height: cardH + 40,
        overflow: "hidden",
        background: "#030910",
      }}
    >
      {/*
        Track: width=max-content ensures it is EXACTLY as wide as both groups.
        The CSS animation translates it by -50% (= -groupWidth) for a seamless loop.
      */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          // max-content is critical — without this, the track collapses to
          // the parent width and the animation has nothing to reveal.
          width: "max-content",
          willChange: "transform",
          ...animStyle,
        }}
      >
        {/* ── Group A (primary, interactive) ───────────────────────────── */}
        <div
          ref={groupARef}
          style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          {incidents.map((inc) => (
            <CardVisual
              key={`a-${inc.id}`}
              incident={inc}
              cardW={cardW}
              cardH={cardH}
              cardGap={cardGap}
              onClick={() => onIncidentSelect?.(inc.id)}
            />
          ))}
        </div>

        {/* ── Group B (seamless duplicate, aria-hidden) ─────────────────── */}
        <div
          aria-hidden
          style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          {incidents.map((inc) => (
            <CardVisual
              key={`b-${inc.id}`}
              incident={inc}
              cardW={cardW}
              cardH={cardH}
              cardGap={cardGap}
              onClick={() => {}}
              tabIndex={-1}
            />
          ))}
        </div>
      </div>

      {/* Left edge fade */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "clamp(60px, 10vw, 160px)",
          background:
            "linear-gradient(to right, #030910 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
      {/* Right edge fade */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "clamp(60px, 10vw, 160px)",
          background:
            "linear-gradient(to left, #030910 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </div>
  );
};
