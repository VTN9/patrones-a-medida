// ============================================================================
// Escena del neceser sobre el visor 3D reutilizable
// ============================================================================

import { forwardRef } from "react";
import Viewer3D, { type Viewer3DHandle } from "../3d/Viewer3D";
import NeceserModel from "./NeceserModel";
import type { SceneDims } from "./useNeceserDimensions";

export type Canvas3DHandle = Viewer3DHandle;

interface Canvas3DProps {
  dims: SceneDims;
  showGrid: boolean;
}

const Canvas3D = forwardRef<Canvas3DHandle, Canvas3DProps>(function Canvas3D({ dims, showGrid }, ref) {
  return (
    <Viewer3D
      ref={ref}
      size={dims.maxSize}
      targetY={dims.height * 0.45}
      gridSize={Math.max(dims.width, dims.depth, 0.2) * 4}
      showGrid={showGrid}
    >
      <NeceserModel dims={dims} />
    </Viewer3D>
  );
});

export default Canvas3D;
