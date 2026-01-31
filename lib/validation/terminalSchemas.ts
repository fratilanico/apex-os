import { z } from 'zod';

// ============================================================================
// Terminal Command Validation Schemas
// Following AGENTS.md Section 16.4 - Input/Output Security Pipeline
// ============================================================================

/**
 * Maximum lengths for input validation
 * Prevents buffer overflow and DoS attacks
 */
export const INPUT_LIMITS = {
  COMMAND_MAX_LENGTH: 100,
  ARGUMENT_MAX_LENGTH: 1000,
  MESSAGE_MAX_LENGTH: 5000,
  HISTORY_MAX_ITEMS: 100,
  SESSION_ID_MAX_LENGTH: 256,
  USER_ID_MAX_LENGTH: 256,
} as const;

/**
 * Valid terminal commands
 * Enum prevents command injection attacks
 */
export const VALID_COMMANDS = [
  'help',
  'clear',
  'ls',
  'cd',
  'pwd',
  'cat',
  'echo',
  'mkdir',
  'rm',
  'cp',
  'mv',
  'touch',
  'whoami',
  'date',
  'version',
  'status',
  'matrix',
  'sync',
  'deploy',
  'logs',
  'config',
  'exit',
  'ai',
  'chat',
] as const;

export type ValidCommand = (typeof VALID_COMMANDS)[number];

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Sanitized string schema
 * Removes potentially dangerous characters and normalizes input
 */
export const sanitizedStringSchema = z
  .string()
  .transform((val) => {
    // Normalize Unicode to NFC form
    let normalized = val.normalize('NFC');
    // Trim whitespace
    normalized = normalized.trim();
    // Remove null bytes and control characters (except newlines and tabs)
    normalized = normalized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    // Remove zero-width characters that could be used for spoofing
    normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, '');
    return normalized;
  });

/**
 * Command schema
 * Validates against known commands only (prevents command injection)
 */
export const commandSchema = sanitizedStringSchema
  .pipe(
    z.string()
      .min(1, 'Command cannot be empty')
      .max(INPUT_LIMITS.COMMAND_MAX_LENGTH, `Command must be ${INPUT_LIMITS.COMMAND_MAX_LENGTH} characters or less`)
      .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, 'Command must start with a letter and contain only alphanumeric characters, underscores, and hyphens')
      .refine(
        (val) => VALID_COMMANDS.includes(val as ValidCommand),
        (val) => ({ message: `Invalid command: "${val}". Type 'help' for available commands.` })
      )
  );

/**
 * Arguments schema
 * Validates command arguments with strict length limits
 */
export const argumentsSchema = sanitizedStringSchema
  .pipe(
    z.string()
      .max(INPUT_LIMITS.ARGUMENT_MAX_LENGTH, `Arguments must be ${INPUT_LIMITS.ARGUMENT_MAX_LENGTH} characters or less`)
      .refine(
        (val) => !val.includes('\x00'),
        'Arguments cannot contain null bytes'
      )
      .refine(
        (val) => !/(?:<script|javascript:|data:|vbscript:|on\w+\s*=)/i.test(val),
        'Arguments contain potentially dangerous content'
      )
  )
  .optional()
  .default('');

/**
 * Session ID schema
 * Validates session identifiers
 */
export const sessionIdSchema = sanitizedStringSchema
  .pipe(
    z.string()
      .min(1, 'Session ID is required')
      .max(INPUT_LIMITS.SESSION_ID_MAX_LENGTH, `Session ID must be ${INPUT_LIMITS.SESSION_ID_MAX_LENGTH} characters or less`)
      .regex(/^[a-zA-Z0-9_-]+$/, 'Session ID must be alphanumeric with underscores and hyphens only')
  );

/**
 * User ID schema
 * Validates user identifiers
 */
export const userIdSchema = sanitizedStringSchema
  .pipe(
    z.string()
      .min(1, 'User ID is required')
      .max(INPUT_LIMITS.USER_ID_MAX_LENGTH, `User ID must be ${INPUT_LIMITS.USER_ID_MAX_LENGTH} characters or less`)
      .regex(/^[a-zA-Z0-9_-]+$/, 'User ID must be alphanumeric with underscores and hyphens only')
  );

// ============================================================================
// Complex Schemas
// ============================================================================

