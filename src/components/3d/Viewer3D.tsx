// ============================================================================
// Visor 3D reutilizable: cámara, luces, cuadrícula y controles
// ============================================================================

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import type { ComponentRef, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export interface Viewer3DHandle {
  resetView: () => void;
  capture: () => string | null;
}

interface Viewer3DProps {
  children: ReactNode;
  size: number;
  targetY: number;
  gridSize: number;
  showGrid: boolean;
  cameraRatio?: [number, number, number];
  maxPolarAngle?: number;
}

const DEFAULT_CAMERA_RATIO: [number, number, number] = [1.5, 1.25, 1.9];

const Viewer3D = forwardRef<Viewer3DHandle, Viewer3DProps>(function Viewer3D(
  { children, size, targetY, gridSize, showGrid, cameraRatio = DEFAULT_CAMERA_RATIO, maxPolarAngle = Math.PI / 2 },
  ref,
) {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);

  const safeSize = Math.max(size, 0.05);
  const safeGridSize = Math.max(gridSize, 0.2);

  const cameraPosition = useMemo<[number, number, number]>(
    () => [safeSize * cameraRatio[0], safeSize * cameraRatio[1], safeSize * cameraRatio[2]],
    [safeSize, cameraRatio],
  );
  const target = useMemo<[number, number, number]>(() => [0, targetY, 0], [targetY]);

  useImperativeHandle(
    ref,
    () => ({
      resetView: () => {
        const camera = cameraRef.current;
        if (!camera) return;
        camera.position.set(...cameraPosition);
        const controls = controlsRef.current;
        if (controls) {
          controls.target.set(...target);
          controls.update();
        }
      },
      capture: () => rendererRef.current?.domElement.toDataURL("image/png") ?? null,
    }),
    [cameraPosition, target],
  );

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      camera={{ fov: 40, near: 0.01, far: 100, position: cameraPosition }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
      onCreated={({ camera, gl }) => {
        cameraRef.current = camera as THREE.PerspectiveCamera;
        rendererRef.current = gl;
      }}
    >
      <color attach="background" args={["#faf6ef"]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 2]} intensity={1.5} />
      <directionalLight position={[-2, 1.5, -1.5]} intensity={0.55} />

      {children}

      {showGrid && (
        <Grid
          position={[0, -0.0005, 0]}
          args={[safeGridSize, safeGridSize]}
          cellSize={0.05}
          cellThickness={0.5}
          cellColor="#d8cebd"
          sectionSize={0.25}
          sectionThickness={1}
          sectionColor="#c4b7a3"
          fadeDistance={safeGridSize}
          fadeStrength={1}
          infiniteGrid={false}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={safeSize * 0.5}
        maxDistance={safeSize * 8}
        maxPolarAngle={maxPolarAngle}
        target={target}
      />
    </Canvas>
  );
});

export default Viewer3D;
