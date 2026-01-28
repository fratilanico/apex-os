import type { Achievement } from '../types/achievement';

/**
 * APEX OS: SOVEREIGN PROTOCOL - ACHIEVEMENT DEFINITIONS
 * 
 * 50 Achievements across 6 categories
 */

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // ==========================
  // STORY ACHIEVEMENTS (10)
  // ==========================
  {
    id: 'act-1-complete',
    name: 'The Awakening',
    description: 'Complete Act I of APEX OS',
    icon: '🌅',
    category: 'story',
    rarity: 'common',
    xpReward: 300,
    goldReward: 150,
    hidden: false,
    condition: { type: 'custom', value: 'act_1_complete' },
  },
  
  {
    id: 'act-2-complete',
    name: 'The Trials',
    description: 'Complete Act II and face the challenges',
    icon: '⚔️',
    category: 'story',
    rarity: 'uncommon',
    xpReward: 600,
    goldReward: 300,
    hidden: false,
    condition: { type: 'custom', value: 'act_2_complete' },
  },
  
  {
    id: 'act-3-complete',
    name: 'The Truth Revealed',
    description: 'Complete Act III and discover the simulation',
    icon: '🔮',
    category: 'story',
    rarity: 'rare',
    xpReward: 1000,
    goldReward: 500,
    hidden: false,
    condition: { type: 'custom', value: 'act_3_complete' },
  },
  
  {
    id: 'ending-revolutionary',
    name: 'The Revolutionary',
    description: 'Choose collaboration over control',
    icon: '🤝',
    category: 'story',
    rarity: 'rare',
    xpReward: 1500,
    goldReward: 750,
    hidden: false,
    condition: { type: 'custom', value: 'ending_revolutionary' },
  },
  
  {
    id: 'ending-controller',
    name: 'The Controller',
    description: 'Choose dominance over partnership',
    icon: '👑',
    category: 'story',
    rarity: 'rare',
    xpReward: 1500,
    goldReward: 750,
    hidden: false,
    condition: { type: 'custom', value: 'ending_controller' },
  },
  
  {
    id: 'ending-harmonizer',
    name: 'The Harmonizer',
    description: 'Achieve perfect balance and the true ending',
    icon: '⚖️',
    category: 'story',
    rarity: 'legendary',
    xpReward: 3000,
    goldReward: 1500,
    hidden: false,
    condition: { type: 'custom', value: 'ending_harmonizer' },
  },
  
  {
    id: 'maestro-betrayal',
    name: 'The Betrayal',
    description: 'Discover Maestro\'s true intentions',
    icon: '🎭',
    category: 'story',
    rarity: 'uncommon',
    xpReward: 800,
    goldReward: 400,
    hidden: true,
    condition: { type: 'custom', value: 'maestro_betrayal' },
  },
  
  {
    id: 'gemini-prophecy',
    name: 'The Prophecy Fulfilled',
    description: 'Witness Gemini\'s prediction come true',
    icon: '🔭',
    category: 'story',
    rarity: 'rare',
    xpReward: 400,
    goldReward: 200,
    hidden: true,
    condition: { type: 'custom', value: 'prophecy_fulfilled' },
  },
  
  {
    id: 'lore-collector',
    name: 'Lore Collector',
    description: 'Collect 25 lore fragments',
    icon: '📜',
    category: 'collection',
    rarity: 'uncommon',
    xpReward: 200,
    goldReward: 100,
    hidden: false,
    condition: { type: 'collect_all', value: 25 },
  },
  
  {
    id: 'lore-master',
    name: 'Lore Master',
    description: 'Collect all 50 lore fragments',
    icon: '📚',
    category: 'collection',
    rarity: 'rare',
    xpReward: 500,
    goldReward: 250,
    hidden: false,
    condition: { type: 'collect_all', value: 50 },
  },
  
  // ==========================
  // BOSS ACHIEVEMENTS (10)
  // ==========================
  {
    id: 'boss-imposter',
    name: 'I Am Enough',
    description: 'Defeat the Imposter Syndrome Demon',
    icon: '💪',
    category: 'boss',
    rarity: 'common',
    xpReward: 500,
    goldReward: 300,
    hidden: false,
    condition: { type: 'boss_defeat', value: 'imposter' },
  },
  
  {
    id: 'boss-lag-beast',
    name: 'Optimized',
    description: 'Defeat the Lag Beast',
    icon: '⚡',
    category: 'boss',
    rarity: 'uncommon',
    xpReward: 750,
    goldReward: 450,
    hidden: false,
    condition: { type: 'boss_defeat', value: 'lag-beast' },
  },
  
  {
    id: 'boss-hydra',
    name: 'Trust But Verify',
    description: 'Defeat the Hallucination Hydra',
    icon: '🐍',
    category: 'boss',
    rarity: 'uncommon',
    xpReward: 1000,
    goldReward: 600,
    hidden: false,
    condition: { type: 'boss_defeat', value: 'hydra' },
  },
  
  {
    id: 'boss-phantom',
    name: 'Done Is Better Than Perfect',
    description: 'Defeat the Pixel Phantom',
    icon: '👻',
    category: 'boss',
    rarity: 'uncommon',
    xpReward: 1200,
    goldReward: 750,
    hidden: false,
    condition: { type: 'boss_defeat', value: 'phantom' },
  },
  
  {
    id: 'boss-monolith',
    name: 'Monolith Slayer',
    description: 'Modernize the Legacy Monolith',
    icon: '🗿',
    category: 'boss',
    rarity: 'rare',
    xpReward: 2000,
    goldReward: 1000,
    hidden: false,
    condition: { type: 'boss_defeat', value: 'monolith' },
  },
  
  {
    id: 'all-bosses',
    name: 'Boss Slayer',
    description: 'Defeat all 5 bosses',
    icon: '⚔️',
    category: 'boss',
    rarity: 'rare',
    xpReward: 2000,
    goldReward: 1000,
    hidden: false,
    condition: { type: 'custom', value: 'all_bosses' },
  },
  
  {
    id: 'flawless-boss',
    name: 'Flawless Victory',
    description: 'Defeat a boss without using any hints',
    icon: '💎',
    category: 'boss',
    rarity: 'epic',
    xpReward: 400,
    goldReward: 200,
    hidden: false,
    condition: { type: 'no_hints', value: 1 },
  },
  
  {
    id: 'speed-boss',
    name: 'Speed Demon',
    description: 'Defeat a boss in under 5 minutes',
    icon: '🏃',
    category: 'speed',
    rarity: 'epic',
    xpReward: 350,
    goldReward: 175,
    hidden: false,
    condition: { type: 'speed_clear', value: 300 },
  },
  
  {
    id: 'perfect-symphony',
    name: 'Perfect Symphony',
    description: 'Defeat the Monolith with perfect orchestration',
    icon: '🎼',
    category: 'boss',
    rarity: 'legendary',
    xpReward: 3000,
    goldReward: 1500,
    hidden: false,
    condition: { type: 'custom', value: 'monolith_perfect' },
  },
  
  {
    id: 'untouchable',
    name: 'Untouchable',
    description: 'Complete all bosses without a single retry',
    icon: '🛡️',
    category: 'challenge',
    rarity: 'legendary',
    xpReward: 5000,
    goldReward: 2500,
    hidden: true,
    condition: { type: 'no_deaths', value: 1 },
  },
  
  // ==========================
  // NPC ACHIEVEMENTS (10)
  // ==========================
  {
    id: 'first-friend',
    name: 'First Friend',
    description: 'Reach relationship level 25 with any NPC',
    icon: '🤝',
    category: 'npc',
    rarity: 'common',
    xpReward: 100,
    goldReward: 50,
    hidden: false,
    condition: { type: 'custom', value: 'relationship_25' },
  },
  
  {
    id: 'close-bond',
    name: 'Close Bond',
    description: 'Reach relationship level 50 with any NPC',
    icon: '💙',
    category: 'npc',
    rarity: 'uncommon',
    xpReward: 250,
    goldReward: 125,
    hidden: false,
    condition: { type: 'custom', value: 'relationship_50' },
  },
  
  {
    id: 'unbreakable-bond',
    name: 'Unbreakable Bond',
    description: 'Max relationship with any NPC',
    icon: '💖',
    category: 'npc',
    rarity: 'uncommon',
    xpReward: 500,
    goldReward: 250,
    hidden: false,
    condition: { type: 'npc_max_relationship', value: 'any' },
  },
  
  {
    id: 'claude-bond',
    name: 'The Architect\'s Wisdom',
    description: 'Max relationship with Claude',
    icon: '🏛️',
    category: 'npc',
    rarity: 'uncommon',
    xpReward: 400,
    goldReward: 200,
    hidden: false,
    condition: { type: 'npc_max_relationship', value: 'claude' },
  },
  
  {
    id: 'cursor-bond',
    name: 'The Builder\'s Speed',
    description: 'Max relationship with Cursor',
    icon: '▶️',
    category: 'npc',
    rarity: 'uncommon',
    xpReward: 400,
    goldReward: 200,
    hidden: false,
    condition: { type: 'npc_max_relationship', value: 'cursor' },
  },
  
  {
    id: 'gemini-bond',
    name: 'The Oracle\'s Sight',
    description: 'Max relationship with Gemini',
    icon: '🔮',
    category: 'npc',
    rarity: 'uncommon',
    xpReward: 400,
    goldReward: 200,
    hidden: false,
    condition: { type: 'npc_max_relationship', value: 'gemini' },
  },
  
  {
    id: 'dexter-bond',
    name: 'The Debugger\'s Precision',
    description: 'Max relationship with Dexter',
    icon: '🔍',
    category: 'npc',
    rarity: 'uncommon',
    xpReward: 400,
    goldReward: 200,
    hidden: false,
    condition: { type: 'npc_max_relationship', value: 'dexter' },
  },
  
  {
    id: 'pixel-bond',
    name: 'The Visualizer\'s Beauty',
    description: 'Max relationship with Pixel',
    icon: '✨',
    category: 'npc',
    rarity: 'uncommon',
    xpReward: 400,
    goldReward: 200,
    hidden: false,
    condition: { type: 'npc_max_relationship', value: 'pixel' },
  },
  
  {
    id: 'full-team',
    name: 'The Full Team',
    description: 'Reach level 50+ with all 5 core NPCs',
    icon: '👥',
    category: 'npc',
    rarity: 'rare',
    xpReward: 1000,
    goldReward: 500,
    hidden: false,
    condition: { type: 'custom', value: 'all_npcs_50' },
  },
  
  {
    id: 'perfect-harmony',
    name: 'Perfect Harmony',
    description: 'Max relationship with ALL NPCs',
    icon: '🌟',
    category: 'npc',
    rarity: 'legendary',
    xpReward: 2500,
    goldReward: 1250,
    hidden: false,
    condition: { type: 'custom', value: 'all_npcs_max' },
  },
  
  // ==========================
  // MASTERY ACHIEVEMENTS (10)
  // ==========================
  {
    id: 'first-delegation',
    name: 'First Steps',
    description: 'Delegate your first task to an AI agent',
    icon: '👶',
    category: 'mastery',
    rarity: 'common',
    xpReward: 50,
    goldReward: 25,
    hidden: false,
    condition: { type: 'custom', value: 'delegation_1' },
  },
  
  {
    id: 'delegation-apprentice',
    name: 'Delegation Apprentice',
    description: 'Successfully delegate 10 tasks',
    icon: '🎓',
    category: 'mastery',
    rarity: 'common',
    xpReward: 100,
    goldReward: 50,
    hidden: false,
    condition: { type: 'custom', value: 'delegation_10' },
  },
  
  {
    id: 'delegation-master',
    name: 'Delegation Master',
    description: 'Successfully delegate 50 tasks',
    icon: '🏆',
    category: 'mastery',
    rarity: 'uncommon',
    xpReward: 300,
    goldReward: 150,
    hidden: false,
    condition: { type: 'custom', value: 'delegation_50' },
  },
  
  {
    id: 'perfect-conductor',
    name: 'Perfect Conductor',
    description: 'Complete a challenge with 100% optimal decisions',
    icon: '🎯',
    category: 'mastery',
    rarity: 'epic',
    xpReward: 500,
    goldReward: 250,
    hidden: false,
    condition: { type: 'custom', value: 'perfect_challenge' },
  },
  
  {
    id: 'orchestration-101',
    name: 'Orchestration 101',
    description: 'Coordinate 2 agents in a single task',
    icon: '🎭',
    category: 'mastery',
    rarity: 'common',
    xpReward: 150,
    goldReward: 75,
    hidden: false,
    condition: { type: 'custom', value: 'multi_agent_2' },
  },
  
  {
    id: 'full-symphony',
    name: 'The Full Symphony',
    description: 'Orchestrate all 5 agents in perfect harmony',
    icon: '🎼',
    category: 'mastery',
    rarity: 'rare',
    xpReward: 750,
    goldReward: 400,
    hidden: false,
    condition: { type: 'custom', value: 'all_agents_5' },
  },
  
  {
    id: 'cursor-dexter-synergy',
    name: 'Speed Meets Quality',
    description: 'Successfully coordinate Cursor and Dexter',
    icon: '⚡',
    category: 'mastery',
    rarity: 'uncommon',
    xpReward: 300,
    goldReward: 150,
    hidden: false,
    condition: { type: 'custom', value: 'cursor_dexter_combo' },
  },
  
  {
    id: 'gemini-dexter-synergy',
    name: 'Pattern and Proof',
    description: 'Successfully coordinate Gemini and Dexter',
    icon: '🔮',
    category: 'mastery',
    rarity: 'uncommon',
    xpReward: 300,
    goldReward: 150,
    hidden: false,
    condition: { type: 'custom', value: 'gemini_dexter_combo' },
  },
  
  {
    id: 'all-quests',
    name: 'Quest Completionist',
    description: 'Complete all 30 quests',
    icon: '✅',
    category: 'collection',
    rarity: 'rare',
    xpReward: 2000,
    goldReward: 1000,
    hidden: false,
    condition: { type: 'quest_complete', value: 30 },
  },
  
  {
    id: 'side-quest-master',
    name: 'Side Quest Master',
    description: 'Complete all NPC side quest chains',
    icon: '📋',
    category: 'collection',
    rarity: 'uncommon',
    xpReward: 1000,
    goldReward: 500,
    hidden: false,
    condition: { type: 'custom', value: 'all_side_quests' },
  },
  
  // ==========================
  // META ACHIEVEMENTS (10)
  // ==========================
  {
    id: 'achievement-hunter',
    name: 'Achievement Hunter',
    description: 'Unlock 25 achievements',
    icon: '🏅',
    category: 'collection',
    rarity: 'uncommon',
    xpReward: 500,
    goldReward: 250,
    hidden: false,
    condition: { type: 'custom', value: 'achievements_25' },
  },
  
  {
    id: 'true-completionist',
    name: 'True Completionist',
    description: 'Unlock ALL 50 achievements',
    icon: '👑',
    category: 'collection',
    rarity: 'legendary',
    xpReward: 5000,
    goldReward: 2500,
    hidden: false,
    condition: { type: 'collect_all', value: 50 },
  },
  
  {
    id: 'the-philosopher',
    name: 'The Philosopher',
    description: 'Read all dialogue options in the game',
    icon: '💭',
    category: 'discovery',
    rarity: 'rare',
    xpReward: 800,
    goldReward: 400,
    hidden: true,
    condition: { type: 'custom', value: 'all_dialogue' },
  },
  
  {
    id: 'new-game-plus',
    name: 'Again, But Different',
    description: 'Complete the game twice with different endings',
    icon: '🔄',
    category: 'challenge',
    rarity: 'rare',
    xpReward: 2000,
    goldReward: 1000,
    hidden: false,
    condition: { type: 'custom', value: 'two_endings' },
  },
  
  {
    id: 'speed-runner',
    name: 'Efficiency Expert',
    description: 'Complete the game in under 4 hours',
    icon: '⏱️',
    category: 'speed',
    rarity: 'legendary',
    xpReward: 3000,
    goldReward: 1500,
    hidden: true,
    condition: { type: 'speed_clear', value: 14400 },
  },
  
  {
    id: 'the-ultimate',
    name: 'The Ultimate',
    description: 'Achieve 100% completion: all endings, quests, achievements',
    icon: '👑',
    category: 'challenge',
    rarity: 'legendary',
    xpReward: 10000,
    goldReward: 5000,
    hidden: true,
    condition: { type: 'custom', value: 'true_100_percent' },
  },
  
  {
    id: 'learning-curve',
    name: 'The Learning Curve',
    description: 'Improve from 50% success rate to 90%+',
    icon: '📈',
    category: 'mastery',
    rarity: 'uncommon',
    xpReward: 400,
    goldReward: 200,
    hidden: false,
    condition: { type: 'custom', value: 'improvement_40' },
  },
  
  {
    id: 'secret-seeker',
    name: 'Secret Seeker',
    description: 'Unlock all hidden achievements',
    icon: '🔓',
    category: 'discovery',
    rarity: 'epic',
    xpReward: 1500,
    goldReward: 750,
    hidden: true,
    condition: { type: 'custom', value: 'all_secret_achievements' },
  },
  
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Share APEX OS with 5 friends',
    icon: '🦋',
    category: 'social',
    rarity: 'uncommon',
    xpReward: 300,
    goldReward: 150,
    hidden: false,
    condition: { type: 'custom', value: 'referral_5' },
  },
  
  {
    id: 'apex-evangelist',
    name: 'APEX Evangelist',
    description: 'Share APEX OS with 25 people',
    icon: '📢',
    category: 'social',
    rarity: 'epic',
    xpReward: 1000,
    goldReward: 500,
    hidden: false,
    condition: { type: 'custom', value: 'referral_25' },
  },
];

// Helper functions
export const ACHIEVEMENT_MAP = new Map(
  ALL_ACHIEVEMENTS.map(a => [a.id, a])
);

export function getAchievementsByCategory(category: string) {
  return ALL_ACHIEVEMENTS.filter(a => a.category === category);
}

export function getSecretAchievements() {
  return ALL_ACHIEVEMENTS.filter(a => a.hidden);
}
