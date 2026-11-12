// ============================================================================
// Último patrón generado (guardado en localStorage)
// ============================================================================

import type { PatternResult } from "../../types";

const STORAGE_KEY = "patrones_medida_last_pattern";

export function getLastPattern(): PatternResult | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveLastPattern(pattern: PatternResult): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pattern));}

export function clearLastPattern(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}