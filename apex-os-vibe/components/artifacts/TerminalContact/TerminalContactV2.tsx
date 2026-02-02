import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TerminalWindow } from '../../ui/Terminal/TerminalWindow';

type ContactState = 'boot' | 'name' | 'email' | 'message' | 'processing' | 'success' | 'chat';

// Hidden commands for chat mode
const DEV_JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "Why do Java developers wear glasses? Because they don't C#!",
  "There are only 10 types of people in the world: those who understand binary and those who don't.",
  "Programming is like writing a book... except if you miss a single comma, the whole thing makes no sense.",
  "Why did the developer go broke? Because he used up all his cache!",
  "Git commit -m 'I have no idea what I just did but it works now'",
  "99 bugs in the code, 99 bugs... Take one down, patch it around... 127 bugs in the code.",
];

const VIBE_CHECKS = [
  "Vibe status: IMMACULATE ✨",
  "Vibe report: Currently operating at 420% efficiency 🚀",
  "Vibes detected: good vibes only 🌊",
  "Scanning vibes... Results: You're absolutely crushing it!",
  "Vibe check complete: Main character energy detected 💫",
  "Your vibes are so good they're breaking the terminal 🔥",
  "Alert: Dangerously high levels of awesome detected",
];

const HIDDEN_COMMANDS: Record<string, () => string[]> = {
  help: (): string[] => [
    '┌─────────────────────────────────────┐',
    '│      🔮 HIDDEN COMMANDS UNLOCKED 🔮  │',
    '├─────────────────────────────────────┤',
    '│  help   - Show this menu           │',
    '│  joke   - Random dev joke 🎭       │',
    '│  coffee - Essential fuel ☕        │',
    '│  matrix - Red pill or blue pill? 💊│',
    '│  sudo   - Gain root access 🔐      │',
    '│  vibe   - Check your vibe ✨       │',
    '│  about  - About Vibe Coder Academy │',
    '│  stack  - Tech stack we teach 🛠️   │',
    '│  clear  - Clear terminal 🧹        │',
    '│  exit   - End chat session 👋      │',
    '└─────────────────────────────────────┘',
    '',
    'Type any command to execute...',
  ],
  joke: (): string[] => {
    const joke = DEV_JOKES[Math.floor(Math.random() * DEV_JOKES.length)] ?? DEV_JOKES[0] ?? 'Why do programmers prefer dark mode? Because light attracts bugs!';
    return ['', '🎭 DEV_JOKE.exe', '', joke, ''];
  },
  coffee: () => [
    '',
    '       ( (',
    '        ) )',
    '      ........',
    '      |      |]',
    '      \      /',
    '       `----\'',
    '',
    '☕ COFFEE.exe loaded successfully',
    'Caffeine levels: OPTIMAL',
    '',
  ],
  matrix: () => [
    '',
    '░█░█░█▀█░█░█░█▀▀░░░█░█░█▀█░░░█▀█░█▀▀░█▀█',
    '░█▄█░█▀█░█▀▄░█▀▀░░░█░█░█▀▀░░░█░█░█▀▀░█░█',
    '░▀░▀░▀░▀░▀░▀░▀▀▀░░░▀▀▀░▀░░░░░▀░▀░▀▀▀░▀▀▀',
    '',
    'Wake up, Neo...',
    'The Matrix has you...',
    'Follow the white rabbit. 🐰',
    '',
    'Knock, knock...',
    '',
  ],
  sudo: () => [
    '',
    '🚫 ACCESS_DENIED',
    '',
    'Nice try! But you\'re not in the sudoers file.',
    'This incident will be reported... just kidding 😄',
    '',
    'Pro tip: Real hackers use `please` instead of `sudo`',
    '',
  ],
  vibe: (): string[] => {
    const vibe = VIBE_CHECKS[Math.floor(Math.random() * VIBE_CHECKS.length)] ?? VIBE_CHECKS[0] ?? 'Vibe status: IMMACULATE ✨';
    return ['', '🎯 VIBE_CHECK.exe', '', vibe, ''];
  },
  about: () => [
    '',
    '╔═══════════════════════════════════════╗',
    '║       VIBE CODER ACADEMY v1.0         ║',
    '╠═══════════════════════════════════════╣',
    '║                                       ║',
    '║  Mission: Transform developers into   ║',
    '║  AI-native engineers who ship 10x     ║',
    '║  faster with multi-agent workflows.   ║',
    '║                                       ║',
    '║  Stack: Next.js • TypeScript • AI     ║',
    '║                                       ║',
    '║  Philosophy: Vibe coding is the       ║',
    '║  future. Embrace the orchestrator     ║',
    '║  mindset and let agents do the work.  ║',
    '║                                       ║',
    '╚═══════════════════════════════════════╝',
    '',
  ],
  stack: () => [
    '',
    '🛠️  TECH_STACK.exe',
    '',
    '┌─────────────────────────────────────────┐',
    '│           THE VIBE STACK               │',
    '├─────────────────────────────────────────┤',
    '│  ⚡ Next.js 14      - React framework   │',
    '│  📘 TypeScript      - Type safety       │',
    '│  🎨 Tailwind CSS    - Styling           │',
    '│  🗄️  Prisma          - Database ORM     │',
    '│  🔐 NextAuth        - Authentication    │',
    '│  🤖 Claude/GPT      - AI orchestration  │',
    '│  🚀 Vercel          - Deployment        │',
    '│  📊 Supabase        - Backend-as-a-svc  │',
    '├─────────────────────────────────────────┤',
    '│  + 12 AI tools for multi-agent flows   │',
    '└─────────────────────────────────────────┘',
    '',
    'This is the stack. There are many like it,',
    'but this one ships FAST. 🚀',
    '',
  ],
  clear: () => ['__CLEAR__'], // Special marker handled in handleChatSubmit
  admin: () => ['__ADMIN__'], // Special marker for admin navigation
};

