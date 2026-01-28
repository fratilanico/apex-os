'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXP } from '@/hooks/useXP';

export interface XPBarProps {
  /**
   * Display variant
   * - 'compact': Minimal design for navbar
   * - 'full': Expanded design with more details
   */
  variant?: 'compact' | 'full';
  
  /**
   * Custom className for styling
   */
  className?: string;
  
  /**
   * Show celebration animation on mount if recently leveled up
   */
  showCelebration?: boolean;
}

/**
 * XPBar - Visual XP progress bar component
 * 
 * Displays current level, XP progress, and level-up celebrations
 * 
 * @example
 * ```tsx
 * // Compact variant for navbar
 * <XPBar variant="compact" />
 * 
 * // Full variant for profile page
 * <XPBar variant="full" showCelebration />
 * ```
 */
export const XPBar = React.memo<XPBarProps>(function XPBar({ 
  variant = 'compact', 
  className = '',
  showCelebration = false,
}) {
  const { 
    currentXP, 
    currentLevel, 
    currentLevelTitle,
    xpToNextLevel,
    nextLevel,
    isMaxLevel,
    progressPercentage,
  } = useXP();

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(currentLevel);

  // Detect level up
  useEffect(() => {
    if (currentLevel > previousLevel) {
      setShowLevelUp(true);
      setPreviousLevel(currentLevel);
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentLevel, previousLevel]);

  // Show celebration on mount if prop is true
  useEffect(() => {
    if (!showCelebration || currentLevel <= 0) return;
    
    setShowLevelUp(true);
    const timer = setTimeout(() => setShowLevelUp(false), 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [showCelebration, currentLevel]);

  const progress = progressPercentage();

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-2">
          {/* Level Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50">
            <span className="text-xs font-semibold text-zinc-400">LVL</span>
            <span className="text-sm font-bold text-white">{currentLevel}</span>
          </div>

          {/* Progress Bar */}
          <div className="relative w-24 h-2 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-700/50">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: 'linear',
                repeatDelay: 1,
              }}
            />
          </div>

          {/* XP Text */}
          {!isMaxLevel && (
            <span className="text-xs text-zinc-500 font-medium">
              {xpToNextLevel} XP
            </span>
          )}
        </div>

        {/* Level Up Celebration */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg">
                <span className="text-xs font-bold text-white">
                  🎉 Level {currentLevel}!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`relative ${className}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Level Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <span className="text-sm font-semibold text-zinc-400">LEVEL</span>
              <span className="text-2xl font-bold text-white">{currentLevel}</span>
            </div>

            {/* Level Title */}
            <div>
              <h3 className="text-lg font-bold text-white">{currentLevelTitle}</h3>
              {!isMaxLevel && nextLevel && (
                <p className="text-sm text-zinc-500">
                  Next: {nextLevel.title}
                </p>
              )}
            </div>
          </div>

          {/* XP Counter */}
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{currentXP}</p>
            <p className="text-xs text-zinc-500">Total XP</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="relative h-4 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-700/50">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2.5, 
                ease: 'linear',
                repeatDelay: 1.5,
              }}
            />

            {/* Progress Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* XP Details */}
          {!isMaxLevel && nextLevel && (
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{currentXP - (LEVELS[currentLevel]?.xpRequired ?? 0)} XP</span>
              <span>{xpToNextLevel} XP to next level</span>
              <span>{nextLevel.xpRequired} XP</span>
            </div>
          )}

          {isMaxLevel && (
            <p className="text-center text-sm font-semibold text-purple-400">
              🏆 Max Level Reached!
            </p>
          )}
        </div>
      </div>

      {/* Level Up Celebration - Full Screen */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50 animate-pulse" />
              
              {/* Main card */}
              <div className="relative px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl">
                <div className="text-center space-y-1">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                    className="text-4xl"
                  >
                    🎉
                  </motion.div>
                  <h4 className="text-2xl font-bold text-white">Level Up!</h4>
                  <p className="text-lg font-semibold text-white/90">
                    {currentLevelTitle}
                  </p>
                  <p className="text-sm text-white/75">Level {currentLevel}</p>
                </div>
              </div>
              
              {/* Confetti particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 200],
                    y: [0, -Math.random() * 150],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeOut',
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Re-export LEVELS for use in XPBar component
import { LEVELS } from '@/hooks/useXP';
