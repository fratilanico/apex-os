/**
 * XP Events Configuration
 * 
 * Defines XP rewards for various user actions throughout the portfolio.
 * Used to gamify the user experience and encourage exploration.
 */

/**
 * XP Event type definition
 */
export interface XPEvent {
  /**
   * Unique identifier for the event
   */
  id: string;
  
  /**
   * Human-readable name
   */
  name: string;
  
  /**
   * Description of the action
   */
  description: string;
  
  /**
   * XP amount awarded
   */
  xp: number;
  
  /**
   * Category for grouping
   */
  category: 'engagement' | 'exploration' | 'interaction' | 'achievement';
  
  /**
   * Can this event be triggered multiple times?
   */
  repeatable: boolean;
  
  /**
   * Cooldown period in milliseconds (for repeatable events)
   */
  cooldown?: number;
}

/**
 * All XP events available in the portfolio
 */
export const XP_EVENTS: Record<string, XPEvent> = {
  // Basic Engagement
  LOGIN: {
    id: 'login',
    name: 'Daily Visit',
    description: 'Visit the portfolio',
    xp: 5,
    category: 'engagement',
    repeatable: true,
    cooldown: 24 * 60 * 60 * 1000, // 24 hours
  },

  DAILY_STREAK: {
    id: 'daily_streak',
    name: 'Daily Streak',
    description: 'Visit on consecutive days',
    xp: 20,
    category: 'achievement',
    repeatable: true,
    cooldown: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Exploration
  VISIT_ACADEMY: {
    id: 'visit_academy',
    name: 'Scholar',
    description: 'Explore the Academy section',
    xp: 10,
    category: 'exploration',
    repeatable: false,
  },

  VISIT_PROJECTS: {
    id: 'visit_projects',
    name: 'Inspector',
    description: 'Check out the projects',
    xp: 10,
    category: 'exploration',
    repeatable: false,
  },

  VISIT_ABOUT: {
    id: 'visit_about',
    name: 'Curious',
    description: 'Read the about section',
    xp: 10,
    category: 'exploration',
    repeatable: false,
  },

  VIEW_PROJECT_DETAIL: {
    id: 'view_project_detail',
    name: 'Deep Dive',
    description: 'View a project in detail',
    xp: 15,
    category: 'exploration',
    repeatable: true,
    cooldown: 5 * 60 * 1000, // 5 minutes per project
  },

  // Interaction
  TRY_EASTER_EGG: {
    id: 'try_easter_egg',
    name: 'Easter Egg Hunter',
    description: 'Discover a hidden easter egg',
    xp: 15,
    category: 'interaction',
    repeatable: true,
    cooldown: 60 * 60 * 1000, // 1 hour
  },

  COMPLETE_CONTACT_FORM: {
    id: 'complete_contact_form',
    name: 'Networker',
    description: 'Send a message via contact form',
    xp: 25,
    category: 'interaction',
    repeatable: true,
    cooldown: 24 * 60 * 60 * 1000, // 24 hours
  },

  CLICK_SOCIAL_LINK: {
    id: 'click_social_link',
    name: 'Social Butterfly',
    description: 'Visit a social media profile',
    xp: 5,
    category: 'interaction',
    repeatable: true,
    cooldown: 60 * 60 * 1000, // 1 hour
  },

  DOWNLOAD_RESUME: {
    id: 'download_resume',
    name: 'Recruiter',
    description: 'Download the resume',
    xp: 20,
    category: 'interaction',
    repeatable: true,
    cooldown: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Achievements
  THEME_TOGGLE: {
    id: 'theme_toggle',
    name: 'Style Explorer',
    description: 'Toggle between themes',
    xp: 5,
    category: 'interaction',
    repeatable: false,
  },

  FIRST_VISIT: {
    id: 'first_visit',
    name: 'Welcome',
    description: 'First time visiting the portfolio',
    xp: 50,
    category: 'achievement',
    repeatable: false,
  },

  SPEED_READER: {
    id: 'speed_reader',
    name: 'Speed Reader',
    description: 'Spend 5+ minutes reading content',
    xp: 30,
    category: 'achievement',
    repeatable: true,
    cooldown: 24 * 60 * 60 * 1000, // 24 hours
  },

  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Visit between midnight and 6am',
    xp: 15,
    category: 'achievement',
    repeatable: true,
    cooldown: 24 * 60 * 60 * 1000, // 24 hours
  },

  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Visit between 6am and 9am',
    xp: 15,
    category: 'achievement',
    repeatable: true,
    cooldown: 24 * 60 * 60 * 1000, // 24 hours
  },

  COMPLETIONIST: {
    id: 'completionist',
    name: 'Completionist',
    description: 'Visit all sections of the portfolio',
    xp: 100,
    category: 'achievement',
    repeatable: false,
  },
} as const;

