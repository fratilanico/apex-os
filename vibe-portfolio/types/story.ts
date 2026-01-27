/**
 * Story & Narrative System Type Definitions
 * 
 * Defines the overarching narrative:
 * - 4 Acts with chapters
 * - Plot progression and branching
 * - Cutscenes and cinematics
 * - Lore collection
 * - Multiple endings
 */

export type Act = 1 | 2 | 3 | 4;

export type EndingType =
  | 'revolutionary'  // Destroy and rebuild
  | 'evolutionary'   // Transform gradually (TRUE ENDING)
  | 'respectful';    // Preserve and honor

export interface StoryState {
  currentAct: Act;
  currentChapter: number;
  majorDecisions: StoryDecision[];
  discoveredLore: string[];
  plotFlags: Record<string, boolean>;
  ending: EndingType | null;
  completedCutscenes: string[];
}

export interface StoryDecision {
  id: string;
  quest: string;
  choice: string;
  consequences: string[];
  timestamp: string;
  affectedNPCs?: string[];
  affectedStoryFlags?: string[];
}

export type CutsceneEffect =
  | 'fade'
  | 'shake'
  | 'glitch'
  | 'typewriter'
  | 'flash'
  | 'zoom'
  | 'static';

export interface CutsceneLine {
  speaker: string | null;
  text: string;
  effect?: CutsceneEffect;
  delay?: number;
  music?: string;
  background?: string;
}

export interface Cutscene {
  id: string;
  title: string;
  trigger: {
    type: 'quest_complete' | 'boss_defeat' | 'act_start' | 'decision' | 'manual';
    value: string;
  };
  lines: CutsceneLine[];
  skippable: boolean;
  onComplete?: {
    unlockQuests?: string[];
    unlockNPCs?: string[];
    setFlags?: Record<string, boolean>;
  };
}

export type LoreCategory =
  | 'history'      // The Matrix's origin
  | 'character'    // NPC backstories
  | 'world'        // How the world works
  | 'secret'       // Hidden truths
  | 'technical';   // AI orchestration lore

export interface LoreFragment {
  id: string;
  title: string;
  content: string;
  discoveredIn: string;
  category: LoreCategory;
  unlockCondition?: {
    type: 'quest' | 'boss' | 'npc_relationship' | 'achievement';
    value: string | number;
  };
  discoveredAt?: string;
}

export interface ActInfo {
  number: Act;
  title: string;
  theme: string;
  description: string;
  chapters: ChapterInfo[];
}

export interface ChapterInfo {
  number: number;
  title: string;
  description: string;
  quests: string[];
  cutscenes: string[];
}

export interface StoryProgress {
  currentAct: Act;
  currentChapter: number;
  actProgress: Record<Act, {
    started: boolean;
    completed: boolean;
    chaptersCompleted: number;
  }>;
  decisionsCount: number;
  loreCollected: number;
  totalLore: number;
  endingAchieved: EndingType | null;
}
