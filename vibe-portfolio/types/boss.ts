/**
 * Boss Battle System Type Definitions
 * 
 * Defines epic multi-phase boss battles where players:
 * - Direct AI agents to solve challenges
 * - Make strategic decisions
 * - Face escalating difficulty
 * - Earn major rewards
 */

export type BossId =
  | 'imposter'    // The Imposter Syndrome Demon
  | 'lag-beast'   // The Lag Beast
  | 'hydra'       // The Hallucination Hydra
  | 'phantom'     // The Pixel Phantom
  | 'monolith';   // The Legacy Monolith

export type ChallengeType =
  | 'delegation'      // Assign the right AI to the right task
  | 'evaluation'      // Pick the best solution from multiple options
  | 'specification'   // Give clear, specific feedback
  | 'strategy'        // Choose the right approach
  | 'orchestration'   // Coordinate multiple AIs
  | 'decision';       // Make a critical choice

export interface ChallengeVariant {
  prompt: string;
  context?: string;
  options?: string[];
  correctAnswer?: string | string[];
  hints: string[];
  timeLimit?: number;
  allowedAttempts?: number;
}

export interface ChallengeDefinition {
  type: ChallengeType;
  prompt: string;
  description: string;
  adaptiveDifficulty: {
    beginner: ChallengeVariant;
    intermediate: ChallengeVariant;
    advanced: ChallengeVariant;
  };
}

export interface BossMechanic {
  name: string;
  description: string;
  visualEffect: string;
  counterStrategy: string;
  triggersAt: number; // HP percentage
}

export interface BossPhase {
  number: number;
  healthPercent: number;
  name: string;
  challenge: ChallengeDefinition;
  dialogue: {
    start: string[];
    success: string[];
    failure: string[];
    hint?: string[];
  };
  mechanic?: BossMechanic;
  timeLimit?: number;
  helperNPC?: string;
}

export interface BossRewards {
  xp: number;
  gold: number;
  achievements: string[];
  unlocks: {
    npcs?: string[];
    skills?: string[];
    areas?: string[];
    quests?: string[];
  };
  loreFragment?: string;
}

export interface BossBattle {
  id: BossId;
  name: string;
  title: string;
  act: number;
  location: string;
  theme: string;
  asciiArt: string;
  maxHealth: number;
  phases: BossPhase[];
  rewards: BossRewards;
  introDialogue: string[];
  defeatDialogue: string[];
  victoryDialogue: string[];
  unlockCondition: {
    type: 'quest_complete' | 'level' | 'story_flag';
    value: string | number;
  };
}

export interface BossAttempt {
  bossId: BossId;
  phase: number;
  attempts: number;
  hintsUsed: number;
  timeSpent: number;
  startedAt: string;
}

export interface BossState {
  currentBoss: BossId | null;
  currentPhase: number;
  currentHealth: number;
  attempt: BossAttempt | null;
  defeatedBosses: BossId[];
  bossStats: Record<BossId, {
    attempts: number;
    defeated: boolean;
    bestTime?: number;
    flawless?: boolean;
  }>;
}

export interface BossChoice {
  id: string;
  text: string;
  consequence: string;
  damage?: number;
  heal?: number;
  effect?: string;
}
