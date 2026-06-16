import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Steam Particle Component ─────────────────────────────────────
const STEAM_COUNT = 8;

function SteamParticles({ brewedDrink = 'default' }) {
  const meshRef = useRef();
  const isBrewed = brewedDrink !== 'default';

  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < STEAM_COUNT; i++) {
      data.push({
        y: Math.random() * 1.5,
        xOffset: (Math.random() - 0.5) * 0.1,
        zOffset: (Math.random() - 0.5) * 0.1,
        speed: 0.015 + Math.random() * 0.015,
        swaySpeed: 2.0 + Math.random() * 2.0,
        swayWidth: 0.05 + Math.random() * 0.05,
        scaleSpeed: 0.4 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      const speedMult = isBrewed ? 1.8 : 1.0;
      p.y += p.speed * speedMult;

      if (p.y > 1.8) {
        p.y = 0.5;
      }

      const sway = Math.sin(t * p.swaySpeed + p.phase) * p.swayWidth;
      const px = -0.5 + sway + p.xOffset * (p.y * 0.5);
      const py = 0.55 + p.y;
      const pz = 0.0 + p.zOffset * (p.y * 0.5);

      dummy.position.set(px, py, pz);

      const lifeRatio = (p.y - 0.5) / 1.3;
      const scale = (0.04 + lifeRatio * 0.12) * p.scaleSpeed;
      dummy.scale.set(scale, scale * 1.2, scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const steamColor = useMemo(() => {
    if (brewedDrink === 'brewed_matcha') return '#e2efda';
    if (brewedDrink === 'brewed_latte') return '#fbeee6';
    if (brewedDrink === 'brewed_tea') return '#fef5e7';
    return '#f5ebe0';
  }, [brewedDrink]);

  const steamOpacity = isBrewed ? 0.32 : 0.16;

  return (
    <instancedMesh ref={meshRef} args={[null, null, STEAM_COUNT]} castShadow={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={steamColor}
        transparent
        opacity={steamOpacity}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ─── Main Tea Station Model ──────────────────────────────────────
export default function CakeModel({ hovered = false, isActive = false, brewedDrink = 'default' }) {
  const potRef = useRef();
  const glowLightRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Teapot hover interaction: slow rotation + gentle sway
    if (potRef.current) {
      if (hovered) {
        potRef.current.rotation.y = t * 1.2;
        potRef.current.position.y = 0.35 + Math.sin(t * 4) * 0.02;
      } else {
        potRef.current.rotation.y = THREE.MathUtils.lerp(potRef.current.rotation.y, 0, 0.1);
        potRef.current.position.y = THREE.MathUtils.lerp(potRef.current.position.y, 0.35, 0.1);
      }
    }

    // Glow point light pulse on hover
    if (glowLightRef.current) {
      const targetIntensity = hovered ? 2.0 : isActive ? 1.0 : 0.0;
      glowLightRef.current.intensity = THREE.MathUtils.lerp(
        glowLightRef.current.intensity,
        targetIntensity,
        0.1,
      );
    }
  });

  const ceramicMaterial = (
    <meshStandardMaterial
      color="#faf9f6"
      roughness={0.12}
      metalness={0.08}
      emissive="#ffe3c4"
      emissiveIntensity={hovered ? 0.25 : isActive ? 0.1 : 0.05}
    />
  );

  const liquidColor = useMemo(() => {
    switch (brewedDrink) {
      case 'brewed_matcha': return '#4f772d';
      case 'brewed_latte': return '#ddb892';
      case 'brewed_tea': return '#e9c46a';
      case 'brewed_macchiato': return '#9c6644';
      default: return '#b07d62';
    }
  }, [brewedDrink]);

  return (
    <group>
      {/* ── 1. Wooden Grounding Table ── */}
      {/* Table Top */}
      <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[2.5, 0.1, 1.8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.7} />
      </mesh>
      {/* Table Legs extending to floor (y = -2.5 in model space) */}
      <mesh castShadow position={[-1.15, -1.25, 0.8]}>
        <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
        <meshStandardMaterial color="#4a3c31" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[1.15, -1.25, 0.8]}>
        <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
        <meshStandardMaterial color="#4a3c31" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-1.15, -1.25, -0.8]}>
        <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
        <meshStandardMaterial color="#4a3c31" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[1.15, -1.25, -0.8]}>
        <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
        <meshStandardMaterial color="#4a3c31" roughness={0.8} />
      </mesh>

      {/* ── 2. Decorative Cloth / Napkin ── */}
      <mesh position={[-0.4, 0.005, 0.1]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.01, 1.0]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.9} />
      </mesh>

      {/* ── 3. Ceramic Plate with Biscuits/Tea Cakes ── */}
      <group position={[0.6, 0.05, -0.3]}>
        {/* Plate */}
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.26, 0.03, 16]} />
          <meshStandardMaterial color="#faf9f6" roughness={0.2} />
        </mesh>
        {/* Biscuits */}
        <mesh position={[-0.08, 0.04, 0]} rotation={[0.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.05, 0.12]} />
          <meshStandardMaterial color="#c68a4c" roughness={0.8} />
        </mesh>
        <mesh position={[0.08, 0.04, 0.06]} rotation={[-0.2, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 12]} />
          <meshStandardMaterial color="#8a5a36" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.08, -0.04]} rotation={[0.3, 0.1, 0.1]} castShadow>
          <boxGeometry args={[0.1, 0.05, 0.15]} />
          <meshStandardMaterial color="#d4b285" roughness={0.8} />
        </mesh>
      </group>

      {/* ── 4. Cozy Table Candle / Tea Light ── */}
      <group position={[-0.8, 0.04, -0.4]}>
        {/* Candle glass */}
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.14, 12]} />
          <meshStandardMaterial color="#faf9f6" transparent opacity={0.6} roughness={0.1} />
        </mesh>
        {/* Wax */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
          <meshStandardMaterial color="#ffeaa7" roughness={0.5} />
        </mesh>
        {/* Flame */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffe8a3" toneMapped={false} />
        </mesh>
        <pointLight color="#ffe3c4" intensity={hovered ? 1.2 : 0.6} distance={2} position={[0, 0.15, 0]} />
      </group>

      {/* ── 5. Wooden Serving Tray & Price Tag ── */}
      <mesh castShadow receiveShadow position={[0.0, 0.06, 0.2]}>
        <boxGeometry args={[1.5, 0.06, 0.9]} />
        <meshStandardMaterial color="#8b7355" roughness={0.7} />
      </mesh>
      
      {/* Price Tag-style label hanging off the serving tray */}
      <group position={[0.74, 0.05, 0.58]} rotation={[0.1, -0.1, 0.2]}>
        {/* White tag */}
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.004, 0.22]} />
          <meshStandardMaterial color="#faf9f6" roughness={0.9} />
        </mesh>
        {/* String */}
        <mesh position={[0.0, 0.015, -0.12]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.005, 0.08, 0.005]} />
          <meshStandardMaterial color="#8b7355" />
        </mesh>
      </group>

      {/* ── 5b. Handwritten-style Quote Card with Blush Pink Washi Tape ── */}
      <group position={[-0.8, 0.01, 0.35]} rotation={[0, 0.1, -0.05]}>
        {/* Card paper */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.008, 0.5]} />
          <meshStandardMaterial color="#fdfefe" roughness={0.9} />
        </mesh>
        {/* Written line indicators */}
        <mesh position={[0, 0.006, -0.12]}>
          <boxGeometry args={[0.24, 0.001, 0.012]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
        <mesh position={[0, 0.006, -0.05]}>
          <boxGeometry args={[0.26, 0.001, 0.012]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
        <mesh position={[0, 0.006, 0.02]}>
          <boxGeometry args={[0.2, 0.001, 0.012]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
        {/* Washi tape strip holding it */}
        <mesh position={[-0.14, 0.006, -0.22]} rotation={[0, 0.2, 0.4]}>
          <boxGeometry args={[0.1, 0.002, 0.18]} />
          <meshStandardMaterial color="#dca9a7" roughness={0.9} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* ── 6. Teapot Group ── */}
      <group ref={potRef} position={[-0.2, 0.35, 0.2]}>
        {/* Pot main body */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.35, 24, 24]} />
          {ceramicMaterial}
        </mesh>
        {/* Lid */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.08, 16]} />
          {ceramicMaterial}
        </mesh>
        {/* Lid Knob */}
        <mesh position={[0, 0.38, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          {ceramicMaterial}
        </mesh>
        {/* Handle */}
        <mesh position={[0.36, 0.08, 0]} rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[0.18, 0.04, 8, 24, Math.PI * 1.2]} />
          {ceramicMaterial}
        </mesh>
        {/* Spout */}
        <mesh position={[-0.32, 0.14, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.04, 0.07, 0.25, 12]} />
          {ceramicMaterial}
        </mesh>
        {/* Dynamic Glow Light */}
        <pointLight
          ref={glowLightRef}
          color="#ffb703"
          intensity={0}
          distance={3}
          decay={2}
          position={[0, 0.15, 0]}
        />
      </group>

      {/* ── 7. Teacup 1 ── */}
      <group position={[0.4, 0.2, 0.4]}>
        {/* Cup */}
        <mesh castShadow>
          <cylinderGeometry args={[0.14, 0.09, 0.16, 12]} />
          <meshStandardMaterial
            color="#faf9f6"
            roughness={0.12}
            emissive={hovered ? "#ffe8d6" : "#000000"}
            emissiveIntensity={hovered ? 0.35 : 0.0}
          />
        </mesh>
        {/* Liquid */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.01, 12]} />
          <meshStandardMaterial color={liquidColor} roughness={0.1} />
        </mesh>
      </group>

      {/* ── 8. Teacup 2 ── */}
      <group position={[0.4, 0.2, 0.0]}>
        {/* Cup */}
        <mesh castShadow>
          <cylinderGeometry args={[0.14, 0.09, 0.16, 12]} />
          <meshStandardMaterial
            color="#faf9f6"
            roughness={0.12}
            emissive={hovered ? "#ffe8d6" : "#000000"}
            emissiveIntensity={hovered ? 0.35 : 0.0}
          />
        </mesh>
        {/* Liquid */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.01, 12]} />
          <meshStandardMaterial color={liquidColor} roughness={0.1} />
        </mesh>
      </group>

      {/* Steam rising */}
      <SteamParticles brewedDrink={brewedDrink} />
    </group>
  );
}
