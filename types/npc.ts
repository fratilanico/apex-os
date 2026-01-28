/**
 * NPC System Type Definitions
 * 
 * Defines NPCs (AI tools as characters) with:
 * - Personalities and dialogue trees
 * - Relationship progression
 * - Side quest chains
 * - Dynamic conversations based on game state
 */

export type NPCId = 
  | 'claude'    // The Architect
  | 'cursor'    // The Builder
  | 'gemini'    // The Oracle
  | 'dexter'    // The Debugger
  | 'pixel'     // The Visualizer
  | 'maestro';  // The Conductor

export type PersonalityTone = 
  | 'wise'
  | 'sarcastic'
  | 'mysterious'
  | 'enthusiastic'
  | 'analytical'
  | 'commanding';

export interface PersonalityProfile {
  tone: PersonalityTone;
  speechPattern: string;
  quirks: string[];
  likes: string[];
  dislikes: string[];
}

export type DialogueTriggerType =
  | 'first_meet'
  | 'quest_stage'
  | 'level_up'
  | 'boss_defeat'
  | 'item_have'
  | 'relationship_threshold'
  | 'random'
  | 'story_flag';

export interface DialogueTrigger {
  type: DialogueTriggerType;
  condition: string;
  minRelationship?: number;
  maxRelationship?: number;
  requiredQuestComplete?: string[];
  requiredStoryFlag?: string[];
}

export type DialogueAnimation = 
  | 'normal'
  | 'angry'
  | 'happy'
  | 'mysterious'
  | 'glitch'
  | 'sad'
  | 'excited';

export interface DialogueLine {
  speaker: string;
  text: string;
  animation?: DialogueAnimation;
  delay?: number;
}

export interface PlayerChoice {
  text: string;
  nextNode: string | null;
  relationshipChange?: number;
  unlocks?: string;
  consequence?: string;
  requiresLevel?: number;
}

export interface DialogueNode {
  id: string;
  trigger: DialogueTrigger;
  lines: DialogueLine[];
  choices?: PlayerChoice[];
  effects?: DialogueEffect[];
  oneTime?: boolean;
}

export interface DialogueEffect {
  type: 'xp' | 'gold' | 'unlock_quest' | 'unlock_npc' | 'story_flag' | 'item';
  value: string | number;
}

export interface UnlockCondition {
  type: 'quest_complete' | 'level' | 'story_flag' | 'always';
  value?: string | number;
}

export interface SideQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  goldReward?: number;
  relationshipReward: number;
}

export interface NPC {
  id: NPCId;
  name: string;
  title: string;
  tool: string;
  personality: PersonalityProfile;
  portrait: string;
  portraitColor: string;
  unlockCondition: UnlockCondition;
  dialogueTree: DialogueNode[];
  sideQuestChain: SideQuest[];
  maxRelationship: number;
  backstory: string;
}

export interface NPCRelationship {
  npcId: NPCId;
  level: number;
  lastInteraction: string;
  completedSideQuests: string[];
  dialogueHistory: string[];
}

export interface ActiveDialogue {
  npcId: NPCId;
  currentNodeId: string;
  history: DialogueLine[];
}
