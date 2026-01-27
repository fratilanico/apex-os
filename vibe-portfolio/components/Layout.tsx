import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CurriculumModal } from './CurriculumModal';
import { BackgroundGrid } from './BackgroundGrid';
import { StickyCTA } from './StickyCTA';

export const Layout: React.FC = () => {
  const [curriculumOpen, setCurriculumOpen] = useState(false);

  // Auto-open modal if hash is present (for deep linking)
  useEffect(() => {
    if (window.location.hash.startsWith('#module-')) {
      setCurriculumOpen(true);
    }
  }, []);

  // Listen for hash changes to open modal
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#module-')) {
        setCurriculumOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-cyan-500/20 selection:text-cyan-400">
      {/* Premium Vercel-style background with grid + aurora */}
      <BackgroundGrid />
      
      {/* Content wrapper - must be above BackgroundGrid */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar onOpenCurriculum={() => setCurriculumOpen(true)} />

        {/* Page Content - pt-32 ensures content starts below the fixed navbar */}
        <div className="pt-32">
          <Outlet context={{ onOpenCurriculum: () => setCurriculumOpen(true) }} />
        </div>
      </div>

      {/* Global Curriculum Modal - accessible from all pages */}
      <CurriculumModal 
        isOpen={curriculumOpen}
        onClose={() => setCurriculumOpen(false)}
      />

      {/* Sticky CTA - shows after scrolling */}
      <StickyCTA />
    </div>
  );
};
