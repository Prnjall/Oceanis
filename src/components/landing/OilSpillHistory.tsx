import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LeafletMap from '../ui/LeafletMap';
import { OceanisInfiniteCards } from '../ui/OceanisInfiniteCards';
import type { OceanisCardItem } from '../ui/OceanisInfiniteCards';


// ============================================================================
// Single source of truth for all incident data
// ============================================================================

export const oilSpillIncidents = [
  {
    year: 1993,
    lat: 19.5333,
    lng: 71.3000,
    label: "Bombay High",
    incident: "Bombay High Pipeline Rupture",
    location: "Bombay High, Arabian Sea",
    exactDate: "17 May 1993",
    quantity: 6000,
    quantityString: "6,000 tonnes",
    whatHappened: "A feeder/riser pipeline from Bombay High ruptured offshore. Contemporary reporting described approximately 6,000 tonnes of crude oil entering the sea and forming a slick roughly 0.5 km × 5 km, about 165 km northwest of Bombay. ONGC shut down the oilfield complex after the rupture.",
    impact: null,
    sourceNote: "National Institute of Oceanography (Goa) technical report.",
  },
  {
    year: 2005,
    lat: 19.76306,
    lng: 71.07806,
    label: "Mumbai High North",
    incident: "Mumbai High North Platform Fire",
    location: "Mumbai High, Arabian Sea",
    exactDate: "27 July 2005",
    quantity: null,
    quantityString: "Not precisely quantified",
    whatHappened: "The support vessel Samudra Suraksha collided with the Mumbai High North platform during a medical evacuation in rough seas. The collision ruptured a gas riser and caused a major fire that destroyed the platform complex. A confirmed oil spill resulted and a clean-up operation was undertaken.",
    impact: "A clean-up operation was conducted following the spill.",
    sourceNote: "FABIG industrial accident case file and Oil & Gas Journal reporting.",
  },
  {
    year: 2010,
    lat: 18.86439,
    lng: 72.82,
    label: "Mumbai",
    incident: "MSC Chitra Collision",
    location: "Off Mumbai, Arabian Sea",
    exactDate: "7 August 2010",
    quantity: 800,
    quantityString: "800 tonnes",
    whatHappened: "The two vessels collided near Mumbai Harbour. Oil leaked from MSC Chitra and subsequently spread toward parts of the Mumbai, Thane and Raigad coastline.",
    impact: "Investigations documented oil contamination along coastal areas, including effects on coastal sediments and mangrove habitats.",
    sourceNote: "Government environmental records list 800 tonnes. The MPCB/NIO investigation reported an initial estimate of 600–800 tonnes, while the later NEERI report estimated approximately 879 tonnes.",
  },
  {
    year: 2011,
    lat: 19.0786,
    lng: 72.428,
    label: "Mumbai–Uran",
    incident: "Mumbai-Uran Pipeline Spill",
    location: "Approx. offshore Mumbai / Bassein area",
    exactDate: "21 January 2011",
    quantity: 55,
    quantityString: "55 tonnes",
    whatHappened: "A leakage occurred in ONGC's Mumbai-Uran Trunk pipeline in the Mumbai High offshore area.",
    impact: "The oil slick was reported approximately 43 nautical miles offshore. The Government specifically stated that there was no oil spill in Mumbai's coastal area and no reported impact on marine life in the coastal area.",
    sourceNote: "Contemporary reports from Gulf News, Business Today, and Deccan Herald.",
  },
  {
    year: 2017,
    lat: 13.22817,
    lng: 80.36333,
    label: "Ennore, Chennai",
    incident: "Ennore Oil Spill",
    location: "Off Kamarajar Port, Chennai",
    exactDate: "28 January 2017",
    quantity: 194,
    quantityString: "194 tonnes",
    whatHappened: "BW Maple and Dawn Kanchipuram collided outside Kamarajar Port near Ennore. The Government stated that the rupture resulted in an engine-oil spill, not a spill of the petroleum cargo being carried by Dawn Kanchipuram.",
    impact: "The oil spread along the Chennai coast and contaminated coastal areas and beaches. Environmental studies documented petroleum contamination across a substantial stretch of coastline and impacts on coastal environments.",
    sourceNote: "Government of India reported figure. Other scientific studies have reported different estimates.",
  },
  {
    year: 2023,
    lat: 13.232,
    lng: 80.324,
    label: "Ennore Creek",
    incident: "Ennore Creek Oil Spill",
    location: "Ennore Creek, Chennai",
    exactDate: "December 2023, following Cyclone Michaung",
    quantity: null, // undetermined for the chart
    quantityString: "Estimates vary",
    whatHappened: "Cyclone Michaung caused severe flooding in Chennai and the Manali/Ennore industrial area. Floodwater carried oil from the CPCL/industrial area into the Buckingham Canal and toward Ennore Creek.",
    impact: "Oil contamination affected the Buckingham Canal, Kosasthalaiyar River and Ennore Creek areas. Reports documented oil deposits/slicks, impacts on local surroundings and concerns for biodiversity, coastal/mangrove ecosystems and livelihoods.",
    sourceNote: "Not conclusively established. Different assessments produced different estimates.",
  },
  {
    year: 2025,
    lat: 9.3125,
    lng: 76.1360,
    label: "Kerala",
    incident: "MSC ELSA 3",
    location: "Off Alappuzha, Kerala",
    exactDate: "25 May 2025",
    quantity: null,
    quantityString: "451.54 tonnes marine fuel in tanks; confirmed oil slick observed",
    whatHappened: "MSC ELSA 3, a container ship en route toward Kochi, developed a severe list and sank on 25 May 2025. Indian Coast Guard surveillance confirmed an oil slick at the sinking site and response operations were conducted.",
    impact: "Coastal alerts were issued for multiple Kerala districts, containers washed ashore, and the Kerala government declared the incident a state-specific disaster.",
    sourceNote: "Kerala State Disaster Management Authority — Ship Wreck – MSC ELSA 3",
  },
] as const;

