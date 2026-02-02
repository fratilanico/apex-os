/**
 * MCP Bridge Client
 * TypeScript client for calling agents through the Vercel MCP bridge
 * Works in both browser and Node.js environments
 */

export interface BridgeConfig {
  bridgeUrl: string;
  apiKey?: string;
  defaultTimeout?: number;
}

export interface BridgeRequest {
  agent: string;
  tool: string;
  args?: Record<string, unknown>;
  async?: boolean;
  callbackUrl?: string;
}

export interface BridgeResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  taskId?: string;
  status?: 'pending' | 'completed' | 'failed';
}

export interface TaskStatus<T = unknown> {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: T;
  error?: string;
  createdAt: number;
  completedAt?: number;
}

export class MCPBridgeClient {
  private config: BridgeConfig;

  constructor(config: BridgeConfig) {
    this.config = {
      defaultTimeout: 25000,
      ...config,
    };
  }

  /**
   * Make a synchronous call to an agent
   */
  async call<T = unknown>(
    agent: string,
    tool: string,
    args?: Record<string, unknown>,
    timeout?: number
  ): Promise<BridgeResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      timeout || this.config.defaultTimeout
    );

    try {
      const response = await fetch(`${this.config.bridgeUrl}/api/mcp/bridge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          agent,
          tool,
          args,
          async: false,
        } as BridgeRequest),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${error}`,
        };
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout',
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Submit an async task to an agent
   */
  async submitTask<T = unknown>(
    agent: string,
    tool: string,
    args?: Record<string, unknown>,
    callbackUrl?: string
  ): Promise<BridgeResponse<T>> {
    const response = await fetch(`${this.config.bridgeUrl}/api/mcp/bridge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify({
        agent,
        tool,
        args,
        async: true,
        callbackUrl,
      } as BridgeRequest),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: `HTTP ${response.status}: ${error}`,
      };
    }

    return await response.json();
  }

  /**
   * Check status of an async task
   */
  async getTaskStatus<T = unknown>(taskId: string): Promise<TaskStatus<T>> {
    const response = await fetch(
      `${this.config.bridgeUrl}/api/mcp/status?taskId=${taskId}`,
      {
        headers: this.config.apiKey
          ? { 'Authorization': `Bearer ${this.config.apiKey}` }
          : undefined,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get task status: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Poll for task completion
   */
  async pollForResult<T = unknown>(
    taskId: string,
    interval: number = 1000,
    maxAttempts: number = 60
  ): Promise<TaskStatus<T>> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getTaskStatus<T>(taskId);
      
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Task ${taskId} did not complete within ${maxAttempts} attempts`);
  }

  /**
   * Submit and wait for async task
   */
  async submitAndWait<T = unknown>(
    agent: string,
    tool: string,
    args?: Record<string, unknown>,
    pollInterval?: number,
    maxAttempts?: number
  ): Promise<BridgeResponse<T>> {
    const submitResult = await this.submitTask<T>(agent, tool, args);
    
    if (!submitResult.success || !submitResult.taskId) {
      return submitResult as BridgeResponse<T>;
    }

    const status = await this.pollForResult<T>(
      submitResult.taskId,
      pollInterval,
      maxAttempts
    );

    return {
      success: status.status === 'completed',
      data: status.result as T,
      error: status.error,
      taskId: submitResult.taskId,
      status: status.status as 'pending' | 'completed' | 'failed',
    };
  }

  /**
   * Check bridge health
   */
  async health(): Promise<{ status: string; agents: string[] }> {
    const response = await fetch(`${this.config.bridgeUrl}/api/mcp/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Convenience methods for common agents

  async orchestrator<T = unknown>(
    tool: string,
    args?: Record<string, unknown>
  ): Promise<BridgeResponse<T>> {
    return this.call<T>('orchestrator', tool, args);
  }

  async security<T = unknown>(
    tool: string,
    args?: Record<string, unknown>
  ): Promise<BridgeResponse<T>> {
    return this.call<T>('security-monitor', tool, args);
  }

  async deploy<T = unknown>(
    tool: string,
    args?: Record<string, unknown>
  ): Promise<BridgeResponse<T>> {
    return this.call<T>('deployment-automation', tool, args);
  }

  async cost<T = unknown>(
    tool: string,
    args?: Record<string, unknown>
  ): Promise<BridgeResponse<T>> {
    return this.call<T>('cost-optimizer', tool, args);
  }
}

// Export singleton instance creator
export function createBridgeClient(config: BridgeConfig): MCPBridgeClient {
  return new MCPBridgeClient(config);
}
