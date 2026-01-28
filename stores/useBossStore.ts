import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BossBattle, BossId, BossState } from '../types/boss';

interface BossStoreState extends BossState {
  // Boss data registry
  bossData: Record<BossId, BossBattle>;
  
  // Actions
  startBoss: (bossId: BossId) => boolean;
  advancePhase: () => void;
  dealDamage: (amount: number) => void;
  healBoss: (amount: number) => void;
  defeatBoss: () => void;
  failBoss: () => void;
  useHint: () => void;
  abandonBoss: () => void;
  
  // Queries
  getCurrentBoss: () => BossBattle | null;
  getCurrentPhase: () => number;
  getBossHealth: () => number;
  isBossActive: () => boolean;
  isBossDefeated: (bossId: BossId) => boolean;
  canStartBoss: (bossId: BossId) => boolean;
  
  // Data management
  registerBoss: (boss: BossBattle) => void;
  loadBossData: (bosses: BossBattle[]) => void;
}

export const useBossStore = create<BossStoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentBoss: null,
      currentPhase: 0,
      currentHealth: 0,
      attempt: null,
      defeatedBosses: [],
      bossStats: {} as Record<BossId, {
        attempts: number;
        defeated: boolean;
        bestTime?: number;
        flawless?: boolean;
      }>,
      bossData: {} as Record<BossId, BossBattle>,
      
      // Actions
      startBoss: (bossId: BossId) => {
        const { bossData, bossStats } = get();
        const boss = bossData[bossId];
        
        if (!boss) {
          console.warn(`Boss not found: ${bossId}`);
          return false;
        }
        
        // Initialize boss stats if first time
        if (!bossStats[bossId]) {
          set({
            bossStats: {
              ...bossStats,
              [bossId]: {
                attempts: 0,
                defeated: false,
              },
            },
          });
        }
        
        // Start the battle
        set({
          currentBoss: bossId,
          currentPhase: 0,
          currentHealth: boss.maxHealth,
          attempt: {
            bossId,
            phase: 0,
            attempts: bossStats[bossId]?.attempts ?? 0 + 1,
            hintsUsed: 0,
            timeSpent: 0,
            startedAt: new Date().toISOString(),
          },
        });
        
        // Update stats
        set({
          bossStats: {
            ...get().bossStats,
            [bossId]: {
              ...get().bossStats[bossId],
              attempts: (get().bossStats[bossId]?.attempts ?? 0) + 1,
            },
          },
        });
        
        return true;
      },
      
      advancePhase: () => {
        const { currentPhase, attempt } = get();
        
        if (!attempt) return;
        
        set({
          currentPhase: currentPhase + 1,
          attempt: {
            ...attempt,
            phase: currentPhase + 1,
          },
        });
      },
      
      dealDamage: (amount: number) => {
        const { currentHealth } = get();
        const newHealth = Math.max(0, currentHealth - amount);
        
        set({ currentHealth: newHealth });
        
        // Check for defeat
        if (newHealth <= 0) {
          get().defeatBoss();
        }
      },
      
      healBoss: (amount: number) => {
        const { currentHealth, bossData, currentBoss } = get();
        if (!currentBoss) return;
        
        const boss = bossData[currentBoss];
        if (!boss) return;
        
        const newHealth = Math.min(boss.maxHealth, currentHealth + amount);
        set({ currentHealth: newHealth });
      },
      
      defeatBoss: () => {
        const { currentBoss, attempt, defeatedBosses, bossStats } = get();
        
        if (!currentBoss || !attempt) return;
        
        const timeSpent = Date.now() - new Date(attempt.startedAt).getTime();
        const flawless = attempt.hintsUsed === 0;
        
        // Update boss stats
        const currentStats = bossStats[currentBoss];
        const newStats = {
          ...currentStats,
          defeated: true,
          bestTime: currentStats?.bestTime 
            ? Math.min(currentStats.bestTime, timeSpent)
            : timeSpent,
          flawless: flawless || currentStats?.flawless,
        };
        
        set({
          defeatedBosses: defeatedBosses.includes(currentBoss)
            ? defeatedBosses
            : [...defeatedBosses, currentBoss],
          bossStats: {
            ...bossStats,
            [currentBoss]: newStats,
          },
        });
        
        // Clear current boss state (will be handled by game flow)
      },
      
      failBoss: () => {
        // Reset to allow retry
        const { currentBoss } = get();
        if (!currentBoss) return;
        
        set({
          currentBoss: null,
          currentPhase: 0,
          currentHealth: 0,
          attempt: null,
        });
      },
      
      useHint: () => {
        const { attempt } = get();
        if (!attempt) return;
        
        set({
          attempt: {
            ...attempt,
            hintsUsed: attempt.hintsUsed + 1,
          },
        });
      },
      
      abandonBoss: () => {
        set({
          currentBoss: null,
          currentPhase: 0,
          currentHealth: 0,
          attempt: null,
        });
      },
      
      // Queries
      getCurrentBoss: () => {
        const { currentBoss, bossData } = get();
        return currentBoss ? bossData[currentBoss] ?? null : null;
      },
      
      getCurrentPhase: () => {
        return get().currentPhase;
      },
      
      getBossHealth: () => {
        return get().currentHealth;
      },
      
      isBossActive: () => {
        return get().currentBoss !== null;
      },
      
      isBossDefeated: (bossId: BossId) => {
        return get().defeatedBosses.includes(bossId);
      },
      
      canStartBoss: (bossId: BossId) => {
        const { currentBoss, bossData } = get();
        
        // Can't start if another boss is active
        if (currentBoss) return false;
        
        const boss = bossData[bossId];
        if (!boss) return false;
        
        // TODO: Check unlock conditions (quest completion, level, etc.)
        
        return true;
      },
      
      // Data Management
      registerBoss: (boss: BossBattle) => {
        set((state) => ({
          bossData: {
            ...state.bossData,
            [boss.id]: boss,
          },
        }));
      },
      
      loadBossData: (bosses: BossBattle[]) => {
        const bossDataMap = bosses.reduce((acc, boss) => {
          acc[boss.id] = boss;
          return acc;
        }, {} as Record<BossId, BossBattle>);
        
        set({ bossData: bossDataMap });
      },
    }),
    {
      name: 'apex-boss-storage',
      version: 1,
      partialize: (state) => ({
        defeatedBosses: state.defeatedBosses,
        bossStats: state.bossStats,
        // Don't persist active boss state - session only
        // Don't persist bossData - loaded from content files
      }),
    }
  )
);
