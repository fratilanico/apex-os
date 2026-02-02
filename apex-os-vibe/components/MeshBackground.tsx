
import React from 'react';
import { motion, useReducedMotion, type Transition } from 'framer-motion';

export const MeshBackground = React.memo(function MeshBackground() {
  const prefersReducedMotion = useReducedMotion();
  const driftTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 20, repeat: Infinity, ease: 'easeInOut' };
  const glowTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 };
  const pulseTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 10, repeat: Infinity, ease: 'linear' };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0a]" aria-hidden="true">
      {/* Deep Violet Drift */}
      <motion.div
        animate={
          prefersReducedMotion
            ? { scale: 1, x: 0, y: 0 }
            : { scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, 50, 0] }
        }
        transition={driftTransition}
        style={{ willChange: 'transform' }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/20 blur-[90px]"
      />
      
      {/* Emerald Glow */}
      <motion.div
        animate={
          prefersReducedMotion
            ? { scale: 1, x: 0, y: 0 }
            : { scale: [1, 1.1, 1], x: [0, -60, 0], y: [0, 80, 0] }
        }
        transition={glowTransition}
        style={{ willChange: 'transform' }}
        className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[80px]"
      />

      {/* Indigo Pulse - Optimized: Removed opacity animation for performance */}
      <motion.div
        animate={
          prefersReducedMotion
            ? { scale: 1, x: 0, y: 0 }
            : { scale: [1, 1.15, 1], x: [0, -20, 0] }
        }
        transition={pulseTransition}
        style={{ willChange: 'transform', opacity: 0.4 }}
        className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-900/15 blur-[100px]"
      />
    </div>
  );
});
