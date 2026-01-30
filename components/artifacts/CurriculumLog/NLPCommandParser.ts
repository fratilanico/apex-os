/**
 * NLPCommandParser - Natural language query parser for CurriculumLog
 * Converts natural language queries into structured search results
 */

import { modules, tools } from '../../../data/curriculumData';
import type { Module, Section, Tool } from '../../../types/curriculum';

export interface NLPSearchResult {
  type: 'section' | 'module' | 'tool' | 'content' | 'help';
  title: string;
  content: string;
  module?: Module;
  section?: Section;
  tool?: Tool;
  relatedSections?: Section[];
  suggestions: string[];
  confidence: number;
}

interface SearchIndexEntry {
  id: string;
  type: 'module' | 'section' | 'tool' | 'content';
  moduleId?: string;
  sectionId?: string;
  title: string;
  content: string;
  keywords: string[];
  tools?: string[];
}

export class NLPCommandParser {
  private searchIndex: SearchIndexEntry[] = [];
  private commonPhrases: Map<string, string[]> = new Map();

  constructor() {
    this.buildSearchIndex();
    this.buildCommonPhrases();
  }

  /**
   * Build a searchable index of all curriculum content
   */
  private buildSearchIndex(): void {
    // Index modules
    modules.forEach(module => {
      this.searchIndex.push({
        id: module.id,
        type: 'module',
        title: module.title,
        content: `${module.title} ${module.subtitle} ${module.objective}`,
        keywords: [
          module.number,
          module.title.toLowerCase(),
          module.subtitle.toLowerCase(),
          ...module.title.toLowerCase().split(' '),
          ...module.subtitle.toLowerCase().split(' '),
          'module',
          'phase',
        ],
      });

      // Index sections
      module.sections.forEach(section => {
        // Extract key content snippets for better matching
        const contentPreview = section.content
          .replace(/[#*`]/g, '')
          .substring(0, 500)
          .toLowerCase();

        this.searchIndex.push({
          id: section.id,
          type: 'section',
          moduleId: module.id,
          sectionId: section.id,
          title: section.title,
          content: `${section.title} ${contentPreview}`,
          keywords: [
            section.id,
            section.title.toLowerCase(),
            ...section.title.toLowerCase().split(' '),
            ...this.extractKeyTerms(section.content),
            'section',
          ],
          tools: section.tools,
        });
      });
    });

    // Index tools
    tools.forEach(tool => {
      this.searchIndex.push({
        id: tool.id,
        type: 'tool',
        title: tool.name,
        content: `${tool.name} ${tool.description} ${tool.category}`,
        keywords: [
          tool.id,
          tool.name.toLowerCase(),
          ...tool.name.toLowerCase().split(' '),
          tool.category.toLowerCase(),
          tool.tier,
          'tool',
        ],
      });
    });
  }

  /**
   * Build map of common query phrases and their mappings
   */
  private buildCommonPhrases(): void {
    this.commonPhrases.set('shift mindset', ['00.1', '00.2', '00.3']);
    this.commonPhrases.set('mindset', ['00.1', '00.2', '00.3']);
    this.commonPhrases.set('three mindsets', ['00.1']);
    this.commonPhrases.set('context window', ['00.2']);
    this.commonPhrases.set('cost quality speed', ['00.3']);
    this.commonPhrases.set('cost-quality-speed', ['00.3']);
    this.commonPhrases.set('triangle', ['00.3']);
    this.commonPhrases.set('cursor', ['cursor', '01.1', '01.4']);
    this.commonPhrases.set('claude', ['claude-code', '01.1']);
    this.commonPhrases.set('gemini', ['gemini', '01.2']);
    this.commonPhrases.set('gpt', ['gpt-5-2', '01.3']);
    this.commonPhrases.set('openai', ['gpt-5-2', 'openai-codex', '01.3']);
    this.commonPhrases.set('debug', ['01.3', '01.4']);
    this.commonPhrases.set('debugging', ['01.3', '01.4']);
    this.commonPhrases.set('notebooklm', ['notebooklm', '01.4', '02.4']);
    this.commonPhrases.set('notebook', ['notebooklm', '01.4', '02.4']);
    this.commonPhrases.set('imagen', ['imagen-3', '01.5']);
    this.commonPhrases.set('veo', ['veo-3-1', '01.5']);
    this.commonPhrases.set('stitch', ['google-stitch', '01.5']);
    this.commonPhrases.set('configuration', ['02.1', '02.2', '02.3', '02.4']);
    this.commonPhrases.set('claude.md', ['02.2']);
    this.commonPhrases.set('cursorrules', ['02.3']);
    this.commonPhrases.set('agents.md', ['02.4']);
    this.commonPhrases.set('orchestration', ['02.4', '03']);
    this.commonPhrases.set('chat prompts', ['02.1']);
    this.commonPhrases.set('prompts', ['02.1']);
    this.commonPhrases.set('environment', ['01']);
    this.commonPhrases.set('setup', ['01']);
    this.commonPhrases.set('install', ['01']);
    this.commonPhrases.set('specifying', ['02']);
    this.commonPhrases.set('synthesis', ['04']);
    this.commonPhrases.set('practicum', ['05']);
  }

  /**
   * Extract key terms from content for indexing
   */
  private extractKeyTerms(content: string): string[] {
    const terms: string[] = [];
    const importantPatterns = [
      /\b\w+ mindset\b/gi,
      /\bcontext window\b/gi,
      /\b\w+ agent\b/gi,
      /\b\w+ orchestration\b/gi,
      /\bClaude\b/gi,
      /\bCursor\b/gi,
      /\bGemini\b/gi,
      /\bGPT\b/gi,
      /\bAPI\b/gi,
      /\bdebug\w*\b/gi,
      /\bconfiguration\b/gi,
      /\bCLAUDE\.md\b/gi,
      /\bAGENTS\.md\b/gi,
    ];

    importantPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        terms.push(...matches.map(m => m.toLowerCase()));
      }
    });

