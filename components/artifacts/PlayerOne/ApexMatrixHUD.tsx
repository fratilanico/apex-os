'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Brain, Activity, Monitor, Terminal, ChevronRight, Lock, CheckCircle2, Circle } from 'lucide-react';
import { useMatrixStore } from '@/stores/useMatrixStore';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX MATRIX HUD v2.0.0 — The Neural Nebula Interface (Mobile-Optimized)
// ═══════════════════════════════════════════════════════════════════════════════

// --- ERROR BOUNDARY COMPONENT ---
class MatrixErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ApexMatrixHUD] Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// --- MOBILE DETECTION HOOK ---
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, isClient };
};

// --- MOBILE NODE LIST VIEW ---
const MobileNodeList: React.FC<{
  nodes: Array<{
    id: string;
    data: {
      label: string;
      type?: string;
      status?: string;
      progress?: number;
    };
  }>;
  onNodeClick: (id: string) => void;
}> = ({ nodes, onNodeClick }) => {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'locked':
        return <Lock size={16} className="text-white/30" />;
      default:
        return <Circle size={16} className="text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onNodeClick(node.id)}
          className={`
            flex items-center gap-3 p-4 rounded-xl border font-mono cursor-pointer
            ${node.data.status === 'completed' 
              ? 'border-emerald-500/30 bg-emerald-500/5' 
              : node.data.status === 'locked'
              ? 'border-white/5 bg-white/5 opacity-50'
              : 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10'}
          `}
        >
          <div className="flex-shrink-0">
            {getStatusIcon(node.data.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-bold truncate">
              {node.data.label}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">
              {node.data.type || 'SYSTEM_MODULE'}
            </div>
          </div>
          <ChevronRight size={16} className="text-white/30 flex-shrink-0" />
        </motion.div>
      ))}
    </div>
  );
};

// --- MOBILE FALLBACK VIEW ---
const MobileFallback: React.FC<{
  nodes: Array<{
    id: string;
    data: {
      label: string;
      type?: string;
      status?: string;
      progress?: number;
    };
  }>;
  lastTransmission: string;
  traceLevel: number;
}> = ({ nodes, lastTransmission, traceLevel }) => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'transmission'>('nodes');

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Monitor size={20} className="text-cyan-400" />
          <h2 className="text-white font-black text-lg tracking-tighter uppercase">
            Apex_Matrix
          </h2>
        </div>
        <p className="text-[10px] text-white/40 font-mono">
          <span className="text-cyan-400">MOBILE_VIEW</span> • Optimized for Desktop
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('nodes')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'nodes' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-white/40'
          }`}
        >
          <Brain size={14} className="inline mr-1" />
          Nodes
        </button>
        <button
          onClick={() => setActiveTab('transmission')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'transmission' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-white/40'
          }`}
        >
          <Activity size={14} className="inline mr-1" />
          Transmission
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'nodes' ? (
            <motion.div
              key="nodes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <div className="mb-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-[10px] text-cyan-400/80 font-mono leading-relaxed">
                  <Terminal size={12} className="inline mr-1" />
                  Matrix visualization works best on desktop. Switch to Terminal or Skills view for full mobile experience.
                </p>
              </div>
              <MobileNodeList 
                nodes={nodes} 
                onNodeClick={(id) => console.log('Node clicked:', id)} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="transmission"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <div className="p-4 rounded-xl bg-black/60 border border-white/5">
                <p className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity size={12} /> Director_Transmission
                </p>
                <p className="text-xs text-white/80 font-mono leading-relaxed">
                  {lastTransmission}
                </p>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mb-2">
                  <span>Trace_Level</span>
                  <span className="text-red-400">{traceLevel}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${traceLevel}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-red-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <p className="text-[9px] text-white/30 text-center font-mono">
          Use desktop for full matrix visualization
        </p>
      </div>
    </div>
  );
};

// --- LOADING STATE ---
const MatrixLoading: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-zinc-950">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full mx-auto mb-4"
      />
      <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest">
        Initializing_Matrix...
      </p>
    </motion.div>
  </div>
);

// --- ERROR FALLBACK ---
const MatrixErrorFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-zinc-950 p-6">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
        <Zap size={24} className="text-red-400" />
      </div>
      <h3 className="text-white font-bold text-lg mb-2">Matrix_Error</h3>
      <p className="text-[11px] text-white/50 font-mono leading-relaxed mb-4">
        Unable to initialize the Apex Matrix. This may be due to browser compatibility or mobile limitations.
      </p>
      <p className="text-[10px] text-cyan-400/60 font-mono">
        Try switching to Terminal or Skills view for mobile experience.
      </p>
    </div>
  </div>
);

// --- DYNAMIC REACTFLOW IMPORT ---
const ReactFlowWrapper = React.lazy(() => 
  import('./ReactFlowWrapper').then(module => ({ default: module.default }))
);

export const ApexMatrixHUD: React.FC = () => {
  const { isMobile, isClient } = useMobileDetection();
  const { nodes: storeNodes, edges: storeEdges, lastTransmission, traceLevel } = useMatrixStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate initialization delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // SSR safety - don't render until client-side
  if (!isClient) {
    return <MatrixLoading />;
  }

  // Show mobile fallback for small screens
  if (isMobile) {
    return (
      <MobileFallback
        nodes={storeNodes}
        lastTransmission={lastTransmission ?? 'Awaiting transmission...'}
        traceLevel={traceLevel}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return <MatrixLoading />;
  }

  // Show error fallback
  if (hasError) {
    return <MatrixErrorFallback />;
  }

  return (
    <MatrixErrorBoundary fallback={<MatrixErrorFallback />}>
      <div className="w-full h-full relative">
        {/* Background Neural Nebula Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[200px]" />
        </div>

        {/* Header Info */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none flex flex-col gap-1">
          <h2 className="text-white font-black text-2xl tracking-tighter italic uppercase flex items-center gap-3">
            <Sparkles className="text-cyan-400 animate-pulse" />
            Apex_Learning_Matrix
          </h2>
          <div className="flex items-center gap-4 text-[9px] font-mono text-white/40 uppercase tracking-widest">
            <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-cyan-400" /> Mode: Dynamic_Hybrid</span>
            <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-[#D946EF]" /> State: Sovereign_Dominance</span>
            <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-red-500" /> Trace: {traceLevel}%</span>
          </div>
        </div>

        {/* Director Transmission Overlay */}
        <div className="absolute top-6 right-6 z-20 w-72 p-4 rounded-xl bg-black/60 border border-white/5 backdrop-blur-xl pointer-events-none">
          <p className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <Activity size={12} /> Director_Transmission
          </p>
          <p className="text-[11px] text-white/80 font-mono leading-relaxed">
            {lastTransmission}
          </p>
        </div>

        {/* React Flow Graph with Suspense */}
        <Suspense fallback={<MatrixLoading />}>
          <ReactFlowWrapper
            nodes={storeNodes}
            edges={storeEdges}
            onError={() => setHasError(true)}
          />
        </Suspense>

        {/* Footer Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl pointer-events-none">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <Brain size={12} className="text-purple-400" />
            Navigate the matrix to unlock sovereign potential
          </p>
        </div>
      </div>
    </MatrixErrorBoundary>
  );
};
