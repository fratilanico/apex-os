'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillTreeHUD } from './SkillTreeHUD';
import { DungeonMasterSidebar } from './DungeonMasterSidebar';
import { ApexRouterHUD } from './ApexRouterHUD';
import { ApexTerminalHUD } from './ApexTerminalHUD';
import { CodeMachineHUD } from './CodeMachineHUD';
import { MCPRegistryHUD } from './MCPRegistryHUD';
import { WASMForgeHUD } from './WASMForgeHUD';
import { ApexMatrixHUD } from './ApexMatrixHUD';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';
import { Layout, Terminal as TerminalIcon, Cpu, User, X, Command } from 'lucide-react';

export const PlayerOneHUD: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'skills' | 'terminal' | 'matrix'>('skills');

  const { addDMLog, narrativeContext } = useSkillTreeStore();

  // Toggle HUD with hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      // Tab switching (only when HUD is open)
      if (isOpen && (e.ctrlKey || e.metaKey)) {
        if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          setActiveView('terminal');
        }
        if (e.key === '1') {
          e.preventDefault();
          setActiveView('skills');
        }
        if (e.key === '2') {
          e.preventDefault();
          setActiveView('matrix');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Narrative trigger on open
  useEffect(() => {
    if (isOpen) {
      addDMLog(`Apex OS Access Protocol Initiated. Welcome back, Player One.`);
      addDMLog(`Current Objective: ${narrativeContext}`);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, addDMLog, narrativeContext]);

  return (
    <>
      {/* Floating Toggle Button (Visible when closed) */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-[9998] w-12 h-12 sm:w-14 sm:h-14 bg-zinc-900 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group"
          title="Open Player One HUD (Ctrl + `)"
          aria-label="Open Player One HUD"
        >
          <Command className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-cyan-500 rounded-full animate-ping" />
        </motion.button>
      )}

      {/* Full-screen HUD Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-2xl flex flex-col md:flex-row h-[100dvh] overflow-hidden"
          >
            {/* Left Sidebar: Navigation & Identity */}
            <div className="w-full md:w-20 lg:w-24 bg-zinc-950 border-r border-white/5 flex md:flex-col items-center py-8 gap-8 p-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                  <User className="w-6 h-6 neural-eye-glow" />
                </div>
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">P1</span>
              </div>

              <div className="flex-1 flex md:flex-col items-center gap-4">
                {/* Skills View Button */}
                <button 
                  onClick={() => setActiveView('skills')}
                  className={`p-3 rounded-xl transition-all ${
                    activeView === 'skills' 
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                      : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                  }`}
                  title="Skills (Ctrl+1)"
                >
                  <Cpu className="w-6 h-6" />
                </button>
                
                {/* Matrix View Button */}
                <button 
                  onClick={() => {
                    setActiveView('matrix');
                    addDMLog('SYSTEM: Neural Matrix activated. Mapping synapses...');
                  }}
                  className={`p-3 rounded-xl transition-all ${
                    activeView === 'matrix' 
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                      : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                  }`}
                  title="Matrix (Ctrl+2)"
                >
                  <Layout className="w-6 h-6" />
                </button>
                
                {/* Terminal View Button */}
                <button 
                  onClick={() => {
                    setActiveView('terminal');
                    addDMLog('SYSTEM: Terminal interface activated.');
                  }}
                  className={`p-3 rounded-xl transition-all ${
                    activeView === 'terminal' 
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                      : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                  }`}
                  title="Terminal (Ctrl+T)"
                >
                  <TerminalIcon className="w-6 h-6" />
                </button>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="md:mt-auto p-3 text-white/20 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content: Skill Tree & Tools */}
            <div className="flex-1 flex flex-col p-4 md:p-8 lg:p-12 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Apex OS v1.0.0</h1>
                  <p className="text-white/40 text-sm font-mono tracking-widest mt-1">Sovereign Developer Interface // Connected to Cognitive Core</p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-white/60 uppercase">
                    Status: <span className="text-emerald-400">Synchronized</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Tab Bar - only visible on small screens */}
                <div className="flex md:hidden border-b border-white/5 mb-4">
                  <button 
                    onClick={() => setActiveView('skills')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      activeView === 'skills' 
                        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5' 
                        : 'text-white/60'
                    }`}
                  >
                    Skills
                  </button>
                  <button 
                    onClick={() => setActiveView('terminal')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      activeView === 'terminal' 
                        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5' 
                        : 'text-white/60'
                    }`}
                  >
                    Terminal
                  </button>
                  <button 
                    onClick={() => setActiveView('matrix')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      activeView === 'matrix' 
                        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5' 
                        : 'text-white/60'
                    }`}
                  >
                    Matrix
                  </button>
                </div>

                {activeView === 'skills' && (
                  <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-y-auto no-scrollbar pb-20">
                    {/* Left Column: Skill Tree */}
                    <div className="flex-[2] space-y-8">
                      <SkillTreeHUD />
                      
                      {/* Bottom Shelf: MCP Registry & WASM Forge */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
                        <MCPRegistryHUD />
                        <WASMForgeHUD />
                      </div>
                    </div>

                    {/* Right Column: Routing & Stats */}
                    <div className="flex-1 space-y-8">
                      <ApexRouterHUD />
                      
                      <CodeMachineHUD />
                      
                      {/* Quick Stats Mini-HUD */}
                      <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-xl">
                        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Hardware Telemetry</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/60">Cognitive Load</span>
                            <span className="text-cyan-400 font-mono">14%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-cyan-500 w-[14%]" />
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white/60">Neural Velocity</span>
                            <span className="text-emerald-400 font-mono">842 t/s</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-emerald-500 w-[62%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeView === 'terminal' && (
                  <div className="flex-1 flex flex-col overflow-hidden pb-8">
                    <ApexTerminalHUD />
                  </div>
                )}

                {activeView === 'matrix' && (
                  <div className="flex-1 flex flex-col overflow-hidden pb-8 bg-black/40 rounded-2xl border border-white/5 relative">
                    <ApexMatrixHUD />
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar: Dungeon Master */}
            <div className="hidden lg:block">
              <DungeonMasterSidebar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
