/**
 * ClawBot WebSocket Client
 * Handles connection to Clawdbot Gateway
 */

import type { 
  ClawBotMessage, 
  ClawBotGatewayMessage,
  ClawBotConnectionStatus,
  ClawBotToolExecution
} from '../types/clawbot';

export type MessageHandler = (message: ClawBotMessage) => void;
export type StatusHandler = (status: ClawBotConnectionStatus) => void;
export type ToolHandler = (execution: ClawBotToolExecution) => void;
export type ErrorHandler = (error: Error) => void;

export class ClawBotClient {
  private ws: WebSocket | null = null;
  private readonly wsUrl: string;
  private readonly token: string;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectInterval = 3000;
  private isIntentionalDisconnect = false;
  
  // Event handlers
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private toolHandlers: Set<ToolHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  
  constructor(wsUrl: string, token: string) {
    this.wsUrl = wsUrl;
    this.token = token;
  }
  
  /**
   * Connect to ClawBot Gateway
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isIntentionalDisconnect = false;
        const url = `${this.wsUrl}?token=${this.token}`;
        
        console.log('[ClawBot] Connecting to:', this.wsUrl);
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
          console.log('[ClawBot] Connected successfully');
          this.reconnectAttempts = 0;
          this.notifyStatus({
            connected: true,
            reconnecting: false,
            reconnectAttempts: 0
          });
          resolve();
        };
        
        this.ws.onerror = (error) => {
          console.error('[ClawBot] WebSocket error:', error);
          const err = new Error('ClawBot connection failed');
          this.notifyError(err);
          reject(err);
        };
        
        this.ws.onclose = (event) => {
          console.log('[ClawBot] Disconnected:', event.code, event.reason);
          this.ws = null;
          
          this.notifyStatus({
            connected: false,
            reconnecting: false,
            lastError: event.reason || 'Connection closed',
            reconnectAttempts: this.reconnectAttempts
          });
          
          // Auto-reconnect if not intentional
          if (!this.isIntentionalDisconnect) {
            this.scheduleReconnect();
          }
        };
        
        this.ws.onmessage = (event) => {
          try {
            const data: ClawBotGatewayMessage = JSON.parse(event.data);
            this.handleIncomingMessage(data);
          } catch (error) {
            console.error('[ClawBot] Failed to parse message:', error);
          }
        };
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }
  
  /**
   * Send a message to ClawBot
   */
  sendMessage(content: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('ClawBot not connected. Please wait for connection.');
    }
    
    const message: ClawBotGatewayMessage = {
      type: 'message',
      content,
      timestamp: Date.now()
    };
    
    console.log('[ClawBot] Sending message:', content.substring(0, 50) + '...');
    this.ws.send(JSON.stringify(message));
  }
  
  /**
   * Disconnect from ClawBot
   */
  disconnect(): void {
    console.log('[ClawBot] Disconnecting...');
    this.isIntentionalDisconnect = true;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.notifyStatus({
      connected: false,
      reconnecting: false,
      reconnectAttempts: 0
    });
  }
  
  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
  
  /**
   * Register message handler
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }
  
  /**
   * Register status change handler
   */
  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }
  
  /**
   * Register tool execution handler
   */
  onToolExecution(handler: ToolHandler): () => void {
    this.toolHandlers.add(handler);
    return () => this.toolHandlers.delete(handler);
  }
  
  /**
   * Register error handler
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }
  
  /**
   * Handle incoming messages from ClawBot Gateway
   */
  private handleIncomingMessage(data: ClawBotGatewayMessage): void {
    switch (data.type) {
      case 'message':
        if (data.content) {
          const message: ClawBotMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.content,
            timestamp: data.timestamp || Date.now(),
            metadata: data.data
          };
          this.notifyMessage(message);
        }
        break;
        
      case 'stream':
        // Handle streaming responses
        if (data.content) {
          const message: ClawBotMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.content,
            timestamp: Date.now(),
            metadata: { ...data.data, isStreaming: true }
          };
          this.notifyMessage(message);
        }
        break;
        
      case 'tool_use':
        if (data.data) {
          this.notifyToolExecution(data.data as ClawBotToolExecution);
        }
        break;
        
      case 'error':
        const error = new Error(data.content || 'Unknown ClawBot error');
        this.notifyError(error);
        break;
        
      case 'status':
        console.log('[ClawBot] Status update:', data.data);
        break;
        
      default:
        console.warn('[ClawBot] Unknown message type:', data.type);
    }
  }
  
  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[ClawBot] Max reconnect attempts reached');
      this.notifyStatus({
        connected: false,
        reconnecting: false,
        lastError: 'Max reconnection attempts reached',
        reconnectAttempts: this.reconnectAttempts
      });
      return;
    }
    
    this.reconnectAttempts++;
    
    this.notifyStatus({
      connected: false,
      reconnecting: true,
      reconnectAttempts: this.reconnectAttempts
    });
    
    console.log(
      `[ClawBot] Reconnecting in ${this.reconnectInterval}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch((error) => {
        console.error('[ClawBot] Reconnection failed:', error);
      });
    }, this.reconnectInterval);
  }
  
  /**
   * Notify message handlers
   */
  private notifyMessage(message: ClawBotMessage): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('[ClawBot] Message handler error:', error);
      }
    });
  }
  
  /**
   * Notify status handlers
   */
  private notifyStatus(status: ClawBotConnectionStatus): void {
    this.statusHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('[ClawBot] Status handler error:', error);
      }
    });
  }
  
  /**
   * Notify tool execution handlers
   */
  private notifyToolExecution(execution: ClawBotToolExecution): void {
    this.toolHandlers.forEach(handler => {
      try {
        handler(execution);
      } catch (error) {
        console.error('[ClawBot] Tool handler error:', error);
      }
    });
  }
  
  /**
   * Notify error handlers
   */
  private notifyError(error: Error): void {
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (err) {
        console.error('[ClawBot] Error handler error:', err);
      }
    });
  }
}
