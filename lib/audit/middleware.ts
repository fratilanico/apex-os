/**
 * Audit Logging Middleware
 * 
 * Express middleware for automatic audit logging of HTTP requests.
 * Integrates with the audit logging system to track:
 * - All incoming requests
 * - Authentication events
 * - Terminal commands
 * - Security events (rate limiting, access denied)
 * 
 * Following AGENTS.md Section 16.3 standards.
 */

import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuditLogger, getAuditLogger } from './logger';
import type { AuditActor, AuditEvent, AuditSeverity, AuthMetadata, SecurityMetadata } from './types';

// Extend Express Request type to include audit context
declare global {
  namespace Express {
    interface Request {
      auditLogger?: AuditLogger;
      correlationId?: string;
      actor?: AuditActor;
    }
  }
}

/**
 * Middleware options
 */
export interface AuditMiddlewareOptions {
  /** Service name */
  service?: string;
  /** Environment */
  environment?: string;
  /** Paths to exclude from logging */
  excludePaths?: string[];
  /** Paths that require authentication logging */
  authPaths?: string[];
  /** Custom actor extractor */
  getActor?: (req: Request) => AuditActor | undefined;
  /** Custom correlation ID extractor */
  getCorrelationId?: (req: Request) => string | undefined;
  /** Whether to log request bodies */
  logRequestBodies?: boolean;
  /** Fields to redact from request bodies */
  redactFields?: string[];
  /** Whether to log response bodies */
  logResponseBodies?: boolean;
  /** Minimum severity to log */
  minSeverity?: AuditSeverity;
}

/**
 * Default options
 */
const DEFAULT_OPTIONS: AuditMiddlewareOptions = {
  service: 'vibe-portfolio',
  environment: process.env.NODE_ENV || 'development',
  excludePaths: ['/health', '/health/live', '/health/ready', '/favicon.ico'],
  authPaths: ['/api/auth/login', '/api/auth/logout', '/api/auth/register'],
  logRequestBodies: false,
  redactFields: ['password', 'token', 'apiKey', 'secret', 'authorization', 'cookie'],
  logResponseBodies: false,
  minSeverity: 'info',
};

/**
 * Create audit logging middleware
 */
export function auditMiddleware(options: AuditMiddlewareOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const logger = getAuditLogger({
    service: opts.service,
    environment: opts.environment,
    minSeverity: opts.minSeverity,
  });

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip excluded paths
    if (opts.excludePaths?.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Set up correlation ID
    const correlationId = opts.getCorrelationId?.(req) || 
                         req.headers['x-correlation-id'] as string || 
                         uuidv4();
    
    req.correlationId = correlationId;
    logger.setCorrelationId(correlationId);

    // Set up actor
    const actor = opts.getActor?.(req) || extractActorFromRequest(req);
    req.actor = actor;

    // Attach logger to request
    req.auditLogger = logger;

    // Capture request start time
    const startTime = Date.now();

    // Capture response finish
    res.on('finish', async () => {
      const duration = Date.now() - startTime;
      
      try {
        await logRequestResponse(req, res, duration, opts, logger, actor);
      } catch (error) {
        console.error('[AuditMiddleware] Failed to log request:', error);
      }
    });

    next();
  };
}

/**
 * Extract actor information from request
 */
function extractActorFromRequest(req: Request): AuditActor {
  // Try to get user from various sources
  const userId = (req as any).user?.id || 
                 (req as any).userId || 
                 req.headers['x-user-id'] as string ||
                 'anonymous';
  
  const userEmail = (req as any).user?.email || 
                    (req as any).user?.name ||
                    req.headers['x-user-email'] as string;
  
  const authMethod = (req as any).user?.authMethod || 
                     req.headers['x-auth-method'] as string ||
                     'anonymous';

  return {
    id: userId,
    type: userId === 'anonymous' ? 'anonymous' : 'user',
    email: userEmail,
    authMethod: authMethod as any,
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'],
  };
}

/**
 * Get client IP address
 */
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') {
    return realIp;
  }
  
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * Log request and response
 */
