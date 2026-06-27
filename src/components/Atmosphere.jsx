/**
 * Atmosphere.jsx — Dreamy atmospheric effects for the scene (optimized for mobile/laptop).
 *
 * Performance Optimizations:
 *   1. Removed expensive procedural GPU shader 'RollingMist'.
 *   2. Removed pointLight instances from PaperLantern components to save draw calls.
 *   3. Reduced cherry blossom petal particle count from 70 to 30.
 *   4. Replaced CPU-bound buffer attribute updates in DustMotes with high-performance group rotation.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── Cherry Blossom Petals (Optimized) ───────────────────────────

const PETAL_COUNT = 30;
const PETAL_AREA = { x: 22, y: 14, z: 22 };
const PETAL_SPEED = 0.12;

function CherryBlossomPetals({ activeNodeId }) {
  const meshRef = useRef();
  const multiplierRef = useRef(1.0);

  const petals = useMemo(() => {
    const data = [];
    for (let i = 0; i < PETAL_COUNT; i++) {
      data.push({
        x: (Math.random() - 0.5) * PETAL_AREA.x,
        y: Math.random() * PETAL_AREA.y - 1,
        z: (Math.random() - 0.5) * PETAL_AREA.z,
        driftX: (Math.random() - 0.5) * 0.3,
        driftZ: (Math.random() - 0.5) * 0.3,
        fallSpeed: 0.05 + Math.random() * 0.08,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 0.3 + Math.random() * 0.5,
        swayFreq: 0.4 + Math.random() * 0.3,
        rotSpeed: (Math.random() - 0.5) * 2,
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    const targetMultiplier = activeNodeId ? 2.2 : 1.0;
    multiplierRef.current = THREE.MathUtils.lerp(multiplierRef.current, targetMultiplier, 0.05);

    petals.forEach((p, i) => {
      p.y -= p.fallSpeed * PETAL_SPEED * multiplierRef.current;

      const swayX = Math.sin(t * p.swayFreq * multiplierRef.current + p.swayPhase) * p.swayAmp * (0.6 + multiplierRef.current * 0.4);
      const swayZ = Math.cos(t * p.swayFreq * 0.7 * multiplierRef.current + p.swayPhase) * p.swayAmp * 0.6;

      if (p.y < -3) {
        p.y = PETAL_AREA.y * 0.5 + Math.random() * 2;
        p.x = (Math.random() - 0.5) * PETAL_AREA.x;
        p.z = (Math.random() - 0.5) * PETAL_AREA.z;
      }

      dummy.position.set(
        p.x + swayX + p.driftX * t * 0.1,
        p.y,
        p.z + swayZ + p.driftZ * t * 0.1,
      );
      dummy.rotation.set(
        t * p.rotSpeed * 0.5 * multiplierRef.current,
        t * p.rotSpeed * multiplierRef.current,
        Math.sin(t * 0.5 + p.swayPhase) * 0.5,
      );

      const scale = (0.06 + Math.random() * 0.01) * (0.9 + multiplierRef.current * 0.1);
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, PETAL_COUNT]}>
      <planeGeometry args={[1, 0.7, 1, 1]} />
      <meshStandardMaterial
        color="#f4b8c1"
        emissive="#e8919e"
        emissiveIntensity={0.2}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ─── Floating Japanese & English Wishes ───────────────────────────

const LYRICS = [
  'お誕生日おめでとう 🎂',
  '夢、輝き、笑顔 🌟',
  '花道を歩もう 🌸',
  '小春日和のように ☀️',
  '温もり 🍵',
  'Happy Birthday ✨',
];

function FloatingWishes() {
  const groupRef = useRef();

  const jpFontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-400-normal.woff';

  const textParticles = useMemo(() => {
    const data = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        text: LYRICS[i % LYRICS.length],
        x: (Math.random() - 0.5) * 12,
        y: Math.random() * 6 - 1,
        z: -2 + (Math.random() - 0.5) * 6,
        speed: 0.008 + Math.random() * 0.012,
        swaySpeed: 1.0 + Math.random() * 1.5,
        swayAmp: 0.15 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        fontSize: 0.18 + Math.random() * 0.08,
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const p = textParticles[i];
      if (!p) return;

      p.y += p.speed;
      const sway = Math.sin(t * p.swaySpeed + p.phase) * p.swayAmp;

      if (p.y > 6.0) {
        p.y = -1.5;
        p.x = (Math.random() - 0.5) * 12;
      }

      child.position.set(p.x + sway, p.y, p.z);

      let opacity = 0.5;
      if (p.y < 0.0) {
        opacity = 0.5 * ((p.y + 1.5) / 1.5);
      } else if (p.y > 4.0) {
        opacity = 0.5 * (1.0 - (p.y - 4.0) / 2.0);
      }
      child.fillOpacity = Math.max(0, Math.min(0.5, opacity));
    });
  });

  return (
    <group ref={groupRef}>
      {textParticles.map((p, idx) => (
        <Text
          key={idx}
          text={p.text}
          fontSize={p.fontSize}
          color="#ffe5b4"
          font={jpFontUrl}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.3}
          depthWrite={false}
        />
      ))}
    </group>
  );
}

// ─── Floating 3D Origami Cranes ───────────────────────────────────

function OrigamiCraneModel({ color, opacity }) {
  return (
    <group>
      {/* Main body diamond / center fold */}
      <mesh castShadow receiveShadow>
        <coneGeometry args={[0.2, 0.5, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      </mesh>
      
      {/* Left Wing - flat angled plane */}
      <mesh position={[-0.2, 0.1, 0]} rotation={[0.4, 0, -0.6]} castShadow>
        <boxGeometry args={[0.4, 0.01, 0.25]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          transparent
          opacity={opacity + 0.02}
          depthWrite={false}
        />
      </mesh>
      
      {/* Right Wing - flat angled plane */}
      <mesh position={[0.2, 0.1, 0]} rotation={[0.4, 0, 0.6]} castShadow>
        <boxGeometry args={[0.4, 0.01, 0.25]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          transparent
          opacity={opacity + 0.02}
          depthWrite={false}
        />
      </mesh>

      {/* Head/Neck */}
      <mesh position={[0, 0.22, 0.18]} rotation={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.35, 0.04]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      </mesh>

      {/* Tail */}
      <mesh position={[0, 0.18, -0.2]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.03, 0.3, 0.03]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function FloatingOrigamiCranes() {
  const groupRef = useRef();

  const cranes = useMemo(() => [
    { pos: [-6, 2, -13], scale: 1.0, color: '#ffb3c1', speed: 0.4 }, // cherry blossom pink
    { pos: [5, 3.5, -12], scale: 1.2, color: '#ffe5ec', speed: 0.35 }, // soft rose
    { pos: [-1, 4.5, -14], scale: 1.1, color: '#d8e2dc', speed: 0.5 }, // sage/mint crane
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, i) => {
      const config = cranes[i];
      if (!config) return;
      child.position.y = config.pos[1] + Math.sin(t * config.speed + i) * 0.35;
      child.rotation.y = Math.sin(t * 0.2 + i) * 0.15;
      child.rotation.z = Math.sin(t * 0.4 + i) * 0.05;
    });
  });

  return (
    <group ref={groupRef}>
      {cranes.map((c, idx) => (
        <group key={idx} position={c.pos} scale={c.scale}>
          <OrigamiCraneModel color={c.color} opacity={0.15} />
        </group>
      ))}
    </group>
  );
}

// ─── Dust Motes (Optimized to avoid CPU-to-GPU memory transfer) ──

const MOTE_COUNT = 50;
const MOTE_AREA = { x: 18, y: 10, z: 18 };

function DustMotes() {
  const pointsRef = useRef();

  const { positions } = useMemo(() => {
    const pos = new Float32Array(MOTE_COUNT * 3);
    for (let i = 0; i < MOTE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * MOTE_AREA.x;
      pos[i * 3 + 1] = Math.random() * MOTE_AREA.y - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * MOTE_AREA.z;
    }
    return { positions: pos };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    // Rotate the group slowly instead of updating coordinates on the CPU
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = t * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={MOTE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffe8cc"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Paper Lantern Glow Orb (Optimized) ──────────────────────────

function PaperLantern({ position = [-5, 3.5, -4], pulseSpeed = 1.2, floatOffset = 0, sizeScale = 1.0, theme = 'cream' }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 0.8 + floatOffset) * 0.18;
      const pulse = 1 + Math.sin(t * pulseSpeed) * 0.05 + Math.sin(t * 3.7) * 0.02;
      meshRef.current.scale.setScalar(pulse * sizeScale);
    }
  });

  const colors = useMemo(() => {
    switch (theme) {
      case 'blush':
        return { paper: '#ffd1dc', glow: '#ff758c', light: '#ffb3c1' };
      case 'sage':
        return { paper: '#e2efda', glow: '#6b8e23', light: '#c2f0c2' };
      case 'peach':
        return { paper: '#ffe5b4', glow: '#ff7f50', light: '#ffd8a8' };
      default: // cream
        return { paper: '#fdfefe', glow: '#ffb74d', light: '#ffe8a3' };
    }
  }, [theme]);

  return (
    <group position={position}>
      <group ref={meshRef}>
        {/* Soft outer halo */}
        <mesh scale={1.6}>
          <cylinderGeometry args={[0.22, 0.36, 0.65, 8]} />
          <meshStandardMaterial
            color={colors.light}
            emissive={colors.glow}
            emissiveIntensity={0.4}
            transparent
            opacity={0.06}
            depthWrite={false}
          />
        </mesh>

        {/* 3D Folded Lantern Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.34, 0.65, 8]} />
          <meshStandardMaterial
            color={colors.paper}
            emissive={colors.glow}
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
            roughness={0.9}
          />
        </mesh>

        {/* Top Wood Trim Cap */}
        <mesh position={[0, 0.33, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.03, 8]} />
          <meshStandardMaterial color="#5c4033" roughness={0.7} />
        </mesh>

        {/* Bottom Wood Trim Cap */}
        <mesh position={[0, -0.33, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.03, 8]} />
          <meshStandardMaterial color="#5c4033" roughness={0.7} />
        </mesh>

        {/* Hanging Tassel */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.2, 6]} />
          <meshStandardMaterial color="#c0392b" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Exported Atmosphere Group ───────────────────────────────────

export default function Atmosphere({ activeNodeId }) {
  return (
    <group>
      <CherryBlossomPetals activeNodeId={activeNodeId} />
      <DustMotes />
      <FloatingWishes />
      <FloatingOrigamiCranes />

      {/* ── 5 Paper Lanterns (Warm emissive mesh glowing, no pointLights) ── */}
      <PaperLantern position={[-5, 3.5, -4]} pulseSpeed={1.1} floatOffset={0} sizeScale={1.2} theme="cream" />
      <PaperLantern position={[6, 4.2, -5]} pulseSpeed={1.3} floatOffset={2.5} sizeScale={1.0} theme="blush" />
      <PaperLantern position={[-2, 5.2, -6.5]} pulseSpeed={0.9} floatOffset={1.0} sizeScale={1.4} theme="sage" />
      <PaperLantern position={[3, 3.6, -4.2]} pulseSpeed={1.4} floatOffset={4.0} sizeScale={0.9} theme="peach" />
      <PaperLantern position={[-7.5, 2.3, -2.5]} pulseSpeed={1.0} floatOffset={5.5} sizeScale={1.1} theme="blush" />
    </group>
  );
}
