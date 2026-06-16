import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── Stylized Plant Component ─────────────────────────────────────
function StylizedPlant({ position }) {
  return (
    <group position={position}>
      {/* Ceramic Pot */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.35, 0.25, 0.8, 16]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.5} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 16]} />
        <meshStandardMaterial color="#4a3c31" roughness={0.9} />
      </mesh>
      {/* Tall Stem & Leaves */}
      <group position={[0, 0.8, 0]}>
        {/* Central stem */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.02, 0.04, 1.2, 8]} />
          <meshStandardMaterial color="#6e8a68" />
        </mesh>
        {/* Overlapping big leaves */}
        <mesh position={[0.2, 0.5, 0.1]} rotation={[0.4, 0, -0.5]}>
          <boxGeometry args={[0.3, 0.01, 0.5]} />
          <meshStandardMaterial color="#556b2f" roughness={0.6} />
        </mesh>
        <mesh position={[-0.2, 0.7, -0.1]} rotation={[-0.3, 0, 0.6]}>
          <boxGeometry args={[0.25, 0.01, 0.45]} />
          <meshStandardMaterial color="#4f622d" roughness={0.6} />
        </mesh>
        <mesh position={[0.1, 0.9, -0.2]} rotation={[0.2, 0.5, -0.3]}>
          <boxGeometry args={[0.28, 0.01, 0.48]} />
          <meshStandardMaterial color="#5d7b53" roughness={0.6} />
        </mesh>
        <mesh position={[-0.1, 1.1, 0.15]} rotation={[-0.1, -0.4, 0.4]}>
          <boxGeometry args={[0.22, 0.01, 0.4]} />
          <meshStandardMaterial color="#65835b" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Wall Shelf Unit Component ────────────────────────────────────
