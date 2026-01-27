import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication method types
 */
export type AuthMethod = 'email' | 'github' | 'demo' | 'cli';

/**
 * Authenticated user interface
 */
export interface AuthUser {
  email: string;
  name: string;
  authMethod: AuthMethod;
}

/**
 * Auth store state interface
 */
interface AuthState {
  // State
  isAuthenticated: boolean;
  user: AuthUser | null;
  enrollmentDate: string | null;

  // Actions
  login: (user: AuthUser) => void;
  logout: () => void;
}

/**
 * Authentication store with persistence
 * Manages user authentication state and enrollment tracking
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      enrollmentDate: null,

      // Actions
      login: (user: AuthUser) => {
        set((state) => ({
          isAuthenticated: true,
          user,
          // Only set enrollment date if it's the first login
          enrollmentDate: state.enrollmentDate ?? new Date().toISOString(),
        }));
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          // Preserve enrollment date even after logout
        });
      },
    }),
    {
      name: 'vibe-auth-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // Force migration to CLI auth for all previous sessions
        if (version < 2) {
          const state = persistedState as AuthState;
          if (state.user) {
            return {
              ...state,
              user: {
                ...state.user,
                authMethod: 'cli' as AuthMethod
              }
            };
          }
        }
        return persistedState as AuthState;
      },
      // Only persist necessary data
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        enrollmentDate: state.enrollmentDate,
      }),
    }
  )
);
