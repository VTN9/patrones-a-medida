export interface Point {
  x: number;
  y: number;
}

export interface NormalizedPoint {
  x: number;
  y: number;
}

export interface Calibration {
  p1: NormalizedPoint;
  p2: NormalizedPoint;
  realCm: number;
  pxPerCm: number;
}

export interface DigitizedPiece {
  id: string;
  name: string;
  pointsCm: Point[];
  widthCm: number;
  heightCm: number;
  areaCm2: number;
  perimeterCm: number;
  marginCm: number;
  createdAt: string;
}

export type DigitizerStage = "upload" | "perspective" | "scale" | "outline" | "result";

export interface OutlineOptions {
  threshold: number;
  autoThreshold: boolean;
  gap: number;
  simplify: number;
  keepLargest: boolean;
}

export interface OutlineResult {
  points: Point[];
  areaPx: number;
  touchesBorder: boolean;
  threshold: number;
}
