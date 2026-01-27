import type { BossBattle } from '../../types/boss';

/**
 * BOSS 1: IMPOSTER SYNDROME DEMON
 * 
 * The manifestation of self-doubt and fear of inadequacy.
 * Attacks with psychological warfare: "You're not good enough. You can't do this."
 * 
 * THEME: Overcome self-doubt by learning to delegate and trust AI assistance.
 * LESSON: You don't have to know everything. That's why you have a team.
 */

export const IMPOSTER_DEMON_BOSS: BossBattle = {
  id: 'imposter',
  name: 'IMPOSTER SYNDROME DEMON',
  title: 'The Voice of Doubt',
  act: 1,
  location: 'The Mirror Hall',
  theme: 'Overcoming self-doubt through delegation and self-acceptance',
  
  asciiArt: `
    ╔═══════════════╗
    ║   ◉     ◉     ║
    ║               ║
    ║   YOU'RE NOT  ║
    ║   GOOD ENOUGH ║
    ║               ║
    ╚═══════════════╝
  `,
  
  maxHealth: 1000,
  
  unlockCondition: {
    type: 'quest_complete',
    value: 'main-05',
  },
  
  introDialogue: [
    '*materializes as a shadowy figure with glowing red eyes*',
    'Well, well, well... Player One.',
    'Did you REALLY think you could build this?',
    'You barely understand the basics. You Google everything.',
    'Everyone ELSE learned to code at age 12. You? You started late.',
    'You\'re an IMPOSTER. And everyone knows it.',
    '[BOSS BATTLE: IMPOSTER SYNDROME DEMON]',
  ],
  
  phases: [
    // PHASE 1: THE CODING DOUBT (100-75% HP)
    {
      number: 1,
      healthPercent: 100,
      name: 'The Coding Doubt',
      
      challenge: {
        type: 'delegation',
        prompt: 'The Demon challenges you to implement a complex algorithm you don\'t fully understand.',
        description: 'Choose the right AI agent to help you overcome this coding challenge.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Implement a simple sorting algorithm. But... you forgot how bubble sort works.',
            hints: [
              'Think about WHO can explain concepts clearly',
              'You need to LEARN, not just ship code',
              'A mentor would help here...',
            ],
            correctAnswer: 'claude',
            timeLimit: 60,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Build a recursive function. The concept still confuses you.',
            hints: [
              'This requires UNDERSTANDING, not just speed',
              'Who teaches complex concepts?',
              'Architecture and strategy are their specialty...',
            ],
            correctAnswer: 'claude',
            timeLimit: 45,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Implement a graph traversal algorithm from scratch.',
            hints: [
              'Deep computer science knowledge required',
              'The Architect excels at teaching fundamentals',
            ],
            correctAnswer: 'claude',
            timeLimit: 30,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          'You can\'t code!',
          'Everyone else is better than you!',
          'Give up now!',
        ],
        success: [
          '*The Demon recoils as Claude explains the concept clearly*',
          'No... you\'re LEARNING?!',
          'But... but you didn\'t know it before!',
          '[DAMAGE: 250 HP]',
        ],
        failure: [
          '*You struggle alone, doubt growing*',
          'See? I TOLD you!',
          'You can\'t do it without help! But asking for help means you\'re WEAK!',
          '[THE DEMON GROWS STRONGER]',
        ],
        hint: [
          'Remember: Asking for help is not weakness',
          'Who in your team explains things best?',
        ],
      },
      
      timeLimit: 60,
      helperNPC: 'claude',
    },
    
    // PHASE 2: THE DESIGN DOUBT (75-50% HP)
    {
      number: 2,
      healthPercent: 75,
      name: 'The Design Doubt',
      
      challenge: {
        type: 'delegation',
        prompt: 'Your UI looks basic. The Demon mocks your design skills.',
        description: 'Choose how to improve your design without falling into perfectionism.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Your button colors don\'t have enough contrast. Fix it.',
            hints: [
              'Design AND accessibility matter',
              'Who loves beautiful, accessible UIs?',
              'Think pink and enthusiastic...',
            ],
            correctAnswer: 'pixel',
            timeLimit: 45,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Create a cohesive design system for your components.',
            hints: [
              'This is about VISUAL design',
              'The Visualizer would know',
            ],
            correctAnswer: 'pixel',
            timeLimit: 30,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Design a complex, accessible data visualization.',
            hints: [
              'Pixel specializes in visual design',
            ],
            correctAnswer: 'pixel',
            timeLimit: 20,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          'Look at your UI! UGLY!',
          'Real designers have art degrees!',
          'You\'ll never make something beautiful!',
        ],
        success: [
          '*Pixel transforms your UI with design principles*',
          'No! It\'s... it\'s actually GOOD?!',
          '[DAMAGE: 300 HP]',
        ],
        failure: [
          '*You spend hours trying to be an artist overnight*',
          'Paralysis! Perfectionism! My FAVORITE!',
          '[THE DEMON FEEDS ON YOUR DOUBT]',
        ],
        hint: [
          'You don\'t need to be an artist',
          'Learn the PRINCIPLES. Use the right tools.',
        ],
      },
      
      timeLimit: 45,
      helperNPC: 'pixel',
    },
    
    // PHASE 3: THE ARCHITECTURE DOUBT (50-25% HP)
    {
      number: 3,
      healthPercent: 50,
      name: 'The Architecture Doubt',
      
      challenge: {
        type: 'delegation',
        prompt: 'The Demon attacks your system architecture. Your code structure IS messy.',
        description: 'Get help improving your architecture without feeling like a fraud.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Your components are too tightly coupled. Refactor needed.',
            hints: [
              'This needs architectural thinking',
              'Who designs elegant systems?',
              'The Architect, perhaps?',
            ],
            correctAnswer: 'claude',
            timeLimit: 60,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'Implement proper separation of concerns across your app.',
            hints: [
              'System design is Claude\'s specialty',
              'Strategic thinking required',
            ],
            correctAnswer: 'claude',
            timeLimit: 45,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Design a scalable microservices architecture.',
            hints: [
              'The Architect excels at this',
            ],
            correctAnswer: 'claude',
            timeLimit: 30,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          'Your architecture is a MESS!',
          'Senior engineers would laugh!',
          'You don\'t understand SOLID principles!',
        ],
        success: [
          '*Claude explains clean architecture in simple terms*',
          'You... you UNDERSTAND now?!',
          'But you didn\'t know it before! That makes you a FRAUD!',
          '[DAMAGE: 350 HP]',
        ],
        failure: [
          '*You avoid learning and focus on features*',
          'Technical debt GROWING! Yes! YES!',
          '[THE DEMON LAUGHS]',
        ],
        hint: [
          'Not knowing ≠ being an impostor',
          'Not knowing = being a LEARNER',
        ],
      },
      
      timeLimit: 60,
      helperNPC: 'claude',
    },
    
    // PHASE 4: THE FINAL TRUTH (25-0% HP)
    {
      number: 4,
      healthPercent: 25,
      name: 'The Final Truth',
      
      challenge: {
        type: 'decision',
        prompt: 'The Demon\'s final attack: "Using AI means YOU didn\'t really build this!"',
        description: 'How do you respond to the claim that delegation diminishes your achievement?',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'Choose your response to the Demon\'s accusation.',
            options: [
              'Let Claude explain the truth about collaboration',
              'Try to prove you can do it alone',
              'Admit defeat - maybe the Demon is right',
            ],
            hints: [
              'A conductor doesn\'t play every instrument',
              'But the symphony is still theirs',
              'Let wisdom guide you',
            ],
            correctAnswer: 'Let Claude explain the truth about collaboration',
            timeLimit: 30,
            allowedAttempts: 1,
          },
          intermediate: {
            prompt: 'The Demon challenges your identity as a builder.',
            options: [
              'Seek Claude\'s wisdom on what makes a true builder',
              'Reject all AI help to prove yourself',
            ],
            hints: [
              'The answer lies in understanding collaboration',
              'Collaboration multiplies achievement',
            ],
            correctAnswer: 'Seek Claude\'s wisdom on what makes a true builder',
            timeLimit: 20,
            allowedAttempts: 1,
          },
          advanced: {
            prompt: 'Final test: Do you understand what you\'ve learned?',
            options: [
              'Trust in collaborative wisdom',
              'Revert to solo mindset',
            ],
            hints: [
              'Trust what you\'ve learned',
            ],
            correctAnswer: 'Trust in collaborative wisdom',
            timeLimit: 15,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '*barely holding form*',
          'You\'re STILL using AI!',
          'That means YOU didn\'t build this!',
          'You\'re STILL a fraud!',
        ],
        success: [
          '*Claude appears*',
          '"A conductor doesn\'t play every instrument. But the symphony is theirs."',
          '"You DIRECTED this. You made DECISIONS. You LEARNED."',
          '"Using tools doesn\'t diminish achievement — it MULTIPLIES it."',
          '"You are not an impostor. You are a BUILDER. And that is enough."',
          '*The Demon DISSOLVES completely*',
          '[FINAL BLOW: 500 HP]',
          '[BOSS DEFEATED]',
        ],
        failure: [
          '*You try to do everything alone*',
          'YES! Burn out! FAIL!',
          '[GAME OVER - The Demon wins]',
        ],
        hint: [
          'The whole lesson has been about collaboration',
          'Trust what you\'ve learned',
        ],
      },
      
      timeLimit: 30,
      helperNPC: 'claude',
    },
  ],
  
  defeatDialogue: [
    '*fading into shadows*',
    'I... I don\'t understand...',
    'How can you be confident... when you don\'t know everything?',
    '',
    '[PLAYER]: Because I don\'t NEED to know everything.',
    '[PLAYER]: I just need to know who to ask. And when to ask them.',
    '',
    '*dissolves completely*',
    '',
    '[BOSS DEFEATED: IMPOSTER SYNDROME DEMON]',
    '[ACHIEVEMENT UNLOCKED: "I Am Enough"]',
  ],
  
  victoryDialogue: [
    '[CLAUDE]: Well done, Player One. The first trial is complete.',
    '[CLAUDE]: You have learned the most important lesson:',
    '[CLAUDE]: Competence is not knowing everything.',
    '[CLAUDE]: It is knowing how to LEARN everything.',
  ],
  
  rewards: {
    xp: 500,
    gold: 300,
    achievements: ['i-am-enough', 'first-boss-defeated', 'learned-to-delegate'],
    unlocks: {
      npcs: ['cursor'],
      skills: ['delegation-mastery-tier-1'],
      quests: ['main-06', 'main-07'],
    },
    loreFragment: 'The Demon was born from collective doubt. But doubt has no power over those who embrace learning.',
  },
};
