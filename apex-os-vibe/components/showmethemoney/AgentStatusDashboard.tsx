import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Activity,
  Zap,
  Server,
  Shield,
  DollarSign,
  ClipboardCheck,
  Gauge,
  Database,
  BookOpen,
  FileCode,
  Code,
  Users,
  Award,
  Wrench,
  Heart,
  BarChart,
  Puzzle,
  Eye,
  Languages,
  Radio,
  Terminal,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  Play,
  Square,
} from 'lucide-react';
import { useAgentSwarm, Agent, AgentTask } from '../../../hooks/useAgentSwarm';

// Agent Icon Mapping
const AGENT_ICONS: Record<string, React.ElementType> = {
  orchestrator: Radio,
  'deployment-automation': Server,
  'security-monitor': Shield,
  'cost-optimizer': DollarSign,
  'testing-qa': ClipboardCheck,
  'performance-monitor': Gauge,
  'infrastructure-manager': Database,
  'curriculum-architect': BookOpen,
  'content-creator': FileCode,
  'code-reviewer': Code,
  'mentor-guide': Users,
  'project-evaluator': Award,
  'tooling-specialist': Wrench,
  'community-manager': Heart,
  'assessment-designer': ClipboardCheck,
  'learning-analyst': BarChart,
  'integration-specialist': Puzzle,
  'accessibility-auditor': Eye,
  'localization-manager': Languages,
};

// Status Badge Component
const StatusBadge: React.FC<{ status: Agent['status']; mcpConnected: boolean }> = ({ status, mcpConnected }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return { 
          color: 'bg-emerald-500', 
          text: 'text-emerald-400', 
          label: 'ONLINE',
          icon: CheckCircle,
          pulse: true 
        };
      case 'busy':
        return { 
          color: 'bg-amber-500', 
          text: 'text-amber-400', 
          label: 'BUSY',
          icon: Clock,
          pulse: true 
        };
      case 'error':
        return { 
          color: 'bg-rose-500', 
          text: 'text-rose-400', 
          label: 'ERROR',
          icon: AlertCircle,
          pulse: false 
        };
      case 'connecting':
        return { 
          color: 'bg-cyan-500', 
          text: 'text-cyan-400', 
          label: 'CONNECTING',
          icon: RefreshCw,
          pulse: true 
        };
      default:
        return { 
          color: 'bg-white/20', 
          text: 'text-white/40', 
          label: 'OFFLINE',
          icon: WifiOff,
          pulse: false 
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.color}/10 border border-${config.color}/30`}>
      <Icon className={`w-3 h-3 ${config.text} ${config.pulse ? 'animate-pulse' : ''}`} />
      <span className={`text-[10px] font-bold ${config.text}`}>{config.label}</span>
      {mcpConnected && (
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-1" title="MCP Connected" />
      )}
    </div>
  );
};

// Agent Card Component
const AgentCard: React.FC<{ 
  agent: Agent; 
  onInvoke: (agentId: string) => void;
  isInvoking: boolean;
}> = ({ agent, onInvoke, isInvoking }) => {
  const Icon = AGENT_ICONS[agent.id] || Bot;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4 
                  hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer
                  ${agent.status === 'busy' ? 'border-amber-500/30' : ''}
                  ${agent.status === 'error' ? 'border-rose-500/30' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center
            ${agent.type === 'orchestrator' ? 'bg-cyan-500/20 text-cyan-400' :
              agent.type === 'devops' ? 'bg-violet-500/20 text-violet-400' :
              agent.type === 'curriculum' ? 'bg-emerald-500/20 text-emerald-400' :
              'bg-white/10 text-white/60'}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{agent.name}</h3>
            <p className="text-xs text-white/40">{agent.module}</p>
          </div>
        </div>
        <StatusBadge status={agent.status} mcpConnected={agent.mcpConnected} />
      </div>

      {/* Capabilities */}
      <div className="flex flex-wrap gap-1 mb-3">
        {agent.capabilities.slice(0, 3).map(cap => (
          <span key={cap} className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-white/50 border border-white/10">
            {cap}
          </span>
        ))}
        {agent.capabilities.length > 3 && (
          <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-white/30">
            +{agent.capabilities.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Zap className="w-3 h-3" />
          <span>{agent.credits}cr</span>
        </div>
        
        <button
          onClick={() => onInvoke(agent.id)}
          disabled={agent.status !== 'online' || isInvoking}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
            ${agent.status === 'online' 
              ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/50' 
              : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'}`}
        >
          {isInvoking ? '...' : 'Invoke'}
        </button>
      </div>

      {/* Task Indicator */}
      {agent.taskStatus === 'running' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 animate-pulse" />
      )}
    </motion.div>
  );
};

