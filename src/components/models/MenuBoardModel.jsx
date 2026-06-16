/**
 * MenuBoardModel.jsx — Starbucks-style Café Menu Board.
 *
 * Renders:
 *   • A dark wooden A-frame easel stand
 *   • A dark slate chalkboard
 *   • Flat projected 3D HTML text overlay styled like a real café chalkboard
 */

import { Html } from '@react-three/drei';

export default function MenuBoardModel({ hovered = false, isActive = false }) {
  const woodMaterial = <meshStandardMaterial color="#4a2c11" roughness={0.85} />;
  const slateMaterial = <meshStandardMaterial color="#1e272c" roughness={0.9} />;

  return (
    <group>
      {/* ── Easel Stand Legs ── */}
      {/* Left Front Leg */}
      <mesh castShadow position={[-0.45, -0.4, 0.15]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.06, 1.8, 0.06]} />
        {woodMaterial}
      </mesh>
      {/* Right Front Leg */}
      <mesh castShadow position={[0.45, -0.4, 0.15]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.06, 1.8, 0.06]} />
        {woodMaterial}
      </mesh>
      {/* Left Back Leg */}
      <mesh castShadow position={[-0.45, -0.4, -0.15]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.06, 1.8, 0.06]} />
        {woodMaterial}
      </mesh>
      {/* Right Back Leg */}
      <mesh castShadow position={[0.45, -0.4, -0.15]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.06, 1.8, 0.06]} />
        {woodMaterial}
      </mesh>

      {/* Top Hinge Bar */}
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.96, 0.06, 0.12]} />
        {woodMaterial}
      </mesh>

      {/* ── Main Chalkboard Slate ── */}
      <group position={[0, 0.05, 0.12]} rotation={[-0.05, 0, 0]}>
        {/* Frame Outer Back */}
        <mesh castShadow position={[0, 0, -0.02]}>
          <boxGeometry args={[0.9, 1.0, 0.04]} />
          {woodMaterial}
        </mesh>
        {/* Slate Writing Surface */}
        <mesh position={[0, 0, 0.01]} receiveShadow>
          <boxGeometry args={[0.8, 0.9, 0.02]} />
          {slateMaterial}
        </mesh>

        {/* ── Chalkboard 3D Projected HTML Overlay ── */}
        <Html
          transform
          occlude
          position={[0, 0.02, 0.022]}
          scale={0.065}
          style={{
            width: '800px',
            height: '900px',
            color: '#f0ede6',
            fontFamily: '"Chalkboard SE", "Comic Sans MS", cursive, sans-serif',
            userSelect: 'none',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px',
            background: 'transparent',
          }}
        >
          <div className="chalk-board">
            <h1 className="chalk-title">☕ CAFE MENU ☕</h1>
            <div className="chalk-divider">~~~~~~~~~~~~~~~~</div>
            <ul className="chalk-menu-list">
              <li>
                <span className="item-name">Forever Young Latte</span>
                <span className="item-price">₩0</span>
                <p className="item-desc">Double espresso, sweet laughter, chocolate curls</p>
              </li>
              <li>
                <span className="item-name">Sweet Birthday Matcha</span>
                <span className="item-price">₩0</span>
                <p className="item-desc">Premium matcha, warm milk, endless wishes</p>
              </li>
              <li>
                <span className="item-name">Cozy Macchiato</span>
                <span className="item-price">₩0</span>
                <p className="item-desc">Caramel, steamed joy, soft blanket essence</p>
              </li>
              <li>
                <span className="item-name">Endless Joy Tea</span>
                <span className="item-price">₩0</span>
                <p className="item-desc">Fresh green tea leaves, cherry blossom petals</p>
              </li>
            </ul>
            <div className="chalk-footer">★ Happy Birthday! ★</div>
          </div>
        </Html>
      </group>
    </group>
  );
}
