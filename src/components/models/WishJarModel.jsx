/**
 * WishJarModel.jsx — A soft glowing glass jar filled with secret wishes.
 *
 * Renders:
 *   • A high-transmission glass physical jar
 *   • A wooden cork lid
 *   • Five colorful folded wish stars nestled inside
 *   • An active breathing orange/gold point light inside
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WishJarModel({ hovered = false, isActive = false, wishes = [] }) {
  const lightRef = useRef();
  const starsRef = useRef();

  // Pulse the internal light intensity to look like breathing fireflies
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lightRef.current) {
      const baseIntensity = hovered ? 3.0 : isActive ? 2.5 : 1.2;
      lightRef.current.intensity = baseIntensity + Math.sin(t * 2.0) * 0.4;
    }
    if (starsRef.current) {
      // Gentle spin of the stars inside
      starsRef.current.rotation.y = t * 0.05;
    }
  });

  // Pre-defined relative coordinates inside the cylinder jar (diameter ~0.8, height ~0.8)
  const starPositions = useMemo(() => [
    { pos: [-0.15, -0.22, 0.0], rot: [0.5, 0.2, 0.8], scale: 0.06 },
    { pos: [0.12, -0.25, -0.1], rot: [1.2, -0.5, 0.3], scale: 0.05 },
    { pos: [-0.03, -0.28, 0.12], rot: [-0.4, 0.9, -1.1], scale: 0.055 },
    { pos: [0.08, -0.15, 0.08], rot: [0.3, -0.2, 0.5], scale: 0.05 },
    { pos: [-0.08, -0.12, -0.08], rot: [-0.8, 0.4, 0.9], scale: 0.06 },
    { pos: [0.02, -0.05, -0.02], rot: [0.1, 0.8, -0.4], scale: 0.045 },
    { pos: [-0.12, -0.3, -0.08], rot: [0.7, -0.7, 0.2], scale: 0.05 },
    { pos: [0.1, -0.32, 0.08], rot: [-0.2, 0.4, 0.9], scale: 0.055 },
    { pos: [-0.05, -0.18, -0.12], rot: [0.9, 0.1, -0.5], scale: 0.045 },
    { pos: [0.15, -0.1, -0.05], rot: [-0.5, -0.6, 0.8], scale: 0.05 },
    { pos: [-0.14, -0.02, 0.05], rot: [0.3, 0.9, 0.2], scale: 0.06 },
    { pos: [0.05, 0.05, 0.1], rot: [1.1, -0.2, -0.8], scale: 0.055 },
    { pos: [-0.02, 0.08, -0.09], rot: [-0.6, 0.5, 0.4], scale: 0.05 },
    { pos: [0.08, 0.12, -0.02], rot: [0.2, -0.8, -0.1], scale: 0.048 },
    { pos: [-0.06, 0.18, 0.06], rot: [0.8, 0.3, 0.7], scale: 0.052 },
  ], []);

  // Map active wishes to star positions
  const starList = useMemo(() => {
    return wishes.map((wish, idx) => {
      const slot = starPositions[idx % starPositions.length];
      return {
        ...slot,
        col: wish.color || '#ffadad',
        id: wish.id
      };
    });
  }, [wishes, starPositions]);

  return (
    <group>
      {/* ── Wooden Stand / Pedestal ── */}
      <mesh castShadow receiveShadow position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.12, 16]} />
        <meshStandardMaterial color="#6b5037" roughness={0.7} />
      </mesh>

      {/* ── Wooden Wall-mount Bracket ── */}
      <group position={[0, -0.65, -0.2]}>
        {/* Shelf plank */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.06, 0.7]} />
          <meshStandardMaterial color="#8b7355" roughness={0.7} />
        </mesh>
        {/* Supporting bracket */}
        <mesh position={[0, -0.2, -0.25]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.2]} />
          <meshStandardMaterial color="#8b7355" roughness={0.8} />
        </mesh>
      </group>

      {/* ── Glass Jar Body ── */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.8, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2f1"
          transmission={0.9}
          opacity={0.3}
          transparent
          roughness={0.05}
          thickness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Jar base plate */}
      <mesh position={[0, -0.38, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.04, 24]} />
        <meshPhysicalMaterial
          color="#e0f2f1"
          transmission={0.9}
          opacity={0.3}
          transparent
          roughness={0.05}
          thickness={0.8}
        />
      </mesh>

      {/* ── Cork Lid ── */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.34, 0.36, 0.1, 20]} />
        <meshStandardMaterial color="#b38f6d" roughness={0.9} />
      </mesh>

      {/* ── Wishes (Paper Stars) Inside ── */}
      <group ref={starsRef} position={[0, 0, 0]}>
        {starList.map((star) => (
          <mesh
            key={star.id}
            position={star.pos}
            rotation={star.rot}
            scale={star.scale}
            castShadow
          >
            {/* An octahedron makes a lovely geometric star shape */}
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={star.col}
              emissive={star.col}
              emissiveIntensity={hovered ? 0.6 : 0.3}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* ── Breathing Glow Light ── */}
      <pointLight
        ref={lightRef}
        color="#ffa200"
        intensity={1.5}
        distance={6}
        decay={2}
        position={[0, 0, 0]}
      />
    </group>
  );
}
