// APEX OS Vibe - Matrix WebSocket Hook
// Unified hook for Second Brain + Agent Swarm real-time updates

import { useState, useEffect, useCallback, useRef } from 'react';
import type { MemoryNode } from '../components/matrix/SecondBrainPanel';
import type { Agent } from '../components/matrix/AgentSwarmPanel';

interface SwarmState {
  agents: Agent[];
  memories: MemoryNode[];
  isConnected: boolean;
  isReconnecting: boolean;
  activeAgents: number;
  totalMemories: number;
}

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export function useMatrixWebSocket() {
  const [state, setState] = useState<SwarmState>({
    agents: [],
    memories: [],
    isConnected: false,
    isReconnecting: false,
    activeAgents: 0,
    totalMemories: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    // Mock WebSocket for demo (replace with real WS URL in production)
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://apex-os.vercel.app/ws';
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Matrix] Connected');
        setState(prev => ({ ...prev, isConnected: true, isReconnecting: false }));
        reconnectAttempts.current = 0;
        
        // Subscribe to channels
        ws.send(JSON.stringify({ action: 'subscribe:swarm' }));
        ws.send(JSON.stringify({ action: 'subscribe:memory' }));
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'swarm:update':
              setState(prev => ({
                ...prev,
                agents: message.payload.agents || [],
                activeAgents: message.payload.agents?.filter((a: Agent) => a.status === 'online').length || 0,
              }));
              break;
              
            case 'memory:update':
            case 'memory:new':
              setState(prev => ({
                ...prev,
                memories: [message.payload, ...prev.memories].slice(0, 100),
                totalMemories: prev.totalMemories + 1,
              }));
              break;
              
            case 'agent:status':
              setState(prev => ({
                ...prev,
                agents: prev.agents.map(agent =>
                  agent.id === message.payload.agentId
                    ? { ...agent, status: message.payload.status }
                    : agent
                ),
              }));
              break;
          }
        } catch (error) {
          console.error('[Matrix] Message parse error:', error);
        }
      };

      ws.onclose = () => {
        console.log('[Matrix] Disconnected');
        setState(prev => ({ ...prev, isConnected: false }));
        
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setState(prev => ({ ...prev, isReconnecting: true }));
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          setTimeout(() => {
            reconnectAttempts.current += 1;
            console.log(`[Matrix] Reconnecting... Attempt ${reconnectAttempts.current}`);
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('[Matrix] WebSocket error:', error);
      };

    } catch (error) {
      console.error('[Matrix] Connection error:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
  }, []);

  const sendMessage = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const invokeAgent = useCallback((agentId: string, prompt: string) => {
    sendMessage({
      action: 'agent:invoke',
      payload: { agentId, prompt },
    });
  }, [sendMessage]);

  const searchMemories = useCallback((query: string) => {
    sendMessage({
      action: 'memory:search',
      payload: { query },
    });
  }, [sendMessage]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    ...state,
    invokeAgent,
    searchMemories,
    sendMessage,
    reconnect: connect,
  };
}

export default useMatrixWebSocket;
