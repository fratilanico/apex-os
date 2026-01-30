import { useCallback } from 'react';
import { getOrCreateUserId } from '../lib/userIdentity';

export function useAnalytics() {
  const track = useCallback((eventType: string, payload?: Record<string, unknown>) => {
    const userId = getOrCreateUserId();
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'event', userId, eventType, payload }),
    }).catch(() => undefined);
  }, []);

  return { track };
}
