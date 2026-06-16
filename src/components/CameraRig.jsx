/**
 * CameraRig.jsx — Smooth camera animation controller.
 *
 * Responsibilities:
 *   1. Render & manage OrbitControls with smooth damping
 *   2. When a waypoint becomes active, smoothly transition the camera
 *      to a designated viewing angle and look-at target using damp/lerp
 *   3. When deselected, animate back to the default overview position
 *   4. Disable OrbitControls during transition to prevent input fighting
 *   5. Use frame-rate independent easing to ensure 100% smooth animation
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ─── Defaults ─────────────────────────────────────────────────────

/** Camera resting position when nothing is selected. */
const DEFAULT_POSITION = [5, 4, 8];

/** Where the camera looks when nothing is selected. */
const DEFAULT_TARGET = [0, 1, 0];

/** Fallback offset added to a node's position. */
const DEFAULT_CAMERA_OFFSET = [3, 2.5, 4];

// ─── Helpers ─────────────────────────────────────────────────────

/** Compute the camera destination for a given node. */
function getCameraGoals(node, isMobile) {
  let offset = node.cameraOffset ?? DEFAULT_CAMERA_OFFSET;
  const pos = node.position;

  // Adjust camera distance/offset dynamically on mobile to prevent clipping
  if (isMobile) {
    offset = [
      offset[0] * 1.35,
      offset[1] * 1.25,
      offset[2] * 1.35,
    ];
  }

  // Look higher on desktop to account for card, slightly lower on mobile bottom sheet
  const targetYOffset = isMobile ? 0.35 : 0.65;

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
  const { camera, size } = useThree();
  const controlsRef = useRef();

  const isMobile = size.width <= 768;

  // Track transition state
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Look-up map for nodes
  const nodeMap = useMemo(() => {
    const map = {};
    for (const n of nodes) map[n.id] = n;
    return map;
  }, [nodes]);

  const activeNode = activeNodeId ? nodeMap[activeNodeId] : null;

  // Compute camera position and lookAt target goals
  const goals = useMemo(() => {
    return activeNode
      ? getCameraGoals(activeNode, isMobile)
      : { position: DEFAULT_POSITION, target: DEFAULT_TARGET };
  }, [activeNode, isMobile]);

  // Target vectors for transition
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetTgt = useMemo(() => new THREE.Vector3(), []);

  // Update target vectors and trigger transition when goals change
  useEffect(() => {
    targetPos.set(...goals.position);
    targetTgt.set(...goals.target);
    setIsTransitioning(true);
  }, [goals, targetPos, targetTgt]);

  useFrame((state, delta) => {
    if (!isTransitioning) return;

    // Frame-rate independent lerp factor (Decay speed = 8)
    const easeFactor = 1 - Math.exp(-8 * delta);

    // Smoothly interpolate camera position
    camera.position.lerp(targetPos, easeFactor);

    // Smoothly interpolate OrbitControls target lookAt point
    if (controlsRef.current) {
      const currentTgt = controlsRef.current.target;
      currentTgt.lerp(targetTgt, easeFactor);
      controlsRef.current.update();
    }

    // Check if we are close enough to the goal to settle
    const distPos = camera.position.distanceTo(targetPos);
    const distTgt = controlsRef.current
      ? controlsRef.current.target.distanceTo(targetTgt)
      : 0;

    if (distPos < 0.015 && distTgt < 0.015) {
      // Snap to exact target coordinates to prevent floating precision jitter
      camera.position.copy(targetPos);
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetTgt);
        controlsRef.current.update();
      }
      setIsTransitioning(false);
      onRest?.();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isTransitioning}
      enableDamping
      dampingFactor={0.08} // Smooth damping for OrbitControls
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2}
      minDistance={3}
      maxDistance={20}
    />
  );
}
