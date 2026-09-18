"use client";

/**
 * OceanisInfiniteCards.tsx
 *
 * Aceternity InfiniteMovingCards mechanism adapted for OCEANIS.
 *
 * How the infinite loop works:
 *  - On mount, all children of scrollerRef are cloned and appended to the
 *    same list. This makes the list 2× as wide.
 *  - A CSS keyframe `scroll` translates the list by -50% (= original width).
 *    Because the duplicated items fill the second half, the reset is invisible.
 *  - Animation is controlled via a CSS custom property on containerRef.
 *  - Hover pause: `hover:[animation-play-state:paused]` via Tailwind class.
 */

import React, { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Data type
// ─────────────────────────────────────────────────────────────────────────────

export interface OceanisCardItem {
  id: string;
  year: number;
  title: string;
  location: string;
  date: string;
  quantity?: string;
  description: string;
  image?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface OceanisInfiniteCardsProps {
  items: OceanisCardItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}

export const OceanisInfiniteCards: React.FC<OceanisInfiniteCardsProps> = ({
  items,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    // Clone every original child and append — this creates the seamless duplicate
    const originalItems = Array.from(scrollerRef.current.children);
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      scrollerRef.current!.appendChild(clone);
    });

    // Direction
    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );

    // Speed → duration
    const durations = { fast: "30s", normal: "60s", slow: "90s" };
    containerRef.current.style.setProperty(
      "--animation-duration",
      durations[speed]
    );

    // Kick off the animation (avoids flash-of-motion on SSR)
    setStarted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    /* Outer: clips the moving track at the section edges.
       Mask is deliberately narrow (2% / 98%) so cards stay fully
       visible across the entire viewport width and only clip at the
       physical left/right boundary of the carousel container. */
    <div
      ref={containerRef}
      className="scroller relative overflow-hidden w-full"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
      }}
    >
      {/* Scrolling list */}
      <ul
        ref={scrollerRef}
        className={[
          "flex w-max min-w-full shrink-0 flex-nowrap gap-5 py-6",
          started ? "animate-scroll" : "",
          pauseOnHover ? "hover:[animation-play-state:paused]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {items.map((item) => (
          <OceanisCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Single OCEANIS card
// ─────────────────────────────────────────────────────────────────────────────

function OceanisCard({ item }: { item: OceanisCardItem }) {
  return (
    <li
      style={{
        width: "clamp(260px, 75vw, 420px)",
        minHeight: 400,
        flexShrink: 0,
        borderRadius: 14,
        overflow: "hidden",
        background: "#0c0c0c",
        /* Visible border so the card reads as a solid panel on the dark page */
        border: "1px solid rgba(255,255,255,0.13)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* ── Image / placeholder ─────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          height: 180,
          background: "#080808",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            draggable={false}
          />
        ) : (
          /* Placeholder with subtle oil-spill gradient */
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 30% 40%, rgba(0,80,160,0.22) 0%, transparent 65%), radial-gradient(ellipse at 70% 60%, rgba(0,40,80,0.18) 0%, transparent 60%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: 36, height: 36, opacity: 0.25 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* Bottom gradient blends image into card body */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(to top, #0c0c0c 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Year */}
        <p
          style={{
            fontFamily: "var(--font-mango, 'Bebas Neue', 'Impact', sans-serif)",
            fontSize: 38,
            lineHeight: 1,
            color: "#ffffff",
            letterSpacing: "0.02em",
            marginBottom: 8,
          }}
        >
          {item.year}
        </p>

        {/* Title */}
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#f5f5f5",
            lineHeight: 1.3,
            marginBottom: 10,
          }}
        >
          {item.title}
        </h3>

        {/* Location */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 12,
          }}
        >
          <svg style={{ width: 11, height: 11, color: "#4a9eff", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span
            style={{
              fontSize: 11,
              color: "#888899",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {item.location}
          </span>
        </div>

        {/* Quantity badge — only when known */}
        {item.quantity && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "rgba(74,158,255,0.08)",
              border: "1px solid rgba(74,158,255,0.18)",
              borderRadius: 4,
              padding: "2px 8px",
              marginBottom: 12,
              alignSelf: "flex-start",
            }}
          >
            <span style={{ fontSize: 11, color: "#4a9eff", fontFamily: "monospace", letterSpacing: "0.04em" }}>
              {item.quantity}
            </span>
          </div>
        )}

        {/* Description */}
        <p
          style={{
            fontSize: 13,
            color: "#888898",
            lineHeight: 1.65,
            marginTop: "auto",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </p>
      </div>
    </li>
  );
}
