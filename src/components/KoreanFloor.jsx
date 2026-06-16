/**
 * KoreanFloor.jsx — Stylized warm wooden floor with faint grain detail.
 *
 * Creates a large floor plane with a procedural warm honey-tone
 * wooden material. Uses subtle normal perturbation and color
 * variation via shader to suggest wood grain, without needing
 * external texture files.
 *
 * The floor receives shadows and has soft ambient occlusion to
 * feel grounded and cozy — inspired by Korean café / hanok flooring.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Floor configuration ─────────────────────────────────────────

const FLOOR_SIZE = 30;
const FLOOR_Y = -2;

/**
 * Custom shader material that renders a warm wooden floor
 * with procedural grain lines and subtle color variation.
 */
function WoodFloorMaterial() {
  const uniforms = useMemo(
    () => ({
      uColor1: { value: new THREE.Color('#c8a87c') },   // warm honey
      uColor2: { value: new THREE.Color('#b8956a') },   // darker grain
      uColor3: { value: new THREE.Color('#dfc5a0') },   // light highlight
      uTileColor: { value: new THREE.Color('#d4b896') }, // tile accent
    }),
    [],
  );

  return (
    <shaderMaterial
      uniforms={uniforms}
      transparent
      side={THREE.FrontSide}
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
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uTileColor;
        varying vec2 vUv;
        varying vec3 vWorldPos;

        // Simple pseudo-random
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        // Value noise
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));

          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          vec2 wp = vWorldPos.xz;

          // === Wood plank pattern ===
          // Create plank boundaries (long horizontal planks)
          float plankWidth = 2.5;
          float plankLength = 8.0;

          // Offset every other row for a staggered look
          float row = floor(wp.y / plankWidth);
          float offsetX = mod(row, 2.0) * plankLength * 0.5;
          vec2 plankUV = vec2(wp.x + offsetX, wp.y);

          // Plank cell coordinates
          vec2 plankCell = vec2(floor(plankUV.x / plankLength), floor(plankUV.y / plankWidth));
          vec2 plankLocal = vec2(fract(plankUV.x / plankLength), fract(plankUV.y / plankWidth));

          // Unique tint per plank
          float plankHash = hash(plankCell);

          // Wood grain — elongated noise along plank direction
          float grain = noise(vec2(wp.x * 0.3, wp.y * 4.0 + plankHash * 100.0));
          float grain2 = noise(vec2(wp.x * 0.8, wp.y * 8.0 + plankHash * 50.0));
          float grainMix = grain * 0.7 + grain2 * 0.3;

          // Base colour — blend between honey tones
          vec3 baseColor = mix(uColor1, uColor2, grainMix * 0.5 + plankHash * 0.3);
          baseColor = mix(baseColor, uColor3, smoothstep(0.55, 0.65, grain) * 0.3);

          // Tiny speckles / dust particles on the floor
          float speckle = hash(wp * 143.51);
          if (speckle > 0.994) {
            baseColor = mix(baseColor, vec3(0.95, 0.92, 0.85), 0.35); // soft light dust motes
          }

          // Plank edge darkening (subtle groove between planks)
          float edgeX = smoothstep(0.0, 0.03, plankLocal.x) * smoothstep(0.0, 0.03, 1.0 - plankLocal.x);
          float edgeY = smoothstep(0.0, 0.04, plankLocal.y) * smoothstep(0.0, 0.04, 1.0 - plankLocal.y);
          float edge = edgeX * edgeY;
          baseColor *= mix(0.7, 1.0, edge);

          // Distance fade — gentle vignette from center
          float dist = length(wp) / 15.0;
          float vignette = 1.0 - smoothstep(0.3, 1.0, dist) * 0.25;
          baseColor *= vignette;

          // Soft alpha at far edges
          float alpha = 1.0 - smoothstep(0.6, 1.0, dist) * 0.6;

          gl_FragColor = vec4(baseColor, alpha);
        }
      `}
    />
  );
}

/**
 * ZoneShadow draws a neat grounded indicator for the hubs.
 */
function ZoneShadow({ position, radius }) {
  return (
    <group position={position}>
      {/* Soft inner ambient circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshBasicMaterial color="#4a3c31" transparent opacity={0.16} />
      </mesh>
      {/* Outer thin framing ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[radius - 0.04, radius, 48]} />
        <meshBasicMaterial color="#8b7355" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Shadow-receiving floor overlay — a standard mesh that
 * catches shadows on top of the custom shader floor.
 */
function ShadowFloor() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, FLOOR_Y + 0.001, 0]}
      receiveShadow
    >
      <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
      <shadowMaterial transparent opacity={0.22} color="#4a3c31" />
    </mesh>
  );
}

// ─── Exported Floor ──────────────────────────────────────────────

export default function KoreanFloor() {
  return (
    <group>
      {/* Procedural wood-grain floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE, 1, 1]} />
        <WoodFloorMaterial />
      </mesh>

      {/* Shadow-catching overlay */}
      <ShadowFloor />

      {/* ── Central Area Rug (Dusty Rose with Cream Border) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.003, 0]}>
        <planeGeometry args={[7.0, 5.0]} />
        <meshStandardMaterial color="#d9a09c" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.004, 0]}>
        <planeGeometry args={[6.6, 4.6]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.005, 0]}>
        <planeGeometry args={[6.2, 4.2]} />
        <meshStandardMaterial color="#d9a09c" roughness={0.95} />
      </mesh>

      {/* ── Zone Shadow Boundaries under Main Stations ── */}
      {/* Tea Station (Cake) */}
      <ZoneShadow position={[-3.5, FLOOR_Y + 0.006, 0]} radius={1.4} />
      
      {/* Gift Shelf */}
      <ZoneShadow position={[7.6, FLOOR_Y + 0.006, 1.0]} radius={1.5} />
      
      {/* Memory Wall (Frame) */}
      <ZoneShadow position={[0, FLOOR_Y + 0.006, -8.3]} radius={1.5} />
    </group>
  );
}
