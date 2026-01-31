/**
 * Command handler types for terminal commands
 * Defines the contract for all command handlers
 */

import type { MatrixNode, MatrixEdge, DirectorPayload } from '@/types/matrix';
import type { Quest } from '@/data/questsData';

/**
 * Terminal line types for output
 */
export type TerminalLineType = 'input' | 'output' | 'error' | 'system' | 'ai' | 'branding';

/**
 * Terminal line interface
 */
export interface ApexTerminalLine {
  id: string;
  type: TerminalLineType;
  content: string;
  timestamp: number;
}

/**
 * Player position interface
 */
export interface PlayerPosition {
  currentNodeId: string;
  previousNodeId: string | null;
  pathHistory: string[];
}

/**
 * Challenge state interface
 */
export interface ChallengeState {
  nodeId: string;
  questId: string;
  startedAt: string;
  attempts: number;
}

/**
 * Skill progress interface
 */
export interface SkillProgress {
  skillId: string;
  progress: number;
  unlockedAt: string;
  lastUpdated: string;
}

/**
 * Game engine store interface
 */
export interface GameEngineStore {
  position: PlayerPosition;
  activeChallenge: ChallengeState | null;
  navigateTo: (nodeId: string) => boolean;
  getAdjacentNodes: () => MatrixNode[];
  getCurrentNode: () => MatrixNode | null;
  startChallenge: (nodeId: string, questId: string) => boolean;
  submitSolution: (code: string) => Promise<{ success: boolean; feedback: string }>;
  abandonChallenge: () => void;
  getPlayerStats: () => {
    xp: number;
    gold: number;
    level: number;
    completedQuests: number;
    unlockedSkills: number;
    nodesCompleted: number;
  };
}

/**
 * Skill tree store interface
 */
export interface SkillTreeStore {
  unlockedSkills: string[];
  completedQuests: string[];
  getSkillProgress: (skillId: string) => SkillProgress | null;
  getActiveQuest: () => Quest | null;
  getAvailableQuests: () => Quest[];
}

/**
 * Matrix store interface
 */
export interface MatrixStore {
  nodes: MatrixNode[];
  edges: MatrixEdge[];
  syncTerminalContext: (log: string) => void;
  processDirectorResponse: (payload: DirectorPayload) => void;
}

/**
 * Context passed to all command handlers
 */
export interface CommandContext {
  /** Add a line to the terminal output */
  addLine: (type: TerminalLineType, content: string) => void;
  /** Set all terminal lines (replaces current output) */
  setLines: (lines: ApexTerminalLine[]) => void;
  /** Game engine store instance */
  gameEngine: GameEngineStore;
  /** Skill tree store instance */
  skillTree: SkillTreeStore;
  /** Matrix store instance */
  matrixStore: MatrixStore;
  /** Call AI service with message */
  callAI: (message: string) => Promise<string>;
  /** Set processing state */
  setIsProcessing: (isProcessing: boolean) => void;
  /** Clear terminal session */
  clearSession: () => void;
  /** Set command history */
  setCommandHistory: (history: string[]) => void;
  /** Set history index */
  setHistoryIndex: (index: number) => void;
  /** Set input value */
  setInput: (input: string) => void;
}

/**
 * Command handler function signature
 */
export type CommandHandler = (
  context: CommandContext,
  args: string[]
) => Promise<string | void> | string | void;

/**
 * Command registry entry
 */
export interface CommandEntry {
  /** Command name */
  name: string;
  /** Handler function */
  handler: CommandHandler;
  /** Brief description for help */
  description: string;
  /** Usage example */
  usage?: string;
  /** Category for grouping in help */
  category: CommandCategory;
}

/**
 * Command categories for organization
 */
export type CommandCategory =
  | 'ai'
  | 'navigation'
  | 'status'
  | 'challenges'
  | 'utilities';

/**
 * Command result wrapper for consistent returns
 */
export interface CommandResult {
  /** Success status */
  success: boolean;
  /** Output message */
  message: string;
  /** Optional error code */
  exitCode?: number;
}
