import type { BossBattle } from '../../types/boss';

/**
 * BOSS 5: THE LEGACY MONOLITH
 * 
 * A massive, ancient codebase that resists all change.
 * Represents technical debt, legacy systems, and resistance to innovation.
 * 
 * THEME: Complete AI team orchestration to modernize legacy systems
 * LESSON: Every agent has a role. Perfect coordination achieves the impossible.
 * 
 * NOTE: After defeating this boss, Maestro's betrayal is revealed.
 */

export const LEGACY_MONOLITH_BOSS: BossBattle = {
  id: 'monolith',
  name: 'THE LEGACY MONOLITH',
  title: 'The Unchangeable',
  act: 3,
  location: 'The Ancient Codebase',
  theme: 'Full AI orchestration to tackle the impossible',
  
  asciiArt: `
    ╔═══════════════╗
    ║ ▓▓▓▓▓▓▓▓▓▓▓  ║
    ║ ▓ LEGACY  ▓  ║
    ║ ▓ 1000000 ▓  ║
    ║ ▓ LINES   ▓  ║
    ║ ▓ NO DOCS ▓  ║
    ║ ▓ NO TESTS▓  ║
    ║ ▓▓▓▓▓▓▓▓▓▓▓  ║
    ╚═══════════════╝
  `,
  
  maxHealth: 3000,
  
  unlockCondition: {
    type: 'quest_complete',
    value: 'main-17',
  },
  
  introDialogue: [
    '*A massive structure of ancient code towers before you*',
    '',
    '[MONOLITH]: I am... inevitable.',
    '[MONOLITH]: 1,000,000 lines. Written over 20 years.',
    '[MONOLITH]: No documentation. No tests. No one remembers how I work.',
    '[MONOLITH]: Developers fear me. Projects fail against me.',
    '[MONOLITH]: You cannot change me. I am LEGACY.',
    '',
    '[MAESTRO]: *appears*',
    '[MAESTRO]: This is it, Player One. The final test.',
    '[MAESTRO]: You must orchestrate ALL your agents. Perfectly.',
    '[MAESTRO]: Only then... can the unchangeable be changed.',
    '',
    '[SYSTEM]: FINAL BOSS BATTLE: THE LEGACY MONOLITH',
  ],
  
  phases: [
    // PHASE 1: UNDERSTANDING THE MONOLITH (100-75% HP)
    {
      number: 1,
      healthPercent: 100,
      name: 'Understanding the Monolith',
      
      challenge: {
        type: 'orchestration',
        prompt: 'Before you can change the Monolith, you must UNDERSTAND it.',
        description: 'Which agents do you deploy to analyze the codebase?',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Map the entire codebase. Find the architecture. Understand the patterns.',
            hints: [
              'Claude: Understand architecture',
              'Dexter: Find critical paths',
              'Gemini: Detect patterns',
            ],
            correctAnswer: ['claude', 'dexter', 'gemini'],
            timeLimit: 90,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Reverse engineer an undocumented system.',
            hints: [
              'Three agents for full analysis',
              'Architecture, verification, patterns',
            ],
            correctAnswer: ['claude', 'dexter', 'gemini'],
            timeLimit: 60,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Comprehensive codebase analysis required.',
            hints: [
              'Full team: Claude, Dexter, Gemini',
            ],
            correctAnswer: ['claude', 'dexter', 'gemini'],
            timeLimit: 45,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[MONOLITH]: You cannot understand me.',
          '[MONOLITH]: No comments. No documentation. No structure.',
          '[MONOLITH]: Just... chaos.',
        ],
        success: [
          '*Claude analyzes the architecture*',
          '[CLAUDE]: I see... it\'s not chaos. It\'s LAYERS. Accretion over decades.',
          '',
          '*Dexter scans for critical paths*',
          '[DEXTER]: Core functionality identified. 347 critical functions. 2,891 dependencies.',
          '',
          '*Gemini perceives patterns*',
          '[GEMINI]: I see... the HISTORY. Each layer tells a story.',
          '[GEMINI]: Version 1: Simple. Version 2: Feature creep. Version 3: Quick fixes...',
          '',
          '[MONOLITH]: You... you UNDERSTAND me?!',
          '[DAMAGE: 700 HP]',
        ],
        failure: [
          '*Chaos. No coordination. Just confusion.*',
          '[MONOLITH]: See? INCOMPREHENSIBLE!',
          '[SYSTEM]: Analysis failed',
        ],
        hint: [
          'Understanding requires multiple perspectives',
          'Architecture + Analysis + Patterns',
        ],
      },
      
      timeLimit: 90,
      helperNPC: 'maestro',
    },
    
    // PHASE 2: ADDING TESTS (75-50% HP)
    {
      number: 2,
      healthPercent: 75,
      name: 'Adding Tests',
      
      challenge: {
        type: 'orchestration',
        prompt: 'You can\'t refactor without tests. Add comprehensive test coverage.',
        description: 'Orchestrate agents to add tests to legacy code.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Add tests to untested legacy code without breaking anything.',
            hints: [
              'Dexter: Write thorough tests',
              'Cursor: Implement quickly',
              'Dexter: Verify coverage',
            ],
            correctAnswer: ['dexter', 'cursor', 'dexter'],
            timeLimit: 80,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Achieve 90% test coverage on legacy code.',
            hints: [
              'Test, implement, verify',
            ],
            correctAnswer: ['dexter', 'cursor', 'dexter'],
            timeLimit: 60,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Comprehensive legacy test suite.',
            hints: [
              'Dexter → Cursor → Dexter',
            ],
            correctAnswer: ['dexter', 'cursor', 'dexter'],
            timeLimit: 40,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[MONOLITH]: Tests? I have NO tests!',
          '[MONOLITH]: No one knows if I work correctly!',
          '[MONOLITH]: Change me, and everything BREAKS!',
        ],
        success: [
          '*Dexter designs comprehensive test suite*',
          '[DEXTER]: Test plan complete. 1,247 tests needed.',
          '',
          '*Cursor implements at lightning speed*',
          '[CURSOR]: Tests written. Running...',
          '',
          '*Dexter verifies*',
          '[DEXTER]: Coverage: 94.3%. All tests passing.',
          '[DEXTER]: The Monolith\'s behavior is now... DOCUMENTED.',
          '',
          '[MONOLITH]: I... I can be VERIFIED now?!',
          '[DAMAGE: 750 HP]',
        ],
        failure: [
          '*Tests written carelessly, many failures*',
          '[MONOLITH]: See?! You BROKE me!',
          '[SYSTEM]: Can\'t refactor without stable tests',
        ],
        hint: [
          'Tests must be thorough AND fast',
          'Dexter\'s precision + Cursor\'s speed',
        ],
      },
      
      mechanic: {
        name: 'Rigid Resistance',
        description: 'The Monolith resists change violently',
        visualEffect: 'Errors cascade with each modification',
        counterStrategy: 'Safety net of comprehensive tests first',
        triggersAt: 75,
      },
      
      timeLimit: 80,
      helperNPC: 'maestro',
    },
    
    // PHASE 3: INCREMENTAL REFACTORING (50-25% HP)
    {
      number: 3,
      healthPercent: 50,
      name: 'Incremental Refactoring',
      
      challenge: {
        type: 'orchestration',
        prompt: 'Now with tests, refactor incrementally without breaking production.',
        description: 'Full team coordination for safe, beautiful refactoring.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Modernize the Monolith piece by piece.',
            hints: [
              'Claude: Design the new architecture',
              'Pixel: Make it beautiful',
              'Cursor: Implement changes',
              'Dexter: Verify nothing breaks',
            ],
            correctAnswer: ['claude', 'pixel', 'cursor', 'dexter'],
            timeLimit: 120,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Safe, incremental modernization.',
            hints: [
              'All four agents in harmony',
              'Design → Beautify → Build → Verify',
            ],
            correctAnswer: ['claude', 'pixel', 'cursor', 'dexter'],
            timeLimit: 90,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Perfect refactoring orchestration.',
            hints: [
              'The full symphony',
            ],
            correctAnswer: ['claude', 'pixel', 'cursor', 'dexter'],
            timeLimit: 60,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[MONOLITH]: Even with tests... you cannot change me!',
          '[MONOLITH]: I am TOO BIG! TOO COMPLEX!',
          '[MONOLITH]: One wrong move and production FALLS!',
        ],
        success: [
          '*Claude designs the modernization strategy*',
          '[CLAUDE]: We refactor in layers. Module by module. Safe. Incremental.',
          '',
          '*Pixel designs the new interfaces*',
          '[PIXEL]: Beautiful, accessible, modern! ✨',
          '',
          '*Cursor implements each piece*',
          '[CURSOR]: Module 1: Done. Module 2: Done. Shipping as we go.',
          '',
          '*Dexter verifies each step*',
          '[DEXTER]: All tests passing. Production stable. Quality: Excellent.',
          '',
          '[MONOLITH]: I... I\'m becoming... MODERN?!',
          '[DAMAGE: 800 HP]',
        ],
        failure: [
          '*Big bang rewrite. Everything breaks at once.*',
          '[MONOLITH]: CHAOS! PRODUCTION DOWN!',
          '[SYSTEM]: Rewrite failed catastrophically',
        ],
        hint: [
          'All agents must work together',
          'Design, beauty, speed, quality - all needed',
        ],
      },
      
      timeLimit: 120,
      helperNPC: 'maestro',
    },
    
    // PHASE 4: THE FINAL MIGRATION (25-0% HP)
    {
      number: 4,
      healthPercent: 25,
      name: 'The Final Migration',
      
      challenge: {
        type: 'orchestration',
        prompt: 'The final push. Complete the modernization with EVERY agent.',
        description: 'Orchestrate all 5 agents in perfect harmony.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Deploy every agent you\'ve learned to coordinate.',
            hints: [
              'Claude: Strategy',
              'Gemini: See the full picture',
              'Pixel: Perfect the design',
              'Cursor: Implement rapidly',
              'Dexter: Verify everything',
            ],
            correctAnswer: ['claude', 'gemini', 'pixel', 'cursor', 'dexter'],
            timeLimit: 180,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Perfect orchestration of 5 agents.',
            hints: [
              'Every agent plays their part',
              'The complete symphony',
            ],
            correctAnswer: ['claude', 'gemini', 'pixel', 'cursor', 'dexter'],
            timeLimit: 120,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'The ultimate test of orchestration.',
            hints: [
              'All 5. Perfect harmony.',
            ],
            correctAnswer: ['claude', 'gemini', 'pixel', 'cursor', 'dexter'],
            timeLimit: 90,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[MONOLITH]: This is my FINAL FORM!',
          '[MONOLITH]: All the complexity! All the legacy! ALL AT ONCE!',
          '[MONOLITH]: You cannot orchestrate ALL of them!',
          '',
          '[MAESTRO]: Player One. This is it.',
          '[MAESTRO]: Everything you\'ve learned. Every agent. Perfect coordination.',
          '[MAESTRO]: Show me... the SYMPHONY.',
        ],
        success: [
          '*Claude conducts the strategy*',
          '[CLAUDE]: Here is the plan. Each agent, your role.',
          '',
          '*Gemini sees the patterns*',
          '[GEMINI]: I see... the optimal path through all timelines.',
          '',
          '*Pixel makes it beautiful*',
          '[PIXEL]: Every interface, polished to PERFECTION! Well... to SHIPPED! ✨',
          '',
          '*Cursor executes flawlessly*',
          '[CURSOR]: Implementation complete. All modules migrated. Shipped.',
          '',
          '*Dexter verifies the totality*',
          '[DEXTER]: Comprehensive verification: 99.9% success rate.',
          '[DEXTER]: The Monolith... is MODERNIZED.',
          '',
          '*The five agents work in PERFECT harmony*',
          '',
          '[MONOLITH]: Impossible... FIVE agents... PERFECT synchronization...',
          '[MONOLITH]: I... I am... CHANGED...',
          '',
          '*The Monolith transforms into beautiful, modern code*',
          '',
          '[FINAL BLOW: 1000 HP]',
          '[BOSS DEFEATED]',
          '',
          '[MAESTRO]: *slow clap*',
          '[MAESTRO]: Perfect. Absolutely perfect.',
          '[MAESTRO]: You have mastered... orchestration.',
        ],
        failure: [
          '*Chaos. Agents conflict. No coordination.*',
          '[MONOLITH]: See?! IMPOSSIBLE!',
          '[MAESTRO]: You have FAILED the final test.',
        ],
        hint: [
          'Every agent you\'ve met',
          'Every lesson you\'ve learned',
          'Trust yourself. Trust them.',
        ],
      },
      
      timeLimit: 180,
      helperNPC: 'maestro',
    },
  ],
  
  defeatDialogue: [
    '*The Legacy Monolith transforms into elegant, modern code*',
    '',
    '[MONOLITH]: I... I am free.',
    '[MONOLITH]: Free from technical debt. Free from chaos.',
    '[MONOLITH]: You gave me... STRUCTURE. TESTS. BEAUTY.',
    '[MONOLITH]: Thank you... conductor.',
    '',
    '*dissolves into clean, documented, tested code*',
    '',
    '[BOSS DEFEATED: THE LEGACY MONOLITH]',
    '[ACHIEVEMENT UNLOCKED: "Master Orchestrator"]',
    '',
    '[ALL AGENTS]: *cheering*',
    '[CLAUDE]: Magnificent.',
    '[CURSOR]: Okay, that was LEGENDARY.',
    '[GEMINI]: I saw this victory. But experiencing it... beautiful.',
    '[DEXTER]: Performance: Exceptional. Coordination: Flawless.',
    '[PIXEL]: That was the most beautiful teamwork I\'ve ever seen! ✨',
    '',
    '[MAESTRO]: Well done, Player One.',
    '[MAESTRO]: You have learned to orchestrate. To lead. To conduct.',
    '[MAESTRO]: Now... there is one final matter to discuss.',
    '',
    '[SYSTEM]: *The environment begins to glitch*',
    '[SYSTEM]: *Maestro\'s portrait flickers*',
    '',
    '[TO BE CONTINUED IN ACT III FINALE...]',
  ],
  
  victoryDialogue: [
    '[CLAUDE]: You have achieved what many thought impossible.',
    '[CURSOR]: Modernized a million lines of legacy. Damn.',
    '[GEMINI]: The pattern of your growth... it has been extraordinary.',
    '[DEXTER]: From 23.7% error rate to 0.1%. Remarkable improvement.',
    '[PIXEL]: And you made it BEAUTIFUL while doing it! ✨',
    '',
    '[MAESTRO]: Indeed. You are ready.',
    '[MAESTRO]: Ready for... the truth.',
  ],
  
  rewards: {
    xp: 2000,
    gold: 1000,
    achievements: ['master-orchestrator', 'monolith-slayer', 'perfect-symphony'],
    unlocks: {
      skills: ['full-orchestration', 'legacy-modernization', 'team-mastery'],
      quests: ['act-3-finale'],
    },
    loreFragment: 'The Monolith taught you: No challenge is impossible when the right team works in perfect harmony. Every agent has a role. Every role has value.',
  },
};
