import React, { useState, useEffect } from 'react';
import StaggeredMenu from '../ui/StaggeredMenu';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Overview', ariaLabel: 'Go to overview', link: '#overview' },
    { label: 'How It Works', ariaLabel: 'Go to how it works', link: '#how-it-works' },
    { label: 'Satellite Data', ariaLabel: 'Go to satellite data', link: '#satellite-data' },
    { label: 'Analysis', ariaLabel: 'Go to analysis', link: '#analysis' },
    { label: 'Incident History', ariaLabel: 'Go to incident history', link: '#oil-spill-history' },
    { label: 'Launch Console', ariaLabel: 'Launch investigation console', link: '#launch-console' }
  ];

  const socialItems = [
    { label: 'Documentation', link: '#' },
    { label: 'GitHub', link: '#' }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-primary/95 backdrop-blur-md border-b border-white/10' 
            : 'bg-gradient-to-b from-primary/80 via-primary/40 to-transparent'
        }`}
      >
        <div className="flex items-center justify-between w-full h-20 max-w-[1440px] mx-auto px-6 lg:px-12 relative z-50">
          {/* Wordmark */}
          <div className="flex items-center gap-6 relative z-50">
            <a className="flex flex-col tracking-tight text-white group" href="#">
              <span className="text-2xl font-bold tracking-widest leading-none font-sans">OCEANIS</span>
              <span className="text-[9px] tracking-[0.25em] text-gray-300 font-medium uppercase mt-1 hidden sm:block">Ocean Intelligence & Spill Investigation System</span>
            </a>
          </div>
        </div>
      </header>

      {/* Staggered Menu handles the navigation toggle on the right */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#ffffff"
        changeMenuColorOnOpen={false}
        colors={['#0066FF', '#0B131D']}
        accentColor="#0066FF"
        isFixed={true}
      />
    </>
  );
};
