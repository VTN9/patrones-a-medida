// ============================================================================
// Validadores de medidas corporales y del neceser
// ============================================================================

import type { ValidationError } from "../types";

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