async function logRequestResponse(
  req: Request,
  res: Response,
  duration: number,
  opts: AuditMiddlewareOptions,
  logger: AuditLogger,
  actor: AuditActor
): Promise<void> {
  const statusCode = res.statusCode;
  const method = req.method;
  const path = req.path;
  
  // Determine severity based on status code
  let severity: AuditSeverity = 'info';
  if (statusCode >= 500) {
    severity = 'error';
  } else if (statusCode >= 400) {
    severity = 'warning';
  }

  // Check for authentication events
  if (opts.authPaths?.some(authPath => path.includes(authPath))) {
    await logAuthEvent(req, res, actor, logger);
    return;
  }

  // Check for rate limiting
  if (statusCode === 429) {
    await logger.logSecurity(
      'RATE_LIMIT_HIT',
      actor,
      {
        eventType: 'rate_limit',
        severity: 'medium',
        blocked: true,
        details: {
          path,
          method,
        },
      },
      {
        clientIp: actor.ip,
        userAgent: actor.userAgent,
      }
    );
    return;
  }

  // Check for access denied
  if (statusCode === 403) {
    await logger.logSecurity(
      'ACCESS_DENIED',
      actor,
      {
        eventType: 'permission_violation',
        severity: 'high',
        blocked: true,
        details: {
          path,
          method,
        },
      },
      {
        clientIp: actor.ip,
        userAgent: actor.userAgent,
      }
    );
    return;
  }

  // Log as generic request
  const resourceType = path.startsWith('/api/terminal') ? 'terminal_command' : 
                       path.startsWith('/api/knowledge') ? 'knowledge_source' :
                       'session';

  // Prepare metadata
  const metadata: Record<string, unknown> = {
    httpMethod: method,
    path,
    statusCode,
    durationMs: duration,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
  };

  // Add request body if enabled (and redact sensitive fields)
  if (opts.logRequestBodies && req.body) {
    metadata.requestBody = redactSensitiveFields(req.body, opts.redactFields || []);
  }

  await logger.logEvent(
    'system',
    'CREATE',
    actor,
    {
      type: resourceType,
      id: req.correlationId || uuidv4(),
      name: `${method} ${path}`,
    },
    {
      severity,
      metadata,
      message: `${method} ${path} - ${statusCode} (${duration}ms)`,
      clientIp: actor.ip,
      userAgent: actor.userAgent,
    }
  );
}

/**
 * Log authentication events
 */
async function logAuthEvent(
  req: Request,
  res: Response,
  actor: AuditActor,
  logger: AuditLogger
): Promise<void> {
  const path = req.path;
  const method = req.method;
  const statusCode = res.statusCode;

  // Determine auth action
  let action: 'LOGIN' | 'LOGIN_FAILURE' | 'LOGOUT' | 'SESSION_CREATED' | 'SESSION_REVOKED';
  
  if (path.includes('login')) {
    action = statusCode === 200 ? 'LOGIN' : 'LOGIN_FAILURE';
  } else if (path.includes('logout')) {
    action = 'LOGOUT';
  } else if (path.includes('register')) {
    action = 'SESSION_CREATED';
  } else {
    action = 'SESSION_CREATED';
  }

  // Extract auth metadata
  const authMetadata: AuthMetadata = {
    method: (req.body?.authMethod || req.headers['x-auth-method'] || 'email') as any,
    failureReason: statusCode !== 200 ? getStatusMessage(statusCode) : undefined,
  };

  await logger.logAuth(action, actor, authMetadata, {
    severity: action === 'LOGIN_FAILURE' ? 'warning' : 'info',
    clientIp: actor.ip,
    userAgent: actor.userAgent,
  });
}

/**
 * Redact sensitive fields from object
 */
function redactSensitiveFields(obj: Record<string, unknown>, fieldsToRedact: string[]): Record<string, unknown> {
  const redacted = { ...obj };
  
  for (const key of Object.keys(redacted)) {
    const lowerKey = key.toLowerCase();
    if (fieldsToRedact.some(field => lowerKey.includes(field.toLowerCase()))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redactSensitiveFields(redacted[key] as Record<string, unknown>, fieldsToRedact);
    }
  }
  
  return redacted;
}

/**
 * Get status message from code
 */
function getStatusMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    429: 'Rate limited',
    500: 'Internal server error',
    502: 'Bad gateway',
    503: 'Service unavailable',
  };
  
  return messages[statusCode] || `HTTP ${statusCode}`;
}

/**
 * Middleware to log terminal commands specifically
 */
