import { useEffect, useState } from 'react';

export interface TerminalHealth {
  status: 'healthy' | 'degraded' | 'disconnected';
  lastPing: number;
  errorCount: number;
  averageResponseTime: number;
  reconnectAttempts: number;
}

class TerminalHealthMonitor {
  private health: TerminalHealth = {
    status: 'healthy',
    lastPing: Date.now(),
    errorCount: 0,
    averageResponseTime: 0,
    reconnectAttempts: 0,
  };
  
  private listeners: Set<(health: TerminalHealth) => void> = new Set();
  private checkInterval?: NodeJS.Timeout;
  
  startMonitoring(interval = 5000) {
    this.checkInterval = setInterval(() => {
      this.checkHealth();
    }, interval);
  }
  
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
  
  recordPing(responseTime: number) {
    this.health.lastPing = Date.now();
    this.health.averageResponseTime = 
      (this.health.averageResponseTime * 0.9) + (responseTime * 0.1);
    this.notifyListeners();
  }
  
  recordError(_error: Error) {
    this.health.errorCount++;
    if (this.health.errorCount > 5) {
      this.health.status = 'degraded';
    }
    this.notifyListeners();
    
    this.attemptRecovery();
  }
  
  private checkHealth() {
    const timeSinceLastPing = Date.now() - this.health.lastPing;
    
    if (timeSinceLastPing > 30000) {
      this.health.status = 'disconnected';
      this.attemptRecovery();
    } else if (this.health.errorCount > 0) {
      this.health.status = 'degraded';
    } else {
      this.health.status = 'healthy';
    }
    
    this.notifyListeners();
  }
  
  private attemptRecovery() {
    if (this.health.reconnectAttempts > 3) {
      console.error('Terminal recovery failed after 3 attempts');
      return;
    }
    
    this.health.reconnectAttempts++;
    window.dispatchEvent(new CustomEvent('terminal:reconnect'));
  }
  
  onHealthChange(callback: (health: TerminalHealth) => void): () => void {
    this.listeners.add(callback);
    return () => { this.listeners.delete(callback); };
  }
  
  private notifyListeners() {
    this.listeners.forEach(cb => cb({ ...this.health }));
  }
  
  getHealth(): TerminalHealth {
    return { ...this.health };
  }
  
  resetErrorCount() {
    this.health.errorCount = 0;
    this.health.reconnectAttempts = 0;
    this.notifyListeners();
  }
}

export const terminalHealth = new TerminalHealthMonitor();

export const HealthIndicator: React.FC = () => {
  const [health, setHealth] = useState<TerminalHealth>(terminalHealth.getHealth());
  
  useEffect(() => {
    const unsubscribe = terminalHealth.onHealthChange(setHealth);
    return () => unsubscribe();
  }, []);
  
  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy': return 'bg-emerald-500';
      case 'degraded': return 'bg-amber-500';
      case 'disconnected': return 'bg-red-500';
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
      <span className="text-xs text-white/60">
        {health.status} · {health.averageResponseTime.toFixed(0)}ms
      </span>
    </div>
  );
};
