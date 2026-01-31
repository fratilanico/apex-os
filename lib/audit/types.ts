/**
 * Audit Event Types
 * 
 * Comprehensive type definitions for audit logging system.
 * Following AGENTS.md Section 16.3 - Audit Logging standards.
 */

/**
 * Actor types that can perform actions
 */
export type AuditActorType = 'user' | 'service' | 'system' | 'anonymous';

/**
 * Authentication methods
 */
export type AuthMethod = 'email' | 'github' | 'google' | 'demo' | 'cli' | 'api_key';

/**
 * Resource types that can be modified
 */
export type ResourceType = 
  | 'user'
  | 'session'
  | 'terminal_command'
  | 'knowledge_source'
  | 'knowledge_chunk'
  | 'agent_learning'
  | 'configuration'
  | 'api_key'
  | 'workflow'
  | 'curriculum'
  | 'achievement'
  | 'npc_interaction';

/**
 * Audit action categories
 */
export type AuditActionCategory = 
  | 'authentication'
  | 'authorization'
  | 'data_modification'
  | 'security'
  | 'system'
  | 'terminal';

/**
 * Specific audit actions
 */
export type AuditAction =
  // Authentication actions
  | 'LOGIN'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED'
  | 'SESSION_CREATED'
  | 'SESSION_REVOKED'
  | 'TOKEN_REFRESHED'
  
  // Authorization actions
  | 'PERMISSION_GRANTED'
  | 'PERMISSION_REVOKED'
  | 'ROLE_CHANGED'
  | 'ACCESS_DENIED'
  | 'ACCESS_DENIED_RATE_LIMIT'
  
  // Data modification actions
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'BULK_CREATE'
  | 'BULK_UPDATE'
  | 'BULK_DELETE'
  
  // Security actions
  | 'API_KEY_GENERATED'
  | 'API_KEY_REVOKED'
  | 'RATE_LIMIT_HIT'
  | 'SUSPICIOUS_ACTIVITY'
  | 'SECURITY_SETTING_CHANGED'
  | 'EXPORT_REQUESTED'
  
  // System actions
  | 'SYSTEM_STARTUP'
  | 'SYSTEM_SHUTDOWN'
  | 'CONFIG_CHANGED'
  | 'BACKUP_CREATED'
  | 'ERROR_OCCURRED'
  
  // Terminal actions
  | 'TERMINAL_COMMAND'
  | 'TERMINAL_COMMAND_ERROR'
  | 'TERMINAL_SESSION_START'
  | 'TERMINAL_SESSION_END'
  | 'AI_MODEL_CALLED'
  | 'AI_MODEL_ERROR';

/**
 * Severity levels for audit events
 */
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Actor information
 */
export interface AuditActor {
  /** Unique identifier of the actor */
  id: string;
  /** Type of actor */
  type: AuditActorType;
  /** Authentication method used */
  authMethod?: AuthMethod;
  /** User email or service name */
  email?: string;
  /** User display name */
  name?: string;
  /** IP address of the actor */
  ip?: string;
  /** User agent string */
  userAgent?: string;
}

/**
 * Resource being acted upon
 */
export interface AuditResource {
  /** Type of resource */
  type: ResourceType;
  /** Unique identifier of the resource */
  id: string;
  /** Human-readable name or description */
  name?: string;
  /** Parent resource ID if applicable */
  parentId?: string;
}

/**
 * Change tracking for data modifications
 */
export interface AuditChanges {
  /** Previous state (for UPDATE, DELETE) */
  before?: Record<string, unknown>;
  /** New state (for CREATE, UPDATE) */
  after?: Record<string, unknown>;
  /** Array of changed field names */
  fields?: string[];
  /** Reason for the change */
  reason?: string;
}

/**
 * Terminal-specific metadata
 */
export interface TerminalMetadata {
  /** The command that was executed */
  command: string;
  /** Command arguments/parameters */
  args?: string[];
  /** AI model used (gemini, clawbot, etc.) */
  aiModel?: string;
  /** Response status */
  responseStatus?: 'success' | 'error' | 'blocked';
  /** Response time in milliseconds */
  responseTimeMs?: number;
  /** Token usage if available */
  tokenUsage?: {
    input?: number;
    output?: number;
    total?: number;
  };
  /** Safety flags triggered */
  safetyFlags?: string[];
  /** Session ID */
  sessionId?: string;
}

/**
 * Security-specific metadata
 */
export interface SecurityMetadata {
  /** Type of security event */
  eventType: 'rate_limit' | 'suspicious_ip' | 'failed_auth' | 'permission_violation' | 'data_exfiltration';
  /** Severity of the security event */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Additional details */
  details?: Record<string, unknown>;
  /** Whether the event was blocked/prevented */
  blocked: boolean;
}

/**
 * Authentication-specific metadata
 */
export interface AuthMetadata {
  /** Authentication method used */
  method: AuthMethod;
  /** Whether MFA was used */
  mfaUsed?: boolean;
  /** MFA method if applicable */
  mfaMethod?: 'totp' | 'sms' | 'email' | 'hardware_key';
  /** Session duration in seconds (for logout) */
  sessionDuration?: number;
  /** Failure reason (for failed auth) */
  failureReason?: string;
  /** Number of failed attempts (for rate limiting) */
  failedAttempts?: number;
}

/**
 * Base audit event interface
 */
