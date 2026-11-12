// ============================================================================
// Escena de la falda sobre el visor 3D reutilizable
// ============================================================================

import { forwardRef } from "react";
import Viewer3D, { type Viewer3DHandle } from "../3d/Viewer3D";
import FaldaModel from "./FaldaModel";
import type { FaldaDims } from "./useFaldaDimensions";

export type Canvas3DHandle = Viewer3DHandle;

interface Canvas3DProps {
  dims: FaldaDims;
  showGrid: boolean;
}

const CAMERA_RATIO: [number, number, number] = [1.35, 1.15, 1.7];

const Canvas3D = forwardRef<Canvas3DHandle, Canvas3DProps>(function Canvas3D({ dims, showGrid }, ref) {
  return (
    <Viewer3D
      ref={ref}
      size={dims.maxSize}
      targetY={dims.length * 0.5}
      gridSize={Math.max(dims.hemRadius * 2, dims.length, 0.2) * 4}
      showGrid={showGrid}
      cameraRatio={CAMERA_RATIO}
    >
      <FaldaModel dims={dims} />
    </Viewer3D>
  );
});

export default Canvas3D;
