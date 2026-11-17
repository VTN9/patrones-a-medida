import type { OutlineOptions, OutlineResult, Point } from "../../types/digitizer";
import {
  buildBlocked,
  floodFill,
  keepLargestComponent,
  otsuThreshold,
  toGray,
} from "./imageMask";
import { polygonArea } from "./geometry";
import { simplifyClosedPolygon, traceBoundary } from "./trace";

export function extractOutline(image: ImageData, seed: Point, options: OutlineOptions): OutlineResult {
  const gray = toGray(image);
  const threshold = options.autoThreshold ? otsuThreshold(gray) : Math.round(options.threshold);
  let blocked = buildBlocked(gray, image.width, image.height, threshold, options.gap);
  if (options.keepLargest) {
    blocked = keepLargestComponent(blocked, image.width, image.height);
  }
  const fill = floodFill(blocked, image.width, image.height, seed);
  if (fill.area === 0) {
    return { points: [], areaPx: 0, touchesBorder: false, threshold };
  }
  const raw = traceBoundary(fill.mask, image.width, image.height);
  const points = options.simplify > 0 ? simplifyClosedPolygon(raw, options.simplify) : raw;
  return {
    points,
    areaPx: polygonArea(points),
    touchesBorder: fill.touchesBorder,
    threshold,
  };
}
