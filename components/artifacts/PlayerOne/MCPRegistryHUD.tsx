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

  const getIcon = () => {
    switch (server.id) {
      case 'spanner-mcp': return Database;
      case 'browser-mcp': return Globe;
      case 'v0-mcp': return Sparkles;
      default: return Box;
    }
  };
  const Icon = getIcon();

  return (
    <motion.div 
      layout
      className={`p-3 sm:p-4 rounded-xl border transition-all ${
        mounted 
          ? 'bg-cyan-500/5 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
          : 'bg-zinc-900 border-white/5 opacity-60'
      }`}
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center border flex-shrink-0 ${
            mounted ? 'border-cyan-500/20 bg-zinc-950 text-cyan-400' : 'border-white/10 bg-zinc-950 text-white/20'
          }`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight truncate">{server.name}</h4>
            <p className="text-[9px] sm:text-[10px] font-mono text-white/20 uppercase">v{server.version} // {server.transport}</p>
          </div>
        </div>
        <button 
          onClick={toggleMount}
          className={`p-3 min-w-[44px] min-h-[44px] rounded-lg transition-all pointer-events-auto touch-manipulation ${
            mounted ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/40 hover:bg-white/10'
          }`}
          style={{ touchAction: 'manipulation' }}
          aria-label={mounted ? 'Unmount server' : 'Mount server'}
        >
          {mounted ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        {server.tools.map(tool => (
          <div key={tool.name} className="flex items-center gap-2 px-2 py-1 sm:py-1.5 bg-black/40 rounded border border-white/5">
            <Zap className={`w-3 h-3 flex-shrink-0 ${mounted ? 'text-cyan-400' : 'text-white/10'}`} />
            <span className={`text-[9px] sm:text-[10px] font-mono truncate ${mounted ? 'text-white/60' : 'text-white/20'}`}>{tool.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const MCPRegistryHUD: React.FC = () => {
  const { registry } = useMCPStore();

  return (
    <div className="p-4 sm:p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-xl h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest truncate">MCP Store Registry</h3>
        </div>
        <div className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] font-black text-cyan-400 uppercase flex-shrink-0">
          Toolbox Active
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 sm:space-y-4 pr-1 sm:pr-2">
        {registry.map(server => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
        <p className="text-[9px] sm:text-[10px] font-mono text-white/20 uppercase text-center leading-relaxed">
          Dynamic tool mounting enables autonomous agents to interact with host resources securely.
        </p>
      </div>
    </div>
  );
};
