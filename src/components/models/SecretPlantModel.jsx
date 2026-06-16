import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SecretPlantModel({ hovered = false, isActive = false, isClose = false }) {
  const glowLightRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (glowLightRef.current) {
      // Intensify the glow when close, hovered, or active
      const baseIntensity = hovered ? 2.5 : isActive ? 2.0 : isClose ? 1.2 : 0.4;
      glowLightRef.current.intensity = baseIntensity + Math.sin(t * 3.0) * 0.2;
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* ── Pot ── */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.22, 0.4, 16]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.6} />
      </mesh>
      {/* Decorative colored rim strip (washi style) */}
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.305, 0.305, 0.04, 16]} />
        <meshStandardMaterial color="#81b29a" roughness={0.5} />
      </mesh>

      {/* ── Soil ── */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
        <meshStandardMaterial color="#4a3c31" roughness={0.9} />
      </mesh>

      {/* ── Succulent Lotus Geometry ── */}
      <group position={[0, 0.4, 0]}>
        {/* Layer 1 (Outer Petals) */}
        <mesh rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.15, 0.04, 0.25]} />
          <meshStandardMaterial color="#5e8061" roughness={0.5} />
        </mesh>
        <mesh rotation={[0.4, Math.PI / 3, 0]} castShadow>
          <boxGeometry args={[0.15, 0.04, 0.25]} />
          <meshStandardMaterial color="#5e8061" roughness={0.5} />
        </mesh>
        <mesh rotation={[0.4, (2 * Math.PI) / 3, 0]} castShadow>
          <boxGeometry args={[0.15, 0.04, 0.25]} />
          <meshStandardMaterial color="#5e8061" roughness={0.5} />
        </mesh>
        <mesh rotation={[0.4, Math.PI, 0]} castShadow>
          <boxGeometry args={[0.15, 0.04, 0.25]} />
          <meshStandardMaterial color="#5e8061" roughness={0.5} />
        </mesh>
        <mesh rotation={[0.4, (-Math.PI) / 3, 0]} castShadow>
          <boxGeometry args={[0.15, 0.04, 0.25]} />
          <meshStandardMaterial color="#5e8061" roughness={0.5} />
        </mesh>
        <mesh rotation={[0.4, (-2 * Math.PI) / 3, 0]} castShadow>
          <boxGeometry args={[0.15, 0.04, 0.25]} />
          <meshStandardMaterial color="#5e8061" roughness={0.5} />
        </mesh>

        {/* Layer 2 (Inner Petals) */}
        <group position={[0, 0.06, 0]} scale={0.8}>
          <mesh rotation={[0.2, 0.5, 0.1]} castShadow>
            <boxGeometry args={[0.12, 0.04, 0.2]} />
            <meshStandardMaterial color="#6a947c" roughness={0.5} />
          </mesh>
          <mesh rotation={[0.2, 0.5 + Math.PI / 3, 0.1]} castShadow>
            <boxGeometry args={[0.12, 0.04, 0.2]} />
            <meshStandardMaterial color="#6a947c" roughness={0.5} />
          </mesh>
          <mesh rotation={[0.2, 0.5 + (2 * Math.PI) / 3, 0.1]} castShadow>
            <boxGeometry args={[0.12, 0.04, 0.2]} />
            <meshStandardMaterial color="#6a947c" roughness={0.5} />
          </mesh>
          <mesh rotation={[0.2, 0.5 + Math.PI, 0.1]} castShadow>
            <boxGeometry args={[0.12, 0.04, 0.2]} />
            <meshStandardMaterial color="#6a947c" roughness={0.5} />
          </mesh>
          <mesh rotation={[0.2, 0.5 - Math.PI / 3, 0.1]} castShadow>
            <boxGeometry args={[0.12, 0.04, 0.2]} />
            <meshStandardMaterial color="#6a947c" roughness={0.5} />
          </mesh>
          <mesh rotation={[0.2, 0.5 - (2 * Math.PI) / 3, 0.1]} castShadow>
            <boxGeometry args={[0.12, 0.04, 0.2]} />
            <meshStandardMaterial color="#6a947c" roughness={0.5} />
          </mesh>
        </group>

        {/* Lotus center bud */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#dca9a7" roughness={0.4} /> {/* blush pink tips */}
        </mesh>
      </group>

      {/* ── Soft Fairy Glow Light ── */}
      <pointLight
        ref={glowLightRef}
        color="#a8e6cf" // soft mint-green glow
        intensity={0.5}
        distance={3}
        decay={2}
        position={[0, 0.7, 0]}
      />
    </group>
  );
}
