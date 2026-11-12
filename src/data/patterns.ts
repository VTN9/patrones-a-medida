// ============================================================================
// Catálogo de patrones disponibles
// Cada patrón define sus metadatos, medidas necesarias y la calculadora usada.
// ============================================================================

import type { PatternMeta } from "../types";

export const MEASURE_FIELDS: Record<string, any> = {
  busto: { id: "busto", label: "Contorno de busto", unit: "cm", placeholder: "88", min: 1, step: 0.5 },
  cintura: { id: "cintura", label: "Contorno de cintura", unit: "cm", placeholder: "72", min: 1, step: 0.5 },
  cadera: { id: "cadera", label: "Contorno de cadera", unit: "cm", placeholder: "96", min: 1, step: 0.5 },
  largoTotal: { id: "largoTotal", label: "Largo total deseado", unit: "cm", placeholder: "60", min: 1, step: 0.5 },
  largoManga: { id: "largoManga", label: "Largo de manga", unit: "cm", placeholder: "60", min: 1, step: 0.5 },
  anchoHombros: { id: "anchoHombros", label: "Ancho de hombros", unit: "cm", placeholder: "40", min: 1, step: 0.5 },
  largoTiro: { id: "largoTiro", label: "Largo de tiro", unit: "cm", placeholder: "25", min: 1, step: 0.5 },
  holgura: { id: "holgura", label: "Holgura deseada", unit: "cm", placeholder: "4", min: 0, step: 0.5 },
  margenCostura: { id: "margenCostura", label: "Margen de costura", unit: "cm", placeholder: "1", min: 0, step: 0.5 },
  largoNeceser: { id: "largoNeceser", label: "Largo del neceser", unit: "cm", placeholder: "25", min: 1, step: 0.5 },
  altoNeceser: { id: "altoNeceser", label: "Alto del neceser", unit: "cm", placeholder: "18", min: 1, step: 0.5 },
  fondoNeceser: { id: "fondoNeceser", label: "Profundo / fondo", unit: "cm", placeholder: "10", min: 1, step: 0.5 },
  anchoCremallera: { id: "anchoCremallera", label: "Ancho de la cremallera", unit: "cm", placeholder: "2", min: 0, step: 0.5 },
  tieneAsa: { id: "tieneAsa", label: "¿Quiere asa?", unit: "", placeholder: "", min: 0, max: 1, step: 1 },
  largoAsa: { id: "largoAsa", label: "Longitud del asa", unit: "cm", placeholder: "30", min: 1, step: 0.5 },
};

export const PATTERNS: PatternMeta[] = [
  {
    id: "neceser-rectangular",
    category: "neceser",
    name: "Neceser rectangular con cremallera",
    description: "Neceser clásico rectangular con cierre de cremallera, panel frontal y trasero, laterales y fondo.",
    icon: "Bag",
    measures: ["largoNeceser", "altoNeceser", "fondoNeceser", "anchoCremallera", "margenCostura", "tieneAsa", "largoAsa"],
    calculator: "calcularNeceserRectangular",
    sewingGuide: ["Corta las piezas según el patrón generado.", "Une el panel frontal con los laterales.", "Coloca la cremallera entre los paneles superior.", "Cierra el fondo y los laterales.", "Remata los bordes con overlock o zigzag.", "Si elegiste asa, cosa los extremos en la parte superior."],
    materials: ["Tela exterior", "Tela forro (opcional)", "Cremallera", "Hilo", "Tijeras", "Alfileres"],
    fabricEstimate: (m) => {
      const largo = Number(m["largoNeceser"] || 25);
      const alto = Number(m["altoNeceser"] || 18);
      const fondo = Number(m["fondoNeceser"] || 10);
      const totalCm = largo * 2 + alto * 2 + fondo * 2 + 20;
      return `${(totalCm / 100).toFixed(2)} m`;
    },
  },
  {
    id: "falda-base",
    category: "ropa",
    name: "Falda base",
    description: "Patrón base de falda recta calculado a partir de cadera, cintura, largo y holgura.",
    icon: "Skirt",
    measures: ["cintura", "cadera", "largoTotal", "holgura", "margenCostura"],
    calculator: "calcularFaldaBase",
    sewingGuide: ["Corta la pieza delantera y la trasera del patrón.", "Une las piezas por los lados derecho sobre derecho.", "Cose la cremallera en la costura trasera o lateral.", "Realiza el dobladillo del bajo según el largo deseado.", "Remata la cintura con cinturilla o elástico según prefieras."],
    materials: ["Tela principal", "Cremallera (opcional)", "Hilo", "Tijeras", "Alfileres"],
    fabricEstimate: (m) => {
      const largo = Number(m["largoTotal"] || 60);
      const cadera = Number(m["cadera"] || 96);
      const anchoPieza = (cadera / 4 + Number(m["holgura"] || 4)) / 2;
      const totalCm = largo * 2 + anchoPieza * 2 + 30;
      return `${(totalCm / 100).toFixed(2)} m`;
    },
  },
];

export const PATTERNS_BY_CATEGORY: Record<string, PatternMeta[]> = {
  ropa: PATTERNS.filter((p) => p.category === "ropa"),
  neceser: PATTERNS.filter((p) => p.category === "neceser"),
};

export function getPatternById(id: string): PatternMeta | undefined {
  return PATTERNS.find((p) => p.id === id);
}