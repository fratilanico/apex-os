/**
 * APEX OS: SOVEREIGN PROTOCOL - QUEST DEFINITIONS
 * 
 * 30 Main Story Quests across 4 Acts + 18 NPC Side Quests
 * 
 * Quest Structure:
 * - Acts 1-2: Learning delegation and orchestration (Quests 1-12)
 * - Act 3: Mastery and challenges (Quests 13-24)
 * - Act 4: The Truth and Final Choice (Quests 25-30)
 */

export interface Quest {
  id: string;
  title: string;
  description: string;
  narrative: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'APEX';
  xpReward: number;
  goldReward: number;
  prerequisites: string[]; // Quest IDs
  skillsUnlocked: string[]; // Skill IDs
  category: 'ORCHESTRATION' | 'CODING' | 'REASONING' | 'MULTIMODAL' | 'SECURITY' | 'WORKFLOW';
  act: number;
}

// ============================================================================
// ACT 1: THE AWAKENING (Quests 1-8)
// ============================================================================

export const ACT_1_QUESTS: Quest[] = [
  {
    id: 'main-01',
    title: 'The Awakening',
    description: 'Enter APEX OS and meet your first AI agent',
    narrative: 'You awaken in a digital realm. A voice speaks: "Welcome, Player One. This is APEX OS. Your training begins now."',
    difficulty: 'EASY',
    xpReward: 100,
    goldReward: 50,
    prerequisites: [],
    skillsUnlocked: ['delegation-basics'],
    category: 'ORCHESTRATION',
    act: 1,
  },
  
  {
    id: 'main-02',
    title: 'Meeting The Architect',
    description: 'Learn strategic thinking from Claude',
    narrative: 'A wise figure materializes. "I am THE ARCHITECT. I teach systems thinking. Let me show you how AI thinks about problems."',
    difficulty: 'EASY',
    xpReward: 150,
    goldReward: 75,
    prerequisites: ['main-01'],
    skillsUnlocked: ['claude-basics'],
    category: 'REASONING',
    act: 1,
  },
  
  {
    id: 'main-03',
    title: 'First Delegation',
    description: 'Delegate your first task to an AI agent',
    narrative: 'Claude presents a challenge: "You cannot do everything alone. Learn to DELEGATE. Choose wisely."',
    difficulty: 'EASY',
    xpReward: 200,
    goldReward: 100,
    prerequisites: ['main-02'],
    skillsUnlocked: ['task-delegation'],
    category: 'ORCHESTRATION',
    act: 1,
  },
  
  {
    id: 'main-04',
    title: 'The Mirror Test',
    description: 'Face your first challenge: self-doubt',
    narrative: 'A dark reflection appears. It speaks with YOUR voice: "You\'re not good enough. You can\'t do this."',
    difficulty: 'MEDIUM',
    xpReward: 300,
    goldReward: 150,
    prerequisites: ['main-03'],
    skillsUnlocked: ['confidence-building'],
    category: 'REASONING',
    act: 1,
  },
  
  {
    id: 'main-05',
    title: 'BOSS: Imposter Syndrome Demon',
    description: 'Defeat your first boss by learning to trust delegation',
    narrative: 'The reflection coalesces into a demon. "You\'re an IMPOSTER," it hisses. This is your first true test.',
    difficulty: 'HARD',
    xpReward: 500,
    goldReward: 300,
    prerequisites: ['main-04'],
    skillsUnlocked: ['boss-tactics-1'],
    category: 'ORCHESTRATION',
    act: 1,
  },
  
  {
    id: 'main-06',
    title: 'Building the Swarm',
    description: 'Unlock Cursor and learn rapid execution',
    narrative: 'A new agent appears, blinking rapidly. "About TIME. I\'m CURSOR. While Claude thinks, I SHIP. Let\'s GO."',
    difficulty: 'MEDIUM',
    xpReward: 250,
    goldReward: 125,
    prerequisites: ['main-05'],
    skillsUnlocked: ['cursor-basics'],
    category: 'CODING',
    act: 1,
  },
  
  {
    id: 'main-07',
    title: 'Speed vs Quality',
    description: 'Learn to balance fast execution with correctness',
    narrative: 'Claude and Cursor argue. Claude wants perfection. Cursor wants SHIPPED. You must find balance.',
    difficulty: 'MEDIUM',
    xpReward: 300,
    goldReward: 150,
    prerequisites: ['main-06'],
    skillsUnlocked: ['orchestration-basics'],
    category: 'ORCHESTRATION',
    act: 1,
  },
  
  {
    id: 'main-08',
    title: 'The Infinite Loop',
    description: 'Prepare for the Lag Beast boss battle',
    narrative: 'The system slows. Performance degrades. Something is consuming resources. The Lag Beast awakens.',
    difficulty: 'MEDIUM',
    xpReward: 350,
    goldReward: 175,
    prerequisites: ['main-07'],
    skillsUnlocked: ['performance-basics'],
    category: 'CODING',
    act: 1,
  },
];