/**
 * Command payload schema
 * Full validation for terminal command execution
 */
export const commandPayloadSchema = z.object({
  command: commandSchema,
  arguments: argumentsSchema,
  sessionId: sessionIdSchema,
  timestamp: z.number().int().positive().optional().default(() => Date.now()),
  metadata: z.object({
    source: z.enum(['terminal', 'api', 'websocket', 'cli']).default('terminal'),
    userAgent: z.string().max(500).optional(),
    ipAddress: z.string().ip().optional(),
  }).optional().default({ source: 'terminal' }),
});

/**
 * AI message schema
 * Validates individual messages in conversation history
 */
export const aiMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system'], {
    errorMap: () => ({ message: 'Message role must be user, assistant, or system' }),
  }),
  content: sanitizedStringSchema
    .pipe(
      z.string()
        .min(1, 'Message content cannot be empty')
        .max(INPUT_LIMITS.MESSAGE_MAX_LENGTH, `Message must be ${INPUT_LIMITS.MESSAGE_MAX_LENGTH} characters or less`)
    ),
  timestamp: z.number().int().positive().optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * AI request schema
 * Validates AI chat/completion requests
 */
export const aiRequestSchema = z.object({
  message: sanitizedStringSchema
    .pipe(
      z.string()
        .min(1, 'Message is required')
        .max(INPUT_LIMITS.MESSAGE_MAX_LENGTH, `Message must be ${INPUT_LIMITS.MESSAGE_MAX_LENGTH} characters or less`)
    ),
  history: z.array(aiMessageSchema)
    .max(INPUT_LIMITS.HISTORY_MAX_ITEMS, `History cannot exceed ${INPUT_LIMITS.HISTORY_MAX_ITEMS} messages`)
    .optional()
    .default([]),
  sessionId: sessionIdSchema,
  userId: userIdSchema.optional(),
  context: z.object({
    currentDirectory: z.string().max(500).optional(),
    activeFiles: z.array(z.string().max(500)).max(100).optional(),
    environment: z.enum(['development', 'staging', 'production']).optional(),
  }).optional(),
  options: z.object({
    temperature: z.number().min(0).max(2).optional().default(0.7),
    maxTokens: z.number().int().min(1).max(4000).optional().default(2000),
    stream: z.boolean().optional().default(false),
  }).optional().default({}),
});

/**
 * Session state schema
 * Validates terminal session state
 */
export const sessionStateSchema = z.object({
  id: sessionIdSchema,
  userId: userIdSchema.optional(),
  createdAt: z.number().int().positive(),
  lastActivityAt: z.number().int().positive(),
  currentDirectory: z.string().max(500).default('/'),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  variables: z.record(z.string().max(1000)).default({}),
  history: z.array(z.object({
    command: z.string(),
    output: z.string().optional(),
    exitCode: z.number().int().min(0).max(255).optional(),
    executedAt: z.number().int().positive(),
  })).max(1000).default([]),
  isActive: z.boolean().default(true),
  metadata: z.object({
    terminalType: z.enum(['xterm', 'vt100', 'ansi']).optional(),
    colorSupport: z.boolean().optional(),
    dimensions: z.object({
      rows: z.number().int().positive(),
      cols: z.number().int().positive(),
    }).optional(),
  }).optional(),
});

/**
 * Terminal output schema
 * Validates command execution output
 */
