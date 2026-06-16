/**
 * CameraRig.jsx — Smooth camera animation controller.
 *
 * Responsibilities:
 *   1. Render & manage OrbitControls
 *   2. When a waypoint becomes active, spring-animate the camera
 *      to a designated viewing angle and look-at target
 *   3. When deselected, animate back to the default overview position
 *   4. Disable OrbitControls during animation so they don't fight
 *
 * This component is intentionally separated from Scene rendering
 * so camera logic can be debugged and tweaked in isolation.
 *
 * Props:
 *   activeNodeId  – ID of the currently selected waypoint (or null)
 *   nodes         – the SHAPES config array (needs .id, .position, .cameraOffset)
 *   onRest        – optional callback fired when camera animation settles
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useSpring } from '@react-spring/three';
import * as THREE from 'three';

// ─── Defaults (tweak to taste) ───────────────────────────────────

/** Camera resting position when nothing is selected. */
const DEFAULT_POSITION = [5, 4, 8];

/** Where the camera looks when nothing is selected. */
const DEFAULT_TARGET = [0, 1, 0];

/**
 * Fallback offset added to a node's position to compute where the
 * camera should go.  Individual shapes can override this via their
 * own `cameraOffset` field.
 *   [+x = right, +y = up, +z = towards viewer]
 */
const DEFAULT_CAMERA_OFFSET = [3, 2.5, 4];

/** Spring physics config — controls animation feel. */
const SPRING_CONFIG = {
  mass: 1.2,
  tension: 60,
  friction: 22,
};

/**
 * When the animated camera is within this distance of its target,
 * we consider the animation "settled" and re-enable OrbitControls.
 */
const SETTLE_THRESHOLD = 0.05;

// ─── Helpers ─────────────────────────────────────────────────────

/** Compute the camera destination for a given node. */
function getCameraGoals(node) {
  const offset = node.cameraOffset ?? DEFAULT_CAMERA_OFFSET;
  const pos = node.position;

  // Shift the camera target slightly upwards so both the 3D model (bottom)
  // and the floating card (top) are perfectly framed in the viewport.
  const targetYOffset = 0.65;

  return {
    position: [
      pos[0] + offset[0],
      pos[1] + offset[1],
      pos[2] + offset[2],
    ],
    target: [pos[0], pos[1] + targetYOffset, pos[2]],
  };
}

// ─── Component ───────────────────────────────────────────────────

export default function CameraRig({ activeNodeId, nodes, onRest }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  // Track whether the spring animation is still in flight
  const [isAnimating, setIsAnimating] = useState(false);

  // Build a lookup map: id → node config  (stable unless nodes change)
  const nodeMap = useMemo(() => {
    const map = {};
    for (const n of nodes) map[n.id] = n;
    return map;
  }, [nodes]);

  // ─── Compute spring targets ──────────────────────────────────
  const activeNode = activeNodeId ? nodeMap[activeNodeId] : null;

  const goals = activeNode
    ? getCameraGoals(activeNode)
    : { position: DEFAULT_POSITION, target: DEFAULT_TARGET };

  // ─── Spring animation ────────────────────────────────────────
  const [springs] = useSpring(
    () => ({
      camPos: goals.position,
      camTarget: goals.target,
      config: SPRING_CONFIG,
      onChange: () => {
        // Mark as animating whenever the spring is moving
        if (!isAnimating) setIsAnimating(true);
      },
      onRest: () => {
        // Animation settled — re-enable orbit controls
        setIsAnimating(false);
        onRest?.();
      },
    }),
    [goals.position[0], goals.position[1], goals.position[2],
    goals.target[0], goals.target[1], goals.target[2]],
  );

  // When a new node is selected, kick off the animation
  useEffect(() => {
    if (activeNodeId !== null) {
      setIsAnimating(true);
    }
  }, [activeNodeId]);

  // ─── Per-frame: apply spring values to camera ────────────────
  const _lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!isAnimating) return;

    const pos = springs.camPos.get();
    const tgt = springs.camTarget.get();

    // Apply interpolated position
    camera.position.set(pos[0], pos[1], pos[2]);

    // Apply interpolated lookAt
    _lookAt.set(tgt[0], tgt[1], tgt[2]);
    camera.lookAt(_lookAt);

    // Keep OrbitControls target in sync so it doesn't snap
    // back when re-enabled
    if (controlsRef.current) {
      controlsRef.current.target.copy(_lookAt);
      controlsRef.current.update();
    }
  });

  // ─── Render ──────────────────────────────────────────────────
  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isAnimating}
      enableDamping
      dampingFactor={0.12}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2}
      minDistance={3}
      maxDistance={20}
    />
  );
}