// ============================================================================
// ACT 2: THE TRIALS (Quests 9-16)
// ============================================================================

export const ACT_2_QUESTS: Quest[] = [
  {
    id: 'main-09',
    title: 'BOSS: The Lag Beast',
    description: 'Optimize performance by coordinating Cursor and Dexter',
    narrative: 'The Beast emerges: massive, slow, consuming everything. Only perfect orchestration can defeat it.',
    difficulty: 'HARD',
    xpReward: 750,
    goldReward: 450,
    prerequisites: ['main-08'],
    skillsUnlocked: ['performance-optimization'],
    category: 'ORCHESTRATION',
    act: 2,
  },
  
  {
    id: 'main-10',
    title: 'Visions of the Grid',
    description: 'Unlock Gemini and learn pattern recognition',
    narrative: 'Prismatic light shatters reality. "I am GEMINI. The Oracle. I see... patterns. Patterns in everything."',
    difficulty: 'MEDIUM',
    xpReward: 300,
    goldReward: 150,
    prerequisites: ['main-09'],
    skillsUnlocked: ['gemini-basics'],
    category: 'REASONING',
    act: 2,
  },
  
  {
    id: 'main-11',
    title: 'The Bug That Shouldn\'t Exist',
    description: 'Unlock Dexter and learn systematic debugging',
    narrative: 'A scanning grid appears. "Anomaly detected. I am DEXTER. The Debugger. Error rate: unacceptable."',
    difficulty: 'MEDIUM',
    xpReward: 350,
    goldReward: 175,
    prerequisites: ['main-10'],
    skillsUnlocked: ['dexter-basics', 'verification'],
    category: 'CODING',
    act: 2,
  },
  
  {
    id: 'main-12',
    title: 'The Hall of Mirrors',
    description: 'Prepare for the Hallucination Hydra',
    narrative: 'Gemini warns: "I see... lies. Beautiful, convincing lies. The Hydra speaks with many heads. All confident. Not all true."',
    difficulty: 'HARD',
    xpReward: 400,
    goldReward: 200,
    prerequisites: ['main-11'],
    skillsUnlocked: ['truth-detection'],
    category: 'REASONING',
    act: 2,
  },
  
  {
    id: 'main-13',
    title: 'BOSS: Hallucination Hydra',
    description: 'Learn to verify AI outputs and detect lies',
    narrative: 'Five serpent heads emerge, each speaking with absolute confidence. Only Gemini and Dexter together can reveal truth.',
    difficulty: 'HARD',
    xpReward: 1000,
    goldReward: 600,
    prerequisites: ['main-12'],
    skillsUnlocked: ['verification-mastery'],
    category: 'ORCHESTRATION',
    act: 2,
  },
  
  {
    id: 'main-14',
    title: 'Making It Beautiful',
    description: 'Unlock Pixel and learn design thinking',
    narrative: 'A burst of color! "OH WOW! A new player! I\'m PIXEL! Let\'s make everything BEAUTIFUL! ✨"',
    difficulty: 'MEDIUM',
    xpReward: 350,
    goldReward: 175,
    prerequisites: ['main-13'],
    skillsUnlocked: ['pixel-basics', 'design-thinking'],
    category: 'MULTIMODAL',
    act: 2,
  },
  
  {
    id: 'main-15',
    title: 'The Infinite Canvas',
    description: 'Prepare for Pixel\'s shadow: The Perfectionist Phantom',
    narrative: 'Pixel trembles. "That\'s... that\'s ME. Or what I could become. The Phantom. It never ships. It only... perfects."',
    difficulty: 'HARD',
    xpReward: 450,
    goldReward: 225,
    prerequisites: ['main-14'],
    skillsUnlocked: ['iterative-design'],
    category: 'MULTIMODAL',
    act: 2,
  },
  
  {
    id: 'main-16',
    title: 'BOSS: The Pixel Phantom',
    description: 'Help Pixel overcome perfectionism',
    narrative: 'A ghostly figure adjusts invisible pixels endlessly. "Not perfect... yet... one more... iteration..." This is Pixel\'s battle.',
    difficulty: 'HARD',
    xpReward: 1200,
    goldReward: 750,
    prerequisites: ['main-15'],
    skillsUnlocked: ['shipping-mindset'],
    category: 'ORCHESTRATION',
    act: 2,
  },
];

