/**
 * Comprehensive unit tests for all terminal command handlers
 * Tests all command handlers with success, error, and edge cases
 */

import type { CommandContext, GameEngineStore, SkillTreeStore, MatrixStore } from '../types';
import type { MatrixNode } from '@/types/matrix';
import type { Quest } from '@/data/questsData';

// Mock cliFormatter
jest.mock('@/lib/cliFormatter', () => ({
  formatSuccess: jest.fn((message: string, exitCode: number = 0) => `${message}\n[exit ${exitCode}]`),
  formatError: jest.fn((message: string, exitCode: number = 1) => `ERROR: ${message}\n[exit ${exitCode}]`),
  formatNodeList: jest.fn((nodes: Array<unknown>) => `NODES: ${nodes.length} nodes`),
  formatPlayerStats: jest.fn((stats: Record<string, unknown>) => `STATS: ${JSON.stringify(stats)}`),
  formatSkillsList: jest.fn((skills: Array<unknown>) => `SKILLS: ${skills.length} skills`),
  formatQuestList: jest.fn((quests: Array<unknown>) => `QUESTS: ${quests.length} quests`),
  formatAsciiMap: jest.fn((current: string, adjacent: Array<unknown>) => `MAP: ${current} - ${adjacent.length} adjacent`),
  convertMarkdownToCLI: jest.fn((markdown: string) => markdown),
}));

// Mock questsData
jest.mock('@/data/questsData', () => ({
  MAIN_QUESTS: [
    {
      id: 'main-01',
      title: 'First Steps',
      description: 'Learn the basics',
      difficulty: 'easy',
      xpReward: 100,
      goldReward: 50,
      narrative: 'Welcome to your first challenge!',
    },
    {
      id: 'main-02',
      title: 'Code Warrior',
      description: 'Write your first code',
      difficulty: 'medium',
      xpReward: 250,
      goldReward: 100,
      narrative: 'Time to write some code!',
    },
    {
      id: 'main-03',
      title: 'Debug Master',
      description: 'Fix the bugs',
      difficulty: 'hard',
      xpReward: 500,
      goldReward: 200,
      narrative: 'Find and fix the bugs!',
    },
    {
      id: 'main-06',
      title: 'Final Challenge',
      description: 'The ultimate test',
      difficulty: 'extreme',
      xpReward: 1000,
      goldReward: 500,
      narrative: 'Prove your worth!',
    },
  ],
}));

// Import handlers after mocks
import {
  handleHelp,
  handleClear,
  handleVibe,
  handleAsk,
  handleCode,
  handleExplain,
  handleDebug,
  handleCd,
  handleLs,
  handlePwd,
  handleMap,
  handleStatus,
  handleInventory,
  handleQuests,
  handleSolve,
  handleSubmit,
  handleAbandon,
} from '../index';

import * as CLIFormatter from '@/lib/cliFormatter';

