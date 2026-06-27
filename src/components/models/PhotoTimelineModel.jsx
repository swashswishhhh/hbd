import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import up1Img from '../../images/up1.jpg';
import up2Img from '../../images/up2.jpg';
import up3Img from '../../images/up3.jpg';

export default function PhotoTimelineModel({ hovered = false, isActive = false, activeTimelineSlide = 0, isUnlocked = false }) {
  const frameMaterial = <meshStandardMaterial color="#4a2f13" roughness={0.7} />;
  const canvasMaterial = <meshStandardMaterial color="#faf9f6" roughness={0.9} />;

  const up1Tex = useTexture(up1Img);
  const up2Tex = useTexture(up2Img);
  const up3Tex = useTexture(up3Img);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Top Frame (Childhood: Baby/Toddler theme) ── */}
      <group position={[0, 0.65, 0]}>
        {/* Wood border frame */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.5, 0.04]} />
          {frameMaterial}
        </mesh>
        {/* Photo Canvas */}
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.7, 0.4]} />
          {isUnlocked ? (
            <meshStandardMaterial map={up1Tex} roughness={0.4} />
          ) : (
            canvasMaterial
          )}
        </mesh>
        {/* Inner abstract drawing representing childhood (sunny playground colors) */}
        {!isUnlocked && (
          <group position={[0, 0, 0.024]}>
            {/* Yellow sun / balloon */}
            <mesh position={[-0.15, 0.05, 0]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color="#f1c40f" />
            </mesh>
            {/* Soft grass green stripe */}
            <mesh position={[0, -0.1, 0]}>
              <boxGeometry args={[0.6, 0.04, 0.002]} />
              <meshBasicMaterial color="#2ecc71" />
            </mesh>
          </group>
        )}
        {/* Blush pink washi tape holding it */}
        <mesh position={[0, 0.28, 0.02]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.15, 0.05, 0.005]} />
          <meshStandardMaterial color="#dca9a7" opacity={0.8} transparent />
        </mesh>
      </group>

      {/* ── Middle Frame (Teenage Years: Growth / High School theme) ── */}
      <group position={[0, 0.0, 0]}>
        {/* Wood border frame */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.5, 0.04]} />
          {frameMaterial}
        </mesh>
        {/* Photo Canvas */}
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.7, 0.4]} />
          {isUnlocked ? (
            <meshStandardMaterial map={up2Tex} roughness={0.4} />
          ) : (
            canvasMaterial
          )}
        </mesh>
        {/* Inner abstract drawing representing teenage years (graduation/sky theme) */}
        {!isUnlocked && (
          <group position={[0, 0, 0.024]}>
            {/* Blue sky wash */}
            <mesh position={[0.1, 0.05, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.002, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshBasicMaterial color="#3498db" />
            </mesh>
            {/* Dark academic cap / book line */}
            <mesh position={[-0.1, -0.06, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.15, 0.08, 0.002]} />
              <meshBasicMaterial color="#34495e" />
            </mesh>
          </group>
        )}
        {/* Sage green washi tape holding it */}
        <mesh position={[-0.2, 0.26, 0.02]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.15, 0.05, 0.005]} />
          <meshStandardMaterial color="#81b29a" opacity={0.8} transparent />
        </mesh>
      </group>

      {/* ── Bottom Frame (Present: Graduation / Café cozy theme) ── */}
      <group position={[0, -0.65, 0]}>
        {/* Wood border frame */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.5, 0.04]} />
          {frameMaterial}
        </mesh>
        {/* Photo Canvas */}
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.7, 0.4]} />
          {isUnlocked ? (
            <meshStandardMaterial map={up3Tex} roughness={0.4} />
          ) : (
            canvasMaterial
          )}
        </mesh>
        {/* Inner abstract drawing representing present (warm cafe / cherry blossom theme) */}
        {!isUnlocked && (
          <group position={[0, 0, 0.024]}>
            {/* Peach glow sun */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.002, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshBasicMaterial color="#ffd4a3" />
            </mesh>
            {/* Sweet cherry blossom pink spot */}
            <mesh position={[-0.15, -0.06, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#e8a7a1" />
            </mesh>
          </group>
        )}
        {/* Light blue washi tape holding it */}
        <mesh position={[0.2, 0.27, 0.02]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.15, 0.05, 0.005]} />
          <meshStandardMaterial color="#b0c4de" opacity={0.8} transparent />
        </mesh>
      </group>

      {/* ── Highlight Halo around active frame ── */}
      {isActive && (
        <group position={[0, activeTimelineSlide === 1 ? 0.65 : activeTimelineSlide === 2 ? 0.0 : -0.65, 0.01]}>
          <mesh>
            <boxGeometry args={[0.86, 0.56, 0.01]} />
            <meshBasicMaterial color="#ffd4a3" transparent opacity={0.4} wireframe />
          </mesh>
        </group>
      )}
    </group>
  );
}