function WallShelf({ position }) {
  return (
    <group position={position}>
      {/* Main wooden backboard grid */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.06, 0.8]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>
      {/* Side supports */}
      <mesh position={[-1.05, 0.4, 0]} castShadow>
        <boxGeometry args={[0.06, 0.8, 0.8]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>
      <mesh position={[1.05, 0.4, 0]} castShadow>
        <boxGeometry args={[0.06, 0.8, 0.8]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>
      {/* Top shelf plank */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2.2, 0.06, 0.8]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>

      {/* Decorative items on shelves */}
      {/* Ceramic vase */}
      <mesh position={[-0.6, 0.25, 0.15]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.35, 12]} />
        <meshStandardMaterial color="#faf9f6" roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Stack of books */}
      <group position={[0.2, 0.15, 0.1]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.4, 0.08, 0.3]} />
          <meshStandardMaterial color="#bdc3c7" roughness={0.8} />
        </mesh>
        <mesh position={[0.02, 0.08, 0.02]} rotation={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[0.38, 0.07, 0.28]} />
          <meshStandardMaterial color="#cd853f" roughness={0.8} />
        </mesh>
      </group>

      {/* Tiny succulent plant on top shelf */}
      <group position={[-0.4, 0.95, 0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.08, 0.2, 12]} />
          <meshStandardMaterial color="#dfc5a0" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#556b2f" />
        </mesh>
      </group>
      
      {/* ── Pothos Plant in Glass Vessel ── */}
      <group position={[0.65, 0.95, 0.1]}>
        {/* Glass container */}
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.22, 12]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.3} roughness={0.1} />
        </mesh>
        {/* Water inside */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 0.12, 12]} />
          <meshStandardMaterial color="#add8e6" transparent opacity={0.5} roughness={0.1} />
        </mesh>
        {/* Leaves overflowing / cascading down */}
        <group position={[0, 0.12, 0.05]}>
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#65835b" />
          </mesh>
          {/* Ivy vine hanging down the front of the shelf */}
          <mesh position={[0.06, -0.16, 0.08]} rotation={[0.25, 0, 0.1]}>
            <boxGeometry args={[0.015, 0.32, 0.015]} />
            <meshStandardMaterial color="#65835b" />
          </mesh>
          <mesh position={[0.08, -0.1, 0.09]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#7a9a60" />
          </mesh>
          <mesh position={[0.05, -0.22, 0.1]}>
            <sphereGeometry args={[0.045, 6, 6]} />
            <meshStandardMaterial color="#577844" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─── Minimalist Wall Clock ────────────────────────────────────────
function WallClock({ position }) {
  return (
    <group position={position} rotation={[0, 0, 0]}>
      {/* Outer Wooden Rim */}
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#5c4033" roughness={0.6} />
      </mesh>
      {/* White Dial */}
      <mesh position={[0, 0, 0.045]}>
        <cylinderGeometry args={[0.44, 0.44, 0.02, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Hour Hand (set to 3 o'clock) */}
      <mesh position={[0.12, 0, 0.06]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.22, 0.03, 0.01]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
      </mesh>
      {/* Minute Hand (pointing to 12) */}
      <mesh position={[0, 0.18, 0.06]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.025, 0.32, 0.01]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
      </mesh>
      {/* Center cap */}
      <mesh position={[0, 0, 0.068]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </group>
  );
}

// ─── Abstract Artwork Frame Component ─────────────────────────────
function ArtFrame({ position, themeColor }) {
  return (
    <group position={position}>
      {/* Wood Frame */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 2.0, 0.08]} />
        <meshStandardMaterial color="#3e2723" roughness={0.8} />
      </mesh>
      {/* Matte Canvas */}
      <mesh position={[0, 0, 0.05]} castShadow>
        <boxGeometry args={[1.36, 1.86, 0.02]} />
        <meshStandardMaterial color="#fcfcf9" roughness={0.95} />
      </mesh>
      {/* Abstract Art Geometry Details */}
      <group position={[0, 0, 0.065]}>
        {/* Soft circle representing ink wash or sun */}
        <mesh position={[-0.15, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.01, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color={themeColor} roughness={0.9} transparent opacity={0.85} />
        </mesh>
        {/* Accent dark lines representing brushstrokes */}
        <mesh position={[0.1, -0.3, 0]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.04, 0.9, 0.012]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.9} />
        </mesh>
        <mesh position={[-0.2, -0.4, 0]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.03, 0.6, 0.012]} />
          <meshStandardMaterial color="#7f8c8d" roughness={0.9} />
        </mesh>
        {/* Small warm spot */}
        <mesh position={[0.2, 0.4, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#e67e22" />
        </mesh>
      </group>
    </group>
  );
}

// ─── Seating Bench (Corner Decor) ─────────────────────────────────
function WoodenBench({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Bench Seat Plank */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2.5, 0.1, 0.8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.7} />
      </mesh>
      {/* Cushions */}
      <mesh position={[-0.6, 0.5, 0.05]} castShadow>
        <boxGeometry args={[0.7, 0.1, 0.5]} />
        <meshStandardMaterial color="#dca9a7" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.5, 0.05]} castShadow>
        <boxGeometry args={[0.7, 0.1, 0.5]} />
        <meshStandardMaterial color="#81b29a" roughness={0.9} />
      </mesh>
      {/* Bench Backrest */}
      <mesh castShadow position={[0, 1.0, -0.35]}>
        <boxGeometry args={[2.5, 0.3, 0.08]} />
        <meshStandardMaterial color="#5c4033" roughness={0.7} />
      </mesh>
      {/* Backrest Spindles (supports) */}
      <mesh position={[-0.9, 0.65, -0.35]} castShadow>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      <mesh position={[0, 0.65, -0.35]} castShadow>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      <mesh position={[0.9, 0.65, -0.35]} castShadow>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {/* Legs */}
      <mesh position={[-1.1, 0.2, -0.28]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#4a3c31" />
      </mesh>
      <mesh position={[1.1, 0.2, -0.28]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#4a3c31" />
      </mesh>
      <mesh position={[-1.1, 0.2, 0.28]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#4a3c31" />
      </mesh>
      <mesh position={[1.1, 0.2, 0.28]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#4a3c31" />
      </mesh>
    </group>
  );
}

// ─── Main Cafe Interior ───────────────────────────────────────────
export default function CafeInterior() {
  const wallHeight = 10;
  const wallWidth = 18;
  const depthZ = -9;
  const leftX = -9;
  const rightX = 9;

  // Generate coordinates for vertical panel slats along the back wall
  const backWallSlats = useMemo(() => {
    const slats = [];
    const count = 30;
    const startX = -8.7;
    const step = 17.4 / (count - 1);
    for (let i = 0; i < count; i++) {
      slats.push(startX + i * step);
    }
    return slats;
  }, []);

  return (
    <group>
      {/* ── 1. Back Wall Base (Cream/Beige Panel) ── */}
      <mesh position={[0, wallHeight / 2 - 2.0, depthZ]} receiveShadow>
        <planeGeometry args={[wallWidth, wallHeight]} />
        <meshStandardMaterial color="#F5E6D3" roughness={0.9} />
      </mesh>

      {/* Repeating 3D vertical panel slats for drop shadows/realistic gaps */}
      {backWallSlats.map((xVal, index) => (
        <mesh
          key={`back-slat-${index}`}
          position={[xVal, wallHeight / 2 - 2.0, depthZ + 0.025]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.2, wallHeight, 0.04]} />
          <meshStandardMaterial color="#ebdccb" roughness={0.8} />
        </mesh>
      ))}

      {/* ── 2. Left Wall (Taupe Wooden Slats & Wainscoting) ── */}
      <group position={[leftX, wallHeight / 2 - 2.0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[wallWidth, wallHeight]} />
          <meshStandardMaterial color="#E8DCC8" roughness={0.9} />
        </mesh>
        {/* Horizontal wooden support trims */}
        <mesh position={[0, -1.5, 0.03]} castShadow receiveShadow>
          <boxGeometry args={[wallWidth, 0.15, 0.05]} />
          <meshStandardMaterial color="#8b7355" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.5, 0.03]} castShadow receiveShadow>
          <boxGeometry args={[wallWidth, 0.1, 0.05]} />
          <meshStandardMaterial color="#8b7355" roughness={0.7} />
        </mesh>

        {/* ── Hanging Macramé Tapestry ── */}
        <group position={[-2, 1.8, 0.08]} rotation={[0, 0, 0]}>
          {/* Wooden hanging rod */}
          <mesh castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#8b7355" />
          </mesh>
          {/* Fabric sheet */}
          <mesh position={[0, -0.6, 0.015]} castShadow>
            <boxGeometry args={[0.9, 1.2, 0.015]} />
            <meshStandardMaterial color="#f5ebe0" roughness={0.9} />
          </mesh>
          {/* Decorative woven stripes details */}
          <mesh position={[0, -0.5, 0.025]}>
            <boxGeometry args={[0.7, 0.06, 0.01]} />
            <meshStandardMaterial color="#8b7355" />
          </mesh>
          <mesh position={[0, -0.7, 0.025]}>
            <boxGeometry args={[0.7, 0.06, 0.01]} />
            <meshStandardMaterial color="#dca9a7" />
          </mesh>
          {/* Fringe tassels at the bottom */}
          <mesh position={[-0.3, -1.24, 0.015]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
            <meshStandardMaterial color="#ebdccb" />
          </mesh>
          <mesh position={[0.0, -1.24, 0.015]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
            <meshStandardMaterial color="#ebdccb" />
          </mesh>
          <mesh position={[0.3, -1.24, 0.015]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
            <meshStandardMaterial color="#ebdccb" />
          </mesh>
        </group>
      </group>

      {/* ── 3. Right Wall (Taupe Wood Slats & Wainscoting) ── */}
      <group position={[rightX, wallHeight / 2 - 2.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[wallWidth, wallHeight]} />
          <meshStandardMaterial color="#E8DCC8" roughness={0.9} />
        </mesh>
        {/* Horizontal wooden support trims */}
        <mesh position={[0, -1.5, 0.03]} castShadow receiveShadow>
          <boxGeometry args={[wallWidth, 0.15, 0.05]} />
          <meshStandardMaterial color="#8b7355" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.5, 0.03]} castShadow receiveShadow>
          <boxGeometry args={[wallWidth, 0.1, 0.05]} />
          <meshStandardMaterial color="#8b7355" roughness={0.7} />
        </mesh>
      </group>

      {/* ── 4. Ceiling (Soft Gray with Hanok Lattice Ceiling Trim) ── */}
      <mesh
        position={[0, wallHeight - 2.0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[wallWidth, wallWidth]} />
        <meshStandardMaterial color="#D4D0C8" roughness={0.8} />
      </mesh>
      {/* Decorative ceiling framing beams (Hanok grid vibe) */}
      <mesh position={[0, wallHeight - 2.03, depthZ + 0.5]} castShadow>
        <boxGeometry args={[wallWidth, 0.12, 0.2]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>
      <mesh position={[leftX + 0.5, wallHeight - 2.03, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[wallWidth, 0.12, 0.2]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>
      <mesh position={[rightX - 0.5, wallHeight - 2.03, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[wallWidth, 0.12, 0.2]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>

      {/* ── 5. Wall Decorations ── */}
      {/* Korean Abstract Art 1 */}
      <ArtFrame position={[-2.5, 3.2, depthZ + 0.1]} themeColor="#e59866" />
      {/* Korean Abstract Art 2 */}
      <ArtFrame position={[2.5, 3.2, depthZ + 0.1]} themeColor="#a2d9ce" />

      {/* Wooden Sign Plaque with Hangul cafe name */}
      <group position={[0, 4.25, depthZ + 0.12]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.44, 0.04]} />
          <meshStandardMaterial color="#5c4033" roughness={0.7} />
        </mesh>
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.16}
          color="#fdfefe"
          anchorX="center"
          anchorY="middle"
        >
          하루 카페
        </Text>
      </group>

      {/* Wooden Shelving Unit with mini ceramics */}
      <WallShelf position={[-5.8, 2.5, depthZ + 0.4]} />

      {/* Minimalist Clock */}
      <WallClock position={[5.8, 3.8, depthZ + 0.1]} />

      {/* ── 6. Floor Decor (Corner Plants & Bench) ── */}
      <StylizedPlant position={[-7.8, -2.0, -7.8]} />
      <StylizedPlant position={[7.8, -2.0, -7.8]} />

      {/* Main Left-Middle Plant from Top View */}
      <StylizedPlant position={[-7.5, -2.0, -2.5]} />

      {/* Main Right-Middle Bench from Top View */}
      <WoodenBench position={[7.2, -2.0, -2.5]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ── 7. Decorative Ceiling-Hung Lanterns ── */}
      {/* Prominent Back-Wall Paper Lantern (Right Side of Memory Wall) */}
      <group position={[3.2, 5.0, -8.0]}>
        {/* Cord */}
        <mesh position={[0, 0.875, 0]} castShadow>
          <boxGeometry args={[0.02, 4.25, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Shade */}
        <mesh position={[0, -1.25, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.34, 0.65, 8]} />
          <meshStandardMaterial color="#fdfefe" roughness={0.9} emissive="#ffeaad" emissiveIntensity={0.8} />
        </mesh>
        <pointLight color="#ffe3c4" intensity={1.5} distance={5} decay={2} position={[0, -1.25, 0]} />
      </group>

      {/* Lamp 1 */}
      <group position={[-5, 5, -5]}>
        {/* Cord */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.02, 4.5, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Shade (Korean paper lantern style) */}
        <mesh position={[0, -1.5, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.34, 0.65, 8]} />
          <meshStandardMaterial color="#fdfefe" roughness={0.9} emissive="#ffeaad" emissiveIntensity={0.8} />
        </mesh>
        <pointLight color="#ffe3c4" intensity={1.5} distance={5} decay={2} position={[0, -1.5, 0]} />
      </group>
      {/* Lamp 2 */}
      <group position={[5, 5, -5]}>
        {/* Cord */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.02, 4.5, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Shade (Korean paper lantern style) */}
        <mesh position={[0, -1.5, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.34, 0.65, 8]} />
          <meshStandardMaterial color="#fdfefe" roughness={0.9} emissive="#ffeaad" emissiveIntensity={0.8} />
        </mesh>
        <pointLight color="#ffe3c4" intensity={1.5} distance={5} decay={2} position={[0, -1.5, 0]} />
      </group>
    </group>
  );
}
