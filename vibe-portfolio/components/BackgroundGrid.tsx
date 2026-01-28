import React from 'react';

const CYAN_AURORA_STYLE: React.CSSProperties = {
  top: '-10%',
  left: '-5%',
  width: '60%',
  height: '60%',
  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.08) 40%, transparent 70%)',
  filter: 'blur(50px)',
};

const VIOLET_AURORA_STYLE: React.CSSProperties = {
  bottom: '-10%',
  right: '-5%',
  width: '55%',
  height: '55%',
  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)',
  filter: 'blur(50px)',
};

const GRID_LINES_STYLE: React.CSSProperties = {
  backgroundSize: '40px 40px',
  backgroundImage: `
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
  `,
  maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 30%, transparent 100%)',
  WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 30%, transparent 100%)',
};

export const BackgroundGrid = React.memo(function BackgroundGrid() {
  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Base dark background - THIS is the actual page background */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Cyan aurora - top left */}
      <div 
        className="absolute"
        style={CYAN_AURORA_STYLE}
      />
      
      {/* Violet aurora - bottom right */}
      <div 
        className="absolute"
        style={VIOLET_AURORA_STYLE}
      />
      
      {/* Grid lines */}
      <div 
        className="absolute inset-0"
        style={GRID_LINES_STYLE}
      />
    </div>
  );
});
