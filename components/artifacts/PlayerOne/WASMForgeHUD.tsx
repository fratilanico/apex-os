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
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-xl h-full flex flex-col group hover:border-purple-500/30 hover:bg-zinc-900/70 hover:shadow-[0_0_35px_rgba(168,85,247,0.12)]"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Hammer className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">WASM Module Forge</h3>
        </div>
        <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[8px] font-black text-purple-400 uppercase tracking-tighter group-hover:border-purple-500/40 group-hover:text-purple-300 transition-colors">
          Edge Tooling SDK
        </div>
      </div>

      <div className="space-y-4 mb-6">
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
            placeholder="Describe a tool to forge (e.g. 'JSON Validator')..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all"
            disabled={isForging}
            enterKeyHint="send"
          />
          <button
            type="submit"
            disabled={isForging || !prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all disabled:opacity-0"
          >
            {isForging ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-3 px-2">
          <Binary className="w-3.5 h-3.5 text-white/20" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Active Modules</span>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
          {forgedModules.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 gap-2 border-2 border-dashed border-white/10 rounded-xl">
              <Boxes className="w-8 h-8" />
              <p className="text-[8px] uppercase font-bold tracking-widest">No Custom Modules</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {forgedModules.map((mod, i) => (
                <motion.div
                  key={`${mod}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center border border-white/5">
                      <Binary className="w-4 h-4 text-purple-400/60" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-tight">{mod}</p>
                      <p className="text-[8px] font-mono text-white/20 uppercase">wasm32-wasi // 42kb</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-white/10 group-hover:text-purple-400/40 transition-colors" />
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
    </motion.div>
  );
};
