import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionTier = 'free' | 'basic' | 'full';

interface Usage {
  aiRequests: number;
  deployments: number;
  lastReset: string; // ISO date
}

interface SubscriptionState {
  tier: SubscriptionTier;
  usage: Usage;
  
  // Actions
  setTier: (tier: SubscriptionTier) => void;
  incrementUsage: (type: keyof Omit<Usage, 'lastReset'>) => void;
  resetDailyUsage: () => void;
  canAccessModule: (moduleNum: number) => boolean;
  canAccessMode: (mode: string) => boolean;
  getRemainingRequests: () => number;
}

const TIER_LIMITS = {
  free: {
    modules: [0],
    modes: ['chat', 'learn'],
    aiRequests: 10,
  },
  basic: {
    modules: [0, 1, 2],
    modes: ['chat', 'learn', 'deploy'],
    aiRequests: 50,
  },
  full: {
    modules: [0, 1, 2, 3, 4, 5],
    modes: ['chat', 'learn', 'deploy'],
    aiRequests: Infinity,
  },
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      tier: 'free',
      usage: {
        aiRequests: 0,
        deployments: 0,
        lastReset: new Date().toISOString(),
      },

      setTier: (tier) => set({ tier }),

      incrementUsage: (type) => {
        const state = get();
        
        // Check if we need to reset (new day)
        const lastReset = new Date(state.usage.lastReset);
        const now = new Date();
        const isNewDay = lastReset.getDate() !== now.getDate() ||
                        lastReset.getMonth() !== now.getMonth() ||
                        lastReset.getFullYear() !== now.getFullYear();
        
        if (isNewDay) {
          set({
            usage: {
              aiRequests: 0,
              deployments: 0,
              lastReset: now.toISOString(),
            },
          });
        }

        set((state) => ({
          usage: {
            ...state.usage,
            [type]: state.usage[type] + 1,
          },
        }));
      },

      resetDailyUsage: () => {
        set({
          usage: {
            aiRequests: 0,
            deployments: 0,
            lastReset: new Date().toISOString(),
          },
        });
      },

      canAccessModule: (moduleNum) => {
        return TIER_LIMITS[get().tier].modules.includes(moduleNum);
      },

      canAccessMode: (mode) => {
        return TIER_LIMITS[get().tier].modes.includes(mode);
      },

      getRemainingRequests: () => {
        const { tier, usage } = get();
        const limit = TIER_LIMITS[tier].aiRequests;
        if (limit === Infinity) return Infinity;
        return Math.max(0, limit - usage.aiRequests);
      },
    }),
    {
      name: 'apex-subscription',
    }
  )
);

export default useSubscriptionStore;
