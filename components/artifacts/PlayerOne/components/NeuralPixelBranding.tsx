'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain, Activity } from 'lucide-react';
import { 
  APEX_LOGO_ASCII, 
  PLAYER_ONE_ASCII, 
  SYSTEM_MESSAGES,
  UI_LABELS 
} from '@/lib/terminal/constants';

interface NeuralPixelBrandingProps {
  isAuthorized: boolean;
  className?: string;
}

export const NeuralPixelBranding: React.FC<NeuralPixelBrandingProps> = ({ 
  isAuthorized, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`font-mono text-xs leading-tight ${className}`}
    >
      {/* APEX Logo with aggressive glitch effect */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative mb-2"
      >
        {/* Cyan layer (offset left) */}
        <motion.pre
          className="absolute top-0 left-0 text-cyan-400/60 select-none pointer-events-none"
          animate={{
            x: [-2, 2, -1, 1, -2],
            opacity: [0.6, 0.8, 0.4, 0.7, 0.6],
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {APEX_LOGO_ASCII}
        </motion.pre>
        
        {/* Pink/Magenta layer (offset right) */}
        <motion.pre
          className="absolute top-0 left-0 text-pink-500/60 select-none pointer-events-none"
          animate={{
            x: [2, -2, 1, -1, 2],
            opacity: [0.6, 0.4, 0.8, 0.5, 0.6],
          }}
          transition={{
            duration: 0.12,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {APEX_LOGO_ASCII}
        </motion.pre>
        
        {/* White layer (main) with jitter */}
        <motion.pre
          className="text-white/90 relative z-10"
          animate={{
            x: [0, 1, -1, 0, 0],
            y: [0, -1, 1, 0, 0],
            opacity: [1, 0.9, 1, 0.8, 1],
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {APEX_LOGO_ASCII}
        </motion.pre>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex items-center gap-4 mb-4 text-[10px] text-zinc-500"
      >
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          {SYSTEM_MESSAGES.NEURAL_ACTIVE}
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-400" />
          {SYSTEM_MESSAGES.SOVEREIGN}
        </span>
        <span className="flex items-center gap-1">
          <Brain className="w-3 h-3 text-cyan-400" />
          {UI_LABELS.APEX_AI}
        </span>
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-400" />
          {SYSTEM_MESSAGES.HANDSHAKE_AUTHORIZED}
        </span>
      </motion.div>

      {/* PLAYER 1 Badge Container - Centered with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col items-center justify-center mb-4"
      >
        <div className="backdrop-blur-md bg-black/20 border border-zinc-700/50 rounded-lg px-6 py-4 shadow-xl">
          <motion.pre
            className="text-xs leading-tight select-flicker"
            animate={{
              color: isAuthorized 
                ? 'rgba(52, 211, 153, 0.9)' 
                : 'rgba(34, 211, 238, 0.9)'
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              color: isAuthorized ? 'rgba(52, 211, 153, 0.9)' : 'rgba(34, 211, 238, 0.9)'
            }}
          >
            {PLAYER_ONE_ASCII}
          </motion.pre>
          
          {/* SYNCING_SYNAPSES text below badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="text-center mt-2"
          >
            <span 
              className="text-[10px] uppercase tracking-widest"
              style={{
                color: isAuthorized ? 'rgba(52, 211, 153, 0.7)' : 'rgba(34, 211, 238, 0.7)'
              }}
            >
              {isAuthorized 
                ? SYSTEM_MESSAGES.NEURAL_HANDSHAKE_COMPLETE 
                : SYSTEM_MESSAGES.SYNCING_SYNAPSES}
            </span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isAuthorized ? 1 : 0.3 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="mt-4 flex items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={isAuthorized ? { 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-2 h-2 rounded-full ${isAuthorized ? 'bg-emerald-400' : 'bg-zinc-600'}`}
          />
          <span className={`text-[10px] ${isAuthorized ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {isAuthorized ? SYSTEM_MESSAGES.NEURAL_HANDSHAKE_COMPLETE : SYSTEM_MESSAGES.SYNCING_SYNAPSES}
          </span>
        </div>

        {isAuthorized && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="text-[10px] text-cyan-400/60"
          >
            Type &apos;help&apos; for available commands
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
};
