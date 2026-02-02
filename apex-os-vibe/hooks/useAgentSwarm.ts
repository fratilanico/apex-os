import { useState, useEffect, useCallback, useRef } from 'react';
import { MCPBridgeClient, createBridgeClient } from '../lib/mcp/bridge-client';

// Agent Types
export interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error' | 'connecting';
  module: string;
  type: 'devops' | 'curriculum' | 'orchestrator' | 'specialized';
  credits: number;
  capabilities: string[];
  lastHeartbeat: string;
  lastTask?: string;
  taskStatus?: 'idle' | 'running' | 'completed' | 'failed';
  mcpConnected: boolean;
}

export interface AgentTask {
  id: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  prompt: string;
  result?: string;
  error?: string;
  startedAt: number;
  completedAt?: number;
}

export interface AgentSwarmState {
  agents: Agent[];
  tasks: AgentTask[];
  isConnected: boolean;
  isConnecting: boolean;
  activeAgents: number;
  totalAgents: number;
  onlineAgents: number;
  busyAgents: number;
  errorAgents: number;
  lastUpdate: number;
  mcpStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
}

// All 19 Agents Configuration
const ALL_AGENTS: Omit<Agent, 'status' | 'lastHeartbeat' | 'mcpConnected'>[] = [
  // DevOps Agents (7)
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    module: 'Core',
    type: 'orchestrator',
    credits: 1000,
    capabilities: ['task-delegation', 'workflow-management', 'agent-coordination', 'status-monitoring'],
  },
  {
    id: 'deployment-automation',
    name: 'Deployment Agent',
    module: 'DevOps',
    type: 'devops',
    credits: 850,
    capabilities: ['vercel-deploy', 'ci-cd', 'rollback', 'preview-generation'],
  },
  {
    id: 'security-monitor',
    name: 'Security Agent',
    module: 'DevOps',
    type: 'devops',
    credits: 900,
    capabilities: ['vulnerability-scan', 'dependency-check', 'secret-detection', 'compliance-audit'],
  },
  {
    id: 'cost-optimizer',
    name: 'Cost Agent',
    module: 'DevOps',
    type: 'devops',
    credits: 800,
    capabilities: ['budget-monitoring', 'resource-optimization', 'alerting', 'forecasting'],
  },
  {
    id: 'testing-qa',
    name: 'Testing Agent',
    module: 'DevOps',
    type: 'devops',
    credits: 750,
    capabilities: ['unit-tests', 'e2e-tests', 'visual-regression', 'performance-tests'],
  },
  {
    id: 'performance-monitor',
    name: 'Performance Agent',
    module: 'DevOps',
    type: 'devops',
    credits: 700,
    capabilities: ['lighthouse-audit', 'core-web-vitals', 'bundle-analysis', 'runtime-monitoring'],
  },
  {
    id: 'infrastructure-manager',
    name: 'Infrastructure Agent',
    module: 'DevOps',
    type: 'devops',
    credits: 850,
    capabilities: ['database-management', 'cdn-optimization', 'edge-config', 'scaling'],
  },
  // Curriculum Agents (12)
  {
    id: 'curriculum-architect',
    name: 'Curriculum Architect',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 950,
    capabilities: ['module-design', 'learning-paths', 'prerequisite-mapping', 'outcome-definition'],
  },
  {
    id: 'content-creator',
    name: 'Content Agent',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 900,
    capabilities: ['lesson-generation', 'code-examples', 'exercises', 'assessments'],
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 850,
    capabilities: ['pr-review', 'feedback-generation', 'best-practices', 'refactoring-suggestions'],
  },
  {
    id: 'mentor-guide',
    name: 'Mentor Agent',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 800,
    capabilities: ['student-support', 'progress-tracking', 'motivation', 'career-guidance'],
  },
  {
    id: 'project-evaluator',
    name: 'Project Evaluator',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 750,
    capabilities: ['portfolio-review', 'grading', 'feedback', 'improvement-plans'],
  },
  {
    id: 'tooling-specialist',
    name: 'Tooling Agent',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 850,
    capabilities: ['tool-recommendations', 'setup-guides', 'troubleshooting', 'optimization'],
  },
  {
    id: 'community-manager',
    name: 'Community Agent',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 700,
    capabilities: ['forum-moderation', 'event-coordination', 'networking', 'support-routing'],
  },
  {
    id: 'assessment-designer',
    name: 'Assessment Agent',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 800,
    capabilities: ['quiz-creation', 'project-rubrics', 'skill-evaluation', 'certification'],
  },
  {
    id: 'learning-analyst',
    name: 'Learning Analyst',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 750,
    capabilities: ['engagement-metrics', 'completion-rates', 'dropout-analysis', 'improvement-insights'],
  },
  {
    id: 'integration-specialist',
    name: 'Integration Agent',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 800,
    capabilities: ['api-integration', 'third-party-tools', 'automation', 'data-sync'],
  },
  {
    id: 'accessibility-auditor',
    name: 'Accessibility Agent',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 700,
    capabilities: ['wcag-compliance', 'screen-reader-testing', 'contrast-checks', 'keyboard-navigation'],
  },
  {
    id: 'localization-manager',
    name: 'Localization Agent',
    module: 'Curriculum',
    type: 'curriculum',
    credits: 650,
    capabilities: ['translation', 'cultural-adaptation', 'multi-language-support', 'regional-content'],
  },
];

