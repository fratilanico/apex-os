import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Clock } from 'lucide-react';

const STORAGE_KEY = 'sticky-cta-dismissed';

export const StickyCTA = React.memo(function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // localStorage not available
    }
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-xl border-t border-cyan-500/20 pb-[env(safe-area-inset-bottom)]"
        >
          <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Value Prop + Urgency */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 min-w-0 flex-1">
                {/* Value Prop - Always visible */}
                <p className="text-white/90 text-sm sm:text-base font-medium truncate">
                  Replace your{' '}
                  <span className="text-red-400 line-through">$200K</span>{' '}
                  tech co-founder with{' '}
                  <span className="text-emerald-400 font-bold">$200/month</span>
                </p>
                
                {/* Urgency - Hidden on mobile, visible on sm+ */}
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-sm font-medium">
                    Only 8 spots left for Feb cohort
                  </span>
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                </div>
              </div>
              
              {/* Right: CTA + Dismiss */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <Link to="/pricing">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)' 
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                
                <button
                  onClick={handleDismiss}
                  className="p-3 sm:p-2 text-white/40 hover:text-white/80 transition-colors rounded-full hover:bg-white/5"
                  aria-label="Dismiss notification"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
