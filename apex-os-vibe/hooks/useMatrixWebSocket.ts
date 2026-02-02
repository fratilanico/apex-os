import { useState, useEffect, useCallback, useRef } from 'react';

export interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  module: string;
  credits: number;
  capabilities: string[];
  lastHeartbeat: string;
}

export interface MemoryNode {
  id: string;
  type: 'file' | 'agent_output' | 'conversation' | 'concept' | 'code' | 'event';
  title: string;
  content: string;
  timestamp: string;
  connections: number;
  metadata: {
    moduleId?: string;
    agentId?: string;
    fileType?: string;
    size?: number;
    tags?: string[];
  };
}

export interface SwarmState {
  agents: Agent[];
  memories: MemoryNode[];
  isConnected: boolean;
  activeAgents: number;
  totalMemories: number;
  unreadNotifications: number;
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
    activeAgents: 0,
    totalMemories: 0,
    unreadNotifications: 0,
  });

  const [isReconnecting, setIsReconnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://apex-os.vercel.app/ws';
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Matrix] WebSocket connected');
        setState(prev => ({ ...prev, isConnected: true }));
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
        
        // Subscribe to channels
        ws.send(JSON.stringify({ action: 'subscribe:agents' }));
        ws.send(JSON.stringify({ action: 'subscribe:memory' }));
        ws.send(JSON.stringify({ action: 'subscribe:notifications' }));
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
              
            case 'notification:new':
              setState(prev => ({
                ...prev,
                unreadNotifications: prev.unreadNotifications + 1,
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
        console.log('[Matrix] WebSocket disconnected');
        setState(prev => ({ ...prev, isConnected: false }));
        
        // Attempt reconnection with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          setIsReconnecting(true);
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            console.log(`[Matrix] Reconnecting... Attempt ${reconnectAttemptsRef.current}`);
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
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
  }, []);

  const sendMessage = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const invokeAgent = useCallback((agentId: string, prompt: string, context?: object) => {
    sendMessage({
      action: 'agent:invoke',
      payload: { agentId, prompt, context },
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
    isReconnecting,
    invokeAgent,
    searchMemories,
    sendMessage,
    reconnect: connect,
  };
}
