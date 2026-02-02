'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TronGridProps {
  size?: number;
  detail?: number;
}

export function TronGrid({ size = 100, detail = 50 }: TronGridProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Custom shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uColor: { value: new THREE.Color('#00D4FF') },
        uGridWidth: { value: 0.05 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vDistanceFromCenter;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          // Calculate distance from center for fading
          vDistanceFromCenter = length(position.xy);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uSize;
        uniform vec3 uColor;
        uniform float uGridWidth;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vDistanceFromCenter;
        
        void main() {
          // Scale UV to create grid
          float gridSize = 5.0;
          vec2 grid = fract(vPosition.xy / gridSize);
          
          // Create grid lines
          float lineWidth = uGridWidth;
          float gridX = smoothstep(lineWidth, 0.0, grid.x) + smoothstep(1.0 - lineWidth, 1.0, grid.x);
          float gridY = smoothstep(lineWidth, 0.0, grid.y) + smoothstep(1.0 - lineWidth, 1.0, grid.y);
          float gridPattern = max(gridX, gridY);
          
          // Distance-based fade
          float maxDistance = uSize * 0.5;
          float distanceFade = 1.0 - smoothstep(maxDistance * 0.6, maxDistance, vDistanceFromCenter);
          
          // Pulse animation from center
          float pulseFrequency = 2.0;
          float pulseSpeed = 1.5;
          float pulse = sin(vDistanceFromCenter * pulseFrequency - uTime * pulseSpeed) * 0.5 + 0.5;
          float pulseIntensity = 0.15;
          float pulseFactor = 1.0 + pulse * pulseIntensity * distanceFade;
          
          // Glow intensity
          float glowIntensity = gridPattern * distanceFade * pulseFactor;
          
          // Add extra glow around the lines
          float glow = pow(glowIntensity, 0.8) * 1.5;
          
          // Final color with glow
          vec3 finalColor = uColor * glow;
          
          // Alpha based on grid pattern and distance
          float alpha = glowIntensity * 0.8;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [size]);

  // Animate the time uniform
  useFrame((state) => {
    if (meshRef.current && shaderMaterial.uniforms.uTime) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
      material={shaderMaterial}
    >
      <planeGeometry args={[size, size, detail, detail]} />
    </mesh>
  );
}
