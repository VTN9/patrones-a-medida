// ============================================================================
// Modelo 3D simplificado de la falda base
// ============================================================================

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { FaldaDims } from "./useFaldaDimensions";

interface FaldaModelProps {
  dims: FaldaDims;
}

export default function FaldaModel({ dims }: FaldaModelProps) {
  const { waistRadius, hemRadius, length, hipDrop, margin } = dims;

  const bandHeight = Math.min(0.02, length * 0.08, hipDrop * 0.4);
  const bodyTop = length - bandHeight;
  const hipY = Math.max(length - hipDrop, 0);

  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: "#e3d8c8",
        roughness: 0.95,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
      band: new THREE.MeshStandardMaterial({
        color: "#9caf88",
        roughness: 0.85,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
      seam: new THREE.MeshBasicMaterial({
        color: "#8fa27a",
        side: THREE.DoubleSide,
      }),
    }),
    [],
  );

  const skirtGeometry = useMemo(() => {
    return new THREE.LatheGeometry(
      [
        new THREE.Vector2(hemRadius, 0),
        new THREE.Vector2(hemRadius, hipY),
        new THREE.Vector2(waistRadius, bodyTop),
      ],
      64,
    );
  }, [hemRadius, waistRadius, hipY, bodyTop]);

  const seamGeometries = useMemo(() => {
    const makeSeam = (points: THREE.Vector3[]) => {
      const curve = new THREE.CatmullRomCurve3(points);
      return new THREE.TubeGeometry(curve, 24, 0.0015, 6, false);
    };
    return [
      makeSeam([
        new THREE.Vector3(hemRadius, 0.002, 0),
        new THREE.Vector3(hemRadius, hipY, 0),
        new THREE.Vector3(waistRadius, bodyTop, 0),
      ]),
      makeSeam([
        new THREE.Vector3(-hemRadius, 0.002, 0),
        new THREE.Vector3(-hemRadius, hipY, 0),
        new THREE.Vector3(-waistRadius, bodyTop, 0),
      ]),
      makeSeam([
        new THREE.Vector3(0, 0.002, -hemRadius),
        new THREE.Vector3(0, hipY, -hemRadius),
        new THREE.Vector3(0, bodyTop, -waistRadius),
      ]),
    ];
  }, [hemRadius, waistRadius, hipY, bodyTop]);

  const seamRadius = useMemo(() => {
    if (margin <= 0) return 0;
    if (margin <= hipY) return hemRadius;
    const t = (margin - hipY) / Math.max(bodyTop - hipY, 0.0001);
    return hemRadius + (waistRadius - hemRadius) * t;
  }, [margin, hipY, hemRadius, waistRadius, bodyTop]);

  useEffect(() => () => {
    Object.values(materials).forEach((material) => material.dispose());
  }, [materials]);

  useEffect(() => () => {
    skirtGeometry.dispose();
  }, [skirtGeometry]);

  useEffect(() => () => {
    seamGeometries.forEach((geometry) => geometry.dispose());
  }, [seamGeometries]);

  return (
    <group>
      <mesh geometry={skirtGeometry} material={materials.body} />

      {seamGeometries.map((geometry, index) => (
        <mesh key={index} geometry={geometry} material={materials.seam} />
      ))}

      <mesh material={materials.band} position={[0, length - bandHeight / 2, 0]}>
        <cylinderGeometry args={[waistRadius * 1.006, waistRadius * 1.006, bandHeight, 64, 1, true]} />
      </mesh>

      {margin > 0 && (
        <mesh material={materials.seam} position={[0, margin, 0]}>
          <cylinderGeometry args={[seamRadius * 1.003, seamRadius * 1.003, 0.0035, 64, 1, true]} />
        </mesh>
      )}
    </group>
  );
}
