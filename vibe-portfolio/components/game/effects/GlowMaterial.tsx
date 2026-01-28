import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlowMaterialProps {
  color?: string;
  intensity?: number;
  opacity?: number;
  animate?: boolean;
}

export function GlowMaterial({
  color = '#00D4FF',
  intensity = 1.0,
  opacity = 1.0,
  animate = false,
}: GlowMaterialProps) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (animate && materialRef.current) {
      // Pulse animation: oscillate between 50% and 150% of base intensity
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 1;
      materialRef.current.emissiveIntensity = intensity * pulse;
    }
  });

  return (
    <meshStandardMaterial
      ref={materialRef}
      color={color}
      emissive={color}
      emissiveIntensity={animate ? intensity : intensity}
      transparent={opacity < 1}
      opacity={opacity}
      toneMapped={false}
    />
  );
}