// WorldMap incident points — standalone geographic locations (no arcs)
const mapIncidents = oilSpillIncidents.map((inc) => ({
  year: inc.year,
  lat: inc.lat,
  lng: inc.lng,
  label: inc.label,
}));

const incidentImages: Record<number, string> = {
  1993: "/incidents/bp-oil-spill.jpg",
  2005: "/incidents/images.jpg",
  2010: "/incidents/7782496154_dd0a9f5543_c.jpg",
  2011: "/incidents/oilspill_turtle_noaa1200x900.webp",
  2017: "/incidents/StockCake-Oil-covered Birds_1739987608 1.jpg",
  2023: "/incidents/Thailand-Rayong_Oil-spill-star-petroleum_Alamy_2MCBGM4-1.jpg",
  2025: "/incidents/Thailand_Oil_Spill05.webp"
};

// Convert to OceanisInfiniteCards format
const cardItems: OceanisCardItem[] = oilSpillIncidents.map((inc) => ({
  id: inc.year.toString(),
  year: inc.year,
  title: inc.incident,
  location: inc.location,
  date: inc.exactDate,
  quantity: (inc.quantityString && inc.quantityString !== 'Not precisely quantified' && inc.quantityString !== 'Estimates vary')
    ? inc.quantityString
    : undefined,
  description: inc.whatHappened,
  image: incidentImages[inc.year] || "",
}));

// ============================================================================
// Component
// ============================================================================

export const OilSpillHistory: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2017);


  return (
    <section
      className="relative w-full bg-black text-white py-24 lg:py-32 border-t border-border-hairline-dark overflow-hidden"
      id="oil-spill-history"
    >
      {/* ── Aceternity Grid Background ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)
          `,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 95%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">

        {/* ── Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-[11px] uppercase tracking-widest font-mono text-gray-500 font-semibold mb-4">
            INCIDENT ARCHIVE
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mango tracking-tight text-white mb-4">
            India's Oil-Spill History
          </h2>
          <p className="text-lg text-gray-300 font-medium">
            A visual record of selected documented oil-spill incidents across India's coastal and offshore regions.
          </p>
        </motion.div>

        {/* ── Map & Timeline Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
          
          {/* ── World Map ────────────────────────────────────────────── */}
          <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[70%] relative rounded-xl overflow-hidden border border-white/5 bg-black min-h-[450px]"
        >
          {/* Region label */}
          <div className="absolute top-4 left-6 z-10 pointer-events-none">
            <p className="text-[10px] uppercase font-mono tracking-widest text-gray-500">
              India / Arabian Sea / Bay of Bengal
            </p>
          </div>

          <LeafletMap
            activeYear={selectedYear}
            onYearClick={setSelectedYear}
            incidents={mapIncidents}
            lineColor="#ef4444"
          />
        </motion.div>

        {/* ── Timeline ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-[30%] flex flex-col"
        >
          <p className="text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-4">
            INCIDENT TIMELINE
          </p>

          {/* Year buttons — connected to the Leaflet map */}
          <div className="flex flex-row lg:flex-col flex-wrap lg:flex-nowrap gap-3">
            {oilSpillIncidents.map((inc) => (
              <button
                key={inc.year}
                onClick={() => setSelectedYear(inc.year)}
                className={`
                  px-5 py-2.5 text-sm font-mono tracking-widest transition-all duration-200
                  ${selectedYear === inc.year
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }
                `}
              >
                {inc.year}
              </button>
            ))}
          </div>
        </motion.div>
        
        </div> {/* ── End Map & Timeline Layout ── */}
      </div> {/* ── End of max-w-[1440px] container ── */}

      {/* ── Infinite Moving Cards ────────────────────────────── */}
      {/* 
        This is now OUTSIDE the 1440px constraint, meaning it will 
        span 100% of the viewport width.
      */}
      <div className="relative z-10 w-full mt-16 pt-16 border-t border-white/10">
        <OceanisInfiniteCards
          items={cardItems}
          direction="left"
          speed="slow"
          pauseOnHover={true}
        />
      </div>

    </section>
  );
};
