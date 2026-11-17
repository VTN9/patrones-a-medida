import type { NormalizedPoint, Point } from "../../types/digitizer";

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo cargar la imagen"));
    };
    image.src = url;
  });
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function getWarpDimensions(
  image: HTMLImageElement,
  corners: NormalizedPoint[],
  maxSize = 1400
): { width: number; height: number } {
  const points = corners.map((corner) => ({
    x: corner.x * image.naturalWidth,
    y: corner.y * image.naturalHeight,
  }));
  const rawWidth = Math.max(distance(points[0], points[1]), distance(points[3], points[2]), 1);
  const rawHeight = Math.max(distance(points[0], points[3]), distance(points[1], points[2]), 1);
  const scale = Math.min(1, maxSize / Math.max(rawWidth, rawHeight));
  return {
    width: Math.max(2, Math.round(rawWidth * scale)),
    height: Math.max(2, Math.round(rawHeight * scale)),
  };
}

function solveLinearSystem(matrix: number[][], rhs: number[]): number[] {
  const n = rhs.length;
  const rows = matrix.map((row, index) => [...row, rhs[index]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(rows[row][col]) > Math.abs(rows[pivot][col])) pivot = row;
    }
    if (Math.abs(rows[pivot][col]) < 1e-10) return Array.from({ length: n }, () => 0);
    [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
    const divisor = rows[col][col];
    for (let j = col; j <= n; j++) rows[col][j] /= divisor;
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = rows[row][col];
      if (factor === 0) continue;
      for (let j = col; j <= n; j++) rows[row][j] -= factor * rows[col][j];
    }
  }
  return rows.map((row) => row[n]);
}

export function computeHomography(destination: Point[], source: Point[]): number[] {
  const matrix: number[][] = [];
  const rhs: number[] = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = destination[i];
    const { x: u, y: v } = source[i];
    matrix.push([x, y, 1, 0, 0, 0, -x * u, -y * u]);
    rhs.push(u);
    matrix.push([0, 0, 0, x, y, 1, -x * v, -y * v]);
    rhs.push(v);
  }
  return solveLinearSystem(matrix, rhs);
}

export function warpPerspective(
  image: HTMLImageElement,
  corners: NormalizedPoint[],
  maxSize = 1400
): HTMLCanvasElement {
  const { width, height } = getWarpDimensions(image, corners, maxSize);
  const sourcePoints = corners.map((corner) => ({
    x: corner.x * image.naturalWidth,
    y: corner.y * image.naturalHeight,
  }));
  const destinationPoints: Point[] = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];
  const homography = computeHomography(destinationPoints, sourcePoints);

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = image.naturalWidth;
  sourceCanvas.height = image.naturalHeight;
  const sourceContext = sourceCanvas.getContext("2d");
  if (!sourceContext) throw new Error("No se pudo preparar la imagen");
  sourceContext.drawImage(image, 0, 0);
  const sourceData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);

  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const context = output.getContext("2d");
  if (!context) throw new Error("No se pudo crear el lienzo");
  const outputData = context.createImageData(width, height);
  const sourcePixels = sourceData.data;
  const outputPixels = outputData.data;
  const sourceWidth = sourceCanvas.width;
  const sourceHeight = sourceCanvas.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const denominator = homography[6] * x + homography[7] * y + 1;
      const u = (homography[0] * x + homography[1] * y + homography[2]) / denominator;
      const v = (homography[3] * x + homography[4] * y + homography[5]) / denominator;
      const index = (y * width + x) * 4;
      if (u < 0 || v < 0 || u >= sourceWidth - 1 || v >= sourceHeight - 1) {
        outputPixels[index] = 255;
        outputPixels[index + 1] = 255;
        outputPixels[index + 2] = 255;
        outputPixels[index + 3] = 255;
        continue;
      }
      const x0 = Math.floor(u);
      const y0 = Math.floor(v);
      const fx = u - x0;
      const fy = v - y0;
      const i00 = (y0 * sourceWidth + x0) * 4;
      const i10 = (y0 * sourceWidth + x0 + 1) * 4;
      const i01 = ((y0 + 1) * sourceWidth + x0) * 4;
      const i11 = ((y0 + 1) * sourceWidth + x0 + 1) * 4;
      for (let channel = 0; channel < 4; channel++) {
        const top = sourcePixels[i00 + channel] * (1 - fx) + sourcePixels[i10 + channel] * fx;
        const bottom = sourcePixels[i01 + channel] * (1 - fx) + sourcePixels[i11 + channel] * fx;
        outputPixels[index + channel] = top * (1 - fy) + bottom * fy;
      }
    }
  }

  context.putImageData(outputData, 0, 0);
  return output;
}
