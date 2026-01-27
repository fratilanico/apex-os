import React, { useState, useEffect, useRef } from 'react';
import { TerminalWindow, TerminalPortal } from '../../ui/Terminal';
import { DEMO_CREDENTIALS, type AuthUser, type AuthenticatedTerminalProps } from './AuthenticatedTerminal.types';

type AuthState = 'boot' | 'username' | 'password' | 'authenticating' | 'success';

export const AuthenticatedTerminal: React.FC<AuthenticatedTerminalProps> = ({
  onAuthenticated,
  onClose,
}) => {
  const [state, setState] = useState<AuthState>('boot');
  const [output, setOutput] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Boot sequence - direct to username/password
    const bootMessages = [
      'VIBE_ACADEMY_PROTOCOL v2.0',
      'AUTHENTICATION REQUIRED',
      '',
      '# SECURE_LOGIN',
      'Enter your credentials below.',
      '',
      'enter_username: '
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < bootMessages.length) {
        const msg = bootMessages[index];
        if (msg != null) {
          setOutput(prev => [...prev, msg]);
        }
        index++;
      } else {
        clearInterval(interval);
        setState('username');
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Add delay and try-catch to prevent focus-related crashes
    const timer = setTimeout(() => {
      try {
        if (inputRef.current && (state === 'username' || state === 'password')) {
          inputRef.current.focus();
        }
      } catch (e) {
        console.warn('Focus error:', e);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [state]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setUsername(inputValue.trim());
    setOutput(prev => [...prev, inputValue, '', 'enter_password: ']);
    setInputValue('');
    setState('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setOutput(prev => [...prev, '••••••••', '']);
    setState('authenticating');

    setOutput(prev => [...prev, 'VERIFYING_CREDENTIALS...']);
    await sleep(1000);

    // Check credentials
    const isValid = username === DEMO_CREDENTIALS.username && inputValue === DEMO_CREDENTIALS.password;

    if (isValid) {
      const user: AuthUser = {
        email: DEMO_CREDENTIALS.email,
        name: username,
        authMethod: 'cli'
      };
      
      setOutput(prev => [...prev, '✓ AUTHENTICATED', '', 'INITIALIZING_CURRICULUM...']);
      setState('success');
      
      await sleep(600);
      setOutput(prev => [...prev, '✓ SESSION_ESTABLISHED', '', '> Redirecting to terminal view...']);
      
      await sleep(800);
      
      // Critical: Ensure body scroll is restored BEFORE triggering navigation
      document.body.style.overflow = '';
      
      // Small delay to let the DOM settle before state changes cascade
      await sleep(100);
      
      onAuthenticated(user);
    } else {
      setOutput(prev => [
        ...prev,
        '✗ INVALID_CREDENTIALS',
        '',
        'Hint: Try username: vibefounder, password: apex2024',
        '',
        'Press ESC to try again'
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation(); // Prevent double-firing with TerminalPortal's escape handler
      onClose();
    }
  };

  if (!mounted) return null;

  return (
    <TerminalPortal
      isOpen={true}
      onClose={onClose}
      title="Authentication Terminal"
      size="lg"
    >
      <TerminalWindow title="authentication.sh">
              <div 
                className="font-mono text-base md:text-sm space-y-1 min-h-[50dvh] md:min-h-[400px] text-white"
                role="log"
                aria-live="polite"
                aria-atomic="false"
              >
                <h2 id="auth-terminal-title" className="sr-only">
                  Authentication Terminal
                </h2>

                {output.map((line, idx) => {
                  // Guard against undefined/null lines
                  if (line == null) return null;
                  const safeeLine = String(line);
                  
                  return (
                    <div key={idx} className="flex items-start gap-2">
                      {safeeLine.startsWith('✓') ? (
                        <span className="text-emerald-400">{safeeLine}</span>
                      ) : safeeLine.startsWith('✗') ? (
                        <span className="text-red-400">{safeeLine}</span>
                      ) : safeeLine.startsWith('[') ? (
                        <span className="text-cyan-400">{safeeLine}</span>
                      ) : safeeLine.includes('AUTHENTICAT') || safeeLine.includes('LOADING') || safeeLine.includes('VERIFYING') ? (
                        <span className="text-cyan-400">{safeeLine}</span>
                      ) : safeeLine.includes('Hint:') ? (
                        <span className="text-yellow-400 text-xs italic">{safeeLine}</span>
                      ) : (
                        <span className="text-white/70">{safeeLine}</span>
                      )}
                    </div>
                  );
                })}

                {/* Input based on state */}
                {state === 'username' && (
                  <form onSubmit={handleUsernameSubmit} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 mt-2">
                    <span className="text-cyan-400">&gt;</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
                      aria-label="Enter username"
                      autoComplete="username"
                    />
                    {!inputValue && <span className="w-2 h-4 bg-cyan-400 animate-terminal-blink" />}
                  </form>
                )}

                {state === 'password' && (
                  <form onSubmit={handlePasswordSubmit} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 mt-2">
                    <span className="text-cyan-400">&gt;</span>
                    <input
                      ref={inputRef}
                      type="password"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
                      aria-label="Enter password"
                      autoComplete="current-password"
                    />
                    {!inputValue && <span className="w-2 h-4 bg-cyan-400 animate-terminal-blink" />}
                  </form>
                )}
              </div>
      </TerminalWindow>
    </TerminalPortal>
  );
};
