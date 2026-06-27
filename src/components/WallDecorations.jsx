/**
 * WallDecorations.jsx — Birthday-themed decorations for back, left, and right walls.
 *
 * Adds warmth, personality, and celebratory energy to the café interior:
 *   • Back Wall:  Birthday banner, floating shelves, framed wall art
 *   • Left Wall:  Hanging lantern, mounted shelf, Korean text
 *   • Right Wall: Hanging lantern, bunting garland, decorative accents
 */

import { Text } from '@react-three/drei';

// ─── Wall position constants (matching CafeInterior.jsx) ──────────
const BACK_Z = -8.95;     // just in front of the back wall surface
const LEFT_X = -8.95;     // just in front of the left wall
const RIGHT_X = 8.95;     // just in front of the right wall

// ─── Color Palette ────────────────────────────────────────────────
const COLORS = {
  warmWood: '#C9A878',
  darkBrown: '#993C1D',
  dustyRose: '#D4A9A1',
  cream: '#F5E6D3',
  linen: '#E8D5C4',
  sage: '#7B9D7D',
  lanternGlow: '#FFC8A3',
  peach: '#FFB88C',
  gold: '#FFD4A3',
};

// ═══════════════════════════════════════════════════════════════════
//  Sub-components
// ═══════════════════════════════════════════════════════════════════

// ─── Mini Origami Crane for Garland ────────────────────────────────
function MiniOrigamiCrane({ position, color }) {
  return (
    <group position={position} scale={0.25}>
      {/* Main body */}
      <mesh castShadow>
        <coneGeometry args={[0.2, 0.5, 4]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.2, 0.1, 0]} rotation={[0.4, 0, -0.6]} castShadow>
        <boxGeometry args={[0.4, 0.01, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.1, 0]} rotation={[0.4, 0, 0.6]} castShadow>
        <boxGeometry args={[0.4, 0.01, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.22, 0.18]} rotation={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.35, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.18, -0.2]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.03, 0.3, 0.03]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}



// ─── Shelf Bracket Pair ───────────────────────────────────────────
function ShelfBrackets({ width }) {
  const offset = width / 2 - 0.15;
  return (
    <>
      {/* Left bracket */}
      <mesh position={[-offset, -0.15, 0]} castShadow>
        <boxGeometry args={[0.06, 0.25, 0.06]} />
        <meshStandardMaterial color={COLORS.darkBrown} roughness={0.7} />
      </mesh>
      {/* Right bracket */}
      <mesh position={[offset, -0.15, 0]} castShadow>
        <boxGeometry args={[0.06, 0.25, 0.06]} />
        <meshStandardMaterial color={COLORS.darkBrown} roughness={0.7} />
      </mesh>
    </>
  );
}

// ─── Floating Shelf ───────────────────────────────────────────────
function FloatingShelf({ position, width = 1.5, children }) {
  return (
    <group position={position}>
      {/* Shelf plank */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 0.07, 0.35]} />
        <meshStandardMaterial color={COLORS.warmWood} roughness={0.6} />
      </mesh>
      {/* Brackets */}
      <ShelfBrackets width={width} />
      {/* Items placed on top */}
      <group position={[0, 0.04, 0]}>
        {children}
      </group>
    </group>
  );
}

// ─── Small Decorative Vase with Plant ─────────────────────────────
function MiniVase({ position, vaseColor = COLORS.linen, plantColor = COLORS.sage }) {
  return (
    <group position={position}>
      {/* Vase body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.22, 10]} />
        <meshStandardMaterial color={vaseColor} roughness={0.4} />
      </mesh>
      {/* Greenery sprig */}
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color={plantColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.05, 0.22, 0.02]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.015, 0.14, 0.015]} />
        <meshStandardMaterial color={plantColor} />
      </mesh>
      <mesh position={[-0.04, 0.24, -0.01]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.015, 0.12, 0.015]} />
        <meshStandardMaterial color={plantColor} />
      </mesh>
    </group>
  );
}

