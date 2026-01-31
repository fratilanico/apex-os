import { useCallback } from 'react';
import { getOrCreateUserId } from '../lib/userIdentity';

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

export function useAnalytics() {
  const track = useCallback((eventType: string, payload?: Record<string, unknown>) => {
    const userId = getOrCreateUserId();
    
    // Enhanced payload with context
    const enhancedPayload = {
      ...payload,
      url: window.location.href,
      referrer: document.referrer,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      timestamp: new Date().toISOString(),
    };
    
    // Send to API
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'event', userId, eventType, payload: enhancedPayload }),
      keepalive: true,
    }).catch(() => undefined);
    
    // Also store locally for offline analysis
    const events = JSON.parse(localStorage.getItem('apex-analytics') || '[]');
    events.push({ eventType, payload: enhancedPayload, userId });
    localStorage.setItem('apex-analytics', JSON.stringify(events.slice(-100)));
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventType, enhancedPayload);
    }
  }, []);
  
  // Terminal-specific tracking
  const trackEvent = useCallback((eventName: string, data?: EventData) => {
    track(eventName, data);
  }, [track]);

  const trackPageView = useCallback((page: string) => {
    track('page_view', { page });
  }, [track]);

  const trackTerminalCommand = useCallback((command: string, mode: string) => {
    track('terminal_command', { command, mode });
  }, [track]);

  const trackModuleAccess = useCallback((moduleNum: number, tier: string) => {
    track('module_access', { module: moduleNum, tier });
  }, [track]);

  const trackSubscriptionView = useCallback((tier: string) => {
    track('subscription_view', { tier });
  }, [track]);

  const trackConversion = useCallback((tier: string, value: number) => {
    track('subscription_conversion', { tier, value });
  }, [track]);

  return { 
    track,
    trackEvent,
    trackPageView,
    trackTerminalCommand,
    trackModuleAccess,
    trackSubscriptionView,
    trackConversion,
  };
}
