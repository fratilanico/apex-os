import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Package, TestTube2, Shield, Hammer, Rocket, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { TerminalWindow } from '../../ui/Terminal/TerminalWindow';
import { DEMO_EXAMPLES, PRICING_ROTATIONS, type DeploymentExample } from './DeploymentDemo.types';
import { PlatformLogo } from './PlatformLogos';

// ============================================================================
// Pipeline Stage Types & Constants
// ============================================================================
type StageStatus = 'pending' | 'running' | 'success' | 'failed';

interface PipelineStage {
  id: string;
  label: string;
  icon: React.ElementType;
}

const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'checkout', label: 'Checkout', icon: GitBranch },
  { id: 'install', label: 'Install', icon: Package },
  { id: 'test', label: 'Test', icon: TestTube2 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'build', label: 'Build', icon: Hammer },
  { id: 'deploy', label: 'Deploy', icon: Rocket },
];

// ============================================================================
// Platform Configuration
// ============================================================================
interface Platform {
  id: string;
  name: string;
  emoji: string;
  deployTime: number;
  urlPattern: string;
  scriptName: string;
  color: string;
  glowColor: string; // Color for hover glow effect
}

const PLATFORMS: Platform[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    emoji: '▲',
    deployTime: 45,
    urlPattern: 'vercel.app',
    scriptName: 'vercel-deploy.sh',
    color: 'from-white to-gray-400',
    glowColor: '#ffffff',
  },
  {
    id: 'aws',
    name: 'AWS Amplify',
    emoji: '☁️',
    deployTime: 120,
    urlPattern: 'amplifyapp.com',
    scriptName: 'aws-deploy.sh',
    color: 'from-orange-400 to-yellow-500',
    glowColor: '#ff9900',
  },
  {
    id: 'railway',
    name: 'Railway',
    emoji: '🚂',
    deployTime: 60,
    urlPattern: 'railway.app',
    scriptName: 'railway-deploy.sh',
    color: 'from-purple-400 to-pink-500',
    glowColor: '#8b5cf6',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages',
    emoji: '⚡',
    deployTime: 30,
    urlPattern: 'pages.dev',
    scriptName: 'cloudflare-deploy.sh',
    color: 'from-orange-400 to-amber-500',
    glowColor: '#f38020',
  },
];

