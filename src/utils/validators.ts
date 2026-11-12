// ============================================================================
// Validadores de medidas corporales y del neceser
// ============================================================================

import type { AppMeasurements, PatternMeta, ValidationError } from "../types";
import { MEASURE_FIELDS } from "../data/patterns";

export function validatePositive(value: unknown, fieldLabel: string): ValidationError | null {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) {
    return { field: fieldLabel, message: `El campo "${fieldLabel}" debe ser un número mayor que 0.` };
  }
  return null;
}

export function validateCinturaCadera(cintura: number, cadera: number): ValidationError | null {
  if (cintura >= cadera) {
    return { field: "cintura", message: "La cintura debe ser menor que la cadera." };
  }
  return null;
}

export function validateLargoMinimo(value: number, fieldLabel: string, minimo = 10): ValidationError | null {
  if (value < minimo) {
    return { field: fieldLabel, message: `El ${fieldLabel} debe ser mayor que ${minimo} cm.` };
  }
  return null;
}

export function validateMedidas(_medidas: Record<string, number>, reglas: Array<() => ValidationError | null>): ValidationError[] {
  const errores: ValidationError[] = [];
  for (const regla of reglas) {
    const error = regla();
    if (error) errores.push(error);
  }
  return errores;
}

export function validatePatternMeasures(pattern: PatternMeta, measures: AppMeasurements): ValidationError[] {
  const errores: ValidationError[] = [];

  for (const id of pattern.measures) {
    if (id === "largoAsa" && Number(measures["tieneAsa"] || 0) !== 1) continue;
    const field = MEASURE_FIELDS[id];
    if (!field) continue;
    const value = Number(measures[id] ?? 0);
    const min = field.min ?? 1;
    if (!Number.isFinite(value)) {
      errores.push({ field: id, message: `El campo "${field.label}" debe ser un número válido.` });
    } else if (value < min) {
      errores.push({ field: id, message: min > 0 ? `El campo "${field.label}" es obligatorio y debe ser mayor que 0.` : `El campo "${field.label}" no puede ser negativo.` });
    }
  }

  const cintura = Number(measures["cintura"] || 0);
  const cadera = Number(measures["cadera"] || 0);
  if (cintura > 0 && cadera > 0 && cintura >= cadera) {
    errores.push({ field: "cintura", message: "La cintura debe ser menor que la cadera." });
  }

  const largo = Number(measures["largoTotal"] || 0);
  if (largo > 0 && largo < 10) {
    errores.push({ field: "largoTotal", message: "El largo debe ser mayor que 10 cm." });
  }

  return errores;
}