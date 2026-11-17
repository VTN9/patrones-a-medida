import type { DigitizedPiece, Point } from "../../types/digitizer";
import { bbox, polygonArea, polygonPerimeter } from "./geometry";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createDigitizedPiece(
  pointsPx: Point[],
  pxPerCm: number,
  name: string,
  marginCm: number
): DigitizedPiece {
  const box = bbox(pointsPx);
  const pointsCm = pointsPx.map((point) => ({
    x: (point.x - box.minX) / pxPerCm,
    y: (point.y - box.minY) / pxPerCm,
  }));
  return {
    id: createId(),
    name: name.trim() || "Pieza sin nombre",
    pointsCm,
    widthCm: box.width / pxPerCm,
    heightCm: box.height / pxPerCm,
    areaCm2: polygonArea(pointsCm),
    perimeterCm: polygonPerimeter(pointsCm),
    marginCm,
    createdAt: new Date().toISOString(),
  };
}
