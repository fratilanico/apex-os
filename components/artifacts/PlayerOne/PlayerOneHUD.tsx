'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkillTreeHUD } from './SkillTreeHUD';
import { DungeonMasterSidebar } from './DungeonMasterSidebar';
import { ApexRouterHUD } from './ApexRouterHUD';
import { ApexTerminalHUD, TerminalTelemetry } from './ApexTerminalHUD';
import { CodeMachineHUD } from './CodeMachineHUD';
import { MCPRegistryHUD } from './MCPRegistryHUD';
import { WASMForgeHUD } from './WASMForgeHUD';
import { ApexMatrixHUD } from './ApexMatrixHUD';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';
import { Layout, Terminal as TerminalIcon, Cpu, User, X, Command, GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const PlayerOneHUD: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'skills' | 'terminal' | 'matrix'>('skills');
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });

  const { addDMLog, narrativeContext } = useSkillTreeStore();

  // Detect mobile / handle resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // On open: initialize centered position, lock body scroll
  useEffect(() => {
    if (isOpen) {
      addDMLog(`Apex OS Access Protocol Initiated. Welcome back, Player One.`);
      addDMLog(`Current Objective: ${narrativeContext}`);
      document.body.style.overflow = 'hidden';
      // Center window on desktop
      if (typeof window !== 'undefined' && !isMobile) {
        const w = Math.min(900, window.innerWidth * 0.78);
        const h = Math.min(700, window.innerHeight * 0.78);
        setPosition({
          x: (window.innerWidth - w) / 2,
          y: (window.innerHeight - h) / 2
        });
      }
      setIsMaximized(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, addDMLog, narrativeContext, isMobile]);

  // --- Drag handlers ---
  const handleDragStart = useCallback((e: React.PointerEvent) => {
    if (isMaximized) return;
    // Don't start drag if clicking on a button
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(true);
    let originX = position.x;
    let originY = position.y;

    if (isMobile && !hasDragged && typeof window !== 'undefined') {
      const size = Math.min(window.innerWidth * 0.92, window.innerHeight * 0.85);
      originX = (window.innerWidth - size) / 2;
      originY = (window.innerHeight - size) / 2;
      setPosition({ x: originX, y: originY });
    }

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX,
      originY
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [isMaximized, isMobile, hasDragged, position]);

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const newY = dragRef.current.originY + dy;

    // Snap to maximize when dragged near the top edge
    if (newY < 40) {
      setIsMaximized(true);
      setIsDragging(false);
      return;
    }

    setPosition({
      x: dragRef.current.originX + dx,
      y: newY
    });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Toggle maximize / restore
  const toggleMaximize = useCallback(() => {
    if (isMaximized) {
      // Restore to centered window
      if (typeof window !== 'undefined') {
        const w = Math.min(900, window.innerWidth * 0.78);
        const h = Math.min(700, window.innerHeight * 0.78);
        setPosition({
          x: (window.innerWidth - w) / 2,
          y: (window.innerHeight - h) / 2
        });
      }
    }
    setIsMaximized(prev => !prev);
  }, [isMaximized]);

  // Compute window positioning style
  const getWindowStyle = useCallback((): React.CSSProperties => {
    if (isMaximized) {
      return { top: 0, left: 0, right: 0, bottom: 0 };
    }
    if (isMobile) {
      // Square on mobile — size is the min of 92vw and 85vh
      if (!hasDragged) {
        return {
          width: 'min(92vw, 85vh)',
          height: 'min(92vw, 85vh)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        };
      }
      return {
        width: 'min(92vw, 85vh)',
        height: 'min(92vw, 85vh)',
        left: position.x,
        top: position.y
      };
    }
    // Desktop windowed
    if (typeof window === 'undefined') return {};
    return {
      left: position.x,
      top: position.y,
      width: Math.min(900, window.innerWidth * 0.78),
      height: Math.min(700, window.innerHeight * 0.78)
    };
  }, [isMaximized, isMobile, position]);

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

      {/* HUD Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
              className={[
                'fixed z-[9999] bg-black/90 flex flex-col overflow-hidden will-change-transform',
                isMobile ? 'backdrop-blur-md' : 'backdrop-blur-2xl',
                isMaximized ? '' : 'rounded-2xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)]'
              ].join(' ')}
              style={{
                ...getWindowStyle(),
                transition: isDragging ? 'none' : 'top 0.25s ease-out, left 0.25s ease-out, width 0.25s ease-out, height 0.25s ease-out, right 0.25s ease-out, bottom 0.25s ease-out'
              }}
            >
            {/* ─── Title Bar / Drag Handle ─── */}
            <div
              className={[
                'flex items-center justify-between px-3 h-9 border-b border-white/10 bg-zinc-900/80 flex-shrink-0 select-none touch-none',
                !isMaximized ? 'cursor-grab' : '',
                isDragging ? 'cursor-grabbing' : ''
              ].join(' ')}
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
            >
              <div className="flex items-center gap-2">
                {!isMobile && !isMaximized && <GripVertical className="w-4 h-4 text-white/20" />}
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono">Apex OS</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={toggleMaximize}
                  className="p-1.5 text-white/30 hover:text-cyan-400 hover:bg-white/5 rounded transition-colors"
                  title={isMaximized ? 'Restore' : 'Maximize'}
                >
                  {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/5 rounded transition-colors"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ─── Body: Sidebar + Content ─── */}
            <div className={`flex-1 flex overflow-hidden ${isMaximized ? 'md:flex-row' : 'sm:flex-row'} flex-col`}>
              {/* Left Sidebar (hidden on mobile) */}
              <div className={`hidden sm:flex ${isMaximized ? 'w-20 lg:w-24' : 'w-14'} bg-zinc-950 border-r border-white/5 flex-col items-center py-4 gap-5 p-1.5 flex-shrink-0`}>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                    <User className="w-4 h-4 neural-eye-glow" />
                  </div>
                  <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest">P1</span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-2">
                  <button
                    onClick={() => setActiveView('skills')}
                    className={`p-2 rounded-lg transition-all ${activeView === 'skills' ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                    title="Skills (Ctrl+1)"
                  >
                    <Cpu className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { setActiveView('matrix'); addDMLog('SYSTEM: Neural Matrix activated.'); }}
                    className={`p-2 rounded-lg transition-all ${activeView === 'matrix' ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                    title="Matrix (Ctrl+2)"
                  >
                    <Layout className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { setActiveView('terminal'); addDMLog('SYSTEM: Terminal interface activated.'); }}
                    className={`p-2 rounded-lg transition-all ${activeView === 'terminal' ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                    title="Terminal (Ctrl+T)"
                  >
                    <TerminalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Apex OS Header — only shown when maximized */}
                {isMaximized && (
                  <div className="px-6 py-4 border-b border-white/5 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Apex OS v1.0.0</h1>
                        <p className="text-white/40 text-xs font-mono tracking-widest mt-0.5">Sovereign Developer Interface // Connected to Cognitive Core</p>
                      </div>
                      <div className="hidden md:flex">
                        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-white/60 uppercase">
                          Status: <span className="text-emerald-400">Synchronized</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content with padding */}
                <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-4 md:p-5">
                  {/* Mobile Tab Bar — only on small screens */}
                  <div className="flex sm:hidden border-b border-white/5 mb-3 flex-shrink-0">
                    <button
                      onClick={() => setActiveView('skills')}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${activeView === 'skills' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5' : 'text-white/60'}`}
                    >
                      Skills
                    </button>
                    <button
                      onClick={() => setActiveView('terminal')}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${activeView === 'terminal' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5' : 'text-white/60'}`}
                    >
                      Terminal
                    </button>
                    <button
                      onClick={() => setActiveView('matrix')}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${activeView === 'matrix' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5' : 'text-white/60'}`}
                    >
                      Matrix
                    </button>
                  </div>

                  {/* ─── Views ─── */}
                  {activeView === 'skills' && (
                    <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-y-auto no-scrollbar pb-4">
                      {/* Left Column: Skill Tree */}
                      <div className="flex-[2] space-y-6">
                        <ErrorBoundary>
                          <SkillTreeHUD />
                        </ErrorBoundary>

                        {/* Bottom Shelf: MCP Registry & WASM Forge */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                          <ErrorBoundary>
                            <MCPRegistryHUD />
                          </ErrorBoundary>
                          <ErrorBoundary>
                            <WASMForgeHUD />
                          </ErrorBoundary>
                        </div>
                      </div>

                      {/* Right Column: Routing & Stats */}
                      <div className="flex-1 space-y-6">
                        <ErrorBoundary>
                          <ApexRouterHUD />
                        </ErrorBoundary>

                        <ErrorBoundary>
                          <CodeMachineHUD />
                        </ErrorBoundary>

                        {/* Quick Stats Mini-HUD */}
                        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-xl">
                          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Hardware Telemetry</h3>
                          <div className="space-y-3">
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
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="flex flex-col gap-4">
                        <TerminalTelemetry />
                        <ErrorBoundary>
                          <ApexTerminalHUD />
                        </ErrorBoundary>
                      </div>
                    </div>
                  )}

                  {activeView === 'matrix' && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-black/40 rounded-2xl border border-white/5 relative">
                      <ErrorBoundary>
                        <ApexMatrixHUD />
                      </ErrorBoundary>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar: Dungeon Master — only when maximized on large screens */}
              {isMaximized && (
                <div className="hidden lg:block flex-shrink-0">
                  <DungeonMasterSidebar />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