export function terminalAuditMiddleware() {
  const logger = getAuditLogger();

  return async (req: Request, res: Response, next: NextFunction) => {
    // Only process terminal API calls
    if (!req.path.includes('/api/terminal')) {
      return next();
    }

    const startTime = Date.now();
    const actor = req.actor || extractActorFromRequest(req);
    
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json to capture response
    res.json = function(body: any) {
      const duration = Date.now() - startTime;
      
      // Log terminal command asynchronously
      logTerminalCommand(req, res, body, duration, actor, logger).catch((error) => {
        console.error('[TerminalAudit] Failed to log:', error);
      });
      
      // Call original json
      return originalJson(body);
    };

    next();
  };
}

/**
 * Log terminal command
 */
async function logTerminalCommand(
  req: Request,
  res: Response,
  body: any,
  duration: number,
  actor: AuditActor,
  logger: AuditLogger
): Promise<void> {
  const command = req.body?.message || req.body?.command || 'unknown';
  const statusCode = res.statusCode;
  
  let responseStatus: 'success' | 'error' | 'blocked' = 'success';
  if (statusCode >= 500) {
    responseStatus = 'error';
  } else if (statusCode === 400 && body?.error?.includes('safety')) {
    responseStatus = 'blocked';
  } else if (statusCode >= 400) {
    responseStatus = 'error';
  }

  // Extract AI model from response or request
  const aiModel = body?.model || 
                  req.body?.model || 
                  (req.path.includes('vertex') ? 'vertex' : 'gemini');

  await logger.logTerminalCommand(
    actor,
    command,
    {
      aiModel,
      responseStatus,
      responseTimeMs: duration,
      sessionId: req.body?.sessionId || req.headers['x-session-id'] as string,
      tokenUsage: body?.tokenUsage,
      safetyFlags: body?.safetyFlags,
    },
    {
      severity: responseStatus === 'error' ? 'error' : 'info',
      clientIp: actor.ip,
      userAgent: actor.userAgent,
    }
  );
}

/**
 * Middleware to track user sessions
 */
export function sessionAuditMiddleware() {
  const logger = getAuditLogger();
  const activeSessions = new Map<string, { startTime: number; actor: AuditActor }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.headers['x-session-id'] as string || req.cookies?.sessionId;
    
    if (sessionId && !activeSessions.has(sessionId)) {
      const actor = req.actor || extractActorFromRequest(req);
      activeSessions.set(sessionId, { startTime: Date.now(), actor });
      
      // Log session start
      logger.logEvent(
        'authentication',
        'SESSION_CREATED',
        actor,
        {
          type: 'session',
          id: sessionId,
        },
        {
          clientIp: actor.ip,
          userAgent: actor.userAgent,
        }
      ).catch((error) => {
        console.error('[SessionAudit] Failed to log session start:', error);
      });
    }

    // Clean up old sessions periodically (simplified)
    if (activeSessions.size > 1000) {
      const now = Date.now();
      for (const [id, session] of activeSessions.entries()) {
        if (now - session.startTime > 24 * 60 * 60 * 1000) {
          activeSessions.delete(id);
        }
      }
    }

    next();
  };
}

/**
 * Create a rate limit audit hook
 * Call this when rate limit is hit
 */
export async function auditRateLimit(
  req: Request,
  limit: number,
  windowMs: number
): Promise<void> {
  const logger = getAuditLogger();
  const actor = req.actor || extractActorFromRequest(req);

  await logger.logSecurity(
    'RATE_LIMIT_HIT',
    actor,
    {
      eventType: 'rate_limit',
      severity: 'medium',
      blocked: true,
      details: {
        path: req.path,
        method: req.method,
        limit,
        windowMs,
      },
    },
    {
      clientIp: actor.ip,
      userAgent: actor.userAgent,
    }
  );
}

/**
 * Create an access denied audit hook
 * Call this when access is denied
 */
export async function auditAccessDenied(
  req: Request,
  reason: string
): Promise<void> {
  const logger = getAuditLogger();
  const actor = req.actor || extractActorFromRequest(req);

  await logger.logSecurity(
    'ACCESS_DENIED',
    actor,
    {
      eventType: 'permission_violation',
      severity: 'high',
      blocked: true,
      details: {
        path: req.path,
        method: req.method,
        reason,
      },
    },
    {
      clientIp: actor.ip,
      userAgent: actor.userAgent,
    }
  );
}

// Export types
export { AuditLogger, getAuditLogger } from './logger';
export type { AuditMiddlewareOptions };