// ─── Small Decorative Candle ──────────────────────────────────────
function MiniCandle({ position }) {
  return (
    <group position={position}>
      {/* Candle body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.18, 10]} />
        <meshStandardMaterial color={COLORS.cream} roughness={0.3} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.04, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Flame glow */}
      <mesh position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial color="#FFE4B0" />
      </mesh>
      <pointLight
        position={[0, 0.14, 0]}
        color="#FFD89C"
        intensity={0.3}
        distance={2}
        decay={2}
      />
    </group>
  );
}

// ─── Small Potted Plant ───────────────────────────────────────────
function MiniPottedPlant({ position, potColor = COLORS.dustyRose }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.16, 10]} />
        <meshStandardMaterial color={potColor} roughness={0.5} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 10]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {/* Little leaves */}
      <mesh position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={COLORS.sage} />
      </mesh>
      <mesh position={[0.04, 0.2, 0.01]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#6a9b6a" />
      </mesh>
    </group>
  );
}

// ─── Decorative Trinket (generic small item) ──────────────────────
function Trinket({ position, color = COLORS.dustyRose, shape = 'box' }) {
  return (
    <mesh position={position} castShadow>
      {shape === 'box' ? (
        <boxGeometry args={[0.12, 0.12, 0.12]} />
      ) : (
        <dodecahedronGeometry args={[0.07, 0]} />
      )}
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
    </mesh>
  );
}

// ─── Hanging Lantern ──────────────────────────────────────────────
function HangingLantern({ position }) {
  return (
    <group position={position}>
      {/* Cord */}
      <mesh>
        <boxGeometry args={[0.015, 1.8, 0.015]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Lantern body */}
      <group position={[0, -1.0, 0]}>
        {/* Frame cylinder */}
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.6, 12]} />
          <meshStandardMaterial
            color={COLORS.cream}
            roughness={0.5}
            transparent
            opacity={0.85}
            emissive={COLORS.lanternGlow}
            emissiveIntensity={0.7}
          />
        </mesh>
        {/* Top cap */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.08, 0.21, 0.06, 12]} />
          <meshStandardMaterial color={COLORS.darkBrown} roughness={0.7} />
        </mesh>
        {/* Bottom cap */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.21, 0.08, 0.06, 12]} />
          <meshStandardMaterial color={COLORS.darkBrown} roughness={0.7} />
        </mesh>
        {/* Interior glow */}
        <pointLight
          color={COLORS.lanternGlow}
          intensity={0.8}
          distance={12}
          decay={2}
        />
      </group>
    </group>
  );
}

