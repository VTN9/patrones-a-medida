// ============================================================================
// Modelo 3D simplificado del neceser rectangular
// ============================================================================

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { SceneDims } from "./useNeceserDimensions";

interface NeceserModelProps {
  dims: SceneDims;
}

export default function NeceserModel({ dims }: NeceserModelProps) {
  const { width, height, depth, zipperDepth, margin, handle, handleLength } = dims;

  const thickness = Math.max(0.0018, Math.min(0.0035, Math.min(width, height, depth) * 0.035));
  const topY = height + thickness;
  const zipperSize = Math.max(zipperDepth, thickness);
  const halfW = width / 2;
  const halfD = depth / 2;

  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({ color: "#e8dfd1", roughness: 0.92, metalness: 0 }),
      side: new THREE.MeshStandardMaterial({ color: "#ddd2c1", roughness: 0.95, metalness: 0 }),
      accent: new THREE.MeshStandardMaterial({ color: "#c0714f", roughness: 0.8, metalness: 0.05 }),
      metal: new THREE.MeshStandardMaterial({ color: "#8c8272", roughness: 0.45, metalness: 0.55 }),
      seam: new THREE.MeshBasicMaterial({ color: "#8fa27a" }),
    }),
    [],
  );

  const handleGeometry = useMemo(() => {
    if (!handle || handleLength <= 0) return null;
    const span = Math.min(Math.max(handleLength * 0.5, width * 0.25), width * 0.7);
    const rise = Math.min(Math.max(handleLength * 0.22, height * 0.18), height * 0.8);
    const baseY = topY + 0.002;
    const half = span / 2;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-half, baseY, 0),
      new THREE.Vector3(-half * 0.55, baseY + rise, 0),
      new THREE.Vector3(half * 0.55, baseY + rise, 0),
      new THREE.Vector3(half, baseY, 0),
    ]);
    const radius = Math.max(0.0018, Math.min(0.0035, handleLength * 0.02));
    return new THREE.TubeGeometry(curve, 32, radius, 8, false);
  }, [handle, handleLength, width, height, topY]);

  const seamFrame = useMemo(() => {
    if (margin <= 0) return null;
    const x = halfW - margin;
    const y0 = margin;
    const y1 = height - margin;
    if (x <= 0 || y1 <= y0) return null;
    return { x, y0, y1, width: x * 2, height: y1 - y0, centerY: (y0 + y1) / 2 };
  }, [margin, halfW, height]);

  useEffect(() => () => {
    Object.values(materials).forEach((material) => material.dispose());
  }, [materials]);

  useEffect(() => () => {
    handleGeometry?.dispose();
  }, [handleGeometry]);

  return (
    <group>
      <mesh material={materials.side} position={[0, thickness / 2, 0]}>
        <boxGeometry args={[width, thickness, depth]} />
      </mesh>

      <mesh material={materials.body} position={[0, height / 2, halfD - thickness / 2]}>
        <boxGeometry args={[width, height, thickness]} />
      </mesh>
      <mesh material={materials.side} position={[0, height / 2, -halfD + thickness / 2]}>
        <boxGeometry args={[width, height, thickness]} />
      </mesh>

      <mesh material={materials.body} position={[-halfW + thickness / 2, height / 2, 0]}>
        <boxGeometry args={[thickness, height, depth - thickness * 2]} />
      </mesh>
      <mesh material={materials.body} position={[halfW - thickness / 2, height / 2, 0]}>
        <boxGeometry args={[thickness, height, depth - thickness * 2]} />
      </mesh>

      <mesh material={materials.body} position={[-width / 4, topY - thickness / 2, 0]}>
        <boxGeometry args={[width / 2 - thickness, thickness, depth]} />
      </mesh>
      <mesh material={materials.body} position={[width / 4, topY - thickness / 2, 0]}>
        <boxGeometry args={[width / 2 - thickness, thickness, depth]} />
      </mesh>

      <mesh material={materials.accent} position={[0, topY + thickness * 0.35, 0]}>
        <boxGeometry args={[width * 0.99, thickness * 0.7, zipperSize]} />
      </mesh>
      <mesh material={materials.metal} position={[width * 0.3, topY + thickness * 0.45, 0]}>
        <boxGeometry args={[0.012, thickness * 1.6, zipperSize * 1.5]} />
      </mesh>
      <mesh material={materials.accent} position={[width * 0.3, topY + thickness * 0.45 - 0.009, 0]}>
        <boxGeometry args={[0.004, 0.016, 0.002]} />
      </mesh>

      {handleGeometry && <mesh geometry={handleGeometry} material={materials.accent} />}

      {seamFrame && (
        <group position={[0, 0, halfD + 0.0008]}>
          <mesh material={materials.seam} position={[0, seamFrame.y0, 0]}>
            <boxGeometry args={[seamFrame.width, 0.002, 0.0006]} />
          </mesh>
          <mesh material={materials.seam} position={[0, seamFrame.y1, 0]}>
            <boxGeometry args={[seamFrame.width, 0.002, 0.0006]} />
          </mesh>
          <mesh material={materials.seam} position={[-seamFrame.x, seamFrame.centerY, 0]}>
            <boxGeometry args={[0.002, seamFrame.height, 0.0006]} />
          </mesh>
          <mesh material={materials.seam} position={[seamFrame.x, seamFrame.centerY, 0]}>
            <boxGeometry args={[0.002, seamFrame.height, 0.0006]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
