import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { ArrowLeft, ScanLine, Sparkles } from "lucide-react";
import type { Calibration, Point } from "../../types/digitizer";
import { extractOutline } from "../../services/digitizer/contour";
import { bbox, polygonArea } from "../../services/digitizer/geometry";
import { eventPoint, fitRect } from "./canvasUtils";
import { OutlineControls } from "./OutlineControls";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface OutlineStepProps {
  canvas: HTMLCanvasElement;
  calibration: Calibration;
  initialOutline: Point[] | null;
  onOutline: (points: Point[]) => void;
  onBack: () => void;
}

export function OutlineStep({ canvas, calibration, initialOutline, onOutline, onBack }: OutlineStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState<Point | null>(null);
  const [outline, setOutline] = useState<Point[]>(initialOutline ?? []);
  const [threshold, setThreshold] = useState(128);
  const [autoThreshold, setAutoThreshold] = useState(true);
  const [gap, setGap] = useState(1);
  const [simplify, setSimplify] = useState(2);
  const [keepLargest, setKeepLargest] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fit = useMemo(() => fitRect(canvas.width, canvas.height, CANVAS_WIDTH, CANVAS_HEIGHT), [canvas]);

  useEffect(() => {
    const target = canvasRef.current;
    if (!target) return;
    const context = target.getContext("2d");
    if (!context) return;
    context.fillStyle = "#f8f5ef";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.drawImage(canvas, fit.x, fit.y, fit.width, fit.height);
    if (outline.length > 1) {
      context.beginPath();
      outline.forEach((point, index) => {
        const x = fit.x + (point.x / canvas.width) * fit.width;
        const y = fit.y + (point.y / canvas.height) * fit.height;
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
      const x = fit.x + (seed.x / canvas.width) * fit.width;
      const y = fit.y + (seed.y / canvas.height) * fit.height;
      context.beginPath();
      context.arc(x, y, 7, 0, Math.PI * 2);
      context.fillStyle = "#6f8759";
      context.fill();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;
      context.stroke();
    }
  }, [canvas, fit, outline, seed]);

  const handleClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const point = eventPoint(event);
    if (point.x < fit.x || point.y < fit.y || point.x > fit.x + fit.width || point.y > fit.y + fit.height) {
      return;
    }
    setSeed({
      x: ((point.x - fit.x) / fit.width) * canvas.width,
      y: ((point.y - fit.y) / fit.height) * canvas.height,
    });
    setOutline([]);
    setWarning(null);
  };

  const handleDetect = async () => {
    if (!seed) {
      setWarning("Haz clic dentro de la pieza antes de detectar el contorno.");
      return;
    }
    setBusy(true);
    setWarning(null);
    await new Promise((resolve) => setTimeout(resolve, 30));
    try {
      const context = canvas.getContext("2d");
      if (!context) return;
      const data = context.getImageData(0, 0, canvas.width, canvas.height);
      const result = extractOutline(data, seed, {
        threshold,
        autoThreshold,
        gap,
        simplify,
        keepLargest,
      });
      setOutline(result.points);
      if (result.points.length < 3) {
        setWarning("No se detectó un contorno cerrado. Ajusta el umbral o prueba a cerrar huecos.");
      } else if (result.touchesBorder) {
        setWarning("El contorno toca el borde de la foto. Revisa que la pieza esté completa y que el fondo no se haya colado.");
      }
    } finally {
      setBusy(false);
    }
  };

  const areaCm2 = calibration.pxPerCm > 0 ? polygonArea(outline) / calibration.pxPerCm ** 2 : 0;
  const box = bbox(outline);
  const widthCm = box.width / calibration.pxPerCm;
  const heightCm = box.height / calibration.pxPerCm;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm md:p-8">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
            <ScanLine size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Detecta el contorno de la pieza</h2>
            <p className="mt-1 text-sm text-slate-600">
              Haz clic dentro de la pieza y pulsa «Detectar contorno». Ajusta la sensibilidad si la
              línea no se cierra bien.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Si el fondo es oscuro, desactiva «Aislar el contorno principal».
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

        <OutlineControls
          threshold={threshold}
          setThreshold={setThreshold}
          autoThreshold={autoThreshold}
          setAutoThreshold={setAutoThreshold}
          gap={gap}
          setGap={setGap}
          simplify={simplify}
          setSimplify={setSimplify}
          keepLargest={keepLargest}
          setKeepLargest={setKeepLargest}
          widthCm={widthCm}
          heightCm={heightCm}
          areaCm2={areaCm2}
          pointCount={outline.length}
        />

        {warning && <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{warning}</p>}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border border-beige bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-beige"
          >
            <ArrowLeft size={16} /> Volver
          </button>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDetect}
              disabled={busy}
              className="flex items-center gap-2 rounded-lg border border-beige bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-beige disabled:opacity-60"
            >
              <Sparkles size={16} /> {busy ? "Detectando..." : "Detectar contorno"}
            </button>
            <button
              type="button"
              onClick={() => onOutline(outline)}
              disabled={outline.length < 3}
              className="rounded-lg bg-terracotta px-5 py-2 text-sm font-medium text-white transition hover:bg-terracottaDark disabled:cursor-not-allowed disabled:opacity-60"
            >
              Usar contorno
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