describe('Terminal Command Handlers', () => {
  // Mock context factory
  const createMockContext = (overrides: Partial<CommandContext> = {}): CommandContext => ({
    addLine: jest.fn(),
    setLines: jest.fn(),
    gameEngine: {
      position: {
        currentNodeId: '0',
        previousNodeId: null,
        pathHistory: ['0'],
      },
      activeChallenge: null,
      navigateTo: jest.fn().mockReturnValue(true),
      getAdjacentNodes: jest.fn().mockReturnValue([]),
      getCurrentNode: jest.fn().mockReturnValue({
        id: '0',
        data: { label: 'Root', type: 'root', status: 'active' },
      } as MatrixNode),
      startChallenge: jest.fn().mockReturnValue(true),
      submitSolution: jest.fn().mockResolvedValue({ success: true, feedback: 'Great job!' }),
      abandonChallenge: jest.fn(),
      getPlayerStats: jest.fn().mockReturnValue({
        xp: 100,
        gold: 50,
        level: 1,
        completedQuests: 0,
        unlockedSkills: 0,
        nodesCompleted: 0,
      }),
    } as unknown as GameEngineStore,
    skillTree: {
      unlockedSkills: [],
      completedQuests: [],
      getSkillProgress: jest.fn().mockReturnValue(null),
      getActiveQuest: jest.fn().mockReturnValue(null),
      getAvailableQuests: jest.fn().mockReturnValue([]),
    } as unknown as SkillTreeStore,
    matrixStore: {
      nodes: [],
      edges: [],
      syncTerminalContext: jest.fn(),
      processDirectorResponse: jest.fn(),
    } as unknown as MatrixStore,
    callAI: jest.fn().mockResolvedValue('AI response'),
    setIsProcessing: jest.fn(),
    clearSession: jest.fn(),
    setCommandHistory: jest.fn(),
    setHistoryIndex: jest.fn(),
    setInput: jest.fn(),
    ...overrides,
  });

  let mockContext: CommandContext;

  beforeEach(() => {
    mockContext = createMockContext();
    jest.clearAllMocks();
  });

  describe('handleHelp', () => {
    it('should display help text and return exit code 0', () => {
      const result = handleHelp(mockContext);

      expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('APEX OS'));
      expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('AI ASSISTANCE'));
      expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('NAVIGATION'));
      expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('PLAYER STATUS'));
      expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('CHALLENGES'));
      expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('UTILITIES'));
      expect(result).toBe('[exit 0]');
    });

    it('should include all command categories in help text', () => {
      handleHelp(mockContext);
      const helpText = (mockContext.addLine as jest.Mock).mock.calls[0][1];

      expect(helpText).toContain('ask');
      expect(helpText).toContain('code');
      expect(helpText).toContain('explain');
      expect(helpText).toContain('debug');
      expect(helpText).toContain('cd');
      expect(helpText).toContain('ls');
      expect(helpText).toContain('pwd');
      expect(helpText).toContain('map');
      expect(helpText).toContain('status');
      expect(helpText).toContain('inventory');
      expect(helpText).toContain('quests');
      expect(helpText).toContain('solve');
      expect(helpText).toContain('submit');
      expect(helpText).toContain('abandon');
      expect(helpText).toContain('help');
      expect(helpText).toContain('clear');
      expect(helpText).toContain('vibe');
    });
  });

  describe('handleClear', () => {
    it('should clear session and return exit code 0', () => {
      const result = handleClear(mockContext);

      expect(mockContext.clearSession).toHaveBeenCalled();
      expect(result).toBe('[exit 0]');
    });

    it('should not call addLine', () => {
      handleClear(mockContext);
      expect(mockContext.addLine).not.toHaveBeenCalled();
    });
  });

  describe('handleVibe', () => {
    it('should display a random quote and return exit code 0', () => {
      const result = handleVibe(mockContext);

      expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringMatching(/✦ ".*"/));
      expect(result).toBe('[exit 0]');
    });

    it('should display one of the predefined quotes', () => {
      handleVibe(mockContext);
      const quoteText = (mockContext.addLine as jest.Mock).mock.calls[0][1];

      const expectedQuotes = [
        "The vibe coder doesn't fight the current - they become the current.",
        'Speed is a feature. Ship fast, learn faster.',
        "The best code is the code you don't write.",
        'In the age of AI, taste becomes the ultimate skill.',
        "We don't write code anymore. We conduct symphonies of intent.",
        'Perfect is the enemy of deployed.',
        "You're not learning to code - you're learning to shape reality.",
      ];

      const hasValidQuote = expectedQuotes.some((quote) => quoteText.includes(quote));
      expect(hasValidQuote).toBe(true);
    });

    it('should format quote with proper indentation', () => {
      handleVibe(mockContext);
      const quoteText = (mockContext.addLine as jest.Mock).mock.calls[0][1];

      expect(quoteText).toMatch(/^\n  ✦ ".*"\n$/);
    });
  });

  describe('AI Commands', () => {
    describe('handleAsk', () => {
      it('should validate empty arguments and return error', async () => {
        const result = await handleAsk(mockContext, []);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Usage: ask <question>', 1);
        expect(mockContext.addLine).toHaveBeenCalledWith('error', expect.any(String));
        expect(result).toBe('[exit 1]');
      });

      it('should validate whitespace-only arguments and return error', async () => {
        const result = await handleAsk(mockContext, ['   ', '']);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Usage: ask <question>', 1);
        expect(result).toBe('[exit 1]');
      });

      it('should call AI with question and display response', async () => {
        mockContext.callAI = jest.fn().mockResolvedValue('This is the answer');

        const result = await handleAsk(mockContext, ['What', 'is', 'TypeScript?']);

        expect(mockContext.setIsProcessing).toHaveBeenCalledWith(true);
        expect(mockContext.callAI).toHaveBeenCalledWith('What is TypeScript?');
        expect(mockContext.setIsProcessing).toHaveBeenCalledWith(false);
        expect(CLIFormatter.convertMarkdownToCLI).toHaveBeenCalledWith('This is the answer');
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.any(String));
        expect(result).toBe('[exit 0]');
      });

      it('should handle AI call errors gracefully', async () => {
        mockContext.callAI = jest.fn().mockRejectedValue(new Error('Network error'));

        const result = await handleAsk(mockContext, ['Hello']);

        expect(mockContext.setIsProcessing).toHaveBeenCalledWith(false);
        expect(CLIFormatter.formatError).toHaveBeenCalledWith('AI request failed: Network error', 1);
        expect(mockContext.addLine).toHaveBeenCalledWith('error', expect.any(String));
        expect(result).toBe('[exit 1]');
      });

      it('should handle non-Error exceptions', async () => {
        mockContext.callAI = jest.fn().mockRejectedValue('String error');

        const result = await handleAsk(mockContext, ['Hello']);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('AI request failed: Unknown error', 1);
        expect(result).toBe('[exit 1]');
      });
    });

    describe('handleCode', () => {
      it('should validate empty arguments and return error', async () => {
        const result = await handleCode(mockContext, []);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Usage: code <description>', 1);
        expect(result).toBe('[exit 1]');
      });

      it('should call AI with code generation prompt', async () => {
        mockContext.callAI = jest.fn().mockResolvedValue('```typescript\nconst x = 1;\n```');

        const result = await handleCode(mockContext, ['Create', 'a', 'counter']);

        expect(mockContext.callAI).toHaveBeenCalledWith('Generate code for: Create a counter');
        expect(CLIFormatter.convertMarkdownToCLI).toHaveBeenCalledWith('```typescript\nconst x = 1;\n```');
        expect(result).toBe('[exit 0]');
      });

      it('should handle AI errors', async () => {
        mockContext.callAI = jest.fn().mockRejectedValue(new Error('API limit exceeded'));

        const result = await handleCode(mockContext, ['test']);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Code generation failed: API limit exceeded', 1);
        expect(result).toBe('[exit 1]');
      });
    });

    describe('handleExplain', () => {
      it('should validate empty arguments and return error', async () => {
        const result = await handleExplain(mockContext, []);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Usage: explain <topic>', 1);
        expect(result).toBe('[exit 1]');
      });

      it('should call AI with explanation prompt', async () => {
        mockContext.callAI = jest.fn().mockResolvedValue('React is a library...');

        const result = await handleExplain(mockContext, ['React', 'hooks']);

        expect(mockContext.callAI).toHaveBeenCalledWith('Explain: React hooks');
        expect(result).toBe('[exit 0]');
      });

      it('should handle AI errors', async () => {
        mockContext.callAI = jest.fn().mockRejectedValue(new Error('Timeout'));

        const result = await handleExplain(mockContext, ['topic']);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Explanation failed: Timeout', 1);
        expect(result).toBe('[exit 1]');
      });
    });

    describe('handleDebug', () => {
      it('should validate empty arguments and return error', async () => {
        const result = await handleDebug(mockContext, []);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Usage: debug <error>', 1);
        expect(result).toBe('[exit 1]');
      });

      it('should call AI with debug prompt', async () => {
        mockContext.callAI = jest.fn().mockResolvedValue('The error is caused by...');

        const result = await handleDebug(mockContext, ['TypeError:', 'Cannot', 'read', 'property']);

        expect(mockContext.callAI).toHaveBeenCalledWith('Debug: TypeError: Cannot read property');
        expect(result).toBe('[exit 0]');
      });

      it('should handle AI errors', async () => {
        mockContext.callAI = jest.fn().mockRejectedValue(new Error('Service unavailable'));

        const result = await handleDebug(mockContext, ['error']);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Debug request failed: Service unavailable', 1);
        expect(result).toBe('[exit 1]');
      });
    });
  });

  describe('Navigation Commands', () => {
    describe('handleCd', () => {
      it('should validate missing node ID and return error', () => {
        const result = handleCd(mockContext, []);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Usage: cd <node-id>', 1);
        expect(mockContext.addLine).toHaveBeenCalledWith('error', expect.any(String));
        expect(result).toBe('[exit 1]');
      });

      it('should navigate successfully to valid node', () => {
        mockContext.gameEngine.navigateTo = jest.fn().mockReturnValue(true);
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue({
          id: '1',
          data: { label: 'Node 1', type: 'skill', status: 'active' },
        } as MatrixNode);

        const result = handleCd(mockContext, ['1']);

        expect(mockContext.gameEngine.navigateTo).toHaveBeenCalledWith('1');
        expect(CLIFormatter.formatSuccess).toHaveBeenCalledWith('Navigated to: Node 1', 0);
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.any(String));
        expect(result).toBe('[exit 0]');
      });

      it('should handle failed navigation', () => {
        mockContext.gameEngine.navigateTo = jest.fn().mockReturnValue(false);

        const result = handleCd(mockContext, ['999']);

        expect(mockContext.gameEngine.navigateTo).toHaveBeenCalledWith('999');
        expect(CLIFormatter.formatError).toHaveBeenCalledWith(
          'Failed to navigate to 999. Node not found or not adjacent.',
          1
        );
        expect(mockContext.addLine).toHaveBeenCalledWith('error', expect.any(String));
        expect(result).toBe('[exit 1]');
      });

      it('should use node ID as fallback when node has no label', () => {
        mockContext.gameEngine.navigateTo = jest.fn().mockReturnValue(true);
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue({
          id: '5',
          data: { type: 'skill', status: 'active' },
        } as MatrixNode);

        handleCd(mockContext, ['5']);

        expect(CLIFormatter.formatSuccess).toHaveBeenCalledWith('Navigated to: 5', 0);
      });

      it('should handle multiple args by using first one', () => {
        mockContext.gameEngine.navigateTo = jest.fn().mockReturnValue(true);

        handleCd(mockContext, ['3', 'extra', 'args']);

        expect(mockContext.gameEngine.navigateTo).toHaveBeenCalledWith('3');
      });
    });

    describe('handleLs', () => {
      it('should list adjacent nodes', () => {
        const mockNodes = [
          { id: '1', data: { label: 'Node 1', type: 'skill', status: 'active' } },
          { id: '2', data: { label: 'Node 2', type: 'quest', status: 'locked' } },
        ] as MatrixNode[];

        mockContext.gameEngine.getAdjacentNodes = jest.fn().mockReturnValue(mockNodes);

        const result = handleLs(mockContext);

        expect(mockContext.gameEngine.getAdjacentNodes).toHaveBeenCalled();
        expect(CLIFormatter.formatNodeList).toHaveBeenCalledWith([
          { id: '1', label: 'Node 1', type: 'skill', status: 'active', distance: 1 },
          { id: '2', label: 'Node 2', type: 'quest', status: 'locked', distance: 1 },
        ]);
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.any(String));
        expect(result).toBe('[exit 0]');
      });

      it('should handle empty adjacent nodes', () => {
        mockContext.gameEngine.getAdjacentNodes = jest.fn().mockReturnValue([]);

        const result = handleLs(mockContext);

        expect(CLIFormatter.formatNodeList).toHaveBeenCalledWith([]);
        expect(result).toBe('[exit 0]');
      });
    });

    describe('handlePwd', () => {
      it('should display current position with path history', () => {
        mockContext.gameEngine.position = {
          currentNodeId: '3',
          previousNodeId: '2',
          pathHistory: ['0', '1', '2', '3'],
        };
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue({
          id: '3',
          data: { label: 'Current Node', type: 'skill', status: 'active' },
        } as MatrixNode);

        const result = handlePwd(mockContext);

        expect(mockContext.gameEngine.getCurrentNode).toHaveBeenCalled();
        expect(mockContext.addLine).toHaveBeenCalledWith(
          'system',
          expect.stringContaining('Current Node: Current Node [3]')
        );
        expect(mockContext.addLine).toHaveBeenCalledWith(
          'system',
          expect.stringContaining('Path: 0 → 1 → 2 → 3')
        );
        expect(result).toBe('[exit 0]');
      });

      it('should handle unknown current node', () => {
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue(null);

        const result = handlePwd(mockContext);

        expect(mockContext.addLine).toHaveBeenCalledWith(
          'system',
          expect.stringContaining('Current Node: Unknown')
        );
        expect(result).toBe('[exit 0]');
      });
    });

    describe('handleMap', () => {
      it('should display ASCII map with current node and adjacent nodes', () => {
        const mockCurrentNode = {
          id: '0',
          data: { label: 'Root', type: 'root', status: 'active' },
        } as MatrixNode;

        const mockAdjacentNodes = [
          { id: '1', data: { label: 'Node 1', type: 'skill', status: 'active' } },
          { id: '2', data: { label: 'Node 2', type: 'quest', status: 'locked' } },
        ] as MatrixNode[];

        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue(mockCurrentNode);
        mockContext.gameEngine.getAdjacentNodes = jest.fn().mockReturnValue(mockAdjacentNodes);

        const result = handleMap(mockContext);

        expect(mockContext.gameEngine.getCurrentNode).toHaveBeenCalled();
        expect(mockContext.gameEngine.getAdjacentNodes).toHaveBeenCalled();
        expect(CLIFormatter.formatAsciiMap).toHaveBeenCalledWith('Root', [
          { id: '1', label: 'Node 1' },
          { id: '2', label: 'Node 2' },
        ]);
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.any(String));
        expect(result).toBe('[exit 0]');
      });

      it('should handle null current node', () => {
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue(null);
        mockContext.gameEngine.getAdjacentNodes = jest.fn().mockReturnValue([]);

        const result = handleMap(mockContext);

        expect(CLIFormatter.formatAsciiMap).toHaveBeenCalledWith('Unknown', []);
        expect(result).toBe('[exit 0]');
      });
    });
  });

  describe('Status Commands', () => {
    describe('handleStatus', () => {
      it('should display player stats', () => {
        const mockStats = {
          xp: 500,
          gold: 250,
          level: 3,
          completedQuests: 5,
          unlockedSkills: 2,
          nodesCompleted: 8,
        };
        mockContext.gameEngine.getPlayerStats = jest.fn().mockReturnValue(mockStats);

        const result = handleStatus(mockContext);

        expect(mockContext.gameEngine.getPlayerStats).toHaveBeenCalled();
        expect(CLIFormatter.formatPlayerStats).toHaveBeenCalledWith(mockStats);
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.any(String));
        expect(result).toBe('[exit 0]');
      });
    });

    describe('handleInventory', () => {
      it('should display unlocked skills with progress', () => {
        mockContext.skillTree.unlockedSkills = ['typescript', 'react', 'node'];
        mockContext.skillTree.getSkillProgress = jest.fn().mockImplementation((skillId: string) => ({
          skillId,
          progress: skillId === 'typescript' ? 100 : skillId === 'react' ? 75 : 50,
          unlockedAt: '2024-01-01',
          lastUpdated: '2024-01-15',
        }));

        const result = handleInventory(mockContext);

        expect(mockContext.skillTree.getSkillProgress).toHaveBeenCalledWith('typescript');
        expect(mockContext.skillTree.getSkillProgress).toHaveBeenCalledWith('react');
        expect(mockContext.skillTree.getSkillProgress).toHaveBeenCalledWith('node');
        expect(CLIFormatter.formatSkillsList).toHaveBeenCalledWith([
          { id: 'typescript', name: 'typescript', progress: 100 },
          { id: 'react', name: 'react', progress: 75 },
          { id: 'node', name: 'node', progress: 50 },
        ]);
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.any(String));
        expect(result).toBe('[exit 0]');
      });

      it('should handle skills with no progress data', () => {
        mockContext.skillTree.unlockedSkills = ['unknown-skill'];
        mockContext.skillTree.getSkillProgress = jest.fn().mockReturnValue(null);

        handleInventory(mockContext);

        expect(CLIFormatter.formatSkillsList).toHaveBeenCalledWith([
          { id: 'unknown-skill', name: 'unknown-skill', progress: 0 },
        ]);
      });

      it('should handle empty skills list', () => {
        mockContext.skillTree.unlockedSkills = [];

        handleInventory(mockContext);

        expect(CLIFormatter.formatSkillsList).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('handleQuests', () => {
    it('should display available and active quests', () => {
      const mockAvailableQuests: Quest[] = [
        {
          id: 'quest-1',
          title: 'First Quest',
          description: 'Do something',
          difficulty: 'easy',
          xpReward: 100,
          goldReward: 50,
          narrative: 'Start here',
        },
        {
          id: 'quest-2',
          title: 'Second Quest',
          description: 'Do more',
          difficulty: 'medium',
          xpReward: 200,
          goldReward: 100,
          narrative: 'Continue here',
        },
      ];

      const mockActiveQuest: Quest = {
        id: 'active-quest',
        title: 'Active Quest',
        description: 'Currently doing',
        difficulty: 'hard',
        xpReward: 300,
        goldReward: 150,
        narrative: 'In progress',
      };

      mockContext.skillTree.getAvailableQuests = jest.fn().mockReturnValue(mockAvailableQuests);
      mockContext.skillTree.getActiveQuest = jest.fn().mockReturnValue(mockActiveQuest);
      mockContext.skillTree.completedQuests = ['completed-1'];

      const result = handleQuests(mockContext);

      expect(mockContext.skillTree.getAvailableQuests).toHaveBeenCalled();
      expect(mockContext.skillTree.getActiveQuest).toHaveBeenCalled();
      expect(CLIFormatter.formatQuestList).toHaveBeenCalledWith([
        {
          id: 'quest-1',
          title: 'First Quest',
          difficulty: 'easy',
          status: 'available',
          xpReward: 100,
        },
        {
          id: 'quest-2',
          title: 'Second Quest',
          difficulty: 'medium',
          status: 'available',
          xpReward: 200,
        },
        {
          id: 'active-quest',
          title: 'Active Quest',
          difficulty: 'hard',
          status: 'active',
          xpReward: 300,
        },
      ]);
      expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('Completed Quests: 1'));
      expect(result).toBe('[exit 0]');
    });

    it('should handle no active quest', () => {
      mockContext.skillTree.getAvailableQuests = jest.fn().mockReturnValue([]);
      mockContext.skillTree.getActiveQuest = jest.fn().mockReturnValue(null);
      mockContext.skillTree.completedQuests = [];

      const result = handleQuests(mockContext);

      expect(CLIFormatter.formatQuestList).toHaveBeenCalledWith([]);
      expect(mockContext.addLine).toHaveBeenCalledTimes(1);
      expect(result).toBe('[exit 0]');
    });

    it('should handle no completed quests', () => {
      mockContext.skillTree.getAvailableQuests = jest.fn().mockReturnValue([]);
      mockContext.skillTree.getActiveQuest = jest.fn().mockReturnValue(null);
      mockContext.skillTree.completedQuests = [];

      handleQuests(mockContext);

      // Should only call addLine once for the quest list
      expect(mockContext.addLine).toHaveBeenCalledTimes(1);
    });
  });

  describe('Challenge Commands', () => {
    describe('handleSolve', () => {
      it('should return error when no current node', () => {
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue(null);

        const result = handleSolve(mockContext);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('No current node', 1);
        expect(mockContext.addLine).toHaveBeenCalledWith('error', expect.any(String));
        expect(result).toBe('[exit 1]');
      });

      it('should return error when no quest available at node', () => {
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue({
          id: '999',
          data: { label: 'Unknown Node', type: 'skill', status: 'active' },
        } as MatrixNode);

        const result = handleSolve(mockContext);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('No challenge available at this node', 1);
        expect(result).toBe('[exit 1]');
      });

      it('should start challenge successfully at node 0', () => {
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue({
          id: '0',
          data: { label: 'Root', type: 'root', status: 'active' },
        } as MatrixNode);
        mockContext.gameEngine.startChallenge = jest.fn().mockReturnValue(true);

        const result = handleSolve(mockContext);

        expect(mockContext.gameEngine.startChallenge).toHaveBeenCalledWith('0', 'main-01');
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('CHALLENGE INITIATED'));
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('First Steps'));
        expect(result).toBe('[exit 0]');
      });

      it('should start challenge successfully at node 1', () => {
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue({
          id: '1',
          data: { label: 'Node 1', type: 'skill', status: 'active' },
        } as MatrixNode);
        mockContext.gameEngine.startChallenge = jest.fn().mockReturnValue(true);

        const result = handleSolve(mockContext);

        expect(mockContext.gameEngine.startChallenge).toHaveBeenCalledWith('1', 'main-03');
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('Debug Master'));
        expect(result).toBe('[exit 0]');
      });

      it('should start challenge successfully at node 2', () => {
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue({
          id: '2',
          data: { label: 'Node 2', type: 'skill', status: 'active' },
        } as MatrixNode);
        mockContext.gameEngine.startChallenge = jest.fn().mockReturnValue(true);

        const result = handleSolve(mockContext);

        expect(mockContext.gameEngine.startChallenge).toHaveBeenCalledWith('2', 'main-02');
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('Code Warrior'));
        expect(result).toBe('[exit 0]');
      });

      it('should start challenge successfully at node 3', () => {
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue({
          id: '3',
          data: { label: 'Node 3', type: 'skill', status: 'active' },
        } as MatrixNode);
        mockContext.gameEngine.startChallenge = jest.fn().mockReturnValue(true);

        const result = handleSolve(mockContext);

        expect(mockContext.gameEngine.startChallenge).toHaveBeenCalledWith('3', 'main-06');
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.stringContaining('Final Challenge'));
        expect(result).toBe('[exit 0]');
      });

      it('should handle failed challenge start', () => {
        mockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue({
          id: '0',
          data: { label: 'Root', type: 'root', status: 'active' },
        } as MatrixNode);
        mockContext.gameEngine.startChallenge = jest.fn().mockReturnValue(false);

        const result = handleSolve(mockContext);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Failed to start challenge', 1);
        expect(result).toBe('[exit 1]');
      });
    });

    describe('handleSubmit', () => {
      it('should validate empty code and return error', async () => {
        const result = await handleSubmit(mockContext, []);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Usage: submit <code>', 1);
        expect(result).toBe('[exit 1]');
      });

      it('should validate whitespace-only code and return error', async () => {
        const result = await handleSubmit(mockContext, ['   ', '']);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Usage: submit <code>', 1);
        expect(result).toBe('[exit 1]');
      });

      it('should submit solution successfully', async () => {
        mockContext.gameEngine.submitSolution = jest.fn().mockResolvedValue({
          success: true,
          feedback: 'All tests passed!',
        });

        const result = await handleSubmit(mockContext, ['const', 'x', '=', '42;']);

        expect(mockContext.setIsProcessing).toHaveBeenCalledWith(true);
        expect(mockContext.gameEngine.submitSolution).toHaveBeenCalledWith('const x = 42;');
        expect(mockContext.setIsProcessing).toHaveBeenCalledWith(false);
        expect(CLIFormatter.formatSuccess).toHaveBeenCalledWith('✓ CHALLENGE COMPLETED!\nAll tests passed!', 0);
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.any(String));
        expect(result).toBe('[exit 0]');
      });

      it('should handle failed submission', async () => {
        mockContext.gameEngine.submitSolution = jest.fn().mockResolvedValue({
          success: false,
          feedback: 'Test failed: expected 42 but got 0',
        });

        const result = await handleSubmit(mockContext, ['wrong code']);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith(
          '✗ FAILED\nTest failed: expected 42 but got 0',
          1
        );
        expect(mockContext.addLine).toHaveBeenCalledWith('error', expect.any(String));
        expect(result).toBe('[exit 1]');
      });

      it('should handle submission errors', async () => {
        mockContext.gameEngine.submitSolution = jest.fn().mockRejectedValue(new Error('Network timeout'));

        const result = await handleSubmit(mockContext, ['code']);

        expect(mockContext.setIsProcessing).toHaveBeenCalledWith(false);
        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Submission failed: Network timeout', 1);
        expect(result).toBe('[exit 1]');
      });

      it('should handle non-Error exceptions', async () => {
        mockContext.gameEngine.submitSolution = jest.fn().mockRejectedValue('Some error');

        const result = await handleSubmit(mockContext, ['code']);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('Submission failed: Unknown error', 1);
        expect(result).toBe('[exit 1]');
      });
    });

    describe('handleAbandon', () => {
      it('should return error when no active challenge', () => {
        mockContext.gameEngine.activeChallenge = null;

        const result = handleAbandon(mockContext);

        expect(CLIFormatter.formatError).toHaveBeenCalledWith('No active challenge', 1);
        expect(mockContext.addLine).toHaveBeenCalledWith('error', expect.any(String));
        expect(result).toBe('[exit 1]');
      });

      it('should abandon active challenge successfully', () => {
        mockContext.gameEngine.activeChallenge = {
          nodeId: '1',
          questId: 'main-01',
          startedAt: '2024-01-01',
          attempts: 2,
        };

        const result = handleAbandon(mockContext);

        expect(mockContext.gameEngine.abandonChallenge).toHaveBeenCalled();
        expect(CLIFormatter.formatSuccess).toHaveBeenCalledWith('Challenge abandoned', 0);
        expect(mockContext.addLine).toHaveBeenCalledWith('system', expect.any(String));
        expect(result).toBe('[exit 0]');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle all AI commands with special characters in arguments', async () => {
      const specialChars = ['<script>', '&amp;', '"quoted"', "'single'", '`backtick`'];

      mockContext.callAI = jest.fn().mockResolvedValue('Response');

      await handleAsk(mockContext, specialChars);
      expect(mockContext.callAI).toHaveBeenCalledWith(specialChars.join(' '));

      await handleCode(mockContext, specialChars);
      expect(mockContext.callAI).toHaveBeenCalledWith(`Generate code for: ${specialChars.join(' ')}`);

      await handleExplain(mockContext, specialChars);
      expect(mockContext.callAI).toHaveBeenCalledWith(`Explain: ${specialChars.join(' ')}`);

      await handleDebug(mockContext, specialChars);
      expect(mockContext.callAI).toHaveBeenCalledWith(`Debug: ${specialChars.join(' ')}`);
    });

    it('should handle very long arguments', async () => {
      const longArg = 'a'.repeat(1000);

      mockContext.callAI = jest.fn().mockResolvedValue('Response');

      await handleAsk(mockContext, [longArg]);
      expect(mockContext.callAI).toHaveBeenCalledWith(longArg);
    });

    it('should handle unicode characters', async () => {
      const unicodeArgs = ['こんにちは', '🚀', 'ñáéíóú', '中文'];

      mockContext.callAI = jest.fn().mockResolvedValue('Response');

      await handleAsk(mockContext, unicodeArgs);
      expect(mockContext.callAI).toHaveBeenCalledWith(unicodeArgs.join(' '));
    });

    it('should handle navigation with edge case node IDs', () => {
      const edgeCaseIds = ['node-with-dashes', 'node_with_underscores', 'node.with.dots', '123abc'];

      edgeCaseIds.forEach((id) => {
        const localMockContext = createMockContext();
        localMockContext.gameEngine.navigateTo = jest.fn().mockReturnValue(true);
        localMockContext.gameEngine.getCurrentNode = jest.fn().mockReturnValue({
          id,
          data: { label: 'Test', type: 'skill', status: 'active' },
        } as MatrixNode);

        handleCd(localMockContext, [id]);
        expect(localMockContext.gameEngine.navigateTo).toHaveBeenCalledWith(id);
      });
    });

    it('should handle empty node ID as error', () => {
      const result = handleCd(mockContext, ['']);

      expect(CLIFormatter.formatError).toHaveBeenCalledWith('Usage: cd <node-id>', 1);
      expect(result).toBe('[exit 1]');
    });

    it('should handle submit with code containing newlines', async () => {
      const codeWithNewlines = ['function', 'test()', '{', 'return', '42;', '}'];

      mockContext.gameEngine.submitSolution = jest.fn().mockResolvedValue({
        success: true,
        feedback: 'Good!',
      });

      await handleSubmit(mockContext, codeWithNewlines);
      expect(mockContext.gameEngine.submitSolution).toHaveBeenCalledWith(codeWithNewlines.join(' '));
    });
  });
});
