import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

import subjectImg from '../../images/subject.jpg';
import down1Img from '../../images/down1.png';
import down2Img from '../../images/down2.png';
import down3Img from '../../images/down3.png';
import up1Img from '../../images/up1.png';
import up2Img from '../../images/up2.png';
import up3Img from '../../images/up3.png';

// ─── Fairy Light Bulb Component ───────────────────────────────────
function FairyBulb({ position, delay = 0 }) {
  const bulbRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (bulbRef.current) {
      // Gentle glow pulse
      const pulse = 0.7 + 0.3 * Math.sin(t * 3 + delay);
      bulbRef.current.material.opacity = pulse;
    }
  });

  return (
    <mesh position={position} ref={bulbRef}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color="#ffe8a3" transparent opacity={0.9} toneMapped={false} />
    </mesh>
  );
}

// ─── Pinned Photo Component ────────────────────────────────────────
function PinnedPhoto({ position, rotationZ, index, hoveredSub, setHoveredSub, onSubItemClick, isActive, texture }) {
  const photoRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (photoRef.current) {
      // Flutter if parent or individual photo is hovered
      const isThisHovered = hoveredSub === `photo${index}`;
      if (isThisHovered) {
        photoRef.current.rotation.z = rotationZ + Math.sin(t * 14 + index) * 0.06;
        photoRef.current.position.z = 0.085 + Math.sin(t * 10) * 0.01;
      } else {
        photoRef.current.rotation.z = THREE.MathUtils.lerp(photoRef.current.rotation.z, rotationZ, 0.15);
        photoRef.current.position.z = THREE.MathUtils.lerp(photoRef.current.position.z, 0.08, 0.15);
      }
    }
  });

  return (
    <group
      ref={photoRef}
      position={[position[0], position[1], 0.08]}
      rotation={[0.02, 0.02, rotationZ]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredSub(`photo${index}`);
      }}
      onPointerOut={() => setHoveredSub(null)}
      onClick={(e) => {
        if (isActive && onSubItemClick) {
          e.stopPropagation();
          onSubItemClick(`photo${index}`);
        }
      }}
    >
      {/* Paper backing */}
      <mesh castShadow>
        <boxGeometry args={[0.42, 0.54, 0.01]} />
        <meshStandardMaterial color="#faf9f6" roughness={0.4} />
      </mesh>
      {/* Image space */}
      <mesh position={[0, 0.06, 0.007]}>
        <planeGeometry args={[0.36, 0.36]} />
        <meshStandardMaterial map={texture} roughness={0.25} metalness={0.1} />
      </mesh>
      {/* Tiny wood clip */}
      <mesh position={[0, 0.27, 0.008]} castShadow>
        <boxGeometry args={[0.04, 0.1, 0.02]} />
        <meshStandardMaterial color="#8b7355" roughness={0.7} />
      </mesh>
      {/* Pinned washi tape */}
      <mesh position={[0.04, 0.28, 0.018]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.18, 0.05, 0.002]} />
        <meshStandardMaterial color="#ebdccb" opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