export interface AuditEvent {
  /** Unique event identifier (UUID) */
  id: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Action category */
  category: AuditActionCategory;
  /** Specific action performed */
  action: AuditAction;
  /** Actor who performed the action */
  actor: AuditActor;
  /** Resource being acted upon */
  resource: AuditResource;
  /** Changes made (for data modifications) */
  changes?: AuditChanges;
  /** Event severity */
  severity: AuditSeverity;
  /** Correlation ID for request tracing */
  correlationId: string;
  /** Service name */
  service: string;
  /** Environment (dev, staging, prod) */
  environment: string;
  /** Human-readable message */
  message: string;
  /** Additional context/metadata */
  metadata?: TerminalMetadata | SecurityMetadata | AuthMetadata | Record<string, unknown>;
  /** Client IP address */
  clientIp?: string;
  /** User agent string */
  userAgent?: string;
  /** Geolocation data (if available) */
  geolocation?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

/**
 * Audit event for terminal commands
 */
export interface TerminalAuditEvent extends AuditEvent {
  category: 'terminal';
  action: 'TERMINAL_COMMAND' | 'TERMINAL_COMMAND_ERROR' | 'TERMINAL_SESSION_START' | 'TERMINAL_SESSION_END' | 'AI_MODEL_CALLED' | 'AI_MODEL_ERROR';
  metadata: TerminalMetadata;
}

/**
 * Audit event for authentication
 */
export interface AuthAuditEvent extends AuditEvent {
  category: 'authentication';
  action: 'LOGIN' | 'LOGIN_FAILURE' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'PASSWORD_RESET' | 'MFA_ENABLED' | 'MFA_DISABLED' | 'SESSION_CREATED' | 'SESSION_REVOKED' | 'TOKEN_REFRESHED';
  metadata: AuthMetadata;
}

/**
 * Audit event for security incidents
 */
export interface SecurityAuditEvent extends AuditEvent {
  category: 'security';
  action: 'RATE_LIMIT_HIT' | 'SUSPICIOUS_ACTIVITY' | 'API_KEY_REVOKED' | 'SECURITY_SETTING_CHANGED' | 'ACCESS_DENIED_RATE_LIMIT';
  metadata: SecurityMetadata;
}

/**
 * Storage configuration for audit logs
 */
export interface AuditStorageConfig {
  /** Hot storage duration in days (fast access) */
  hotStorageDays: number;
  /** Cold storage duration in days (archival) */
  coldStorageDays: number;
  /** Maximum log retention in days */
  maxRetentionDays: number;
  /** Whether to compress cold storage */
  compressColdStorage: boolean;
}

/**
 * Export configuration for external systems
 */
export interface AuditExportConfig {
  /** Enable export to external systems */
  enabled: boolean;
  /** Export targets */
  targets: {
    /** SIEM integration (e.g., Splunk, Datadog) */
    siem?: {
      enabled: boolean;
      endpoint: string;
      apiKey: string;
    };
    /** Webhook for real-time notifications */
    webhook?: {
      enabled: boolean;
      url: string;
      headers: Record<string, string>;
    };
    /** Cloud storage (S3, GCS, etc.) */
    cloudStorage?: {
      enabled: boolean;
      provider: 's3' | 'gcs' | 'azure';
      bucket: string;
      prefix: string;
    };
  };
  /** Export batch size */
  batchSize: number;
  /** Export interval in seconds */
  exportIntervalSeconds: number;
}

/**
 * Audit logger configuration
 */
export interface AuditLoggerConfig {
  /** Service name */
  service: string;
  /** Environment */
  environment: string;
  /** Storage configuration */
  storage: AuditStorageConfig;
  /** Export configuration */
  export: AuditExportConfig;
  /** Sampling rate (0-1, 1 = 100%) */
  samplingRate: number;
  /** Minimum severity to log */
  minSeverity: AuditSeverity;
  /** Whether to log to console (for debugging) */
  consoleLogging: boolean;
}

/**
 * Query parameters for audit log retrieval
 */
export interface AuditQueryParams {
  /** Start date (ISO 8601) */
  startDate?: string;
  /** End date (ISO 8601) */
  endDate?: string;
  /** Actor ID filter */
  actorId?: string;
  /** Action filter */
  action?: AuditAction;
  /** Category filter */
  category?: AuditActionCategory;
  /** Resource type filter */
  resourceType?: ResourceType;
  /** Resource ID filter */
  resourceId?: string;
  /** Severity filter */
  severity?: AuditSeverity;
  /** Correlation ID filter */
  correlationId?: string;
  /** Maximum results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Audit log query result
 */
export interface AuditQueryResult {
  /** Matching events */
  events: AuditEvent[];
  /** Total count (for pagination) */
  total: number;
  /** Query parameters used */
  params: AuditQueryParams;
  /** Whether results are from hot or cold storage */
  storageTier: 'hot' | 'cold';
}

/**
 * Critical actions that trigger immediate alerts
 */
export const CRITICAL_ACTIONS: AuditAction[] = [
  'LOGIN_FAILURE',
  'ACCESS_DENIED',
  'ACCESS_DENIED_RATE_LIMIT',
  'RATE_LIMIT_HIT',
  'SUSPICIOUS_ACTIVITY',
  'API_KEY_REVOKED',
  'SECURITY_SETTING_CHANGED',
  'EXPORT_REQUESTED',
  'BULK_DELETE',
];

/**
 * Actions that require before/after change tracking
 */
export const DATA_MODIFICATION_ACTIONS: AuditAction[] = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'BULK_CREATE',
  'BULK_UPDATE',
  'BULK_DELETE',
  'PASSWORD_CHANGE',
  'ROLE_CHANGED',
  'PERMISSION_GRANTED',
  'PERMISSION_REVOKED',
];

/**
 * Default retention configuration
 * 90 days hot storage, 7 years cold storage
 */
export const DEFAULT_RETENTION_CONFIG: AuditStorageConfig = {
  hotStorageDays: 90,
  coldStorageDays: 2555, // 7 years
  maxRetentionDays: 2555,
  compressColdStorage: true,
};
