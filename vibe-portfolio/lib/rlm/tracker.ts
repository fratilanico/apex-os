/**
 * RLM Interaction Tracker — Implicit feedback collection.
 * Tracks quest interactions automatically without user input.
 */

import type { AgentId } from '../agents/types';

export interface InteractionOutcome {
  sessionId: string;
  userId: string;
  questId?: string;
  agentUsed: AgentId;
  promptHash: string;
  startedAt: number;
  completedAt?: number;
  retryCount: number;
  xpEarned: number;
  goldEarned: number;
  errorOccurred: boolean;
  abandoned: boolean;
  metadata?: Record<string, unknown>;
}

const activeSessions = new Map<string, InteractionOutcome>();

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function startTracking(params: {
  userId: string;
  questId?: string;
  agentUsed: AgentId;
  prompt: string;
}): string {
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  activeSessions.set(sessionId, {
    sessionId,
    userId: params.userId,
    questId: params.questId,
    agentUsed: params.agentUsed,
    promptHash: hashString(params.prompt + params.agentUsed),
    startedAt: Date.now(),
    retryCount: 0,
    xpEarned: 0,
    goldEarned: 0,
    errorOccurred: false,
    abandoned: false,
  });
  return sessionId;
}

export function recordRetry(sessionId: string): void {
  const session = activeSessions.get(sessionId);
  if (session) session.retryCount++;
}

export function recordError(sessionId: string): void {
  const session = activeSessions.get(sessionId);
  if (session) session.errorOccurred = true;
}

export function completeSession(sessionId: string, params: {
  xpEarned?: number;
  goldEarned?: number;
  metadata?: Record<string, unknown>;
}): InteractionOutcome | null {
  const session = activeSessions.get(sessionId);
  if (!session) return null;
  session.completedAt = Date.now();
  session.xpEarned = params.xpEarned || 0;
  session.goldEarned = params.goldEarned || 0;
  session.metadata = params.metadata;
  activeSessions.delete(sessionId);
  return session;
}

export function abandonSession(sessionId: string): InteractionOutcome | null {
  const session = activeSessions.get(sessionId);
  if (!session) return null;
  session.abandoned = true;
  session.completedAt = Date.now();
  activeSessions.delete(sessionId);
  return session;
}

export function calculateSuccessScore(outcome: InteractionOutcome): number {
  if (outcome.abandoned) return 0.1;
  let score = 0.5;
  if (outcome.completedAt) {
    const duration = (outcome.completedAt - outcome.startedAt) / 1000;
    const timeFactor = Math.max(0, 1 - duration / 1800);
    score += timeFactor * 0.2;
  }
  score -= Math.min(outcome.retryCount * 0.1, 0.3);
  if (outcome.errorOccurred) score -= 0.2;
  if (outcome.xpEarned > 0) score += 0.1;
  if (outcome.goldEarned > 0) score += 0.05;
  return Math.max(0, Math.min(1, score));
}

export function getActiveSessions(): string[] {
  return Array.from(activeSessions.keys());
}
