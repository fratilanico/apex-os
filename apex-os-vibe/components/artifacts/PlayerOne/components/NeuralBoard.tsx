'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NeuralBoardProps {
  isAuthorized: boolean;
  className?: string;
}

export const NeuralBoard: React.FC<NeuralBoardProps> = ({ 
  isAuthorized, 
  className = '' 
}) => {
  const grid = Array.from({ length: 64 }, (_, i) => i);
  
  return (
    <div className={`p-3 bg-zinc-950/80 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl ${className}`}>
      <div className="grid grid-cols-8 gap-1 opacity-40">
        {grid.map((i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isBlack = (row + col) % 2 === 1;
          return (
            <motion.div
              key={i}
              animate={!isAuthorized && isBlack ? { opacity: [0.2, 0.6, 0.2] } : { opacity: 0.2 }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                delay: i * 0.02,
                ease: "easeInOut" 
              }}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-sm ${isBlack ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-white/10'}`}
            />
          );
        })}
      </div>
    </div>
  );
};
