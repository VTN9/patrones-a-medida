// ============================================================================
// Dimensiones de la falda en unidades de escena
// ============================================================================

import { useMemo } from "react";
import type { AppMeasurements } from "../../types";
import { CM_TO_SCENE, normalizeFaldaMeasures, type FaldaMeasures } from "./measures";

export interface FaldaDims extends FaldaMeasures {
  waistRadius: number;
  hipRadius: number;
  hemRadius: number;
  length: number;
  hipDrop: number;
  margin: number;
  maxSize: number;
}

export function useFaldaDimensions(measures: AppMeasurements): FaldaDims {
  return useMemo(() => {
    const normalized = normalizeFaldaMeasures(measures);
    const waistRadius = (normalized.cinturaCm * CM_TO_SCENE) / (2 * Math.PI);
    const hipRadius = Math.max(
      ((normalized.caderaCm + normalized.holguraCm) * CM_TO_SCENE) / (2 * Math.PI),
      waistRadius,
    );
    const length = normalized.largoTotalCm * CM_TO_SCENE;
    const hipDrop = Math.min(length * 0.35, 0.2);
    const hemRadius = hipRadius;
    const margin = Math.min(normalized.margenCm * CM_TO_SCENE, length * 0.45);

    return {
      ...normalized,
      waistRadius,
      hipRadius,
      hemRadius,
      length,
      hipDrop,
      margin,
      maxSize: Math.max(hemRadius * 2, length, 0.05),
    };
  }, [measures]);
}
