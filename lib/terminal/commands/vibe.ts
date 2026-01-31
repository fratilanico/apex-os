/**
 * Vibe command handler
 * Displays random wisdom quotes
 */

import type { CommandContext } from './types';

const VIBE_QUOTES = [
  "The vibe coder doesn't fight the current - they become the current.",
  "Speed is a feature. Ship fast, learn faster.",
  "The best code is the code you don't write.",
  "In the age of AI, taste becomes the ultimate skill.",
  "We don't write code anymore. We conduct symphonies of intent.",
  "Perfect is the enemy of deployed.",
  "You're not learning to code - you're learning to shape reality.",
];

/**
 * Display a random vibe quote
 */
export function handleVibe(context: CommandContext): string {
  const quote = VIBE_QUOTES[Math.floor(Math.random() * VIBE_QUOTES.length)];
  context.addLine('system', `\n  ✦ "${quote}"\n`);
  return '[exit 0]';
}
