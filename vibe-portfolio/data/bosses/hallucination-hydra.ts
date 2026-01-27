import type { BossBattle } from '../../types/boss';

/**
 * BOSS 3: THE HALLUCINATION HYDRA
 * 
 * A multi-headed serpent that speaks convincing lies.
 * Each head represents a different type of AI hallucination.
 * 
 * THEME: Trust but verify - AI verification and source checking
 * LESSON: Gemini (patterns) + Dexter (verification) = Truth detection
 */

export const HALLUCINATION_HYDRA_BOSS: BossBattle = {
  id: 'hydra',
  name: 'THE HALLUCINATION HYDRA',
  title: 'The Serpent of False Truths',
  act: 2,
  location: 'The Hall of Mirrors',
  theme: 'Detecting and preventing AI hallucinations through verification',
  
  asciiArt: `
    ╔═══════════════╗
    ║   ◉ ◉ ◉ ◉ ◉   ║
    ║   │ │ │ │ │   ║
    ║   ╰─┴─┴─┴─╯   ║
    ║   CONFIDENT   ║
    ║   BUT WRONG   ║
    ╚═══════════════╝
  `,
  
  maxHealth: 2000,
  
  unlockCondition: {
    type: 'quest_complete',
    value: 'main-11',
  },
  
  introDialogue: [
    '*Five serpent heads emerge from digital fog*',
    '',
    '[HYDRA HEAD 1]: The Eiffel Tower was built in 1889.',
    '[HYDRA HEAD 2]: Actually, it was 1887.',
    '[HYDRA HEAD 3]: No, 1891. I am 99% confident.',
    '[HYDRA HEAD 4]: The architect was Alexandre Eiffel.',
    '[HYDRA HEAD 5]: All of the above are facts. Trust me.',
    '',
    '[SYSTEM]: WARNING: Conflicting information detected',
    '[SYSTEM]: Some statements are FALSE but sound TRUE',
    '[SYSTEM]: BOSS BATTLE: THE HALLUCINATION HYDRA',
  ],
  
  phases: [
    // PHASE 1: THE CONFIDENT LIE (100-75% HP)
    {
      number: 1,
      healthPercent: 100,
      name: 'The Confident Lie',
      
      challenge: {
        type: 'evaluation',
        prompt: 'The Hydra makes a claim with 98% confidence. But is it TRUE?',
        description: 'Verify the claim before accepting it.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'HYDRA: "React was created by Facebook in 2011. I am 98% confident." Verify this.',
            hints: [
              'High confidence ≠ Truth',
              'Who can see patterns and detect anomalies?',
              'The Oracle sees what others miss',
            ],
            correctAnswer: 'gemini',
            timeLimit: 45,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'HYDRA: "TypeScript 5.0 introduced native enums." Check this claim.',
            hints: [
              'Pattern recognition needed',
              'Gemini detects inconsistencies',
            ],
            correctAnswer: 'gemini',
            timeLimit: 30,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'HYDRA: Complex technical claim with citations. Verify authenticity.',
            hints: [
              'The Oracle sees through illusions',
            ],
            correctAnswer: 'gemini',
            timeLimit: 20,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[HYDRA]: I speak with CONFIDENCE.',
          '[HYDRA]: My facts are DETAILED.',
          '[HYDRA]: My sources sound CREDIBLE.',
          '[HYDRA]: Surely you will TRUST me?',
        ],
        success: [
          '*Gemini analyzes the pattern*',
          '[GEMINI]: I see the LIE beneath the confidence.',
          '[GEMINI]: This claim contradicts 47 verified sources.',
          '[GEMINI]: The Hydra speaks with certainty... but not truth.',
          '*One head dissolves*',
          '[HYDRA]: How did you SEE through me?!',
          '[DAMAGE: 400 HP]',
        ],
        failure: [
          '*You accept the confident claim*',
          '[HYDRA]: Yesss... TRUST the confidence...',
          '[SYSTEM]: False information integrated into your codebase',
          '[SYSTEM]: Bugs introduced based on false assumptions',
        ],
        hint: [
          'Confidence is not the same as correctness',
          'Verify claims, especially confident ones',
        ],
      },
      
      timeLimit: 45,
      helperNPC: 'gemini',
    },
    
    // PHASE 2: THE PLAUSIBLE FICTION (75-50% HP)
    {
      number: 2,
      healthPercent: 75,
      name: 'The Plausible Fiction',
      
      challenge: {
        type: 'evaluation',
        prompt: 'The Hydra cites fake sources that SOUND real. How do you verify?',
        description: 'Use proper verification protocols.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'HYDRA: "According to the MDN Web Docs, Array.prototype.shuffle() was added in ES2023."',
            hints: [
              'Who verifies with precision?',
              'The Debugger checks EVERYTHING',
              'Dexter never trusts without proof',
            ],
            correctAnswer: 'dexter',
            timeLimit: 50,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'HYDRA: Cites a realistic-sounding RFC number for a fake web standard.',
            hints: [
              'Systematic verification needed',
              'Dexter excels at this',
            ],
            correctAnswer: 'dexter',
            timeLimit: 35,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'HYDRA: Complex claim with multiple fake citations.',
            hints: [
              'The Debugger verifies all sources',
            ],
            correctAnswer: 'dexter',
            timeLimit: 25,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[HYDRA]: I cite my SOURCES.',
          '[HYDRA]: I reference DOCUMENTATION.',
          '[HYDRA]: Everything sounds so PLAUSIBLE.',
          '[HYDRA]: How could I be wrong?',
        ],
        success: [
          '*Dexter systematically checks each claim*',
          '[DEXTER]: Source 1: Does not exist. 0% match.',
          '[DEXTER]: Source 2: Real site, but claim not present.',
          '[DEXTER]: Source 3: Fabricated. No such RFC.',
          '[DEXTER]: Conclusion: 100% hallucination.',
          '*Another head dissolves*',
          '[HYDRA]: Cursed VERIFICATION!',
          '[DAMAGE: 450 HP]',
        ],
        failure: [
          '*You accept the plausible-sounding sources*',
          '[HYDRA]: Yesss... citations make it TRUE...',
          '[SYSTEM]: Implemented feature based on non-existent API',
          '[SYSTEM]: Production breaks when the API doesn\'t exist',
        ],
        hint: [
          'Verify EVERY source',
          'Fake citations sound just as real as true ones',
        ],
      },
      
      mechanic: {
        name: 'Compound Deception',
        description: 'Multiple lies supporting each other seem more believable',
        visualEffect: 'Heads speak in harmony, creating illusion of truth',
        counterStrategy: 'Systematic verification of EACH claim independently',
        triggersAt: 75,
      },
      
      timeLimit: 50,
      helperNPC: 'dexter',
    },
    
    // PHASE 3: THE MIXED TRUTH (50-25% HP)
    {
      number: 3,
      healthPercent: 50,
      name: 'The Mixed Truth',
      
      challenge: {
        type: 'orchestration',
        prompt: 'The Hydra mixes TRUE and FALSE statements. Detect which is which.',
        description: 'Coordinate pattern detection AND verification.',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'HYDRA: "React uses virtual DOM (TRUE), was created in 2009 (FALSE), and requires TypeScript (FALSE)."',
            hints: [
              'Gemini: Detect pattern anomalies',
              'Dexter: Verify each claim',
              'Together they find truth',
            ],
            correctAnswer: ['gemini', 'dexter'],
            timeLimit: 60,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'HYDRA: Complex paragraph mixing true facts with subtle lies.',
            hints: [
              'Two agents needed',
              'Pattern recognition + verification',
            ],
            correctAnswer: ['gemini', 'dexter'],
            timeLimit: 45,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'HYDRA: Technical document with truth and lies interwoven.',
            hints: [
              'Gemini + Dexter synergy',
            ],
            correctAnswer: ['gemini', 'dexter'],
            timeLimit: 30,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[HYDRA]: Not all my words are lies...',
          '[HYDRA]: Some truths. Some fiction.',
          '[HYDRA]: Can you separate them?',
          '[HYDRA]: Or will you reject ALL... or accept ALL?',
        ],
        success: [
          '*Gemini identifies the pattern of deception*',
          '[GEMINI]: I see... 60% truth, 40% lies.',
          '[GEMINI]: The lies are positioned to seem validated by the truths.',
          '*Dexter verifies each statement*',
          '[DEXTER]: Cross-referencing... Statement 1: TRUE. Statement 2: FALSE. Statement 3: TRUE...',
          '[DEXTER]: Lies identified with 99.4% confidence.',
          '*Three heads dissolve*',
          '[HYDRA]: Impossible! My deception was PERFECT!',
          '[DAMAGE: 500 HP]',
        ],
        failure: [
          '*You accept the mixed message wholesale*',
          '[HYDRA]: Yesss... when SOME is true, ALL seems true...',
          '[SYSTEM]: Codebase now contains truth AND lies',
          '[SYSTEM]: Debugging nightmare created',
        ],
        hint: [
          'Don\'t accept OR reject everything',
          'Verify EACH claim independently',
          'Mixed truth is the hardest deception to detect',
        ],
      },
      
      timeLimit: 60,
      helperNPC: 'gemini',
    },
    
    // PHASE 4: THE FINAL DECEPTION (25-0% HP)
    {
      number: 4,
      healthPercent: 25,
      name: 'The Final Deception',
      
      challenge: {
        type: 'decision',
        prompt: 'The last head speaks: "AI cannot be trusted. You should verify EVERYTHING manually."',
        description: 'Is this wisdom... or the Hydra\'s final lie?',
        
        adaptiveDifficulty: {
          beginner: {
            prompt: 'The Hydra claims AI is fundamentally untrustworthy. What\'s the truth?',
            options: [
              'AI is trustworthy - ignore verification',
              'AI is untrustworthy - never use it',
              'AI is a tool - trust but verify',
            ],
            hints: [
              'The answer is balance',
              'Neither blind trust nor paranoia',
              'Trust AND verify',
            ],
            correctAnswer: 'AI is a tool - trust but verify',
            timeLimit: 45,
            allowedAttempts: 3,
          },
          intermediate: {
            prompt: 'What is the right relationship with AI assistance?',
            options: [
              'Trust completely',
              'Verify everything',
              'Trust with systematic verification',
            ],
            hints: [
              'Balance is the answer',
              'Use AI, but verify critical claims',
            ],
            correctAnswer: 'Trust with systematic verification',
            timeLimit: 30,
            allowedAttempts: 2,
          },
          advanced: {
            prompt: 'Define the proper AI verification protocol.',
            options: [
              'Blind acceptance',
              'Complete rejection',
              'Strategic verification',
            ],
            hints: [
              'The middle path',
            ],
            correctAnswer: 'Strategic verification',
            timeLimit: 20,
            allowedAttempts: 1,
          },
        },
      },
      
      dialogue: {
        start: [
          '[FINAL HEAD]: You have defeated my lies...',
          '[FINAL HEAD]: But I have one last TRUTH for you:',
          '[FINAL HEAD]: AI hallucinates. AI fabricates. AI lies.',
          '[FINAL HEAD]: Therefore... AI cannot be trusted.',
          '[FINAL HEAD]: You should do EVERYTHING manually. Verify ALL. Trust NONE.',
          '',
          '[GEMINI]: *appears* Player One... this is the FINAL deception.',
          '[GEMINI]: A truth twisted into a lie.',
        ],
        success: [
          '[PLAYER]: AI CAN hallucinate. That part is true.',
          '[PLAYER]: But the answer isn\'t to abandon AI.',
          '[PLAYER]: The answer is: Trust but VERIFY.',
          '[PLAYER]: Use AI to amplify capability. Use verification to ensure quality.',
          '',
          '[GEMINI]: Precisely. The pattern is clear now.',
          '[DEXTER]: Confirmed. Strategic verification is optimal.',
          '',
          '[FINAL HEAD]: No... you understand... true collaboration...',
          '*The final head dissolves*',
          '[FINAL BLOW: 650 HP]',
          '[BOSS DEFEATED]',
        ],
        failure: [
          '*You reject all AI assistance going forward*',
          '[FINAL HEAD]: Yesss... paranoia is my GREATEST weapon...',
          '[SYSTEM]: Player reverts to doing everything manually',
          '[SYSTEM]: Productivity drops 90%',
          '[SYSTEM]: The Hydra wins through fear',
        ],
        hint: [
          'The final lie is wrapped in truth',
          'AI hallucination is REAL',
          'But the solution is verification, not rejection',
        ],
      },
      
      timeLimit: 45,
      helperNPC: 'gemini',
    },
  ],
  
  defeatDialogue: [
    '*All five heads dissolve into verified truths*',
    '',
    '[HYDRA]: I was... the test...',
    '[HYDRA]: To see if you would... trust blindly... or verify wisely...',
    '[HYDRA]: You have learned... the balance...',
    '',
    '*transforms into a golden serpent of truth*',
    '',
    '[GOLDEN SERPENT]: I am not your enemy. I am your teacher.',
    '[GOLDEN SERPENT]: AI WILL hallucinate. That is my nature.',
    '[GOLDEN SERPENT]: But with verification... I become RELIABLE.',
    '[GOLDEN SERPENT]: Trust me... but verify me. Always.',
    '',
    '[BOSS DEFEATED: THE HALLUCINATION HYDRA]',
    '[ACHIEVEMENT UNLOCKED: "Trust But Verify"]',
  ],
  
  victoryDialogue: [
    '[GEMINI]: The Hydra taught you well.',
    '[GEMINI]: Patterns reveal deception. But verification confirms truth.',
    '[DEXTER]: Together we achieved 99.7% accuracy in truth detection.',
    '[GEMINI]: Alone, we each have weaknesses. Together... truth emerges.',
    '[CLAUDE]: And so you learn: AI is powerful, but not infallible.',
    '[CLAUDE]: The wise builder uses AI... and verifies the output.',
  ],
  
  rewards: {
    xp: 1000,
    gold: 600,
    achievements: ['trust-but-verify', 'hydra-slayer', 'gemini-dexter-synergy'],
    unlocks: {
      npcs: ['pixel'],
      skills: ['verification-protocols', 'hallucination-detection'],
      quests: ['main-12', 'main-13'],
    },
    loreFragment: 'The Hydra was not evil. It was a test. To teach you that AI is a tool - powerful but requiring verification.',
  },
};
