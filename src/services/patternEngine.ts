// ============================================================================
// Motor de patronaje: contrato común para todas las calculadoras
// ============================================================================

import type { PatternResult, Piece, AppMeasurements } from "../types";

export interface PatternCalculator {
  id: string;
  calculate(medidas: AppMeasurements, margenCosturaCm: number): PatternResult;
}

const calculators = new Map<string, PatternCalculator>();

export function registerCalculator(calc: PatternCalculator): void {
  calculators.set(calc.id, calc);
}

export function getCalculator(id: string): PatternCalculator | undefined {
  return calculators.get(id);
}

export function listCalculators(): string[] {
  return Array.from(calculators.keys());
}

export function createPiece(id: string, name: string, x: number, y: number, width: number, height: number, margenPx: number): Piece {
  const cutPath = `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
  const seamPath = `M ${x + margenPx} ${y + margenPx} L ${x + width - margenPx} ${y + margenPx} L ${x + width - margenPx} ${y + height - margenPx} L ${x + margenPx} ${y + height - margenPx} Z`;
  return {
    id, name, cutPath, seamPath,
    labelPosition: { x: x + width / 2, y: y + height / 2 },
    grainline: { x1: x + width / 2, y1: y + margenPx, x2: x + width / 2, y2: y + height - margenPx },
    notches: [], x, y, width, height,
  };
}

export function computeViewBox(pieces: Piece[], paddingPx = 40): string {
  if (pieces.length === 0) return "0 0 400 400";
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pieces) {
    minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x + p.width); maxY = Math.max(maxY, p.y + p.height);
  }
  return `${minX - paddingPx} ${minY - paddingPx} ${maxX - minX + paddingPx * 2} ${maxY - minY + paddingPx * 2}`;
}

export function defaultInstructions(pasos: string[]): string[] {
  return pasos;
}