import { useRef, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface HoloPanelProps {
  width?: number;
  height?: number;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  children?: ReactNode;
}

export function HoloPanel({
  width = 4,
  height = 3,
  color = '#00D4FF',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  children,
}: HoloPanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Subtle float animation with sine wave
  useFrame((_, delta) => {
    if (groupRef.current) {
      timeRef.current += delta;
      groupRef.current.position.y = position[1] + Math.sin(timeRef.current * 2) * 0.05;
    }
  });

  // Create border frame geometry using line segments
  const borderPoints = [
    new THREE.Vector3(-width / 2, -height / 2, 0),
    new THREE.Vector3(width / 2, -height / 2, 0),
    new THREE.Vector3(width / 2, height / 2, 0),
    new THREE.Vector3(-width / 2, height / 2, 0),
    new THREE.Vector3(-width / 2, -height / 2, 0),
  ];

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Glowing border frame */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(borderPoints.flatMap((p) => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={2} />
      </line>

      {/* Enhanced glow effect using additional line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(borderPoints.flatMap((p) => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={4} transparent opacity={0.3} />
      </line>

      {/* Transparent center for content */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Content overlay */}
      {children && (
        <Html
          center
          distanceFactor={10}
          style={{
            width: `${width * 100}px`,
            height: `${height * 100}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
        >
          {children}
        </Html>
      )}
    </group>
  );
}
