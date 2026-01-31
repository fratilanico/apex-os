/**
 * AI command handlers
 * Handles ask, code, explain, and debug commands
 */

import type { CommandContext } from './types';
import * as CLIFormatter from '@/lib/cliFormatter';

/**
 * Handle ask command - general AI question
 */
export async function handleAsk(
  context: CommandContext,
  args: string[]
): Promise<string> {
  const question = args.join(' ');
  
  if (!question.trim()) {
    context.addLine('error', CLIFormatter.formatError('Usage: ask <question>', 1));
    return '[exit 1]';
  }

  context.setIsProcessing(true);
  
  try {
    const response = await context.callAI(question);
    context.setIsProcessing(false);
    context.addLine('system', CLIFormatter.convertMarkdownToCLI(response));
    return '[exit 0]';
  } catch (error) {
    context.setIsProcessing(false);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    context.addLine('error', CLIFormatter.formatError(`AI request failed: ${errorMessage}`, 1));
    return '[exit 1]';
  }
}

/**
 * Handle code command - generate code
 */
export async function handleCode(
  context: CommandContext,
  args: string[]
): Promise<string> {
  const description = args.join(' ');
  
  if (!description.trim()) {
    context.addLine('error', CLIFormatter.formatError('Usage: code <description>', 1));
    return '[exit 1]';
  }

  context.setIsProcessing(true);
  
  try {
    const response = await context.callAI(`Generate code for: ${description}`);
    context.setIsProcessing(false);
    context.addLine('system', CLIFormatter.convertMarkdownToCLI(response));
    return '[exit 0]';
  } catch (error) {
    context.setIsProcessing(false);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    context.addLine('error', CLIFormatter.formatError(`Code generation failed: ${errorMessage}`, 1));
    return '[exit 1]';
  }
}

/**
 * Handle explain command - explain a topic
 */
export async function handleExplain(
  context: CommandContext,
  args: string[]
): Promise<string> {
  const topic = args.join(' ');
  
  if (!topic.trim()) {
    context.addLine('error', CLIFormatter.formatError('Usage: explain <topic>', 1));
    return '[exit 1]';
  }

  context.setIsProcessing(true);
  
  try {
    const response = await context.callAI(`Explain: ${topic}`);
    context.setIsProcessing(false);
    context.addLine('system', CLIFormatter.convertMarkdownToCLI(response));
    return '[exit 0]';
  } catch (error) {
    context.setIsProcessing(false);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    context.addLine('error', CLIFormatter.formatError(`Explanation failed: ${errorMessage}`, 1));
    return '[exit 1]';
  }
}

/**
 * Handle debug command - debug help
 */
export async function handleDebug(
  context: CommandContext,
  args: string[]
): Promise<string> {
  const error = args.join(' ');
  
  if (!error.trim()) {
    context.addLine('error', CLIFormatter.formatError('Usage: debug <error>', 1));
    return '[exit 1]';
  }

  context.setIsProcessing(true);
  
  try {
    const response = await context.callAI(`Debug: ${error}`);
    context.setIsProcessing(false);
    context.addLine('system', CLIFormatter.convertMarkdownToCLI(response));
    return '[exit 0]';
  } catch (error) {
    context.setIsProcessing(false);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    context.addLine('error', CLIFormatter.formatError(`Debug request failed: ${errorMessage}`, 1));
    return '[exit 1]';
  }
}
