import { GlowMaterial } from '../effects/GlowMaterial';

interface CyberdeckProps {
  position?: [number, number, number];
}

export function Cyberdeck({ position = [0, 0, 0] }: CyberdeckProps) {
  return (
    <group position={position}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[2, 0.3, 1]} />
        <GlowMaterial color="#1A1A2E" intensity={0.5} />
      </mesh>

      {/* Edge trim boxes - 4 corners */}
      {/* Front left */}
      <mesh position={[-0.9, 0, 0.45]}>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <GlowMaterial color="#00D4FF" intensity={2.0} />
      </mesh>

      {/* Front right */}
      <mesh position={[0.9, 0, 0.45]}>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <GlowMaterial color="#00D4FF" intensity={2.0} />
      </mesh>

      {/* Back left */}
      <mesh position={[-0.9, 0, -0.45]}>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <GlowMaterial color="#00D4FF" intensity={2.0} />
      </mesh>

      {/* Back right */}
      <mesh position={[0.9, 0, -0.45]}>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <GlowMaterial color="#00D4FF" intensity={2.0} />
      </mesh>

      {/* Status lights */}
      {/* Cyan light 1 */}
      <mesh position={[-0.6, 0.16, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <GlowMaterial color="#00D4FF" intensity={2.0} />
      </mesh>

      {/* Cyan light 2 */}
      <mesh position={[-0.4, 0.16, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <GlowMaterial color="#00D4FF" intensity={2.0} />
      </mesh>

      {/* Orange light */}
      <mesh position={[-0.2, 0.16, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <GlowMaterial color="#FF8C00" intensity={2.0} />
      </mesh>
    </group>
  );
}
