import { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalLine } from './useTerminal';

export interface SessionState {
  lines: TerminalLine[];
  history: string[];
  currentDirectory?: string;
  timestamp: number;
  sessionId: string;
  scrollPosition?: number;
  inputValue?: string;
}

export interface UseSessionOptions {
  terminalId: string;
  maxAge?: number;
  autoSaveInterval?: number;
}

const generateSessionId = (terminalId: string): string => {
  return `${terminalId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const getSessionKey = (terminalId: string): string => `terminal-session-${terminalId}`;
const getStateKey = (sessionId: string): string => `terminal-state-${sessionId}`;

export const useSession = (options: UseSessionOptions) => {
  const { terminalId, maxAge = 24 * 60 * 60 * 1000, autoSaveInterval = 5000 } = options;

  const sessionIdRef = useRef<string>('');

  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    const key = getSessionKey(terminalId);
    let id = localStorage.getItem(key);
    if (!id) {
      id = generateSessionId(terminalId);
      localStorage.setItem(key, id);
    }
    sessionIdRef.current = id;
  }, [terminalId]);

  useEffect(() => {
    const saved = localStorage.getItem(getStateKey(sessionIdRef.current));
    if (saved) {
      try {
        const state: SessionState = JSON.parse(saved);
        const age = Date.now() - state.timestamp;
        if (age < maxAge) {
          setHasSavedSession(true);
          setLastSaved(new Date(state.timestamp));
        } else {
          localStorage.removeItem(getStateKey(sessionIdRef.current));
          localStorage.removeItem(getSessionKey(terminalId));
        }
      } catch {
        localStorage.removeItem(getStateKey(sessionIdRef.current));
        localStorage.removeItem(getSessionKey(terminalId));
      }
    }
  }, [maxAge, terminalId]);

  const saveState = useCallback(
    (state: Partial<SessionState>) => {
      const fullState: SessionState = {
        lines: state.lines ?? [],
        history: state.history ?? [],
        currentDirectory: state.currentDirectory,
        timestamp: Date.now(),
        sessionId: sessionIdRef.current,
        scrollPosition: state.scrollPosition,
        inputValue: state.inputValue,
      };

      try {
        localStorage.setItem(getStateKey(sessionIdRef.current), JSON.stringify(fullState));
        setLastSaved(new Date());
        setHasSavedSession(true);
      } catch (error) {
        console.warn('Failed to save session:', error);
      }
    },
    []
  );

  const loadState = useCallback((): SessionState | null => {
    try {
      const saved = localStorage.getItem(getStateKey(sessionIdRef.current));
      if (saved) {
        const state: SessionState = JSON.parse(saved);
        const age = Date.now() - state.timestamp;
        if (age < maxAge) {
          setIsRestored(true);
          return state;
        }
        localStorage.removeItem(getStateKey(sessionIdRef.current));
        localStorage.removeItem(getSessionKey(terminalId));
      }
    } catch (error) {
      console.warn('Failed to load session:', error);
    }
    return null;
  }, [maxAge, terminalId]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(getStateKey(sessionIdRef.current));
    localStorage.removeItem(getSessionKey(terminalId));
    const newId = generateSessionId(terminalId);
    localStorage.setItem(getSessionKey(terminalId), newId);
    sessionIdRef.current = newId;
    setHasSavedSession(false);
    setLastSaved(null);
    setIsRestored(false);
  }, [terminalId]);

  const setupAutoSave = useCallback(
    (getState: () => Partial<SessionState>) => {
      const interval = setInterval(() => {
        try {
          const state = getState();
          if (state.lines?.length || state.history?.length) {
            saveState(state);
          }
        } catch (error) {
          console.warn('Auto-save failed:', error);
        }
      }, autoSaveInterval);

      return () => clearInterval(interval);
    },
    [autoSaveInterval, saveState]
  );

  const getSessionAge = useCallback((): number | null => {
    try {
      const saved = localStorage.getItem(getStateKey(sessionIdRef.current));
      if (saved) {
        const state: SessionState = JSON.parse(saved);
        return Date.now() - state.timestamp;
      }
    } catch {
      // Ignore parsing errors
    }
    return null;
  }, []);

  const getSessionMetadata = useCallback((): { lineCount: number; historyCount: number } | null => {
    try {
      const saved = localStorage.getItem(getStateKey(sessionIdRef.current));
      if (saved) {
        const state: SessionState = JSON.parse(saved);
        return {
          lineCount: state.lines?.length ?? 0,
          historyCount: state.history?.length ?? 0,
        };
      }
    } catch {
      // Ignore parsing errors
    }
    return null;
  }, []);

  return {
    sessionId: sessionIdRef.current,
    hasSavedSession,
    lastSaved,
    isRestored,
    saveState,
    loadState,
    clearSession,
    setupAutoSave,
    getSessionAge,
    getSessionMetadata,
  };
};

export default useSession;
