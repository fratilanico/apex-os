/**
 * Terminal Constants
 * 
 * All constants extracted from ApexTerminalHUD.tsx following DRY principles.
 * Single source of truth for terminal-related constants.
 */

export const APEX_LOGO_ASCII = `
  █████╗ ██████╗ ███████╗██╗  ██╗    ██████╗  ███████╗
 ██╔══██╗██╔══██╗██╔════╝╚██╗██╔╝   ██╔═══██╗██╔════╝ 
 ███████║██████╔╝█████╗   ╚███╔╝    ██║   ██║███████╗ 
 ██╔══██║██╔═══╝ ██╔══╝   ██╔██╗    ██║   ██║╚════██║ 
 ██║  ██║██║     ███████╗██╔╝ ██╗   ╚██████╔╝███████║ 
 ╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝    ╚═════╝ ╚══════╝ 
`;

export const PLAYER_ONE_ASCII = `
 ██████╗ ██╗      █████╗ ██╗   ██╗███████╗██████╗      ██╗
 ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗    ███║
 ██████╔╝██║     ███████║ ╚████╔╝ █████╗  ██████╔╝    ╚██║
 ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗     ██║
 ██║     ███████╗██║  ██║   ██║   ███████╗██║  ██║     ██║
 ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝     ╚═╝
`;

export const COMMANDS = [
  'help', 'clear', 'vibe', 'ask', 'code', 'explain', 'debug',
  'status', 'inventory', 'quests', 'map', 'cd', 'ls', 'pwd',
  'fork', 'solve', 'submit', 'abandon',
  'ingest', 'recall', 'sources', 'forget', 'stats'
] as const;

export const HELP_TEXT = `
┌─────────────────────────────────────────────────────────────┐
│  APEX OS — CLI Commands                                     │
│  AI ASSISTANCE                                              │
│    ask <question>    Ask AI anything                        │
│    code <desc>       Generate code                          │
│    explain <topic>   Get explanation                        │
│    debug <error>     Debug help                             │
│                                                             │
│  NAVIGATION                                                 │
│    cd <node-id>      Navigate to node                       │
│    ls               List adjacent nodes                     │
│    pwd              Show current position                   │
│    map              Display ASCII map                       │
│                                                             │
│  PLAYER STATUS                                              │
│    status           Show XP, level, stats                   │
│    inventory        List unlocked skills                    │
│    quests           Show available quests                   │
│                                                             │
│  CHALLENGES                                                 │
│    solve            Start current node challenge            │
│    submit <code>    Submit solution                         │
│    abandon          Cancel current challenge                │
│                                                             │
│  UTILITIES                                                  │
│    help             Show this menu                          │
│    clear            Clear terminal                          │
│    vibe             Random wisdom                           │
└─────────────────────────────────────────────────────────────┘`;

export const VIBE_QUOTES = [
  "The vibe coder doesn't fight the current - they become the current.",
  "Speed is a feature. Ship fast, learn faster.",
  "The best code is the code you don't write.",
  "In the age of AI, taste becomes the ultimate skill.",
  "We don't write code anymore. We conduct symphonies of intent.",
  "Perfect is the enemy of deployed.",
  "You're not learning to code - you're learning to shape reality.",
] as const;

export const ERROR_MESSAGES = {
  SYSTEM_OFFLINE: (status: string) => 
    `✗ SYSTEM_OFFLINE: Could not establish neural handshake with Vertex. Please retry. (Status: ${status})`,
  
  USAGE_ASK: 'Usage: ask <question>',
  USAGE_CODE: 'Usage: code <description>',
  USAGE_EXPLAIN: 'Usage: explain <topic>',
  USAGE_DEBUG: 'Usage: debug <error>',
  USAGE_CD: 'Usage: cd <node-id>',
  USAGE_SUBMIT: 'Usage: submit <code>',
  
  NAVIGATION_FAILED: (nodeId: string) => 
    `Failed to navigate to ${nodeId}. Node not found or not adjacent.`,
  NO_CURRENT_NODE: 'No current node',
  NO_CHALLENGE_AVAILABLE: 'No challenge available at this node',
  FAILED_START_CHALLENGE: 'Failed to start challenge',
  NO_ACTIVE_CHALLENGE: 'No active challenge',
  
  PROCESS_INTERRUPTED: '^C\n[ Process interrupted ]',
  
  ALREADY_PROCESSING: 'Request already being processed...',
  COMMAND_FAILED: (error: string) => `Command failed: ${error}`,
  INVALID_COMMAND: (reason: string) => `Invalid command: ${reason}`,
} as const;

export const SUCCESS_MESSAGES = {
  CHALLENGE_COMPLETED: (feedback: string) => 
    `✓ CHALLENGE COMPLETED!\n${feedback}`,
  CHALLENGE_ABANDONED: 'Challenge abandoned',
} as const;

export const SYSTEM_MESSAGES = {
  NEURAL_HANDSHAKE_COMPLETE: 'Neural handshake complete.',
  SYNCING_SYNAPSES: 'Syncing_Synapses...',
  HANDSHAKE_AUTHORIZED: 'Handshake_Authorized',
  THINKING: 'Thinking',
  SOVEREIGN: 'Sovereign',
  NEURAL_ACTIVE: 'Neural_Active',
  APEX_OS: 'Apex OS',
  ACCESSING_VAULT: `Accessing vault...
Initializing secure connection...
Vault access granted.`,
} as const;

export const UI_LABELS = {
  OPERATOR: 'Operator',
  PLAYER_ONE: 'Player One',
  CREDITS: 'Credits',
  CREDITS_LOADED: '$300_LOADED',
  CORE: 'Core',
  CORE_TYPE: 'G3_FLASH',
  SECURITY: 'Security',
  SECURITY_STATUS: '[ Sovereign ]',
  INITIALIZE_PROTOCOL: 'Initialize protocol...',
  APEX_AI: 'APEX AI',
} as const;

export const TERMINAL_CONFIG = {
  AUTO_SAVE_INTERVAL: 4000,
  BOOT_DELAY: 300,
  AUTHORIZATION_DELAY: 2500,
  MAX_HISTORY_SIZE: 50,
  MAX_RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000,
  AI_HISTORY_CONTEXT_SIZE: 10,
  GRID_SIZE: 64,
  GRID_COLS: 8,
  API_TIMEOUT_MS: 30000,
} as const;

export const COMMAND_ALIASES: Record<string, string> = {
  'showmethemoney': 'showmethemoney',
} as const;