// Konami code sequence
const KONAMI_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

interface FormData {
  name: string;
  email: string;
  message: string;
}

const FAQ_RESPONSES: Record<string, string> = {
  curriculum: `
✓ CURRICULUM_INFO

6 modules covering:
- Module 00: Orchestrator mindset
- Module 01: Tool setup (12 tools)
- Module 02: Multi-agent workflows
- Module 03: Cost optimization
- Module 04: Production deployment
- Module 05: Solo practicum project

Total: ~20 hours. Self-paced.`,
  experience: `
✓ EXPERIENCE_REQUIREMENTS

You need:
✓ Basic coding knowledge (any language)
✓ Comfortable with terminal/command line
✓ Can read documentation

You DON'T need:
✗ Senior engineering experience
✗ CS degree
✗ Deep algorithmic knowledge

If you've built a feature before, you're ready.`,
  time: `
✓ TIME_COMMITMENT

Core curriculum: ~20 hours
Practicum project: 2-4 weeks (self-paced)

Most people complete in 2-3 weeks total.`,
  tools: `
✓ TOOLS_REQUIRED

You'll need accounts for 12 tools.
Most have free tiers to start.

Total monthly cost: $20-50 using free tiers strategically
OR $200-500 with paid plans for production use.`
};

// Hook for swipe detection
const useSwipe = (onSwipe: (direction: string) => void) => {
  const touchStart = useRef<{x: number, y: number} | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (!touch) return;
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touch = e.changedTouches[0];
    if (!touch) return;
    const touchEnd = {
        x: touch.clientX,
        y: touch.clientY
    };

    const deltaX = touchEnd.x - touchStart.current.x;
    const deltaY = touchEnd.y - touchStart.current.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal
        if (Math.abs(deltaX) > 50) {
            onSwipe(deltaX > 0 ? 'ArrowRight' : 'ArrowLeft');
        }
    } else {
        // Vertical
        if (Math.abs(deltaY) > 50) {
            onSwipe(deltaY > 0 ? 'ArrowDown' : 'ArrowUp');
        }
    }
    
    touchStart.current = null;
  };

  return { onTouchStart, onTouchEnd };
};

