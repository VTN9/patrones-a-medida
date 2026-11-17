import type { Point } from "../../types/digitizer";

export function signedArea(points: Point[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    sum += current.x * next.y - next.x * current.y;
  }
  return sum / 2;
}

export function polygonArea(points: Point[]): number {
  return Math.abs(signedArea(points));
}

export function polygonPerimeter(points: Point[]): number {
  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    perimeter += Math.hypot(next.x - current.x, next.y - current.y);
  }
  return perimeter;
}

export function bbox(points: Point[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (points.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

export function offsetPolygon(points: Point[], distanceCm: number): Point[] {
  if (points.length < 3 || distanceCm === 0) return points;
  const area = signedArea(points);
  if (Math.abs(area) < 1e-9) return points;
  const sign = area > 0 ? 1 : -1;
  const normals = points.map((point, index) => {
    const next = points[(index + 1) % points.length];
    const dx = next.x - point.x;
    const dy = next.y - point.y;
    const length = Math.hypot(dx, dy) || 1;
    return { x: (sign * dy) / length, y: (sign * -dx) / length };
  });
  return points.map((point, index) => {
    const previousIndex = (index - 1 + points.length) % points.length;
    const nextIndex = (index + 1) % points.length;
    const previousNormal = normals[previousIndex];
    const currentNormal = normals[index];
    const previousEdge = {
      x: point.x - points[previousIndex].x,
      y: point.y - points[previousIndex].y,
    };
    const nextEdge = {
      x: points[nextIndex].x - point.x,
      y: points[nextIndex].y - point.y,
    };
    const previousLength = Math.hypot(previousEdge.x, previousEdge.y) || 1;
    const nextLength = Math.hypot(nextEdge.x, nextEdge.y) || 1;
    const u1 = { x: previousEdge.x / previousLength, y: previousEdge.y / previousLength };
    const u2 = { x: nextEdge.x / nextLength, y: nextEdge.y / nextLength };
    const a = {
      x: point.x + previousNormal.x * distanceCm,
      y: point.y + previousNormal.y * distanceCm,
    };
    const b = {
      x: point.x + currentNormal.x * distanceCm,
      y: point.y + currentNormal.y * distanceCm,
    };
    const denominator = u1.x * u2.y - u1.y * u2.x;
    if (Math.abs(denominator) < 1e-6) {
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
    const t = ((b.x - a.x) * u2.y - (b.y - a.y) * u2.x) / denominator;
    const intersection = { x: a.x + u1.x * t, y: a.y + u1.y * t };
    const spike = Math.hypot(intersection.x - point.x, intersection.y - point.y);
    if (spike > Math.abs(distanceCm) * 4) {
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
    return intersection;
  });
}

export function closestPointOnSegment(point: Point, start: Point, end: Point): { point: Point; distance: number } {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) {
    return { point: start, distance: Math.hypot(point.x - start.x, point.y - start.y) };
  }
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq));
  const projected = { x: start.x + dx * t, y: start.y + dy * t };
  return { point: projected, distance: Math.hypot(point.x - projected.x, point.y - projected.y) };
}

export function pointsToSvgPath(points: Point[]): string {
  if (points.length === 0) return "";
  const parts = points.map(
    (point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(3)} ${point.y.toFixed(3)}`
  );
  return `${parts.join(" ")} Z`;
}
