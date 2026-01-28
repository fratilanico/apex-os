'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useAdaptivePerformance } from '../../../hooks/useAdaptivePerformance';

interface DataStreamsProps {
  count?: number;
  radius?: number;
  height?: number;
  speed?: number;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
}

export function DataStreams({
  count = 50,
  radius = 20,
  height = 30,
  speed = 0.02,
}: DataStreamsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Particle[]>([]);
  const { quality } = useAdaptivePerformance();

  // Initialize particles with random positions and velocities
  const particles = useMemo(() => {
    const temp: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      // Random position in cylinder
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = Math.random() * height - height / 2;
      
      temp.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(0, speed * (0.5 + Math.random() * 0.5), 0),
        scale: 0.05 + Math.random() * 0.1,
      });
    }
    
    particlesRef.current = temp;
    return temp;
  }, [count, radius, height, speed]);

  // Initialize instance matrices
  useMemo(() => {
    if (!meshRef.current) return;
    
    const matrix = new THREE.Matrix4();
    particles.forEach((particle, i) => {
      matrix.makeScale(particle.scale, particle.scale, particle.scale);
      matrix.setPosition(particle.position);
      meshRef.current!.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [particles]);

  // Animate particles
  useFrame(() => {
    if (!meshRef.current) return;
    
    const matrix = new THREE.Matrix4();
    const effectiveSpeed = quality === 'low' ? speed * 0.5 : speed;
    
    particlesRef.current.forEach((particle, i) => {
      // Update position
      particle.position.y += particle.velocity.y * effectiveSpeed * 60;
      
      // Respawn at bottom when reaching top
      if (particle.position.y > height / 2) {
        particle.position.y = -height / 2;
        
        // Randomize horizontal position on respawn
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        particle.position.x = Math.cos(angle) * r;
        particle.position.z = Math.sin(angle) * r;
      }
      
      // Update instance matrix
      matrix.makeScale(particle.scale, particle.scale, particle.scale);
      matrix.setPosition(particle.position);
      meshRef.current!.setMatrixAt(i, matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#00D4FF"
        emissive="#00D4FF"
        emissiveIntensity={0.8}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
