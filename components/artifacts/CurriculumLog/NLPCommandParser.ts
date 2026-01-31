/**
 * NLPCommandParser - Natural language query parser for CurriculumLog
 * Enhanced with Fuse.js fuzzy matching for better command recognition
 * Features: fuzzy matching, spell correction, synonyms, query history, confidence scoring
 */

import Fuse, { type IFuseOptions } from 'fuse.js';
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
  matchDetails?: {
    matchedTerms: string[];
    score: number;
    fuzzyMatches: string[];
  };
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
  synonyms?: string[];
}

interface QueryHistoryEntry {
  query: string;
  timestamp: number;
  resultType?: string;
}

interface SpellCorrection {
  [key: string]: string;
}

// Spell correction dictionary
const SPELL_CORRECTIONS: SpellCorrection = {
  'modul': 'module',
  'modle': 'module',
  'secton': 'section',
  'sectin': 'section',
  'orchestrtion': 'orchestration',
  'orchestraton': 'orchestration',
  'cursr': 'cursor',
  'curser': 'cursor',
  'shft': 'shift',
  'shif': 'shift',
  'mindst': 'mindset',
  'configration': 'configuration',
  'configuraton': 'configuration',
  'debuging': 'debugging',
  'debuggin': 'debugging',
  'envronment': 'environment',
  'enviroment': 'environment',
  'synhesis': 'synthesis',
  'syntesis': 'synthesis',
  'practicm': 'practicum',
  'practicom': 'practicum',
  'cloude': 'claude',
  'claud': 'claude',
  'gemni': 'gemini',
  'gemin': 'gemini',
  'notebok': 'notebook',
  'notbook': 'notebook',
  'orchestrtor': 'orchestrator',
  'orchestrater': 'orchestrator',
};

// Command synonyms mapping
const COMMAND_SYNONYMS: Record<string, string[]> = {
  'show': ['display', 'view', 'see', 'open', 'load', 'get'],
  'tell': ['explain', 'describe', 'what is', 'how does', 'info about'],
  'find': ['search', 'look for', 'locate', 'where is'],
  'help': ['assist', 'support', 'guide', 'how to', 'how do i'],
  'use': ['utilize', 'work with', 'setup', 'configure'],
  'setup': ['install', 'configure', 'prepare', 'initialize'],
  'learn': ['study', 'understand', 'master', 'explore'],
};

export class NLPCommandParser {
  private searchIndex: SearchIndexEntry[] = [];
  private fuseIndex: Fuse<SearchIndexEntry> | null = null;
  private commonPhrases: Map<string, string[]> = new Map();
  private queryHistory: QueryHistoryEntry[] = [];
  private confidenceThreshold: number = 0.4;
  private maxHistorySize: number = 50;

  constructor() {
    this.buildSearchIndex();
    this.buildFuseIndex();
    this.buildCommonPhrases();
  }

  /**
   * Set confidence threshold for fuzzy matching (0-1, lower = more strict)
   */
  setConfidenceThreshold(threshold: number): void {
    this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
  }

  /**
   * Get current confidence threshold
   */
  getConfidenceThreshold(): number {
    return this.confidenceThreshold;
  }

  /**
   * Build a searchable index of all curriculum content
   */
  private buildSearchIndex(): void {
    // Index modules
    modules.forEach(module => {
      const moduleKeywords = [
        module.number,
        module.title.toLowerCase(),
        module.subtitle.toLowerCase(),
        ...module.title.toLowerCase().split(' '),
        ...module.subtitle.toLowerCase().split(' '),
        'module',
        'phase',
      ];

      this.searchIndex.push({
        id: module.id,
        type: 'module',
        title: module.title,
        content: `${module.title} ${module.subtitle} ${module.objective}`,
        keywords: moduleKeywords,
        synonyms: this.generateSynonyms(module.title),
      });

      // Index sections
      module.sections.forEach(section => {
        const contentPreview = section.content
          .replace(/[#*`]/g, '')
          .substring(0, 500)
          .toLowerCase();

        const sectionKeywords = [
          section.id,
          section.title.toLowerCase(),
          ...section.title.toLowerCase().split(' '),
          ...this.extractKeyTerms(section.content),
          'section',
        ];

        this.searchIndex.push({
          id: section.id,
          type: 'section',
          moduleId: module.id,
          sectionId: section.id,
          title: section.title,
          content: `${section.title} ${contentPreview}`,
          keywords: sectionKeywords,
          tools: section.tools,
          synonyms: this.generateSynonyms(section.title),
        });
      });
    });

    // Index tools
    tools.forEach(tool => {
      const toolKeywords = [
        tool.id,
        tool.name.toLowerCase(),
        ...tool.name.toLowerCase().split(' '),
        tool.category.toLowerCase(),
        tool.tier,
        'tool',
      ];

      this.searchIndex.push({
        id: tool.id,
        type: 'tool',
        title: tool.name,
        content: `${tool.name} ${tool.description} ${tool.category}`,
        keywords: toolKeywords,
        synonyms: this.generateSynonyms(tool.name),
      });
    });
  }

  /**
   * Build Fuse.js searchable index with fuzzy matching
   */
  private buildFuseIndex(): void {
    const fuseOptions: IFuseOptions<SearchIndexEntry> = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'keywords', weight: 0.35 },
        { name: 'content', weight: 0.2 },
        { name: 'synonyms', weight: 0.05 },
      ],
      threshold: this.confidenceThreshold,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      useExtendedSearch: true,
      findAllMatches: true,
    };