/**
 * Helper type for XP event IDs
 */
export type XPEventId = keyof typeof XP_EVENTS;

/**
 * Get XP event by ID
 */
export function getXPEvent(id: XPEventId): XPEvent {
  const event = XP_EVENTS[id];
  if (!event) {
    throw new Error(`XP event "${id}" not found`);
  }
  return event;
}

/**
 * Get XP amount for an event
 */
export function getXPAmount(id: XPEventId): number {
  const event = XP_EVENTS[id];
  return event?.xp ?? 0;
}

/**
 * Get all events by category
 */
export function getEventsByCategory(
  category: XPEvent['category']
): XPEvent[] {
  return Object.values(XP_EVENTS).filter(
    (event) => event.category === category
  );
}

/**
 * Storage key for tracking completed events
 */
export const XP_EVENTS_STORAGE_KEY = 'vibe_portfolio_xp_events';

/**
 * Event tracking data structure
 */
export interface EventTrackingData {
  /**
   * Event ID
   */
  eventId: XPEventId;
  
  /**
   * Last time this event was triggered
   */
  lastTriggered: string; // ISO timestamp
  
  /**
   * Total times this event has been triggered
   */
  count: number;
}

/**
 * Load event tracking data from localStorage
 */
export function loadEventTracking(): Map<XPEventId, EventTrackingData> {
  if (typeof window === 'undefined') return new Map();
  
  try {
    const stored = localStorage.getItem(XP_EVENTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed)) as Map<XPEventId, EventTrackingData>;
    }
  } catch (e) {
    console.warn('Failed to load event tracking:', e);
  }
  return new Map();
}

/**
 * Save event tracking data to localStorage
 */
export function saveEventTracking(
  tracking: Map<XPEventId, EventTrackingData>
): void {
  if (typeof window === 'undefined') return;
  
  try {
    const obj = Object.fromEntries(tracking);
    localStorage.setItem(XP_EVENTS_STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn('Failed to save event tracking:', e);
  }
}

/**
 * Check if event can be triggered (respects cooldown and repeatability)
 */
export function canTriggerEvent(
  eventId: XPEventId,
  tracking: Map<XPEventId, EventTrackingData>
): boolean {
  const event = getXPEvent(eventId);
  const tracked = tracking.get(eventId);
  
  // If event hasn't been triggered yet, it can be triggered
  if (!tracked) return true;
  
  // If event is not repeatable and has been triggered, it cannot be triggered again
  if (!event.repeatable) return false;
  
  // If event is repeatable but has no cooldown, it can be triggered
  if (!event.cooldown) return true;
  
  // Check cooldown
  const timeSinceLastTrigger = Date.now() - new Date(tracked.lastTriggered).getTime();
  return timeSinceLastTrigger >= event.cooldown;
}

/**
 * Record event trigger and return XP awarded (0 if not eligible)
 */
export function triggerEvent(eventId: XPEventId): number {
  const tracking = loadEventTracking();
  
  if (!canTriggerEvent(eventId, tracking)) {
    return 0;
  }
  
  const event = getXPEvent(eventId);
  const now = new Date().toISOString();
  
  // Update tracking
  const existing = tracking.get(eventId);
  tracking.set(eventId, {
    eventId,
    lastTriggered: now,
    count: (existing?.count ?? 0) + 1,
  });
  
  saveEventTracking(tracking);
  
  return event.xp;
}
