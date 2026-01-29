'use client';

import React from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Handle, 
  Position, 
  NodeProps, 
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Brain, Activity } from 'lucide-react';
import { useMatrixStore } from '@/stores/useMatrixStore';
import 'reactflow/dist/style.css';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX MATRIX HUD v1.0.0 — The Neural Nebula Interface
// ═══════════════════════════════════════════════════════════════════════════════

// --- CUSTOM OASIS NODE ---
const OasisNode = ({ data, selected }: NodeProps) => {
  const Icon = Brain; // Default icon for now
  
  return (
    <div className="relative group">
      {/* Neural Glow Effect */}
      <div className={`absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-2xl opacity-0 transition-opacity duration-500 ${selected ? 'opacity-100' : 'group-hover:opacity-50'}`} />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`
          relative px-5 py-4 rounded-2xl border-2 font-mono min-w-[220px] backdrop-blur-xl transition-all duration-300
          ${selected 
            ? 'border-[#D946EF] bg-[#D946EF]/5 shadow-[0_0_30px_rgba(217,70,239,0.2)]' 
            : 'border-white/10 bg-zinc-900/80 group-hover:border-white/20'}
          ${data.status === 'completed' ? 'border-emerald-500/40 bg-emerald-500/5' : ''}
          ${data.status === 'locked' ? 'opacity-40 grayscale grayscale-opacity-100' : ''}
        `}
      >
        {/* Singularity Pulse Indicator */}
        {selected && (
          <div className="absolute -top-8 left-0 flex items-center gap-2 text-[#22D3EE] text-[10px] font-bold tracking-[0.2em] uppercase">
            <motion.div
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap size={12} className="fill-current" />
            </motion.div>
            Location: Neural_Node_${data.id || '00'}
          </div>
        )}

        {/* Node Content */}
        <div className="flex items-center gap-4 mb-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center transition-colors
            ${selected ? 'bg-[#D946EF]/20 text-[#D946EF]' : 'bg-white/5 text-white/40'}
            ${data.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : ''}
          `}>
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <span className="text-white text-xs font-black tracking-widest uppercase block mb-0.5">
              {data.label}
            </span>
            <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">
              {data.type || 'SYSTEM_MODULE'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[9px] font-bold tracking-tighter">
            <span className="text-white/20 uppercase">Sync State:</span>
            <span className={`
              ${selected ? 'text-[#D946EF]' : 'text-white/40'}
              ${data.status === 'completed' ? 'text-emerald-400' : ''}
              ${data.status === 'active' ? 'text-cyan-400' : ''}
            `}>
              {data.status?.toUpperCase() || 'READY'}
            </span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${data.progress || 0}%` }}
              className={`h-full ${selected ? 'bg-[#D946EF]' : data.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500/40'}`} 
            />
          </div>
        </div>

        {/* Handles */}
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#6366F1] !border-4 !border-zinc-900 !-left-1.5" />
        <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-[#22D3EE] !border-4 !border-zinc-900 !-right-1.5" />
        
        {/* Scanning Line Animation */}
        {selected && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D946EF]/10 to-transparent h-1 w-full z-10 pointer-events-none"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.div>
    </div>
  );
};

const nodeTypes = {
  oasis: OasisNode
};

export const ApexMatrixHUD: React.FC = () => {
  const { nodes: storeNodes, edges: storeEdges, lastTransmission, traceLevel } = useMatrixStore();

  const [nodes, , onNodesChange] = useNodesState(storeNodes);
  const [edges, , onEdgesChange] = useEdgesState(storeEdges);

  return (
    <div className="w-full h-full relative">
      {/* Background Neural Nebula Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[200px]" />
      </div>

      {/* Header Info */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none flex flex-col gap-1">
        <h2 className="text-white font-black text-2xl tracking-tighter italic uppercase flex items-center gap-3">
          <Sparkles className="text-cyan-400 animate-pulse" />
          Apex_Learning_Matrix
        </h2>
        <div className="flex items-center gap-4 text-[9px] font-mono text-white/40 uppercase tracking-widest">
          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-cyan-400" /> Mode: Dynamic_Hybrid</span>
          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-[#D946EF]" /> State: Sovereign_Dominance</span>
          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-red-500" /> Trace: {traceLevel}%</span>
        </div>
      </div>

      {/* Director Transmission Overlay */}
      <div className="absolute top-6 right-6 z-20 w-72 p-4 rounded-xl bg-black/60 border border-white/5 backdrop-blur-xl pointer-events-none">
        <p className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <Activity size={12} /> Director_Transmission
        </p>
        <p className="text-[11px] text-white/80 font-mono leading-relaxed">
          {lastTransmission}
        </p>
      </div>

      {/* React Flow Graph */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="z-10"
      >
        <Background 
          color="#ffffff" 
          gap={40} 
          size={1} 
          className="opacity-[0.03]" 
        />
        <Controls 
          className="!bg-zinc-900/80 !border-white/5 !fill-cyan-400 !shadow-none !rounded-xl overflow-hidden backdrop-blur-xl" 
          showInteractive={true} 
        />
      </ReactFlow>

      {/* Footer Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl pointer-events-none">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
          <Brain size={12} className="text-purple-400" />
          Navigate the matrix to unlock sovereign potential
        </p>
      </div>
    </div>
  );
};