    return [...new Set(terms)];
  }

  /**
   * Parse a natural language query and return relevant results
   */
  parseQuery(query: string): NLPSearchResult | null {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check for help patterns
    if (this.isHelpQuery(normalizedQuery)) {
      return this.createHelpResult();
    }

    // Check for module number patterns
    const moduleMatch = normalizedQuery.match(/(?:module|phase)\s*(\d+)/);
    const moduleNum = moduleMatch?.[1];
    if (moduleNum) {
      const padded = moduleNum.padStart(2, '0');
      const module = modules.find(m => m.number === padded);
      if (module) {
        return this.createModuleResult(module);
      }
    }

    // Check for section patterns
    const sectionMatch = normalizedQuery.match(/(?:section|cat)\s*(\d+\.\d+)/);
    const sectionId = sectionMatch?.[1];
    if (sectionId) {
      const section = this.findSectionById(sectionId);
      if (section) {
        return this.createSectionResult(section.section, section.module);
      }
    }

    // Check for tool queries
    const toolResult = this.findToolByQuery(normalizedQuery);
    if (toolResult) {
      return this.createToolResult(toolResult);
    }

    // Check common phrases
    const phraseResult = this.searchByCommonPhrases(normalizedQuery);
    if (phraseResult) {
      return phraseResult;
    }

    // Fuzzy search through indexed content
    const searchResult = this.fuzzySearch(normalizedQuery);
    if (searchResult) {
      return searchResult;
    }

    // No results found
    return null;
  }

  /**
   * Check if query is asking for help
   */
  private isHelpQuery(query: string): boolean {
    const helpPatterns = [
      'help',
      'what can i ask',
      'what can you do',
      'how do i use',
      'how to use',
      'commands',
      'what questions',
    ];
    return helpPatterns.some(pattern => query.includes(pattern));
  }

  /**
   * Create help result
   */
  private createHelpResult(): NLPSearchResult {
    return {
      type: 'help',
      title: '🤖 Natural Language Help',
      content: `You can ask me naturally about the curriculum:

**About Modules:**
- "What is the shift mindset?"
- "Tell me about module 2"
- "Explain the environment setup"

**About Tools:**
- "How do I use Cursor?"
- "What is Claude Code?"
- "Tell me about Gemini"

**About Concepts:**
- "Explain orchestration"
- "What are context windows?"
- "Tell me about the cost-quality-speed triangle"

**Navigation:**
- "Show me section 01.2"
- "What tools do I need for module 3?"
- "How do I set up debugging?"

**Configuration:**
- "What is CLAUDE.md?"
- "How do I configure Cursor?"
- "Explain AGENTS.md"

Try asking naturally!`,
      suggestions: [
        'What is the shift mindset?',
        'How do I use Cursor?',
        'Tell me about module 1',
        'Explain orchestration',
      ],
      confidence: 1,
    };
  }

  /**
   * Find a section by its ID
   */
  private findSectionById(sectionId: string): { section: Section; module: Module } | null {
    for (const module of modules) {
      const section = module.sections.find(s => s.id === sectionId);
      if (section) {
        return { section, module };
      }
    }
    return null;
  }

  /**
   * Find a tool by query
   */
  private findToolByQuery(query: string): Tool | null {
    const toolKeywords: Record<string, string[]> = {
      'cursor': ['cursor', 'editor', 'ide'],
      'claude-code': ['claude', 'claude code', 'anthropic', 'reasoning'],
      'gemini': ['gemini', 'google', 'multimodal'],
      'gpt-5-2': ['gpt', 'gpt-5', 'gpt-5.2', 'openai', 'debug'],
      'openai-codex': ['codex', 'openai codex', 'cloud'],
      'antigravity': ['antigravity', 'google ide'],
      'codemachine': ['codemachine', 'orchestrator', 'orchestration'],
      'notebooklm': ['notebooklm', 'notebook', 'research'],
      'google-stitch': ['stitch', 'google stitch', 'design', 'ui'],
      'opencode': ['opencode', 'open code', 'open-source'],
      'imagen-3': ['imagen', 'image', 'images'],
      'veo-3-1': ['veo', 'video'],
    };

    for (const [toolId, keywords] of Object.entries(toolKeywords)) {
      if (keywords.some(kw => query.includes(kw))) {
        return tools.find(t => t.id === toolId) || null;
      }
    }

    return null;
  }

  /**
   * Search by common phrases
   */
  private searchByCommonPhrases(query: string): NLPSearchResult | null {
    for (const [phrase, ids] of this.commonPhrases.entries()) {
      if (query.includes(phrase)) {
        // Try to find a section first
        for (const id of ids) {
          const sectionMatch = this.findSectionById(id);
          if (sectionMatch) {
            return this.createSectionResult(sectionMatch.section, sectionMatch.module);
          }
        }

        // Try to find a tool
        const tool = tools.find(t => ids.includes(t.id));
        if (tool) {
          return this.createToolResult(tool);
        }
      }
    }
    return null;
  }

  /**
   * Perform fuzzy search across indexed content
   */
  private fuzzySearch(query: string): NLPSearchResult | null {
    const queryWords = query.split(/\s+/).filter(w => w.length > 2);
    if (queryWords.length === 0) return null;

    let bestMatch: { entry: SearchIndexEntry; score: number } | null = null;

    for (const entry of this.searchIndex) {
      let score = 0;

      // Check title match
      const titleWords = entry.title.toLowerCase().split(/\s+/);
      queryWords.forEach(qw => {
        if (titleWords.some(tw => tw.includes(qw) || qw.includes(tw))) {
          score += 3;
        }
      });

      // Check keyword match
      entry.keywords.forEach(kw => {
        queryWords.forEach(qw => {
          if (kw.includes(qw) || qw.includes(kw)) {
            score += 2;
          }
        });
      });

      // Check content match
      queryWords.forEach(qw => {
        if (entry.content.includes(qw)) {
          score += 1;
        }
      });

      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { entry, score };
      }
    }

    if (bestMatch && bestMatch.score >= 2) {
      const entry = bestMatch.entry;
      
      if (entry.type === 'section' && entry.sectionId) {
        const sectionMatch = this.findSectionById(entry.sectionId);
        if (sectionMatch) {
          return this.createSectionResult(sectionMatch.section, sectionMatch.module);
        }
      } else if (entry.type === 'module') {
        const module = modules.find(m => m.id === entry.id);
        if (module) {
          return this.createModuleResult(module);
        }
      } else if (entry.type === 'tool') {
        const tool = tools.find(t => t.id === entry.id);
        if (tool) {
          return this.createToolResult(tool);
        }
      }
    }

    return null;
  }

  /**
   * Create result for a module
   */
  private createModuleResult(module: Module): NLPSearchResult {
    const sectionList = module.sections.map(s => `  ${s.id}: ${s.title}`).join('\n');
    
    return {
      type: 'module',
      title: `📚 ${module.title}`,
      content: `${module.subtitle}\n\n${module.objective}\n\n**Duration:** ${module.duration}\n**Sections:**\n${sectionList}`,
      module,
      suggestions: module.sections.slice(0, 3).map(s => `Tell me about ${s.title}`),
      confidence: 0.9,
    };
  }

  /**
   * Create result for a section
   */
  private createSectionResult(section: Section, module: Module): NLPSearchResult {
    // Extract a relevant snippet from content
    const contentSnippet = this.extractRelevantSnippet(section.content);
    
    // Find related sections
    const currentIndex = module.sections.findIndex(s => s.id === section.id);
    const relatedSections = module.sections
      .slice(Math.max(0, currentIndex - 1), Math.min(module.sections.length, currentIndex + 2))
      .filter(s => s.id !== section.id);

    const nextSection = module.sections[currentIndex + 1];

    return {
      type: 'section',
      title: `📖 ${section.title}`,
      content: contentSnippet,
      module,
      section,
      relatedSections,
      suggestions: [
        `cat ${section.id}`,
        ...(relatedSections[0] ? [`Tell me about ${relatedSections[0].title}`] : []),
        ...(nextSection ? [`Next: ${nextSection.title}`] : []),
      ],
      confidence: 0.85,
    };
  }

  /**
   * Create result for a tool
   */
  private createToolResult(tool: Tool): NLPSearchResult {
    // Find sections that mention this tool
    const relatedSections: Section[] = [];
    modules.forEach(module => {
      module.sections.forEach(section => {
        if (section.tools?.includes(tool.id)) {
          relatedSections.push(section);
        }
      });
    });

    return {
      type: 'tool',
      title: `🔧 ${tool.name}`,
      content: `${tool.description}\n\n**Category:** ${tool.category}\n**Tier:** ${tool.tier === 'core' ? 'Core Stack' : 'Asset Layer'}`,
      tool,
      relatedSections: relatedSections.slice(0, 3),
      suggestions: relatedSections.slice(0, 2).map(s => `Learn about ${s.title}`),
      confidence: 0.9,
    };
  }

  /**
   * Extract a relevant snippet from section content
   */
  private extractRelevantSnippet(content: string): string {
    // Remove markdown formatting for display
    const cleanContent = content
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    // Get first meaningful paragraph (not just headers)
    const paragraphs = cleanContent.split('\n\n').filter(p => p.trim().length > 50);
    
    const [firstParagraph] = paragraphs;
    if (firstParagraph) {
      return firstParagraph.substring(0, 400) + (firstParagraph.length > 400 ? '...' : '');
    }

    return cleanContent.substring(0, 400) + '...';
  }

  /**
   * Get suggestions for partial queries
   */
  getSuggestions(partialQuery: string): string[] {
    const normalized = partialQuery.toLowerCase().trim();
    if (normalized.length < 2) return [];

    const suggestions: string[] = [];

    // Module suggestions
    modules.forEach(module => {
      if (module.title.toLowerCase().includes(normalized) || 
          module.number.includes(normalized)) {
        suggestions.push(`Tell me about module ${module.number}`);
        suggestions.push(`What is ${module.title}?`);
      }
    });

    // Tool suggestions
    tools.forEach(tool => {
      if (tool.name.toLowerCase().includes(normalized)) {
        suggestions.push(`How do I use ${tool.name}?`);
        suggestions.push(`What is ${tool.name}?`);
      }
    });

    // Concept suggestions
    const concepts = [
      { name: 'shift mindset', query: 'What is the shift mindset?' },
      { name: 'context windows', query: 'What are context windows?' },
      { name: 'orchestration', query: 'Explain orchestration' },
      { name: 'claude.md', query: 'What is CLAUDE.md?' },
      { name: 'cursorrules', query: 'How do I configure Cursor?' },
      { name: 'agents.md', query: 'Explain AGENTS.md' },
    ];

    concepts.forEach(concept => {
      if (concept.name.includes(normalized)) {
        suggestions.push(concept.query);
      }
    });

    return [...new Set(suggestions)].slice(0, 5);
  }
}

export const nlpParser = new NLPCommandParser();
