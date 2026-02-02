import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown,
  Brain,
  Terminal,
  Shield,
  Zap,
  Activity,
  Users,
  Server,
  Cpu,
  Network,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Target,
  Code,
  Database,
  Cloud,
  Lock,
  Settings,
  MessageSquare,
  Eye,
  FileCode,
  TestTube,
  Rocket,
  Monitor,
  Layers,
  GitBranch,
  Workflow
} from 'lucide-react';

// Agent Status Types
type AgentStatus = 'active' | 'idle' | 'busy' | 'syncing' | 'error';
type AgentLevel = 'founder' | 'executive' | 'operational' | 'devops' | 'specialist';

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  status: AgentStatus;
  level: AgentLevel;
  capabilities: string[];
  lastAction?: string;
  metrics?: {
    tasksCompleted: number;
    successRate: number;
    responseTime: string;
  };
  children?: Agent[];
}

// Agent Hierarchy Data
const agentHierarchy: Agent = {
  id: 'founder',
  name: 'APEX OS MONSTER',
  role: 'Founder & Chief Orchestrator',
  icon: <Crown className="w-8 h-8" />,
  status: 'active',
  level: 'founder',
  capabilities: ['Strategic Vision', 'Multi-Agent Coordination', 'System Architecture', 'Decision Authority'],
  lastAction: 'Coordinating 12 active agents across 4 forks',
  metrics: {
    tasksCompleted: 2847,
    successRate: 99.2,
    responseTime: '< 50ms'
  },
  children: [
    {
      id: 'executive-jarvis',
      name: 'J.A.R.V.I.S.',
      role: 'Executive AI Director',
      icon: <Brain className="w-6 h-6" />,
      status: 'active',
      level: 'executive',
      capabilities: ['Model Management', 'Voice Control', 'Agent Synchronization', 'Strategic Planning'],
      lastAction: 'Managing 4 specialist models',
      metrics: {
        tasksCompleted: 1563,
        successRate: 98.7,
        responseTime: '< 100ms'
      },
      children: [
        {
          id: 'model-qwen',
          name: 'QWEN',
          role: 'Code Specialist',
          icon: <Code className="w-5 h-5" />,
          status: 'active',
          level: 'specialist',
          capabilities: ['Code Generation', 'Code Review', 'Refactoring', 'Architecture'],
          lastAction: 'Optimizing React components',
          metrics: {
            tasksCompleted: 892,
            successRate: 97.5,
            responseTime: '< 200ms'
          }
        },
        {
          id: 'model-deepseek',
          name: 'DEEPSEEK',
          role: 'Analysis Specialist',
          icon: <Target className="w-5 h-5" />,
          status: 'active',
          level: 'specialist',
          capabilities: ['Data Analysis', 'Pattern Recognition', 'Predictive Modeling', 'Insights'],
          lastAction: 'Analyzing performance metrics',
          metrics: {
            tasksCompleted: 743,
            successRate: 96.8,
            responseTime: '< 250ms'
          }
        },
        {
          id: 'model-llama',
          name: 'LLAMA',
          role: 'Creative Specialist',
          icon: <Zap className="w-5 h-5" />,
          status: 'active',
          level: 'specialist',
          capabilities: ['Content Creation', 'UX Writing', 'Documentation', 'Ideation'],
          lastAction: 'Generating pitch deck content',
          metrics: {
            tasksCompleted: 621,
            successRate: 98.2,
            responseTime: '< 180ms'
          }
        },
        {
          id: 'model-phi3',
          name: 'PHI-3',
          role: 'Logic Specialist',
          icon: <Activity className="w-5 h-5" />,
          status: 'active',
          level: 'specialist',
          capabilities: ['Logic Validation', 'Testing', 'Debugging', 'Quality Assurance'],
          lastAction: 'Running test suite validation',
          metrics: {
            tasksCompleted: 1054,
            successRate: 99.1,
            responseTime: '< 150ms'
          }
        }
      ]
    },
    {
      id: 'executive-cli',
      name: 'CLI Builder',
      role: 'Executive Operations',
      icon: <Terminal className="w-6 h-6" />,
      status: 'busy',
      level: 'executive',
      capabilities: ['Code Generation', 'Build Orchestration', 'Deployment', 'Automation'],
      lastAction: 'Building production deployment',
      metrics: {
        tasksCompleted: 2134,
        successRate: 98.9,
        responseTime: '< 75ms'
      },
      children: [
        {
          id: 'devops-orchestrator',
          name: 'Orchestrator',
          role: 'DevOps Lead',
          icon: <Workflow className="w-5 h-5" />,
          status: 'active',
          level: 'devops',
          capabilities: ['Task Delegation', 'Workflow Management', 'Resource Allocation'],
          lastAction: 'Delegating tasks to agent swarm',
          metrics: {
            tasksCompleted: 1876,
            successRate: 99.5,
            responseTime: '< 50ms'
          }
        },
        {
          id: 'devops-infra',
          name: 'Infrastructure Architect',
          role: 'Cloud & Infrastructure',
          icon: <Cloud className="w-5 h-5" />,
          status: 'active',
          level: 'devops',
          capabilities: ['Terraform', 'Cloud Architecture', 'Scalability', 'Cost Optimization'],
          lastAction: 'Optimizing Vercel deployment',
          metrics: {
            tasksCompleted: 945,
            successRate: 98.2,
            responseTime: '< 120ms'
          }
        },
        {
          id: 'devops-security',
          name: 'Security Monitor',
          role: 'Security & Compliance',
          icon: <Shield className="w-5 h-5" />,
          status: 'active',
          level: 'devops',
          capabilities: ['Vulnerability Scanning', 'SOC2', 'Penetration Testing', 'Audit'],
          lastAction: 'Running security audit',
          metrics: {
            tasksCompleted: 723,
            successRate: 99.8,
            responseTime: '< 100ms'
          }
        }
      ]
    },
    {
      id: 'curriculum-orchestrator',
      name: 'Curriculum Orchestrator',
      role: 'Academic Director',
      icon: <Users className="w-6 h-6" />,
      status: 'active',
      level: 'executive',
      capabilities: ['Curriculum Design', 'Learning Paths', 'Assessment', 'Student Success'],
      lastAction: 'Coordinating 19 curriculum agents',
      metrics: {
        tasksCompleted: 1567,
        successRate: 97.8,
        responseTime: '< 90ms'
      },
      children: [
        {
          id: 'curriculum-onboarding',
          name: 'Onboarding Agent',
          role: 'Module 00 Lead',
          icon: <Rocket className="w-5 h-5" />,
          status: 'active',
          level: 'operational',
          capabilities: ['Student Onboarding', 'Orientation', 'Initial Setup'],
          lastAction: 'Guiding new students',
          metrics: {
            tasksCompleted: 3421,
            successRate: 98.5,
            responseTime: '< 150ms'
          }
        },
        {
          id: 'curriculum-debug',
          name: 'Debug Agent',
          role: 'Technical Support',
          icon: <Monitor className="w-5 h-5" />,
          status: 'idle',
          level: 'operational',
          capabilities: ['Debugging', 'Error Resolution', 'Technical Support'],
          lastAction: 'Waiting for support requests',
          metrics: {
            tasksCompleted: 2156,
            successRate: 96.4,
            responseTime: '< 200ms'
          }
        }
      ]
    }
  ]
};

