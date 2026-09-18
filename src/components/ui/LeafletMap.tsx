import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// Types
// ============================================================================

export interface MapIncident {
  year: number;
  lat: number;
  lng: number;
  label: string;
  incident?: string;
  location?: string;
}

interface MapProps {
  activeYear: number;
  onYearClick: (year: number) => void;
  incidents: MapIncident[];
  lineColor?: string;
}

// ============================================================================
// Custom Icons
// ============================================================================

// We construct dynamic HTML strings for the L.divIcon so we can style them 
// exactly like the previous OCEANIS markers.
const createMarkerIcon = (isActive: boolean, isHovered: boolean, color: string) => {
  const dotR = isActive ? 10 : isHovered ? 8 : 5;
  const pulseR = isActive ? 24 : isHovered ? 18 : 12;
  const opacity = isActive ? 1 : 0.75;
  
  // Outer active ring
  const activeRing = isActive 
    ? `<div style="position:absolute; top:50%; left:50%; width:${dotR*2+8}px; height:${dotR*2+8}px; border:1px solid ${color}; border-radius:50%; transform:translate(-50%, -50%); opacity:0.6; pointer-events:none;"></div>`
    : '';

  // Pulse ring (CSS animation applied via class or inline style)
  const pulseStyle = `
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${pulseR*2}px;
    height: ${pulseR*2}px;
    background: ${color};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.2;
    pointer-events: none;
    ${isActive ? 'animation: pulse-ring 2s infinite ease-out;' : ''}
  `;

  const html = `
    <div style="position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
      <div style="${pulseStyle}"></div>
      <div style="position:absolute; width:${dotR*2}px; height:${dotR*2}px; background:${color}; border-radius:50%; opacity:${opacity}; transition:all 0.2s ease-out; box-shadow: 0 0 10px ${color}80;"></div>
      ${activeRing}
    </div>
    <style>
      @keyframes pulse-ring {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.5; }
        100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
      }
    </style>
  `;

  return L.divIcon({
    html,
    className: '', // Remove default leaflet styles
    iconSize: [40, 40],
    iconAnchor: [20, 20], // Center exactly over coordinate
  });
};

// ============================================================================
// Internal Map Controller
// Handles fitBounds, smooth panning, and tooltip screen-coordinate mapping
// ============================================================================

