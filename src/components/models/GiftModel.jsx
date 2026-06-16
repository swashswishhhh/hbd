import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Sparkle System ──────────────────────────────────────────────
const SPARKLE_COUNT = 8;

function Sparkles({ isHovered }) {
  const meshRef = useRef();

  const sparkleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      data.push({
        x: (Math.random() - 0.5) * 1.6,
        y: -1.0 + Math.random() * 2.4, // float across the shelves
        z: (Math.random() - 0.5) * 1.0,
        speed: 1.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        scale: 0.03 + Math.random() * 0.03,
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    sparkleData.forEach((s, i) => {
      // Speed up sparkles if hovered
      const speedMult = isHovered ? 2.5 : 1.0;
      const pulse = Math.sin(t * s.speed * speedMult + s.phase);
      const currentScale = s.scale * (0.5 + 0.5 * pulse) * (isHovered ? 1.5 : 1.0);

      dummy.position.set(s.x, s.y + pulse * 0.08, s.z);
      dummy.rotation.set(t * 1.0, t * 1.5, 0);
      dummy.scale.setScalar(currentScale > 0 ? currentScale : 0);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, SPARKLE_COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color="#ffe8a3"
        transparent
        opacity={0.85}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Main Gift Shelf Model ────────────────────────────────────────
export default function GiftModel({ hovered = false, isActive = false, onSubItemClick }) {
  const shelfGroupRef = useRef();
  
  // Sub-items refs for bobbing
  const giftTopRef = useRef();
  const cardRef = useRef();
  const plantRef = useRef();
  const giftMidRef = useRef();

  const [hoveredSub, setHoveredSub] = useState(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Shelf unit gentle sway when hovered, return to neutral when not
    if (shelfGroupRef.current) {
      if (hovered) {
        shelfGroupRef.current.rotation.z = Math.sin(t * 3.5) * 0.02;
        shelfGroupRef.current.rotation.y = Math.cos(t * 2) * 0.04; // soft yaw sway on hover
      } else {
        shelfGroupRef.current.rotation.z = THREE.MathUtils.lerp(shelfGroupRef.current.rotation.z, 0, 0.1);
        shelfGroupRef.current.rotation.y = THREE.MathUtils.lerp(shelfGroupRef.current.rotation.y, 0, 0.1); // reset to neutral
      }
    }

    // 2. Individual sub-item bobbing/swaying
    if (giftTopRef.current) {
      if (hoveredSub === 'present') {
        giftTopRef.current.position.y = 1.08 + Math.sin(t * 10) * 0.04;
        giftTopRef.current.rotation.x = Math.sin(t * 4) * 0.08;
      } else {
        giftTopRef.current.position.y = THREE.MathUtils.lerp(giftTopRef.current.position.y, 1.08, 0.1);
        giftTopRef.current.rotation.x = THREE.MathUtils.lerp(giftTopRef.current.rotation.x, 0, 0.1);
      }
    }

    if (cardRef.current) {
      if (hoveredSub === 'card') {
        cardRef.current.position.y = 1.08 + Math.sin(t * 8) * 0.03;
        cardRef.current.rotation.z = Math.sin(t * 12) * 0.05;
      } else {
        cardRef.current.position.y = THREE.MathUtils.lerp(cardRef.current.position.y, 1.08, 0.1);
        cardRef.current.rotation.z = THREE.MathUtils.lerp(cardRef.current.rotation.z, 0, 0.1);
      }
    }

    if (plantRef.current) {
      if (hoveredSub === 'plant') {
        const pulse = 1.0 + Math.sin(t * 12) * 0.05;
        plantRef.current.scale.set(pulse, pulse, pulse);
      } else {
        plantRef.current.scale.set(1.0, 1.0, 1.0);
      }
    }
  });

  return (
    <group>
      {/* ── Outer Grounded Shelf Group ── */}
      <group ref={shelfGroupRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        
        {/* ── 1. Wood Bookcase / Shelving Unit ── */}
        {/* Floor relative coordinate is y = -3.0 */}
        {/* Left Side Post */}
        <mesh castShadow position={[-0.95, -0.9, 0]}>
          <boxGeometry args={[0.08, 4.2, 0.8]} />
          <meshStandardMaterial color="#6f4e37" roughness={0.7} />
        </mesh>
        {/* Right Side Post */}
        <mesh castShadow position={[0.95, -0.9, 0]}>
          <boxGeometry args={[0.08, 4.2, 0.8]} />
          <meshStandardMaterial color="#6f4e37" roughness={0.7} />
        </mesh>
        {/* Back panel slats (aesthetic slats background) */}
        <mesh position={[0, -0.9, -0.38]} castShadow receiveShadow>
          <boxGeometry args={[1.82, 4.2, 0.04]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.8} />
        </mesh>
        
        {/* Bottom Shelf Plank (near floor) */}
        <mesh position={[0, -2.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.82, 0.06, 0.76]} />
          <meshStandardMaterial color="#6f4e37" roughness={0.7} />
        </mesh>
        {/* Middle Shelf Plank */}
        <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.82, 0.06, 0.76]} />
          <meshStandardMaterial color="#6f4e37" roughness={0.7} />
        </mesh>
        {/* Top Shelf Plank */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.82, 0.06, 0.76]} />
          <meshStandardMaterial color="#6f4e37" roughness={0.7} />
        </mesh>

        {/* ── 2. TOP SHELF ITEMS ── */}
        {/* Main Wrapped Red Gift */}
        <group
          ref={giftTopRef}
          position={[-0.4, 1.08, 0.05]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredSub('present');
          }}
          onPointerOut={() => setHoveredSub(null)}
          onClick={(e) => {
            if (isActive && onSubItemClick) {
              e.stopPropagation();
              onSubItemClick('present');
            }
          }}
        >
          {/* Red box */}
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color="#e07a5f"
              roughness={0.25}
              metalness={0.1}
              emissive={hoveredSub === 'present' ? "#4d1a10" : "#000000"}
              emissiveIntensity={hoveredSub === 'present' ? 0.35 : 0.0}
            />
          </mesh>
          {/* Ribbon */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.52, 0.06, 0.1]} />
            <meshStandardMaterial color="#f4f1de" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.06, 0.52]} />
            <meshStandardMaterial color="#f4f1de" roughness={0.3} />
          </mesh>
          <group position={[0.26, -0.05, 0.1]} rotation={[0, 0.2, 0.5]}>
            {/* Hanging Gift Tag */}
            <mesh castShadow>
              <boxGeometry args={[0.1, 0.16, 0.01]} />
              <meshStandardMaterial color="#f2cc8f" />
            </mesh>
            {/* Thin tag string */}
            <mesh position={[-0.05, 0.12, 0]} rotation={[0, 0, -0.4]}>
              <boxGeometry args={[0.005, 0.1, 0.005]} />
              <meshStandardMaterial color="#8b7355" />
            </mesh>
          </group>
        </group>

        {/* Angled Birthday Card */}
        <group
          ref={cardRef}
          position={[0.1, 1.08, -0.1]}
          rotation={[0.15, -0.25, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredSub('card');
          }}
          onPointerOut={() => setHoveredSub(null)}
          onClick={(e) => {
            if (isActive && onSubItemClick) {
              e.stopPropagation();
              onSubItemClick('card');
            }
          }}
        >
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.5, 0.03]} />
            <meshStandardMaterial color="#f4f1de" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.016]}>
            <planeGeometry args={[0.34, 0.42]} />
            <meshStandardMaterial color="#f2cc8f" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.018]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.06, 0.06, 0.002]} />
            <meshStandardMaterial color="#e07a5f" />
          </mesh>
        </group>

        {/* Small Flower Vase */}
        <group
          ref={plantRef}
          position={[0.52, 0.98, 0.1]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredSub('plant');
          }}
          onPointerOut={() => setHoveredSub(null)}
          onClick={(e) => {
            if (isActive && onSubItemClick) {
              e.stopPropagation();
              onSubItemClick('plant');
            }
          }}
        >
          {/* Terracotta Pot */}
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.1, 0.3, 12]} />
            <meshStandardMaterial color="#e8af96" roughness={0.8} />
          </mesh>
          {/* Soil */}
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 12]} />
            <meshStandardMaterial color="#5c4033" />
          </mesh>
          {/* Tiny flower stems & buds */}
          <group position={[0, 0.15, 0]}>
            <mesh position={[-0.04, 0.18, 0]} rotation={[0, 0, 0.2]}>
              <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
              <meshStandardMaterial color="#81b29a" />
            </mesh>
            <mesh position={[-0.07, 0.32, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="#f2cc8f" />
            </mesh>
            <mesh position={[0.04, 0.22, -0.04]} rotation={[0.2, 0, -0.3]}>
              <cylinderGeometry args={[0.01, 0.01, 0.36, 8]} />
              <meshStandardMaterial color="#81b29a" />
            </mesh>
            <mesh position={[0.08, 0.38, -0.06]}>
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshBasicMaterial color="#e07a5f" />
            </mesh>
          </group>
        </group>

        {/* ── 3. MIDDLE SHELF ITEMS ── */}
        {/* Additional Gift Box (Green/Mint wrapper) */}
        <group position={[0.3, -0.28, 0.0]} ref={giftMidRef}>
          <mesh castShadow>
            <boxGeometry args={[0.46, 0.38, 0.42]} />
            <meshStandardMaterial color="#81b29a" roughness={0.3} />
          </mesh>
          {/* Ribbon */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.48, 0.04, 0.08]} />
            <meshStandardMaterial color="#f4f1de" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.04, 0.44]} />
            <meshStandardMaterial color="#f4f1de" />
          </mesh>
        </group>
        
        {/* Washi Tape Rolls decoration */}
        <group position={[-0.45, -0.38, 0.1]}>
          <mesh rotation={[Math.PI / 2, 0, 0.2]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.1, 12]} />
            <meshStandardMaterial color="#f2cc8f" roughness={0.5} />
          </mesh>
          <mesh position={[0.04, -0.02, -0.12]} rotation={[Math.PI / 2, 0, -0.4]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
            <meshStandardMaterial color="#e07a5f" roughness={0.5} />
          </mesh>
        </group>

        {/* ── 4. BOTTOM SHELF ITEMS ── */}
        {/* Stored Storage basket with ribbon bow */}
        <group position={[-0.2, -1.9, 0.0]}>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.34, 0.5]} />
            <meshStandardMaterial color="#dfc5a0" roughness={0.8} />
          </mesh>
          <mesh position={[-0.36, 0, 0]}>
            <torusGeometry args={[0.08, 0.02, 6, 12]} />
            <meshStandardMaterial color="#6f4e37" />
          </mesh>
          <mesh position={[0.36, 0, 0]}>
            <torusGeometry args={[0.08, 0.02, 6, 12]} />
            <meshStandardMaterial color="#6f4e37" />
          </mesh>
        </group>

        {/* Washi tape stripes styling the bookcase edges */}
        <mesh position={[-0.92, 0.5, 0.41]} rotation={[0, 0, 0.3]}>
          <planeGeometry args={[0.08, 0.26]} />
          <meshStandardMaterial color="#e07a5f" opacity={0.8} transparent />
        </mesh>
        <mesh position={[0.92, -0.8, 0.41]} rotation={[0, 0, -0.4]}>
          <planeGeometry args={[0.08, 0.22]} />
          <meshStandardMaterial color="#81b29a" opacity={0.8} transparent />
        </mesh>
        
        {/* Sage Green Washi Tape strip on middle shelf board */}
        <mesh position={[-0.2, -0.47, 0.39]} rotation={[0, 0, 0.1]}>
          <planeGeometry args={[0.22, 0.06]} />
          <meshStandardMaterial color="#81b29a" opacity={0.85} transparent />
        </mesh>

        {/* Small price label paper tag taped to middle shelf */}
        <group position={[-0.2, -0.56, 0.4]} rotation={[0.05, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.08, 0.005]} />
            <meshStandardMaterial color="#faf9f6" roughness={0.9} />
          </mesh>
        </group>

      </group>

      {/* Sparkles */}
      <Sparkles isHovered={hovered} />
    </group>
  );
}
