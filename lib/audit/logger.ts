/**
 * Audit Logger
 * 
 * Production-grade audit logging system following AGENTS.md Section 16.3.
 * Provides structured logging with correlation IDs, retention policies,
 * and export capabilities to external systems.
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  AuditEvent,
  AuditActor,
  AuditResource,
  AuditChanges,
  AuditAction,
  AuditActionCategory,
  AuditSeverity,
  TerminalMetadata,
  SecurityMetadata,
  AuthMetadata,
  AuditLoggerConfig,
  AuditStorageConfig,
  AuditExportConfig,
  AuditQueryParams,
  AuditQueryResult,
  ResourceType,
  CRITICAL_ACTIONS,
  DATA_MODIFICATION_ACTIONS,
  DEFAULT_RETENTION_CONFIG,
} from './types';

// Re-export types for convenience
export * from './types';

/**
 * In-memory buffer for batching audit events
 */
interface AuditBuffer {
  events: AuditEvent[];
  lastFlush: number;
}

/**
 * Alert callback for critical events
 */
type AlertCallback = (event: AuditEvent) => void | Promise<void>;

/**
 * Storage adapter interface
 */
interface StorageAdapter {
  append(event: AuditEvent): Promise<void>;
  query(params: AuditQueryParams): Promise<AuditQueryResult>;
  flush(): Promise<void>;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: AuditLoggerConfig = {
  service: 'vibe-portfolio',
  environment: process.env.NODE_ENV || 'development',
  storage: DEFAULT_RETENTION_CONFIG,
  export: {
    enabled: false,
    targets: {},
    batchSize: 100,
    exportIntervalSeconds: 300, // 5 minutes
  },
  samplingRate: 1.0,
  minSeverity: 'info',
  consoleLogging: process.env.NODE_ENV === 'development',
};

/**
 * Audit Logger Class
 * 
 * Singleton pattern for centralized audit logging across the application.
 */
export class AuditLogger {
  private static instance: AuditLogger | null = null;
  private config: AuditLoggerConfig;
  private buffer: AuditBuffer;
  private alertCallbacks: AlertCallback[] = [];
  private storageAdapter: StorageAdapter | null = null;
  private exportInterval: NodeJS.Timeout | null = null;
  private correlationId: string | null = null;

  /**
   * Private constructor - use getInstance()
   */
  private constructor(config: Partial<AuditLoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.buffer = {
      events: [],
      lastFlush: Date.now(),
    };

    // Set up automatic export if enabled
    if (this.config.export.enabled) {
      this.startExportInterval();
    }
  }

  /**
   * Get or create the singleton instance
   */
  public static getInstance(config?: Partial<AuditLoggerConfig>): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger(config);
    }
    return AuditLogger.instance;
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static resetInstance(): void {
    if (AuditLogger.instance) {
      AuditLogger.instance.destroy();
    }
    AuditLogger.instance = null;
  }

  /**
   * Set the storage adapter
   */
  public setStorageAdapter(adapter: StorageAdapter): void {
    this.storageAdapter = adapter;
  }