export function useAgentSwarm() {
  const [state, setState] = useState<AgentSwarmState>({
    agents: ALL_AGENTS.map(agent => ({
      ...agent,
      status: 'offline',
      lastHeartbeat: new Date().toISOString(),
      mcpConnected: false,
    })),
    tasks: [],
    isConnected: false,
    isConnecting: false,
    activeAgents: 0,
    totalAgents: ALL_AGENTS.length,
    onlineAgents: 0,
    busyAgents: 0,
    errorAgents: 0,
    lastUpdate: Date.now(),
    mcpStatus: 'disconnected',
  });

  const bridgeClientRef = useRef<MCPBridgeClient | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize MCP Bridge Client
  const initializeBridge = useCallback(() => {
    const bridgeUrl = import.meta.env.VITE_BRIDGE_URL || window.location.origin;
    bridgeClientRef.current = createBridgeClient({
      bridgeUrl,
      defaultTimeout: 30000,
    });
  }, []);

  // Check MCP Health and Agent Status
  const checkMCPHealth = useCallback(async () => {
    if (!bridgeClientRef.current) return;

    try {
      setState(prev => ({ ...prev, mcpStatus: 'connecting' }));
      
      const health = await bridgeClientRef.current.health();
      
      // Update agent statuses based on MCP health response
      setState(prev => {
        const updatedAgents = prev.agents.map(agent => {
          const isAgentAvailable = health.agents.includes(agent.id);
          return {
            ...agent,
            status: isAgentAvailable ? 'online' : 'offline',
            mcpConnected: isAgentAvailable,
            lastHeartbeat: new Date().toISOString(),
          };
        });

        const onlineAgents = updatedAgents.filter(a => a.status === 'online').length;
        const busyAgents = updatedAgents.filter(a => a.status === 'busy').length;
        const errorAgents = updatedAgents.filter(a => a.status === 'error').length;

        return {
          ...prev,
          agents: updatedAgents,
          isConnected: true,
          isConnecting: false,
          activeAgents: onlineAgents + busyAgents,
          onlineAgents,
          busyAgents,
          errorAgents,
          lastUpdate: Date.now(),
          mcpStatus: 'connected',
        };
      });
    } catch (error) {
      console.error('[AgentSwarm] MCP Health check failed:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        mcpStatus: 'error',
      }));
    }
  }, []);

  // Invoke an agent
  const invokeAgent = useCallback(async (
    agentId: string,
    prompt: string,
    context?: Record<string, unknown>
  ): Promise<void> => {
    if (!bridgeClientRef.current) {
      throw new Error('MCP Bridge not initialized');
    }

    const taskId = `${agentId}-${Date.now()}`;
    
    // Add task to state
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, {
        id: taskId,
        agentId,
        status: 'running',
        prompt,
        startedAt: Date.now(),
      }],
      agents: prev.agents.map(agent =>
        agent.id === agentId
          ? { ...agent, status: 'busy', taskStatus: 'running', lastTask: prompt }
          : agent
      ),
      busyAgents: prev.busyAgents + 1,
    }));

    try {
      const response = await bridgeClientRef.current.call(
        agentId,
        'process',
        { prompt, context }
      );

      // Update task and agent status
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                status: response.success ? 'completed' : 'failed',
                result: response.success ? JSON.stringify(response.data) : undefined,
                error: response.error,
                completedAt: Date.now(),
              }
            : task
        ),
        agents: prev.agents.map(agent =>
          agent.id === agentId
            ? {
                ...agent,
                status: 'online',
                taskStatus: response.success ? 'completed' : 'failed',
              }
            : agent
        ),
        busyAgents: Math.max(0, prev.busyAgents - 1),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                status: 'failed',
                error: error instanceof Error ? error.message : String(error),
                completedAt: Date.now(),
              }
            : task
        ),
        agents: prev.agents.map(agent =>
          agent.id === agentId
            ? { ...agent, status: 'error', taskStatus: 'failed' }
            : agent
        ),
        busyAgents: Math.max(0, prev.busyAgents - 1),
        errorAgents: prev.errorAgents + 1,
      }));
    }
  }, []);

  // Broadcast to all agents
  const broadcastToAll = useCallback(async (prompt: string) => {
    const onlineAgents = state.agents.filter(a => a.status === 'online');
    await Promise.all(
      onlineAgents.map(agent => invokeAgent(agent.id, prompt))
    );
  }, [state.agents, invokeAgent]);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    // Check immediately
    checkMCPHealth();
    
    // Then every 30 seconds
    heartbeatIntervalRef.current = setInterval(checkMCPHealth, 30000);
  }, [checkMCPHealth]);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
  }, []);

  // Connect to MCP
  const connect = useCallback(() => {
    setState(prev => ({ ...prev, isConnecting: true }));
    initializeBridge();
    startHeartbeat();
  }, [initializeBridge, startHeartbeat]);

  // Disconnect from MCP
  const disconnect = useCallback(() => {
    stopHeartbeat();
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setState(prev => ({
      ...prev,
      isConnected: false,
      mcpStatus: 'disconnected',
      agents: prev.agents.map(agent => ({
        ...agent,
        status: 'offline',
        mcpConnected: false,
      })),
    }));
  }, [stopHeartbeat]);

  // Get agent by ID
  const getAgent = useCallback((agentId: string) => {
    return state.agents.find(a => a.id === agentId);
  }, [state.agents]);

  // Get tasks for agent
  const getAgentTasks = useCallback((agentId: string) => {
    return state.tasks.filter(t => t.agentId === agentId);
  }, [state.tasks]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    ...state,
    invokeAgent,
    broadcastToAll,
    getAgent,
    getAgentTasks,
    connect,
    disconnect,
    checkMCPHealth,
  };
}

export default useAgentSwarm;
