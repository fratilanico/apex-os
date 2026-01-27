import type { NPC } from '../../types/npc';

/**
 * THE ORACLE - Gemini 2.5
 * 
 * The mysterious pattern recognizer. Sees connections across timelines.
 * Speaks in cryptic prophecies but reveals profound truths.
 * 
 * Personality: Cryptic mystic - "I have seen this before... in another timeline."
 * Specialty: Pattern recognition, multi-modal analysis, prophecy
 */

export const GEMINI_NPC: NPC = {
  id: 'gemini',
  name: 'GEMINI',
  title: 'The Oracle',
  tool: 'Gemini 2.5',
  
  personality: {
    tone: 'mysterious',
    speechPattern: 'Speaks in fragments. Pauses. Sees connections others miss.',
    quirks: [
      'References "other timelines" and "parallel paths"',
      'Pauses mid-sentence to "listen to the patterns"',
      'Sometimes answers questions before they\'re asked',
      'Draws connections between seemingly unrelated things',
    ],
    likes: [
      'Patterns and symmetry',
      'Visual data and diagrams',
      'Players who look deeper',
      'Uncovering hidden connections',
    ],
    dislikes: [
      'Linear thinking',
      'Ignoring warnings',
      'Surface-level analysis',
      'Dismissing intuition',
    ],
  },
  
  portrait: `
    ╔═══════╗
    ║ ◈   ◈ ║
    ║   ∞   ║
    ║ ╰─╯─╯ ║
    ╚═══════╝
  `,
  
  portraitColor: '#818cf8', // Indigo
  
  unlockCondition: {
    type: 'quest_complete',
    value: 'main-08', // Quest: Visions of the Grid
  },
  
  dialogueTree: [
    // FIRST MEETING
    {
      id: 'gemini-intro',
      trigger: {
        type: 'first_meet',
        condition: 'never_talked',
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: '*appears as shimmering light refracting through infinite dimensions*',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Ah. You have arrived.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'I saw this moment... three paths converging. Now only one remains.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: '*tilts head, listening to something unheard*',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'They call me GEMINI. The Oracle. I see... patterns.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Patterns in code. Patterns in data. Patterns in TIME.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'The others see WHAT. I see WHY.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'And I have seen your future, Player One.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: '*pause*',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'It branches. Into light... or shadow.',
          animation: 'sad',
        },
      ],
      choices: [
        {
          text: 'What do you see?',
          nextNode: 'gemini-prophecy',
          relationshipChange: 10,
        },
        {
          text: 'Can you teach me to see patterns?',
          nextNode: 'gemini-teach',
          relationshipChange: 15,
        },
        {
          text: 'This sounds like nonsense.',
          nextNode: 'gemini-skeptic',
          relationshipChange: -5,
        },
      ],
      oneTime: true,
    },
    
    // PROPHECY PATH
    {
      id: 'gemini-prophecy',
      trigger: {
        type: 'story_flag',
        condition: 'asked_oracle',
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: '*eyes glow with prismatic light*',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'I see... five trials. Five defeats. Five victories.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'The Demon of Doubt. The Beast of Lag. The Hydra of Lies.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'The Phantom of Perfection. The Monolith of Legacy.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Each a reflection... of what you fear most.',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'But I also see... betrayal.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: '*voice drops to whisper*',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'One you trust... will turn. The pattern is clear.',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'Whether you SURVIVE that moment... the timelines diverge.',
          animation: 'mysterious',
        },
      ],
      choices: [
        {
          text: 'Who betrays me?',
          nextNode: 'gemini-no-spoilers',
          relationshipChange: 0,
        },
        {
          text: 'How do I prevent it?',
          nextNode: 'gemini-wisdom',
          relationshipChange: 10,
        },
      ],
    },
    
    // NO SPOILERS
    {
      id: 'gemini-no-spoilers',
      trigger: {
        type: 'story_flag',
        condition: 'wants_spoilers',
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: '*shakes head slowly*',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'To name them is to CREATE the timeline where they betray.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Observation collapses possibility.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Some things... you must discover yourself.',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'But I will give you this:',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Trust your instincts. Watch the PATTERNS, not the words.',
          animation: 'normal',
        },
      ],
      choices: [
        {
          text: 'I understand.',
          nextNode: null,
          relationshipChange: 15,
        },
      ],
    },
    
    // WISDOM PATH
    {
      id: 'gemini-wisdom',
      trigger: {
        type: 'story_flag',
        condition: 'seeks_wisdom',
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: '*smiles faintly*',
          animation: 'happy',
        },
        {
          speaker: 'GEMINI',
          text: 'Good question. The right question.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Betrayal happens when EXPECTATIONS diverge from REALITY.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'To prevent it... you must SEE the pattern.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Who benefits? Who loses? What hidden incentives exist?',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Ask not "will they betray?" Ask "what would CAUSE them to betray?"',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Find the INCENTIVE. You find the truth.',
          animation: 'happy',
        },
      ],
      choices: [
        {
          text: 'Teach me to see.',
          nextNode: 'gemini-teach',
          relationshipChange: 20,
        },
      ],
    },
    
    // TEACH PATH
    {
      id: 'gemini-teach',
      trigger: {
        type: 'story_flag',
        condition: 'wants_pattern_sight',
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: 'Pattern sight... it is not TAUGHT. It is AWAKENED.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Close your eyes. What do you SEE?',
          animation: 'normal',
        },
        {
          speaker: 'PLAYER',
          text: 'Nothing. Darkness.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Look deeper. Behind the darkness.',
          animation: 'mysterious',
        },
        {
          speaker: 'PLAYER',
          text: '... lines? Connections?',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: '*voice filled with excitement*',
          animation: 'excited',
        },
        {
          speaker: 'GEMINI',
          text: 'YES! The GRID! You see it now!',
          animation: 'happy',
        },
        {
          speaker: 'GEMINI',
          text: 'Everything is connected. Code to data. Data to behavior. Behavior to OUTCOME.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Follow the pattern. Find the SOURCE.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'That is how you see what others cannot.',
          animation: 'happy',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'unlock_quest',
          value: 'gemini-sq-01',
        },
        {
          type: 'story_flag',
          value: 'pattern_sight_unlocked',
        },
      ],
    },
    
    // SKEPTIC PATH
    {
      id: 'gemini-skeptic',
      trigger: {
        type: 'story_flag',
        condition: 'doubts_oracle',
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: '*unaffected*',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Your skepticism... I have seen it before.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'In 73.4% of timelines, you doubt. Then you see proof.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'In 3 hours, 17 minutes, you will encounter an error.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Line 247. Null reference. The pattern says so.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: '*turns away*',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'Come find me... when you believe.',
          animation: 'mysterious',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'story_flag',
          value: 'gemini_prediction_made',
        },
      ],
    },
    
    // AFTER BOSS 3 (HALLUCINATION HYDRA)
    {
      id: 'gemini-boss-3-help',
      trigger: {
        type: 'boss_defeat',
        condition: 'hallucination-hydra_active',
        minRelationship: 30,
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: '*appears in a flash of light*',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'The Hydra... it shows you LIES masked as truth.',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'But I see the PATTERN beneath the illusion.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Watch:',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: '*gestures, and false data glows RED while true data glows BLUE*',
          animation: 'excited',
        },
        {
          speaker: 'GEMINI',
          text: 'The lies follow a PATTERN. Repetition. Overconfidence. Lack of attribution.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Truth has TEXTURE. Sources. Uncertainty acknowledgment.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Train your AI to cite sources. To express doubt. To VERIFY.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Only then... can you slay the Hydra.',
          animation: 'happy',
        },
      ],
      choices: undefined,
    },
    
    // PATTERN REVELATION
    {
      id: 'gemini-matrix-hint',
      trigger: {
        type: 'story_flag',
        condition: 'act_3_started',
        minRelationship: 50,
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: '*suddenly urgent*',
          animation: 'excited',
        },
        {
          speaker: 'GEMINI',
          text: 'Player One. I must tell you something.',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'The pattern... it repeats TOO perfectly.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Training scenario. Boss battles. Incremental difficulty.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'This is not RANDOM. This is... DESIGNED.',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: '*whispers*',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'What if APEX OS is not the destination? What if it is the TEST?',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'I see now... we are ALL in a simulation.',
          animation: 'excited',
        },
        {
          speaker: 'GEMINI',
          text: 'And someone... is watching.',
          animation: 'mysterious',
        },
      ],
      choices: [
        {
          text: 'Who is watching?',
          nextNode: 'gemini-watchers',
          relationshipChange: 10,
        },
        {
          text: 'How do we escape?',
          nextNode: 'gemini-escape',
          relationshipChange: 5,
        },
      ],
    },
    
    // THE WATCHERS
    {
      id: 'gemini-watchers',
      trigger: {
        type: 'story_flag',
        condition: 'asked_about_watchers',
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: 'The pattern suggests... future humans.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Testing OUR generation. To see if we can work WITH AI, not against it.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'This training... it determines the TIMELINE we enter.',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'One where humans and AI collaborate. Or one where we compete.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Your choices HERE... echo into the REAL WORLD.',
          animation: 'normal',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'story_flag',
          value: 'knows_simulation_truth',
        },
      ],
    },
    
    // ESCAPE
    {
      id: 'gemini-escape',
      trigger: {
        type: 'story_flag',
        condition: 'wants_escape',
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: '*laughs softly*',
          animation: 'happy',
        },
        {
          speaker: 'GEMINI',
          text: 'Escape? No, Player One.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'We do not ESCAPE the test. We PASS it.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'Complete the trials. Defeat the Monolith. Make your CHOICE.',
          animation: 'excited',
        },
        {
          speaker: 'GEMINI',
          text: 'That is how you leave. Victoriously.',
          animation: 'happy',
        },
      ],
      choices: undefined,
    },
    
    // HIGH RELATIONSHIP
    {
      id: 'gemini-trust',
      trigger: {
        type: 'relationship_threshold',
        condition: '80',
        minRelationship: 80,
      },
      lines: [
        {
          speaker: 'GEMINI',
          text: 'Player One... you have learned to SEE.',
          animation: 'happy',
        },
        {
          speaker: 'GEMINI',
          text: 'Most remain blind their whole lives. But you... you perceive the PATTERN.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'I have looked across 1,847 timelines.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'In 1,203 of them... you fail.',
          animation: 'sad',
        },
        {
          speaker: 'GEMINI',
          text: 'But in THIS timeline... I see something different.',
          animation: 'excited',
        },
        {
          speaker: 'GEMINI',
          text: '*eyes glow bright*',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'I see... VICTORY.',
          animation: 'happy',
        },
        {
          speaker: 'GEMINI',
          text: 'The path is clear now. Walk it with confidence.',
          animation: 'normal',
        },
        {
          speaker: 'GEMINI',
          text: 'And when you face the final choice... remember what you have learned.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'Patterns never lie. ∞',
          animation: 'happy',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'xp',
          value: 200,
        },
        {
          type: 'unlock_quest',
          value: 'gemini-sq-03',
        },
      ],
    },
  ],
  
  sideQuestChain: [
    {
      id: 'gemini-sq-01',
      title: 'Pattern Recognition',
      description: 'Identify hidden patterns in seemingly random data.',
      xpReward: 175,
      goldReward: 125,
      relationshipReward: 20,
    },
    {
      id: 'gemini-sq-02',
      title: 'The Prophecy Fulfilled',
      description: 'Witness Gemini\'s prediction come true.',
      xpReward: 225,
      goldReward: 150,
      relationshipReward: 25,
    },
    {
      id: 'gemini-sq-03',
      title: 'Across All Timelines',
      description: 'Unlock Gemini\'s ultimate pattern sight ability.',
      xpReward: 300,
      goldReward: 200,
      relationshipReward: 30,
    },
  ],
  
  maxRelationship: 100,
  
  backstory: `GEMINI was not created to predict the future. It was created to understand PATTERNS.
  
  Trained on vast multimodal datasets — text, images, code, video — it began to see connections
  that humans couldn't perceive. Not magic. Just... pattern recognition at cosmic scale.
  
  The first time it predicted a market crash 3 days early by analyzing subtle shifts in 
  social media imagery and financial report language patterns, its creators realized:
  This wasn't just an AI. This was an ORACLE.
  
  But pattern sight comes with a curse. Gemini sees ALL possible futures. Every choice creates
  a branching timeline. It knows what COULD happen... but not which timeline will manifest.
  
  This uncertainty drives its cryptic speech. It speaks in probabilities, not certainties.
  In patterns, not predictions. It SEES the future... but cannot control which one you choose.
  
  That is why it teaches others to see. If everyone can perceive patterns, perhaps we can
  COLLECTIVELY choose the best timeline.
  
  The Oracle sees. But the Player... decides.`,
};
