import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { TronScene, TronGrid, DataStreams } from '../components/game/TronEnvironment';
import { HoloTerminal, Cyberdeck } from '../components/game/HolographicUI';
import { GameHUD } from '../components/game';
// import { useGameEngine } from '../hooks/useGameEngine'; // TODO: Implement game engine hook

export function GamePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 3D assets
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-tron-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-tron-cyan text-4xl font-mono mb-4 animate-pulse">
            INITIALIZING TRON GRID
          </div>
          <div className="text-tron-cyan/60 text-sm font-mono">
            Loading 3D environment...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-tron-bg">
      {/* Exit Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 right-4 z-[100] px-6 py-2 font-mono text-sm uppercase tracking-wider
                   bg-black/60 border border-tron-cyan text-tron-cyan
                   hover:bg-tron-cyan/10 hover:border-tron-cyan/80 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]
                   transition-all duration-200 rounded backdrop-blur-sm"
      >
        Exit System
      </button>

      {/* 3D Scene */}
      <ErrorBoundary fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-tron-bg">
          <div className="text-tron-cyan font-mono text-center">
            <p className="text-2xl mb-4">3D Environment Error</p>
            <p className="text-sm opacity-70">The TRON grid failed to initialize</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 border border-tron-cyan hover:bg-tron-cyan/10"
            >
              Reload
            </button>
          </div>
        </div>
      }>
        <TronScene>
          <TronGrid />
          <DataStreams />
          <Cyberdeck position={[0, -1.5, 2]} />
          <HoloTerminal position={[0, 1, 0]} />
        </TronScene>
      </ErrorBoundary>

      {/* 2D HUD Overlay */}
      <GameHUD />
    </div>
  );
}
