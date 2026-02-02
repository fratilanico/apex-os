// APEX OS - Matrix Page
// Second Brain + Agent Swarm Integration
// Layout: Split-pane (Brain left, Swarm right)
// Golden Rule: Mobile-First, Performance-Optimized, Dark Theme

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Bot, 
  Terminal, 
  Activity, 
  Zap,
  Search,
  X,
  Grid3X3,
  Sparkles,
  Cpu
} from 'lucide-react';
import { useMatrixWebSocket, Agent, MemoryNode } from '../hooks/useMatrixWebSocket';
import { memoryTypeColor, statusColor } from '../lib/theme';

// Second Brain Panel Component
const SecondBrainPanel: React.FC = () => {
  const { memories, totalMemories, searchMemories } = useMatrixWebSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredMemories = memories.filter(m => {
    const matchesSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || m.type === selectedType;
    return matchesSearch && matchesType;
  });

  const memoryTypes = ['file', 'agent_output', 'conversation', 'concept', 'code'];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Second Brain</h2>
            <p className="text-xs text-white/40">{totalMemories} memories indexed</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchMemories(e.target.value);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 
                       text-sm text-white placeholder-white/40
                       focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border
              ${!selectedType 
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' 
                : 'bg-white/5 text-white/60 border-white/10'}`}
          >
            All
          </button>
          {memoryTypes.map(type => {
            const colors = memoryTypeColor(type);
            return (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border
                  ${selectedType === type 
                    ? `${colors.bg} ${colors.text} ${colors.border}` 
                    : 'bg-white/5 text-white/60 border-white/10'}`}
              >
                {type.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Memory List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredMemories.map((memory) => (
            <motion.div
              key={memory.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4 
                         hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                  ${memoryTypeColor(memory.type).bg} ${memoryTypeColor(memory.type).text}`}
                >
                  {memory.type === 'file' && '📄'}
                  {memory.type === 'agent_output' && '🤖'}
                  {memory.type === 'conversation' && '💬'}
                  {memory.type === 'concept' && '💡'}
                  {memory.type === 'code' && '💻'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{memory.title}</h3>
                  <p className="text-xs text-white/60 mt-1 line-clamp-2">{memory.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-white/40">
                    <span>{new Date(memory.timestamp).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {memory.connections} connections
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredMemories.length === 0 && (
          <div className="text-center py-12 text-white/40">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No memories found</p>
            <p className="text-xs mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Agent Swarm Panel Component
const AgentSwarmPanel: React.FC = () => {
  const { agents, activeAgents, isConnected, isReconnecting, invokeAgent } = useMatrixWebSocket();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = ['Foundation', 'Frontend', 'Backend', 'DevOps', 'AI', 'Specialized'];
  
  const filteredAgents = selectedModule 
    ? agents.filter(a => a.module === selectedModule)
    : agents;

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Agent Swarm</h2>
              <p className="text-xs text-white/40">{activeAgents} active agents</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isReconnecting && (
              <span className="text-xs text-amber-400">Reconnecting...</span>
            )}
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
          </div>
        </div>

        {/* Module Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedModule(null)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border
              ${!selectedModule 
                ? 'bg-violet-500/20 text-violet-400 border-violet-500/50' 
                : 'bg-white/5 text-white/60 border-white/10'}`}
          >
            All
          </button>
          {modules.map(module => (
            <button
              key={module}
              onClick={() => setSelectedModule(module)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border
                ${selectedModule === module 
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/50' 
                  : 'bg-white/5 text-white/60 border-white/10'}`}
            >
              {module}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent) => {
              const status = statusColor(agent.status);
              return (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => invokeAgent(agent.id, 'Hello', {})}
                  className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4
                             hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${status.bg} ${agent.status === 'online' ? 'animate-pulse' : ''}`} />
                      <div>
                        <h3 className="font-bold text-sm text-white">{agent.name}</h3>
                        <p className="text-xs text-white/40">{agent.module}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <Zap className="w-3 h-3" />
                      {agent.credits}cr
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {agent.capabilities?.slice(0, 3).map(cap => (
                      <span key={cap} className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-white/50 border border-white/10">
                        {cap}
                      </span>
                    ))}
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

// Global Terminal Component
const GlobalTerminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([
    'APEX OS v1.0.0 - Agent Swarm & Second Brain Active',
    'Type "help" for available commands',
  ]);

  const handleCommand = () => {
    if (!command.trim()) return;
    
    setHistory(prev => [...prev, `$ ${command}`]);
    
    // Mock command responses
    switch (command.toLowerCase()) {
      case 'help':
        setHistory(prev => [...prev, 
          'Available commands:',
          '  swarm status  - Show agent swarm status',
          '  brain stats   - Show second brain statistics',
          '  agents list   - List all available agents',
          '  clear         - Clear terminal',
        ]);
        break;
      case 'swarm status':
        setHistory(prev => [...prev, '19 agents online • 1,247 memories indexed']);
        break;
      case 'brain stats':
        setHistory(prev => [...prev, 'Total memories: 1,247 • Connections: 3,892']);
        break;
      case 'clear':
        setHistory([]);
        break;
      default:
        setHistory(prev => [...prev, `Command not found: ${command}`]);
    }
    
    setCommand('');
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-500/50
                   flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20"
      >
        <Terminal className="w-6 h-6" />
      </motion.button>

      {/* Terminal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0f] border-t border-cyan-500/30 h-80 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">Matrix Terminal</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            
            {/* Output */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
              {history.map((line, i) => (
                <div key={i} className={line.startsWith('$') ? 'text-cyan-400' : 'text-white/70'}>
                  {line}
                </div>
              ))}
              <div className="flex items-center gap-2 text-cyan-400">
                <span>$</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                  className="flex-1 bg-transparent outline-none text-white"
                  placeholder="Type command..."
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Main Matrix Page
const MatrixPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'brain' | 'swarm'>('brain');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Desktop: Split Pane */}
      <div className="hidden md:flex h-full">
        <div className="w-1/2 border-r border-white/10">
          <SecondBrainPanel />
        </div>
        <div className="w-1/2">
          <AgentSwarmPanel />
        </div>
      </div>

      {/* Mobile: Tabbed View */}
      <div className="md:hidden h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeView === 'brain' ? (
              <motion.div
                key="brain"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <SecondBrainPanel />
              </motion.div>
            ) : (
              <motion.div
                key="swarm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                <AgentSwarmPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Tab Bar */}
        <div className="bg-[#0a0a0f] border-t border-white/10 px-4 py-2">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveView('brain')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                ${activeView === 'brain' ? 'text-cyan-400' : 'text-white/40'}`}
            >
              <Brain className="w-5 h-5" />
              <span className="text-[10px]">Brain</span>
            </button>

            <button
              onClick={() => setActiveView('swarm')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                ${activeView === 'swarm' ? 'text-violet-400' : 'text-white/40'}`}
            >
              <Bot className="w-5 h-5" />
              <span className="text-[10px]">Swarm</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Terminal */}
      <GlobalTerminal />

      {/* Phase 2 Placeholders */}
      <div className="fixed top-4 right-4 z-30 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Phase 2: D3 Viz
        </div>
        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 flex items-center gap-1">
          <Cpu className="w-3 h-3" />
          Vector Search
        </div>
      </div>
    </div>
  );
};

export default MatrixPage;