// ─── Main Memory Wall Component ────────────────────────────────────
export default function FrameModel({ hovered = false, isActive = false, onSubItemClick }) {
  const boardRef = useRef();
  const [hoveredSub, setHoveredSub] = useState(null);

  // Load textures
  const subjectTex = useTexture(subjectImg);
  const down1Tex = useTexture(down1Img);
  const down2Tex = useTexture(down2Img);
  const down3Tex = useTexture(down3Img);
  const up1Tex = useTexture(up1Img);
  const up2Tex = useTexture(up2Img);
  const up3Tex = useTexture(up3Img);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (boardRef.current) {
      // Soft breathing scale on hover
      const targetScale = hovered ? 1.02 : 1.0;
      boardRef.current.scale.setScalar(THREE.MathUtils.lerp(boardRef.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <group ref={boardRef}>
      
      {/* ── 1. Large Cork Memory Board (Hangs on Wall) ── */}
      {/* Wood Frame */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[3.3, 2.6, 0.08]} />
        <meshStandardMaterial color="#6f4e37" roughness={0.7} />
      </mesh>
      {/* Cork Backing */}
      <mesh position={[0, 0.2, 0.035]} receiveShadow>
        <boxGeometry args={[3.12, 2.42, 0.02]} />
        <meshStandardMaterial color="#d8b896" roughness={0.95} />
      </mesh>

      {/* ── 2. Central Main Polaroid Frame ── */}
      <group
        position={[0, 0.15, 0.06]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredSub('mainFrame');
        }}
        onPointerOut={() => setHoveredSub(null)}
        onClick={(e) => {
          if (isActive && onSubItemClick) {
            e.stopPropagation();
            onSubItemClick('mainFrame');
          }
        }}
      >
        {/* Frame body */}
        <mesh castShadow>
          <boxGeometry args={[1.0, 1.3, 0.04]} />
          <meshStandardMaterial color="#faf9f6" roughness={0.4} />
        </mesh>
        {/* Photo area */}
        <mesh position={[0, 0.12, 0.022]}>
          <planeGeometry args={[0.82, 0.82]} />
          <meshStandardMaterial map={subjectTex} roughness={0.25} metalness={0.1} />
        </mesh>
        {/* Soft backlight glow behind the board on hover */}
        <pointLight
          color="#ffead1"
          intensity={hovered ? 1.8 : 0.6}
          distance={5}
          decay={2}
          position={[0, 0, -0.2]}
        />
      </group>

      {/* Handwritten quote card below main polaroid */}
      <group position={[0, -0.72, 0.06]} rotation={[0, 0, -0.04]}>
        {/* Card paper */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.28, 0.005]} />
          <meshStandardMaterial color="#fdfefe" roughness={0.9} />
        </mesh>
        {/* lines */}
        <mesh position={[0, 0.04, 0.004]}>
          <boxGeometry args={[0.34, 0.001, 0.008]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
        <mesh position={[0, -0.04, 0.004]}>
          <boxGeometry args={[0.38, 0.001, 0.008]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
        {/* light blue tape */}
        <mesh position={[0.22, 0.12, 0.006]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.08, 0.16, 0.001]} />
          <meshStandardMaterial color="#b0c4de" opacity={0.8} transparent />
        </mesh>
      </group>

      {/* Blush Pink Washi tape strip on top frame corner */}
      <mesh position={[-1.4, 1.25, 0.06]} rotation={[0, 0, 0.6]}>
        <planeGeometry args={[0.24, 0.08]} />
        <meshStandardMaterial color="#dca9a7" opacity={0.85} transparent />
      </mesh>
      {/* Light Blue Washi tape strip on bottom frame corner */}
      <mesh position={[1.4, -0.85, 0.06]} rotation={[0, 0, -0.4]}>
        <planeGeometry args={[0.22, 0.08]} />
        <meshStandardMaterial color="#b0c4de" opacity={0.85} transparent />
      </mesh>

      {/* ── 3. Around it: 6 Smaller Instant Photos ── */}
      <PinnedPhoto
        position={[-1.0, 0.8, 0.08]}
        rotationZ={0.15}
        index={1}
        hoveredSub={hoveredSub}
        setHoveredSub={setHoveredSub}
        onSubItemClick={onSubItemClick}
        isActive={isActive}
        texture={down1Tex}
      />
      <PinnedPhoto
        position={[-1.0, -0.4, 0.08]}
        rotationZ={-0.12}
        index={2}
        hoveredSub={hoveredSub}
        setHoveredSub={setHoveredSub}
        onSubItemClick={onSubItemClick}
        isActive={isActive}
        texture={up1Tex}
      />
      <PinnedPhoto
        position={[1.0, 0.8, 0.08]}
        rotationZ={-0.18}
        index={3}
        hoveredSub={hoveredSub}
        setHoveredSub={setHoveredSub}
        onSubItemClick={onSubItemClick}
        isActive={isActive}
        texture={down2Tex}
      />
      <PinnedPhoto
        position={[1.0, -0.4, 0.08]}
        rotationZ={0.1}
        index={4}
        hoveredSub={hoveredSub}
        setHoveredSub={setHoveredSub}
        onSubItemClick={onSubItemClick}
        isActive={isActive}
        texture={up2Tex}
      />
      <PinnedPhoto
        position={[0.0, 0.96, 0.08]}
        rotationZ={0.05}
        index={5}
        hoveredSub={hoveredSub}
        setHoveredSub={setHoveredSub}
        onSubItemClick={onSubItemClick}
        isActive={isActive}
        texture={down3Tex}
      />
      <PinnedPhoto
        position={[-0.4, -0.76, 0.08]}
        rotationZ={-0.08}
        index={6}
        hoveredSub={hoveredSub}
        setHoveredSub={setHoveredSub}
        onSubItemClick={onSubItemClick}
        isActive={isActive}
        texture={up3Tex}
      />

      {/* ── 4. String Lights (Draped across top) ── */}
      {/* Wires */}
      <mesh position={[-0.7, 1.25, 0.09]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[1.5, 0.01, 0.01]} />
        <meshBasicMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[0.7, 1.25, 0.09]} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[1.5, 0.01, 0.01]} />
        <meshBasicMaterial color="#7f8c8d" />
      </mesh>

      {/* Fairy bulbs */}
      <FairyBulb position={[-1.3, 1.28, 0.1]} delay={0} />
      <FairyBulb position={[-0.7, 1.23, 0.1]} delay={0.5} />
      <FairyBulb position={[0.0, 1.2, 0.1]} delay={1.0} />
      <FairyBulb position={[0.7, 1.23, 0.1]} delay={1.5} />
      <FairyBulb position={[1.3, 1.28, 0.1]} delay={2.0} />

      {/* Dried greenery/flower details in corners of board */}
      <mesh position={[-1.4, 1.1, 0.06]} rotation={[0, 0, 0.8]} castShadow>
        <boxGeometry args={[0.03, 0.3, 0.03]} />
        <meshStandardMaterial color="#65835b" />
      </mesh>
      <mesh position={[1.4, 1.1, 0.06]} rotation={[0, 0, -0.8]} castShadow>
        <boxGeometry args={[0.03, 0.3, 0.03]} />
        <meshStandardMaterial color="#65835b" />
      </mesh>

      {/* ── 5. Wooden Console Table (Sits on Floor, table top at y = -1.6) ── */}
      {/* Table Top */}
      <mesh castShadow receiveShadow position={[0, -1.6, 0.3]}>
        <boxGeometry args={[3.2, 0.08, 0.7]} />
        <meshStandardMaterial color="#6f4e37" roughness={0.7} />
      </mesh>
      {/* Table Legs extending down to floor (y = -4.5 in model space relative to center y = 2.5) */}
      <mesh castShadow position={[-1.48, -3.05, 0.6]}>
        <cylinderGeometry args={[0.04, 0.04, 2.9, 8]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[1.48, -3.05, 0.6]}>
        <cylinderGeometry args={[0.04, 0.04, 2.9, 8]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.8} />
      </mesh>
      {/* Back legs touching the wall */}
      <mesh castShadow position={[-1.48, -3.05, 0.05]}>
        <cylinderGeometry args={[0.04, 0.04, 2.9, 8]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[1.48, -3.05, 0.05]}>
        <cylinderGeometry args={[0.04, 0.04, 2.9, 8]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.8} />
      </mesh>

      {/* items on console table shelf */}
      {/* Potted succulent */}
      <group position={[0.9, -1.4, 0.4]}>
        {/* Pot */}
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.12, 0.3, 12]} />
          <meshStandardMaterial color="#ddb892" roughness={0.8} />
        </mesh>
        {/* Plant */}
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#81b29a" roughness={0.6} />
        </mesh>
      </group>

      {/* Decorative trinket books */}
      <group position={[-0.8, -1.5, 0.35]} rotation={[0, 0.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.08, 0.3]} />
          <meshStandardMaterial color="#81b29a" roughness={0.7} />
        </mesh>
        <mesh position={[0.02, 0.08, 0.0]} rotation={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.38, 0.07, 0.28]} />
          <meshStandardMaterial color="#ebdccb" roughness={0.7} />
        </mesh>
      </group>

      {/* ── Mini Birthday Cake ── */}
      <group position={[0.0, -1.56, 0.4]}>
        {/* Cake Plate */}
        <mesh castShadow position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.26, 0.24, 0.02, 16]} />
          <meshStandardMaterial color="#faf9f6" roughness={0.2} />
        </mesh>

        {/* Cake Tier 1 (Bottom) */}
        <mesh castShadow position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.12, 16]} />
          <meshStandardMaterial color="#e07a5f" roughness={0.6} />
        </mesh>

        {/* Cake Tier 2 (Top) */}
        <mesh castShadow position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color="#faf9f6" roughness={0.6} />
        </mesh>

        {/* Cream Dollops on Top Tier */}
        <mesh position={[0.1, 0.24, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#f4f1de" roughness={0.9} />
        </mesh>
        <mesh position={[-0.1, 0.24, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#f4f1de" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.24, 0.1]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#f4f1de" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.24, -0.1]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#f4f1de" roughness={0.9} />
        </mesh>

        {/* Tiny Cherry on Top */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#d94040" roughness={0.15} />
        </mesh>

        {/* Birthday Candle */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
          <meshStandardMaterial color="#81b29a" roughness={0.5} />
        </mesh>

        {/* Flame */}
        <mesh position={[0, 0.39, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#ffe8a3" toneMapped={false} />
        </mesh>

        <pointLight color="#ffe8a3" intensity={0.9} distance={2.0} position={[0, 0.42, 0]} />
      </group>

    </group>
  );
}
