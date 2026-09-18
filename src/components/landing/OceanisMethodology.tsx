import { motion } from 'framer-motion';
import { TracingBeam } from '@/components/velora/tracing-beam';

// ============================================================================
// OCEANIS Methodology — six investigation pipeline stages
// ============================================================================

const stages = [
  {
    number: '01',
    title: 'Data Ingestion & Alignment',
    body: 'Data from Sentinel-1 SAR, Sentinel-2 EO, AIS, ERA5 wind and meteorological records, and Copernicus ocean-current products are ingested and aligned by time and geographic location, forming a consistent multi-source dataset for each investigation window.',
    tags: ['Sentinel-1 SAR', 'Sentinel-2 EO', 'ERA5', 'AIS', 'Copernicus'],
  },
  {
    number: '02',
    title: 'Detect & Characterise',
    body: 'SAR imagery is preprocessed — radiometric calibration, speckle reduction and georeferencing — and VV/VH polarisation information is used for analysis. A U-Net / SegFormer segmentation model then identifies and characterises candidate oil slick regions. Low-wind look-alike returns can reduce detection reliability; this uncertainty is carried forward rather than discarded.',
    tags: ['PyTorch', 'U-Net / SegFormer', 'OpenCV', 'Grad-CAM / SHAP'],
  },
  {
    number: '03',
    title: 'Hindcast Origin',
    body: 'Bidirectional drift modelling estimates where and when the spill most likely originated. OpenDrift / OpenOil drives the primary simulation; NOAA GNOME provides a cross-check. The result is a probabilistic origin field expressed as 50%, 80% and 95% confidence zones, not a single point.',
    tags: ['OpenDrift / OpenOil', 'NOAA GNOME', 'PostGIS', 'Shapely'],
  },
  {
    number: '04',
    title: 'Forecast Movement',
    body: 'Using the same environmental conditions and drift modelling framework, the system projects possible future slick movement. This forward simulation indicates where the detected oil may travel over the coming hours or days, informing response prioritisation.',
    tags: ['OpenDrift / OpenOil', 'ERA5', 'Copernicus currents'],
  },
  {
    number: '05',
    title: 'Reconstruct AIS & Attribute',
    body: 'Historical AIS tracks from MarineCadastre are reconstructed around the estimated origin window. Irrelevant vessel movements are filtered; AIS-absent "dark vessels" can be flagged for further investigation. Counterfactual analysis then compares each candidate discharge scenario against the observed slick. A lightweight Bayesian fusion layer combines satellite evidence, drift information and vessel-behaviour signals into a ranked evidence profile. OCEANIS supports an INCONCLUSIVE outcome — attribution is uncertainty-aware throughout.',
    tags: ['AIS reconstruction', 'Dark vessel flagging', 'Bayesian fusion', 'scikit-learn', 'Counterfactual analysis'],
  },
  {
    number: '06',
    title: 'Explain & Decide',
    body: 'The investigator console brings the map, evidence graph and ranked-candidate analysis together in a single view. Investigators confirm or override results via a human-in-the-loop workflow. OCEANIS generates an investigation report with a full audit trail — providing an auditable evidence chain rather than concealing uncertainty.',
    tags: ['Evidence graph', 'Human-in-the-loop', 'Audit trail', 'Investigation report'],
  },
];

export function OceanisMethodology() {
  return (
    <section className="relative w-full bg-black text-white py-24 lg:py-32 border-t border-border-hairline-dark overflow-hidden">
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

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* ── Section Header ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-20"
        >
          <p className="text-[11px] uppercase tracking-widest font-mono text-gray-500 font-semibold mb-4">
            OCEANIS METHODOLOGY
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mango tracking-tight text-white mb-6">
            From Signal to Evidence
          </h2>
          <p className="text-lg text-gray-300 font-medium leading-relaxed max-w-2xl">
            How OCEANIS combines satellite observations, environmental data, vessel activity and
            uncertainty-aware analysis into an investigation workflow.
          </p>
        </motion.div>

        {/* ── Tracing Beam Pipeline Spine ──────────────────────────── */}
        <TracingBeam>
          <div className="space-y-0">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.number}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="relative w-full md:pl-10 pb-16 last:pb-4"
              >
                {/*
                  Beacon Dot sits directly on the beam spine (left: 10px).
                  Vertically centered with the stage header (top: 14px, h-7 row).
                */}
                <div
                  className="absolute left-[10px] top-[14px] -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-4 h-4 pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 rounded-full bg-accent-blue/20 border border-accent-blue/50" />
                  <div className="relative w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(0,102,255,0.9)]" />
                </div>

                {/* Stage Header: ●  01   DATA INGESTION & ALIGNMENT */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-h-[28px] mb-3">
                  <span className="text-base sm:text-lg font-mono font-bold text-accent-blue tracking-wider select-none">
                    {stage.number}
                  </span>
                  <h3 className="text-base sm:text-lg font-mono font-bold text-white tracking-widest uppercase">
                    {stage.title}
                  </h3>
                </div>

                {/* Stage Body & Tags */}
                <div className="space-y-4 md:pl-0">
                  <p className="text-[15px] sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                    {stage.body}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {stage.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono uppercase tracking-wider text-gray-400 border border-white/10 px-2.5 py-1 rounded-sm bg-white/[0.03]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thin hairline between stages */}
                {i < stages.length - 1 && (
                  <div className="mt-14 border-t border-white/[0.04]" />
                )}
              </motion.div>
            ))}
          </div>
        </TracingBeam>

      </div>
    </section>
  );
}
