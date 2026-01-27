/**
 * ClawBot Integration Types
 * Types for integrating Clawdbot into Vibe Coder Terminal
 */

export type AIMode = 'gemini' | 'clawbot';

export interface ClawBotConfig {
  wsUrl: string;
  token: string;
  enabled: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface ClawBotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    agent?: string;
    toolsUsed?: string[];
    model?: string;
    tokensUsed?: {
      input: number;
      output: number;
    };
    executionTime?: number;
  };
}

export interface ClawBotSession {
  id: string;
  mode: AIMode;
  messages: ClawBotMessage[];
  isConnected: boolean;
  isProcessing: boolean;
  error?: string;
}

export interface ClawBotGatewayMessage {
  type: 'message' | 'status' | 'error' | 'tool_use' | 'stream';
  content?: string;
  data?: any;
  timestamp?: number;
  sessionId?: string;
}

export interface ClawBotConnectionStatus {
  connected: boolean;
  reconnecting: boolean;
  lastError?: string;
  reconnectAttempts: number;
}

export interface ClawBotToolExecution {
  toolName: string;
  input: any;
  output: any;
  duration: number;
  success: boolean;
}
