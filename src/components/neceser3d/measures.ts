// ============================================================================
// Normalización de medidas del neceser para la vista 3D
// ============================================================================

import type { AppMeasurements } from "../../types";

export const CM_TO_SCENE = 0.01;

export interface NeceserMeasures {
  largoCm: number;
  altoCm: number;
  fondoCm: number;
  anchoCremalleraCm: number;
  tieneAsa: boolean;
  largoAsaCm: number;
  margenCm: number;
  valid: boolean;
}

function num(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeNeceserMeasures(measures: AppMeasurements): NeceserMeasures {
  const largoCm = num(measures.largoNeceser ?? measures.largo);
  const altoCm = num(measures.altoNeceser ?? measures.alto);
  const fondoCm = num(measures.fondoNeceser ?? measures.fondo);
  const anchoCremalleraCm = num(measures.anchoCremallera);
  const tieneAsa = num(measures.tieneAsa) === 1;
  const largoAsaCm = num(measures.largoAsa);
  const margenCm = Math.max(0, num(measures.margenCostura));

  return {
    largoCm,
    altoCm,
    fondoCm,
    anchoCremalleraCm,
    tieneAsa,
    largoAsaCm,
    margenCm,
    valid: largoCm > 0 && altoCm > 0 && fondoCm > 0,
  };
}
