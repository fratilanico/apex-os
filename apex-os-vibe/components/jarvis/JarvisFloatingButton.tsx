import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, MessageCircle, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';

interface JarvisFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  hasNotification?: boolean;
}

export const JarvisFloatingButton: React.FC<JarvisFloatingButtonProps> = ({
  onClick,
  isOpen,
  hasNotification = false
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // GSAP Pulse Animation
  useEffect(() => {
    if (pulseRef.current && !isOpen) {
      gsap.to(pulseRef.current, {
        scale: 1.4,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power1.out"
      });
    }
    return () => {
      if (pulseRef.current) {
        gsap.killTweensOf(pulseRef.current);
      }
    };
  }, [isOpen]);

  // Hover animation
  useEffect(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: isHovered ? 1.1 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isHovered]);

  // Voice activation simulation
  const handleVoiceActivation = useCallback(() => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      onClick();
    }, 1500);
  }, [onClick]);

  return (
    <>
      {/* Pulse Ring */}
      {!isOpen && (
        <div
          ref={pulseRef}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 opacity-30 pointer-events-none z-40"
        />
      )}

      {/* Main Button */}
      <motion.button
        ref={buttonRef}
        onClick={handleVoiceActivation}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600
          shadow-2xl shadow-violet-500/40
          flex items-center justify-center
          border-2 border-white/20
          backdrop-blur-xl
          transition-all duration-300
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
        whileTap={{ scale: 0.95 }}
        aria-label="Open JARVIS AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1"
            >
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  animate={{
                    height: [4, 16, 4],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="mic"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              className="relative"
            >
              <Mic className="w-6 h-6 text-white" />
              
              {/* Sparkle effect */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-3 h-3 text-cyan-300" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Badge */}
        {hasNotification && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900"
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-8 right-24 z-50 px-4 py-2 bg-slate-800/90 backdrop-blur-xl rounded-xl border border-white/10 text-sm text-white font-medium shadow-xl"
          >
            Ask JARVIS
            <span className="block text-xs text-white/50 mt-1">Voice-enabled AI Assistant</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JarvisFloatingButton;