// ============================================================================
// PlatformSelector Component - Choose deployment platform
// ============================================================================
interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  disabled?: boolean;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ 
  selectedPlatform, 
  onSelectPlatform,
  disabled = false 
}) => {
  return (
    <div className="mb-6 px-4">
      <div className="text-white/60 text-sm font-medium mb-3">Deploy to:</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform.id === platform.id;
          return (
            <motion.button
              key={platform.id}
              onClick={() => !disabled && onSelectPlatform(platform)}
              disabled={disabled}
              className={`
                relative overflow-hidden rounded-xl p-5 border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20' 
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/[0.08] hover:shadow-xl'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                group
              `}
              whileHover={!disabled ? { 
                scale: 1.03,
                y: -2,
              } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 25 
              }}
            >
              {/* Gradient overlay for selected */}
              {isSelected && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-10`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                />
              )}
              
              <div className="relative flex flex-col items-center gap-3">
                {/* Logo with professional hover effects */}
                <motion.div
                  className="relative group"
                  whileHover={!disabled ? { 
                    scale: 1.08,
                    rotate: platform.id === 'railway' ? 3 : 0,
                  } : {}}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 17 
                  }}
                >
                  {/* Glow effect on hover and when selected */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `radial-gradient(circle, ${platform.glowColor}40 0%, transparent 70%)`,
                      filter: 'blur(8px)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isSelected ? 0.6 : 0,
                    }}
                    whileHover={!disabled ? { 
                      opacity: 0.8,
                      scale: 1.3,
                    } : {}}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Logo */}
                  <div className="relative">
                    <PlatformLogo 
                      platformId={platform.id} 
                      size={44}
                      className={`transition-all duration-300 ${
                        isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                </motion.div>
                
                <div className="text-center">
                  <div className={`font-semibold text-sm transition-colors duration-300 ${
                    isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
                  }`}>
                    {platform.name}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">
                    {platform.deployTime}s deploy
                  </div>
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// PipelineStages Component - Visual CI/CD Pipeline
// ============================================================================
interface PipelineStagesProps {
  currentStageIndex: number;
  stageStatuses: StageStatus[];
}

// Prefix with underscore to suppress unused variable warning
const _PipelineStages: React.FC<PipelineStagesProps> = ({ currentStageIndex, stageStatuses }) => {
  return (
    <div className="mb-6 px-4">
      {/* Pipeline container */}
      <div className="relative flex items-center justify-between">
        {/* Background connection line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-white/10 z-0" />
        
        {/* Progress line */}
        <motion.div 
          className="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 z-0"
          initial={{ width: 0 }}
          animate={{ 
            width: currentStageIndex >= 0 
              ? `calc(${Math.min((currentStageIndex / (PIPELINE_STAGES.length - 1)) * 100, 100)}% - 48px)` 
              : 0 
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        
        {/* Stage nodes */}
        {PIPELINE_STAGES.map((stage, index) => {
          const status = stageStatuses[index] || 'pending';
          const Icon = stage.icon;
          
          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              {/* Stage circle */}
              <motion.div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  transition-all duration-300 relative
                  ${status === 'pending' ? 'bg-white/5 border border-white/10' : ''}
                  ${status === 'running' ? 'bg-cyan-500/20 border border-cyan-500/50' : ''}
                  ${status === 'success' ? 'bg-emerald-500/20 border border-emerald-500/50' : ''}
                  ${status === 'failed' ? 'bg-red-500/20 border border-red-500/50' : ''}
                `}
                animate={status === 'running' ? {
                  boxShadow: [
                    '0 0 0 0 rgba(6, 182, 212, 0)',
                    '0 0 0 8px rgba(6, 182, 212, 0.3)',
                    '0 0 0 0 rgba(6, 182, 212, 0)',
                  ],
                } : {}}
                transition={status === 'running' ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                } : {}}
              >
                {status === 'running' ? (
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                ) : status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : status === 'failed' ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <Icon className={`w-5 h-5 ${status === 'pending' ? 'text-white/30' : 'text-white/70'}`} />
                )}
              </motion.div>
              
              {/* Stage label */}
              <span className={`
                mt-2 text-xs font-medium transition-colors duration-300
                ${status === 'pending' ? 'text-white/30' : ''}
                ${status === 'running' ? 'text-cyan-400' : ''}
                ${status === 'success' ? 'text-emerald-400' : ''}
                ${status === 'failed' ? 'text-red-400' : ''}
              `}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// Confetti Component - Framer Motion powered celebration
// ============================================================================
interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  rotationEnd: number;
  size: number;
  shape: 'circle' | 'square' | 'rectangle';
  xDrift: number;
}

const CONFETTI_COLORS = [
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
];

const Confetti: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Generate 50 confetti pieces with varied properties
    const shapes: ConfettiPiece['shape'][] = ['circle', 'square', 'rectangle'];
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage across screen
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? '#06b6d4',
      delay: Math.random() * 0.3,
      duration: 2.5 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      rotationEnd: Math.random() * 720 + 360, // 1-3 full rotations
      size: 8 + Math.random() * 8,
      shape: shapes[Math.floor(Math.random() * shapes.length)] ?? 'circle',
      xDrift: (Math.random() - 0.5) * 100, // drift left or right
    }));
    setPieces(newPieces);

    // Auto-cleanup after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible || pieces.length === 0) return null;

  const getShapeStyles = (piece: ConfettiPiece): React.CSSProperties => {
    const base = {
      backgroundColor: piece.color,
      width: piece.size,
      height: piece.shape === 'rectangle' ? piece.size * 0.4 : piece.size,
    };
    
    switch (piece.shape) {
      case 'circle':
        return { ...base, borderRadius: '50%' };
      case 'square':
        return { ...base, borderRadius: '2px' };
      case 'rectangle':
        return { ...base, borderRadius: '1px' };
      default:
        return base;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: -20,
            rotate: piece.rotation,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            y: '100vh',
            x: `calc(${piece.x}vw + ${piece.xDrift}px)`,
            rotate: piece.rotationEnd,
            scale: 0.5,
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
          }}
          className="absolute"
          style={getShapeStyles(piece)}
        />
      ))}
    </div>
  );
};

// ============================================================================
// DeploymentSuccess Component - Success card with live metrics
// ============================================================================
interface DeploymentSuccessProps {
  onDismiss?: () => void;
  platform: Platform;
}

const DeploymentSuccess: React.FC<DeploymentSuccessProps> = ({ platform }) => {
  const [copied, setCopied] = useState(false);
  const [metrics, setMetrics] = useState({
    responseTime: 42,
    uptime: 100,
    regions: 12,
  });
  
  // Generate a realistic startup URL based on platform
  const deployedUrl = useRef(
    `your-startup-${Math.random().toString(36).substring(2, 6)}.${platform.urlPattern}`
  ).current;

  // Update metrics every second to feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        responseTime: 38 + Math.floor(Math.random() * 12), // 38-49ms
        uptime: 99.9 + Math.random() * 0.1, // 99.9-100%
        regions: 12,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`https://${deployedUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: 'easeInOut',
        }}
      />

      {/* Success Header */}
      <div className="relative flex items-center gap-3 mb-4">
        <motion.div 
          className="inline-flex w-12 h-12 rounded-full bg-emerald-500/20 items-center justify-center flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
        >
          <svg
            className="w-7 h-7 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        <div>
          <motion.h3 
            className="text-xl font-bold text-emerald-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Deployment Successful!
          </motion.h3>
          <motion.p 
            className="text-white/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your app is now live worldwide
          </motion.p>
        </div>
      </div>

      {/* Deployed URL */}
      <motion.div 
        className="relative bg-black/40 rounded-lg p-3 mb-4 flex items-center justify-between gap-2 border border-emerald-500/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-emerald-400 text-lg">🔗</span>
          <span className="text-cyan-400 text-sm font-mono truncate font-medium">
            {deployedUrl}
          </span>
        </div>
        <motion.button
          onClick={handleCopyUrl}
          className="flex-shrink-0 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm font-medium transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? '✓ Copied!' : 'Copy URL'}
        </motion.button>
      </motion.div>

      {/* Live Metrics */}
      <motion.div 
        className="relative grid grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="bg-black/30 rounded-lg p-3 text-center border border-cyan-500/10 hover:border-cyan-500/30 transition-colors"
        >
          <motion.div 
            className="text-cyan-400 font-mono text-2xl font-bold"
            key={metrics.responseTime}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
          >
            {metrics.responseTime}
            <span className="text-xs text-white/40 ml-0.5">ms</span>
          </motion.div>
          <div className="text-white/40 text-xs mt-1">Response Time</div>
        </motion.div>
        <motion.div 
          className="bg-black/30 rounded-lg p-3 text-center border border-emerald-500/10 hover:border-emerald-500/30 transition-colors"
        >
          <div className="text-emerald-400 font-mono text-2xl font-bold">
            {metrics.uptime.toFixed(1)}
            <span className="text-xs text-white/40 ml-0.5">%</span>
          </div>
          <div className="text-white/40 text-xs mt-1">Uptime</div>
        </motion.div>
        <motion.div 
          className="bg-black/30 rounded-lg p-3 text-center border border-violet-500/10 hover:border-violet-500/30 transition-colors"
        >
          <div className="text-violet-400 font-mono text-2xl font-bold">
            {metrics.regions}
          </div>
          <div className="text-white/40 text-xs mt-1">Edge Regions</div>
        </motion.div>
      </motion.div>

      {/* Pulsing indicator */}
      <motion.div 
        className="relative flex items-center justify-center gap-2 mt-4 text-white/40 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Live metrics updating...
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// Main DeploymentDemo Component
// ============================================================================
export const DeploymentDemo = React.memo(function DeploymentDemo() {
  const [userInput, setUserInput] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);
  const [currentExample, setCurrentExample] = useState(0);
  const [currentPricing, setCurrentPricing] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(() => {
    const defaultPlatform = PLATFORMS[0];
    if (!defaultPlatform) throw new Error('No platforms defined');
    return defaultPlatform;
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const autoDeployTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserInteractedRef = useRef(false);

  // Track user scroll interaction to prevent scroll-jacking
  useEffect(() => {
    const handleScroll = () => {
      hasUserInteractedRef.current = true;
    };
    
    const handleWheel = () => {
      hasUserInteractedRef.current = true;
    };
    
    const handleTouchMove = () => {
      hasUserInteractedRef.current = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Auto-focus input on initial load only (no scroll-jacking)
  useEffect(() => {
    // Only focus on initial mount and if user hasn't scrolled yet
    const timer = setTimeout(() => {
      if (!hasUserInteractedRef.current && inputRef.current && showPrompt) {
        inputRef.current.focus({ preventScroll: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [showPrompt]);

  // Rotate pricing every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPricing((prev) => (prev + 1) % PRICING_ROTATIONS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-deploy demo if user doesn't interact
  useEffect(() => {
    if (!isDeploying && deploymentLog.length === 0) {
      const example = DEMO_EXAMPLES[currentExample];
      if (example) {
        autoDeployTimeoutRef.current = setTimeout(() => {
          runDeployment(example);
        }, 3000);
      }
    }

    return () => {
      if (autoDeployTimeoutRef.current) {
        clearTimeout(autoDeployTimeoutRef.current);
      }
    };
  }, [currentExample, isDeploying, deploymentLog.length]);

  // Cleanup success timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Handle success overlay dismissal and transition to next demo
  const handleSuccessDismiss = useCallback(() => {
    setShowSuccess(false);
    setShowConfetti(false);
    setDeploymentLog([]);
    setShowPrompt(true);
    setCurrentExample((prev) => (prev + 1) % DEMO_EXAMPLES.length);
  }, []);

  // Rotate examples after completion (now waits for success overlay)
  useEffect(() => {
    if (!(deploymentLog.length > 0 && !isDeploying && !showSuccess)) return;
    
    // Show success overlay after deployment completes
    const showSuccessTimeout = setTimeout(() => {
      setShowSuccess(true);
      setShowConfetti(true);
    }, 800); // Short delay after deployment completes

    return () => {
      clearTimeout(showSuccessTimeout);
    };
  }, [deploymentLog.length, isDeploying, showSuccess]);

  // Auto-dismiss success overlay after 5 seconds
  useEffect(() => {
    if (!showSuccess) return undefined;
    
    successTimeoutRef.current = setTimeout(() => {
      handleSuccessDismiss();
    }, 5000);

      return () => {
        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current);
        }
      };
    
    return undefined;
  }, [showSuccess, handleSuccessDismiss]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const typeText = async (text: string, callback: (char: string) => void) => {
    for (const char of text) {
      callback(char);
      await sleep(Math.random() * 30 + 20); // 20-50ms per character
    }
  };

  const runDeployment = async (example: DeploymentExample) => {
    if (autoDeployTimeoutRef.current) {
      clearTimeout(autoDeployTimeoutRef.current);
    }

    setShowPrompt(false);
    setIsDeploying(true);
    setDeploymentLog([]);

    // Type the deploy command
    let command = '';
    await typeText(`swarm.deploy("${example.idea}")`, (char) => {
      command += char;
      setDeploymentLog([command]);
    });

    await sleep(500);
    setDeploymentLog(prev => [...prev, '']);

    // Add "ANALYZING_REQUIREMENTS..." with platform-specific messaging
    setDeploymentLog(prev => [...prev, 'ANALYZING_REQUIREMENTS...']);
    setDeploymentLog(prev => [...prev, `${selectedPlatform.emoji} Deploying to ${selectedPlatform.name}...`]);
    await sleep(800);

    // Deploy each feature
    for (let i = 0; i < example.features.length; i++) {
      const feature = example.features[i];
      const featureTime = Math.floor((selectedPlatform.deployTime / example.features.length) * (0.8 + Math.random() * 0.4));
      setDeploymentLog(prev => [...prev, `✓ ${feature}_complete (${featureTime}s)`]);
      await sleep(600);
    }

    await sleep(300);
    setDeploymentLog(prev => [...prev, '']);
    setDeploymentLog(prev => [...prev, 'DEPLOYMENT_COMPLETE']);
    setDeploymentLog(prev => [...prev, `⚡ Total: ${selectedPlatform.deployTime} seconds`]);
    setDeploymentLog(prev => [...prev, `💰 API costs: $${example.cost.toFixed(2)}`]);
    setDeploymentLog(prev => [...prev, `🌐 Live at: ${selectedPlatform.urlPattern === 'vercel.app' ? 'vibe.infoacademy.vercel.app' : `your-app.${selectedPlatform.urlPattern}`}`]);
    
    await sleep(500);
    setDeploymentLog(prev => [...prev, '']);
    setDeploymentLog(prev => [...prev, 'No equity given. No salary negotiation.']);
    setDeploymentLog(prev => [...prev, 'No risk they quit after 12 months.']);

    setIsDeploying(false);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isDeploying) return;

    const customExample: DeploymentExample = {
      idea: userInput.trim(),
      features: ['database_schema', 'api_endpoints', 'frontend_built', 'auth_system', 'tests'],
      time: Math.floor(80 + Math.random() * 40),
      cost: parseFloat((2 + Math.random() * 2).toFixed(2))
    };

    setUserInput('');
    runDeployment(customExample);
  };

  const handleTerminalClick = () => {
    if (!isDeploying && inputRef.current) {
      // Focus without scrolling
      inputRef.current.focus({ preventScroll: true });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Platform Selector */}
      <PlatformSelector
        selectedPlatform={selectedPlatform}
        onSelectPlatform={setSelectedPlatform}
        disabled={isDeploying}
      />

      {/* Terminal */}
      <div onClick={handleTerminalClick} className="cursor-text">
        <TerminalWindow title={selectedPlatform.scriptName}>
          <div className="font-mono text-sm space-y-1 h-[400px] max-h-[400px] overflow-y-auto">
            {showPrompt && deploymentLog.length === 0 && (
              <form onSubmit={handleUserSubmit} className="flex items-center gap-2">
                <span className="text-cyan-400">&gt;</span>
                <span className="text-white/60">What are you building?</span>
                <span className="text-white/40">(e.g., "marketplace for vintage sneakers")</span>
              </form>
            )}

            {showPrompt && deploymentLog.length === 0 && (
              <form onSubmit={handleUserSubmit} className="flex items-center gap-2">
                <span className="text-cyan-400">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
                  placeholder="Type your startup idea..."
                  disabled={isDeploying}
                />
                {!userInput && <span className="w-2 h-4 bg-cyan-400 animate-terminal-blink" />}
              </form>
            )}

            {deploymentLog.filter((line): line is string => line != null).map((line, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {idx === 0 && line?.startsWith('swarm.deploy') ? (
                  <>
                    <span className="text-cyan-400">&gt;</span>
                    <span className="text-white">{line}</span>
                  </>
                ) : line?.startsWith('✓') ? (
                  <span className="text-emerald-400">{line}</span>
                ) : line?.startsWith('⚡') || line?.startsWith('💰') ? (
                  <span className="text-yellow-400">{line}</span>
                ) : line === 'ANALYZING_REQUIREMENTS...' || line === 'DEPLOYMENT_COMPLETE' ? (
                  <span className="text-cyan-400">{line}</span>
                ) : line?.startsWith('No ') ? (
                  <span className="text-white/50 text-xs italic">{line}</span>
                ) : (
                  <span className="text-white/70">{line ?? ''}</span>
                )}
              </div>
            ))}
          </div>
        </TerminalWindow>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <DeploymentSuccess onDismiss={handleSuccessDismiss} platform={selectedPlatform} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Celebration */}
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}

      {/* Rotating Pricing */}
      <div className="text-center mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPricing}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-6 text-4xl md:text-5xl font-bold">
              <span className="line-through text-white/20">
                {PRICING_ROTATIONS[currentPricing]?.before ?? ''}
              </span>
              <span className="text-white/40">→</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
                {PRICING_ROTATIONS[currentPricing]?.after ?? ''}
              </span>
            </div>
            <p className="text-white/50 text-sm max-w-lg mx-auto">
              {PRICING_ROTATIONS[currentPricing]?.subtitle ?? ''}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});
