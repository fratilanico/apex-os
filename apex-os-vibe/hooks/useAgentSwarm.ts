import { useState, useEffect } from 'react';

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'busy' | 'syncing' | 'error';
  role: string;
  level: 'founder' | 'executive' | 'operational' | 'devops' | 'specialist';
  lastAction?: string;
  tasks?: number;
}

export interface Task {
  id: string;
  agentId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  timestamp: Date;
}

export const useAgentSwarm = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mcpStatus, setMcpStatus] = useState('healthy');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  useEffect(() => {
    // Initialize with default agents
    const initialAgents: Agent[] = [
      { id: '1', name: 'APEX OS MONSTER', status: 'active', role: 'Founder & Chief Orchestrator', level: 'founder', tasks: 2847 },
      { id: '2', name: 'J.A.R.V.I.S.', status: 'active', role: 'Executive AI Director', level: 'executive', tasks: 1563 },
      { id: '3', name: 'CLI Builder', status: 'busy', role: 'Executive Operations', level: 'executive', tasks: 1247 },
      { id: '4', name: 'DevOps Swarm', status: 'active', role: 'Executive Infrastructure', level: 'executive', tasks: 2156 },
      { id: '5', name: 'Content Strategist', status: 'active', role: 'Executive Content', level: 'executive', tasks: 892 }
    ];
    
    setAgents(initialAgents);
    setLastUpdate(new Date());
  }, []);
  
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalAgents = agents.length;
  const onlineAgents = agents.filter(a => a.status !== 'error').length;
  const busyAgents = agents.filter(a => a.status === 'busy').length;
  const errorAgents = agents.filter(a => a.status === 'error').length;
  
  return { 
    agents, 
    setAgents,
    tasks,
    setTasks,
    isConnected,
    isConnecting,
    activeAgents,
    totalAgents,
    onlineAgents,
    busyAgents,
    errorAgents,
    mcpStatus,
    lastUpdate
  };
};

export default useAgentSwarm;
