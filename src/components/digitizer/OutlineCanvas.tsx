import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { Point } from "../../types/digitizer";
import { eventPoint, fitRect } from "./canvasUtils";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface OutlineCanvasProps {
  image: HTMLCanvasElement;
  outline: Point[];
  seed: Point | null;
  onSeedChange: (point: Point) => void;
  onOutlineChange: (points: Point[]) => void;
}

export function OutlineCanvas({ image, outline, seed, onSeedChange, onOutlineChange }: OutlineCanvasProps) {
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
    onSeedChange(toImage(point));
  };

  const handleHandlePointerDown = (index: number, event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragIndex(index);
  };

  const handleHandlePointerMove = (index: number, event: PointerEvent<HTMLButtonElement>) => {
    if (dragIndex !== index) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const display = {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
    const next = toImage(display);
    onOutlineChange(outline.map((point, pointIndex) => (pointIndex === index ? next : point)));
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
        className="block h-auto w-full touch-none cursor-crosshair rounded-xl border border-beige bg-cream"
      />
      {outline.length > 1 && (
        <div className="pointer-events-none absolute inset-0">
          {outline.map((point, index) => {
            const { x, y } = toDisplay(point);
            return (
              <button
                key={index}
                type="button"
                aria-label={`Punto ${index + 1} del contorno`}
                onPointerDown={(event) => handleHandlePointerDown(index, event)}
                onPointerMove={(event) => handleHandlePointerMove(index, event)}
                onPointerUp={handleHandlePointerUp}
                onPointerCancel={handleHandlePointerUp}
                style={{ left: `${(x / CANVAS_WIDTH) * 100}%`, top: `${(y / CANVAS_HEIGHT) * 100}%` }}
                className={`pointer-events-auto absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-terracotta shadow-sm transition focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1 ${
                  dragIndex === index ? "cursor-grabbing bg-terracotta" : "cursor-grab bg-white hover:bg-terracotta/10"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
