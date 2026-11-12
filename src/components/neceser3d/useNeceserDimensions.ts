// ============================================================================
// Dimensiones de la escena 3D derivadas de las medidas en centímetros
// ============================================================================

import { useMemo } from "react";
import type { AppMeasurements } from "../../types";
import { CM_TO_SCENE, normalizeNeceserMeasures, type NeceserMeasures } from "./measures";

export interface SceneDims extends NeceserMeasures {
  width: number;
  height: number;
  depth: number;
  zipperDepth: number;
  margin: number;
  handle: boolean;
  handleLength: number;
  maxSize: number;
}

export function useNeceserDimensions(measures: AppMeasurements): SceneDims {
  return useMemo(() => {
    const normalized = normalizeNeceserMeasures(measures);
    const width = normalized.largoCm * CM_TO_SCENE;
    const height = normalized.altoCm * CM_TO_SCENE;
    const depth = normalized.fondoCm * CM_TO_SCENE;
    const zipperDepth = Math.max(normalized.anchoCremalleraCm * CM_TO_SCENE, 0);
    const margin = Math.min(normalized.margenCm * CM_TO_SCENE, width * 0.45, height * 0.45);
    const handleLength = normalized.largoAsaCm * CM_TO_SCENE;

    return {
      ...normalized,
      width,
      height,
      depth,
      zipperDepth,
      margin,
      handle: normalized.tieneAsa && normalized.largoAsaCm > 0,
      handleLength,
      maxSize: Math.max(width, height, depth, 0.05),
    };
  }, [measures]);
}
