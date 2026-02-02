'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TERMINAL_CONFIG } from '@/lib/terminal/constants';

interface NeuralGridProps {
  className?: string;
  animated?: boolean;
  density?: 'low' | 'medium' | 'high';
}

export const NeuralGrid: React.FC<NeuralGridProps> = ({ 
  className = '',
  animated = true,
  density = 'medium'
}) => {
  const gridConfig = useMemo(() => {
    const baseSize = TERMINAL_CONFIG.GRID_SIZE;
    const multiplier = density === 'low' ? 0.5 : density === 'high' ? 2 : 1;
    return {
      size: baseSize * multiplier,
      cols: TERMINAL_CONFIG.GRID_COLS,
    };
  }, [density]);

  const cells = useMemo(() => {
    return Array.from({ length: gridConfig.size }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 1.5,
    }));
  }, [gridConfig.size]);

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      {animated && cells.map((cell) => (
        <motion.div
          key={cell.id}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: cell.duration,
            delay: cell.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
          style={{
            left: `${(cell.id % gridConfig.cols) * (100 / gridConfig.cols)}%`,
            top: `${Math.floor(cell.id / gridConfig.cols) * (100 / (gridConfig.size / gridConfig.cols))}%`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
          `,
        }}
      />

      <div className="absolute inset-0 border border-cyan-500/5 rounded-2xl" />
    </div>
  );
};
