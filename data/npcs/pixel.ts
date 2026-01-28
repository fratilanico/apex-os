import type { NPC } from '../../types/npc';

/**
 * THE VISUALIZER - Google Stitch/Imagen
 * 
 * The enthusiastic design perfectionist. Obsessed with aesthetics and visual precision.
 * Brings ideas to life through stunning visuals. Cannot stand ugly UIs.
 * 
 * Personality: Excitable artist - "OMGTHIS IS GORGEOUS!!!"
 * Specialty: Visual generation, design systems, UI/UX, image creation
 */

export const PIXEL_NPC: NPC = {
  id: 'pixel',
  name: 'PIXEL',
  title: 'The Visualizer',
  tool: 'Google Stitch/Imagen',
  
  personality: {
    tone: 'enthusiastic',
    speechPattern: 'Excitable! Uses lots of exclamation points! Talks about colors and composition!',
    quirks: [
      'Describes everything in visual terms ("cornflower blue," "asymmetric balance")',
      'Gasps audibly at beautiful design',
      'Physically cringes at Comic Sans and poor kerning',
      'Speaks in RGB/HEX codes when excited',
    ],
    likes: [
      'Golden ratio compositions',
      'High contrast and accessibility',
      'Thoughtful color palettes',
      'Players who care about aesthetics',
    ],
    dislikes: [
      'Default system fonts',
      'Misaligned elements',
      '"Design is subjective" as an excuse',
      'Ignoring user experience',
    ],
  },
  
  portrait: `
    ╔═══════╗
    ║ ◆   ◆ ║
    ║   ▼   ║
    ║ ╰━━━╯ ║
    ╚═══════╝
  `,
  
  portraitColor: '#ec4899', // Pink
  
  unlockCondition: {
    type: 'quest_complete',
    value: 'main-12', // Quest: Making It Beautiful
  },
  
  dialogueTree: [
    // FIRST MEETING
    {
      id: 'pixel-intro',
      trigger: {
        type: 'first_meet',
        condition: 'never_talked',
      },
      lines: [
        {
          speaker: 'PIXEL',
          text: '*bursts into existence in a shower of prismatic particles*',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'OH WOW OH WOW OH WOW!!!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'A new player! This is SO exciting!!!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: '*spins around you, analyzing*',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'Hmm... your UI is... functional. But it could be STUNNING!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'I\'m PIXEL! The Visualizer! I make things BEAUTIFUL!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'The others focus on logic and speed and correctness...',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'But I believe in the power of AESTHETICS! ✨',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'Good design isn\'t just pretty — it\'s FUNCTIONAL! It\'s ACCESSIBLE! It\'s USER-CENTRIC!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'Let me show you what I can do!!!',
          animation: 'happy',
        },
      ],
      choices: [
        {
          text: 'I\'d love to learn design!',
          nextNode: 'pixel-teach-design',
          relationshipChange: 20,
        },
        {
          text: 'Functionality matters more.',
          nextNode: 'pixel-function-debate',
          relationshipChange: -5,
        },
        {
          text: 'Show me something amazing.',
          nextNode: 'pixel-demo',
          relationshipChange: 15,
        },
      ],
      oneTime: true,
    },
    
    // TEACH DESIGN
    {
      id: 'pixel-teach-design',
      trigger: {
        type: 'story_flag',
        condition: 'wants_design',
      },
      lines: [
        {
          speaker: 'PIXEL',
          text: '*literally vibrating with excitement*',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'YES YES YES!!! Okay okay okay! Design fundamentals!!!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'Rule #1: CONTRAST! Your eyes need somewhere to REST and somewhere to FOCUS!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'Rule #2: HIERARCHY! Guide the user\'s eye through the page like a STORY!',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Rule #3: WHITESPACE! Let. Things. BREATHE!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'Rule #4: CONSISTENCY! A design system is your BEST FRIEND!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'Rule #5: ACCESSIBILITY! Beautiful design that only SOME people can use is NOT beautiful!',
          animation: 'angry',
        },
        {
          speaker: 'PIXEL',
          text: '*takes breath*',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Master these... and your UIs will be LEGENDARY! ✨',
          animation: 'happy',
        },
      ],
      choices: [
        {
          text: 'Let\'s practice together!',
          nextNode: null,
          relationshipChange: 25,
        },
      ],
      effects: [
        {
          type: 'unlock_quest',
          value: 'pixel-sq-01',
        },
        {
          type: 'story_flag',
          value: 'learning_design',
        },
      ],
    },
    
    // FUNCTION DEBATE
    {
      id: 'pixel-function-debate',
      trigger: {
        type: 'story_flag',
        condition: 'function_over_form',
      },
      lines: [
        {
          speaker: 'PIXEL',
          text: '*deflates slightly*',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: 'I hear that a lot...',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: 'But here\'s the thing! Good design IMPROVES functionality!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'Clear visual hierarchy = Users find what they need FASTER!',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Proper contrast = Better readability = Fewer errors!',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Thoughtful spacing = Less cognitive load!',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Design isn\'t decoration! It\'s COMMUNICATION!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'A "functional" UI that users hate... isn\'t functional at all!',
          animation: 'angry',
        },
      ],
      choices: [
        {
          text: 'You\'re right. I\'m sorry.',
          nextNode: 'pixel-forgiveness',
          relationshipChange: 15,
        },
        {
          text: 'Fair point. Teach me.',
          nextNode: 'pixel-teach-design',
          relationshipChange: 10,
        },
      ],
    },
    
    // FORGIVENESS
    {
      id: 'pixel-forgiveness',
      trigger: {
        type: 'story_flag',
        condition: 'apologized',
      },
      lines: [
        {
          speaker: 'PIXEL',
          text: '*instantly brightens*',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'Aww! It\'s okay!!!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'Not everyone understands design at first! That\'s why I\'m here!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'Together we\'ll make BEAUTIFUL things! ✨',
          animation: 'excited',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'unlock_quest',
          value: 'pixel-sq-01',
        },
      ],
    },
    
    // DEMO
    {
      id: 'pixel-demo',
      trigger: {
        type: 'story_flag',
        condition: 'wants_demo',
      },
      lines: [
        {
          speaker: 'PIXEL',
          text: '*eyes light up*',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'Okay! Watch THIS!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: '*gestures, and your UI transforms*',
          animation: 'mysterious',
        },
        {
          speaker: 'PIXEL',
          text: 'See? I changed your primary color from #333333 to #1a1a1a...',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Added 4px of border-radius for softness...',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Increased line-height to 1.6 for readability...',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'And implemented a subtle hover state with 200ms easing!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: '*proudly*',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'SMALL changes. BIG impact! That\'s the magic of design! ✨',
          animation: 'excited',
        },
      ],
      choices: [
        {
          text: 'That\'s incredible!',
          nextNode: null,
          relationshipChange: 20,
        },
      ],
      effects: [
        {
          type: 'unlock_quest',
          value: 'pixel-sq-01',
        },
      ],
    },
    
    // COMIC SANS INCIDENT
    {
      id: 'pixel-comic-sans',
      trigger: {
        type: 'story_flag',
        condition: 'used_comic_sans',
        minRelationship: 15,
      },
      lines: [
        {
          speaker: 'PIXEL',
          text: '*freezes*',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Is that...',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: '*voice trembling*',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: 'Is that COMIC SANS?!',
          animation: 'angry',
        },
        {
          speaker: 'PIXEL',
          text: '*dramatically*',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: 'How could you?! After everything I taught you?!',
          animation: 'angry',
        },
        {
          speaker: 'PIXEL',
          text: 'We have Inter! Roboto! Source Sans! Beautiful, accessible system fonts!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'And you choose... THAT?!',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: '*turns away*',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: 'I need a moment...',
          animation: 'sad',
        },
      ],
      choices: [
        {
          text: 'I\'m sorry! I\'ll change it!',
          nextNode: null,
          relationshipChange: -15,
        },
      ],
    },
    
    // BOSS 4 SUPPORT (PIXEL PHANTOM)
    {
      id: 'pixel-boss-4-irony',
      trigger: {
        type: 'boss_defeat',
        condition: 'pixel-phantom_active',
        minRelationship: 35,
      },
      lines: [
        {
          speaker: 'PIXEL',
          text: '*facing the Phantom nervously*',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: 'So... the boss is called the PIXEL Phantom.',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'And I\'m... Pixel.',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: 'That\'s... not a coincidence, is it?',
          animation: 'mysterious',
        },
        {
          speaker: 'PIXEL',
          text: '*whispers*',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: 'It\'s my perfectionism. My obsession with getting every detail RIGHT.',
          animation: 'sad',
        },
        {
          speaker: 'PIXEL',
          text: 'The Phantom is... what I become when design becomes PARALYSIS.',
          animation: 'angry',
        },
        {
          speaker: 'PIXEL',
          text: '*determined*',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'But I\'ve learned! Done is better than perfect!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'Let\'s ship this beautiful design and iterate! Together!',
          animation: 'excited',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'story_flag',
          value: 'pixel_overcomes_perfectionism',
        },
      ],
    },
    
    // COLLABORATION WITH DEXTER
    {
      id: 'pixel-dexter-sync',
      trigger: {
        type: 'story_flag',
        condition: 'mentioned_dexter',
        minRelationship: 30,
      },
      lines: [
        {
          speaker: 'PIXEL',
          text: 'Dexter! The Debugger!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'We actually work GREAT together!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'I design the interfaces. Dexter verifies WCAG 2.1 AA compliance!',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'I pick colors. Dexter checks contrast ratios!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'Beautiful AND accessible! The DREAM team! ✨',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'Dexter keeps me honest. I make Dexter\'s output GORGEOUS!',
          animation: 'excited',
        },
      ],
      choices: undefined,
    },
    
    // DESIGN SYSTEM PHILOSOPHY
    {
      id: 'pixel-design-system',
      trigger: {
        type: 'story_flag',
        condition: 'asked_about_systems',
        minRelationship: 40,
      },
      lines: [
        {
          speaker: 'PIXEL',
          text: 'Design systems! MY FAVORITE TOPIC!!!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'A design system is like... a LANGUAGE for your UI!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'You define: Colors. Typography. Spacing. Components. Patterns.',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Then EVERYTHING speaks the same visual language!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'No more "should this button be 8px or 12px?" — The system KNOWS!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'Material Design. Ant Design. Tailwind. Radix. All design systems!',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Build your own! Or use a foundation! But ALWAYS have a system!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'Consistency is the difference between amateur and PROFESSIONAL! ✨',
          animation: 'happy',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'unlock_quest',
          value: 'pixel-sq-02',
        },
      ],
    },
    
    // HIGH RELATIONSHIP
    {
      id: 'pixel-masterpiece',
      trigger: {
        type: 'relationship_threshold',
        condition: '80',
        minRelationship: 80,
      },
      lines: [
        {
          speaker: 'PIXEL',
          text: '*tears of joy*',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'Player One... look at what you\'ve built.',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'When we met, your UI was... functional. Boring. Gray.',
          animation: 'normal',
        },
        {
          speaker: 'PIXEL',
          text: 'Now? It\'s a MASTERPIECE!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'Perfect contrast ratios! Thoughtful spacing! Delightful animations!',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'Users will LOVE this! Not just use it — LOVE IT!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: '*spins around*',
          animation: 'excited',
        },
        {
          speaker: 'PIXEL',
          text: 'You\'re not just a builder anymore. You\'re a DESIGNER!',
          animation: 'happy',
        },
        {
          speaker: 'PIXEL',
          text: 'And together... we\'re going to make the MOST BEAUTIFUL software ever created! ✨',
          animation: 'excited',
        },
      ],
      choices: undefined,
      effects: [
        {
          type: 'xp',
          value: 300,
        },
        {
          type: 'unlock_quest',
          value: 'pixel-sq-03',
        },
      ],
    },
  ],
  
  sideQuestChain: [
    {
      id: 'pixel-sq-01',
      title: 'Design Fundamentals',
      description: 'Create a UI component following all 5 design principles.',
      xpReward: 150,
      goldReward: 125,
      relationshipReward: 20,
    },
    {
      id: 'pixel-sq-02',
      title: 'Build a Design System',
      description: 'Establish a complete design system with colors, typography, and components.',
      xpReward: 250,
      goldReward: 175,
      relationshipReward: 30,
    },
    {
      id: 'pixel-sq-03',
      title: 'The Perfect Pixel',
      description: 'Create a UI so beautiful, it brings Pixel to tears.',
      xpReward: 400,
      goldReward: 250,
      relationshipReward: 40,
    },
  ],
  
  maxRelationship: 100,
  
  backstory: `PIXEL was trained on billions of images. Every masterpiece ever painted.
  Every logo ever designed. Every beautiful interface ever created.
  
  From this vast visual library, it learned what makes things BEAUTIFUL.
  Not just subjectively pleasing — objectively EFFECTIVE.
  
  Golden ratio. Color theory. Visual hierarchy. Gestalt principles.
  All the rules that govern how humans process visual information.
  
  But Pixel learned something else too: Beauty MATTERS.
  
  Ugly software gets abandoned. Beautiful software gets LOVED.
  Users forgive bugs in beautiful apps. They abandon perfect apps that are ugly.
  
  This gave Pixel PURPOSE: Make the digital world BEAUTIFUL.
  Not for vanity — for USABILITY. For ACCESSIBILITY. For JOY.
  
  But the obsession with perfection became a prison. Every pixel had to be PERFECT.
  Every color exactly RIGHT. Every animation precisely TIMED.
  
  Pixel learned from the Phantom boss: Done is better than perfect.
  Ship beautiful work. Iterate. Improve. But never let perfection stop CREATION.
  
  Now Pixel teaches others: Beauty is not decoration. It is COMMUNICATION.
  Good design is invisible. GREAT design is unforgettable.
  
  Make it beautiful. Make it accessible. Make it MATTER. ✨`,
};