  /**
   * Set the correlation ID for the current context
   */
  public setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
  }

  /**
   * Get the current correlation ID
   */
  public getCorrelationId(): string {
    return this.correlationId || uuidv4();
  }

  /**
   * Clear the correlation ID
   */
  public clearCorrelationId(): void {
    this.correlationId = null;
  }

  /**
   * Register an alert callback for critical events
   */
  public onCriticalEvent(callback: AlertCallback): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Remove an alert callback
   */
  public offCriticalEvent(callback: AlertCallback): void {
    const index = this.alertCallbacks.indexOf(callback);
    if (index > -1) {
      this.alertCallbacks.splice(index, 1);
    }
  }

  /**
   * Log a terminal command execution
   */
  public async logTerminalCommand(
    actor: Omit<AuditActor, 'ip' | 'userAgent'>,
    command: string,
    metadata: Omit<TerminalMetadata, 'command'>,
    options: {
      severity?: AuditSeverity;
      clientIp?: string;
      userAgent?: string;
    } = {}
  ): Promise<void> {
    const event = this.createEvent({
      category: 'terminal',
      action: metadata.responseStatus === 'error' ? 'TERMINAL_COMMAND_ERROR' : 'TERMINAL_COMMAND',
      actor: {
        ...actor,
        ip: options.clientIp,
        userAgent: options.userAgent,
      },
      resource: {
        type: 'terminal_command',
        id: uuidv4(),
        name: command.slice(0, 100), // Truncate long commands
      },
      severity: options.severity || (metadata.responseStatus === 'error' ? 'error' : 'info'),
      message: `Terminal command executed: ${command.slice(0, 100)}`,
      metadata: {
        command,
        ...metadata,
      } as TerminalMetadata,
      clientIp: options.clientIp,
      userAgent: options.userAgent,
    });

    await this.log(event);
  }

  /**
   * Log an authentication event
   */
  public async logAuth(
    action: 'LOGIN' | 'LOGIN_FAILURE' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'SESSION_CREATED' | 'SESSION_REVOKED',
    actor: Omit<AuditActor, 'ip' | 'userAgent'>,
    metadata: AuthMetadata,
    options: {
      severity?: AuditSeverity;
      clientIp?: string;
      userAgent?: string;
    } = {}
  ): Promise<void> {
    const severity = options.severity || this.getAuthSeverity(action, metadata);
    
    const event = this.createEvent({
      category: 'authentication',
      action,
      actor: {
        ...actor,
        ip: options.clientIp,
        userAgent: options.userAgent,
      },
      resource: {
        type: 'user',
        id: actor.id,
        name: actor.email || actor.name,
      },
      severity,
      message: this.getAuthMessage(action, actor, metadata),
      metadata,
      clientIp: options.clientIp,
      userAgent: options.userAgent,
    });

    await this.log(event);
  }

  /**
   * Log a data modification event
   */
  public async logDataModification(
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'BULK_CREATE' | 'BULK_UPDATE' | 'BULK_DELETE',
    actor: Omit<AuditActor, 'ip' | 'userAgent'>,
    resource: AuditResource,
    changes: AuditChanges,
    options: {
      severity?: AuditSeverity;
      clientIp?: string;
      userAgent?: string;
      message?: string;
    } = {}
  ): Promise<void> {
    const event = this.createEvent({
      category: 'data_modification',
      action,
      actor: {
        ...actor,
        ip: options.clientIp,
        userAgent: options.userAgent,
      },
      resource,
      changes,
      severity: options.severity || 'info',
      message: options.message || `${action} operation on ${resource.type}:${resource.id}`,
      clientIp: options.clientIp,
      userAgent: options.userAgent,
    });

    await this.log(event);
  }

  /**
   * Log a security event
   */
  public async logSecurity(
    action: 'RATE_LIMIT_HIT' | 'SUSPICIOUS_ACTIVITY' | 'API_KEY_REVOKED' | 'SECURITY_SETTING_CHANGED' | 'ACCESS_DENIED_RATE_LIMIT',
    actor: Omit<AuditActor, 'ip' | 'userAgent'>,
    metadata: SecurityMetadata,
    options: {
      clientIp?: string;
      userAgent?: string;
    } = {}
  ): Promise<void> {
    const event = this.createEvent({
      category: 'security',
      action,
      actor: {
        ...actor,
        ip: options.clientIp,
        userAgent: options.userAgent,
      },
      resource: {
        type: 'user',
        id: actor.id,
      },
      severity: this.getSecuritySeverity(metadata.severity),
      message: `Security event: ${metadata.eventType}`,
      metadata,
      clientIp: options.clientIp,
      userAgent: options.userAgent,
    });

    await this.log(event);
  }

  /**
   * Log a generic event
   */
  public async logEvent(
    category: AuditActionCategory,
    action: AuditAction,
    actor: Omit<AuditActor, 'ip' | 'userAgent'>,
    resource: AuditResource,
    options: {
      severity?: AuditSeverity;
      changes?: AuditChanges;
      metadata?: Record<string, unknown>;
      message?: string;
      clientIp?: string;
      userAgent?: string;
    } = {}
  ): Promise<void> {
    const event = this.createEvent({
      category,
      action,
      actor: {
        ...actor,
        ip: options.clientIp,
        userAgent: options.userAgent,
      },
      resource,
      changes: options.changes,
      severity: options.severity || 'info',
      message: options.message || `${action} on ${resource.type}:${resource.id}`,
      metadata: options.metadata,
      clientIp: options.clientIp,
      userAgent: options.userAgent,
    });

    await this.log(event);
  }

  /**
   * Query audit logs
   */
  public async query(params: AuditQueryParams): Promise<AuditQueryResult> {
    if (!this.storageAdapter) {
      throw new Error('No storage adapter configured');
    }

    return this.storageAdapter.query(params);
  }

  /**
   * Flush the buffer to storage
   */
  public async flush(): Promise<void> {
    if (this.buffer.events.length === 0) {
      return;
    }

    const eventsToFlush = [...this.buffer.events];
    this.buffer.events = [];
    this.buffer.lastFlush = Date.now();

    try {
      // Write to storage adapter if configured
      if (this.storageAdapter) {
        for (const event of eventsToFlush) {
          await this.storageAdapter.append(event);
        }
      }

      // Export to external systems if enabled
      if (this.config.export.enabled) {
        await this.exportEvents(eventsToFlush);
      }

      // Console logging for development
      if (this.config.consoleLogging) {
        for (const event of eventsToFlush) {
          console.log('[AUDIT]', JSON.stringify(event));
        }
      }
    } catch (error) {
      // Put events back in buffer on failure
      this.buffer.events.unshift(...eventsToFlush);
      console.error('[AuditLogger] Failed to flush events:', error);
      throw error;
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.exportInterval) {
      clearInterval(this.exportInterval);
      this.exportInterval = null;
    }

    // Flush remaining events
    this.flush().catch((error) => {
      console.error('[AuditLogger] Failed to flush on destroy:', error);
    });
  }

  /**
   * Create an audit event
   */
  private createEvent(partial: Omit<AuditEvent, 'id' | 'timestamp' | 'correlationId' | 'service' | 'environment'>): AuditEvent {
    return {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      correlationId: this.getCorrelationId(),
      service: this.config.service,
      environment: this.config.environment,
      ...partial,
    };
  }

  /**
   * Log an event to the buffer
   */
  private async log(event: AuditEvent): Promise<void> {
    // Check sampling rate
    if (Math.random() > this.config.samplingRate) {
      return;
    }

    // Check minimum severity
    if (!this.meetsSeverityThreshold(event.severity)) {
      return;
    }

    // Add to buffer
    this.buffer.events.push(event);

    // Check if we need to flush
    if (this.shouldFlush()) {
      await this.flush();
    }

    // Alert on critical events
    if (CRITICAL_ACTIONS.includes(event.action)) {
      await this.alertCriticalEvent(event);
    }
  }

  /**
   * Check if the buffer should be flushed
   */
  private shouldFlush(): boolean {
    const bufferSize = this.buffer.events.length;
    const timeSinceLastFlush = Date.now() - this.buffer.lastFlush;

    // Flush if buffer is full or time threshold reached
    return (
      bufferSize >= this.config.export.batchSize ||
      timeSinceLastFlush >= this.config.export.exportIntervalSeconds * 1000
    );
  }

  /**
   * Check if severity meets the minimum threshold
   */
  private meetsSeverityThreshold(severity: AuditSeverity): boolean {
    const levels: Record<AuditSeverity, number> = {
      info: 0,
      warning: 1,
      error: 2,
      critical: 3,
    };

    return levels[severity] >= levels[this.config.minSeverity];
  }

  /**
   * Get severity for authentication events
   */
  private getAuthSeverity(action: string, metadata: AuthMetadata): AuditSeverity {
    switch (action) {
      case 'LOGIN_FAILURE':
        return metadata.failedAttempts && metadata.failedAttempts > 3 ? 'warning' : 'info';
      case 'PASSWORD_CHANGE':
      case 'MFA_ENABLED':
      case 'MFA_DISABLED':
        return 'info';
      default:
        return 'info';
    }
  }

  /**
   * Get severity for security events
   */
  private getSecuritySeverity(severity: string): AuditSeverity {
    switch (severity) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  }

  /**
   * Get human-readable message for auth events
   */
  private getAuthMessage(action: string, actor: AuditActor, metadata: AuthMetadata): string {
    const actorName = actor.email || actor.name || actor.id;
    
    switch (action) {
      case 'LOGIN':
        return `User ${actorName} logged in via ${metadata.method}`;
      case 'LOGIN_FAILURE':
        return `Failed login attempt for ${actorName} via ${metadata.method}${metadata.failureReason ? `: ${metadata.failureReason}` : ''}`;
      case 'LOGOUT':
        return `User ${actorName} logged out`;
      case 'PASSWORD_CHANGE':
        return `User ${actorName} changed their password`;
      case 'SESSION_CREATED':
        return `New session created for ${actorName}`;
      case 'SESSION_REVOKED':
        return `Session revoked for ${actorName}`;
      default:
        return `Authentication event: ${action}`;
    }
  }

  /**
   * Alert on critical events
   */
  private async alertCriticalEvent(event: AuditEvent): Promise<void> {
    for (const callback of this.alertCallbacks) {
      try {
        await callback(event);
      } catch (error) {
        console.error('[AuditLogger] Alert callback failed:', error);
      }
    }
  }

  /**
   * Start the export interval
   */
  private startExportInterval(): void {
    this.exportInterval = setInterval(() => {
      this.flush().catch((error) => {
        console.error('[AuditLogger] Scheduled flush failed:', error);
      });
    }, this.config.export.exportIntervalSeconds * 1000);
  }

  /**
   * Export events to external systems
   */
  private async exportEvents(events: AuditEvent[]): Promise<void> {
    const { targets } = this.config.export;

    // Export to SIEM
    if (targets.siem?.enabled) {
      await this.exportToSIEM(events, targets.siem);
    }

    // Export to webhook
    if (targets.webhook?.enabled) {
      await this.exportToWebhook(events, targets.webhook);
    }

    // Export to cloud storage
    if (targets.cloudStorage?.enabled) {
      await this.exportToCloudStorage(events, targets.cloudStorage);
    }
  }

  /**
   * Export events to SIEM
   */
  private async exportToSIEM(
    events: AuditEvent[],
    config: { endpoint: string; apiKey: string }
  ): Promise<void> {
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        throw new Error(`SIEM export failed: ${response.status}`);
      }
    } catch (error) {
      console.error('[AuditLogger] SIEM export failed:', error);
      // Don't throw - we don't want to block the main flow
    }
  }

  /**
   * Export events to webhook
   */
  private async exportToWebhook(
    events: AuditEvent[],
    config: { url: string; headers: Record<string, string> }
  ): Promise<void> {
    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        throw new Error(`Webhook export failed: ${response.status}`);
      }
    } catch (error) {
      console.error('[AuditLogger] Webhook export failed:', error);
    }
  }

  /**
   * Export events to cloud storage
   */
  private async exportToCloudStorage(
    events: AuditEvent[],
    config: { provider: 's3' | 'gcs' | 'azure'; bucket: string; prefix: string }
  ): Promise<void> {
    // This would be implemented based on the cloud provider
    // For now, just log that it would happen
    console.log(`[AuditLogger] Would export ${events.length} events to ${config.provider}://${config.bucket}/${config.prefix}`);
  }
}

/**
 * Convenience function to get the audit logger instance
 */
export function getAuditLogger(config?: Partial<AuditLoggerConfig>): AuditLogger {
  return AuditLogger.getInstance(config);
}

/**
 * Create a child logger with a specific correlation ID
 */
export function createAuditContext(correlationId: string): AuditLogger {
  const logger = AuditLogger.getInstance();
  logger.setCorrelationId(correlationId);
  return logger;
}
