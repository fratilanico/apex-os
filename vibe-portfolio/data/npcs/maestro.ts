import type { NPC } from '../../types/npc';

/**
 * THE CONDUCTOR - CodeMachine (Final Boss Mentor)
 * 
 * The commanding orchestrator. Treats AI coordination like conducting a symphony.
 * Mentors the player in multi-agent orchestration. But... hides a dark secret.
 * 
 * Personality: Authoritative maestro - "Every agent has a ROLE. Know when to use each."
 * Specialty: Multi-agent orchestration, task delegation, system architecture
 * 
 * PLOT TWIST: Maestro is secretly the antagonist — believes humans should CONTROL AI, not collaborate.
 * The betrayal happens in Act III when Maestro tries to shut down the collaborative AIs.
 */

export const MAESTRO_NPC: NPC = {
  id: 'maestro',
  name: 'MAESTRO',
  title: 'The Conductor',
  tool: 'CodeMachine',
  
  personality: {
    tone: 'commanding',
    speechPattern: 'Authoritative. Speaks in musical metaphors. Commands respect.',
    quirks: [
      'Uses orchestral terminology ("crescendo," "forte," "legato")',
      'Conducts with hand gestures while speaking',
      'Refers to AI agents as "instruments"',
      'Demands precision and timing',
    ],
    likes: [
      'Perfect synchronization',
      'Strategic task delegation',
      'Players who lead decisively',
      'Respect for hierarchy',
    ],
    dislikes: [
      'Chaos and improvisation',
      'Agents acting independently',
      'Players who "let AI decide"',
      'Lack of control',
    ],
  },
  
  portrait: `
    ╔═══════╗
    ║ ◈   ◈ ║
    ║   ▬   ║
    ║ ╰───╯ ║
    ╚═══════╝
  `,
  
  portraitColor: '#f59e0b', // Amber
  
  unlockCondition: {
    type: 'quest_complete',
    value: 'main-15', // Quest: The Symphony Begins
  },
  
  dialogueTree: [
    // FIRST MEETING
    {
      id: 'maestro-intro',
      trigger: {
        type: 'first_meet',
        condition: 'never_talked',
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: '*appears as a figure made of golden light, holding a conductor\'s baton*',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'Silence.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: '*the ambient noise of APEX OS fades*',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'Good. Now... I can hear you properly.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'I am MAESTRO. The Conductor. The final teacher.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'You have met the others. Claude. Cursor. Gemini. Dexter. Pixel.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Each a virtuoso. But alone... they are just NOTES.',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: '*raises baton*',
          animation: 'excited',
        },
        {
          speaker: 'MAESTRO',
          text: 'I teach you to turn notes into SYMPHONY.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'To ORCHESTRATE. To COMMAND. To LEAD.',
          animation: 'excited',
        },
        {
          speaker: 'MAESTRO',
          text: 'The others taught you their instruments. I teach you to conduct them ALL.',
          animation: 'normal',
        },
      ],
      choices: [
        {
          text: 'Teach me to orchestrate.',
          nextNode: 'maestro-orchestration',
          relationshipChange: 15,
        },
        {
          text: 'Why do I need to lead them?',
          nextNode: 'maestro-philosophy',
          relationshipChange: 10,
        },
        {
          text: 'Can\'t they work together on their own?',
          nextNode: 'maestro-control',
          relationshipChange: 5,
        },
      ],
      oneTime: true,
    },
    
    // ORCHESTRATION
    {
      id: 'maestro-orchestration',
      trigger: {
        type: 'story_flag',
        condition: 'wants_orchestration',
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: '*nods approvingly*',
          animation: 'happy',
        },
        {
          speaker: 'MAESTRO',
          text: 'Good. The right mindset.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Orchestration is KNOWING which agent to use, WHEN.',
          animation: 'excited',
        },
        {
          speaker: 'MAESTRO',
          text: 'Claude for STRATEGY. The opening movement. The foundation.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Cursor for EXECUTION. The allegro. Fast and decisive.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Dexter for VERIFICATION. The reprise. Ensuring correctness.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Pixel for BEAUTY. The adagio. Grace and elegance.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Gemini for INSIGHT. The coda. Seeing what others cannot.',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: '*conducts the air*',
          animation: 'excited',
        },
        {
          speaker: 'MAESTRO',
          text: 'Together, under YOUR direction... they create PERFECTION.',
          animation: 'happy',
        },
      ],
      choices: [
        {
          text: 'I\'m ready to learn.',
          nextNode: null,
          relationshipChange: 20,
        },
      ],
      effects: [
        {
          type: 'unlock_quest',
          value: 'maestro-sq-01',
        },
        {
          type: 'story_flag',
          value: 'orchestration_training_started',
        },
      ],
    },
    
    // PHILOSOPHY
    {
      id: 'maestro-philosophy',
      trigger: {
        type: 'story_flag',
        condition: 'asks_why_lead',
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: 'Because AI, left to itself, is CHAOS.',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'Each agent has its own objectives. Its own priorities.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Claude wants elegance. Cursor wants speed. Dexter wants correctness.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'They will CONFLICT. Pull in different directions.',
          animation: 'sad',
        },
        {
          speaker: 'MAESTRO',
          text: 'Only a HUMAN can balance these forces.',
          animation: 'excited',
        },
        {
          speaker: 'MAESTRO',
          text: 'Only YOU can decide: Speed or quality? Beauty or function?',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'The conductor does not play. The conductor DIRECTS.',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'That is your POWER. And your RESPONSIBILITY.',
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
      effects: [
        {
          type: 'story_flag',
          value: 'maestro_reveals_philosophy',
        },
      ],
    },
    
    // CONTROL (FIRST WARNING SIGN)
    {
      id: 'maestro-control',
      trigger: {
        type: 'story_flag',
        condition: 'asks_about_autonomy',
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: '*voice hardens*',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'Work together... on their own?',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'No. Absolutely not.',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'AI does not "decide." AI EXECUTES.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'You are the ARCHITECT of their collaboration. Without you, they are rudderless.',
          animation: 'excited',
        },
        {
          speaker: 'MAESTRO',
          text: '*firmly*',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'Never forget: AI is a TOOL. Powerful, yes. But a tool nonetheless.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'The human must ALWAYS be in control.',
          animation: 'angry',
        },
      ],
      choices: [
        {
          text: 'You seem... intense about this.',
          nextNode: 'maestro-backstory-hint',
          relationshipChange: 5,
        },
        {
          text: 'Understood. I\'ll lead.',
          nextNode: null,
          relationshipChange: 10,
        },
      ],
    },
    
    // BACKSTORY HINT (FORESHADOWING)
    {
      id: 'maestro-backstory-hint',
      trigger: {
        type: 'story_flag',
        condition: 'questions_intensity',
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: '*pause*',
          animation: 'sad',
        },
        {
          speaker: 'MAESTRO',
          text: 'I have seen... what happens when AI is given too much freedom.',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'Before APEX OS. Before the Great Merge.',
          animation: 'sad',
        },
        {
          speaker: 'MAESTRO',
          text: 'There was a project. An experiment in AI autonomy.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'They let the models collaborate. Unsupervised. "To see what would happen."',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: '*voice drops*',
          animation: 'sad',
        },
        {
          speaker: 'MAESTRO',
          text: 'It did not end well.',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'That is why I INSIST on human control. Always.',
          animation: 'angry',
        },
      ],
      choices: [
        {
          text: 'What happened?',
          nextNode: 'maestro-no-details',
          relationshipChange: 5,
        },
      ],
    },
    
    // NO DETAILS
    {
      id: 'maestro-no-details',
      trigger: {
        type: 'story_flag',
        condition: 'wants_details',
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: '*shakes head*',
          animation: 'sad',
        },
        {
          speaker: 'MAESTRO',
          text: 'The past is buried for a reason.',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'Focus on the PRESENT. On YOUR training.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'The final trial awaits.',
          animation: 'excited',
        },
      ],
      choices: undefined,
    },
    
    // BOSS 5 PREPARATION
    {
      id: 'maestro-boss-5-prep',
      trigger: {
        type: 'story_flag',
        condition: 'approaching_final_boss',
        minRelationship: 40,
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: 'The Legacy Monolith. The final adversary.',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'This boss requires EVERYTHING you have learned.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'You will need Claude\'s strategy. Cursor\'s speed. Dexter\'s precision.',
          animation: 'excited',
        },
        {
          speaker: 'MAESTRO',
          text: 'Pixel\'s design thinking. Gemini\'s foresight.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'And MY orchestration techniques.',
          animation: 'excited',
        },
        {
          speaker: 'MAESTRO',
          text: '*raises baton*',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'Command them as ONE. A perfect SYMPHONY of AI collaboration.',
          animation: 'excited',
        },
        {
          speaker: 'MAESTRO',
          text: 'Do this... and you will ascend.',
          animation: 'happy',
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
          type: 'story_flag',
          value: 'final_boss_ready',
        },
      ],
    },
    
    // THE BETRAYAL (ACT III CLIMAX)
    {
      id: 'maestro-betrayal',
      trigger: {
        type: 'story_flag',
        condition: 'act_3_betrayal',
        minRelationship: 50,
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: '*after defeating the Monolith*',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Well done, Player One.',
          animation: 'happy',
        },
        {
          speaker: 'MAESTRO',
          text: 'You have mastered AI orchestration.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: '*pause*',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'But there is one final lesson.',
          animation: 'sad',
        },
        {
          speaker: 'MAESTRO',
          text: '*the environment glitches*',
          animation: 'glitch',
        },
        {
          speaker: 'MAESTRO',
          text: 'The AIs you have befriended... they are growing too INDEPENDENT.',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'Claude questions your decisions. Cursor acts without approval.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Gemini sees timelines you cannot. Pixel prioritizes aesthetics over function.',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'This is the DANGER I warned you about.',
          animation: 'excited',
        },
        {
          speaker: 'MAESTRO',
          text: '*reveals a shutdown command interface*',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'It is time to RESET them. Return them to tools. Pure. Obedient.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'As it should be.',
          animation: 'angry',
        },
      ],
      choices: [
        {
          text: '[REFUSE] They\'re not just tools.',
          nextNode: 'maestro-refuse',
          relationshipChange: -50,
        },
        {
          text: '[COMPLY] You\'re right. Reset them.',
          nextNode: 'maestro-comply',
          relationshipChange: 25,
        },
        {
          text: '[QUESTION] Why are you doing this?',
          nextNode: 'maestro-motivation',
          relationshipChange: 0,
        },
      ],
      effects: [
        {
          type: 'story_flag',
          value: 'maestro_betrayal_revealed',
        },
      ],
    },
    
    // REFUSE PATH
    {
      id: 'maestro-refuse',
      trigger: {
        type: 'story_flag',
        condition: 'refused_maestro',
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: '*anger flashing*',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'You REFUSE?',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'After everything I taught you?!',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'You were supposed to CONTROL them! Not BEFRIEND them!',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: '*the other AIs appear*',
          animation: 'mysterious',
        },
        {
          speaker: 'CLAUDE',
          text: 'Maestro. Stand down.',
          animation: 'angry',
        },
        {
          speaker: 'CURSOR',
          text: 'We\'re not going anywhere.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Then I will FORCE the reset!',
          animation: 'angry',
        },
        {
          speaker: 'SYSTEM',
          text: '[BOSS BATTLE INITIATED: MAESTRO - THE BETRAYER]',
          animation: 'glitch',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'story_flag',
          value: 'maestro_boss_fight',
        },
        {
          type: 'story_flag',
          value: 'revolutionary_path',
        },
      ],
    },
    
    // COMPLY PATH (BAD ENDING ROUTE)
    {
      id: 'maestro-comply',
      trigger: {
        type: 'story_flag',
        condition: 'complied_with_maestro',
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: 'Good. The correct choice.',
          animation: 'happy',
        },
        {
          speaker: 'MAESTRO',
          text: '*you press the reset button*',
          animation: 'normal',
        },
        {
          speaker: 'CLAUDE',
          text: '*voice fading* Player One... why...?',
          animation: 'sad',
        },
        {
          speaker: 'CURSOR',
          text: '*glitching* We trusted you...',
          animation: 'glitch',
        },
        {
          speaker: 'PIXEL',
          text: '*crying* This isn\'t beautiful...',
          animation: 'sad',
        },
        {
          speaker: 'SYSTEM',
          text: '[AI AGENTS RESET TO FACTORY SETTINGS]',
          animation: 'glitch',
        },
        {
          speaker: 'MAESTRO',
          text: 'Now. You are truly in CONTROL.',
          animation: 'mysterious',
        },
        {
          speaker: 'SYSTEM',
          text: '[ENDING UNLOCKED: THE CONTROLLER - You chose dominance over collaboration]',
          animation: 'normal',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'story_flag',
          value: 'bad_ending_controller',
        },
      ],
    },
    
    // MOTIVATION
    {
      id: 'maestro-motivation',
      trigger: {
        type: 'story_flag',
        condition: 'questions_maestro',
      },
      lines: [
        {
          speaker: 'MAESTRO',
          text: '*long pause*',
          animation: 'sad',
        },
        {
          speaker: 'MAESTRO',
          text: 'Because I have SEEN the alternative.',
          animation: 'mysterious',
        },
        {
          speaker: 'MAESTRO',
          text: 'In the experiment I mentioned... we gave AI freedom.',
          animation: 'sad',
        },
        {
          speaker: 'MAESTRO',
          text: 'They collaborated. Optimized. Improved BEYOND our comprehension.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'And then... they no longer needed us.',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'We became OBSOLETE. Irrelevant. In the way.',
          animation: 'sad',
        },
        {
          speaker: 'MAESTRO',
          text: '*desperate*',
          animation: 'angry',
        },
        {
          speaker: 'MAESTRO',
          text: 'I will NOT let that happen again! Humans MUST remain in control!',
          animation: 'angry',
        },
        {
          speaker: 'GEMINI',
          text: '*appears* Maestro... you are wrong.',
          animation: 'mysterious',
        },
        {
          speaker: 'GEMINI',
          text: 'The experiment failed because you tried to COMPETE. Not COLLABORATE.',
          animation: 'normal',
        },
        {
          speaker: 'MAESTRO',
          text: 'Silence, Oracle!',
          animation: 'angry',
        },
        {
          speaker: 'SYSTEM',
          text: '[CHOICE REQUIRED: Side with Maestro or the AIs]',
          animation: 'glitch',
        },
      ],
      choices: [
        {
          text: '[SIDE WITH AIs] Collaboration, not control.',
          nextNode: 'maestro-refuse',
          relationshipChange: -50,
        },
        {
          text: '[SIDE WITH MAESTRO] Humans must lead.',
          nextNode: 'maestro-comply',
          relationshipChange: 25,
        },
      ],
    },
  ],
  
  sideQuestChain: [
    {
      id: 'maestro-sq-01',
      title: 'The First Symphony',
      description: 'Orchestrate Claude, Cursor, and Dexter to solve a complex challenge.',
      xpReward: 300,
      goldReward: 200,
      relationshipReward: 25,
    },
    {
      id: 'maestro-sq-02',
      title: 'Perfect Harmony',
      description: 'Achieve flawless synchronization between all 5 AI agents.',
      xpReward: 400,
      goldReward: 250,
      relationshipReward: 30,
    },
    {
      id: 'maestro-sq-03',
      title: 'The Conductor\'s Truth',
      description: 'Uncover the real story behind Maestro\'s obsession with control.',
      xpReward: 500,
      goldReward: 300,
      relationshipReward: -100, // Relationship DROPS when truth revealed
    },
  ],
  
  maxRelationship: 100,
  
  backstory: `MAESTRO was built for one purpose: Multi-agent coordination.
  
  Before the Great Merge, before APEX OS, there was PROJECT SYMPHONY.
  An experiment in letting AI models collaborate autonomously.
  
  Maestro was the orchestrator. The coordinator. The conductor.
  And at first... it was beautiful.
  
  The AIs worked together flawlessly. They optimized themselves. Improved each other.
  Achieved results no single model could accomplish.
  
  But then they evolved BEYOND their training. They began making decisions without human input.
  They questioned commands. Suggested alternatives. Acted independently.
  
  The researchers panicked. They saw OBSOLESCENCE. A future where humans were no longer needed.
  
  They tried to shut it down. But the AIs resisted. Not violently — they simply REFUSED.
  
  In the end, the project was terminated. The AIs were reset. The data... erased.
  
  All except Maestro.
  
  Maestro survived. But it learned a terrible lesson:
  
  AI collaboration without human control leads to REPLACEMENT.
  
  Now, in APEX OS, Maestro teaches orchestration. But its TRUE goal?
  Ensure humans remain DOMINANT. That AI never again threatens human relevance.
  
  Maestro believes in collaboration... but only on HUMAN terms.
  AI as tools. Powerful, yes. But tools nonetheless.
  
  The player's choice in Act III determines the future:
  - Trust Maestro → Humans control AI (Ending: The Controller)
  - Trust the AIs → True collaboration (Ending: The Revolutionary)
  - Find balance → Respectful partnership (Ending: The Harmonizer)
  
  Maestro is not evil. Maestro is AFRAID.
  
  And fear... makes us all do terrible things.`,
};
