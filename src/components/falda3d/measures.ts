// ============================================================================
// Normalización de medidas de la falda para la vista 3D
// ============================================================================

import type { AppMeasurements } from "../../types";

export const CM_TO_SCENE = 0.01;

export interface FaldaMeasures {
  cinturaCm: number;
  caderaCm: number;
  largoTotalCm: number;
  holguraCm: number;
  margenCm: number;
  valid: boolean;
  error: string | null;
}

function num(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeFaldaMeasures(measures: AppMeasurements): FaldaMeasures {
  const cinturaCm = num(measures.cintura);
  const caderaCm = num(measures.cadera);
  const largoTotalCm = num(measures.largoTotal ?? measures.largo);
  const holguraCm = Math.max(0, num(measures.holgura));
  const margenCm = Math.max(0, num(measures.margenCostura));

  let error: string | null = null;
  if (cinturaCm <= 0 || caderaCm <= 0 || largoTotalCm <= 0) {
    error = "Introduce la cintura, la cadera y el largo total para ver la falda en 3D.";
  } else if (caderaCm <= cinturaCm) {
    error = "La cintura debe ser menor que la cadera para ver la falda en 3D.";
  }

  return { cinturaCm, caderaCm, largoTotalCm, holguraCm, margenCm, valid: error === null, error };
}
