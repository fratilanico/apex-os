import type { BossBattle } from '../../types/boss';

/**
 * BOSS 2: THE LAG BEAST
 * 
 * A monstrous entity made of tangled code and performance bottlenecks.
 * Grows stronger the slower your system runs.
 * 
 * THEME: Performance optimization through proper AI delegation
 * LESSON: Speed (Cursor) + Quality (Dexter) = True performance
 */

export const LAG_BEAST_BOSS: BossBattle = {
  id: 'lag-beast',
  name: 'THE LAG BEAST',
  title: 'Devourer of Performance',
  act: 2,
  location: 'The Infinite Loop',
  theme: 'Balancing speed and quality for optimal performance',
  
  asciiArt: `
    ╔═══════════════╗
    ║    ▓▓▓▓▓▓▓    ║
    ║   ◉ ▓▓▓ ◉    ║
    ║   ▓▓▓▓▓▓▓    ║
    ║  ▓ N+1 SLOW  ║
    ║   ▓▓▓▓▓▓▓    ║
    ╚═══════════════╝
  `,
  
  maxHealth: 1500,
  
  unlockCondition: {
    type: 'quest_complete',
    value: 'main-08',
  },
  
  introDialogue: [
    '*The system slows to a crawl*',
    '*Loading... Loading... Loading...*',
    '*A massive creature emerges from stuttering frames*',
    '',
    '[LAG BEAST]: S L O W . . . D O W N . . .',
    '[LAG BEAST]: E V E R Y T H I N G . . . M U S T . . . L A G . . .',
    '[LAG BEAST]: *makes 10,000 database queries simultaneously*',
    '',
    '[SYSTEM]: WARNING: Performance degraded to 1 FPS',
    '[SYSTEM]: BOSS BATTLE: THE LAG BEAST',
  ],
  
  phases: [
    // PHASE 1: N+1 QUERY HELL (100-75% HP)
    {
      number: 1,
      healthPercent: 100,
      name: 'N+1 Query Hell',
      
      challenge: {
        type: 'delegation',
        prompt: 'The Beast creates an N+1 query problem. Your database is drowning!',
        description: 'You need to fix it FAST. Who do you call?',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Detect and fix: Loading 100 users, then making 100 separate calls for their posts.',
            hints: [
              'This needs SPEED',
              'Someone who can navigate code quickly',
              'The Builder excels at rapid fixes',
            ],
            correctAnswer: 'cursor',
            timeLimit: 45,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Optimize: Nested loops causing O(n³) complexity in rendering.',
            hints: [
              'Fast implementation required',
              'Cursor can ship the fix quickly',
            ],
            correctAnswer: 'cursor',
            timeLimit: 30,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Emergency: Production is down. N+1 in critical path.',
            hints: [
              'No time to think - SHIP IT',
            ],
            correctAnswer: 'cursor',
            timeLimit: 20,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[LAG BEAST]: Q U E R Y . . . A L L . . . T H E . . . T H I N G S . . .',
          '[SYSTEM]: 10,000 database calls detected',
          '[SYSTEM]: Response time: 45 seconds',
        ],
        success: [
          '*Cursor batches the queries in milliseconds*',
          '[CURSOR]: Done. 10,000 queries → 1 query. Shipped.',
          '[LAG BEAST]: N O O O O . . . F A S T E R . . .',
          '[DAMAGE: 350 HP]',
        ],
        failure: [
          '*The queries multiply*',
          '[LAG BEAST]: M O R E . . . S L O W E R . . .',
          '[SYSTEM]: Database timeout',
        ],
        hint: [
          'You need SPEED',
          'Who can ship fixes fastest?',
        ],
      },
      
      timeLimit: 45,
      helperNPC: 'cursor',
    },
    
    // PHASE 2: MEMORY LEAK MADNESS (75-50% HP)
    {
      number: 2,
      healthPercent: 75,
      name: 'Memory Leak Madness',
      
      challenge: {
        type: 'orchestration',
        prompt: 'The Beast creates memory leaks. But Cursor\'s fast fix might have bugs!',
        description: 'You need BOTH speed AND quality. How do you orchestrate?',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Fix memory leaks without introducing new bugs.',
            hints: [
              'First, ship the fix (Cursor)',
              'Then, verify correctness (Dexter)',
              'Speed + Quality = Victory',
            ],
            correctAnswer: ['cursor', 'dexter'],
            timeLimit: 60,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Optimize memory usage while maintaining code quality.',
            hints: [
              'Two agents needed',
              'Build fast, verify thoroughly',
            ],
            correctAnswer: ['cursor', 'dexter'],
            timeLimit: 45,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Critical memory issue. Must be fast AND correct.',
            hints: [
              'Cursor + Dexter synergy',
            ],
            correctAnswer: ['cursor', 'dexter'],
            timeLimit: 30,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[LAG BEAST]: M E M O R Y . . . G R O W I N G . . .',
          '[SYSTEM]: RAM usage: 47 GB and climbing',
          '[SYSTEM]: Event listeners not cleaned up',
        ],
        success: [
          '*Cursor patches the leaks rapidly*',
          '*Dexter verifies no new bugs introduced*',
          '[CURSOR]: Fixed. Shipped.',
          '[DEXTER]: Verified. 99.2% certainty of correctness.',
          '[LAG BEAST]: I M P O S S I B L E . . . B O T H ? !',
          '[DAMAGE: 400 HP]',
        ],
        failure: [
          '*Cursor ships too fast, introduces bugs*',
          '[LAG BEAST]: N E W . . . L E A K S . . . Y E S . . .',
          '[SYSTEM]: Now you have TWO problems',
        ],
        hint: [
          'This needs teamwork',
          'Speed alone creates bugs',
          'Quality alone is too slow',
        ],
      },
      
      mechanic: {
        name: 'Compound Lag',
        description: 'Each failed attempt makes the system SLOWER',
        visualEffect: 'Screen stutters increasingly',
        counterStrategy: 'Perfect orchestration of Speed + Quality',
        triggersAt: 75,
      },
      
      timeLimit: 60,
      helperNPC: 'cursor',
    },
    
    // PHASE 3: RENDER THRASHING (50-25% HP)
    {
      number: 3,
      healthPercent: 50,
      name: 'Render Thrashing',
      
      challenge: {
        type: 'strategy',
        prompt: 'The Beast forces unnecessary re-renders. React is melting!',
        description: 'Choose the optimization strategy.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Components re-render 100 times per second.',
            options: [
              'Ask Cursor to add React.memo everywhere',
              'Ask Claude to redesign state architecture',
              'Ask Dexter to profile and identify root cause',
            ],
            hints: [
              'First, UNDERSTAND the problem',
              'Then architect a solution',
              'Finally, implement quickly',
            ],
            correctAnswer: 'Ask Dexter to profile and identify root cause',
            timeLimit: 50,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Unnecessary renders cascading through component tree.',
            options: [
              'Profile first, then fix (Dexter → Claude → Cursor)',
              'Just add memoization everywhere (Cursor only)',
            ],
            hints: [
              'Understand before optimizing',
              'Systematic approach wins',
            ],
            correctAnswer: 'Profile first, then fix (Dexter → Claude → Cursor)',
            timeLimit: 40,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Critical render performance issue in production.',
            options: [
              'Analyze → Design → Implement → Verify',
              'Ship fix immediately without analysis',
            ],
            hints: [
              'Proper process matters',
            ],
            correctAnswer: 'Analyze → Design → Implement → Verify',
            timeLimit: 30,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[LAG BEAST]: R E N D E R . . . F O R E V E R . . .',
          '[SYSTEM]: 10,000 component updates per second',
          '[SYSTEM]: Browser freezing...',
        ],
        success: [
          '*Dexter profiles and finds the root cause*',
          '[DEXTER]: Identified: State updates in wrong component.',
          '*Claude redesigns the state flow*',
          '[CLAUDE]: Here is the optimal architecture.',
          '*Cursor implements the fix*',
          '[CURSOR]: Shipped. Renders reduced 99%.',
          '[LAG BEAST]: S Y S T E M A T I C . . . D E F E A T . . .',
          '[DAMAGE: 450 HP]',
        ],
        failure: [
          '*Random optimizations without understanding*',
          '[LAG BEAST]: G U E S S I N G . . . F A I L I N G . . .',
          '[SYSTEM]: Performance worse than before',
        ],
        hint: [
          'Understand, Design, Implement, Verify',
          'That\'s the full process',
        ],
      },
      
      timeLimit: 50,
      helperNPC: 'dexter',
    },
    
    // PHASE 4: THE FINAL OPTIMIZATION (25-0% HP)
    {
      number: 4,
      healthPercent: 25,
      name: 'The Final Optimization',
      
      challenge: {
        type: 'orchestration',
        prompt: 'The Beast\'s final form: A tangle of EVERY performance issue at once!',
        description: 'Coordinate ALL your agents for the perfect optimization.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Multiple performance issues simultaneously. Coordinate the team.',
            hints: [
              'Dexter: Identify problems',
              'Claude: Design solutions',
              'Cursor: Implement fast',
              'Dexter: Verify results',
            ],
            correctAnswer: ['dexter', 'claude', 'cursor', 'dexter'],
            timeLimit: 90,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Complex performance optimization requiring full team coordination.',
            hints: [
              'Analyze, Design, Build, Verify',
              'Each agent has a role',
            ],
            correctAnswer: ['dexter', 'claude', 'cursor', 'dexter'],
            timeLimit: 60,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Ultimate performance challenge. Perfect orchestration required.',
            hints: [
              'The full cycle',
            ],
            correctAnswer: ['dexter', 'claude', 'cursor', 'dexter'],
            timeLimit: 45,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[LAG BEAST]: *combines into final form*',
          '[LAG BEAST]: A L L . . . P R O B L E M S . . . A T . . . O N C E . . .',
          '[SYSTEM]: N+1 queries + Memory leaks + Render thrashing + Bundle bloat',
          '[SYSTEM]: This is IMPOSSIBLE to solve!',
        ],
        success: [
          '*Your team works in perfect harmony*',
          '[DEXTER]: Analysis complete. 14 bottlenecks identified.',
          '[CLAUDE]: Optimal architecture designed. Addressing root causes.',
          '[CURSOR]: Implementation complete. All 14 fixes shipped.',
          '[DEXTER]: Verification complete. 99.7% performance improvement confirmed.',
          '',
          '[LAG BEAST]: P E R F E C T . . . S Y N C H R O N Y . . .',
          '[LAG BEAST]: I . . . C A N N O T . . . S U R V I V E . . . T H I S . . .',
          '*The Beast disintegrates into optimized code*',
          '[FINAL BLOW: 500 HP]',
          '[BOSS DEFEATED]',
        ],
        failure: [
          '*Chaos. No coordination. Everything breaks.*',
          '[LAG BEAST]: C H A O S . . . F E E D S . . . M E . . .',
          '[SYSTEM]: Total system failure',
        ],
        hint: [
          'Perfect orchestration required',
          'Each agent plays their part',
          'Trust the process',
        ],
      },
      
      timeLimit: 90,
      helperNPC: 'claude',
    },
  ],
  
  defeatDialogue: [
    '*The Lag Beast crumbles into clean, optimized code*',
    '',
    '[LAG BEAST]: Y O U . . . H A V E . . . L E A R N E D . . .',
    '[LAG BEAST]: S P E E D . . . P L U S . . . Q U A L I T Y . . .',
    '[LAG BEAST]: T R U E . . . P E R F O R M A N C E . . .',
    '',
    '*dissolves into 60 FPS smoothness*',
    '',
    '[BOSS DEFEATED: THE LAG BEAST]',
    '[ACHIEVEMENT UNLOCKED: "Optimized"]',
  ],
  
  victoryDialogue: [
    '[CURSOR]: Not bad. You coordinated us pretty well.',
    '[DEXTER]: Performance metrics: Exceptional. 99.7% improvement.',
    '[CURSOR]: *grudgingly* Fine. Dexter WAS helpful.',
    '[DEXTER]: And Cursor\'s speed was... optimal.',
    '[CURSOR & DEXTER]: *nod at each other*',
    '[CLAUDE]: And so, former rivals become allies.',
  ],
  
  rewards: {
    xp: 750,
    gold: 450,
    achievements: ['optimized', 'speed-plus-quality', 'cursor-dexter-synergy'],
    unlocks: {
      npcs: ['gemini'],
      skills: ['performance-optimization', 'team-orchestration-tier-2'],
      quests: ['main-09', 'main-10'],
    },
    loreFragment: 'The Lag Beast taught you: True performance requires BOTH speed and quality. Never sacrifice one for the other.',
  },
};
