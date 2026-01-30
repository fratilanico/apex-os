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
import { getOrCreateUserId } from '../lib/userIdentity';

const SESSION_SAVE_DEBOUNCE_MS = 600;
const sessionSaveTimers: Partial<Record<AIMode, number>> = {};
const sessionLoaded: Partial<Record<AIMode, boolean>> = {};

interface TerminalSessionMessage {
  role: string;
  content: string;
}

const isClawBotRole = (role: string): role is ClawBotMessage['role'] => {
  return role === 'user' || role === 'assistant' || role === 'system';
};

const toClawBotRole = (role: string): ClawBotMessage['role'] => {
  return isClawBotRole(role) ? role : 'assistant';
};

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

  // Session sync
  loadSession: (mode: AIMode, force?: boolean) => Promise<void>;
  hydrateSessions: () => Promise<void>;
}

export const useTerminalStore = create<TerminalStore>()(
  persist(
    (set, get) => {
      const saveSessionNow = async (mode: AIMode): Promise<void> => {
        const userId = getOrCreateUserId();
        const state = get();

        const messages: TerminalSessionMessage[] = mode === 'gemini'
          ? state.gemini.messages.map((msg) => ({ role: msg.role, content: msg.content }))
          : (state.clawbot.session?.messages ?? []).map((msg) => ({ role: msg.role, content: msg.content }));

        await fetch('/api/sessions/terminal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            mode,
            messages,
            lastActiveAt: Date.now(),
          }),
        });
      };

      const queueSaveSession = (mode: AIMode): void => {
        const existing = sessionSaveTimers[mode];
        if (existing) {
          window.clearTimeout(existing);
        }

        sessionSaveTimers[mode] = window.setTimeout(() => {
          saveSessionNow(mode).catch((error) => {
            console.error('[Terminal] Failed to save session:', error);
          });
        }, SESSION_SAVE_DEBOUNCE_MS);
      };

      const loadSession = async (mode: AIMode, force = false): Promise<void> => {
        if (!force && sessionLoaded[mode]) {
          return;
        }
        sessionLoaded[mode] = true;

        const userId = getOrCreateUserId();
        const response = await fetch(`/api/sessions/terminal?userId=${encodeURIComponent(userId)}&mode=${encodeURIComponent(mode)}`);

        if (!response.ok) {
          throw new Error(`Session load failed: ${response.status}`);
        }

        const data = await response.json();
        const session = data?.session as { messages?: TerminalSessionMessage[] } | null;

        if (!session || !Array.isArray(session.messages)) {
          return;
        }

        if (mode === 'gemini') {
          const messages = session.messages
            .filter((msg) => msg && (msg.role === 'user' || msg.role === 'assistant'))
            .map((msg) => ({ role: msg.role as 'user' | 'assistant', content: msg.content ?? '' }));

          set((state) => ({
            gemini: {
              ...state.gemini,
              messages,
              isProcessing: false,
            },
          }));
          return;
        }

        const clawbotMessages: ClawBotMessage[] = session.messages.map((msg) => ({
          id: crypto.randomUUID(),
          role: toClawBotRole(msg.role ?? 'assistant'),
          content: msg.content ?? '',
          timestamp: Date.now(),
        }));

        const existingSession = get().clawbot.session;

        set((state) => ({
          clawbot: {
            ...state.clawbot,
            session: {
              id: existingSession?.id ?? crypto.randomUUID(),
              mode: 'clawbot',
              messages: clawbotMessages,
              isConnected: false,
              isProcessing: false,
            },
          },
        }));
      };

      return {
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

          loadSession(mode).catch((error) => {
            console.error('[Terminal] Failed to load session:', error);
          });

          // Auto-connect to ClawBot when switching to that mode
          if (mode === 'clawbot' && !get().clawbot.status.connected) {
            get().connectClawBot().catch((error) => {
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
            queueSaveSession('clawbot');
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
            const existingMessages = existingSession?.messages ?? [];

            // Create or reuse session
            set({
              clawbot: {
                client,
                session: {
                  id: existingSession?.id ?? crypto.randomUUID(),
                  mode: 'clawbot',
                  messages: existingMessages,
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
          queueSaveSession('clawbot');

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
          saveSessionNow('clawbot').catch((error) => {
            console.error('[Terminal] Failed to save session:', error);
          });
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
          queueSaveSession('gemini');

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
              }
            }));
            queueSaveSession('gemini');
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
          saveSessionNow('gemini').catch((error) => {
            console.error('[Terminal] Failed to save session:', error);
          });
        },

        loadSession,
        hydrateSessions: async () => {
          await Promise.all([loadSession('gemini'), loadSession('clawbot')]);
        },
      };
    },
    {
      name: 'vibe-terminal-sessions',
      version: 1,
      partialize: (state) => ({
        mode: state.mode,
        gemini: { messages: state.gemini.messages, isProcessing: false },
        clawbot: {
          session: state.clawbot.session ? {
            ...state.clawbot.session,
            isConnected: false,
            isProcessing: false,
          } : null,
        },
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<TerminalStore>;
        return {
          ...currentState,
          ...persisted,
          clawbot: {
            ...currentState.clawbot,
            ...persisted.clawbot,
            status: currentState.clawbot.status,
            client: currentState.clawbot.client,
          },
          gemini: {
            ...currentState.gemini,
            ...persisted.gemini,
          },
        };
      },
    }
  )
);
