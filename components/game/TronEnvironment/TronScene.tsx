'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { TronPostProcessing } from './TronPostProcessing';
import { useAdaptivePerformance } from '@/hooks/useAdaptivePerformance';

interface TronSceneProps {
  children: React.ReactNode;
  className?: string;
}

export function TronScene({ children, className }: TronSceneProps) {
  const { quality } = useAdaptivePerformance();
  
  return (
    <Canvas
      className={className}
      gl={{
        antialias: quality !== 'low',
        powerPreference: 'high-performance',
        alpha: false,
      }}
      dpr={quality === 'high' ? [1, 2] : [1, 1]}
      camera={{ position: [0, 5, 10], fov: 60 }}
      style={{ background: '#0A0A12' }}
    >
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-tron-bg">
          <div className="text-tron-cyan font-mono text-center">
            <div className="text-2xl mb-4 animate-pulse">INITIALIZING...</div>
            <div className="text-sm opacity-70">Loading TRON Grid</div>
          </div>
        </div>
      }>
        {/* Camera Setup */}
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={60} />

        {/* Controls with limited rotation and smooth damping */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={50}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          enablePan={false}
        />

        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight
          position={[10, 10, 10]}
          color="#00ffff"
          intensity={1.5}
        />

        {/* Scene Children */}
        {children}

        {/* Post Processing Effects */}
        <TronPostProcessing />
      </Suspense>
    </Canvas>
  );
}
