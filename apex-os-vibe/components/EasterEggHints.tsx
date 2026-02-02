import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Terminal, Coffee, Gamepad2, KeyRound, Copy, Check } from 'lucide-react';

interface Hint {
  command: string;
  description: string;
  icon: React.ReactNode;
  location: string;
}

const HINTS: Hint[] = [
  {
    command: 'help',
    description: 'Reveals all available terminal commands',
    icon: <Terminal className="w-4 h-4" />,
    location: 'Contact Terminal',
  },
  {
    command: 'joke',
    description: 'Get a random developer joke',
    icon: <span>😂</span>,
    location: 'Contact Terminal',
  },
  {
    command: 'coffee',
    description: 'Brew some ASCII coffee',
    icon: <Coffee className="w-4 h-4" />,
    location: 'Contact Terminal',
  },
  {
    command: 'matrix',
    description: 'Enter the Matrix...',
    icon: <span>🐰</span>,
    location: 'Contact Terminal',
  },
  {
    command: 'vibe',
    description: 'Check the current vibe',
    icon: <span>✨</span>,
    location: 'Contact Terminal',
  },
  {
    command: 'sudo',
    description: 'Try to get root access 😏',
    icon: <KeyRound className="w-4 h-4" />,
    location: 'Contact Terminal',
  },
  {
    command: '↑↑↓↓←→←→BA',
    description: 'The Konami Code... 🎮',
    icon: <Gamepad2 className="w-4 h-4" />,
    location: 'Anywhere on the site',
  },
  {
    command: 'stack',
    description: 'View the full tech stack',
    icon: <span>⚡</span>,
    location: 'Contact Terminal',
  },
];

export const EasterEggHints: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDiscovered, setHasDiscovered] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  // Check if user has discovered the hints before
  useEffect(() => {
    try {
      const discovered = localStorage.getItem('easter-egg-discovered');
      if (discovered) {
        setHasDiscovered(true);
        setShowPulse(false);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowPulse(false);
    try {
      localStorage.setItem('easter-egg-discovered', 'true');
    } catch {
      // localStorage not available
    }
  };

  const handleCopy = (cmd: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // For Konami code, copy the sequence name or something useful?
    // Actually just copy the text displayed.
    navigator.clipboard.writeText(cmd);
    setCopied(cmd);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {/* Floating Hint Button */}
      <motion.button
        onClick={handleOpen}
        // Moved up slightly on mobile to avoid bottom nav/keyboard issues
        className="fixed bottom-32 right-4 md:bottom-24 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        aria-label="Show easter egg hints"
      >
        {/* Pulse ring */}
        {showPulse && (
          <motion.div
            className="absolute inset-0 rounded-full bg-violet-500"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
        
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        
        {/* "Psst" tooltip */}
        {!hasDiscovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3 }}
            className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-black/90 text-white text-xs font-medium whitespace-nowrap hidden md:block"
          >
            Psst... secrets inside 🤫
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
          </motion.div>
        )}
      </motion.button>

      {/* Draggable Hints Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.1}
            // Updated constraints for better mobile behavior
            dragConstraints={{
              top: -500,
              left: -300,
              right: 300,
              bottom: 100,
            }}
            initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
            className="fixed z-[60] w-[calc(100%-32px)] md:w-full max-w-sm"
            style={{ bottom: '100px', right: '16px' }}
          >
            <div className="bg-gray-900/95 border border-violet-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 backdrop-blur-md">
              {/* Header with Drag Handle */}
              <div className="relative px-4 py-3 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border-b border-white/10 cursor-move touch-none">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white">Secret Commands</h3>
                    <p className="text-[10px] text-violet-300">Drag me around!</p>
                  </div>
                  
                  {/* Drag Handle Indicator */}
                  <div className="flex gap-0.5 mr-2">
                    <div className="w-1 h-4 rounded-full bg-white/20"></div>
                    <div className="w-1 h-4 rounded-full bg-white/20"></div>
                  </div>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/10 flex-shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hints List */}
              <div className="p-3 max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  {HINTS.map((hint, idx) => (
                    <motion.div
                      key={hint.command}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={(e) => handleCopy(hint.command, e)}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 transition-colors group cursor-pointer relative"
                    >
                      <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                        {hint.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <code className="text-xs font-mono font-bold text-fuchsia-400">
                            {hint.command}
                          </code>
                          <span className="text-[9px] text-white/30 uppercase tracking-wider">
                            {hint.location}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/60 mt-0.5">{hint.description}</p>
                      </div>
                      
                      {/* Copy Indicator */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {copied === hint.command ? (
                           <Check className="w-4 h-4 text-emerald-400" />
                         ) : (
                           <Copy className="w-4 h-4 text-white/40" />
                         )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-black/30 border-t border-white/5">
                <p className="text-[10px] text-center text-white/40">
                  Tap any command to copy it!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
