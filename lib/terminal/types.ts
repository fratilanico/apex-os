/**
 * Terminal Types
 * 
 * All TypeScript interfaces and types extracted from ApexTerminalHUD.tsx.
 * Single source of truth for terminal-related type definitions.
 */

import type React from 'react';

export interface ApexTerminalLine {
  id: string;
  type: TerminalLineType;
  content: string | React.ReactNode;
  timestamp: Date;
}

export type TerminalLineType = 
  | 'input' 
  | 'output' 
  | 'error' 
  | 'system' 
  | 'ai' 
  | 'branding';

export type CommandType = 
  | 'help'
  | 'clear'
  | 'vibe'
  | 'ask'
  | 'code'
  | 'explain'
  | 'debug'
  | 'status'
  | 'inventory'
  | 'quests'
  | 'map'
  | 'cd'
  | 'ls'
  | 'pwd'
  | 'fork'
  | 'solve'
  | 'submit'
  | 'abandon'
  | 'ingest'
  | 'recall'
  | 'sources'
  | 'forget'
  | 'stats';

export interface TerminalProps {
  className?: string;
}

export interface TerminalCodeBlockProps {
  children: string;
  language?: string;
}

export interface PlayerOneBadgeProps {
  isAuthorized: boolean;
}

export interface NeuralGridProps {
  isAuthorized: boolean;
}

export interface NeuralPixelBrandingProps {
  isAuthorized: boolean;
}

export interface TerminalSessionState {
  lines: ApexTerminalLine[];
  history: string[];
  inputValue: string;
  scrollPosition: number;
}

export interface CommandResult {
  success: boolean;
  feedback: string;
}

export interface FormattedNode {
  id: string;
  label: string;
  type?: string;
  status?: string;
  distance?: number;
}

export interface FormattedQuest {
  id: string;
  title: string;
  difficulty: string;
  status: 'available' | 'active' | 'completed';
  xpReward: number;
}

export interface FormattedSkill {
  id: string;
  name: string;
  progress: number;
}
