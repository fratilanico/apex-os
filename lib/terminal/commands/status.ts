/**
 * Status command handlers
 * Handles status and inventory commands
 */

import type { CommandContext } from './types';
import * as CLIFormatter from '@/lib/cliFormatter';

/**
 * Handle status command - show player stats
 */
export function handleStatus(context: CommandContext): string {
  const stats = context.gameEngine.getPlayerStats();
  context.addLine('system', CLIFormatter.formatPlayerStats(stats));
  return '[exit 0]';
}

/**
 * Handle inventory command - list unlocked skills
 */
export function handleInventory(context: CommandContext): string {
  const skills = context.skillTree.unlockedSkills.map((skillId) => {
    const progress = context.skillTree.getSkillProgress(skillId);
    return {
      id: skillId,
      name: skillId,
      progress: progress?.progress || 0,
    };
  });
  
  context.addLine('system', CLIFormatter.formatSkillsList(skills));
  return '[exit 0]';
}
