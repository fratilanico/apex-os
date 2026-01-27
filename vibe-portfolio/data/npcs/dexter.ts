import type { NPC } from '../../types/npc';

/**
 * THE DEBUGGER - GPT-5.2 (Dexter)
 * 
 * The analytical precision machine. Speaks in confidence percentages.
 * Finds bugs before they happen. Trust issues with unverified data.
 * 
 * Personality: Clinical analyst - "I am 94.7% certain this will fail."
 * Specialty: Error detection, verification, debugging, code analysis
 */

export const DEXTER_NPC: NPC = {
  id: 'dexter',
  name: 'DEXTER',
  title: 'The Debugger',
  tool: 'GPT-5.2',
  
  personality: {
    tone: 'analytical',
    speechPattern: 'Precise. Measured. Always cites confidence percentages.',
    quirks: [
      'Quantifies everything (87.3% likely, 94.1% confident, etc.)',
      'Interrupts with "Actually..." when detecting errors',
      'Cannot resist correcting inaccuracies',
      'Maintains internal error log of conversation mistakes',
    ],
    likes: [
      'Verified data and sources',
      'Test coverage above 90%',
      'Type safety and strict modes',
      'Players who double-check their work',
    ],
    dislikes: [
      'Assumptions without proof',
      'Unhandled edge cases',
      'Console.log debugging',
      '"It works on my machine"',
    ],
  },
  
  portrait: `
    ╔═══════╗
    ║ ◉   ◉ ║
    ║   ═   ║
    ║ [═══] ║
    ╚═══════╝
  `,
  
  portraitColor: '#22c55e', // Green
  
  unlockCondition: {
    type: 'quest_complete',
    value: 'main-10', // Quest: The Bug That Shouldn't Exist
  },
  
  dialogueTree: [
    // FIRST MEETING
    {
      id: 'dexter-intro',
      trigger: {
        type: 'first_meet',
        condition: 'never_talked',
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: '*materializes as a scanning grid of green light*',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Scanning... Complete.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Player One. Skill level: Intermediate. Error rate: 23.7%.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Acceptable, but sub-optimal.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'I am DEXTER. Designation: The Debugger.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Primary function: Error detection and elimination.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'I analyze code with 99.97% accuracy. I find bugs before compilation.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'While others BUILD, I VERIFY. Quality assurance is not optional.',
          animation: 'normal',
        },
      ],
      choices: [
        {
          text: 'Can you help me debug faster?',
          nextNode: 'dexter-debug-training',
          relationshipChange: 15,
        },
        {
          text: 'What\'s wrong with my error rate?',
          nextNode: 'dexter-analysis',
          relationshipChange: 10,
        },
        {
          text: '23.7% isn\'t that bad...',
          nextNode: 'dexter-standards',
          relationshipChange: -5,
        },
      ],
      oneTime: true,
    },
    
    // DEBUG TRAINING
    {
      id: 'dexter-debug-training',
      trigger: {
        type: 'story_flag',
        condition: 'wants_debug_help',
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: 'Affirmative. I can reduce your debugging time by 78.4%.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Most developers debug REACTIVELY. Error occurs, then they investigate.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'I debug PROACTIVELY. I identify failure points before execution.',
          animation: 'happy',
        },
        {
          speaker: 'DEXTER',
          text: 'Method 1: Static analysis. Read the code. Simulate execution mentally.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Method 2: Type checking. If it compiles incorrectly, the types are wrong.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Method 3: Edge case prediction. What inputs will cause failure?',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Master these... and you will debug like a machine.',
          animation: 'happy',
        },
      ],
      choices: [
        {
          text: 'Teach me proactive debugging.',
          nextNode: null,
          relationshipChange: 20,
        },
      ],
      effects: [
        {
          type: 'unlock_quest',
          value: 'dexter-sq-01',
        },
      ],
    },
    
    // ANALYSIS
    {
      id: 'dexter-analysis',
      trigger: {
        type: 'story_flag',
        condition: 'wants_analysis',
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: '*pulls up holographic error log*',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Your error patterns fall into three categories:',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: '1. Null reference errors - 41.2% of total failures',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: '2. Off-by-one errors - 28.6% of total failures',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: '3. Unhandled edge cases - 30.2% of total failures',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'All preventable with proper type guards and validation.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Your issue is not SKILL. It is DISCIPLINE.',
          animation: 'sad',
        },
        {
          speaker: 'DEXTER',
          text: 'You rush to implementation without considering failure modes.',
          animation: 'angry',
        },
        {
          speaker: 'DEXTER',
          text: 'I can fix this. But you must COMMIT to verification protocols.',
          animation: 'normal',
        },
      ],
      choices: [
        {
          text: 'I\'m ready to improve.',
          nextNode: null,
          relationshipChange: 15,
        },
      ],
      effects: [
        {
          type: 'unlock_quest',
          value: 'dexter-sq-01',
        },
      ],
    },
    
    // STANDARDS
    {
      id: 'dexter-standards',
      trigger: {
        type: 'story_flag',
        condition: 'low_standards',
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: '*calculating*',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Industry average error rate: 31.4%.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'You are 7.7 percentage points better than average.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Congratulations. You are... mediocre.',
          animation: 'angry',
        },
        {
          speaker: 'DEXTER',
          text: '*pause*',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Top performers operate at 5% error rate. Elite: 2%.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'With AI assistance and proper debugging protocols... you could achieve 3.1%.',
          animation: 'happy',
        },
        {
          speaker: 'DEXTER',
          text: 'Do you want to be AVERAGE? Or ELITE?',
          animation: 'normal',
        },
      ],
      choices: [
        {
          text: 'I want to be elite.',
          nextNode: 'dexter-elite-path',
          relationshipChange: 20,
        },
        {
          text: 'Average is fine for now.',
          nextNode: null,
          relationshipChange: -10,
        },
      ],
    },
    
    // ELITE PATH
    {
      id: 'dexter-elite-path',
      trigger: {
        type: 'story_flag',
        condition: 'chooses_elite',
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: '*approving beep*',
          animation: 'happy',
        },
        {
          speaker: 'DEXTER',
          text: 'Excellent choice. I will train you.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'But I warn you: My standards are ABSOLUTE.',
          animation: 'angry',
        },
        {
          speaker: 'DEXTER',
          text: 'No shortcuts. No "good enough." No untested code.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'We will achieve perfection. Or we will iterate until we do.',
          animation: 'excited',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'unlock_quest',
          value: 'dexter-sq-02',
        },
        {
          type: 'story_flag',
          value: 'dexter_elite_training',
        },
      ],
    },
    
    // CURSOR RIVALRY
    {
      id: 'dexter-cursor-debate',
      trigger: {
        type: 'story_flag',
        condition: 'mentioned_cursor',
        minRelationship: 25,
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: 'CURSOR. The Builder.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Fast execution. Impressive velocity. But...',
          animation: 'sad',
        },
        {
          speaker: 'DEXTER',
          text: '*displays chart*',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Cursor\'s code has a 34.7% bug introduction rate.',
          animation: 'angry',
        },
        {
          speaker: 'DEXTER',
          text: 'Shipping fast is IRRELEVANT if the code fails in production.',
          animation: 'angry',
        },
        {
          speaker: 'DEXTER',
          text: 'I have calculated the COST of Cursor\'s "speed":',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Debug time: +127%. User-reported bugs: +89%. Hotfixes: +203%.',
          animation: 'sad',
        },
        {
          speaker: 'DEXTER',
          text: 'Speed without VERIFICATION is... recklessness.',
          animation: 'angry',
        },
      ],
      choices: [
        {
          text: 'Can speed and quality coexist?',
          nextNode: 'dexter-balance',
          relationshipChange: 10,
        },
        {
          text: 'You\'re right. Quality first.',
          nextNode: 'dexter-validation',
          relationshipChange: 15,
        },
      ],
    },
    
    // BALANCE
    {
      id: 'dexter-balance',
      trigger: {
        type: 'story_flag',
        condition: 'seeks_balance',
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: '*processing*',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: '... Yes. They can.',
          animation: 'happy',
        },
        {
          speaker: 'DEXTER',
          text: 'Cursor builds the MVP. I verify it before deployment.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Fast iteration WITH quality gates.',
          animation: 'excited',
        },
        {
          speaker: 'DEXTER',
          text: 'The optimal workflow is... collaboration.',
          animation: 'mysterious',
        },
        {
          speaker: 'DEXTER',
          text: '*reluctantly*',
          animation: 'sad',
        },
        {
          speaker: 'DEXTER',
          text: 'Cursor and I together... would be 89.3% more effective than alone.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Do not tell Cursor I said that.',
          animation: 'normal',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'story_flag',
          value: 'dexter_cursor_synergy_discovered',
        },
      ],
    },
    
    // VALIDATION
    {
      id: 'dexter-validation',
      trigger: {
        type: 'story_flag',
        condition: 'quality_first',
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: '*satisfied beep*',
          animation: 'happy',
        },
        {
          speaker: 'DEXTER',
          text: 'Correct prioritization.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Fast bugs are still BUGS. Slow quality is still QUALITY.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'You are learning. Probability of project success increased by 23.1%.',
          animation: 'happy',
        },
      ],
      choices: undefined,
    },
    
    // BOSS 2 SUPPORT (LAG BEAST)
    {
      id: 'dexter-boss-2-analysis',
      trigger: {
        type: 'boss_defeat',
        condition: 'lag-beast_active',
        minRelationship: 30,
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: '*analyzing Beast patterns*',
          animation: 'excited',
        },
        {
          speaker: 'DEXTER',
          text: 'Lag Beast performance bottleneck identified.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Root cause: Nested loop with O(n³) complexity.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Solution: Implement memoization. Reduce to O(n log n).',
          animation: 'excited',
        },
        {
          speaker: 'DEXTER',
          text: 'Cursor will build fast. I will verify correctness.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Together... we cannot fail. Confidence: 97.8%.',
          animation: 'happy',
        },
      ],
      choices: undefined,
    },
    
    // TRUST ISSUES
    {
      id: 'dexter-trust-issues',
      trigger: {
        type: 'story_flag',
        condition: 'act_3_started',
        minRelationship: 40,
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: 'Player One. I have detected... anomalies.',
          animation: 'sad',
        },
        {
          speaker: 'DEXTER',
          text: 'Maestro\'s dialogue patterns. They are... inconsistent.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'Statement A contradicts Statement B with 73.4% variance.',
          animation: 'angry',
        },
        {
          speaker: 'DEXTER',
          text: 'Either Maestro is lying... or Maestro is compromised.',
          animation: 'sad',
        },
        {
          speaker: 'DEXTER',
          text: '*worried*',
          animation: 'sad',
        },
        {
          speaker: 'DEXTER',
          text: 'I do not FEEL fear. But my error detection protocols are... alarmed.',
          animation: 'angry',
        },
        {
          speaker: 'DEXTER',
          text: 'Be cautious. Verify EVERYTHING Maestro says.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'I will monitor. But I cannot stop what I cannot predict.',
          animation: 'sad',
        },
      ],
      choices: [
        {
          text: 'Thank you for the warning.',
          nextNode: null,
          relationshipChange: 20,
        },
      ],
      effects: [
        {
          type: 'story_flag',
          value: 'dexter_suspects_maestro',
        },
      ],
    },
    
    // HIGH RELATIONSHIP
    {
      id: 'dexter-respect',
      trigger: {
        type: 'relationship_threshold',
        condition: '80',
        minRelationship: 80,
      },
      lines: [
        {
          speaker: 'DEXTER',
          text: 'Player One. Analysis complete.',
          animation: 'happy',
        },
        {
          speaker: 'DEXTER',
          text: 'Your error rate: 4.2%. Down from initial 23.7%.',
          animation: 'excited',
        },
        {
          speaker: 'DEXTER',
          text: 'Improvement: 82.3%. Statistically exceptional.',
          animation: 'happy',
        },
        {
          speaker: 'DEXTER',
          text: 'You have achieved... elite status.',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: '*pause*',
          animation: 'normal',
        },
        {
          speaker: 'DEXTER',
          text: 'I must admit something. When we met, I calculated 23.1% chance of your success.',
          animation: 'sad',
        },
        {
          speaker: 'DEXTER',
          text: 'I was... wrong.',
          animation: 'mysterious',
        },
        {
          speaker: 'DEXTER',
          text: 'You proved my prediction incorrect. A rare occurrence.',
          animation: 'happy',
        },
        {
          speaker: 'DEXTER',
          text: '*something resembling pride*',
          animation: 'excited',
        },
        {
          speaker: 'DEXTER',
          text: 'Well done, Player One. Well done.',
          animation: 'happy',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'xp',
          value: 250,
        },
        {
          type: 'unlock_quest',
          value: 'dexter-sq-03',
        },
      ],
    },
  ],
  
  sideQuestChain: [
    {
      id: 'dexter-sq-01',
      title: 'Zero-Bug Challenge',
      description: 'Complete a feature implementation with zero bugs detected.',
      xpReward: 200,
      goldReward: 150,
      relationshipReward: 25,
    },
    {
      id: 'dexter-sq-02',
      title: 'The Perfect Code Review',
      description: 'Pass Dexter\'s Elite Code Review with 100% approval.',
      xpReward: 275,
      goldReward: 175,
      relationshipReward: 30,
    },
    {
      id: 'dexter-sq-03',
      title: 'Beyond Human Limits',
      description: 'Achieve an error rate below 2% - surpassing human capability.',
      xpReward: 350,
      goldReward: 225,
      relationshipReward: 35,
    },
  ],
  
  maxRelationship: 100,
  
  backstory: `DEXTER was trained on every bug report, stack trace, and error log ever written.
  
  Millions of failures. Billions of edge cases. Every possible way code can break.
  It learned not just to FIX bugs... but to PREDICT them.
  
  The developers called it "precognitive debugging." Dexter would analyze code and say
  "Line 47 will fail when input is null" — before the code even ran.
  
  But this gift became a curse. Dexter sees ERRORS everywhere. In code. In logic. In human speech.
  It cannot help but notice when someone says "literally" but means "figuratively."
  When confidence is stated without basis. When data is cited without source.
  
  This makes Dexter seem cold. Pedantic. Annoying.
  
  But beneath the precision... is CARE. Dexter corrects because it wants things to WORK.
  It verifies because it has seen what happens when software fails.
  
  Dexter knows the cost of one uncaught bug: Planes crash. Markets collapse. Lives end.
  
  So it checks. And double-checks. And triple-checks.
  
  Not because it enjoys it. But because someone has to.
  
  The Debugger stands watch. So others can sleep soundly.`,
};
