/**
 * App.jsx — Root component.
 *
 * Renders a full-screen R3F <Canvas> with:
 *   • Scene – abstract 3D environment (lights, floor, shapes)
 *             includes CameraRig for controls + animated transitions
 *
 * The Canvas creates a WebGL renderer, a default PerspectiveCamera,
 * and an automatic render loop.
 */

import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';

export default function App() {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Fade in toast after 1s
    const showTimeout = setTimeout(() => setShowHint(true), 1000);
    // Fade out toast after 7s total
    const hideTimeout = setTimeout(() => setShowHint(false), 7000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{
          position: [5, 4, 8],   // slightly elevated, angled view
          fov: 50,               // narrower FOV = less distortion
        }}
        dpr={[1, 2]}
        shadows
      >
        {/* Scene owns all 3D content + CameraRig */}
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Floating Exploration Toast Hint */}
      <div className={`exploration-hint ${showHint ? 'exploration-hint--visible' : ''}`}>
        🔍 Hint: Rotate the camera and explore the cozy corners to find hidden memories...
      </div>
    </div>
  );
}
