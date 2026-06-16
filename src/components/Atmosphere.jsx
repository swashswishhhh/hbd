/**
 * Atmosphere.jsx — Dreamy atmospheric effects for the scene.
 *
 * Includes:
 *   • Cherry blossom petal particle system — falls faster and sways more
 *     dynamically when user explores the nodes.
 *   • Floating K-pop Lyrics & Birthday Wishes — text particles that drift upwards.
 *   • Floating Hanbok Silhouettes — barely visible traditional silhouettes in the background.
 *   • 5 Paper Lanterns — glowing warm accents floating at varying heights.
 *   • Rolling Mist — slow, undulating low-altitude fog layers.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── Cherry Blossom Petals ───────────────────────────────────────

const PETAL_COUNT = 70;
const PETAL_AREA = { x: 22, y: 14, z: 22 };
const PETAL_SPEED = 0.12;

function CherryBlossomPetals({ activeNodeId }) {
  const meshRef = useRef();
  const multiplierRef = useRef(1.0);

  // Pre-compute random positions, velocities, and phases
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

    // Smoothly interpolate the intensity multiplier based on active node state
    const targetMultiplier = activeNodeId ? 2.2 : 1.0;
    multiplierRef.current = THREE.MathUtils.lerp(multiplierRef.current, targetMultiplier, 0.05);

    petals.forEach((p, i) => {
      // Update position with intensity multiplier
      p.y -= p.fallSpeed * PETAL_SPEED * multiplierRef.current;

      const swayX = Math.sin(t * p.swayFreq * multiplierRef.current + p.swayPhase) * p.swayAmp * (0.6 + multiplierRef.current * 0.4);
      const swayZ = Math.cos(t * p.swayFreq * 0.7 * multiplierRef.current + p.swayPhase) * p.swayAmp * 0.6;

      // Reset when below floor
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

      // Make particles slightly bigger/fuller when active exploration is happening
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

// ─── Floating K-pop Lyrics & Birthday Wishes ──────────────────────

const LYRICS = [
  '생일 축하해 🎂',
  'Shine, dream, smile 🌟',
  '꽃길만 걷자 🌸',
  '봄날의 햇살처럼 ☀️',
  'Cozy Moments 🍵',
  'Happy Birthday ✨',
];

function FloatingWishes() {
  const groupRef = useRef();

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

      // Drift upwards
      p.y += p.speed;

      // Horizontal sway
      const sway = Math.sin(t * p.swaySpeed + p.phase) * p.swayAmp;

      // Reset when floating too high
      if (p.y > 6.0) {
        p.y = -1.5;
        p.x = (Math.random() - 0.5) * 12;
      }

      child.position.set(p.x + sway, p.y, p.z);

      // Fade opacity based on height (fades out at bottom and top)
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
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.3}
          depthWrite={false}
        />
      ))}
    </group>
  );
}

// ─── Floating Hanbok Silhouettes ─────────────────────────────────

function FloatingHanboks() {
  const groupRef = useRef();

  const hanboks = useMemo(() => [
    { pos: [-6, 2, -13], scale: 0.8, color: '#fcd34d', speed: 0.4 },
    { pos: [5, 3.5, -12], scale: 1.0, color: '#fca5a5', speed: 0.35 },
    { pos: [-1, 4.5, -14], scale: 0.9, color: '#a7f3d0', speed: 0.5 },
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, i) => {
      const config = hanboks[i];
      if (!config) return;
      // Gentle floating up and down
      child.position.y = config.pos[1] + Math.sin(t * config.speed + i) * 0.25;
      child.rotation.y = Math.sin(t * 0.2 + i) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {hanboks.map((h, idx) => (
        <group key={idx} position={h.pos} scale={h.scale}>
          {/* Skirt (Chima) - Cone */}
          <mesh>
            <coneGeometry args={[0.6, 1.2, 16]} />
            <meshStandardMaterial
              color={h.color}
              transparent
              opacity={0.07}
              depthWrite={false}
            />
          </mesh>
          {/* Jacket (Jeogori) - Cylinder */}
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.22, 0.26, 0.25, 12]} />
            <meshStandardMaterial
              color="#fafafa"
              transparent
              opacity={0.06}
              depthWrite={false}
            />
          </mesh>
          {/* Sash Ribbons (Otgoreum) */}
          <mesh position={[0, 0.5, 0.22]} rotation={[0.2, 0, 0.1]}>
            <boxGeometry args={[0.06, 0.5, 0.01]} />
            <meshStandardMaterial
              color={h.color}
              transparent
              opacity={0.08}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Dust Motes ──────────────────────────────────────────────────

