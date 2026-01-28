import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ToolsGrid } from '../components/ToolsGrid';
import { Curriculum } from '../components/Curriculum';
import { Footer } from '../components/Footer';

interface OutletContext {
  onOpenCurriculum: () => void;
}

export const HomePage: React.FC = () => {
  const { onOpenCurriculum } = useOutletContext<OutletContext>();
  return (
    <main className="relative z-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-20 pb-16">
      <Hero onOpenCurriculum={onOpenCurriculum} />
      <ToolsGrid />
      <Curriculum onOpenCurriculum={onOpenCurriculum} />
      <Footer />
    </main>
  );
};
