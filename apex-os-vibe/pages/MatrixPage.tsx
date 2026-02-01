// APEX OS Vibe - Matrix Page
// Second Brain + Agent Swarm Integration
// Layout: Split-pane (desktop) + Tabs (mobile)
// Golden Rule: Mobile-First, Performance-Optimized, Dark Theme

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Bot, Sparkles, Cpu, Grid3X3 } from 'lucide-react';
import { SecondBrainPanel } from '../components/matrix/SecondBrainPanel';
import { AgentSwarmPanel } from '../components/matrix/AgentSwarmPanel';
import { GlobalTerminal } from '../components/matrix/GlobalTerminal';
import { useMatrixWebSocket } from '../hooks/useMatrixWebSocket';
import { AGENTS } from '../lib/agents/config';

// Generate mock memories for demo
const generateMockMemories = () => [
  {
    id: '1',
    type: 'file' as const,
    title: 'auth-middleware.ts',
    content: 'JWT authentication middleware with refresh token rotation',
    timestamp: new Date().toISOString(),
    connections: 5,
    metadata: { fileType: 'typescript', moduleId: 'backend', tags: ['auth', 'security'] },
  },
  {
    id: '2',
    type: 'agent_output' as const,
    title: 'API Design: User Service',
    content: 'RESTful API endpoints for user management with CRUD operations',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    connections: 3,
    metadata: { agentId: 'backend-agent', moduleId: 'backend', tags: ['api', 'design'] },
  },
  {
    id: '3',
    type: 'conversation' as const,
    title: 'Architecture Discussion',
    content: 'Discussion about microservices vs monolith architecture',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    connections: 8,
    metadata: { moduleId: 'advanced', tags: ['architecture', 'patterns'] },
  },
  {
    id: '4',
    type: 'concept' as const,
    title: 'JWT Authentication Pattern',
    content: 'Stateless authentication using JSON Web Tokens',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    connections: 12,
    metadata: { tags: ['auth', 'jwt', 'security'] },
  },
  {
    id: '5',
    type: 'code' as const,
    title: 'React Hook: useAuth',
    content: 'Custom hook for authentication state management',
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    connections: 6,
    metadata: { fileType: 'typescript', moduleId: 'frontend', tags: ['react', 'hooks'] },
  },
];

// Generate mock agents from config
const generateMockAgents = () =>
  AGENTS.map((agent) => ({
    ...agent,
    status: Math.random() > 0.3 ? ('online' as const) : Math.random() > 0.5 ? ('busy' as const) : ('offline' as const),
  }));

const MatrixPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'brain' | 'swarm'>('brain');
  const [memories, setMemories] = useState(generateMockMemories());
  const [agents, setAgents] = useState(generateMockAgents());
  const [isConnected, setIsConnected] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          status:
            Math.random() > 0.8
              ? agent.status === 'online'
                ? 'busy'
                : 'online'
              : agent.status,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-[#030303] text-white overflow-hidden">
      {/* Desktop: Split Pane */}
      <div className="hidden md:flex h-full">
        {/* Second Brain - Left Panel */}
        <div className="w-1/2 border-r border-white/10">
          <SecondBrainPanel
            memories={memories}
            isConnected={isConnected}
            onSearch={(query) => console.log('Searching:', query)}
          />
        </div>

        {/* Agent Swarm - Right Panel */}
        <div className="w-1/2">
          <AgentSwarmPanel
            agents={agents}
            isConnected={isConnected}
            isReconnecting={false}
            onInvokeAgent={(agentId) => console.log('Invoking:', agentId)}
          />
        </div>
      </div>

      {/* Mobile: Tabbed View */}
      <div className="md:hidden h-full flex flex-col">
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeView === 'brain' ? (
              <motion.div
                key="brain"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <SecondBrainPanel
                  memories={memories}
                  isConnected={isConnected}
                  onSearch={(query) => console.log('Searching:', query)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="swarm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <AgentSwarmPanel
                  agents={agents}
                  isConnected={isConnected}
                  isReconnecting={false}
                  onInvokeAgent={(agentId) => console.log('Invoking:', agentId)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Tab Bar */}
        <div className="bg-[#030303] border-t border-white/10 px-4 py-2">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveView('brain')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                activeView === 'brain' ? 'text-cyan-400' : 'text-white/40'
              }`}
            >
              <Brain className="w-5 h-5" />
              <span className="text-[10px] font-mono">BRAIN</span>
            </button>

            <button
              onClick={() => setActiveView('swarm')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                activeView === 'swarm' ? 'text-violet-400' : 'text-white/40'
              }`}
            >
              <Bot className="w-5 h-5" />
              <span className="text-[10px] font-mono">SWARM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Terminal */}
      <GlobalTerminal />

      {/* Phase 2 Placeholders */}
      <div className="fixed top-4 right-4 z-30 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 flex items-center gap-1 font-mono">
          <Sparkles className="w-3 h-3" />
          PHASE_2: D3_VIZ
        </div>
        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 flex items-center gap-1 font-mono">
          <Cpu className="w-3 h-3" />
          VECTOR_SEARCH
        </div>
      </div>
    </div>
  );
};

export default MatrixPage;
