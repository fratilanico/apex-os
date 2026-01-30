/**
 * CommandHandler - Routes CLI commands for CurriculumLog
 * Now with Natural Language Processing support
 */

import { nlpParser, NLPSearchResult } from './NLPCommandParser';

export type CommandType = 
  | 'ls' 
  | 'mount' 
  | 'cat' 
  | 'next' 
  | 'prev' 
  | 'complete' 
  | 'progress' 
  | 'help' 
  | 'clear' 
  | 'time' 
  | 'admin'
  | 'showmethemoney'
  | 'nlp'
  | 'unknown';

export interface CommandResult {
  type: 'output' | 'error' | 'success' | 'system';
  message: string;
  data?: any;
}

export class CommandHandler {
  private mountedModule: string | null = null;
  private currentSectionId: string | null = null;

  parseCommand(input: string): { type: CommandType; args: string[]; nlpResult?: NLPSearchResult } {
    const trimmed = input.trim().toLowerCase();
    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case 'ls':
        return { type: 'ls', args };
      case 'mount':
        return { type: 'mount', args };
      case 'cat':
        return { type: 'cat', args };
      case 'next':
        return { type: 'next', args };
      case 'prev':
      case 'previous':
        return { type: 'prev', args };
      case 'complete':
      case 'done':
        return { type: 'complete', args };
      case 'progress':
        return { type: 'progress', args };
      case 'time':
        return { type: 'time', args };
      case 'help':
        return { type: 'help', args };
      case 'clear':
        return { type: 'clear', args };
      case 'admin':
        return { type: 'admin', args };
      case 'showmethemoney':
        return { type: 'showmethemoney', args };
      default:
        // Try natural language parsing
        const nlpResult = nlpParser.parseQuery(input);
        if (nlpResult) {
          return { type: 'nlp', args: [input], nlpResult };
        }
        return { type: 'unknown', args };
    }
  }

  /**
   * Process a natural language query and return formatted result
   */
  processNLPQuery(query: string): { result: NLPSearchResult | null; formatted: string } {
    const result = nlpParser.parseQuery(query);
    
    if (!result) {
      return {
        result: null,
        formatted: `I couldn't find anything matching "${query}".\n\nTry asking naturally:\n• "What is the shift mindset?"\n• "Tell me about module 2"\n• "How do I use Cursor?"\n• "Explain orchestration"\n• "What tools do I need for module 3?"\n\nOr type "help" for available commands.`
      };
    }

    let formatted = '';
    
    switch (result.type) {
      case 'module':
        formatted = `> ${result.title}\n\n${result.content}\n\n💡 Type "mount ${result.module?.number}" to explore this module.`;
        break;
      case 'section':
        formatted = `> ${result.title}\n\n${result.content}\n\n💡 Type "cat ${result.section?.id}" to read the full section.`;
        break;
      case 'tool':
        formatted = `> ${result.title}\n\n${result.content}`;
        if (result.relatedSections && result.relatedSections.length > 0) {
          formatted += `\n\n📚 Learn more in:\n${result.relatedSections.map(s => `  • ${s.id}: ${s.title}`).join('\n')}`;
        }
        break;
      case 'help':
        formatted = result.content;
        break;
      default:
        formatted = `> ${result.title}\n\n${result.content}`;
    }

    if (result.suggestions && result.suggestions.length > 0) {
      formatted += `\n\n🔍 Related:\n${result.suggestions.map(s => `  • "${s}"`).join('\n')}`;
    }

    return { result, formatted };
  }

  /**
   * Get suggestions for partial input
   */
  getNLPSuggestions(partialInput: string): string[] {
    return nlpParser.getSuggestions(partialInput);
  }

  getMountedModule(): string | null {
    return this.mountedModule;
  }

  setMountedModule(moduleId: string | null): void {
    this.mountedModule = moduleId;
  }

  getCurrentSection(): string | null {
    return this.currentSectionId;
  }

  setCurrentSection(sectionId: string | null): void {
    this.currentSectionId = sectionId;
  }

  getHelpText(): string {
    return `AVAILABLE COMMANDS:
  ls                    List all curriculum modules
  mount [id]            Expand module details (e.g., 'mount 01')
  cat [section]         View section content (e.g., 'cat 01.2')
  next                  Go to next section
  prev                  Go to previous section
  complete              Mark current section as completed
  progress              Show overall curriculum progress
  time                  Calculate personalized completion timeline
  admin                 Access admin dashboard
  showmethemoney        🤫 View business plan & financials
  help                  Show this help message
  clear                 Clear terminal history

NATURAL LANGUAGE QUERIES:
  Ask naturally about the curriculum:
  • "What is the shift mindset?"
  • "Tell me about module 2"
  • "How do I use Cursor?"
  • "Explain orchestration"
  • "What tools do I need for module 3?"`;
  }
}
