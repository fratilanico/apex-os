'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMCPStore, type MCPServer } from '@/stores/useMCPStore';
import { Shield, Box, Power, PowerOff, Zap, Database, Globe, Sparkles } from 'lucide-react';

const ServerCard: React.FC<{ server: MCPServer }> = ({ server }) => {
  const { mountServer, unmountServer, isMounted } = useMCPStore();
  const mounted = isMounted(server.id);

  const toggleMount = () => {
    if (mounted) unmountServer(server.id);
    else mountServer(server.id);
  };

  const Icon = server.id === 'spanner-mcp' 
    ? Database 
    : server.id === 'browser-mcp' 
      ? Globe 
      : server.id === 'v0-mcp'
        ? Sparkles
        : Box;

  return (
    <motion.div 
      layout
      className={`p-4 rounded-xl border transition-all ${
        mounted 
          ? 'bg-cyan-500/5 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
          : 'bg-zinc-900 border-white/5 opacity-60'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
            mounted ? 'border-cyan-500/20 bg-zinc-950 text-cyan-400' : 'border-white/10 bg-zinc-950 text-white/20'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight">{server.name}</h4>
            <p className="text-[10px] font-mono text-white/20 uppercase">v{server.version} // {server.transport}</p>
          </div>
        </div>
        <button 
          onClick={toggleMount}
          className={`p-2 rounded-lg transition-all ${
            mounted ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          {mounted ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-2">
        {server.tools.map(tool => (
          <div key={tool.name} className="flex items-center gap-2 px-2 py-1.5 bg-black/40 rounded border border-white/5">
            <Zap className={`w-3 h-3 ${mounted ? 'text-cyan-400' : 'text-white/10'}`} />
            <span className={`text-[10px] font-mono ${mounted ? 'text-white/60' : 'text-white/20'}`}>{tool.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const MCPRegistryHUD: React.FC = () => {
  const { registry } = useMCPStore();

  return (
    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-xl h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">MCP Store Registry</h3>
        </div>
        <div className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] font-black text-cyan-400 uppercase">
          Toolbox Aggregator Active
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
        {registry.map(server => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="text-[10px] font-mono text-white/20 uppercase text-center leading-relaxed">
          Dynamic tool mounting enables autonomous agents to interact with host resources securely.
        </p>
      </div>
    </div>
  );
};
