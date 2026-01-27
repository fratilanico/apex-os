'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  name: string;
  initials: string;
  action: string;
  emoji: string;
  timestamp: string;
  color: string;
}

const colors = [
  'bg-cyan-500',
  'bg-violet-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
];

const eventTemplates = [
  { action: 'just earned Cursor Mastery', emoji: '🎯' },
  { action: 'deployed their first AI agent', emoji: '🚀' },
  { action: 'completed Phase 03 in 4 days', emoji: '⚡' },
  { action: 'unlocked the Builder badge', emoji: '🏆' },
  { action: 'shipped a production feature', emoji: '✨' },
  { action: 'mastered TypeScript patterns', emoji: '📘' },
  { action: 'completed the Next.js course', emoji: '🎓' },
  { action: 'joined the community', emoji: '👋' },
  { action: 'built their portfolio site', emoji: '💼' },
  { action: 'earned the Speed Demon badge', emoji: '💨' },
  { action: 'reached 100 commits', emoji: '💯' },
  { action: 'deployed to production', emoji: '🌐' },
  { action: 'completed the AI workshop', emoji: '🤖' },
  { action: 'mastered Tailwind CSS', emoji: '🎨' },
  { action: 'built their first API', emoji: '🔌' },
  { action: 'earned Problem Solver', emoji: '🧩' },
  { action: 'shipped a mobile app', emoji: '📱' },
  { action: 'completed Phase 01', emoji: '🎯' },
  { action: 'learned Framer Motion', emoji: '🎬' },
  { action: 'joined the hackathon', emoji: '⚔️' },
  { action: 'earned Code Ninja', emoji: '🥷' },
  { action: 'deployed with Docker', emoji: '🐳' },
  { action: 'mastered Git workflows', emoji: '🌿' },
  { action: 'built a Chrome extension', emoji: '🧩' },
  { action: 'completed React Advanced', emoji: '⚛️' },
];

const names = [
  'Sarah M.', 'John D.', 'Emma W.', 'Michael B.', 'Lisa K.',
  'David R.', 'Amy C.', 'Chris P.', 'Rachel T.', 'James L.',
  'Jessica H.', 'Ryan S.', 'Nicole F.', 'Alex G.', 'Maria V.',
  'Tom W.', 'Ashley M.', 'Kevin Z.', 'Sophia N.', 'Daniel K.',
  'Olivia B.', 'Marcus J.', 'Emily R.', 'Nathan P.', 'Hannah L.',
];

const generateEvent = (): Event => {
  const name = names[Math.floor(Math.random() * names.length)] ?? 'Anonymous';
  const initials = name
    .split(' ')
    .map(n => n?.[0] ?? '')
    .filter(Boolean)
    .join('');
  const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)] ?? eventTemplates[0];
  const color = colors[Math.floor(Math.random() * colors.length)] ?? 'bg-cyan-500';
  const minutesAgo = Math.floor(Math.random() * 45) + 1;
  
  return {
    id: `${Date.now()}-${Math.random()}`,
    name,
    initials,
    action: template?.action ?? 'joined the community',
    emoji: template?.emoji ?? '👋',
    timestamp: minutesAgo < 60 ? `${minutesAgo} min ago` : `${Math.floor(minutesAgo / 60)}h ago`,
    color,
  };
};

const initialEvents = Array.from({ length: 8 }, () => generateEvent());

const SocialProofTicker = React.memo(function SocialProofTicker() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newEvent = generateEvent();
      setEvents(prev => [...prev, newEvent].slice(-15)); // Keep last 15 events
    }, Math.random() * 5000 + 5000); // 5-10 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div 
      className="relative h-12 bg-black/20 backdrop-blur-sm border-y border-white/5 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />

      {/* Scrolling container */}
      <div className="flex items-center h-full">
        <motion.div
          className="flex gap-8 px-8"
          animate={isPaused ? {} : { x: [0, -1000] }}
          transition={isPaused ? {} : {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {/* Duplicate events for seamless loop */}
          {[...events, ...events, ...events].map((event, index) => (
            <motion.div
              key={`${event.id}-${index}`}
              className="flex items-center gap-3 whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full ${event.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
              >
                {event.initials}
              </div>

              {/* Event details */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white/90 font-medium">{event.name}</span>
                <span className="text-white/60">{event.action}</span>
                <span className="text-lg leading-none">{event.emoji}</span>
                <span className="text-white/40 text-xs ml-1">
                  {event.timestamp}
                </span>
              </div>

              {/* Separator dot */}
              <div className="w-1 h-1 rounded-full bg-white/20" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

export default SocialProofTicker;
