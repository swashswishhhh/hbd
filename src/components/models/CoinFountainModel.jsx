/**
 * CoinFountainModel.jsx — Interactive Lucky Coin Fountain.
 *
 * Renders:
 *   • A traditional carved stone water basin
 *   • A shiny, reflective water layer
 *   • A vertical trickling water stream
 *   • Dynamic water splash particles
 *   • A 3D gold coin that falls in a parabolic arc when a toss is triggered
 */

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DROPLET_COUNT = 8;
const SPLASH_PARTICLES_COUNT = 10;

export default function CoinFountainModel({
  hovered = false,
  isActive = false,
  tossCount = 0, // Increment this to trigger a coin toss
}) {
  const waterRef = useRef();
  const streamRef = useRef();
  const coinRef = useRef();

  // ─── Water Ripples ────────────────────────────────────────────────
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (waterRef.current) {
      // Gentle ripple effect on the water mesh scale
      const scale = 1.0 + Math.sin(t * 3) * 0.015;
      waterRef.current.scale.set(scale, 1.0, scale);
    }
  });

  // ─── Rising Water Droplets ────────────────────────────────────────
  const droplets = useMemo(() => {
    const data = [];
    for (let i = 0; i < DROPLET_COUNT; i++) {
      data.push({
        y: Math.random() * 0.6,
        speed: 0.008 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.02,
      });
    }
    return data;
  }, []);

  const dropletsMeshRef = useRef();
  const dummyDroplet = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!dropletsMeshRef.current) return;
    const t = state.clock.getElapsedTime();

    droplets.forEach((d, i) => {
      d.y += d.speed;
      if (d.y > 0.8) {
        d.y = 0.05; // reset to spout nozzle
      }
      const sway = Math.sin(t * 5 + d.phase) * 0.02;
      dummyDroplet.position.set(sway, d.y, sway);
      dummyDroplet.scale.setScalar(d.scale * (1.0 - (d.y / 0.8))); // shrink as it rises
      dummyDroplet.updateMatrix();
      dropletsMeshRef.current.setMatrixAt(i, dummyDroplet.matrix);
    });
    dropletsMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  // ─── Coin Toss Physics Simulation ─────────────────────────────────
  const [coinState, setCoinState] = useState({
    active: false,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
  });

  const [splashState, setSplashState] = useState({
    active: false,
    particles: [],
    timer: 0,
  });

  // Trigger coin toss when tossCount increments
  useEffect(() => {
    if (tossCount > 0) {
      setCoinState({
        active: true,
        x: -1.8,    // Start from top left
        y: 2.2,
        z: 1.2,
        vx: 0.05,   // Move towards center
        vy: 0.02,   // Soft initial upward pop
        vz: -0.04,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
      });
      setSplashState({ active: false, particles: [], timer: 0 });
    }
  }, [tossCount]);

  useFrame(() => {
    // 1. Animate Coin
    if (coinState.active) {
      setCoinState((prev) => {
        // Gravity
        const nextVy = prev.vy - 0.006;
        const nextX = prev.x + prev.vx;
        const nextY = prev.y + nextVy;
        const nextZ = prev.z + prev.vz;

        // Check if hit water surface (around y = -0.05)
        if (nextY <= -0.05) {
          // Trigger splash!
          const parts = [];
          for (let i = 0; i < SPLASH_PARTICLES_COUNT; i++) {
            const angle = (i / SPLASH_PARTICLES_COUNT) * Math.PI * 2;
            const speed = 0.015 + Math.random() * 0.025;
            parts.push({
              x: nextX,
              y: -0.05,
              z: nextZ,
              vx: Math.cos(angle) * speed,
              vy: 0.03 + Math.random() * 0.04,
              vz: Math.sin(angle) * speed,
            });
          }
          setSplashState({
            active: true,
            particles: parts,
            timer: 0,
          });

          return { ...prev, active: false };
        }

        return {
          ...prev,
          x: nextX,
          y: nextY,
          z: nextZ,
          vy: nextVy,
          rotX: prev.rotX + 0.12,
          rotY: prev.rotY + 0.08,
          rotZ: prev.rotZ + 0.15,
        };
      });
    }

    // 2. Animate Splash
    if (splashState.active) {
      setSplashState((prev) => {
        const nextTimer = prev.timer + 1;
        if (nextTimer > 30) {
          return { active: false, particles: [], timer: 0 };
        }

        const nextParticles = prev.particles.map((p) => {
          return {
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            z: p.z + p.vz,
            vy: p.vy - 0.003, // gravity on droplets
          };
        });

        return {
          ...prev,
          timer: nextTimer,
          particles: nextParticles,
        };
      });
    }
  });

  return (
    <group>
      {/* ── Outer Stone Basin ── */}
      <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.9, 1.0, 0.4, 24]} />
        <meshStandardMaterial color="#686d76" roughness={0.9} />
      </mesh>
      {/* Rim of the basin */}
      <mesh castShadow receiveShadow position={[0, -0.15, 0]}>
        <torusGeometry args={[0.85, 0.08, 12, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#4a4e52" roughness={0.8} />
      </mesh>

      {/* ── Water Layer ── */}
      <mesh ref={waterRef} position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.8, 24]} />
        <meshStandardMaterial
          color="#00a8cc"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* ── Central Spout Nozzle ── */}
      <mesh castShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.3, 12]} />
        <meshStandardMaterial color="#373a40" roughness={0.9} />
      </mesh>

      {/* ── Fountain Water Stream (Center Tube) ── */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.03, 0.06, 0.4, 12]} />
        <meshStandardMaterial
          color="#d2f5ff"
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* ── Instanced Water Droplets ── */}
      <instancedMesh ref={dropletsMeshRef} args={[null, null, DROPLET_COUNT]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color="#e0f7fa" roughness={0.1} transparent opacity={0.6} />
      </instancedMesh>

      {/* ── 3D Tossed Gold Coin ── */}
      {coinState.active && (
        <mesh
          ref={coinRef}
          position={[coinState.x, coinState.y, coinState.z]}
          rotation={[coinState.rotX, coinState.rotY, coinState.rotZ]}
          castShadow
        >
          {/* Flat thin cylinder representing a gold coin */}
          <cylinderGeometry args={[0.12, 0.12, 0.016, 12]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.9}
            roughness={0.15}
            emissive="#b8860b"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}

      {/* ── Splash Particles ── */}
      {splashState.active &&
        splashState.particles.map((p, idx) => {
          // Shrink splash particles based on age
          const lifeScale = Math.max(0.01, 0.06 * (1.0 - splashState.timer / 30));
          return (
            <mesh key={idx} position={[p.x, p.y, p.z]} scale={lifeScale}>
              <sphereGeometry args={[1, 6, 6]} />
              <meshBasicMaterial color="#e0f7fa" transparent opacity={0.8} />
            </mesh>
          );
        })}
    </group>
  );
}
