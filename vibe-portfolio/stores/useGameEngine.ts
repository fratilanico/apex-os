/**
 * Unified Game Engine Store
 * 
 * Single source of truth for APEX OS game state.
 * Synchronizes Matrix (graph), SkillTree (progression), and Quests (missions).
 * 
 * Design Philosophy:
 * - Matrix nodes represent locations/challenges in the world
 * - Quests drive progression and unlock nodes
 * - Skills track player capabilities
 * - All systems stay in sync automatically
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMatrixStore } from './useMatrixStore';
import { useSkillTreeStore } from './useSkillTreeStore';
import { QUESTS } from '../data/questsData';
import type { MatrixNode } from '../types/matrix';

/**
 * Player location in the matrix
 */
export interface PlayerPosition {
  currentNodeId: string;
  previousNodeId: string | null;
  pathHistory: string[]; // Breadcrumb trail
}

/**
 * Fork choice at decision points
 */
export interface ForkChoice {
  nodeId: string; // The fork node
  choices: {
    label: string;
    targetNodeId: string;
    description: string;
    consequence?: string;
  }[];
  selectedChoice: string | null; // Which path was chosen
  timestamp: string | null;
}

/**
 * Active challenge state
 */
export interface ChallengeState {
  nodeId: string;
  questId: string;
  startedAt: string;
  attempts: number;
  lastSubmission?: {
    code: string;
    result: 'pass' | 'fail';
    feedback: string;
    timestamp: string;
  };
}

/**
 * Game Engine State
 */
interface GameEngineState {
  // Player State
  position: PlayerPosition;
  activeChallenge: ChallengeState | null;
  forkChoices: ForkChoice[];
  
  // Computed State (derived from other stores)
  level: number;
  
  // Navigation Actions
  navigateTo: (nodeId: string) => boolean;
  getAdjacentNodes: () => MatrixNode[];
  getCurrentNode: () => MatrixNode | null;
  
  // Fork Actions
  getForkAtCurrentNode: () => ForkChoice | null;
  chooseForkPath: (choiceLabel: string) => boolean;
  previewForkPath: (choiceLabel: string) => string;
  
  // Challenge Actions
  startChallenge: (nodeId: string, questId: string) => boolean;
  submitSolution: (code: string) => Promise<{ success: boolean; feedback: string }>;
  abandonChallenge: () => void;
  
  // Quest Integration
  syncQuestToMatrix: (questId: string) => void;
  completeNodeQuest: (nodeId: string) => void;
  
  // Utilities
  calculateLevel: () => number;
  getPlayerStats: () => {
    xp: number;
    gold: number;
    level: number;
    completedQuests: number;
    unlockedSkills: number;
    nodesCompleted: number;
  };
  
  // Reset
  resetGame: () => void;
}