// ─── Framed Wall Art ──────────────────────────────────────────────
function FramedArt({ position, width = 1.5, height = 2, fillColor = COLORS.cream }) {
  return (
    <group position={position}>
      {/* Frame border */}
      <mesh castShadow>
        <boxGeometry args={[width + 0.12, height + 0.12, 0.06]} />
        <meshStandardMaterial color={COLORS.darkBrown} roughness={0.7} />
      </mesh>
      {/* Canvas / print fill */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[width, height, 0.01]} />
        <meshStandardMaterial color={fillColor} roughness={0.85} />
      </mesh>
      {/* Abstract decorative detail */}
      <mesh position={[-width * 0.15, height * 0.12, 0.045]}>
        <circleGeometry args={[width * 0.18, 16]} />
        <meshStandardMaterial
          color={COLORS.dustyRose}
          roughness={0.9}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh position={[width * 0.1, -height * 0.15, 0.045]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.03, height * 0.4, 0.005]} />
        <meshStandardMaterial color={COLORS.darkBrown} roughness={0.9} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Bunting Triangle ─────────────────────────────────────────────
function BuntingTriangle({ position, color, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <coneGeometry args={[0.15, 0.28, 3]} />
      <meshStandardMaterial color={color} roughness={0.6} side={2} />
    </mesh>
  );
}

// ─── Glowing Decorative Decal ─────────────────────────────────────
function GlowDecal({ position, color, shape = 'heart' }) {
  return (
    <group position={position}>
      {shape === 'heart' && (
        <mesh>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            roughness={0.5}
          />
        </mesh>
      )}
      {shape === 'star' && (
        <mesh rotation={[0, 0, Math.PI / 5]}>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            roughness={0.4}
          />
        </mesh>
      )}
      {shape === 'flower' && (
        <>
          <mesh>
            <torusGeometry args={[0.09, 0.035, 6, 12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              roughness={0.5}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color={COLORS.gold} />
          </mesh>
        </>
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════════════════════════════════

export default function WallDecorations() {
  return (
    <group>

      {/* ════════════════════════════════════════════════════════════
          BACK WALL  (z ≈ -9, facing +Z)
          ════════════════════════════════════════════════════════════ */}
      <group>

        {/* ── Birthday Banner ── */}
        <group position={[0, 7, BACK_Z + 0.15]}>
          {/* Banner background panel */}
          <mesh castShadow>
            <boxGeometry args={[4, 1, 0.05]} />
            <meshStandardMaterial color="#f7ede2" roughness={0.8} />
          </mesh>
          {/* Subtle border accent */}
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[4.1, 1.1, 0.01]} />
            <meshStandardMaterial color={COLORS.dustyRose} transparent opacity={0.3} />
          </mesh>
          {/* Main text */}
          <Text
            position={[0, 0.12, 0.04]}
            fontSize={0.4}
            color={COLORS.dustyRose}
            anchorX="center"
            anchorY="middle"
          >
            Happy Birthday
          </Text>
          {/* Japanese sub-text */}
          <Text
            position={[0, -0.28, 0.04]}
            fontSize={0.20}
            color={COLORS.darkBrown}
            font="https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-400-normal.woff"
            anchorX="center"
            anchorY="middle"
          >
            お誕生日おめでとうございます
          </Text>

          {/* Corner bunting cones — top-left */}
          <BuntingTriangle position={[-2.1, 0.45, 0.04]} color={COLORS.dustyRose} rotation={[0, 0, Math.PI]} />
          <BuntingTriangle position={[-1.85, 0.55, 0.04]} color={COLORS.warmWood} rotation={[0, 0, Math.PI]} />
          {/* Corner bunting cones — top-right */}
          <BuntingTriangle position={[2.1, 0.45, 0.04]} color={COLORS.dustyRose} rotation={[0, 0, Math.PI]} />
          <BuntingTriangle position={[1.85, 0.55, 0.04]} color={COLORS.warmWood} rotation={[0, 0, Math.PI]} />
          {/* Bottom-left */}
          <BuntingTriangle position={[-2.1, -0.45, 0.04]} color={COLORS.warmWood} />
          <BuntingTriangle position={[-1.85, -0.55, 0.04]} color={COLORS.dustyRose} />
          {/* Bottom-right */}
          <BuntingTriangle position={[2.1, -0.45, 0.04]} color={COLORS.warmWood} />
          <BuntingTriangle position={[1.85, -0.55, 0.04]} color={COLORS.dustyRose} />
        </group>

        {/* ── Floating Shelf: Upper-Left ── */}
        <FloatingShelf position={[-4, 6, BACK_Z + 0.25]} width={1.5}>
          <MiniVase position={[-0.3, 0.05, 0]} vaseColor={COLORS.linen} />
          <MiniCandle position={[0.35, 0.05, 0]} />
        </FloatingShelf>

        {/* ── Floating Shelf: Upper-Right ── */}
        <FloatingShelf position={[4, 6, BACK_Z + 0.25]} width={1.5}>
          <MiniPottedPlant position={[-0.3, 0.05, 0]} />
          <Trinket position={[0.35, 0.1, 0]} color={COLORS.dustyRose} shape="dodec" />
        </FloatingShelf>

        {/* ── Floating Shelf: Lower-Center (wider) ── */}
        <FloatingShelf position={[0, 5, BACK_Z + 0.25]} width={3}>
          <MiniVase position={[-0.9, 0.05, 0]} vaseColor={COLORS.dustyRose} plantColor="#6a9b6a" />
          <MiniCandle position={[-0.3, 0.05, 0]} />
          <MiniPottedPlant position={[0.2, 0.05, 0]} potColor={COLORS.warmWood} />
          <Trinket position={[0.75, 0.1, 0]} color={COLORS.linen} shape="box" />
          <Trinket position={[1.1, 0.1, 0]} color={COLORS.sage} shape="dodec" />
        </FloatingShelf>

        {/* ── Framed Wall Art: Left ── */}
        <FramedArt
          position={[-6, 5.5, BACK_Z + 0.12]}
          width={1.2}
          height={1.6}
          fillColor={COLORS.cream}
        />

        {/* ── Framed Wall Art: Right ── */}
        <FramedArt
          position={[6, 5.5, BACK_Z + 0.12]}
          width={1.2}
          height={1.6}
          fillColor={COLORS.dustyRose}
        />

        {/* ── Framed Wall Art: Center-Low ── */}
        <FramedArt
          position={[0, 3, BACK_Z + 0.12]}
          width={1.0}
          height={1.0}
          fillColor={COLORS.linen}
        />
      </group>


      {/* ════════════════════════════════════════════════════════════
          LEFT WALL  (x ≈ -9, facing +X)
          All positions are in the left-wall's local rotated space.
          ════════════════════════════════════════════════════════════ */}
      <group>

        {/* ── Hanging Lantern ── */}
        <HangingLantern position={[LEFT_X + 0.15, 7.5, 2]} />

        {/* ── Wall-Mounted Shelf ── */}
        <group position={[LEFT_X + 0.25, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <FloatingShelf position={[0, 0, 0]} width={2.5}>
            <MiniPottedPlant position={[-0.6, 0.05, 0]} />
            <Trinket position={[0.5, 0.1, 0]} color={COLORS.dustyRose} shape="dodec" />
          </FloatingShelf>
        </group>

        {/* ── Japanese Text Plaque ── */}
        <group position={[LEFT_X + 0.12, 6.5, -3]} rotation={[0, Math.PI / 2, 0]}>
          {/* Background plaque */}
          <mesh castShadow>
            <boxGeometry args={[2.0, 0.5, 0.04]} />
            <meshStandardMaterial color="#f7ede2" roughness={0.8} />
          </mesh>
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.3}
            color={COLORS.darkBrown}
            font="https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-400-normal.woff"
            anchorX="center"
            anchorY="middle"
          >
            お誕生日
          </Text>
        </group>
      </group>


      {/* ════════════════════════════════════════════════════════════
          RIGHT WALL  (x ≈ 9, facing -X)
          ════════════════════════════════════════════════════════════ */}
      <group>

        {/* ── Hanging Lantern (mirror of left) ── */}
        <HangingLantern position={[RIGHT_X - 0.15, 7.5, -2]} />

        {/* ── Birthday Garland with Origami Cranes (spans the wall at Y≈7) ── */}
        <group position={[RIGHT_X - 0.12, 6.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
          {/* String / rope */}
          <mesh>
            <boxGeometry args={[12, 0.02, 0.02]} />
            <meshStandardMaterial color="#8b7355" roughness={0.9} />
          </mesh>
          {/* Hanging Origami Cranes alternating colors */}
          {Array.from({ length: 9 }).map((_, i) => {
            const x = -5.5 + i * 1.4;
            const color = i % 2 === 0 ? COLORS.dustyRose : COLORS.sage;
            return (
              <group key={`crane-g-${i}`} position={[x, -0.15, 0]}>
                {/* Hanging string from rope */}
                <mesh position={[0, 0.075, 0]}>
                  <boxGeometry args={[0.005, 0.15, 0.005]} />
                  <meshBasicMaterial color="#ebdccb" />
                </mesh>
                <MiniOrigamiCrane color={color} />
              </group>
            );
          })}
        </group>

        {/* ── Decorative Glowing Decals ── */}
        {/* Heart */}
        <GlowDecal
          position={[RIGHT_X - 0.12, 5.5, 4]}
          color={COLORS.peach}
          shape="heart"
        />
        {/* Star */}
        <GlowDecal
          position={[RIGHT_X - 0.12, 6.8, -5]}
          color={COLORS.gold}
          shape="star"
        />
        {/* Flower */}
        <GlowDecal
          position={[RIGHT_X - 0.12, 4, 2]}
          color={COLORS.dustyRose}
          shape="flower"
        />
      </group>

    </group>
  );
}
