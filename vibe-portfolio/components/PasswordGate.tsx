import { useState, useEffect } from 'react';
import { Terminal, Lock, ArrowRight, KeyRound } from 'lucide-react';

// Authentication configuration
const VALID_CREDENTIALS = [
  { user: 'suckmyfatone', pass: 'itsanewworldin2026' },
  { user: 'Player1', pass: 'greuceanu' }
];

const STORAGE_KEY = 'vibe-auth';

interface PasswordGateProps {
  children: React.ReactNode;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile/tablet - don't auto-show form on touch devices
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Bypass authentication if no credentials are configured (development mode)
    if (VALID_CREDENTIALS.length === 0) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check if already authenticated
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // On desktop, show form immediately
  useEffect(() => {
    if (!isLoading && !isMobile && !isAuthenticated) {
      setShowForm(true);
    }
  }, [isLoading, isMobile, isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate against allowed credentials
    const isValid = VALID_CREDENTIALS.some(
      c => c.user === username && c.pass === password
    );

    if (isValid) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      setError('Invalid credentials');
      setPassword('');
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div 
          className="absolute"
          style={{
            top: '-10%',
            left: '-5%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div 
          className="absolute"
          style={{
            bottom: '-10%',
            right: '-5%',
            width: '55%',
            height: '55%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400">PREVIEW_MODE</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Vibe Coder Academy</h1>
          <p className="text-sm text-white/50">
            {showForm ? 'Enter credentials to access preview' : 'Preview deployment ready'}
          </p>
        </div>

        {/* Mobile: Show "Tap to Enter" button first */}
        {!showForm && isMobile && (
          <div className="space-y-4">
            <button
              onClick={handleShowForm}
              className="w-full min-h-[56px] px-6 py-4 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-black font-semibold rounded-xl flex items-center justify-center gap-3 transition-colors touch-manipulation"
            >
              <KeyRound className="w-5 h-5" />
              <span className="text-lg">Enter Credentials</span>
            </button>
            <p className="text-center text-xs text-white/30">
              Tap to show login form
            </p>
          </div>
        )}

        {/* Login Form - shown immediately on desktop, after tap on mobile */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-mono text-white/40 uppercase mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 bg-white/[0.04] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all font-mono text-base"
                placeholder="Enter username"
                autoComplete="username"
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/40 uppercase mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 bg-white/[0.04] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all font-mono text-base"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] px-4 py-3 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-black font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors touch-manipulation"
            >
              <Terminal className="w-4 h-4" />
              <span>Access Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Back button on mobile */}
            {isMobile && (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full py-2 text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                Cancel
              </button>
            )}
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-white/30 mt-6">
          This is a preview deployment for testing purposes.
        </p>
      </div>
    </div>
  );
};
