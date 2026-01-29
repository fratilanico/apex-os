/**
 * Type definitions for the Vibe Coder Academy curriculum system
 */

export type ToolCategory = 
  | 'EDITOR' 
  | 'REASONING' 
  | 'MULTIMODAL' 
  | 'CLOUD' 
  | 'IDE' 
  | 'ORCHESTRATION'
  | 'RESEARCH' 
  | 'DESIGN' 
  | 'DEBUGGING' 
  | 'AGENT' 
  | 'IMAGES' 
  | 'VIDEO';

export type ToolTier = 'core' | 'asset';

export interface Tool {
  id: string;                    // 'cursor', 'claude-code', etc.
  name: string;                  // 'Cursor'
  category: ToolCategory;
  description: string;           // Short description for cards
  tier: ToolTier;
  icon: string;                  // Lucide icon name
  url?: string;                  // Optional external link
}

export interface Section {
  id: string;                    // '00.1', '01.2', etc.
  title: string;
  content: string;               // Markdown content (placeholder for now)
  tools: string[];               // Tool IDs referenced in this section
  duration?: string;             // '15 min read', optional
}

export interface Module {
  id: string;                    // 'module-00', 'module-01', etc.
  number: string;                // '00', '01', '02', etc.
  title: string;                 // 'The Shift'
  subtitle: string;              // 'Why AI Coding Isn't Autocomplete'
  duration: string;              // '20 min read'
  objective: string;             // What you'll learn
  sections: Section[];
  keyTakeaways: string[];        // Bullet points
  icon: string;                  // Lucide icon name
}

export interface Curriculum {
  tools: Tool[];
  modules: Module[];
}
