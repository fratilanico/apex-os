'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';
import { useMatrixStore } from '@/stores/useMatrixStore';
import { 
  History, 
  Target, 
  Layers, 
  ChevronRight,
  Activity,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardOverlay: React.FC = () => {
  const { dmLogs, getActiveQuest, gold } = useSkillTreeStore();
  const { nodes } = useMatrixStore();
  
  const activeQuest = getActiveQuest();

  const handleModuleClick = (node: any) => {
    // Navigate to homepage terminal and trigger a command
    window.location.href = `/?cmd=explain ${node.data.label}`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex flex-col p-6 gap-6">
      {/* Top Bar: Stats */}
      <div className="flex justify-between items-start w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto bg-black/60 border border-tron-cyan/30 p-4 rounded-2xl backdrop-blur-xl flex gap-8 shadow-[0_0_30px_rgba(0,255,255,0.1)]"
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-tron-cyan/50 uppercase font-black tracking-widest mb-1 italic">Operator</span>
            <span className="text-2xl font-black text-white italic leading-none uppercase">Player One</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-tron-cyan/50 uppercase font-black tracking-widest mb-1 italic">Intelligence</span>
            <span className="text-2xl font-black text-tron-cyan italic leading-none uppercase">G3_FLASH_PREV</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-tron-cyan/50 uppercase font-black tracking-widest mb-1 italic">Credits</span>
            <span className="text-2xl font-black text-emerald-400 italic leading-none uppercase">${gold}_LOADED</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto bg-black/60 border border-tron-cyan/30 p-4 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.1)]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tron-cyan/20 flex items-center justify-center border border-tron-cyan/30">
              <Activity className="text-tron-cyan w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-tron-cyan/50 uppercase font-black tracking-widest">System Status</p>
              <p className="text-emerald-400 font-bold text-xs uppercase">Synchronized</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area: Sidebars */}
      <div className="flex-1 flex justify-between gap-6 overflow-hidden">
        {/* Left: Session History & Quests */}
        <div className="w-80 flex flex-col gap-6 overflow-hidden">
          {/* Active Quest */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto bg-black/60 border border-tron-cyan/30 p-5 rounded-[2rem] backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-tron-cyan w-4 h-4" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Active Protocol</h3>
            </div>
            {activeQuest ? (
              <div className="space-y-3">
                <p className="text-white font-bold text-sm uppercase italic tracking-tighter">{activeQuest.title}</p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-tron-cyan w-1/3 animate-pulse" />
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase font-bold">{activeQuest.description}</p>
              </div>
            ) : (
              <p className="text-[10px] text-white/20 italic uppercase font-bold">Scanning for objectives...</p>
            )}
          </motion.div>

          {/* Session History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 pointer-events-auto bg-black/60 border border-white/5 p-5 rounded-[2rem] backdrop-blur-xl overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <History className="text-white/40 w-4 h-4" />
              <h3 className="text-xs font-black text-white/40 uppercase tracking-widest">Session_History</h3>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
              {dmLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center opacity-10">
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] -rotate-90">No Data</span>
                </div>
              ) : (
                dmLogs.filter((log): log is string => log != null).map((log, index) => (
                  <div key={index} className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-mono text-white/60 leading-relaxed uppercase tracking-tight">
                    <span className="text-tron-cyan mr-2">»</span>
                    {log}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Right: Module Browser */}
        <div className="w-80 flex flex-col gap-6 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 pointer-events-auto bg-black/60 border border-white/5 p-5 rounded-[2rem] backdrop-blur-xl overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <Layers className="text-tron-cyan w-4 h-4" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Module_Registry</h3>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
              {nodes.filter((node): node is any => node != null).map((node) => (
                <div 
                  key={node.id} 
                  onClick={() => handleModuleClick(node)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group pointer-events-auto ${
                    node.data.status === 'completed' 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-white/5 border-white/5 hover:border-tron-cyan/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">{node.data.label}</span>
                    {node.data.status === 'completed' && <CheckCircle2 className="text-emerald-400 w-3 h-3" />}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-white/30 uppercase font-bold tracking-widest">{node.data.type || 'System'}</span>
                    <ChevronRight className="w-3 h-3 text-white/10 group-hover:text-tron-cyan transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pointer-events-auto bg-gradient-to-br from-tron-cyan/20 to-violet-500/20 border border-tron-cyan/30 p-4 rounded-3xl backdrop-blur-xl text-center"
          >
            <Link to="/academy" className="flex items-center justify-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] italic hover:gap-4 transition-all">
              Launch Global Academy
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