const MOTE_COUNT = 100;
const MOTE_AREA = { x: 18, y: 10, z: 18 };

function DustMotes() {
  const pointsRef = useRef();

  const { positions, phases, speeds } = useMemo(() => {
    const pos = new Float32Array(MOTE_COUNT * 3);
    const ph = new Float32Array(MOTE_COUNT);
    const sp = new Float32Array(MOTE_COUNT);

    for (let i = 0; i < MOTE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * MOTE_AREA.x;
      pos[i * 3 + 1] = Math.random() * MOTE_AREA.y - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * MOTE_AREA.z;
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.2 + Math.random() * 0.5;
    }
    return { positions: pos, phases: ph, speeds: sp };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < MOTE_COUNT; i++) {
      const idx = i * 3;
      posAttr.array[idx + 1] += Math.sin(t * speeds[i] + phases[i]) * 0.001;
      posAttr.array[idx] += Math.cos(t * speeds[i] * 0.5 + phases[i]) * 0.0008;
    }
    posAttr.needsUpdate = true;
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
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Paper Lantern Glow Orb ──────────────────────────────────────

function PaperLantern({ position = [-5, 3.5, -4], pulseSpeed = 1.2, floatOffset = 0, sizeScale = 1.0, theme = 'cream' }) {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Gentle floating
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 0.8 + floatOffset) * 0.18;
      const pulse = 1 + Math.sin(t * pulseSpeed) * 0.05 + Math.sin(t * 3.7) * 0.02;
      meshRef.current.scale.setScalar(pulse * sizeScale);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.8 + Math.sin(t * (pulseSpeed * 1.2)) * 0.3;
    }
  });

  // Theme-based colors (Korean paper aesthetics)
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

      {/* Warm point light from the lantern */}
      <pointLight
        ref={lightRef}
        color="#ffc078"
        intensity={2.0}
        distance={10}
        decay={2}
      />
    </group>
  );
}

// ─── Rolling Mist ────────────────────────────────────────────────

function RollingMist() {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ebdcb9') },
  }), []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 0]}>
      <planeGeometry args={[40, 40, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vWorldPos;
          void main() {
            vUv = uv;
            vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          varying vec3 vWorldPos;
 
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
          }

          void main() {
            vec2 uv = vWorldPos.xz * 0.1;
            float n = noise(uv + vec2(uTime * 0.03, uTime * 0.01));
            float n2 = noise(uv * 2.5 - vec2(uTime * 0.015, uTime * 0.02));
            float density = mix(n, n2, 0.5);
            density = smoothstep(0.3, 0.8, density) * 0.12;

            float dist = length(vWorldPos.xz);
            float fade = 1.0 - smoothstep(10.0, 20.0, dist);

            gl_FragColor = vec4(uColor, density * fade);
          }
        `}
      />
    </mesh>
  );
}

// ─── Exported Atmosphere Group ───────────────────────────────────

export default function Atmosphere({ activeNodeId }) {
  return (
    <group>
      <CherryBlossomPetals activeNodeId={activeNodeId} />
      <DustMotes />
      <FloatingWishes />
      <FloatingHanboks />

      {/* ── 5 Paper Lanterns ── */}
      <PaperLantern position={[-5, 3.5, -4]} pulseSpeed={1.1} floatOffset={0} sizeScale={1.2} theme="cream" />
      <PaperLantern position={[6, 4.2, -5]} pulseSpeed={1.3} floatOffset={2.5} sizeScale={1.0} theme="blush" />
      <PaperLantern position={[-2, 5.2, -6.5]} pulseSpeed={0.9} floatOffset={1.0} sizeScale={1.4} theme="sage" />
      <PaperLantern position={[3, 3.6, -4.2]} pulseSpeed={1.4} floatOffset={4.0} sizeScale={0.9} theme="peach" />
      <PaperLantern position={[-7.5, 2.3, -2.5]} pulseSpeed={1.0} floatOffset={5.5} sizeScale={1.1} theme="blush" />

      <RollingMist />
    </group>
  );
}
