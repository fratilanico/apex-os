/**
 * NLP Command Parser
 * Parses natural language into structured commands for the ecosystem.
 */

export interface NLPResult {
  intent: string;
  confidence: number;
  topic?: string;
  target?: string;
  entities: Array<{ type: string; value: string }>;
  originalInput: string;
}

interface IntentPattern {
  intent: string;
  keywords: string[];
  patterns: RegExp[];
  weight: number;
}

interface EntityPattern {
  type: string;
  patterns: RegExp[];
}

// Intent patterns for keyword matching
const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: 'ask',
    keywords: ['how', 'what', 'why', 'when', 'where', 'who', 'which', '?'],
    patterns: [
      /^how\s+(?:do|can|should|would|will|is|are|does|did)/i,
      /^what\s+(?:is|are|was|were|does|do|did|can|should)/i,
      /^why\s+(?:is|are|do|does|did|can|should)/i,
      /^when\s+(?:is|are|do|does|did|can|should|will)/i,
      /^where\s+(?:is|are|do|does|did|can|should)/i,
      /^who\s+(?:is|are|do|does|did|can|should)/i,
      /^which\s+(?:is|are|do|does|did|can|should)/i,
    ],
    weight: 1.0,
  },
  {
    intent: 'code',
    keywords: ['write', 'create', 'generate', 'build', 'implement', 'code', 'function', 'component', 'class', 'script'],
    patterns: [
      /^(?:write|create|generate|build|implement)\s+(?:a|an|the)?\s*(?:code|function|component|class|script|app|application|program)/i,
      /^(?:write|create|generate|build|implement)\s+(?:me\s+)?(?:a|an|the)?/i,
      /^(?:code|script)\s+(?:for|to|that)/i,
      /\b(?:react|vue|angular|svelte|component|function|class|interface|type)\b.*\b(?:for|to)\b/i,
    ],
    weight: 1.0,
  },
  {
    intent: 'explain',
    keywords: ['explain', 'describe', 'tell', 'clarify', 'elaborate', 'break down', 'walk through'],
    patterns: [
      /^(?:explain|describe|tell\s+me\s+about|clarify|elaborate\s+on)\b/i,
      /^how\s+(?:does|do|is|are|can|should)\s+.*\bwork/i,
      /^(?:what|how)\s+(?:is|are|does|do)\s+(?:the|a|an)?\s*.+\bmean/i,
      /\bhelp\s+me\s+understand\b/i,
    ],
    weight: 1.0,
  },
  {
    intent: 'debug',
    keywords: ['debug', 'fix', 'error', 'bug', 'issue', 'problem', 'broken', 'not working', 'failing', 'crash'],
    patterns: [
      /^(?:debug|fix|solve)\s+(?:this|the|my)?/i,
      /\b(?:error|bug|issue|problem)\s+(?:in|with|on)/i,
      /\b(?:not\s+working|broken|failing|crashing)\b/i,
      /\bgetting\s+(?:an?\s+)?error/i,
      /\bwhy\s+(?:is|are|am\s+I)\s+getting\b/i,
    ],
    weight: 1.0,
  },
  {
    intent: 'navigate',
    keywords: ['show', 'go', 'navigate', 'open', 'view', 'display', 'take me', 'switch', 'change', 'cd'],
    patterns: [
      /^(?:show|go\s+to|navigate\s+to|open|view|display)\s+(?:the|me)?\s*/i,
      /^(?:take\s+me\s+(?:to|into))\b/i,
      /^(?:switch\s+to|change\s+(?:to|into))\b/i,
      /^cd\s+/i,
      /\b(?:module|node|file|page|section)\s+(?:\d+|#)?\s*\d*/i,
    ],
    weight: 1.0,
  },
  {
    intent: 'status',
    keywords: ['status', 'progress', 'update', 'check', 'how far', 'where am i', 'completion', 'done'],
    patterns: [
      /^(?:what'?s?|how'?s?)\s+(?:my|the)?\s*(?:status|progress)/i,
      /^(?:check|show)\s+(?:my|the)?\s*(?:status|progress)/i,
      /\bwhere\s+am\s+I\b/i,
      /\bhow\s+(?:far|much)\s+(?:have|did)\s+I\s+(?:complete|finish|do)/i,
      /\bcompletion\s+(?:status|rate|percentage)/i,
    ],
    weight: 1.0,
  },
  {
    intent: 'help',
    keywords: ['help', 'assist', 'support', 'guide', 'documentation', 'docs', 'tutorial', 'example'],
    patterns: [
      /^(?:help|assist|support)\s*(?:me)?\b/i,
      /\bneed\s+(?:some\s+)?help\b/i,
      /\bhow\s+(?:do|can|should)\s+I\s+(?:use|get\s+started|begin)/i,
      /^(?:show|give)\s+me\s+(?:the|some)?\s*(?:help|docs|documentation|guide|tutorial)/i,
    ],
    weight: 1.0,
  },
];

