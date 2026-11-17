import type { Point } from "../../types/digitizer";

const DX = [1, 1, 0, -1, -1, -1, 0, 1];
const DY = [0, 1, 1, 1, 0, -1, -1, -1];

function directionIndex(dx: number, dy: number): number {
  for (let i = 0; i < 8; i++) if (DX[i] === dx && DY[i] === dy) return i;
  return 0;
}

export function traceBoundary(mask: Uint8Array, width: number, height: number): Point[] {
  let startIndex = -1;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i]) {
      startIndex = i;
      break;
    }
  }
  if (startIndex < 0) return [];
  const startX = startIndex % width;
  const startY = Math.floor(startIndex / width);
  let bx = startX;
  let by = startY;
  let cx = startX - 1;
  let cy = startY;
  const initialCx = cx;
  const initialCy = cy;
  const boundary: Point[] = [];
  const maxSteps = width * height * 8;
  for (let step = 0; step < maxSteps; step++) {
    boundary.push({ x: bx, y: by });
    const startDirection = directionIndex(cx - bx, cy - by);
    let nextX = -1;
    let nextY = -1;
    let previousDirection = 0;
    for (let k = 0; k < 8; k++) {
      const direction = (startDirection + k) % 8;
      const tx = bx + DX[direction];
      const ty = by + DY[direction];
      if (tx < 0 || ty < 0 || tx >= width || ty >= height) continue;
      if (mask[ty * width + tx]) {
        nextX = tx;
        nextY = ty;
        previousDirection = (direction + 7) % 8;
        break;
      }
    }
    if (nextX < 0) break;
    if (
      boundary.length > 1 &&
      bx === startX &&
      by === startY &&
      nextX === boundary[1].x &&
      nextY === boundary[1].y
    ) {
      break;
    }
    cx = bx + DX[previousDirection];
    cy = by + DY[previousDirection];
    bx = nextX;
    by = nextY;
    if (bx === startX && by === startY && cx === initialCx && cy === initialCy) break;
  }
  if (boundary.length > 1) {
    const first = boundary[0];
    const last = boundary[boundary.length - 1];
    if (first.x === last.x && first.y === last.y) boundary.pop();
  }
  return boundary;
}

function perpendicularDistance(point: Point, start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return Math.hypot(point.x - start.x, point.y - start.y);
  return Math.abs(dy * point.x - dx * point.y + end.x * start.y - end.y * start.x) / length;
}

function simplifyOpen(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length > 0) {
    const [first, last] = stack.pop()!;
    let maxDistance = 0;
    let index = -1;
    for (let i = first + 1; i < last; i++) {
      const distance = perpendicularDistance(points[i], points[first], points[last]);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    if (index >= 0 && maxDistance > tolerance) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  const result: Point[] = [];
  for (let i = 0; i < points.length; i++) if (keep[i]) result.push(points[i]);
  return result;
}

export function simplifyClosedPolygon(points: Point[], tolerance: number): Point[] {
  if (points.length < 4 || tolerance <= 0) return points;
  const first = points[0];
  const last = points[points.length - 1];
  const closed = first.x === last.x && first.y === last.y ? points.slice(0, -1) : points;
  let farthest = 1;
  let maxDistance = 0;
  for (let i = 1; i < closed.length; i++) {
    const distance = (closed[i].x - closed[0].x) ** 2 + (closed[i].y - closed[0].y) ** 2;
    if (distance > maxDistance) {
      maxDistance = distance;
      farthest = i;
    }
  }
  const firstHalf = simplifyOpen(closed.slice(0, farthest + 1), tolerance);
  const secondHalf = simplifyOpen(closed.slice(farthest).concat([closed[0]]), tolerance);
  return firstHalf.slice(0, -1).concat(secondHalf.slice(0, -1));
}
