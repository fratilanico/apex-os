/**
 * ParadigmShifter Component
 * 
 * PERFORMANCE OPTIMIZATIONS APPLIED:
 * - React.memo on all components to prevent unnecessary re-renders
 * - useCallback for mode change handler
 * - Simplified animations (removed staggerChildren, reduced durations)
 * - Single motion wrapper in TerminalOutput instead of per-line animations
 * - Disabled heavy scanline animations
 * - CSS will-change and contain for better compositing
 * 
 * Toggle should be smooth with NO freeze. Target: < 0.5s transition time.
 */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LegacyState } from './LegacyState';
import { VibeState } from './VibeState';

type ParadigmMode = 'legacy' | 'vibe';

export const ParadigmShifter = React.memo(function ParadigmShifter() {
  const [mode, setMode] = useState<ParadigmMode>('legacy');

  const handleModeChange = useCallback((newMode: ParadigmMode) => {
    if (newMode !== mode) {
      setMode(newMode);
    }
  }, [mode]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Toggle Pill */}
      <div className="flex justify-center mb-12">
        <div className="relative inline-flex p-1 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-full">
          {/* Animated Background Slider */}
          <motion.div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full ${
              mode === 'legacy' 
                ? 'bg-red-500/20 border border-red-500/40' 
                : 'bg-cyan-500/20 border border-cyan-500/40'
            }`}
            initial={false}
            animate={{
              left: mode === 'legacy' ? '4px' : 'calc(50% + 0px)',
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          />

          {/* Legacy Button */}
          <button
            onClick={() => handleModeChange('legacy')}
            className={`relative z-10 px-8 py-3 font-mono text-sm font-medium transition-colors duration-300 rounded-full ${
              mode === 'legacy'
                ? 'text-red-400'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            Legacy Dev
          </button>

          {/* Vibe Button */}
          <button
            onClick={() => handleModeChange('vibe')}
            className={`relative z-10 px-8 py-3 font-mono text-sm font-medium transition-colors duration-300 rounded-full ${
              mode === 'vibe'
                ? 'text-cyan-400'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            Vibe Coder
          </button>
        </div>
      </div>

      {/* Content Area with AnimatePresence */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {mode === 'legacy' ? (
            <LegacyState key="legacy" />
          ) : (
            <VibeState key="vibe" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