// Entity extraction patterns
const ENTITY_PATTERNS: EntityPattern[] = [
  // Frameworks/Libraries
  {
    type: 'framework',
    patterns: [
      /\b(React|Vue|Angular|Svelte|Next\.?js|Nuxt|Express|Fastify|Django|Flask|Rails|Laravel|Spring)\b/gi,
    ],
  },
  // Languages
  {
    type: 'language',
    patterns: [
      /\b(TypeScript|JavaScript|Python|Go|Rust|Java|Kotlin|Swift|C\+\+|C#|Ruby|PHP)\b/gi,
    ],
  },
  // Components
  {
    type: 'component',
    patterns: [
      /\b(button|input|form|modal|dialog|card|list|table|navbar|header|footer|sidebar|menu|dropdown|tabs|accordion)\b/gi,
    ],
  },
  // Modules
  {
    type: 'module',
    patterns: [
      /\bmodule\s*(?:#)?\s*(\d+)\b/gi,
      /\bmodule\s+(?:id|number)?\s*:?\s*(\d+)\b/gi,
    ],
  },
  // Nodes
  {
    type: 'node',
    patterns: [
      /\bnode\s*(?:#)?\s*(\d+)\b/gi,
      /\bnode\s+(?:id|number)?\s*:?\s*(\d+)\b/gi,
    ],
  },
  // Files
  {
    type: 'file',
    patterns: [
      /\bfile\s*(?:name)?\s*:?\s*['"]?([\w\-\.]+)['"]?/gi,
      /\b([\w\-]+\.(?:ts|tsx|js|jsx|py|go|rs|java|kt|swift|rb|php|json|yaml|yml|md))\b/gi,
    ],
  },
  // Actions
  {
    type: 'action',
    patterns: [
      /\b(create|make|build|generate|write|add|insert|delete|remove|drop|update|modify|change|edit|show|display|view|open|close|run|execute|start|stop|restart)\b/gi,
    ],
  },
  // Topics (for context)
  {
    type: 'topic',
    patterns: [
      /\b(deployment|deploy|hosting|server|database|db|api|authentication|auth|testing|test|ci\/?cd|pipeline|performance|optimization|security|seo)\b/gi,
    ],
  },
];

// Context boosters - increase confidence based on context
const CONTEXT_BOOSTERS: Record<string, Record<string, number>> = {
  'terminal': {
    'code': 0.1,
    'debug': 0.1,
    'navigate': 0.05,
  },
  'editor': {
    'code': 0.15,
    'debug': 0.1,
  },
  'dashboard': {
    'status': 0.1,
    'navigate': 0.1,
  },
  'module': {
    'explain': 0.1,
    'ask': 0.05,
  },
  'debug': {
    'debug': 0.2,
    'explain': 0.1,
  },
};

/**
 * Normalize input for processing
 */
function normalizeInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.]+$/, ''); // Remove trailing punctuation
}

/**
 * Calculate intent scores based on keyword matching and patterns
 */
function calculateIntentScores(input: string, context?: string): Map<string, number> {
  const lowerInput = input.toLowerCase();
  const scores = new Map<string, number>();

  for (const pattern of INTENT_PATTERNS) {
    let score = 0;

    // Keyword matching
    for (const keyword of pattern.keywords) {
      if (lowerInput.includes(keyword.toLowerCase())) {
        score += 0.2;
      }
    }

    // Pattern matching
    for (const regex of pattern.patterns) {
      if (regex.test(input)) {
        score += 0.4;
      }
    }

    // Apply weight
    score *= pattern.weight;

    // Context boost
    if (context && CONTEXT_BOOSTERS[context]) {
      const boost = CONTEXT_BOOSTERS[context][pattern.intent];
      if (boost) {
        score += boost;
      }
    }

    // Cap at 1.0
    scores.set(pattern.intent, Math.min(1.0, score));
  }

  return scores;
}

/**
 * Extract entities from input
 */
function extractEntities(input: string): Array<{ type: string; value: string }> {
  const entities: Array<{ type: string; value: string }> = [];
  const seen = new Set<string>();

  for (const entityPattern of ENTITY_PATTERNS) {
    for (const pattern of entityPattern.patterns) {
      const matches = input.matchAll(pattern);
      for (const match of matches) {
        const value = match[1] || match[0];
        const key = `${entityPattern.type}:${value.toLowerCase()}`;
        
        if (!seen.has(key)) {
          seen.add(key);
          entities.push({
            type: entityPattern.type,
            value: value.trim(),
          });
        }
      }
    }
  }

  return entities;
}

/**
 * Extract topic from input
 */
function extractTopic(input: string, _intent: string, entities: Array<{ type: string; value: string }>): string | undefined {
  // Remove common question words and intent-specific prefixes
  let topic = normalizeInput(input)
    .replace(/^(how|what|why|when|where|who|which)\s+(do|can|should|would|will|is|are|does|did|to|about|is|are)\s+/i, '')
    .replace(/^(write|create|generate|build|implement|explain|describe|tell me about|debug|fix|show|go to|navigate to|open|check)\s+/i, '')
    .replace(/^(me|the|a|an|my|this|that)\s+/i, '')
    .replace(/\?$/, '')
    .trim();

  // If we have specific entities, use them to refine the topic
  const framework = entities.find(e => e.type === 'framework');
  const component = entities.find(e => e.type === 'component');
  const language = entities.find(e => e.type === 'language');

  if (component && framework) {
    topic = `${framework.value} ${component.value} component`;
  } else if (component) {
    topic = `${component.value} component`;
  } else if (framework) {
    topic = `${framework.value} ${topic}`;
  } else if (language) {
    topic = `${language.value} ${topic}`;
  }

  return topic || undefined;
}

/**
 * Extract target from entities
 */
function extractTarget(entities: Array<{ type: string; value: string }>): string | undefined {
  // Priority: module > node > file > component
  const module = entities.find(e => e.type === 'module');
  if (module) return `module-${module.value}`;

  const node = entities.find(e => e.type === 'node');
  if (node) return `node-${node.value}`;

  const file = entities.find(e => e.type === 'file');
  if (file) return file.value;

  const component = entities.find(e => e.type === 'component');
  if (component) return component.value;

  return undefined;
}

/**
 * Parse natural language input into structured command
 */
export function parseNLP(input: string, context?: string): NLPResult {
  if (!input || input.trim().length === 0) {
    return {
      intent: 'generic',
      confidence: 0,
      entities: [],
      originalInput: input,
    };
  }

  // Calculate intent scores
  const scores = calculateIntentScores(input, context);
  
  // Find best matching intent
  let bestIntent = 'generic';
  let bestScore = 0;

  for (const [intent, score] of scores.entries()) {
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  // Extract entities
  const entities = extractEntities(input);

  // Extract topic and target
  const topic = extractTopic(input, bestIntent, entities);
  const target = extractTarget(entities);

  // If confidence is too low, fall back to generic
  if (bestScore < 0.5) {
    return {
      intent: 'generic',
      confidence: bestScore,
      topic,
      target,
      entities,
      originalInput: input,
    };
  }

  return {
    intent: bestIntent,
    confidence: Math.min(1.0, bestScore),
    topic,
    target,
    entities,
    originalInput: input,
  };
}

// Export types for external use
export type { IntentPattern, EntityPattern };
