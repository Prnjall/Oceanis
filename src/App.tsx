import { Header } from './components/landing/Header';
import { Hero } from './components/landing/Hero';
import { ValueProposition } from './components/landing/ValueProposition';
import { DetectionVideo } from './components/landing/DetectionVideo';
import { SarAnalysis } from './components/landing/SarAnalysis';
import { OilSpillHistory } from './components/landing/OilSpillHistory';
import { OceanisMethodology } from './components/landing/OceanisMethodology';
import { LaunchCta } from './components/landing/LaunchCta';
import { Footer } from './components/landing/Footer';

function App() {
  return (
    <main className="relative min-h-screen bg-black font-sans text-text-main antialiased selection:bg-primary selection:text-white">
      {/* ── Global Black Grid Background ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col">
        <Header />
        <Hero />

        {/* Content Flow */}
        <div className="relative w-full text-white bg-transparent">
          <ValueProposition />
          <DetectionVideo />
          <SarAnalysis />
        </div>

        <OilSpillHistory />
        <OceanisMethodology />
        <LaunchCta />
        <Footer />
      </div>
    </main>
  );
}

export default App;
