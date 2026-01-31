/**
 * Challenges command handlers
 * Handles solve, submit, and abandon commands
 */

import type { CommandContext } from './types';
import * as CLIFormatter from '@/lib/cliFormatter';
import { MAIN_QUESTS } from '@/data/questsData';

/**
 * Quest ID mapping for nodes
 */
const NODE_QUEST_MAP: Record<string, string> = {
  '0': 'main-01',
  '1': 'main-03',
  '2': 'main-02',
  '3': 'main-06',
};

/**
 * Handle solve command - start current node challenge
 */
export function handleSolve(context: CommandContext): string {
  const currentNode = context.gameEngine.getCurrentNode();
  
  if (!currentNode) {
    context.addLine('error', CLIFormatter.formatError('No current node', 1));
    return '[exit 1]';
  }
  
  const directQuestId = NODE_QUEST_MAP[currentNode.id];
  const quest = directQuestId
    ? MAIN_QUESTS.find((q) => q.id === directQuestId)
    : null;
  
  if (!quest) {
    context.addLine(
      'error',
      CLIFormatter.formatError('No challenge available at this node', 1)
    );
    return '[exit 1]';
  }
  
  const started = context.gameEngine.startChallenge(currentNode.id, quest.id);
  
  if (started) {
    const challengeDisplay = `╔═══════════════════════════════════════════════════╗
║  CHALLENGE INITIATED: ${quest.title.padEnd(28)} ║
╠═══════════════════════════════════════════════════╣
║  ${quest.description.padEnd(48)} ║
╠═══════════════════════════════════════════════════╣
║  Difficulty: ${quest.difficulty.padEnd(36)} ║
║  Reward: ${(quest.xpReward + ' XP + ' + quest.goldReward + ' GOLD').padEnd(40)} ║
╚═══════════════════════════════════════════════════╝\n\n${quest.narrative}\n\nUse: submit <code> to complete\n[exit 0]`;
    
    context.addLine('system', challengeDisplay);
    return '[exit 0]';
  } else {
    context.addLine('error', CLIFormatter.formatError('Failed to start challenge', 1));
    return '[exit 1]';
  }
}

/**
 * Handle submit command - submit solution
 */
export async function handleSubmit(
  context: CommandContext,
  args: string[]
): Promise<string> {
  const code = args.join(' ');
  
  if (!code.trim()) {
    context.addLine('error', CLIFormatter.formatError('Usage: submit <code>', 1));
    return '[exit 1]';
  }
  
  context.setIsProcessing(true);
  
  try {
    const result = await context.gameEngine.submitSolution(code);
    context.setIsProcessing(false);
    
    if (result.success) {
      context.addLine(
        'system',
        CLIFormatter.formatSuccess(`✓ CHALLENGE COMPLETED!\n${result.feedback}`, 0)
      );
      return '[exit 0]';
    } else {
      context.addLine(
        'error',
        CLIFormatter.formatError(`✗ FAILED\n${result.feedback}`, 1)
      );
      return '[exit 1]';
    }
  } catch (error) {
    context.setIsProcessing(false);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    context.addLine('error', CLIFormatter.formatError(`Submission failed: ${errorMessage}`, 1));
    return '[exit 1]';
  }
}

/**
 * Handle abandon command - cancel current challenge
 */
export function handleAbandon(context: CommandContext): string {
  if (!context.gameEngine.activeChallenge) {
    context.addLine('error', CLIFormatter.formatError('No active challenge', 1));
    return '[exit 1]';
  }
  
  context.gameEngine.abandonChallenge();
  context.addLine('system', CLIFormatter.formatSuccess('Challenge abandoned', 0));
  return '[exit 0]';
}
