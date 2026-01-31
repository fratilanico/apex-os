/**
 * Quests command handler
 * Handles quests listing command
 */

import type { CommandContext } from './types';
import * as CLIFormatter from '@/lib/cliFormatter';

/**
 * Handle quests command - show available quests
 */
export function handleQuests(context: CommandContext): string {
  const availableQuests = context.skillTree.getAvailableQuests();
  const activeQuest = context.skillTree.getActiveQuest();
  const completed = context.skillTree.completedQuests;
  
  const questList = [
    ...availableQuests.map((q) => ({
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      status: 'available' as const,
      xpReward: q.xpReward,
    })),
    ...(activeQuest
      ? [
          {
            id: activeQuest.id,
            title: activeQuest.title,
            difficulty: activeQuest.difficulty,
            status: 'active' as const,
            xpReward: activeQuest.xpReward,
          },
        ]
      : []),
  ];
  
  context.addLine('system', CLIFormatter.formatQuestList(questList));
  
  if (completed.length > 0) {
    context.addLine('system', `\nCompleted Quests: ${completed.length}\n[exit 0]`);
  }
  
  return '[exit 0]';
}
