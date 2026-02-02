import React, { useState, useCallback } from 'react';
import { JarvisFloatingButton } from './JarvisFloatingButton';
import { JarvisChatPanel } from './JarvisChatPanel';

interface JarvisIntegrationProps {
  onNavigate?: (section: string) => void;
}

export const JarvisIntegration: React.FC<JarvisIntegrationProps> = ({
  onNavigate
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleNavigate = useCallback((section: string) => {
    setIsChatOpen(false);
    onNavigate?.(section);
    
    // Smooth scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onNavigate]);

  return (
    <>
      <JarvisFloatingButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
      />
      
      <JarvisChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
};

export default JarvisIntegration;
