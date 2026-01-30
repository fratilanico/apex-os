/**
 * Terminal Store - Zustand Store for Terminal State Management
 * Handles both Gemini and ClawBot modes
 */

import { create } from 'zustand';
import type { 
  AIMode, 
  ClawBotMessage, 
  ClawBotSession,
  ClawBotConnectionStatus
} from '../types/clawbot';
import { ClawBotClient } from '../lib/clawbot-client';
import { useMCPStore } from './useMCPStore';

interface TerminalStore {
  // Mode
  mode: AIMode;
  setMode: (mode: AIMode) => void;
  
  // ClawBot state
  clawbot: {
    client: ClawBotClient | null;
    session: ClawBotSession | null;
    status: ClawBotConnectionStatus;
  };
  
  // ClawBot actions
  connectClawBot: () => Promise<void>;
  disconnectClawBot: () => void;
  sendToClawBot: (message: string) => void;
  clearClawBotHistory: () => void;
  
  // Gemini state (keeping existing)
  gemini: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    isProcessing: boolean;
  };
  
  // Gemini actions
  sendToGemini: (message: string) => Promise<void>;
  clearGeminiHistory: () => void;
}

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  // Initial mode
  mode: 'gemini',
  
  // ClawBot initial state
  clawbot: {
    client: null,
    session: null,
    status: {
      connected: false,
      reconnecting: false,
      reconnectAttempts: 0
    }
  },
  
  // Gemini initial state
  gemini: {
    messages: [],
    isProcessing: false
  },
  
  /**
   * Set AI mode (Gemini or ClawBot)
   */
  setMode: (mode: AIMode) => {
    console.log(`[Terminal] Switching mode to: ${mode}`);
    set({ mode });
    
    // Auto-connect to ClawBot when switching to that mode
    if (mode === 'clawbot' && !get().clawbot.status.connected) {
      get().connectClawBot().catch(error => {
        console.error('[Terminal] Failed to auto-connect ClawBot:', error);
      });
    }
  },
  
  /**
   * Connect to ClawBot Gateway
   */
  connectClawBot: async () => {
    const wsUrl = import.meta.env.VITE_CLAWBOT_WS_URL || 'ws://localhost:18789';
    const token = import.meta.env.VITE_CLAWBOT_TOKEN || '';
    
    if (!wsUrl || !token) {
      throw new Error('ClawBot configuration missing. Set VITE_CLAWBOT_WS_URL and VITE_CLAWBOT_TOKEN');
    }
    
    console.log('[Terminal] Connecting to ClawBot...');
    
    const client = new ClawBotClient(wsUrl, token);
    
    // Set up message handler
    client.onMessage((message: ClawBotMessage) => {
      set((state) => {
        if (!state.clawbot.session) return state;
        
        return {
          clawbot: {
            ...state.clawbot,
            session: {
              ...state.clawbot.session,
              messages: [...state.clawbot.session.messages, message],
              isProcessing: false
            }
          }
        };
      });
    });
    
    // Set up status handler
    client.onStatusChange((status: ClawBotConnectionStatus) => {
      set((state) => ({
        clawbot: {
          ...state.clawbot,
          status
        }
      }));
    });
    
    // Set up error handler
    client.onError((error: Error) => {
      console.error('[Terminal] ClawBot error:', error);
      set((state) => ({
        clawbot: {
          ...state.clawbot,
          session: state.clawbot.session ? {
            ...state.clawbot.session,
            error: error.message,
            isProcessing: false
          } : null
        }
      }));
    });
    
    // Connect
    try {
      await client.connect();
      
      // Create new session
      set({
        clawbot: {
          client,
          session: {
            id: crypto.randomUUID(),
            mode: 'clawbot',
            messages: [],
            isConnected: true,
            isProcessing: false
          },
          status: {
            connected: true,
            reconnecting: false,
            reconnectAttempts: 0
          }
        }
      });
      
      console.log('[Terminal] ClawBot connected successfully');
    } catch (error) {
      console.error('[Terminal] ClawBot connection failed:', error);
      throw error;
    }
  },
  
  /**
   * Disconnect from ClawBot
   */
  disconnectClawBot: () => {
    const { client } = get().clawbot;
    
    if (client) {
      console.log('[Terminal] Disconnecting ClawBot...');
      client.disconnect();
    }
    
    set({
      clawbot: {
        client: null,
        session: null,
        status: {
          connected: false,
          reconnecting: false,
          reconnectAttempts: 0
        }
      }
    });
  },
  
  /**
   * Send message to ClawBot
   */
  sendToClawBot: (message: string) => {
    const { client, session } = get().clawbot;
    
    if (!client || !session) {
      throw new Error('ClawBot not connected');
    }
    
    if (!client.isConnected()) {
      throw new Error('ClawBot connection lost. Reconnecting...');
    }
    
    // Add user message immediately
    const userMessage: ClawBotMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: Date.now()
    };
    
    set((state) => ({
      clawbot: {
        ...state.clawbot,
        session: state.clawbot.session ? {
          ...state.clawbot.session,
          messages: [...state.clawbot.session.messages, userMessage],
          isProcessing: true,
          error: undefined
        } : null
      }
    }));
    
    // Send to ClawBot
    try {
      const mountedTools = useMCPStore.getState().getMountedTools();
      client.sendMessage(JSON.stringify({
        type: 'message',
        content: message,
        tools: mountedTools
      }));
    } catch (error) {
      console.error('[Terminal] Failed to send message to ClawBot:', error);
      set((state) => ({
        clawbot: {
          ...state.clawbot,
          session: state.clawbot.session ? {
            ...state.clawbot.session,
            error: error instanceof Error ? error.message : String(error),
            isProcessing: false
          } : null
        }
      }));
    }
  },
  
  /**
   * Clear ClawBot chat history
   */
  clearClawBotHistory: () => {
    set((state) => ({
      clawbot: {
        ...state.clawbot,
        session: state.clawbot.session ? {
          ...state.clawbot.session,
          messages: [],
          error: undefined
        } : null
      }
    }));
  },
  
  /**
   * Send message to Gemini
   */
  sendToGemini: async (message: string) => {
    // Add user message
    set((state) => ({
      gemini: {
        ...state.gemini,
        messages: [
          ...state.gemini.messages,
          { role: 'user', content: message }
        ],
        isProcessing: true
      }
    }));
    
    try {
      const mountedTools = useMCPStore.getState().getMountedTools();
      // Call your existing Gemini API endpoint
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: get().gemini.messages,
          tools: mountedTools
        })
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add assistant response
      set((state) => ({
        gemini: {
          messages: [
            ...state.gemini.messages,
            { role: 'assistant', content: data.response }
          ],
          isProcessing: false
        }
      }));
    } catch (error) {
      console.error('[Terminal] Gemini error:', error);
      set((state) => ({
        gemini: {
          ...state.gemini,
          isProcessing: false
        }
      }));
      throw error;
    }
  },
  
  /**
   * Clear Gemini chat history
   */
  clearGeminiHistory: () => {
    set({
      gemini: {
        messages: [],
        isProcessing: false
      }
    });
  }
}));
