/**
 * Command registry and exports
 * Centralizes all command handlers for the terminal
 */

import type { CommandContext, CommandEntry } from './types';

// Command handlers
import { handleHelp } from './help';
import { handleClear } from './clear';
import { handleVibe } from './vibe';
import { handleAsk, handleCode, handleExplain, handleDebug } from './ai-commands';
import { handleCd, handleLs, handlePwd, handleMap } from './navigation';
import { handleStatus, handleInventory } from './status';
import { handleQuests } from './quests';
import { handleSolve, handleSubmit, handleAbandon } from './challenges';

// Export types
export type { CommandContext, CommandEntry, GameEngineStore, SkillTreeStore, MatrixStore } from './types';

// Export individual handlers
export {
  handleHelp,
  handleClear,
  handleVibe,
  handleAsk,
  handleCode,
  handleExplain,
  handleDebug,
  handleCd,
  handleLs,
  handlePwd,
  handleMap,
  handleStatus,
  handleInventory,
  handleQuests,
  handleSolve,
  handleSubmit,
  handleAbandon,
};

/**
 * Command registry - maps command names to handlers
 */
export const commandRegistry: Record<string, CommandEntry> = {
  // Utilities
  help: {
    name: 'help',
    handler: handleHelp,
    description: 'Show available commands',
    category: 'utilities',
  },
  clear: {
    name: 'clear',
    handler: handleClear,
    description: 'Clear terminal screen',
    category: 'utilities',
  },
  vibe: {
    name: 'vibe',
    handler: handleVibe,
    description: 'Display random wisdom',
    category: 'utilities',
  },
  
  // AI Commands
  ask: {
    name: 'ask',
    handler: handleAsk,
    description: 'Ask AI anything',
    usage: 'ask <question>',
    category: 'ai',
  },
  code: {
    name: 'code',
    handler: handleCode,
    description: 'Generate code',
    usage: 'code <description>',
    category: 'ai',
  },
  explain: {
    name: 'explain',
    handler: handleExplain,
    description: 'Get explanation',
    usage: 'explain <topic>',
    category: 'ai',
  },
  debug: {
    name: 'debug',
    handler: handleDebug,
    description: 'Debug help',
    usage: 'debug <error>',
    category: 'ai',
  },
  
  // Navigation
  cd: {
    name: 'cd',
    handler: handleCd,
    description: 'Navigate to node',
    usage: 'cd <node-id>',
    category: 'navigation',
  },
  ls: {
    name: 'ls',
    handler: handleLs,
    description: 'List adjacent nodes',
    category: 'navigation',
  },
  pwd: {
    name: 'pwd',
    handler: handlePwd,
    description: 'Show current position',
    category: 'navigation',
  },
  map: {
    name: 'map',
    handler: handleMap,
    description: 'Display ASCII map',
    category: 'navigation',
  },
  
  // Status
  status: {
    name: 'status',
    handler: handleStatus,
    description: 'Show XP, level, stats',
    category: 'status',
  },
  inventory: {
    name: 'inventory',
    handler: handleInventory,
    description: 'List unlocked skills',
    category: 'status',
  },
  
  // Quests
  quests: {
    name: 'quests',
    handler: handleQuests,
    description: 'Show available quests',
    category: 'status',
  },
  
  // Challenges
  solve: {
    name: 'solve',
    handler: handleSolve,
    description: 'Start current node challenge',
    category: 'challenges',
  },
  submit: {
    name: 'submit',
    handler: handleSubmit,
    description: 'Submit solution',
    usage: 'submit <code>',
    category: 'challenges',
  },
  abandon: {
    name: 'abandon',
    handler: handleAbandon,
    description: 'Cancel current challenge',
    category: 'challenges',
  },
};

/**
 * Get list of all available command names
 */
export function getAvailableCommands(): string[] {
  return Object.keys(commandRegistry);
}

/**
 * Get commands by category
 */
export function getCommandsByCategory(
  category: CommandEntry['category']
): CommandEntry[] {
  return Object.values(commandRegistry).filter(
    (cmd) => cmd.category === category
  );
}

/**
 * Check if a command exists
 */
export function commandExists(command: string): boolean {
  return command.toLowerCase() in commandRegistry;
}

/**
 * Execute a command by name
 */
export async function executeCommand(
  commandName: string,
  context: CommandContext,
  args: string[]
): Promise<string> {
  const entry = commandRegistry[commandName.toLowerCase()];

  if (!entry) {
    return '[exit 127]';
  }

  try {
    const result = await entry.handler(context, args);
    return result || '[exit 0]';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    context.addLine('error', `Command failed: ${errorMessage}`);
    return '[exit 1]';
  }
}
