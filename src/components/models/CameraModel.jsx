import { useRef } from 'react';
import * as THREE from 'three';

export default function CameraModel({ hovered = false, isActive = false }) {
  const cameraRef = useRef();

  return (
    <group ref={cameraRef}>
      {/* Camera Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.24, 0.12]} />
        <meshStandardMaterial
          color={hovered ? '#d2d7db' : '#95a5a6'}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Top Deco Plate (metallic cover) */}
      <mesh position={[0, 0.11, 0]} castShadow>
        <boxGeometry args={[0.36, 0.04, 0.124]} />
        <meshStandardMaterial color="#7f8c8d" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Lens Outer Barrel */}
      <mesh position={[0.04, -0.01, 0.07]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Lens Glass (dark shiny glass reflection) */}
      <mesh position={[0.04, -0.01, 0.096]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.006, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.05} metalness={0.9} emissive="#001529" emissiveIntensity={0.2} />
      </mesh>

      {/* Flash window */}
      <mesh position={[-0.1, 0.06, 0.06]} castShadow>
        <boxGeometry args={[0.06, 0.03, 0.01]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={hovered ? 0.8 : 0.2} />
      </mesh>

      {/* Red Dot (Leica style or self timer LED) */}
      <mesh position={[-0.1, 0.01, 0.062]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.005, 8]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.2} />
      </mesh>

      {/* Shutter Button on Top */}
      <mesh position={[0.1, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
        <meshStandardMaterial color="#bdc3c7" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Mode Dial on Top */}
      <mesh position={[-0.06, 0.13, 0]} rotation={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 10]} />
        <meshStandardMaterial color="#34495e" roughness={0.6} />
      </mesh>
    </group>
  );
}
