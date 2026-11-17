import { useEffect, useMemo, useRef } from "react";
import type { PointerEvent } from "react";
import { ArrowLeft, Crop, RotateCcw } from "lucide-react";
import type { NormalizedPoint } from "../../types/digitizer";
import { DEFAULT_CORNERS } from "../../services/digitizer/defaults";
import { clamp, eventPoint, fitRect } from "./canvasUtils";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface PerspectiveStepProps {
  image: HTMLImageElement;
  corners: NormalizedPoint[];
  busy: boolean;
  onCornersChange: (corners: NormalizedPoint[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PerspectiveStep({ image, corners, busy, onCornersChange, onNext, onBack }: PerspectiveStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<number | null>(null);
  const fit = useMemo(
    () => fitRect(image.naturalWidth, image.naturalHeight, CANVAS_WIDTH, CANVAS_HEIGHT),
    [image]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#f8f5ef";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.drawImage(image, fit.x, fit.y, fit.width, fit.height);
    context.beginPath();
    corners.forEach((corner, index) => {
      const x = fit.x + corner.x * fit.width;
      const y = fit.y + corner.y * fit.height;
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.closePath();
    context.fillStyle = "rgba(192, 113, 79, 0.12)";
    context.fill();
    context.strokeStyle = "#c0714f";
    context.lineWidth = 3;
    context.stroke();
    corners.forEach((corner, index) => {
      const x = fit.x + corner.x * fit.width;
      const y = fit.y + corner.y * fit.height;
      context.beginPath();
      context.arc(x, y, 13, 0, Math.PI * 2);
      context.fillStyle = "#ffffff";
      context.fill();
      context.strokeStyle = "#c0714f";
      context.lineWidth = 3;
      context.stroke();
      context.fillStyle = "#c0714f";
      context.font = "bold 13px sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(String(index + 1), x, y + 1);
    });
  }, [image, corners, fit]);

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const point = eventPoint(event);
    let nearest = -1;
    let nearestDistance = 34;
    corners.forEach((corner, index) => {
      const x = fit.x + corner.x * fit.width;
      const y = fit.y + corner.y * fit.height;
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });
    if (nearest >= 0) {
      dragRef.current = nearest;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current === null) return;
    const point = eventPoint(event);
    const next = corners.map((corner, index) =>
      index === dragRef.current
        ? {
            x: clamp((point.x - fit.x) / fit.width, 0, 1),
            y: clamp((point.y - fit.y) / fit.height, 0, 1),
          }
        : corner
    );
    onCornersChange(next);
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm md:p-8">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
            <Crop size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Ajusta las cuatro esquinas</h2>
            <p className="mt-1 text-sm text-slate-600">
              Arrastra los puntos hasta los bordes del papel o del patrón. El orden es: superior
              izquierda, superior derecha, inferior derecha e inferior izquierda.
            </p>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="h-auto w-full touch-none rounded-xl border border-beige bg-cream"
        />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-lg border border-beige bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-beige"
            >
              <ArrowLeft size={16} /> Volver
            </button>
            <button
              type="button"
              onClick={() => onCornersChange(DEFAULT_CORNERS)}
              className="flex items-center gap-2 rounded-lg border border-beige bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-beige"
            >
              <RotateCcw size={16} /> Restablecer
            </button>
          </div>
          <button
            type="button"
            onClick={onNext}
            disabled={busy}
            className="rounded-lg bg-terracotta px-5 py-2 text-sm font-medium text-white transition hover:bg-terracottaDark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Enderezando..." : "Enderezar y continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