export const TerminalContactV2: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<ContactState>('boot');
  const [output, setOutput] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [inputValue, setInputValue] = useState('');
  const [_chatHistory, setChatHistory] = useState<Array<{ question: string; answer: string }>>([]);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Boot sequence
    const bootMessages = [
      'VIBE_CONTACT_PROTOCOL v1.0',
      'INITIALIZING_SECURE_CHANNEL...',
      '✓ READY',
      '',
      '# MESSAGE PROTOCOL',
      'Follow the prompts below. Press ENTER after each response.',
      '',
      '# Your name:',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < bootMessages.length) {
        const msg = bootMessages[index];
        if (msg !== undefined) {
          setOutput(prev => [...prev, msg]);
        }
        index++;
      } else {
        clearInterval(interval);
        setState('name');
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Add small delay to ensure DOM is ready before focusing
    // Prevents race condition between state change and ref attachment
    const timer = setTimeout(() => {
      try {
        if (state === 'name' || state === 'email' || state === 'chat') {
          inputRef.current?.focus();
        } else if (state === 'message') {
          textareaRef.current?.focus();
        }
      } catch (e) {
        // Ignore focus errors - non-critical
        console.warn('Focus error:', e);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [state]);

  // Konami code listener
  const handleKonamiKey = useCallback((e: { code: string }) => {
    if (konamiActivated) return;
    
    const key = e.code;
    const expectedKey = KONAMI_SEQUENCE[konamiIndex];
    
    if (key === expectedKey) {
      const newIndex = konamiIndex + 1;
      setKonamiIndex(newIndex);
      
      if (newIndex === KONAMI_SEQUENCE.length) {
        setKonamiActivated(true);
        setOutput(prev => [
          ...prev,
          '',
          '🎮 ▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ 🎮',
          '',
          '   ★ KONAMI CODE ACTIVATED! ★',
          '',
          '   Use code VIBEKONAMI for 10% off',
          '   your Vibe Coder Academy enrollment!',
          '',
          '🎮 ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀ 🎮',
          '',
        ]);
      }
    } else {
      setKonamiIndex(0);
    }
  }, [konamiIndex, konamiActivated]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => handleKonamiKey(e);
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [handleKonamiKey]);

  // Swipe detection for Konami on mobile
  const { onTouchStart, onTouchEnd } = useSwipe((dir) => {
    handleKonamiKey({ code: dir });
  });

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const name = inputValue.trim();
    setFormData(prev => ({ ...prev, name }));
    setOutput(prev => [...prev, `> ${name}`, '', '✓ IDENTITY_CAPTURED', '', '# Your email:']);
    setInputValue('');
    setState('email');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const email = inputValue.trim();
    
    if (!validateEmail(email)) {
      setOutput(prev => [...prev, `> ${email}`, '', '✗ INVALID_EMAIL_FORMAT', 'Please enter a valid email address.', '']);
      setInputValue('');
      return;
    }

    setFormData(prev => ({ ...prev, email }));
    setOutput(prev => [
      ...prev,
      `> ${email}`,
      '',
      '✓ CONTACT_VERIFIED',
      '',
      '# Project description (what are you building?):',
      '# Type your message and press ENTER or tap Send'
    ]);
    setInputValue('');
    setState('message');
  };

  const handleMessageSubmit = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    const completeFormData = { ...formData, message };
    setFormData(completeFormData);
    
    setOutput(prev => [
      ...prev,
      `> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`,
      '',
      `✓ MESSAGE_RECEIVED (${message.length} chars)`,
      ''
    ]);
    
    setState('processing');
    setOutput(prev => [...prev, 'TRANSMITTING_DATA...']);

    try {
      const response = await fetch('https://formspree.io/f/xwpkgpvd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: completeFormData.name,
          email: completeFormData.email,
          message: completeFormData.message,
          _subject: `[Vibe Contact] New message from ${completeFormData.name}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Transmission failed');
      }

      setOutput(prev => [
        ...prev,
        '✓ TRANSMISSION_COMPLETE',
        '✓ MESSAGE_QUEUED',
        'RESPONSE_ETA: <24H',
        '',
        'Need immediate help? Email vibe@infoacademy.ro directly.',
        '',
        'Continue chatting? [Y/n]: '
      ]);
      
      setState('success');
    } catch (error) {
      setOutput(prev => [
        ...prev,
        '✗ TRANSMISSION_FAILED',
        'ERROR: Network or server issue',
        '',
        'Alternative: Email vibe@infoacademy.ro directly.',
        '',
        'Retry? [Y/n]: '
      ]);
      setState('success'); // Allow retry through the continue flow
    }
    
    setInputValue('');
  };

  const handleContinueChatting = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = inputValue.trim().toLowerCase();
    
    if (answer === 'y' || answer === 'yes' || answer === '') {
      setOutput(prev => [
        ...prev,
        'y',
        '',
        '✓ CHAT_MODE_ACTIVE',
        '',
        'Common questions:',
        '1. What\'s included in the curriculum?',
        '2. Do I need coding experience?',
        '3. How long does it take?',
        '4. What tools will I need?',
        '',
        'Type your question or \'exit\' to finish:',
      ]);
      setState('chat');
    } else {
      setOutput(prev => [...prev, 'n', '', 'Thank you! We\'ll be in touch soon.', '']);
    }
    
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (without shift for newline) or Ctrl+Enter
    if (state === 'message' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit();
    }
  };

  // Check if command is showmethemoney (flexible matching)
  const isShowMeTheMoneyCommand = (cmd: string): boolean => {
    const normalized = cmd.toLowerCase().replace(/\s/g, '');
    const lowerCmd = cmd.toLowerCase();
    return (
      normalized === 'showmethemoney' ||
      normalized.includes('showmethemoney') ||
      lowerCmd.includes('money') ||
      lowerCmd.includes('financial') ||
      lowerCmd.includes('business plan') ||
      lowerCmd.includes('businessplan')
    );
  };

  // Refactored submission logic
  const processCommand = (cmd: string) => {
    // Check for showmethemoney command FIRST (before other processing)
    if (isShowMeTheMoneyCommand(cmd)) {
      setOutput(prev => [
        ...prev,
        `> ${cmd}`,
        '',
        '💰 ACCESSING FINANCIAL VAULT...',
        '📊 LOADING_BUSINESS_PLAN_V1.0...',
        '💰 FINANCIAL_PROJECTIONS_DECRYPTED',
        '✓ CLEARANCE_GRANTED',
        'Redirecting to Business Plan...'
      ]);
      setInputValue('');
      setTimeout(() => navigate('/showmethemoney'), 1200);
      return;
    }

    const question = cmd.toLowerCase();
    
    if (question === 'exit' || question === 'quit') {
        setOutput(prev => [...prev, `> ${cmd}`, '', '✓ CHAT_SESSION_ENDED', 'Thank you! Check your email for confirmation.', '']);
        setInputValue('');
        return;
    }

    const command = HIDDEN_COMMANDS[question];
    if (command) {
        const commandOutput = command();
        if (commandOutput[0] === '__CLEAR__') {
            setOutput(['✓ TERMINAL_CLEARED', '', 'Chat mode active. Type your question or \'help\' for commands:']);
            setInputValue('');
            return;
        }
        if (commandOutput[0] === '__ADMIN__') {
            setOutput(prev => [...prev, `> ${cmd}`, '', '🔒 SECURITY PROTOCOL INITIATED...', '✓ IDENTITY_VERIFIED', 'Redirecting to Admin Console...']);
            setInputValue('');
            setTimeout(() => navigate('/admin'), 1500);
            return;
        }
        setOutput(prev => [...prev, `> ${cmd}`, ...commandOutput]);
        setInputValue('');
        return;
    }
    
    // FAQ logic
    let response = '';
    for (const [key, value] of Object.entries(FAQ_RESPONSES)) {
        if (question.includes(key) || question.includes(key.replace('_', ' '))) {
            response = value;
            break;
        }
    }
    if (!response) {
        response = `
I'll make sure our team addresses this question personally.
Check your email (${formData.email}) for a detailed response within 24h.

Type another question or 'exit' to finish.`;
    }
    setChatHistory(prev => [...prev, { question: cmd, answer: response }]);
    setOutput(prev => [...prev, `> ${cmd}`, '', ...response.split('\n').filter((line): line is string => line != null), '']);
    setInputValue('');
  };

  return (
    <TerminalWindow title="contact.sh">
      <div 
        className="font-mono text-sm space-y-1 h-[500px] max-h-[500px] overflow-y-auto text-white" 
        role="form" 
        aria-labelledby="contact-form-title"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <h2 id="contact-form-title" className="sr-only">Contact Form Terminal</h2>

        {output.filter((line): line is string => line != null).map((line, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {line?.startsWith('#') ? (
              <span className="text-cyan-400 font-semibold">{line}</span>
            ) : line?.startsWith('✓') ? (
              <span className="text-emerald-400">{line}</span>
            ) : line?.startsWith('✗') ? (
              <span className="text-red-400">{line}</span>
            ) : line?.startsWith('>') ? (
              <span className="text-yellow-400">{line}</span>
            ) : line?.includes('PROCESSING') || line?.includes('QUEUED') ? (
              <span className="text-cyan-400">{line}</span>
            ) : (
              <span className="text-white/70">{line ?? ''}</span>
            )}
          </div>
        ))}

        {/* Name Input */}
        {state === 'name' && (
          <form onSubmit={handleNameSubmit} className="flex items-center gap-2 mt-2">
            <span className="text-cyan-400">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
              aria-label="Your name"
              aria-required="true"
              autoComplete="name"
            />
            {!inputValue && <span className="w-2 h-4 bg-cyan-400 animate-terminal-blink" />}
          </form>
        )}

        {/* Email Input */}
        {state === 'email' && (
          <form onSubmit={handleEmailSubmit} className="flex items-center gap-2 mt-2">
            <span className="text-cyan-400">&gt;</span>
            <input
              ref={inputRef}
              type="email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
              aria-label="Your email"
              aria-required="true"
              autoComplete="email"
            />
            {!inputValue && <span className="w-2 h-4 bg-cyan-400 animate-terminal-blink" />}
          </form>
        )}

        {/* Message Input (Textarea) */}
        {state === 'message' && (
          <div className="mt-2">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">&gt;</span>
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent outline-none text-white caret-cyan-400 resize-none min-h-[80px]"
                  aria-label="Project description"
                  aria-required="true"
                  rows={4}
                />
                {inputValue.length > 0 && (
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="text-xs text-white/30">
                      {inputValue.length} chars {/* Desktop hint */}
                      <span className="hidden md:inline">| ENTER to send (SHIFT+ENTER for newline)</span>
                    </div>
                    {/* Mobile Send Button */}
                    <button
                      onClick={handleMessageSubmit}
                      className="md:hidden min-h-[44px] min-w-[44px] px-4 py-2 bg-cyan-400/10 hover:bg-cyan-400/20 active:bg-cyan-400/30 border border-cyan-400/40 rounded-md text-cyan-400 font-semibold text-sm transition-colors touch-manipulation"
                      aria-label="Send message"
                      type="button"
                    >
                      Send →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Continue Chatting Prompt */}
        {state === 'success' && (
          <form onSubmit={handleContinueChatting} className="flex items-center gap-2 mt-2">
            <span className="text-cyan-400">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
              placeholder="y"
              aria-label="Continue chatting?"
            />
            {!inputValue && <span className="w-2 h-4 bg-cyan-400 animate-terminal-blink" />}
          </form>
        )}

        {/* Chat Input */}
        {state === 'chat' && (
          <div className="flex flex-col gap-2 mt-2">
             <form onSubmit={(e) => { e.preventDefault(); if(inputValue.trim()) processCommand(inputValue); }} className="flex items-center gap-2">
                <span className="text-cyan-400">&gt;</span>
                <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
                aria-label="Type your question"
                />
                {!inputValue && <span className="w-2 h-4 bg-cyan-400 animate-terminal-blink" />}
             </form>
             
             {/* Mobile Quick Actions Toolbar */}
             <div className="md:hidden flex gap-2 overflow-x-auto py-2 no-scrollbar">
               {['help', 'joke', 'vibe', 'clear', 'stack'].map(cmd => (
                 <button
                   key={cmd}
                   onClick={() => processCommand(cmd)}
                   className="min-h-[44px] px-4 py-2 bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-md text-sm text-cyan-400 border border-cyan-400/20 whitespace-nowrap transition-colors touch-manipulation"
                   aria-label={`Run ${cmd} command`}
                 >
                   {cmd}
                 </button>
               ))}
               {/* Mobile Konami Triggers for B/A */}
               <button 
                 onClick={() => handleKonamiKey({code: 'KeyB'})} 
                 className="min-h-[44px] min-w-[44px] px-4 py-2 bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-md text-sm text-fuchsia-400 border border-fuchsia-400/20 font-bold touch-manipulation"
                 aria-label="Konami code B"
               >
                 B
               </button>
               <button 
                 onClick={() => handleKonamiKey({code: 'KeyA'})} 
                 className="min-h-[44px] min-w-[44px] px-4 py-2 bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-md text-sm text-fuchsia-400 border border-fuchsia-400/20 font-bold touch-manipulation"
                 aria-label="Konami code A"
               >
                 A
               </button>
             </div>
          </div>
        )}
      </div>
    </TerminalWindow>
  );
};
