'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';
import { useXP } from '@/hooks/useXP';
import { Hammer, Boxes, RefreshCcw, Binary, Sparkles, ChevronRight } from 'lucide-react';

export const WASMForgeHUD: React.FC = () => {
  const { addGold, addDMLog } = useSkillTreeStore();
  const { addXP } = useXP();
  const [prompt, setPrompt] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [forgedModules, setForgedModules] = useState<string[]>([]);

  const handleForge = async () => {
    if (!prompt.trim()) return;
    
    setIsForging(true);
    addDMLog(`FORGE: Initiating WASM compilation for tool: "${prompt}"`);
    
    // Simulate compilation steps
    await new Promise(r => setTimeout(r, 800));
    addDMLog(`FORGE: Rust source generated. Validating memory safety...`);
    await new Promise(r => setTimeout(r, 1200));
    addDMLog(`FORGE: Binary optimized. size: 42KB. binary_type: wasm32-wasi`);
    
    setForgedModules(prev => [prompt, ...prev]);
    setPrompt('');
    setIsForging(false);
    
    addXP(150, `Forged custom WASM tool: ${prompt}`);
    addGold(100);
    addDMLog(`FORGE: Module deployed to Edge Layer. +100 Gold earned.`);
  };

  return (
    <div className="p-4 sm:p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Hammer className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest truncate">WASM Module Forge</h3>
        </div>
        <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[8px] font-black text-purple-400 uppercase tracking-tighter flex-shrink-0">
          Edge SDK
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleForge();
          }}
          className="relative"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleForge();
              }
            }}
            placeholder="Describe a tool to forge..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all min-h-[44px]"
            disabled={isForging}
            enterKeyHint="send"
          />
          <button
            type="submit"
            disabled={isForging || !prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all disabled:opacity-0 pointer-events-auto touch-manipulation"
            style={{ touchAction: 'manipulation' }}
            aria-label="Forge module"
          >
            {isForging ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-2 sm:mb-3 px-2">
          <Binary className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/20" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Active Modules</span>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
          {forgedModules.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 gap-2 border-2 border-dashed border-white/10 rounded-xl">
              <Boxes className="w-6 h-6 sm:w-8 sm:h-8" />
              <p className="text-[8px] uppercase font-bold tracking-widest">No Custom Modules</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {forgedModules.map((mod, i) => (
                <motion.div
                  key={`${mod}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 sm:p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-950 flex items-center justify-center border border-white/5 flex-shrink-0">
                      <Binary className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400/60" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-tight truncate">{mod}</p>
                      <p className="text-[7px] sm:text-[8px] font-mono text-white/20 uppercase">wasm32-wasi // 42kb</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-white/10 group-hover:text-purple-400/40 transition-colors flex-shrink-0" />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="text-[10px] font-mono text-white/20 uppercase text-center leading-relaxed">
          WASM components run with zero server-side latency at the network edge.
        </p>
      </div>
    </div>
  );
};
