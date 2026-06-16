/**
 * JukeboxModel.jsx — Vintage Soundtrack Jukebox.
 *
 * Renders:
 *   • A cozy curved wooden radio cabinet
 *   • A cream-toned faceplate with dials and a speaker grille
 *   • Five interactive horizontal visualizer bars that bounce
 *     up and down in real-time when music is playing.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function JukeboxModel({
  hovered = false,
  isActive = false,
  isPlaying = false, // Controlled by soundtrack state
}) {
  const barRefs = useRef([]);

  // Animation constants for each visualizer bar
  const barConfigs = [
    { baseHeight: 0.2, freq: 12, amp: 0.25, phase: 0 },
    { baseHeight: 0.2, freq: 18, amp: 0.35, phase: 1.5 },
    { baseHeight: 0.2, freq: 10, amp: 0.20, phase: 3.0 },
    { baseHeight: 0.2, freq: 15, amp: 0.30, phase: 4.5 },
    { baseHeight: 0.2, freq: 8,  amp: 0.18, phase: 6.0 },
  ];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    barRefs.current.forEach((bar, idx) => {
      if (!bar) return;
      const config = barConfigs[idx];

      let targetScaleY = 0.1; // flat base line when idle
      if (isPlaying) {
        // High energetic bouncing
        targetScaleY = config.baseHeight + Math.sin(t * config.freq + config.phase) * config.amp + config.amp;
        targetScaleY = Math.max(0.1, targetScaleY);
      }

      // Smooth lerp to the scale height
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, targetScaleY, 0.25);
      // Offset position Y so the scale grows upward from the base anchor
      bar.position.y = -0.05 + bar.scale.y * 0.15;
    });
  });

  const bodyMaterial = <meshStandardMaterial color="#8b5a2b" roughness={0.5} />;
  const trimMaterial = <meshStandardMaterial color="#d4af37" roughness={0.2} metalness={0.8} />;
  const faceMaterial = <meshStandardMaterial color="#fdfefe" roughness={0.3} />;
  const grillMaterial = <meshStandardMaterial color="#2c3e50" roughness={0.9} />;

  return (
    <group>
      {/* ── Main Wooden Cabinet Base ── */}
      <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[1.0, 0.8, 0.6]} />
        {bodyMaterial}
      </mesh>
      {/* Curved Arch Top of Jukebox */}
      <mesh castShadow position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 1.0, 24]} />
        {bodyMaterial}
      </mesh>

      {/* ── Face Plate ── */}
      <mesh position={[0, 0.05, 0.31]}>
        <boxGeometry args={[0.76, 0.62, 0.02]} />
        {faceMaterial}
      </mesh>

      {/* ── Speaker Grille (Lower half of faceplate) ── */}
      <mesh position={[0, -0.12, 0.325]}>
        <boxGeometry args={[0.6, 0.25, 0.012]} />
        {grillMaterial}
      </mesh>

      {/* ── Dials / Knobs ── */}
      <mesh position={[-0.2, 0.12, 0.33]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
        {trimMaterial}
      </mesh>
      <mesh position={[0.2, 0.12, 0.33]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
        {trimMaterial}
      </mesh>

      {/* Tuner Indicator Line */}
      <mesh position={[0, 0.2, 0.322]}>
        <boxGeometry args={[0.4, 0.03, 0.01]} />
        <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={isPlaying ? 1.5 : 0.2} />
      </mesh>

      {/* ── Visualizer Bars (bouncing lights on the face) ── */}
      <group position={[0, 0, 0.325]}>
        {barConfigs.map((_, idx) => (
          <mesh
            key={idx}
            ref={(el) => (barRefs.current[idx] = el)}
            position={[-0.24 + idx * 0.12, -0.05, 0]}
            scale={[1, 0.1, 1]}
          >
            <boxGeometry args={[0.06, 0.3, 0.02]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#1abc9c' : '#f1c40f'}
              emissive={idx % 2 === 0 ? '#1abc9c' : '#f1c40f'}
              emissiveIntensity={isPlaying ? 1.2 : 0.1}
            />
          </mesh>
        ))}
      </group>

      {/* ── Gold Arch Trims ── */}
      <mesh position={[0, 0.3, 0.305]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.49, 0.03, 8, 24, Math.PI]} />
        {trimMaterial}
      </mesh>
    </group>
  );
}