    this.fuseIndex = new Fuse(this.searchIndex, fuseOptions);
  }

  /**
   * Generate synonyms for better matching
   */
  private generateSynonyms(text: string): string[] {
    const synonyms: string[] = [];
    const lowerText = text.toLowerCase();

    // Add common variations
    if (lowerText.includes('cursor')) {
      synonyms.push('editor', 'ide', 'code editor');
    }
    if (lowerText.includes('claude')) {
      synonyms.push('anthropic', 'ai assistant', 'claude code');
    }
    if (lowerText.includes('gemini')) {
      synonyms.push('google', 'google ai', 'bard');
    }
    if (lowerText.includes('gpt')) {
      synonyms.push('openai', 'chatgpt', 'gpt-5');
    }
    if (lowerText.includes('debug')) {
      synonyms.push('debugging', 'troubleshoot', 'fix');
    }
    if (lowerText.includes('config')) {
      synonyms.push('configuration', 'setup', 'settings');
    }

    return synonyms;
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
   * Apply spell correction to query
   */
  private correctSpelling(query: string): string {
    const words = query.toLowerCase().split(/\s+/);
    const correctedWords = words.map(word => {
      // Check for exact match in corrections
      if (SPELL_CORRECTIONS[word]) {
        return SPELL_CORRECTIONS[word];
      }

      // Check for partial matches (e.g., "modul" in "modules")
      for (const [misspelled, correct] of Object.entries(SPELL_CORRECTIONS)) {
        if (word.includes(misspelled)) {
          return word.replace(misspelled, correct);
        }
      }

      return word;
    });

    return correctedWords.join(' ');
  }

  /**
   * Expand query with synonyms
   */
  private expandWithSynonyms(query: string): string {
    const words = query.toLowerCase().split(/\s+/);
    const expandedWords = [...words];

    words.forEach(word => {
      for (const [baseWord, synonyms] of Object.entries(COMMAND_SYNONYMS)) {
        if (word === baseWord || synonyms.includes(word)) {
          expandedWords.push(baseWord);
          expandedWords.push(...synonyms);
        }
      }
    });

    return [...new Set(expandedWords)].join(' ');
  }

  /**
   * Add query to history
   */
  private addToHistory(query: string, resultType?: string): void {
    this.queryHistory.unshift({
      query,
      timestamp: Date.now(),
      resultType,
    });

    // Keep only recent queries
    if (this.queryHistory.length > this.maxHistorySize) {
      this.queryHistory = this.queryHistory.slice(0, this.maxHistorySize);
    }
  }

  /**
   * Get query history
   */
  getQueryHistory(): QueryHistoryEntry[] {
    return [...this.queryHistory];
  }

  /**
   * Clear query history
   */
  clearHistory(): void {
    this.queryHistory = [];
  }

  /**
   * Get context-aware suggestions based on history
   */
  getContextAwareSuggestions(currentQuery: string): string[] {
    const normalizedQuery = currentQuery.toLowerCase().trim();
    const suggestions: string[] = [];

    // Check for similar previous queries
    const similarQueries = this.queryHistory
      .filter(h => {
        const similarity = this.calculateSimilarity(normalizedQuery, h.query);
        return similarity > 0.5 && similarity < 1;
      })
      .slice(0, 3);

    similarQueries.forEach(h => {
      suggestions.push(`Did you mean: "${h.query}"?`);
    });

    // Add suggestions based on query patterns
    if (normalizedQuery.includes('module') || normalizedQuery.includes('phase')) {
      suggestions.push('Try: "Show all modules"');
      suggestions.push('Try: "What is module 1 about?"');
    }

    if (normalizedQuery.includes('tool') || normalizedQuery.includes('cursor') || normalizedQuery.includes('claude')) {
      suggestions.push('Try: "List all tools"');
      suggestions.push('Try: "How do I use Cursor?"');
    }

    return suggestions;
  }

  /**
   * Calculate simple similarity between two strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance for fuzzy matching
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;

    // Use two rows instead of full matrix for memory efficiency
    let prevRow: number[] = new Array(m + 1).fill(0);
    let currRow: number[] = new Array(m + 1).fill(0);

    // Initialize first row
    for (let j = 0; j <= m; j++) {
      prevRow[j] = j;
    }

    // Fill the matrix row by row
    for (let i = 1; i <= n; i++) {
      currRow[0] = i;

      for (let j = 1; j <= m; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          const prev = prevRow[j - 1];
          if (prev !== undefined) {
            currRow[j] = prev;
          }
        } else {
          const replaceCost = prevRow[j - 1];
          const insertCost = currRow[j - 1];
          const deleteCost = prevRow[j];
          if (replaceCost !== undefined && insertCost !== undefined && deleteCost !== undefined) {
            currRow[j] = Math.min(
              replaceCost + 1,  // Replace
              insertCost + 1,   // Insert
              deleteCost + 1    // Delete
            );
          }
        }
      }

      // Swap rows
      [prevRow, currRow] = [currRow, prevRow];
    }

    return prevRow[m] ?? 0;
  }

  /**
   * Parse a natural language query and return relevant results
   */
  parseQuery(query: string): NLPSearchResult | null {
    const originalQuery = query;
    let normalizedQuery = query.toLowerCase().trim();

    // Apply spell correction
    const correctedQuery = this.correctSpelling(normalizedQuery);
    if (correctedQuery !== normalizedQuery) {
      normalizedQuery = correctedQuery;
    }

    // Expand with synonyms
    normalizedQuery = this.expandWithSynonyms(normalizedQuery);

    // Check for help patterns
    if (this.isHelpQuery(normalizedQuery)) {
      this.addToHistory(originalQuery, 'help');
      return this.createHelpResult();
    }

    // Check for module number patterns
    const moduleMatch = normalizedQuery.match(/(?:module|phase)\s*(\d+)/);
    const moduleNum = moduleMatch?.[1];
    if (moduleNum) {
      const padded = moduleNum.padStart(2, '0');
      const module = modules.find(m => m.number === padded);
      if (module) {
        this.addToHistory(originalQuery, 'module');
        return this.createModuleResult(module, 1.0);
      }
    }

    // Check for section patterns
    const sectionMatch = normalizedQuery.match(/(?:section|cat)\s*(\d+\.\d+)/);
    const sectionId = sectionMatch?.[1];
    if (sectionId) {
      const section = this.findSectionById(sectionId);
      if (section) {
        this.addToHistory(originalQuery, 'section');
        return this.createSectionResult(section.section, section.module, 1.0);
      }
    }

    // Check for tool queries
    const toolResult = this.findToolByQuery(normalizedQuery);
    if (toolResult) {
      this.addToHistory(originalQuery, 'tool');
      return this.createToolResult(toolResult, 1.0);
    }

    // Check common phrases
    const phraseResult = this.searchByCommonPhrases(normalizedQuery);
    if (phraseResult) {
      this.addToHistory(originalQuery, phraseResult.type);
      return phraseResult;
    }

    // Fuzzy search using Fuse.js
    const fuzzyResult = this.performFuzzySearch(normalizedQuery);
    if (fuzzyResult) {
      this.addToHistory(originalQuery, fuzzyResult.type);
      return fuzzyResult;
    }

    // No results found - add to history anyway
    this.addToHistory(originalQuery);
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

**Fuzzy Matching Features:**
- Typo tolerance (e.g., "cursr" → "cursor")
- Synonym support (e.g., "show", "display", "view")
- Partial matching (e.g., "modul 1" → "module 1")

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
            return this.createSectionResult(sectionMatch.section, sectionMatch.module, 0.95);
          }
        }

        // Try to find a tool
        const tool = tools.find(t => ids.includes(t.id));
        if (tool) {
          return this.createToolResult(tool, 0.95);
        }
      }
    }
    return null;
  }

  /**
   * Perform fuzzy search using Fuse.js
   */
  private performFuzzySearch(query: string): NLPSearchResult | null {
    if (!this.fuseIndex) {
      this.buildFuseIndex();
    }

    const results = this.fuseIndex!.search(query);

    if (results.length === 0) return null;

    const bestMatch = results[0];
    if (!bestMatch) return null;

    const score = bestMatch.score ?? 1;
    const confidence = 1 - score;

    // Check if confidence meets threshold
    if (confidence < (1 - this.confidenceThreshold)) {
      return null;
    }

    const entry = bestMatch.item;
    const matchedTerms = bestMatch.matches?.map(m => m.value).filter((v): v is string => typeof v === 'string') ?? [];

    let result: NLPSearchResult | null = null;

    if (entry.type === 'section' && entry.sectionId) {
      const sectionMatch = this.findSectionById(entry.sectionId);
      if (sectionMatch) {
        result = this.createSectionResult(sectionMatch.section, sectionMatch.module, confidence);
      }
    } else if (entry.type === 'module') {
      const module = modules.find(m => m.id === entry.id);
      if (module) {
        result = this.createModuleResult(module, confidence);
      }
    } else if (entry.type === 'tool') {
      const tool = tools.find(t => t.id === entry.id);
      if (tool) {
        result = this.createToolResult(tool, confidence);
      }
    }

    if (result) {
      result.matchDetails = {
        matchedTerms: [...new Set(matchedTerms)],
        score,
        fuzzyMatches: results.slice(0, 3).map(r => r.item.title),
      };
    }

    return result;
  }

  /**
   * Create result for a module
   */
  private createModuleResult(module: Module, confidence: number = 0.9): NLPSearchResult {
    const sectionList = module.sections.map(s => `  ${s.id}: ${s.title}`).join('\n');

    return {
      type: 'module',
      title: `📚 ${module.title}`,
      content: `${module.subtitle}\n\n${module.objective}\n\n**Duration:** ${module.duration}\n**Sections:**\n${sectionList}`,
      module,
      suggestions: module.sections.slice(0, 3).map(s => `Tell me about ${s.title}`),
      confidence,
    };
  }

  /**
   * Create result for a section
   */
  private createSectionResult(section: Section, module: Module, confidence: number = 0.85): NLPSearchResult {
    // Return full content as requested - no more truncation
    const fullContent = section.content;

    // Find related sections
    const currentIndex = module.sections.findIndex(s => s.id === section.id);
    const relatedSections = module.sections
      .slice(Math.max(0, currentIndex - 1), Math.min(module.sections.length, currentIndex + 2))
      .filter(s => s.id !== section.id);

    const nextSection = module.sections[currentIndex + 1];

    return {
      type: 'section',
      title: `📖 ${section.title}`,
      content: fullContent,
      module,
      section,
      relatedSections,
      suggestions: [
        `cat ${section.id}`,
        ...(relatedSections[0] ? [`Tell me about ${relatedSections[0].title}`] : []),
        ...(nextSection ? [`Next: ${nextSection.title}`] : []),
      ],
      confidence,
    };
  }

  /**
   * Create result for a tool
   */
  private createToolResult(tool: Tool, confidence: number = 0.9): NLPSearchResult {
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
      confidence,
    };
  }

  /**
   * Get suggestions for partial queries
   */
  getSuggestions(partialQuery: string): string[] {
    const normalized = partialQuery.toLowerCase().trim();
    if (normalized.length < 2) return [];

    const suggestions: string[] = [];

    // Use Fuse.js for fuzzy suggestion matching
    if (this.fuseIndex) {
      const results = this.fuseIndex.search(normalized, { limit: 5 });
      results.forEach(result => {
        const item = result.item;
        if (item.type === 'module') {
          suggestions.push(`Tell me about ${item.title}`);
        } else if (item.type === 'section') {
          suggestions.push(`Explain ${item.title}`);
        } else if (item.type === 'tool') {
          suggestions.push(`How do I use ${item.title}?`);
        }
      });
    }

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

  /**
   * Rebuild the search index (useful when data changes)
   */
  rebuildIndex(): void {
    this.searchIndex = [];
    this.buildSearchIndex();
    this.buildFuseIndex();
  }
}

export const nlpParser = new NLPCommandParser();
