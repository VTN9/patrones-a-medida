import type { Point } from "../../types/digitizer";

export interface FitRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function fitRect(sourceWidth: number, sourceHeight: number, canvasWidth: number, canvasHeight: number): FitRect {
  const scale = Math.min(canvasWidth / sourceWidth, canvasHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  return { x: (canvasWidth - width) / 2, y: (canvasHeight - height) / 2, width, height };
}

export function eventPoint(event: {
  currentTarget: HTMLCanvasElement;
  clientX: number;
  clientY: number;
}): Point {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
