// APEX OS Vibe - Agent Swarm Panel
// Hybrid terminal cards matching vibe-portfolio aesthetic
// Preserving the SOUL of the design

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap, Wifi, WifiOff, Terminal } from 'lucide-react';
import { soul, getStatusColor } from '../../lib/theme';

export interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  module: string;
  credits: number;
  capabilities: string[];
  description?: string;
}

interface AgentSwarmPanelProps {
  agents: Agent[];
  isConnected: boolean;
  isReconnecting: boolean;
  onInvokeAgent?: (agentId: string) => void;
}

export const AgentSwarmPanel: React.FC<AgentSwarmPanelProps> = ({
  agents,
  isConnected,
  isReconnecting,
  onInvokeAgent,
}) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = ['Foundation', 'Frontend', 'Backend', 'DevOps', 'AI', 'Specialized'];

  const filteredAgents = selectedModule
    ? agents.filter((a) => a.module === selectedModule)
    : agents;

  const activeAgents = agents.filter((a) => a.status === 'online').length;

  return (
    <div className="h-full flex flex-col bg-[#030303]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#030303]/95 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Agent Swarm</h2>
              <p className="text-xs text-white/40 font-mono">
                {activeAgents}/{agents.length} agents active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isReconnecting && (
              <span className="text-xs text-amber-400 font-mono">RECONNECTING...</span>
            )}
            {isConnected ? (
              <Wifi className="w-4 h-4 text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-rose-400" />
            )}
          </div>
        </div>

        {/* Module Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedModule(null)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border font-mono
              ${
                !selectedModule
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/50'
                  : 'bg-white/5 text-white/60 border-white/10'
              }`}
          >
            ALL
          </button>
          {modules.map((module) => (
            <button
              key={module}
              onClick={() => setSelectedModule(selectedModule === module ? null : module)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border font-mono
                ${
                  selectedModule === module
                    ? 'bg-violet-500/20 text-violet-400 border-violet-500/50'
                    : 'bg-white/5 text-white/60 border-white/10'
                }`}
            >
              {module.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent, index) => {
              const status = getStatusColor(agent.status);
              return (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onInvokeAgent?.(agent.id)}
                  className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4
                             hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer group"
                >
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-rose-400/80" />
                        <div className="w-2 h-2 rounded-full bg-amber-400/80" />
                        <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                      </div>
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                        {agent.module.toLowerCase()}.{agent.id.split('-')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${status.bg} ${
                          agent.status === 'online' ? 'animate-pulse' : ''
                        }`}
                      />
                      <span className={`text-[10px] font-mono ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-white group-hover:text-violet-400 transition-colors">
                        {agent.name}
                      </h3>

                      {agent.description && (
                        <p className="text-xs text-white/60 mt-1 line-clamp-2 font-mono">
                          {agent.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {agent.capabilities?.slice(0, 3).map((cap) => (
                          <span
                            key={cap}
                            className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-white/50 border border-white/10 font-mono"
                          >
                            --{cap}
                          </span>
                        ))}
                        {agent.capabilities?.length > 3 && (
                          <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-white/50 border border-white/10 font-mono">
                            +{agent.capabilities.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-xs text-white/60 font-mono">
                        <Zap className="w-3 h-3" />
                        {agent.credits}cr
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1 text-[10px] text-violet-400 font-mono">
                          <Terminal className="w-3 h-3" />
                          INVOKE
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AgentSwarmPanel;
