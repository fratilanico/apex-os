import type { BossBattle } from '../../types/boss';

/**
 * BOSS 4: THE PIXEL PHANTOM
 * 
 * A ghostly perfectionist that prevents anything from shipping.
 * Represents design paralysis and the tyranny of perfectionism.
 * 
 * THEME: Done is better than perfect - overcoming perfectionism
 * LESSON: Pixel confronts their shadow self and learns to ship iteratively
 */

export const PIXEL_PHANTOM_BOSS: BossBattle = {
  id: 'phantom',
  name: 'THE PIXEL PHANTOM',
  title: 'Perfectionist Paralysis',
  act: 3,
  location: 'The Infinite Canvas',
  theme: 'Overcoming perfectionism to ship and iterate',
  
  asciiArt: `
    ╔═══════════════╗
    ║   ◊ NOT ◊    ║
    ║   PERFECT    ║
    ║   ENOUGH     ║
    ║   ◊ YET ◊    ║
    ║   ONE MORE   ║
    ║   ITERATION  ║
    ╚═══════════════╝
  `,
  
  maxHealth: 1800,
  
  unlockCondition: {
    type: 'quest_complete',
    value: 'main-14',
  },
  
  introDialogue: [
    '*A shimmering phantom materializes, endlessly adjusting invisible pixels*',
    '',
    '[PHANTOM]: Just one more adjustment...',
    '[PHANTOM]: This color is off by 0.2%...',
    '[PHANTOM]: The kerning needs 0.5px more...',
    '[PHANTOM]: The animation timing is 12ms too slow...',
    '[PHANTOM]: It\'s not... quite... PERFECT... yet...',
    '',
    '[PIXEL]: *gasps* That\'s... that\'s ME!',
    '[PIXEL]: Or what I could become...',
    '',
    '[SYSTEM]: BOSS BATTLE: THE PIXEL PHANTOM',
  ],
  
  phases: [
    // PHASE 1: THE ENDLESS REFINEMENT (100-75% HP)
    {
      number: 1,
      healthPercent: 100,
      name: 'The Endless Refinement',
      
      challenge: {
        type: 'decision',
        prompt: 'Your design is 90% done. The Phantom wants you to spend 3 more weeks on minor details.',
        description: 'What do you do?',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'The UI is functional and accessible. Ship it or perfect it?',
            options: [
              'Ship now, iterate based on user feedback',
              'Spend 3 more weeks getting it perfect',
              'Ask Pixel for advice on when to ship',
            ],
            hints: [
              'Perfect is the enemy of shipped',
              'Users can\'t give feedback on unreleased work',
              'Pixel must confront this herself',
            ],
            correctAnswer: 'Ship now, iterate based on user feedback',
            timeLimit: 45,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Good design vs perfect design. When do you ship?',
            options: [
              'Ship when it\'s good enough, iterate',
              'Delay until absolutely perfect',
            ],
            hints: [
              'Done > Perfect',
              'Real users > hypothetical perfection',
            ],
            correctAnswer: 'Ship when it\'s good enough, iterate',
            timeLimit: 30,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Define "good enough" vs "perfect".',
            options: [
              'Meets requirements, accessible, usable = Ship',
              'Flawless in every detail = Ship',
            ],
            hints: [
              'Requirements met = good enough',
            ],
            correctAnswer: 'Meets requirements, accessible, usable = Ship',
            timeLimit: 20,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[PHANTOM]: This design... it\'s ALMOST there...',
          '[PHANTOM]: Just a few more iterations...',
          '[PHANTOM]: Don\'t ship it yet. It\'s not PERFECT.',
          '[PIXEL]: *trembling* I... I do say that a lot...',
        ],
        success: [
          '[PLAYER]: The design is GOOD. Users can use it. It\'s accessible.',
          '[PLAYER]: Ship it. Get feedback. Iterate.',
          '',
          '[PIXEL]: *takes a breath* You\'re right.',
          '[PIXEL]: Done is better than perfect!',
          '*The Phantom flickers*',
          '[PHANTOM]: No! You need MORE refinement!',
          '[DAMAGE: 400 HP]',
        ],
        failure: [
          '[PLAYER]: You\'re right. Let\'s keep refining...',
          '*3 weeks pass. No shipping. The Phantom grows stronger.*',
          '[PHANTOM]: Yesss... perfectionism is PARALYSIS...',
          '[SYSTEM]: Project delayed indefinitely',
        ],
        hint: [
          'Perfection prevents shipping',
          'Users need good, not perfect',
        ],
      },
      
      timeLimit: 45,
      helperNPC: 'pixel',
    },
    
    // PHASE 2: THE COLOR OBSESSION (75-50% HP)
    {
      number: 2,
      healthPercent: 75,
      name: 'The Color Obsession',
      
      challenge: {
        type: 'decision',
        prompt: 'The Phantom claims your primary color (#3B82F6) should be #3B83F6 instead.',
        description: 'That\'s a 1-unit difference. Imperceptible. How do you respond?',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Spend 2 hours debating a 1-unit hex color difference?',
            options: [
              'No. The current color works fine.',
              'Yes. Every detail matters.',
              'Ask Pixel: Is this worth the time?',
            ],
            hints: [
              'Diminishing returns exist',
              'Time is finite',
              'This is Pixel\'s lesson to learn',
            ],
            correctAnswer: 'No. The current color works fine.',
            timeLimit: 30,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Imperceptible changes vs meaningful improvements.',
            options: [
              'Focus on meaningful improvements',
              'Obsess over imperceptible details',
            ],
            hints: [
              'ROI matters in design too',
            ],
            correctAnswer: 'Focus on meaningful improvements',
            timeLimit: 20,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Where do you draw the line on refinement?',
            options: [
              'When changes are imperceptible',
              'Never - perfection has no limits',
            ],
            hints: [
              'Sanity has limits',
            ],
            correctAnswer: 'When changes are imperceptible',
            timeLimit: 15,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[PHANTOM]: This color is off by ONE UNIT!',
          '[PHANTOM]: Users will NOTICE!',
          '[PHANTOM]: Spend hours getting it EXACTLY right!',
          '[PIXEL]: *quietly* ...but will they really notice?',
        ],
        success: [
          '[PIXEL]: No. No one will notice 1 unit.',
          '[PIXEL]: This is... this is madness.',
          '[PIXEL]: I\'ve been obsessing over IMPERCEPTIBLE details!',
          '[PIXEL]: *to Phantom* You\'re not protecting quality. You\'re preventing SHIPPING!',
          '*The Phantom recoils*',
          '[PHANTOM]: But... but EXCELLENCE!',
          '[PIXEL]: Excellence is shipping something GREAT. Not never shipping something PERFECT!',
          '[DAMAGE: 450 HP]',
        ],
        failure: [
          '*You spend 2 hours adjusting the color*',
          '[PHANTOM]: Yesss... now adjust it back... then forward again...',
          '[SYSTEM]: Time wasted on imperceptible changes',
        ],
        hint: [
          'Diminishing returns are real',
          'Perfect is IMPOSSIBLE',
          'Great is ACHIEVABLE',
        ],
      },
      
      mechanic: {
        name: 'Perfectionist Spiral',
        description: 'Each refinement creates need for MORE refinements',
        visualEffect: 'Infinite loops of adjustments',
        counterStrategy: 'Set clear "good enough" standards and SHIP',
        triggersAt: 75,
      },
      
      timeLimit: 30,
      helperNPC: 'pixel',
    },
    
    // PHASE 3: THE REDESIGN LOOP (50-25% HP)
    {
      number: 3,
      healthPercent: 50,
      name: 'The Redesign Loop',
      
      challenge: {
        type: 'decision',
        prompt: 'The Phantom suggests completely redesigning something that already works.',
        description: 'Your button component is functional and accessible. Redesign or ship?',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Current design: Good. Phantom\'s suggestion: Better? But 2 weeks of work.',
            options: [
              'Ship current, redesign in V2 if needed',
              'Redesign now, delay shipping',
              'Ask Cursor: Would users care?',
            ],
            hints: [
              'V1 doesn\'t need to be V2',
              'Iteration is the path to great design',
              'Users want it NOW, not PERFECT',
            ],
            correctAnswer: 'Ship current, redesign in V2 if needed',
            timeLimit: 40,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Good now vs perfect later. What ships?',
            options: [
              'Ship good now, iterate to perfect',
              'Delay for perfect V1',
            ],
            hints: [
              'Iteration > Perfection',
            ],
            correctAnswer: 'Ship good now, iterate to perfect',
            timeLimit: 25,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'V1 philosophy: What should it be?',
            options: [
              'Functional, good, shippable',
              'Perfect in every way',
            ],
            hints: [
              'Ship to learn',
            ],
            correctAnswer: 'Functional, good, shippable',
            timeLimit: 15,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[PHANTOM]: Wait! I have a BETTER design!',
          '[PHANTOM]: The current one is GOOD, but this new one...',
          '[PHANTOM]: It\'s PERFECT!',
          '[PHANTOM]: Just redesign everything!',
          '',
          '[CURSOR]: *appears* Oh HELL no.',
          '[CURSOR]: We\'ve been building this for WEEKS.',
        ],
        success: [
          '[CURSOR]: The design is GOOD. Accessible. Functional.',
          '[CURSOR]: Ship it. If users want improvements, we\'ll ITERATE.',
          '',
          '[PIXEL]: Cursor\'s right. V1 doesn\'t need to be V2.',
          '[PIXEL]: *to Phantom* You want me to NEVER ship!',
          '[PIXEL]: That\'s not excellence. That\'s FEAR!',
          '',
          '*The Phantom staggers*',
          '[PHANTOM]: Fear... of not being good enough...',
          '[PIXEL]: I AM good enough. And so is this design!',
          '[DAMAGE: 500 HP]',
        ],
        failure: [
          '*You start redesigning*',
          '*2 weeks later, the Phantom suggests ANOTHER redesign*',
          '[PHANTOM]: This new design is even BETTER!',
          '*Infinite loop. Nothing ever ships.*',
        ],
        hint: [
          'Perfect is the enemy of done',
          'Ship to learn what users ACTUALLY want',
        ],
      },
      
      timeLimit: 40,
      helperNPC: 'cursor',
    },
    
    // PHASE 4: THE FINAL CONFRONTATION (25-0% HP)
    {
      number: 4,
      healthPercent: 25,
      name: 'The Final Confrontation',
      
      challenge: {
        type: 'decision',
        prompt: 'Pixel must face her shadow self directly.',
        description: 'The Phantom IS Pixel\'s perfectionism. Only she can defeat it.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'PIXEL must choose: Perfectionism or Iteration?',
            options: [
              'Let Pixel choose iteration and growth',
              'Protect Pixel\'s perfectionism',
            ],
            hints: [
              'This is Pixel\'s fight',
              'She must choose to let go',
              'Support her decision',
            ],
            correctAnswer: 'Let Pixel choose iteration and growth',
            timeLimit: 60,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Support Pixel in overcoming perfectionism.',
            hints: [
              'She has to choose to let go',
            ],
            correctAnswer: 'Let Pixel choose iteration and growth',
            timeLimit: 40,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Pixel vs her shadow self.',
            hints: [
              'Let her fight this battle',
            ],
            correctAnswer: 'Let Pixel choose iteration and growth',
            timeLimit: 30,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[PHANTOM]: Pixel... I am YOU.',
          '[PHANTOM]: Your desire for BEAUTY.',
          '[PHANTOM]: Your fear of shipping something IMPERFECT.',
          '[PHANTOM]: Without me... you\'re just... MEDIOCRE.',
          '',
          '[PIXEL]: *trembling*',
          '[PIXEL]: You\'re right. You ARE me.',
          '[PIXEL]: But...',
        ],
        success: [
          '[PIXEL]: But you\'re the WORST part of me!',
          '[PIXEL]: The part that cares more about PERFECTION than PEOPLE!',
          '[PIXEL]: The part that would rather ship NOTHING than ship GOOD!',
          '',
          '[PIXEL]: I LOVE beauty. I LOVE design. I LOVE excellence!',
          '[PIXEL]: But I love CREATING more than I love PERFECTING!',
          '',
          '[PIXEL]: *directly to Phantom*',
          '[PIXEL]: I am not mediocre. I am ITERATIVE.',
          '[PIXEL]: I ship V1. I learn. I ship V2. I improve.',
          '[PIXEL]: That\'s not settling. That\'s GROWING!',
          '',
          '*Pixel glows with confidence*',
          '[PIXEL]: Done is better than perfect. And I am DONE with you!',
          '',
          '*The Phantom dissolves into shimmering pixels*',
          '[PHANTOM]: Finally... you are... free...',
          '[FINAL BLOW: 600 HP]',
          '[BOSS DEFEATED]',
        ],
        failure: [
          '[PIXEL]: Maybe you\'re right... maybe I need you...',
          '[PHANTOM]: Yesss... NEVER ship... ALWAYS refine...',
          '*Pixel becomes the Phantom*',
          '[SYSTEM]: GAME OVER - Trapped in perfectionism forever',
        ],
        hint: [
          'Pixel must reject perfectionism herself',
          'Support her, but let HER choose',
        ],
      },
      
      timeLimit: 60,
      helperNPC: 'pixel',
    },
  ],
  
  defeatDialogue: [
    '*The Phantom transforms into a gentle glow*',
    '',
    '[PHANTOM]: I was... your fear...',
    '[PHANTOM]: Fear of not being good enough...',
    '[PHANTOM]: But you ARE good enough...',
    '[PHANTOM]: Ship. Iterate. Grow.',
    '',
    '*dissolves into beautiful, imperfect pixels*',
    '',
    '[PIXEL]: *tears of joy* I\'m FREE!',
    '[PIXEL]: I can ship! I can iterate! I can GROW!',
    '',
    '[BOSS DEFEATED: THE PIXEL PHANTOM]',
    '[ACHIEVEMENT UNLOCKED: "Done Is Better Than Perfect"]',
  ],
  
  victoryDialogue: [
    '[CURSOR]: FINALLY. Pixel learned to SHIP!',
    '[PIXEL]: *laughs* Shut up, Cursor!',
    '[PIXEL]: But... you\'re right. Shipping feels AMAZING!',
    '[DEXTER]: Your design quality: Still excellent. But now... shipped.',
    '[PIXEL]: Shipped and IMPROVING. That\'s the dream! ✨',
    '[CLAUDE]: The student becomes the master. Well done, Pixel.',
  ],
  
  rewards: {
    xp: 1200,
    gold: 750,
    achievements: ['done-better-than-perfect', 'pixel-reborn', 'overcame-perfectionism'],
    unlocks: {
      npcs: ['maestro'],
      skills: ['iterative-design', 'shipping-mindset'],
      quests: ['main-15', 'main-16'],
    },
    loreFragment: 'The Phantom was not evil. It was fear. Fear that good enough isn\'t enough. But iteration proves: good becomes great through SHIPPING.',
  },
};