const MapEngine: React.FC<{
  incidents: MapIncident[];
  activeYear: number;
  onYearClick: (year: number) => void;
  hoveredYear: number | null;
  setHoveredYear: (year: number | null) => void;
  lineColor: string;
}> = ({ incidents, activeYear, onYearClick, hoveredYear, setHoveredYear, lineColor }) => {
  const map = useMap();
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // 1. Initial fitBounds
  useEffect(() => {
    if (incidents.length > 0) {
      const bounds = L.latLngBounds(incidents.map(inc => [inc.lat, inc.lng]));
      // Add padding so markers aren't cramped against the edges
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [map, incidents]);

  // 2. Pan to active marker if selected from timeline
  useEffect(() => {
    const activeInc = incidents.find(i => i.year === activeYear);
    if (activeInc) {
      const target = L.latLng(activeInc.lat, activeInc.lng);
      // Only pan if it's currently outside the view bounds
      if (!map.getBounds().contains(target)) {
        map.panTo(target, { animate: true, duration: 1 });
      }
    }
  }, [activeYear, map, incidents]);

  // 3. Update tooltip position continuously as map moves/zooms
  const updateTooltipPosition = () => {
    if (hoveredYear) {
      const hoveredInc = incidents.find(i => i.year === hoveredYear);
      if (hoveredInc) {
        const point = map.latLngToContainerPoint([hoveredInc.lat, hoveredInc.lng]);
        setTooltipPos({ x: point.x, y: point.y });
      }
    } else {
      setTooltipPos(null);
    }
  };

  useEffect(() => {
    updateTooltipPosition();
  }, [hoveredYear, map]);

  useMapEvents({
    zoom: updateTooltipPosition,
    move: updateTooltipPosition,
  });

  return (
    <>
      {/* Render Leaflet Markers */}
      {incidents.map((inc) => (
        <Marker
          key={inc.year}
          position={[inc.lat, inc.lng]}
          icon={createMarkerIcon(inc.year === activeYear, inc.year === hoveredYear, lineColor)}
          eventHandlers={{
            click: () => onYearClick(inc.year),
            mouseover: () => setHoveredYear(inc.year),
            mouseout: () => setHoveredYear(null),
          }}
          zIndexOffset={inc.year === activeYear ? 1000 : inc.year === hoveredYear ? 500 : 0}
        />
      ))}

      {/* HTML Tooltip Overlay — Strictly configured for NO FLICKERING and BOUNDARY SAFE */}
      {/* We mount it via a portal or just absolutely positioned over the map container */}
      <AnimatePresence>
        {hoveredYear !== null && tooltipPos !== null && (
          (() => {
            const inc = incidents.find(i => i.year === hoveredYear)!;
            
            // Boundary clamping based on map container dimensions
            const mapEl = map.getContainer();
            const mapWidth = mapEl.clientWidth;
            
            const leftPct = (tooltipPos.x / mapWidth) * 100;
            
            let xOffset = "-50%";
            if (leftPct < 15) xOffset = "-10%";
            if (leftPct > 85) xOffset = "-90%";

            return (
              <motion.div
                initial={{ opacity: 0, y: 8, x: xOffset, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, x: xOffset, scale: 1 }}
                exit={{ opacity: 0, y: 5, x: xOffset, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute z-[9999] pointer-events-none" // 9999 to sit above Leaflet controls
                style={{
                  left: `${tooltipPos.x}px`,
                  top: `${tooltipPos.y - 25}px`, // Offset above the dot
                }}
              >
                <div
                  className="flex flex-col"
                  style={{
                    background: "rgba(10,17,24,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "6px",
                    padding: "12px 14px",
                    minWidth: "170px",
                    maxWidth: "230px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                    transform: "translateY(-100%)",
                  }}
                >
                  <span
                    style={{
                      color: lineColor,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: "12px",
                      letterSpacing: "0.05em",
                      marginBottom: "4px"
                    }}
                  >
                    {inc.year}
                  </span>
                  <span
                    style={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "13px",
                      lineHeight: 1.3,
                      marginBottom: "6px"
                    }}
                  >
                    {inc.incident || inc.label}
                  </span>
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "11px",
                      lineHeight: 1.2,
                    }}
                  >
                    {inc.location}
                  </span>
                </div>
              </motion.div>
            );
          })()
        )}
      </AnimatePresence>
    </>
  );
};


// ============================================================================
// Tile Provider Configuration
// ============================================================================
// Tile URLs and attribution are isolated here for easy replacement if moving
// to a dedicated production tile server in the future.
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// ============================================================================
// Main Component
// ============================================================================

export default function LeafletMap({
  activeYear,
  onYearClick,
  incidents,
  lineColor = "#ef4444",
}: MapProps) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  // We set a placeholder center, the fitBounds inside MapEngine will instantly override it.
  const defaultCenter: [number, number] = [20.5937, 78.9629]; 

  return (
    <div className="w-full relative h-[500px] lg:h-[650px]">
      {/* We need to inject some Leaflet CSS overrides globally or inline to hide the white background if it flashes */}
      <style>{`
        .leaflet-container {
          background: #000000 !important; 
          font-family: inherit;
        }
        /* Dark mode filter for OSM tiles to match OCEANIS aesthetic */
        .leaflet-tile-pane {
          filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(90%) grayscale(20%);
        }
        .leaflet-control-zoom a {
          background-color: rgba(10, 17, 24, 0.9) !important;
          color: white !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: rgba(30, 111, 255, 0.8) !important;
        }
        .leaflet-bar {
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
      `}</style>
      
      <MapContainer
        center={defaultCenter}
        zoom={5}
        minZoom={2}
        maxZoom={12}
        zoomControl={true}
        scrollWheelZoom={true} // Enable scroll-wheel zoom when cursor is over the map
        style={{ height: '100%', width: '100%', zIndex: 10 }} // z-index 10 is low enough so navbar stays above
      >
        <TileLayer
          attribution={TILE_ATTRIBUTION}
          url={TILE_URL}
        />
        <MapEngine
          incidents={incidents}
          activeYear={activeYear}
          onYearClick={onYearClick}
          hoveredYear={hoveredYear}
          setHoveredYear={setHoveredYear}
          lineColor={lineColor}
        />
      </MapContainer>
    </div>
  );
}
