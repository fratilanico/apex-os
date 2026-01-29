/**
 * Terminal Store - Zustand Store for Terminal State Management
 * Handles both Gemini and ClawBot modes
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AIMode, 
  ClawBotMessage, 
  ClawBotSession,
  ClawBotConnectionStatus
} from '../types/clawbot';
import { ClawBotClient } from '../lib/clawbot-client';

interface TerminalStore {
  // Mode
  mode: AIMode;
  setMode: (mode: AIMode) => void;
  geminiSessionId: string | null;
  lastActiveAt: number | null;
  
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
  setGeminiMessages: (messages: Array<{ role: 'user' | 'assistant'; content: string }>) => void;
  setClawBotSession: (session: ClawBotSession | null) => void;
  
  // Gemini actions
  sendToGemini: (message: string) => Promise<void>;
  clearGeminiHistory: () => void;
}

export const useTerminalStore = create<TerminalStore>()(
  persist(
    (set, get) => ({
  // Initial mode
  mode: 'gemini',
  geminiSessionId: null,
  lastActiveAt: null,
  
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

  setGeminiMessages: (messages) => set((state) => ({
    gemini: {
      ...state.gemini,
      messages,
    },
    lastActiveAt: Date.now(),
  })),

  setClawBotSession: (session) => set((state) => ({
    clawbot: {
      ...state.clawbot,
      session,
    },
    lastActiveAt: Date.now(),
  })),
  
  /**
   * Set AI mode (Gemini or ClawBot)
   */
  setMode: (mode: AIMode) => {
    console.log(`[Terminal] Switching mode to: ${mode}`);
    set({ mode, lastActiveAt: Date.now() });
    
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
          },
          lastActiveAt: Date.now()
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

      const existingSession = get().clawbot.session;

      // Create or resume session
      set({
        clawbot: {
          client,
          session: {
            id: existingSession?.id ?? crypto.randomUUID(),
            mode: 'clawbot',
            messages: existingSession?.messages ?? [],
            isConnected: true,
            isProcessing: false,
            error: undefined
          },
          status: {
            connected: true,
            reconnecting: false,
            reconnectAttempts: 0
          }
        },
        lastActiveAt: Date.now()
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

    set((state) => ({
      clawbot: {
        client: null,
        session: state.clawbot.session ? {
          ...state.clawbot.session,
          isConnected: false,
          isProcessing: false
        } : null,
        status: {
          connected: false,
          reconnecting: false,
          reconnectAttempts: 0
        }
      },
      lastActiveAt: Date.now()
    }));
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
      },
      lastActiveAt: Date.now()
    }));
    
    // Send to ClawBot
    try {
      client.sendMessage(message);
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
        },
        lastActiveAt: Date.now()
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
      },
      lastActiveAt: Date.now()
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
      },
      geminiSessionId: state.geminiSessionId ?? crypto.randomUUID(),
      lastActiveAt: Date.now()
    }));
    
    try {
      // Call your existing Gemini API endpoint
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: get().gemini.messages
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
        },
        lastActiveAt: Date.now()
      }));
    } catch (error) {
      console.error('[Terminal] Gemini error:', error);
      set((state) => ({
        gemini: {
          ...state.gemini,
          isProcessing: false
        },
        lastActiveAt: Date.now()
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
      },
      geminiSessionId: crypto.randomUUID(),
      lastActiveAt: Date.now()
    });
  }
    }),
    {
      name: 'apex-terminal-history',
      version: 1,
      partialize: (state) => ({
        mode: state.mode,
        gemini: state.gemini,
        geminiSessionId: state.geminiSessionId,
        lastActiveAt: state.lastActiveAt,
        clawbot: {
          session: state.clawbot.session,
          status: {
            connected: false,
            reconnecting: false,
            reconnectAttempts: 0
          }
        }
      })
    }
  )
);
