// ============================================================================
// Utilidades de unidades: centímetros <-> píxeles SVG
// ============================================================================

export const CM_TO_PX = 4;

export function cmToPx(cm: number): number {
  return cm * CM_TO_PX;
}

export function pxToCm(px: number): number {
  return px / CM_TO_PX;
}

export function formatCm(value: number): string {
  return `${value.toFixed(1)} cm`;
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}