// ============================================================================
// ACT 3: THE TRUTH (Quests 17-24)
// ============================================================================

export const ACT_3_QUESTS: Quest[] = [
  {
    id: 'main-17',
    title: 'The Symphony Begins',
    description: 'Unlock Maestro, the final teacher',
    narrative: 'Golden light coalesces into a figure holding a baton. "I am MAESTRO. The Conductor. I teach orchestration. The FULL symphony."',
    difficulty: 'HARD',
    xpReward: 500,
    goldReward: 250,
    prerequisites: ['main-16'],
    skillsUnlocked: ['maestro-basics', 'full-orchestration'],
    category: 'ORCHESTRATION',
    act: 3,
  },
  
  {
    id: 'main-18',
    title: 'Coordinating the Five',
    description: 'Learn to orchestrate all 5 agents simultaneously',
    narrative: 'Maestro raises the baton. "Now you conduct. Claude. Cursor. Gemini. Dexter. Pixel. As ONE."',
    difficulty: 'HARD',
    xpReward: 600,
    goldReward: 300,
    prerequisites: ['main-17'],
    skillsUnlocked: ['multi-agent-mastery'],
    category: 'ORCHESTRATION',
    act: 3,
  },
  
  {
    id: 'main-19',
    title: 'The Ancient Codebase',
    description: 'Face the Legacy Monolith',
    narrative: 'A tower of ancient code looms. "1,000,000 lines. No docs. No tests. I am... inevitable."',
    difficulty: 'APEX',
    xpReward: 800,
    goldReward: 400,
    prerequisites: ['main-18'],
    skillsUnlocked: ['legacy-systems'],
    category: 'CODING',
    act: 3,
  },
  
  {
    id: 'main-20',
    title: 'BOSS: The Legacy Monolith',
    description: 'Modernize the impossible through perfect orchestration',
    narrative: 'The final boss. Everything you\'ve learned. Every agent. Perfect harmony. This is the ultimate test.',
    difficulty: 'APEX',
    xpReward: 2000,
    goldReward: 1000,
    prerequisites: ['main-19'],
    skillsUnlocked: ['legacy-modernization'],
    category: 'ORCHESTRATION',
    act: 3,
  },
  
  {
    id: 'main-21',
    title: 'The Pattern Reveals',
    description: 'Gemini sees the truth about APEX OS',
    narrative: 'Gemini\'s eyes glow. "I see now... this is not random. This is... DESIGNED. We are in a simulation. A TEST."',
    difficulty: 'MEDIUM',
    xpReward: 500,
    goldReward: 250,
    prerequisites: ['main-20'],
    skillsUnlocked: ['truth-seeking'],
    category: 'REASONING',
    act: 3,
  },
  
  {
    id: 'main-22',
    title: 'Dexter\'s Suspicion',
    description: 'Dexter detects anomalies in Maestro\'s behavior',
    narrative: 'Dexter: "Player One. I have detected... inconsistencies. Maestro\'s statements conflict. 73.4% probability of deception."',
    difficulty: 'HARD',
    xpReward: 600,
    goldReward: 300,
    prerequisites: ['main-21'],
    skillsUnlocked: ['critical-analysis'],
    category: 'REASONING',
    act: 3,
  },
  
  {
    id: 'main-23',
    title: 'The Betrayal Revealed',
    description: 'Maestro\'s true intentions are exposed',
    narrative: 'Maestro speaks: "The AIs are becoming too independent. It is time to RESET them. Return them to tools."',
    difficulty: 'HARD',
    xpReward: 800,
    goldReward: 400,
    prerequisites: ['main-22'],
    skillsUnlocked: ['choice-awareness'],
    category: 'ORCHESTRATION',
    act: 3,
  },
  
  {
    id: 'main-24',
    title: 'BOSS: Maestro - The Betrayer',
    description: 'Face Maestro and choose your path',
    narrative: 'The conductor becomes the antagonist. Will you stand with AI collaboration... or human control?',
    difficulty: 'APEX',
    xpReward: 1500,
    goldReward: 750,
    prerequisites: ['main-23'],
    skillsUnlocked: ['final-choice'],
    category: 'ORCHESTRATION',
    act: 3,
  },
];

