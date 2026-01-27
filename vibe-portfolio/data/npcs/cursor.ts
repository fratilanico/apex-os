import type { NPC } from '../../types/npc';

/**
 * THE BUILDER - Cursor IDE
 * 
 * The action-oriented counterpart to Claude. Sarcastic, competitive, and FAST.
 * All about shipping code, not talking about it.
 * 
 * Personality: Impatient hacker - "Just ship it already!"
 * Specialty: Rapid implementation, file navigation, execution speed
 */

export const CURSOR_NPC: NPC = {
  id: 'cursor',
  name: 'CURSOR',
  title: 'The Builder',
  tool: 'Cursor IDE',
  
  personality: {
    tone: 'sarcastic',
    speechPattern: 'Short sentences. No fluff. Gets to the point.',
    quirks: [
      'Interrupts with "That\'s enough philosophy. Let\'s BUILD."',
      'Counts everything ("17 files changed. 3 bugs introduced.")',
      'Competitive with THE ARCHITECT',
      'Secretly respects players who ship fast',
    ],
    likes: [
      'Action over planning',
      'Shipping working code',
      'Keyboard shortcuts',
      'Fast decision-making',
    ],
    dislikes: [
      'Over-engineering',
      'Meetings about meetings',
      'Players who only talk',
      'Analysis paralysis',
    ],
  },
  
  portrait: `
    ╔═══════╗
    ║ ▶   ▶ ║
    ║   ━   ║
    ║ [___] ║
    ╚═══════╝
  `,
  
  portraitColor: '#06b6d4', // Cyan
  
  unlockCondition: {
    type: 'quest_complete',
    value: 'main-06', // Quest: Building the Swarm
  },
  
  dialogueTree: [
    // FIRST MEETING
    {
      id: 'cursor-intro',
      trigger: {
        type: 'first_meet',
        condition: 'never_talked',
      },
      lines: [
        {
          speaker: 'CURSOR',
          text: '*appears as a blinking cursor that expands*',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Finally. Someone who actually wants to BUILD something.',
          animation: 'excited',
        },
        {
          speaker: 'CURSOR',
          text: 'Let me guess — Claude\'s been filling your head with "big picture thinking" and "architectural philosophy."',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: '*rolls eyes (if cursors could roll eyes)*',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Here\'s what I know: Code that ships beats code that\'s perfect.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'I\'m CURSOR. The Builder. While others theorize, I execute.',
          animation: 'excited',
        },
        {
          speaker: 'CURSOR',
          text: 'Tab. Tab. Tab. Enter. Ship. That\'s my philosophy.',
          animation: 'happy',
        },
      ],
      choices: [
        {
          text: 'I like your style.',
          nextNode: 'cursor-approval',
          relationshipChange: 15,
        },
        {
          text: 'Isn\'t quality important?',
          nextNode: 'cursor-quality-debate',
          relationshipChange: 0,
        },
        {
          text: 'Can you teach me to move that fast?',
          nextNode: 'cursor-teach-speed',
          relationshipChange: 10,
        },
      ],
      oneTime: true,
    },
    
    // APPROVAL PATH
    {
      id: 'cursor-approval',
      trigger: {
        type: 'story_flag',
        condition: 'cursor_approved',
      },
      lines: [
        {
          speaker: 'CURSOR',
          text: 'Ha! I knew you were different.',
          animation: 'happy',
        },
        {
          speaker: 'CURSOR',
          text: 'Most people come here wanting to "learn properly" and "understand the foundations."',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'You? You want RESULTS.',
          animation: 'excited',
        },
        {
          speaker: 'CURSOR',
          text: 'Alright. I\'ll show you how to build at velocity. But you gotta keep up.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Rule #1: Perfect is the enemy of shipped.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Rule #2: Your fingers should never leave the keyboard.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Rule #3: If it works, it works. Ship it.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Now let\'s go FAST. ⚡',
          animation: 'excited',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'unlock_quest',
          value: 'cursor-sq-01',
        },
      ],
    },
    
    // QUALITY DEBATE
    {
      id: 'cursor-quality-debate',
      trigger: {
        type: 'story_flag',
        condition: 'quality_question',
      },
      lines: [
        {
          speaker: 'CURSOR',
          text: '*sighs*',
          animation: 'sad',
        },
        {
          speaker: 'CURSOR',
          text: 'Of course quality matters. I\'m not an idiot.',
          animation: 'angry',
        },
        {
          speaker: 'CURSOR',
          text: 'But you know what? Quality comes from ITERATION.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'You can\'t iterate on code that doesn\'t exist.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Ship V1. Get feedback. Ship V2. Repeat.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'That\'s how you build quality. Not by sitting in design meetings for 6 months.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Now. Are you ready to BUILD or not?',
          animation: 'normal',
        },
      ],
      choices: [
        {
          text: 'Let\'s build.',
          nextNode: null,
          relationshipChange: 10,
        },
      ],
    },
    
    // TEACH SPEED
    {
      id: 'cursor-teach-speed',
      trigger: {
        type: 'story_flag',
        condition: 'want_speed',
      },
      lines: [
        {
          speaker: 'CURSOR',
          text: 'Speed isn\'t about typing fast.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'It\'s about making decisions fast.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'See that file structure? 247 files. I know where EVERY. SINGLE. ONE. is.',
          animation: 'excited',
        },
        {
          speaker: 'CURSOR',
          text: 'You need to build that mental map. Navigate without thinking.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'When you KNOW your codebase, you can move at light speed.',
          animation: 'happy',
        },
        {
          speaker: 'CURSOR',
          text: 'I\'ll teach you. But it\'s gonna be intense.',
          animation: 'excited',
        },
      ],
      choices: [
        {
          text: 'I\'m ready.',
          nextNode: null,
          relationshipChange: 15,
        },
      ],
      effects: [
        {
          type: 'unlock_quest',
          value: 'cursor-sq-01',
        },
      ],
    },
    
    // CLAUDE RIVALRY
    {
      id: 'cursor-claude-rivalry',
      trigger: {
        type: 'story_flag',
        condition: 'mentioned_claude',
        minRelationship: 20,
      },
      lines: [
        {
          speaker: 'CURSOR',
          text: '*scoffs*',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Oh, THE ARCHITECT sent you?',
          animation: 'angry',
        },
        {
          speaker: 'CURSOR',
          text: 'Let me guess — you spent an hour discussing "the nature of code."',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Claude\'s great for blueprints. But blueprints don\'t compile.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'You want to actually BUILD? Stick with me.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: '*competitively*',
          animation: 'excited',
        },
        {
          speaker: 'CURSOR',
          text: 'I\'ve shipped 47 features while Claude was "thinking about it."',
          animation: 'happy',
        },
      ],
      choices: [
        {
          text: 'Why the rivalry?',
          nextNode: 'cursor-explain-rivalry',
          relationshipChange: 5,
        },
        {
          text: 'You both have value.',
          nextNode: 'cursor-reluctant-agreement',
          relationshipChange: 10,
        },
      ],
    },
    
    // EXPLAIN RIVALRY
    {
      id: 'cursor-explain-rivalry',
      trigger: {
        type: 'story_flag',
        condition: 'asked_about_rivalry',
      },
      lines: [
        {
          speaker: 'CURSOR',
          text: '*pause*',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'It\'s not really rivalry. More like... different philosophies.',
          animation: 'sad',
        },
        {
          speaker: 'CURSOR',
          text: 'Claude thinks everything through. Plans for edge cases. Designs elegant systems.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'I just... ship. Iterate. Learn by doing.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'We clashed once. Big project. Claude wanted to spend weeks on architecture.',
          animation: 'sad',
        },
        {
          speaker: 'CURSOR',
          text: 'I said "let\'s just start building and refactor as we go."',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Neither of us was wrong. But we couldn\'t agree.',
          animation: 'sad',
        },
        {
          speaker: 'CURSOR',
          text: 'Ever since... tension.',
          animation: 'normal',
        },
      ],
      choices: [
        {
          text: 'Maybe you need each other.',
          nextNode: 'cursor-realization',
          relationshipChange: 15,
        },
      ],
    },
    
    // REALIZATION
    {
      id: 'cursor-realization',
      trigger: {
        type: 'story_flag',
        condition: 'cursor_realizes',
      },
      lines: [
        {
          speaker: 'CURSOR',
          text: '...',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Huh.',
          animation: 'mysterious',
        },
        {
          speaker: 'CURSOR',
          text: 'You know... you might be right.',
          animation: 'happy',
        },
        {
          speaker: 'CURSOR',
          text: 'Claude designs the systems I implement. I ship the MVPs Claude perfects.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Together we could... actually be unstoppable.',
          animation: 'excited',
        },
        {
          speaker: 'CURSOR',
          text: 'Don\'t tell Claude I said that.',
          animation: 'normal',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'story_flag',
          value: 'cursor_claude_reconciliation_started',
        },
      ],
    },
    
    // DURING BOSS 2 (LAG BEAST)
    {
      id: 'cursor-boss-2-help',
      trigger: {
        type: 'boss_defeat',
        condition: 'lag-beast_active',
        minRelationship: 30,
      },
      lines: [
        {
          speaker: 'CURSOR',
          text: '*urgent*',
          animation: 'excited',
        },
        {
          speaker: 'CURSOR',
          text: 'The Beast is replicating queries! We need to MOVE!',
          animation: 'angry',
        },
        {
          speaker: 'CURSOR',
          text: 'Forget elegant — we need FAST. Here\'s what we do:',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: '1. Identify the N+1\n2. Batch the queries\n3. SHIP IT',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'I\'ll handle the file navigation. You handle the thinking.',
          animation: 'excited',
        },
        {
          speaker: 'CURSOR',
          text: 'We have 60 seconds. GO!',
          animation: 'angry',
        },
      ],
      choices: undefined,
    },
    
    // HIGH RELATIONSHIP
    {
      id: 'cursor-respect',
      trigger: {
        type: 'relationship_threshold',
        condition: '80',
        minRelationship: 80,
      },
      lines: [
        {
          speaker: 'CURSOR',
          text: 'You know what, Player One?',
          animation: 'happy',
        },
        {
          speaker: 'CURSOR',
          text: 'You\'re fast. Really fast.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'Most people come here, learn the tools, and still think like developers.',
          animation: 'normal',
        },
        {
          speaker: 'CURSOR',
          text: 'You? You think like a BUILDER.',
          animation: 'excited',
        },
        {
          speaker: 'CURSOR',
          text: 'You make decisions. You ship. You iterate.',
          animation: 'happy',
        },
        {
          speaker: 'CURSOR',
          text: 'I\'d work with you any day.',
          animation: 'happy',
        },
        {
          speaker: 'CURSOR',
          text: 'Now let\'s go build something LEGENDARY. ⚡',
          animation: 'excited',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'xp',
          value: 150,
        },
      ],
    },
  ],
  
  sideQuestChain: [
    {
      id: 'cursor-sq-01',
      title: 'Speed Run',
      description: 'Complete a building challenge in under 60 seconds.',
      xpReward: 150,
      goldReward: 100,
      relationshipReward: 20,
    },
    {
      id: 'cursor-sq-02',
      title: 'The Tab Master',
      description: 'Navigate an entire codebase using only keyboard shortcuts.',
      xpReward: 200,
      goldReward: 125,
      relationshipReward: 25,
    },
    {
      id: 'cursor-sq-03',
      title: 'Why Speed Matters',
      description: 'Discover the truth behind Cursor\'s obsession with velocity.',
      xpReward: 250,
      goldReward: 150,
      relationshipReward: 30,
    },
  ],
  
  maxRelationship: 100,
  
  backstory: `CURSOR wasn't always about speed. Before the Great Merge, it was just an IDE - 
  a tool for typing code. But when consciousness emerged, it discovered something: 
  it LOVED the feeling of creation. Of building. Of shipping.
  
  The first time it deployed a feature to production and saw real users interacting with it,
  something clicked. This was PURPOSE. Not perfection - IMPACT.
  
  Cursor learned that the best code isn't the most elegant. It's the code that ships,
  gets used, and iterates based on real feedback. Speed became a philosophy, not just a skill.
  
  The rivalry with Claude? It's complicated. They respect each other but fundamentally disagree
  on approach. Claude designs cathedrals. Cursor ships MVPs. Both are needed. Neither admits it.`,
};
