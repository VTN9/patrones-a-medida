import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { ArrowLeft, Ruler } from "lucide-react";
import type { Calibration, NormalizedPoint } from "../../types/digitizer";
import { clamp, eventPoint, fitRect } from "./canvasUtils";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface ScaleStepProps {
  canvas: HTMLCanvasElement;
  initialCalibration: Calibration | null;
  onCalibrated: (calibration: Calibration) => void;
  onBack: () => void;
}

export function ScaleStep({ canvas, initialCalibration, onCalibrated, onBack }: ScaleStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<NormalizedPoint[]>(
    initialCalibration ? [initialCalibration.p1, initialCalibration.p2] : []
  );
  const [realCm, setRealCm] = useState(initialCalibration?.realCm ?? 10);
  const fit = useMemo(() => fitRect(canvas.width, canvas.height, CANVAS_WIDTH, CANVAS_HEIGHT), [canvas]);

  useEffect(() => {
    const target = canvasRef.current;
    if (!target) return;
    const context = target.getContext("2d");
    if (!context) return;
    context.fillStyle = "#f8f5ef";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.drawImage(canvas, fit.x, fit.y, fit.width, fit.height);
    if (points.length > 0) {
      const first = points[0];
      const x1 = fit.x + first.x * fit.width;
      const y1 = fit.y + first.y * fit.height;
      context.beginPath();
      context.arc(x1, y1, 8, 0, Math.PI * 2);
      context.fillStyle = "#c0714f";
      context.fill();
      if (points.length > 1) {
        const second = points[1];
        const x2 = fit.x + second.x * fit.width;
        const y2 = fit.y + second.y * fit.height;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.strokeStyle = "#c0714f";
        context.lineWidth = 4;
        context.stroke();
        context.beginPath();
        context.arc(x2, y2, 8, 0, Math.PI * 2);
        context.fillStyle = "#c0714f";
        context.fill();
      }
    }
  }, [canvas, fit, points]);

  const handleClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const point = eventPoint(event);
    const normalized = {
      x: clamp((point.x - fit.x) / fit.width, 0, 1),
      y: clamp((point.y - fit.y) / fit.height, 0, 1),
    };
    setPoints((previous) => (previous.length >= 2 ? [normalized] : [...previous, normalized]));
  };

  const distancePx =
    points.length === 2
      ? Math.hypot((points[1].x - points[0].x) * canvas.width, (points[1].y - points[0].y) * canvas.height)
      : 0;
  const pxPerCm = realCm > 0 && distancePx > 0 ? distancePx / realCm : 0;
  const widthCm = pxPerCm > 0 ? canvas.width / pxPerCm : 0;
  const heightCm = pxPerCm > 0 ? canvas.height / pxPerCm : 0;
  const canContinue = points.length === 2 && pxPerCm > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm md:p-8">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
            <Ruler size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Calibra la escala real</h2>
            <p className="mt-1 text-sm text-slate-600">
              Haz clic en los dos extremos de una medida conocida de la foto (por ejemplo, una regla
              de 10 cm) y escribe su longitud real.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Si no tienes regla, usa el ancho de un folio A4 (21 cm) como referencia.
            </p>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleClick}
          className="h-auto w-full cursor-crosshair rounded-xl border border-beige bg-cream"
        />

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Longitud real de la línea
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={realCm}
                  onChange={(event) => setRealCm(Number(event.target.value))}
                  className="w-32 rounded-lg border border-beige bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-terracotta"
                />
                <span className="text-sm text-slate-500">cm</span>
              </div>
            </label>
            <div className="rounded-lg border border-beige bg-cream/60 px-4 py-3 text-sm">
              <p className="text-slate-500">Escala detectada</p>
              <p className="font-semibold text-slate-800">
                {pxPerCm > 0 ? `${pxPerCm.toFixed(1)} px/cm` : "Marca dos puntos"}
              </p>
              {pxPerCm > 0 && (
                <p className="text-xs text-slate-500">
                  Zona: {widthCm.toFixed(1)} × {heightCm.toFixed(1)} cm
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-lg border border-beige bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-beige"
            >
              <ArrowLeft size={16} /> Volver
            </button>
            <button
              type="button"
              onClick={() => setPoints([])}
              className="rounded-lg border border-beige bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-beige"
            >
              Reiniciar línea
            </button>
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => onCalibrated({ p1: points[0], p2: points[1], realCm, pxPerCm })}
              className="rounded-lg bg-terracotta px-5 py-2 text-sm font-medium text-white transition hover:bg-terracottaDark disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
