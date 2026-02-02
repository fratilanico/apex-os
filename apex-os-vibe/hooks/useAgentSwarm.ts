import { useState, useEffect, useCallback } from 'react';
import type { Agent, AgentTask, AgentSwarmState } from '../types/swarm';

// Default agents initialization
const defaultAgents: Agent[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    status: 'online',
    module: 'System Coordination',
    type: 'orchestrator',
    credits: 1000,
    capabilities: ['coordination', 'monitoring', 'optimization'],
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0
  },
  {
    id: 'deployment-automation',
    name: 'Deployment Automation',
    status: 'online',
    module: 'CI/CD Pipeline',
    type: 'devops',
    credits: 850,
    capabilities: ['deployment', 'automation', 'testing'],
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0
  },
  {
    id: 'security-monitor',
    name: 'Security Monitor',
    status: 'online',
    module: 'Security Operations',
    type: 'devops',
    credits: 750,
    capabilities: ['security', 'monitoring', 'auditing'],
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0
  },
  {
    id: 'curriculum-architect',
    name: 'Curriculum Architect',
    status: 'online',
    module: 'Learning Design',
    type: 'curriculum',
    credits: 900,
    capabilities: ['curriculum', 'design', 'pedagogy'],
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    status: 'online',
    module: 'Content Production',
    type: 'curriculum',
    credits: 800,
    capabilities: ['content', 'media', 'documentation'],
    lastHeartbeat: new Date().toISOString(),
    mcpConnected: true,
    tasksCompleted: 0,
    tasksFailed: 0
  }
];

export const useAgentSwarm = () => {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [isConnected] = useState(true);
  const [isConnecting] = useState(false);
  const [mcpStatus, setMcpStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('connected');
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Calculate statistics
  const activeAgents = agents.filter(a => a.status === 'online' && a.mcpConnected).length;
  const totalAgents = agents.length;
  const onlineAgents = agents.filter(a => a.status !== 'error' && a.status !== 'offline').length;
  const busyAgents = agents.filter(a => a.status === 'busy').length;
  const errorAgents = agents.filter(a => a.status === 'error').length;

  // Invoke an agent with a prompt
  const invokeAgent = useCallback((agentId: string, prompt: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || agent.status !== 'online') {
      console.warn(`Cannot invoke agent ${agentId}: not online`);
      return;
    }

    // Create a new task
    const newTask: AgentTask = {
      id: `task-${Date.now()}`,
      agentId,
      status: 'running',
      prompt,
      startedAt: Date.now()
    };

    setTasks(prev => [...prev, newTask]);
    
    // Update agent status to busy
    setAgents(prev => prev.map(a => 
      a.id === agentId 
        ? { ...a, status: 'busy', currentTask: prompt, taskStatus: 'running' }
        : a
    ));

    // Simulate task completion after 2 seconds
    setTimeout(() => {
      setTasks(prev => prev.map(t => 
        t.id === newTask.id 
          ? { ...t, status: 'completed', completedAt: Date.now(), result: 'Task completed successfully' }
          : t
      ));
      
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { 
              ...a, 
              status: 'online', 
              currentTask: undefined, 
              taskStatus: 'idle',
              tasksCompleted: (a.tasksCompleted || 0) + 1,
              lastHeartbeat: new Date().toISOString()
            }
          : a
      ));
      
      setLastUpdate(Date.now());
    }, 2000);
  }, [agents]);

  // Check MCP health
  const checkMCPHealth = useCallback(() => {
    setMcpStatus('connecting');
    
    // Simulate health check
    setTimeout(() => {
      const allHealthy = agents.every(a => a.mcpConnected);
      setMcpStatus(allHealthy ? 'connected' : 'error');
      setLastUpdate(Date.now());
    }, 500);
  }, [agents]);

  // Simulate heartbeat updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        lastHeartbeat: new Date().toISOString()
      })));
      setLastUpdate(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Build swarm state
  const swarmState: AgentSwarmState = {
    agents,
    tasks,
    isConnected,
    isConnecting,
    activeAgents,
    totalAgents,
    onlineAgents,
    busyAgents,
    errorAgents,
    lastUpdate,
    mcpStatus,
    summary: {
      total: totalAgents,
      online: onlineAgents,
      busy: busyAgents,
      error: errorAgents
    }
  };

  return {
    ...swarmState,
    setAgents,
    setTasks,
    invokeAgent,
    checkMCPHealth
  };
};

export default useAgentSwarm;