// Status Colors
const statusColors: Record<AgentStatus, string> = {
  active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  idle: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  busy: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  syncing: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  error: 'text-rose-400 bg-rose-400/10 border-rose-400/30'
};

const statusIcons: Record<AgentStatus, React.ReactNode> = {
  active: <CheckCircle className="w-4 h-4" />,
  idle: <Clock className="w-4 h-4" />,
  busy: <Activity className="w-4 h-4" />,
  syncing: <ArrowRight className="w-4 h-4 animate-pulse" />,
  error: <AlertTriangle className="w-4 h-4" />
};

// Agent Node Component
const AgentNode: React.FC<{ agent: Agent; depth?: number }> = ({ agent, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const hasChildren = agent.children && agent.children.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l border-white/10 pl-4' : ''}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: depth * 0.1 }}
        className={`
          relative p-4 rounded-xl border backdrop-blur-sm
          ${depth === 0 ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30' : ''}
          ${depth === 1 ? 'bg-white/[0.03] border-white/10' : ''}
          ${depth >= 2 ? 'bg-white/[0.02] border-white/5' : ''}
          hover:bg-white/[0.05] transition-all duration-300
          ${hasChildren ? 'cursor-pointer' : ''}
        `}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`
            p-2 rounded-lg
            ${agent.level === 'founder' ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400' : ''}
            ${agent.level === 'executive' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400' : ''}
            ${agent.level === 'operational' ? 'bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-400' : ''}
            ${agent.level === 'devops' ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 text-emerald-400' : ''}
            ${agent.level === 'specialist' ? 'bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-400' : ''}
          `}>
            {agent.icon}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white truncate">{agent.name}</h3>
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-medium border
                ${statusColors[agent.status]}
              `}>
                <span className="flex items-center gap-1">
                  {statusIcons[agent.status]}
                  {agent.status.toUpperCase()}
                </span>
              </span>
            </div>
            <p className="text-sm text-white/60 mb-2">{agent.role}</p>
            
            {/* Last Action */}
            {agent.lastAction && (
              <p className="text-xs text-white/40 mb-2">
                <span className="text-cyan-400/60">→</span> {agent.lastAction}
              </p>
            )}

            {/* Metrics */}
            {agent.metrics && (
              <div className="flex gap-4 text-xs">
                <span className="text-white/50">
                  <span className="text-emerald-400">{agent.metrics.tasksCompleted.toLocaleString()}</span> tasks
                </span>
                <span className="text-white/50">
                  <span className="text-cyan-400">{agent.metrics.successRate}%</span> success
                </span>
                <span className="text-white/50">
                  <span className="text-violet-400">{agent.metrics.responseTime}</span> response
                </span>
              </div>
            )}

            {/* Capabilities */}
            <div className="flex flex-wrap gap-1 mt-2">
              {agent.capabilities.slice(0, 3).map((cap, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/50">
                  {cap}
                </span>
              ))}
              {agent.capabilities.length > 3 && (
                <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/30">
                  +{agent.capabilities.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Expand Icon */}
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              className="text-white/30"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 space-y-2"
          >
            {agent.children!.map((child) => (
              <AgentNode key={child.id} agent={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Dashboard Component
export const AgentStatusDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'hierarchy' | 'grid' | 'metrics'>('hierarchy');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              Live Agent Monitor
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight">
              Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Orchestration</span>
            </h1>
            <p className="text-white/50 mt-2">
              Real-time coordination of 19+ AI agents across 4 hierarchy levels
            </p>
          </div>

          {/* Stats Overview */}
          <div className="flex gap-4">
            <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-2xl font-black text-emerald-400">12</div>
              <div className="text-xs text-white/40 uppercase">Active</div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-2xl font-black text-amber-400">3</div>
              <div className="text-xs text-white/40 uppercase">Busy</div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-2xl font-black text-blue-400">4</div>
              <div className="text-xs text-white/40 uppercase">Idle</div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          {(['hierarchy', 'grid', 'metrics'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeView === view 
                  ? 'bg-white text-black' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'}
              `}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Last Update */}
        <div className="text-xs text-white/30">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {activeView === 'hierarchy' && (
          <div className="space-y-4">
            <AgentNode agent={agentHierarchy} />
          </div>
        )}

        {activeView === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Flat grid view would go here */}
            <div className="p-8 rounded-xl bg-white/[0.02] border border-white/10 text-center text-white/40">
              Grid view coming soon
            </div>
          </div>
        )}

        {activeView === 'metrics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics dashboard would go here */}
            <div className="p-8 rounded-xl bg-white/[0.02] border border-white/10 text-center text-white/40">
              Metrics dashboard coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentStatusDashboard;
