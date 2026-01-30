/**
 * CommandHandler - Routes CLI commands for CurriculumLog
 */

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
  | 'unknown';

export interface CommandResult {
  type: 'output' | 'error' | 'success' | 'system';
  message: string;
  data?: any;
}

export class CommandHandler {
  private mountedModule: string | null = null;
  private currentSectionId: string | null = null;

  parseCommand(input: string): { type: CommandType; args: string[] } {
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
        return { type: 'unknown', args };
    }
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
  clear                 Clear terminal history`;
  }
}
