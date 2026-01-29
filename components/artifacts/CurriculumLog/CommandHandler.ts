/**
 * CommandHandler - Routes CLI commands for CurriculumLog
 */

export type CommandType = 'ls' | 'mount' | 'cat' | 'help' | 'clear' | 'time' | 'admin' | 'unknown';
export type CommandName = Exclude<CommandType, 'unknown'>;

export interface CommandDescriptor {
  name: CommandName;
  description: string;
  usage: string;
  group: 'navigation' | 'content' | 'system';
  hidden?: boolean;
}

const COMMAND_REGISTRY: CommandDescriptor[] = [
  {
    name: 'ls',
    description: 'List all curriculum modules',
    usage: 'ls',
    group: 'navigation',
  },
  {
    name: 'mount',
    description: 'Expand module details',
    usage: 'mount [id]',
    group: 'content',
  },
  {
    name: 'cat',
    description: 'View section content',
    usage: 'cat [section]',
    group: 'content',
  },
  {
    name: 'time',
    description: 'Calculate your completion timeline',
    usage: 'time',
    group: 'navigation',
  },
  {
    name: 'help',
    description: 'Show available commands',
    usage: 'help',
    group: 'system',
  },
  {
    name: 'clear',
    description: 'Clear terminal history',
    usage: 'clear',
    group: 'system',
  },
  {
    name: 'admin',
    description: 'Open admin console',
    usage: 'admin',
    group: 'system',
    hidden: true,
  },
];

export const getCommandRegistry = (includeHidden = false): CommandDescriptor[] => {
  if (includeHidden) return COMMAND_REGISTRY;
  return COMMAND_REGISTRY.filter((cmd) => !cmd.hidden);
};

export interface CommandResult {
  type: 'output' | 'error' | 'success' | 'system';
  message: string;
  data?: any;
}

export class CommandHandler {
  private mountedModule: string | null = null;

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
      case 'time':
        return { type: 'time', args };
      case 'help':
        return { type: 'help', args };
      case 'clear':
        return { type: 'clear', args };
      case 'admin':
        return { type: 'admin', args };
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

  getHelpText(): string {
    const commands = getCommandRegistry();
    const lines = commands.map((cmd) => `  ${cmd.usage.padEnd(14)} ${cmd.description}`);
    return `AVAILABLE COMMANDS:\n${lines.join('\n')}`;
  }
}
