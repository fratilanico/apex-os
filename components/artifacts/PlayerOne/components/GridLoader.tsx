import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GridLoaderProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export const GridLoader: React.FC<GridLoaderProps> = ({ isLoading, onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('INITIALIZING_SECURE_CONNECTION...');
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  const loadingTexts = [
    'INITIALIZING_SECURE_CONNECTION...',
    'DECRYPTING_FINANCIAL_VAULT...',
    'LOADING_BUSINESS_PLAN_V1.0...',
    'VERIFYING_SOVEREIGN_CLEARANCE...',
    'ESTABLISHING_NEURAL_HANDSHAKE...',
    'ACCESSING_FUNDRAISING_STRATEGY...',
    'CALCULATING_VALUATION_MODELS...',
    'LOADING_EXIT_STRATEGIES...',
    'SYNCHRONIZING_MARKET_DATA...',
    'HANDSHAKE_AUTHORIZED',
    'CLEARANCE_GRANTED'
  ];

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setCurrentText('CLEARANCE_GRANTED');
      setTimeout(() => {
        onLoadingComplete?.();
      }, 500);
      return;
    }

    setProgress(0);
    setCurrentText(loadingTexts[0] ?? 'INITIALIZING...');
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < loadingTexts.length) {
        setCurrentText(loadingTexts[currentIndex] ?? 'PROCESSING...');
        setProgress((currentIndex / (loadingTexts.length - 1)) * 100);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isLoading, onLoadingComplete]);

  // Calculate grid dimensions based on viewport
  const cellSize = 24; // Size of each cell in pixels
  const gap = 8; // Gap between cells
  
  const cols = Math.floor((dimensions.width - 64) / (cellSize + gap)); // 64px for padding
  const rows = Math.floor((dimensions.height - 64) / (cellSize + gap));
  const totalCells = rows * cols;
  const activeCells = Math.floor((progress / 100) * totalCells);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />
          
          {/* Grid Container */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Grid Pattern */}
            <div className="relative p-8 rounded-2xl border border-white/10 bg-zinc-900/30 backdrop-blur-sm">
              <div 
                className="grid gap-2"
                style={{ 
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: totalCells }).map((_, index) => {
                  const isActive = index < activeCells;
                  const row = Math.floor(index / cols);
                  const col = index % cols;
                  
                  // Checkerboard pattern
                  const isCheckerboard = (row + col) % 2 === 0;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: isActive ? 1 : 0.1,
                        scale: 1,
                        backgroundColor: isActive && isCheckerboard 
                          ? 'rgba(6, 182, 212, 0.6)' // cyan-400
                          : isActive 
                            ? 'rgba(16, 185, 129, 0.3)' // emerald-500
                            : 'rgba(255, 255, 255, 0.05)'
                      }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.01,
                        ease: "easeOut"
                      }}
                      className="w-4 h-4 rounded-sm"
                    />
                  );
                })}
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 blur-xl -z-10" />
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-2">
              <motion.div
                key={currentText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-mono text-sm text-cyan-400 tracking-wider"
              >
                {currentText}
              </motion.div>
              
              {/* Progress bar */}
              <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="text-xs font-mono text-zinc-500">
                {Math.round(progress)}% COMPLETE
              </div>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 font-mono text-[10px] text-zinc-600">
            <div>SOVEREIGN_VAULT_ACCESS</div>
            <div>ENCRYPTION: AES-256</div>
          </div>
          
          <div className="absolute top-4 right-4 font-mono text-[10px] text-zinc-600 text-right">
            <div>SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            <div>NODE: ZURICH-04</div>
          </div>
          
          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-zinc-600">
            <div>LATENCY: 14ms</div>
            <div>BANDWIDTH: 10Gbps</div>
          </div>
          
          <div className="absolute bottom-4 right-4 font-mono text-[10px] text-zinc-600 text-right">
            <div>PROTOCOL: TLS_1.3</div>
            <div>CIPHER_SUITE: CHACHA20_POLY1305</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
