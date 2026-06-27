/**
 * WishJarModel.jsx — A soft glowing glass jar filled with secret wishes.
 *
 * Renders:
 *   • A high-transmission glass physical jar
 *   • A wooden cork lid
 *   • Folded paper wish scrolls nestled inside (replacing simple stars)
 *   • A fluttering drop animation when a new wish is created
 *   • An active breathing orange/gold point light inside
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Folded Wish Paper Note Component with animations ───────────────
function WishPaper({ color, position, rotation, scale, animateIn, startY = 0.35 }) {
  const meshRef = useRef();

  // Random offsets for individual organic floating motion
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const rotSpeed = useMemo(() => 0.05 + Math.random() * 0.05, []);
  const floatSpeed = useMemo(() => 1.2 + Math.random() * 0.6, []);
  const floatAmp = useMemo(() => 0.015 + Math.random() * 0.008, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!meshRef.current) return;

    if (animateIn) {
      if (!meshRef.current.startTime) {
        meshRef.current.startTime = t;
      }
      const elapsed = t - meshRef.current.startTime;
      const duration = 1.6; // 1.6 seconds transition time
      const progress = Math.min(1.0, elapsed / duration);

      // Cubic ease-out descent
      const easeProgress = 1.0 - Math.pow(1.0 - progress, 3.0);

      const currentY = THREE.MathUtils.lerp(startY, position[1], easeProgress);
      // Fluttering sway during descent
      const flutterX = progress < 1.0 ? Math.sin(t * 10.0 + floatOffset) * 0.12 * (1.0 - progress) : 0;
      const flutterZ = progress < 1.0 ? Math.cos(t * 8.0 + floatOffset) * 0.12 * (1.0 - progress) : 0;

      meshRef.current.position.set(
        position[0] + flutterX,
        currentY,
        position[2] + flutterZ
      );

      // Spin rapidly during descent
      if (progress < 1.0) {
        meshRef.current.rotation.set(
          rotation[0] + t * 4.0 * (1.0 - progress),
          rotation[1] + t * 6.0 * (1.0 - progress),
          rotation[2]
        );
      } else {
        // Descent complete -> hover gently
        const floatY = Math.sin(t * floatSpeed + floatOffset) * floatAmp;
        meshRef.current.position.set(position[0], position[1] + floatY, position[2]);
        meshRef.current.rotation.set(rotation[0], rotation[1] + t * rotSpeed, rotation[2]);
      }
    } else {
      // Gentle floating animation for already existing papers
      const floatY = Math.sin(t * floatSpeed + floatOffset) * floatAmp;
      meshRef.current.position.set(position[0], position[1] + floatY, position[2]);
      meshRef.current.rotation.set(rotation[0], rotation[1] + t * rotSpeed, rotation[2]);
    }
  });

  return (
    <group ref={meshRef} scale={scale * 1.6}>
      <group rotation={[0.2, 0.1, 0.4]}>
        {/* Main folded paper strip */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.03, 1.2]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        {/* Golden tied thread/ribbon */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#d4af37" roughness={0.5} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export default function WishJarModel({ hovered = false, isActive = false, wishes = [] }) {
  const lightRef = useRef();
  const starsRef = useRef();

  // Track initial wishes to avoid animating existing ones on load
  const initialWishIds = useRef(new Set(wishes.map((w) => w.id)));

  // Pulse internal light intensity to simulate magical glowing elements
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lightRef.current) {
      const baseIntensity = hovered ? 3.0 : isActive ? 2.5 : 1.2;
      lightRef.current.intensity = baseIntensity + Math.sin(t * 2.0) * 0.4;
    }
    if (starsRef.current) {
      // Gentle spin of the entire inside contents
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

  // Map active wishes to position slots
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

      {/* ── Wishes (Folded Paper Scrolls) Inside ── */}
      <group ref={starsRef} position={[0, 0, 0]}>
        {starList.map((star) => (
          <WishPaper
            key={star.id}
            color={star.col}
            position={star.pos}
            rotation={star.rot}
            scale={star.scale}
            animateIn={!initialWishIds.current.has(star.id)}
          />
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
