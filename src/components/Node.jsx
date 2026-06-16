/**
 * Node.jsx — Reusable, interactive 3D waypoint wrapper.
 *
 * Features:
 *   • Click   → calls onSelect(id) to mark this node as "active"
 *   • Hover   → cursor changes to pointer, node scales up smoothly
 *              and rotation speed increases
 *   • Float   → gentle sine-wave bobbing on the Y axis
 *   • Active  → stays scaled up while selected (visual feedback)
 *
 * The visual content is provided via the `modelElement` prop — any
 * JSX element (single mesh or multi-mesh group) that should be
 * rendered inside this interactive wrapper.
 *
 * Props:
 *   id            – unique string identifier for this node
 *   modelElement  – JSX element to render (e.g. <CakeModel />)
 *   position      – [x, y, z] world position
 *   rotation      – [x, y, z] initial rotation (radians)
 *   scale         – base uniform scale factor
 *   speed         – base rotation speed multiplier
 *   floatAmp      – vertical bobbing amplitude
 *   floatFreq     – vertical bobbing frequency
 *   isActive      – boolean — is this node currently selected?
 *   onSelect      – callback(id) fired on click
 */

import React, { useRef, useState, useCallback, cloneElement } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';

// ─── Animation constants (tweak to taste) ────────────────────────
/** How much bigger the node gets on hover. */
const HOVER_SCALE = 1.2;
/** How much bigger the node gets when active (but not hovered). */
const ACTIVE_SCALE = 1.1;
/** Lerp factor per frame — lower = smoother, higher = snappier. */
const SCALE_LERP = 0.08;
/** Rotation speed multiplier when hovered. */
const HOVER_SPIN_MULT = 2.5;

export default function Node({
  id,
  modelElement,
  position,
  rotation,
  scale: baseScale = 1,
  speed = 0.2,
  floatAmp = 0.25,
  floatFreq = 1.0,
  isActive = false,
  revealed = true, // Area-based reveals
  disableSpin = false, // When true, skip constant Y-axis rotation (model handles its own)
  onSelect,
  ...extraProps
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const baseY = position[1];

  // Drei helper — swaps document.body.style.cursor automatically
  useCursor(revealed && hovered, 'pointer', 'auto');

  // ─── Event handlers ──────────────────────────────────────────
  const handlePointerOver = useCallback((e) => {
    if (!revealed) return;
    e.stopPropagation();          // don't trigger nodes behind this one
    setHovered(true);
  }, [revealed]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
  }, []);

  const handleClick = useCallback((e) => {
    if (!revealed) return;
    e.stopPropagation();
    onSelect?.(id);
  }, [id, onSelect, revealed]);

  // ─── Per-frame animation ─────────────────────────────────────
  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const elapsed = state.clock.getElapsedTime();

    // 1. Determine target scale
    let targetScale = baseScale;
    if (!revealed) targetScale = 0;
    else if (hovered) targetScale = baseScale * HOVER_SCALE;
    else if (isActive) targetScale = baseScale * ACTIVE_SCALE;

    // Smooth lerp toward the target scale
    const current = group.scale.x;
    const lerped = THREE.MathUtils.lerp(current, targetScale, SCALE_LERP);
    group.scale.setScalar(lerped);

    // 2. Rotation — gentle Y spin, faster when hovered (skip if model handles its own)
    if (!disableSpin) {
      const spinMult = hovered ? HOVER_SPIN_MULT : 1;
      group.rotation.y += speed * 0.01 * spinMult;
    }

    // 3. Vertical float (sine bob)
    // Only float when revealed to avoid coordinate jumps
    if (revealed) {
      group.position.y = baseY + Math.sin(elapsed * floatFreq) * floatAmp;
    } else {
      group.position.y = baseY;
    }
  });

  // ─── Render ──────────────────────────────────────────────────
  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={revealed ? baseScale : 0}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {cloneElement(modelElement, { hovered, isActive, revealed, ...extraProps })}

      {/* Subtle floor-anchored glowing halo ring under the node */}
      {(hovered || isActive) && (
        <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.76, 32]} />
          <meshBasicMaterial color="#ffd4a3" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
