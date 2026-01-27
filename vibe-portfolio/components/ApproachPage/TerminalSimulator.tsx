import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CostComparison {
  scenario: string;
  allClaude: number;
  optimized: number;
  savings: number;
  breakdown: {
    task: string;
    tool: string;
    cost: string;
  }[];
}

interface TerminalSimulatorProps {
  comparison: CostComparison;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({ comparison }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const lines = [
    { text: `$ calculate-cost --scenario="${comparison.scenario}"`, delay: 0 },
    { text: '', delay: 300 },
    { text: '┌─ TRADITIONAL APPROACH ─────────────────┐', delay: 600, color: 'text-red-400' },
    { text: `│ All Claude Sonnet: $${comparison.allClaude.toFixed(2)}`, delay: 900, color: 'text-white/60' },
    { text: '└────────────────────────────────────────┘', delay: 1100, color: 'text-red-400' },
    { text: '', delay: 1300 },
    { text: '┌─ ORCHESTRATED APPROACH ────────────────┐', delay: 1500, color: 'text-cyan-400' },
    ...comparison.breakdown.map((item, idx) => ({
      text: `│ ${item.task.padEnd(25)} ${item.tool.padEnd(12)} ${item.cost}`,
      delay: 1700 + (idx * 200),
      color: 'text-white/60',
    })),
    { text: '├────────────────────────────────────────┤', delay: 1700 + (comparison.breakdown.length * 200) + 200, color: 'text-cyan-400' },
    { text: `│ Total: $${comparison.optimized.toFixed(2)}`, delay: 1700 + (comparison.breakdown.length * 200) + 400, color: 'text-cyan-400' },
    { text: `│ Savings: ${comparison.savings}%`, delay: 1700 + (comparison.breakdown.length * 200) + 600, color: 'text-emerald-400' },
    { text: '└────────────────────────────────────────┘', delay: 1700 + (comparison.breakdown.length * 200) + 800, color: 'text-cyan-400' },
    { text: '', delay: 1700 + (comparison.breakdown.length * 200) + 1000 },
    { text: '✓ Optimization complete', delay: 1700 + (comparison.breakdown.length * 200) + 1200, color: 'text-emerald-400' },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentLine < lines.length - 1) {
        setCurrentLine(currentLine + 1);
      } else {
        setIsPlaying(false);
      }
    }, lines[currentLine]?.delay || 200);

    return () => clearTimeout(timer);
  }, [currentLine, isPlaying, lines]);

  const handlePlay = () => {
    setCurrentLine(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentLine(0);
    setIsPlaying(false);
  };

  return (
    <div className="my-6 rounded-lg border border-cyan-500/30 bg-black/60 backdrop-blur-sm overflow-hidden">
      {/* Terminal Header */}
      <div className="px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
          </div>
          <span className="text-xs font-mono text-cyan-400/80">cost-simulator.sh</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="px-3 py-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 disabled:text-cyan-600 transition-colors"
          >
            {isPlaying ? '▶ RUNNING' : '▶ RUN'}
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs font-mono text-white/40 hover:text-white/60 transition-colors"
          >
            ↻ RESET
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {lines.slice(0, currentLine + 1).map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`${line.color || 'text-cyan-300'} whitespace-pre`}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Blinking Cursor */}
        {isPlaying && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-cyan-400 ml-1"
          />
        )}
      </div>
    </div>
  );
};
