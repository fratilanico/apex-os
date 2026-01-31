/**
 * Help command handler
 * Displays available commands and usage information
 */

import type { CommandContext } from './types';

const HELP_TEXT = `
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

/**
 * Display help information
 */
export function handleHelp(context: CommandContext): string {
  context.addLine('system', HELP_TEXT);
  return '[exit 0]';
}
