import type { Point } from "../../types/digitizer";

export function toGray(data: ImageData): Uint8Array {
  const gray = new Uint8Array(data.width * data.height);
  const pixels = data.data;
  for (let i = 0, j = 0; i < pixels.length; i += 4, j++) {
    gray[j] = Math.round(pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114);
  }
  return gray;
}

export function otsuThreshold(gray: Uint8Array): number {
  const histogram = Array.from({ length: 256 }, () => 0);
  for (const value of gray) histogram[value]++;
  const total = gray.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * histogram[i];
  let sumBackground = 0;
  let weightBackground = 0;
  let bestVariance = -1;
  let bestThreshold = 128;
  for (let threshold = 0; threshold < 256; threshold++) {
    weightBackground += histogram[threshold];
    if (weightBackground === 0) continue;
    const weightForeground = total - weightBackground;
    if (weightForeground === 0) break;
    sumBackground += threshold * histogram[threshold];
    const meanBackground = sumBackground / weightBackground;
    const meanForeground = (sum - sumBackground) / weightForeground;
    const variance = weightBackground * weightForeground * (meanBackground - meanForeground) ** 2;
    if (variance > bestVariance) {
      bestVariance = variance;
      bestThreshold = threshold;
    }
  }
  return bestThreshold;
}

function dilate(mask: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  if (radius <= 0) return mask;
  let source = mask;
  for (let pass = 0; pass < 2; pass++) {
    const output = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let found = 0;
        if (pass === 0) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            if (nx >= 0 && nx < width && source[y * width + nx]) {
              found = 1;
              break;
            }
          }
        } else {
          for (let dy = -radius; dy <= radius; dy++) {
            const ny = y + dy;
            if (ny >= 0 && ny < height && source[ny * width + x]) {
              found = 1;
              break;
            }
          }
        }
        output[y * width + x] = found;
      }
    }
    source = output;
  }
  return source;
}

export function buildBlocked(
  gray: Uint8Array,
  width: number,
  height: number,
  threshold: number,
  gap: number
): Uint8Array {
  const blocked = new Uint8Array(width * height);
  for (let i = 0; i < gray.length; i++) blocked[i] = gray[i] < threshold ? 1 : 0;
  return dilate(blocked, width, height, gap);
}

export function keepLargestComponent(mask: Uint8Array, width: number, height: number): Uint8Array {
  const labels = new Int32Array(width * height).fill(-1);
  const queue = new Int32Array(width * height);
  const sizes: number[] = [];
  const directions = [-1, 1, -width, width, -width - 1, -width + 1, width - 1, width + 1];
  let nextLabel = 0;
  for (let index = 0; index < mask.length; index++) {
    if (!mask[index] || labels[index] !== -1) continue;
    let head = 0;
    let tail = 0;
    let size = 0;
    queue[tail++] = index;
    labels[index] = nextLabel;
    while (head < tail) {
      const current = queue[head++];
      size++;
      const x = current % width;
      const y = Math.floor(current / width);
      for (const offset of directions) {
        const neighbor = current + offset;
        if (neighbor < 0 || neighbor >= mask.length) continue;
        const nx = neighbor % width;
        const ny = Math.floor(neighbor / width);
        if (Math.abs(nx - x) > 1 || Math.abs(ny - y) > 1) continue;
        if (mask[neighbor] && labels[neighbor] === -1) {
          labels[neighbor] = nextLabel;
          queue[tail++] = neighbor;
        }
      }
    }
    sizes[nextLabel] = size;
    nextLabel++;
  }
  if (nextLabel <= 1) return mask;
  let largest = 0;
  for (let i = 1; i < sizes.length; i++) if (sizes[i] > sizes[largest]) largest = i;
  const output = new Uint8Array(width * height);
  for (let i = 0; i < mask.length; i++) output[i] = labels[i] === largest ? 1 : 0;
  return output;
}

function findFreeSeed(blocked: Uint8Array, width: number, height: number, seed: Point): Point | null {
  const startX = Math.round(seed.x);
  const startY = Math.round(seed.y);
  const isFree = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < width && y < height && !blocked[y * width + x];
  if (isFree(startX, startY)) return { x: startX, y: startY };
  for (let radius = 1; radius <= 30; radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
        const x = startX + dx;
        const y = startY + dy;
        if (isFree(x, y)) return { x, y };
      }
    }
  }
  return null;
}

export function floodFill(
  blocked: Uint8Array,
  width: number,
  height: number,
  seed: Point
): { mask: Uint8Array; area: number; touchesBorder: boolean } {
  const mask = new Uint8Array(width * height);
  const freeSeed = findFreeSeed(blocked, width, height, seed);
  if (!freeSeed) return { mask, area: 0, touchesBorder: false };
  const stack = new Int32Array(width * height);
  let top = 0;
  let area = 0;
  let touchesBorder = false;
  const start = freeSeed.y * width + freeSeed.x;
  stack[top++] = start;
  mask[start] = 1;
  while (top > 0) {
    const current = stack[--top];
    area++;
    const x = current % width;
    const y = Math.floor(current / width);
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesBorder = true;
    if (x > 0) {
      const neighbor = current - 1;
      if (!blocked[neighbor] && !mask[neighbor]) {
        mask[neighbor] = 1;
        stack[top++] = neighbor;
      }
    }
    if (x < width - 1) {
      const neighbor = current + 1;
      if (!blocked[neighbor] && !mask[neighbor]) {
        mask[neighbor] = 1;
        stack[top++] = neighbor;
      }
    }
    if (y > 0) {
      const neighbor = current - width;
      if (!blocked[neighbor] && !mask[neighbor]) {
        mask[neighbor] = 1;
        stack[top++] = neighbor;
      }
    }
    if (y < height - 1) {
      const neighbor = current + width;
      if (!blocked[neighbor] && !mask[neighbor]) {
        mask[neighbor] = 1;
        stack[top++] = neighbor;
      }
    }
  }
  return { mask, area, touchesBorder };
}