export const useGameEngine = create<GameEngineState>()(
  persist(
    (set, get) => ({
      // Initial State
      position: {
        currentNodeId: '0',
        previousNodeId: null,
        pathHistory: ['0'],
      },
      activeChallenge: null,
      forkChoices: [],
      level: 1,

      // Navigation Actions
      navigateTo: (nodeId: string) => {
        const matrixStore = useMatrixStore.getState();
        const targetNode = matrixStore.nodes.find(n => n.id === nodeId);
        
        if (!targetNode) {
          console.warn(`Node ${nodeId} not found`);
          return false;
        }

        // Check if node is reachable (connected via edges)
        const currentNodeId = get().position.currentNodeId;
        const edges = matrixStore.edges;
        const isAdjacent = edges.some(
          e => (e.source === currentNodeId && e.target === nodeId) ||
               (e.target === currentNodeId && e.source === nodeId)
        );

        if (!isAdjacent && nodeId !== currentNodeId) {
          console.warn(`Node ${nodeId} is not adjacent to current node`);
          return false;
        }

        // Update position
        set(state => ({
          position: {
            currentNodeId: nodeId,
            previousNodeId: state.position.currentNodeId,
            pathHistory: [...state.position.pathHistory, nodeId],
          },
        }));

        // Update active node in matrix
        matrixStore.setActiveNode(nodeId);
        
        return true;
      },

      getAdjacentNodes: () => {
        const matrixStore = useMatrixStore.getState();
        const currentNodeId = get().position.currentNodeId;
        const edges = matrixStore.edges;
        
        const adjacentIds = edges
          .filter(e => e.source === currentNodeId || e.target === currentNodeId)
          .map(e => e.source === currentNodeId ? e.target : e.source);

        return matrixStore.nodes.filter(n => adjacentIds.includes(n.id));
      },

      getCurrentNode: () => {
        const matrixStore = useMatrixStore.getState();
        const currentNodeId = get().position.currentNodeId;
        return matrixStore.nodes.find(n => n.id === currentNodeId) ?? null;
      },

      // Fork Actions
      getForkAtCurrentNode: () => {
        const currentNodeId = get().position.currentNodeId;
        return get().forkChoices.find(f => f.nodeId === currentNodeId) ?? null;
      },

      chooseForkPath: (choiceLabel: string) => {
        const fork = get().getForkAtCurrentNode();
        if (!fork) {
          console.warn('No fork at current node');
          return false;
        }

        const choice = fork.choices.find(c => c.label === choiceLabel);
        if (!choice) {
          console.warn(`Choice "${choiceLabel}" not found`);
          return false;
        }

        // Record the choice
        set(state => ({
          forkChoices: state.forkChoices.map(f =>
            f.nodeId === fork.nodeId
              ? { ...f, selectedChoice: choiceLabel, timestamp: new Date().toISOString() }
              : f
          ),
        }));

        // Navigate to the chosen path
        return get().navigateTo(choice.targetNodeId);
      },

      previewForkPath: (choiceLabel: string) => {
        const fork = get().getForkAtCurrentNode();
        if (!fork) return 'No fork at current location.';

        const choice = fork.choices.find(c => c.label === choiceLabel);
        if (!choice) return `Choice "${choiceLabel}" not found.`;

        return `${choice.description}\n${choice.consequence ? `\nConsequence: ${choice.consequence}` : ''}`;
      },

      // Challenge Actions
      startChallenge: (nodeId: string, questId: string) => {
        const quest = QUESTS.find(q => q.id === questId);
        if (!quest) {
          console.warn(`Quest ${questId} not found`);
          return false;
        }

        set({
          activeChallenge: {
            nodeId,
            questId,
            startedAt: new Date().toISOString(),
            attempts: 0,
          },
        });

        return true;
      },

      submitSolution: async (code: string) => {
        const { activeChallenge } = get();
        if (!activeChallenge) {
          return { success: false, feedback: 'No active challenge' };
        }

        // TODO: Implement actual solution validation via API
        // For now, simulate validation
        const isValid = code.length > 10; // Placeholder logic

        set(state => ({
          activeChallenge: state.activeChallenge
            ? {
                ...state.activeChallenge,
                attempts: state.activeChallenge.attempts + 1,
                lastSubmission: {
                  code,
                  result: isValid ? 'pass' : 'fail',
                  feedback: isValid ? 'Solution accepted!' : 'Solution incomplete.',
                  timestamp: new Date().toISOString(),
                },
              }
            : null,
        }));

        if (isValid) {
          get().completeNodeQuest(activeChallenge.nodeId);
        }

        return {
          success: isValid,
          feedback: isValid ? 'Challenge completed!' : 'Try again.',
        };
      },

      abandonChallenge: () => {
        set({ activeChallenge: null });
      },

      // Quest Integration
      syncQuestToMatrix: (questId: string) => {
        const quest = QUESTS.find(q => q.id === questId);
        if (!quest) return;

        const skillTreeStore = useSkillTreeStore.getState();

        // When quest completes, unlock nodes
        skillTreeStore.completeQuest(questId);
        
        // TODO: Create corresponding matrix nodes for quest skills
        // This is where we'd dynamically generate graph nodes
        // const matrixStore = useMatrixStore.getState();
      },

      completeNodeQuest: (nodeId: string) => {
        const { activeChallenge } = get();
        
        if (activeChallenge && activeChallenge.nodeId === nodeId) {
          const matrixStore = useMatrixStore.getState();
          const skillTreeStore = useSkillTreeStore.getState();
          
          // Complete the quest
          skillTreeStore.completeQuest(activeChallenge.questId);
          
          // Update node status
          matrixStore.updateNode(nodeId, {
            status: 'completed',
            progress: 100,
          });

          // Clear active challenge
          set({ activeChallenge: null });
        }
      },

      // Utilities
      calculateLevel: () => {
        const skillTreeStore = useSkillTreeStore.getState();
        const xp = skillTreeStore.currentXP;
        
        // XP curve: Level = floor(sqrt(XP / 100))
        // Level 1: 0 XP
        // Level 2: 100 XP
        // Level 3: 400 XP
        // Level 4: 900 XP
        // Level 5: 1600 XP
        return Math.floor(Math.sqrt(xp / 100)) + 1;
      },

      getPlayerStats: () => {
        const skillTreeStore = useSkillTreeStore.getState();
        const matrixStore = useMatrixStore.getState();
        
        return {
          xp: skillTreeStore.currentXP,
          gold: skillTreeStore.gold,
          level: get().calculateLevel(),
          completedQuests: skillTreeStore.completedQuests.length,
          unlockedSkills: skillTreeStore.unlockedSkills.length,
          nodesCompleted: matrixStore.nodes.filter(n => n.data.status === 'completed').length,
        };
      },

      // Reset
      resetGame: () => {
        set({
          position: {
            currentNodeId: '0',
            previousNodeId: null,
            pathHistory: ['0'],
          },
          activeChallenge: null,
          forkChoices: [],
          level: 1,
        });
        
        useMatrixStore.getState().resetMatrix();
        // Note: SkillTreeStore doesn't have reset, but we could add it
      },
    }),
    {
      name: 'apex-game-engine',
      version: 1,
      partialize: (state) => ({
        position: state.position,
        activeChallenge: state.activeChallenge,
        forkChoices: state.forkChoices,
      }),
    }
  )
);
