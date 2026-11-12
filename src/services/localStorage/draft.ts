// ============================================================================
// Borrador de medidas introducidas para el patrón en curso
// ============================================================================

import type { AppMeasurements } from "../../types";

const STORAGE_KEY = "patrones_medida_draft";

export interface PatternDraft {
  patternId: string;
  measures: AppMeasurements;
}

export function saveDraft(draft: PatternDraft): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function getDraft(): PatternDraft | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PatternDraft;
    if (!parsed || typeof parsed.patternId !== "string" || !parsed.measures) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