// Task Log Component
const TaskLog: React.FC<{ tasks: AgentTask[] }> = ({ tasks }) => {
  return (
    <div className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="w-4 h-4 text-cyan-400" />
        <h3 className="font-bold text-sm text-white">Task Log</h3>
        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/60">
          {tasks.length} tasks
        </span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {tasks.slice(-10).reverse().map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-xl border text-xs
                ${task.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30' :
                  task.status === 'failed' ? 'bg-rose-500/10 border-rose-500/30' :
                  task.status === 'running' ? 'bg-amber-500/10 border-amber-500/30' :
                  'bg-white/5 border-white/10'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-white/60">{task.agentId}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold
                  ${task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    task.status === 'failed' ? 'bg-rose-500/20 text-rose-400' :
                    task.status === 'running' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-white/10 text-white/40'}`}
                >
                  {task.status.toUpperCase()}
                </span>
              </div>
              <p className="text-white/80 truncate">{task.prompt}</p>
              {task.error && (
                <p className="text-rose-400 text-[10px] mt-1">{task.error}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-white/30 text-xs">
            No tasks yet. Invoke an agent to begin.
          </div>
        )}
      </div>
    </div>
  );
};

// Main Agent Status Dashboard
export const AgentStatusDashboard: React.FC = () => {
  const {
    agents,
    tasks,
    isConnected,
    isConnecting,
    activeAgents,
    totalAgents,
    onlineAgents,
    busyAgents,
    errorAgents,
    mcpStatus,
    lastUpdate,
    invokeAgent,
    checkMCPHealth,
  } = useAgentSwarm();

  const [selectedType, setSelectedType] = useState<Agent['type'] | 'all'>('all');
  const [invokingAgent, setInvokingAgent] = useState<string | null>(null);
  const [showTaskLog, setShowTaskLog] = useState(false);

  const filteredAgents = selectedType === 'all' 
    ? agents 
    : agents.filter(a => a.type === selectedType);

  const handleInvoke = async (agentId: string) => {
    setInvokingAgent(agentId);
    await invokeAgent(agentId, 'Status check and system diagnostics');
    setInvokingAgent(null);
  };

  // Group agents by type
  const orchestratorAgents = filteredAgents.filter(a => a.type === 'orchestrator');
  const devopsAgents = filteredAgents.filter(a => a.type === 'devops');
  const curriculumAgents = filteredAgents.filter(a => a.type === 'curriculum');

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center border border-cyan-500/30">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Agent Swarm</h1>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span>{mcpStatus === 'connected' ? 'MCP Connected' : mcpStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}</span>
                <span className="text-white/20">•</span>
                <span>{onlineAgents}/{totalAgents} online</span>
                {busyAgents > 0 && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="text-amber-400">{busyAgents} busy</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTaskLog(!showTaskLog)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border
                ${showTaskLog 
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
            >
              <Terminal className="w-4 h-4" />
            </button>
            
            <button
              onClick={checkMCPHealth}
              disabled={isConnecting}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isConnecting ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'all', label: 'All Agents', count: totalAgents },
            { id: 'orchestrator', label: 'Orchestrator', count: agents.filter(a => a.type === 'orchestrator').length },
            { id: 'devops', label: 'DevOps', count: agents.filter(a => a.type === 'devops').length },
            { id: 'curriculum', label: 'Curriculum', count: agents.filter(a => a.type === 'curriculum').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id as Agent['type'] | 'all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                ${selectedType === tab.id 
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
            >
              {tab.label}
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/10 text-white/40 text-[10px]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        <div className={`flex-1 overflow-y-auto p-4 transition-all ${showTaskLog ? 'md:w-2/3' : 'w-full'}`}>
          <div className="space-y-6">
            {/* Orchestrator Section */}
            {(selectedType === 'all' || selectedType === 'orchestrator') && orchestratorAgents.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white/80">Orchestrator</h2>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px]">
                    {orchestratorAgents.filter(a => a.status === 'online').length} online
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {orchestratorAgents.map(agent => (
                      <AgentCard
                        key={agent.id}
                        agent={agent}
                        onInvoke={handleInvoke}
                        isInvoking={invokingAgent === agent.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* DevOps Section */}
            {(selectedType === 'all' || selectedType === 'devops') && devopsAgents.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Server className="w-4 h-4 text-violet-400" />
                  <h2 className="text-sm font-bold text-white/80">DevOps Agents</h2>
                  <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-[10px]">
                    {devopsAgents.filter(a => a.status === 'online').length} online
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {devopsAgents.map(agent => (
                      <AgentCard
                        key={agent.id}
                        agent={agent}
                        onInvoke={handleInvoke}
                        isInvoking={invokingAgent === agent.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* Curriculum Section */}
            {(selectedType === 'all' || selectedType === 'curriculum') && curriculumAgents.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white/80">Curriculum Agents</h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">
                    {curriculumAgents.filter(a => a.status === 'online').length} online
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {curriculumAgents.map(agent => (
                      <AgentCard
                        key={agent.id}
                        agent={agent}
                        onInvoke={handleInvoke}
                        isInvoking={invokingAgent === agent.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Task Log Sidebar */}
        <AnimatePresence>
          {showTaskLog && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden md:block w-80 border-l border-white/10 bg-[#0a0a0f]/50"
            >
              <div className="p-4 h-full overflow-y-auto">
                <TaskLog tasks={tasks} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Task Log */}
      <AnimatePresence>
        {showTaskLog && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="md:hidden fixed bottom-0 left-0 right-0 h-96 bg-[#0a0a0f] border-t border-white/10 z-50"
          >
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Task Log</h3>
                <button onClick={() => setShowTaskLog(false)} className="p-2">
                  <span className="text-white/60">Close</span>
                </button>
              </div>
              <TaskLog tasks={tasks} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last Update Footer */}
      <div className="border-t border-white/10 p-3 bg-[#0a0a0f]/50">
        <div className="flex items-center justify-between text-[10px] text-white/30">
          <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
          <span>APEX OS Agent Swarm v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default AgentStatusDashboard;
