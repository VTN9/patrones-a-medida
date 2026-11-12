// ============================================================================
// Tipos compartidos de la aplicación "Patrones a Medida"
// ============================================================================

export type PatternCategory = "ropa" | "neceser";

export interface MeasureFieldDef {
  id: string;
  label: string;
  unit: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  category?: PatternCategory;
  patternIds?: string[];
}

export interface PatternMeta {
  id: string;
  category: PatternCategory;
  name: string;
  description: string;
  icon: string;
  measures: string[];
  calculator: string;
  sewingGuide: string[];
  materials: string[];
  fabricEstimate: (medidas: Record<string, number>) => string;
}

export interface Piece {
  id: string;
  name: string;
  cutPath: string;
  seamPath?: string;
  labelPosition: { x: number; y: number };
  grainline: { x1: number; y1: number; x2: number; y2: number };
  notches: { x: number; y: number; angle: number }[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Label {
  text: string;
  x: number;
  y: number;
}

export interface Notch {
  x: number;
  y: number;
  angle: number;
}

export interface Grainline {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PatternResult {
  patternId: string;
  patternName: string;
  category: PatternCategory;
  pieces: Piece[];
  labels: Label[];
  notches: Notch[];
  grainlines: Grainline[];
  seamAllowanceCm: number;
  instructions: string[];
  materials: string[];
  fabricQty: string;
  zipper?: { largo: number; tipo: string };
  measuresUsed: Record<string, number>;
  viewBox: string;
  canvasWidth: number;
  canvasHeight: number;
}

export interface SavedProfile {
  id: string;
  name: string;
  category: PatternCategory;
  measures: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface AppMeasurements {
  [key: string]: number;
}

export interface ValidationError {
  field: string;
  message: string;
}