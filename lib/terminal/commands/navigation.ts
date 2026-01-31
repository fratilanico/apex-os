/**
 * Navigation command handlers
 * Handles cd, ls, pwd, and map commands
 */

import type { CommandContext } from './types';
import * as CLIFormatter from '@/lib/cliFormatter';

/**
 * Handle cd command - navigate to a node
 */
export function handleCd(
  context: CommandContext,
  args: string[]
): string {
  const nodeId = args[0];
  
  if (!nodeId) {
    context.addLine('error', CLIFormatter.formatError('Usage: cd <node-id>', 1));
    return '[exit 1]';
  }

  const success = context.gameEngine.navigateTo(nodeId);
  
  if (success) {
    const node = context.gameEngine.getCurrentNode();
    context.addLine(
      'system',
      CLIFormatter.formatSuccess(`Navigated to: ${node?.data.label || nodeId}`, 0)
    );
    return '[exit 0]';
  } else {
    context.addLine(
      'error',
      CLIFormatter.formatError(
        `Failed to navigate to ${nodeId}. Node not found or not adjacent.`,
        1
      )
    );
    return '[exit 1]';
  }
}

/**
 * Handle ls command - list adjacent nodes
 */
export function handleLs(context: CommandContext): string {
  const adjacentNodes = context.gameEngine.getAdjacentNodes();
  
  const formatted = adjacentNodes.map((n) => ({
    id: n.id,
    label: n.data.label,
    type: n.data.type,
    status: n.data.status,
    distance: 1,
  }));
  
  context.addLine('system', CLIFormatter.formatNodeList(formatted));
  return '[exit 0]';
}

/**
 * Handle pwd command - show current position
 */
export function handlePwd(context: CommandContext): string {
  const currentNode = context.gameEngine.getCurrentNode();
  const pathHistory = context.gameEngine.position.pathHistory;
  
  const output = `Current Node: ${currentNode?.data.label || 'Unknown'} [${currentNode?.id}]\nPath: ${pathHistory.join(' → ')}\n[exit 0]`;
  context.addLine('system', output);
  return '[exit 0]';
}

/**
 * Handle map command - display ASCII map
 */
export function handleMap(context: CommandContext): string {
  const currentNode = context.gameEngine.getCurrentNode();
  const adjacentNodes = context.gameEngine.getAdjacentNodes();
  
  const formatted = adjacentNodes.map((n) => ({
    id: n.id,
    label: n.data.label,
  }));
  
  context.addLine(
    'system',
    CLIFormatter.formatAsciiMap(currentNode?.data.label || 'Unknown', formatted)
  );
  return '[exit 0]';
}