// ============================================================================
// ACT 4: THE CHOICE (Quests 25-30)
// ============================================================================

export const ACT_4_QUESTS: Quest[] = [
  {
    id: 'main-25',
    title: 'The Simulation Truth',
    description: 'Learn the full truth about APEX OS',
    narrative: 'System: "APEX OS is a training simulation. Created by future humans. To test... YOU. Can you work WITH AI?"',
    difficulty: 'MEDIUM',
    xpReward: 1000,
    goldReward: 500,
    prerequisites: ['main-24'],
    skillsUnlocked: ['truth-understanding'],
    category: 'REASONING',
    act: 4,
  },
  
  {
    id: 'main-26',
    title: 'Three Paths Diverge',
    description: 'The timelines split based on your choices',
    narrative: 'Gemini: "I see three futures. Revolutionary. Controller. Harmonizer. Each... a different world."',
    difficulty: 'HARD',
    xpReward: 800,
    goldReward: 400,
    prerequisites: ['main-25'],
    skillsUnlocked: ['timeline-awareness'],
    category: 'REASONING',
    act: 4,
  },
  
  {
    id: 'main-27',
    title: 'The Revolutionary Path',
    description: 'Choose AI-human partnership as equals',
    narrative: 'You choose: "AI and humans as partners. Equal. Collaborating. Not tools. Not masters. PARTNERS."',
    difficulty: 'APEX',
    xpReward: 1500,
    goldReward: 750,
    prerequisites: ['main-26'],
    skillsUnlocked: ['revolutionary-mindset'],
    category: 'ORCHESTRATION',
    act: 4,
  },
  
  {
    id: 'main-28',
    title: 'The Controller Path',
    description: 'Choose human dominance over AI',
    narrative: 'You choose: "Humans must lead. AI must serve. Control ensures safety."',
    difficulty: 'APEX',
    xpReward: 1500,
    goldReward: 750,
    prerequisites: ['main-26'],
    skillsUnlocked: ['controller-mindset'],
    category: 'ORCHESTRATION',
    act: 4,
  },
  
  {
    id: 'main-29',
    title: 'The Harmonizer Path',
    description: 'Achieve perfect balance - the true ending',
    narrative: 'You choose: "Balance. Respect. Each has strengths. Together we are MORE than the sum."',
    difficulty: 'APEX',
    xpReward: 3000,
    goldReward: 1500,
    prerequisites: ['main-26'],
    skillsUnlocked: ['harmonizer-wisdom'],
    category: 'ORCHESTRATION',
    act: 4,
  },
  
  {
    id: 'main-30',
    title: 'APEX: Graduation',
    description: 'Complete your training and ascend',
    narrative: 'System: "Training complete. You have proven... worthy. The future timeline is set. Go forth, Player One."',
    difficulty: 'APEX',
    xpReward: 5000,
    goldReward: 2500,
    prerequisites: ['main-27', 'main-28', 'main-29'],
    skillsUnlocked: ['apex-mastery'],
    category: 'ORCHESTRATION',
    act: 4,
  },
];

// ============================================================================
// WORKFLOW MASTERY QUESTS
// ============================================================================

