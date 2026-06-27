import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MeditationZoneModel({ hovered = false, isActive = false, breathePhase = 'idle', breatheProgress = 0 }) {
  const steamRing1 = useRef();
  const steamRing2 = useRef();
  const steamRing3 = useRef();
  const candleLightRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Pulse the candle light
    if (candleLightRef.current) {
      const baseLight = hovered ? 1.5 : isActive ? 1.2 : 0.6;
      candleLightRef.current.intensity = baseLight + Math.sin(t * 4.0) * 0.15;
    }

    // Animate steam rings rising and expanding
    if (steamRing1.current) {
      const yVal = 0.35 + ((t * 0.4) % 0.4);
      steamRing1.current.position.y = yVal;
      steamRing1.current.scale.setScalar(1.0 + (yVal - 0.35) * 2.0);
    }
    if (steamRing2.current) {
      const yVal = 0.35 + (((t * 0.4) + 0.13) % 0.4);
      steamRing2.current.position.y = yVal;
      steamRing2.current.scale.setScalar(1.0 + (yVal - 0.35) * 2.0);
    }
    if (steamRing3.current) {
      const yVal = 0.35 + (((t * 0.4) + 0.26) % 0.4);
      steamRing3.current.position.y = yVal;
      steamRing3.current.scale.setScalar(1.0 + (yVal - 0.35) * 2.0);
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── 1. Traditional Japanese Zabuton & Zafu Cushion Stack ── */}
      {/* Zabuton: Square base cushion */}
      <mesh castShadow receiveShadow position={[0, -0.05, 0.4]}>
        <boxGeometry args={[1.1, 0.07, 1.1]} />
        <meshStandardMaterial color="#203346" roughness={0.95} /> {/* Deep Indigo blue */}
      </mesh>
      {/* Zabuton silk border trim */}
      <mesh position={[0, -0.05, 0.4]}>
        <boxGeometry args={[1.11, 0.03, 1.11]} />
        <meshStandardMaterial color="#d4af37" roughness={0.8} /> {/* Gold trim edge */}
      </mesh>
      {/* Zafu: Round meditation cushion on top */}
      <mesh castShadow position={[0, 0.03, 0.4]}>
        <cylinderGeometry args={[0.42, 0.42, 0.09, 16]} />
        <meshStandardMaterial color="#f4f0e6" roughness={0.9} /> {/* Buckwheat cream */}
      </mesh>
      {/* Zafu center button/tuft details */}
      <mesh position={[0, 0.078, 0.4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.01, 8]} />
        <meshStandardMaterial color="#203346" />
      </mesh>

      {/* ── 2. Low Wooden Tea Table ── */}
      {/* Table top */}
      <mesh castShadow receiveShadow position={[0, 0.15, -0.4]}>
        <boxGeometry args={[1.2, 0.06, 0.8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.7} />
      </mesh>
      {/* Table legs */}
      <mesh position={[-0.5, 0.06, -0.7]} castShadow>
        <boxGeometry args={[0.08, 0.12, 0.08]} />
        <meshStandardMaterial color="#4a3c31" />
      </mesh>
      <mesh position={[0.5, 0.06, -0.7]} castShadow>
        <boxGeometry args={[0.08, 0.12, 0.08]} />
        <meshStandardMaterial color="#4a3c31" />
      </mesh>
      <mesh position={[-0.5, 0.06, -0.1]} castShadow>
        <boxGeometry args={[0.08, 0.12, 0.08]} />
        <meshStandardMaterial color="#4a3c31" />
      </mesh>
      <mesh position={[0.5, 0.06, -0.1]} castShadow>
        <boxGeometry args={[0.08, 0.12, 0.08]} />
        <meshStandardMaterial color="#4a3c31" />
      </mesh>

      {/* ── 3. Yunomi Tea Cup & Steaming Tea ── */}
      <group position={[-0.25, 0.18, -0.4]}>
        {/* Yunomi Clay base (unglazed foot ring) */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.085, 0.03, 12]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.9} /> {/* dark brown clay */}
        </mesh>
        {/* Yunomi Cup Body (moss-green glaze) */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.09, 0.14, 12]} />
          <meshStandardMaterial color="#7d8c77" roughness={0.25} metalness={0.1} /> {/* ceramic moss glaze */}
        </mesh>
        {/* Tea liquid inside */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 12]} />
          <meshStandardMaterial color="#cd853f" roughness={0.4} />
        </mesh>
        {/* Steaming Torus rings */}
        <group position={[0, 0.08, 0]}>
          <mesh ref={steamRing1} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.06, 0.006, 6, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
          <mesh ref={steamRing2} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.06, 0.006, 6, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
          <mesh ref={steamRing3} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.06, 0.006, 6, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </mesh>
        </group>
      </group>

      {/* ── 4. Candle & Candleholder ── */}
      <group position={[0.25, 0.18, -0.4]}>
        {/* Tray plate */}
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.14, 0.02, 12]} />
          <meshStandardMaterial color="#dfc5a0" roughness={0.5} />
        </mesh>
        {/* Candle wax */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
          <meshStandardMaterial color="#faf9f6" roughness={0.6} />
        </mesh>
        {/* Candle Flame */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#ffb703" toneMapped={false} />
        </mesh>
        {/* Candle Light source */}
        <pointLight
          ref={candleLightRef}
          color="#ffb703"
          intensity={0.6}
          distance={3}
          decay={2}
          position={[0, 0.15, 0]}
        />
      </group>

      {/* ── 5. Meditation breathing aura ring ── */}
      {isActive && (
        <mesh position={[0, 0.05, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.65 + breatheProgress * 0.4, 32]} />
          <meshBasicMaterial
            color={breathePhase === 'inhale' ? '#a8e6cf' : breathePhase === 'exhale' ? '#dca9a7' : '#ffd4a3'}
            transparent
            opacity={0.6 - breatheProgress * 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
