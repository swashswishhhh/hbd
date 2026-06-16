/**
 * TimeCapsuleModel.jsx — Hidden Time Capsule.
 *
 * Renders:
 *   • A brass/copper cylindrical canister
 *   • A glass viewport showing a rolled parchment scroll inside
 *   • An active glowing point light to draw attention when revealed
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TimeCapsuleModel({ hovered = false, isActive = false }) {
  const capRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (capRef.current) {
      // Gentle floating/wobble for the scroll inside
      capRef.current.rotation.y = t * 0.2;
      capRef.current.position.y = Math.sin(t * 2) * 0.02;
    }
    if (lightRef.current) {
      // Shimmering glow
      lightRef.current.intensity = (hovered ? 3.0 : 1.5) + Math.cos(t * 3) * 0.3;
    }
  });

  const brassMaterial = (
    <meshStandardMaterial
      color="#d4af37"
      metalness={0.8}
      roughness={0.2}
      emissive="#b8860b"
      emissiveIntensity={hovered ? 0.3 : 0.1}
    />
  );

  const glassMaterial = (
    <meshPhysicalMaterial
      color="#e0f7fa"
      transmission={0.85}
      transparent
      opacity={0.3}
      roughness={0.1}
      thickness={0.5}
      side={THREE.DoubleSide}
    />
  );

  return (
    <group ref={capRef}>
      {/* Capsule Base Plate */}
      <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.08, 16]} />
        {brassMaterial}
      </mesh>

      {/* Capsule Top Lid */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.26, 0.3, 0.08, 16]} />
        {brassMaterial}
      </mesh>
      {/* Top ring handle */}
      <mesh position={[0, 0.48, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        {brassMaterial}
      </mesh>

      {/* Glass Cylinder Core */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.72, 16, 1, true]} />
        {glassMaterial}
      </mesh>

      {/* ── Scroll Inside ── */}
      <group position={[0, -0.1, 0]} rotation={[0.1, 0, 0.05]}>
        {/* Paper scroll tube */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.45, 12]} />
          <meshStandardMaterial color="#f5ebe0" roughness={0.8} />
        </mesh>
        {/* Red ribbon tie */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.086, 0.086, 0.05, 12]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.5} />
        </mesh>
      </group>

      {/* ── Shimmering Light Glow ── */}
      <pointLight
        ref={lightRef}
        color="#ffd54f"
        intensity={1.5}
        distance={5}
        decay={2}
        position={[0, 0, 0]}
      />
    </group>
  );
}
