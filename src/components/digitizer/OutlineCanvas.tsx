import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { Point } from "../../types/digitizer";
import { closestPointOnSegment } from "../../services/digitizer/geometry";
import { eventPoint, fitRect } from "./canvasUtils";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface OutlineCanvasProps {
  image: HTMLCanvasElement;
  outline: Point[];
  seed: Point | null;
  selectedIndex: number | null;
  onSeedChange: (point: Point) => void;
  onOutlineChange: (points: Point[]) => void;
  onSelect: (index: number | null) => void;
  onRemovePoint: (index: number) => void;
}

export function OutlineCanvas({
  image,
  outline,
  seed,
  selectedIndex,
  onSeedChange,
  onOutlineChange,
  onSelect,
  onRemovePoint,
}: OutlineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fit = useMemo(() => fitRect(image.width, image.height, CANVAS_WIDTH, CANVAS_HEIGHT), [image]);

  const toDisplay = (point: Point) => ({
    x: fit.x + (point.x / image.width) * fit.width,
    y: fit.y + (point.y / image.height) * fit.height,
  });

  const toImage = (point: Point): Point => ({
    x: Math.max(0, Math.min(image.width - 1, ((point.x - fit.x) / fit.width) * image.width)),
    y: Math.max(0, Math.min(image.height - 1, ((point.y - fit.y) / fit.height) * image.height)),
  });

  const getDisplayScale = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 1;
    const rect = canvas.getBoundingClientRect();
    return rect.width > 0 ? canvas.width / rect.width : 1;
  };

  const movePoint = (index: number, clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const display = {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
    const next = toImage(display);
    onOutlineChange(outline.map((point, pointIndex) => (pointIndex === index ? next : point)));
  };

  useEffect(() => {
    const target = canvasRef.current;
    if (!target) return;
    const context = target.getContext("2d");
    if (!context) return;
    context.fillStyle = "#f8f5ef";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.drawImage(image, fit.x, fit.y, fit.width, fit.height);
    if (outline.length > 1) {
      context.beginPath();
      outline.forEach((point, index) => {
        const { x, y } = toDisplay(point);
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.fillStyle = "rgba(192, 113, 79, 0.18)";
      context.fill();
      context.strokeStyle = "#c0714f";
      context.lineWidth = 3;
      context.stroke();
    }
    if (seed) {
      const { x, y } = toDisplay(seed);
      context.beginPath();
      context.arc(x, y, 7, 0, Math.PI * 2);
      context.fillStyle = "#6f8759";
      context.fill();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;
      context.stroke();
    }
  }, [image, fit, outline, seed]);

  const handleCanvasPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const point = eventPoint(event);
    if (point.x < fit.x || point.y < fit.y || point.x > fit.x + fit.width || point.y > fit.y + fit.height) {
      return;
    }
    const scale = getDisplayScale();
    const nearHandle = outline.some((handle) => {
      const display = toDisplay(handle);
      return Math.hypot(point.x - display.x, point.y - display.y) < 18 * scale;
    });
    if (!nearHandle && outline.length >= 3) {
      let bestEdge = -1;
      let bestDistance = 16 * scale;
      let bestPoint: Point | null = null;
      for (let index = 0; index < outline.length; index++) {
        const start = toDisplay(outline[index]);
        const end = toDisplay(outline[(index + 1) % outline.length]);
        const closest = closestPointOnSegment(point, start, end);
        if (closest.distance < bestDistance) {
          bestDistance = closest.distance;
          bestEdge = index;
          bestPoint = closest.point;
        }
      }
      if (bestEdge >= 0 && bestPoint) {
        const inserted = toImage(bestPoint);
        const next = [...outline.slice(0, bestEdge + 1), inserted, ...outline.slice(bestEdge + 1)];
        onOutlineChange(next);
        onSelect(bestEdge + 1);
        setDragIndex(bestEdge + 1);
        event.currentTarget.setPointerCapture(event.pointerId);
        return;
      }
    }
    onSeedChange(toImage(point));
    onSelect(null);
  };

  const handleCanvasPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (dragIndex === null) return;
    movePoint(dragIndex, event.clientX, event.clientY);
  };

  const handleCanvasPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    if (dragIndex === null) return;
    setDragIndex(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleHandlePointerDown = (index: number, event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    onSelect(index);
    setDragIndex(index);
  };

  const handleHandlePointerMove = (index: number, event: PointerEvent<HTMLButtonElement>) => {
    if (dragIndex !== index) return;
    movePoint(index, event.clientX, event.clientY);
  };

  const handleHandlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    setDragIndex(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerCancel={handleCanvasPointerUp}
        aria-label="Imagen del patrón para detectar y ajustar el contorno"
        className={`block h-auto w-full touch-none rounded-xl border border-beige bg-cream ${
          dragIndex !== null ? "cursor-grabbing" : "cursor-crosshair"
        }`}
      />
      {outline.length > 1 && (
        <div className="pointer-events-none absolute inset-0">
          {outline.map((point, index) => {
            const { x, y } = toDisplay(point);
            const active = dragIndex === index || selectedIndex === index;
            return (
              <button
                key={index}
                type="button"
                aria-label={`Punto ${index + 1} del contorno`}
                aria-pressed={selectedIndex === index}
                title="Arrastra para mover; doble clic para quitar"
                onPointerDown={(event) => handleHandlePointerDown(index, event)}
                onPointerMove={(event) => handleHandlePointerMove(index, event)}
                onPointerUp={handleHandlePointerUp}
                onPointerCancel={handleHandlePointerUp}
                onDoubleClick={() => onRemovePoint(index)}
                style={{ left: `${(x / CANVAS_WIDTH) * 100}%`, top: `${(y / CANVAS_HEIGHT) * 100}%` }}
                className={`pointer-events-auto absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-terracotta shadow-sm transition after:absolute after:-inset-2 after:content-[''] focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1 ${
                  active
                    ? "cursor-grabbing bg-terracotta ring-2 ring-terracotta ring-offset-1"
                    : "cursor-grab bg-white hover:bg-terracotta/10"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
