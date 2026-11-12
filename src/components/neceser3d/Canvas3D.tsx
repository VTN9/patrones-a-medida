// ============================================================================
// Escena, cámara, luces y controles de la vista 3D
// ============================================================================

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import type { ComponentRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import NeceserModel from "./NeceserModel";
import type { SceneDims } from "./useNeceserDimensions";

export interface Canvas3DHandle {
  resetView: () => void;
  capture: () => string | null;
}

interface Canvas3DProps {
  dims: SceneDims;
  showGrid: boolean;
}

const Canvas3D = forwardRef<Canvas3DHandle, Canvas3DProps>(function Canvas3D({ dims, showGrid }, ref) {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);

  const cameraPosition = useMemo<[number, number, number]>(() => {
    const size = dims.maxSize;
    return [size * 1.5, size * 1.25, size * 1.9];
  }, [dims.maxSize]);

  const target = useMemo<[number, number, number]>(() => [0, dims.height * 0.45, 0], [dims.height]);
  const gridSize = useMemo(() => Math.max(dims.width, dims.depth, 0.2) * 4, [dims.width, dims.depth]);

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

      <NeceserModel dims={dims} />

      {showGrid && (
        <Grid
          position={[0, -0.0005, 0]}
          args={[gridSize, gridSize]}
          cellSize={0.05}
          cellThickness={0.5}
          cellColor="#d8cebd"
          sectionSize={0.25}
          sectionThickness={1}
          sectionColor="#c4b7a3"
          fadeDistance={gridSize}
          fadeStrength={1}
          infiniteGrid={false}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={dims.maxSize * 0.5}
        maxDistance={dims.maxSize * 8}
        maxPolarAngle={Math.PI / 2}
        target={target}
      />
    </Canvas>
  );
});

export default Canvas3D;
