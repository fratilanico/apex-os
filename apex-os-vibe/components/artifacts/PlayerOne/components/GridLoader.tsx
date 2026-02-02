import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GridLoaderProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export const GridLoader: React.FC<GridLoaderProps> = ({ isLoading, onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('INITIALIZING_SECURE_CONNECTION...');

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

  // Fixed dense grid - 20x12 = 240 cells total
  const cols = 20;
  const rows = 12;
  const totalCells = cols * rows;
  
  // Calculate which cells should be active based on progress
  // At 100%, ALL cells should be active
  const targetActiveCells = Math.ceil((progress / 100) * totalCells);
  
  // Create array of cell indices and shuffle for random fill pattern
  const cellOrder = React.useMemo(() => {
    const indices: number[] = Array.from({ length: totalCells }, (_, i) => i);
    // Shuffle using Fisher-Yates
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = indices[i]!;
      indices[i] = indices[j]!;
      indices[j] = temp;
    }
    return indices;
  }, []);

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
          
          {/* Grid Container - Fixed size, centered */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Grid Pattern - Fixed 20x12 grid */}
            <div className="relative p-6 rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
              <div 
                className="grid gap-1.5"
                style={{ 
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  width: '480px',
                  height: '288px'
                }}
              >
                {Array.from({ length: totalCells }).map((_, index) => {
                  // Check if this cell should be active based on shuffled order
                  const cellIndex = cellOrder[index] ?? 0;
                  const isActive = cellIndex < targetActiveCells;
                  const row = Math.floor(index / cols);
                  const col = index % cols;
                  
                  // Checkerboard pattern for color variation
                  const isCheckerboard = (row + col) % 2 === 0;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: isActive ? 1 : 0.15,
                        scale: 1,
                        backgroundColor: isActive 
                          ? isCheckerboard 
                            ? 'rgba(6, 182, 212, 0.8)' // cyan-400
                            : 'rgba(16, 185, 129, 0.6)' // emerald-500
                          : 'rgba(255, 255, 255, 0.03)'
                      }}
                      transition={{ 
                        duration: 0.15,
                        delay: isActive ? Math.random() * 0.1 : 0,
                        ease: "easeOut"
                      }}
                      className="w-5 h-5 rounded-[2px]"
                    />
                  );
                })}
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 blur-2xl -z-10" />
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-3">
              <motion.div
                key={currentText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-sm text-cyan-400 tracking-widest uppercase"
              >
                {currentText}
              </motion.div>
              
              {/* Progress bar */}
              <div className="w-72 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              
              <div className="text-xs font-mono text-zinc-500 tracking-wider">
                {Math.round(progress)}% COMPLETE
              </div>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 font-mono text-[10px] text-zinc-600 space-y-1">
            <div>SOVEREIGN_VAULT_ACCESS</div>
            <div>ENCRYPTION: AES-256</div>
          </div>
          
          <div className="absolute top-4 right-4 font-mono text-[10px] text-zinc-600 text-right space-y-1">
            <div>SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            <div>NODE: ZURICH-04</div>
          </div>
          
          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-zinc-600 space-y-1">
            <div>LATENCY: 14ms</div>
            <div>BANDWIDTH: 10Gbps</div>
          </div>
          
          <div className="absolute bottom-4 right-4 font-mono text-[10px] text-zinc-600 text-right space-y-1">
            <div>PROTOCOL: TLS_1.3</div>
            <div>CIPHER_SUITE: CHACHA20_POLY1305</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