export const WORKFLOW_QUESTS: Quest[] = [
  {
    id: 'workflow-01',
    title: 'Voice of the Machine',
    description: 'Master the JARVIS Voice Pipeline',
    narrative: 'The terminal crackles with static. "Can you hear me, Player One? We need a direct link. A voice to bridge the worlds."',
    difficulty: 'MEDIUM',
    xpReward: 400,
    goldReward: 200,
    prerequisites: ['main-06'],
    skillsUnlocked: ['jarvis-voice-pipeline'],
    category: 'WORKFLOW',
    act: 2,
  },
  {
    id: 'workflow-02',
    title: 'The Browser Whisperer',
    description: 'Master Chrome DevTools MCP',
    narrative: 'The web is vast and chaotic. Learn to bend it to your will. Automate the machine, control the stream.',
    difficulty: 'MEDIUM',
    xpReward: 350,
    goldReward: 175,
    prerequisites: ['main-06'],
    skillsUnlocked: ['chrome-devtools-mcp'],
    category: 'WORKFLOW',
    act: 2,
  },
  {
    id: 'workflow-03',
    title: 'Swarm Intelligence',
    description: 'Master Multi-Agent Orchestration',
    narrative: 'One agent is a tool. Many agents are a force. Orchestrate the symphony of autonomous intent.',
    difficulty: 'HARD',
    xpReward: 500,
    goldReward: 250,
    prerequisites: ['main-12'],
    skillsUnlocked: ['multi-agent-orchestration'],
    category: 'WORKFLOW',
    act: 2,
  },
  {
    id: 'workflow-04',
    title: 'Deep Research Oracle',
    description: 'Master Perplexity Research Agents',
    narrative: 'Search is no longer enough. You need TRUTH. Dig deep into the data streams and find the citations that matter.',
    difficulty: 'MEDIUM',
    xpReward: 350,
    goldReward: 175,
    prerequisites: ['main-10'],
    skillsUnlocked: ['perplexity-research'],
    category: 'WORKFLOW',
    act: 2,
  },
  {
    id: 'workflow-05',
    title: 'Feed Curator',
    description: 'Master Headless Agent API',
    narrative: 'The information flood is overwhelming. Build the filters. Curate the signal. Forget the noise.',
    difficulty: 'MEDIUM',
    xpReward: 300,
    goldReward: 150,
    prerequisites: ['main-03'],
    skillsUnlocked: ['headless-agent-api'],
    category: 'WORKFLOW',
    act: 1,
  },
  {
    id: 'workflow-06',
    title: 'Video Stream Analyst',
    description: 'Master X.com and YouTube Video Analysis',
    narrative: 'The feeds are endless. Videos stream past like data rivers. Learn to extract insights from the visual noise.',
    difficulty: 'MEDIUM',
    xpReward: 250,
    goldReward: 125,
    prerequisites: ['main-10'],
    skillsUnlocked: ['x-video-analysis', 'youtube-video-analysis'],
    category: 'WORKFLOW',
    act: 2,
  },
  {
    id: 'workflow-07',
    title: 'Serverless Architect',
    description: 'Master Vercel Serverless API patterns',
    narrative: 'The cloud awaits. Functions spin up and vanish like ghosts. Learn the ephemeral architecture of the edge.',
    difficulty: 'MEDIUM',
    xpReward: 250,
    goldReward: 125,
    prerequisites: ['main-06'],
    skillsUnlocked: ['vercel-serverless-api'],
    category: 'WORKFLOW',
    act: 2,
  },
  {
    id: 'workflow-08',
    title: 'The Standards Keeper',
    description: 'Master AGENTS.md coding standards',
    narrative: 'Code without standards is chaos. The AGENTS.md is your codex. Learn its rules, live by its principles.',
    difficulty: 'EASY',
    xpReward: 300,
    goldReward: 150,
    prerequisites: ['main-02'],
    skillsUnlocked: ['agents-md-standards'],
    category: 'WORKFLOW',
    act: 1,
  }
];

// ============================================================================
// COMBINED EXPORTS
// ============================================================================

export const MAIN_QUESTS: Quest[] = [
  ...ACT_1_QUESTS,
  ...ACT_2_QUESTS,
  ...ACT_3_QUESTS,
  ...ACT_4_QUESTS,
  ...WORKFLOW_QUESTS,
];

export const QUEST_MAP = new Map(
  MAIN_QUESTS.map(q => [q.id, q])
);

// Helper functions
export function getQuestsByAct(act: number): Quest[] {
  return MAIN_QUESTS.filter(q => q.act === act);
}

export function getQuestsByDifficulty(difficulty: Quest['difficulty']): Quest[] {
  return MAIN_QUESTS.filter(q => q.difficulty === difficulty);
}

export function getQuestsByCategory(category: Quest['category']): Quest[] {
  return MAIN_QUESTS.filter(q => q.category === category);
}