export const terminalOutputSchema = z.object({
  command: z.string(),
  output: z.string().max(10000).optional(),
  error: z.string().max(5000).optional(),
  exitCode: z.number().int().min(0).max(255),
  executedAt: z.number().int().positive(),
  duration: z.number().nonnegative(),
  metadata: z.object({
    workingDirectory: z.string().optional(),
    user: z.string().optional(),
    pid: z.number().int().positive().optional(),
  }).optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CommandPayload = z.infer<typeof commandPayloadSchema>;
export type AIRequest = z.infer<typeof aiRequestSchema>;
export type AIMessage = z.infer<typeof aiMessageSchema>;
export type SessionState = z.infer<typeof sessionStateSchema>;
export type TerminalOutput = z.infer<typeof terminalOutputSchema>;

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
  errorMessage?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Sanitizes input string by removing dangerous characters
 * Following AGENTS.md Section 16.4 - Input/Output Security Pipeline
 * 
 * @param input - Raw input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Normalize Unicode to NFC form
  sanitized = sanitized.normalize('NFC');

  // Trim leading/trailing whitespace
  sanitized = sanitized.trim();

  // Remove null bytes and control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Remove zero-width characters that could be used for spoofing
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Remove bidirectional override characters (potential spoofing)
  sanitized = sanitized.replace(/[\u202A-\u202E\u2066-\u2069]/g, '');

  // Normalize multiple spaces to single space
  sanitized = sanitized.replace(/\s+/g, ' ');

  return sanitized;
}

/**
 * Validates a terminal command input
 * Returns a structured result object with success status and errors
 * 
 * @param input - Raw command input string
 * @returns ValidationResult with success status and parsed data or errors
 */
export function validateCommand(input: string): ValidationResult<{
  command: ValidCommand;
  arguments: string;
}> {
  try {
    // Sanitize input first
    const sanitized = sanitizeInput(input);

    // Split command and arguments
    const parts = sanitized.split(/\s+/);
    const command = parts[0] || '';
    const args = parts.slice(1).join(' ');

    // Validate command
    const validatedCommand = commandSchema.parse(command);

    // Validate arguments
    const validatedArgs = argumentsSchema.parse(args);

    return {
      success: true,
      data: {
        command: validatedCommand as ValidCommand,
        arguments: validatedArgs,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');

      return {
        success: false,
        errors: error,
        errorMessage,
      };
    }

    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

/**
 * Validates a complete command payload
 * 
 * @param payload - Command payload object
 * @returns ValidationResult with success status
 */
export function validateCommandPayload(payload: unknown): ValidationResult<CommandPayload> {
  try {
    const validated = commandPayloadSchema.parse(payload);
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error,
        errorMessage: formatZodErrors(error),
      };
    }

    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

/**
 * Validates an AI request
 * 
 * @param request - AI request object
 * @returns ValidationResult with success status
 */
export function validateAIRequest(request: unknown): ValidationResult<AIRequest> {
  try {
    const validated = aiRequestSchema.parse(request);
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error,
        errorMessage: formatZodErrors(error),
      };
    }

    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

/**
 * Validates session state
 * 
 * @param state - Session state object
 * @returns ValidationResult with success status
 */
export function validateSessionState(state: unknown): ValidationResult<SessionState> {
  try {
    const validated = sessionStateSchema.parse(state);
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error,
        errorMessage: formatZodErrors(error),
      };
    }

    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

/**
 * Formats Zod validation errors into a human-readable string
 * 
 * @param error - ZodError instance
 * @returns Formatted error message
 */
function formatZodErrors(error: z.ZodError): string {
  return error.errors
    .map((e) => {
      const path = e.path.length > 0 ? e.path.join('.') : 'input';
      return `${path}: ${e.message}`;
    })
    .join('; ');
}

/**
 * Validates that a value is a valid command
 * Type guard function
 * 
 * @param value - Value to check
 * @returns Boolean indicating if value is a valid command
 */
export function isValidCommand(value: string): value is ValidCommand {
  return VALID_COMMANDS.includes(value as ValidCommand);
}

/**
 * Gets list of valid commands
 * 
 * @returns Array of valid command strings
 */
export function getValidCommands(): readonly string[] {
  return VALID_COMMANDS;
}

/**
 * Creates a safe command payload with defaults
 * 
 * @param overrides - Partial payload to override defaults
 * @returns Safe command payload object
 */
export function createSafeCommandPayload(
  overrides: Partial<CommandPayload> = {}
): CommandPayload {
  const defaults: CommandPayload = {
    command: 'help',
    arguments: '',
    sessionId: 'default',
    timestamp: Date.now(),
    metadata: {
      source: 'terminal',
    },
  };

  return { ...defaults, ...overrides };
}

// ============================================================================
// Export all schemas for external use
// ============================================================================

export const terminalSchemas = {
  command: commandSchema,
  arguments: argumentsSchema,
  commandPayload: commandPayloadSchema,
  aiRequest: aiRequestSchema,
  aiMessage: aiMessageSchema,
  sessionState: sessionStateSchema,
  terminalOutput: terminalOutputSchema,
  sessionId: sessionIdSchema,
  userId: userIdSchema,
  sanitizedString: sanitizedStringSchema,
} as const;

export default terminalSchemas;
