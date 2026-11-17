import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ScanLine, Sparkles } from "lucide-react";
import type { Calibration, Point } from "../../types/digitizer";
import { extractOutline } from "../../services/digitizer/contour";
import { bbox, polygonArea } from "../../services/digitizer/geometry";
import { useOutlinePointEditor } from "../../hooks/useOutlinePointEditor";
import { OutlineCanvas } from "./OutlineCanvas";
import { OutlineControls } from "./OutlineControls";
import { OutlinePointTools } from "./OutlinePointTools";

interface OutlineStepProps {
  canvas: HTMLCanvasElement;
  calibration: Calibration;
  initialOutline: Point[] | null;
  onOutline: (points: Point[]) => void;
  onBack: () => void;
}

export function OutlineStep({ canvas, calibration, initialOutline, onOutline, onBack }: OutlineStepProps) {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState<Point | null>(null);
  const [outline, setOutline] = useState<Point[]>(initialOutline ?? []);
  const [threshold, setThreshold] = useState(128);
  const [autoThreshold, setAutoThreshold] = useState(true);
  const [gap, setGap] = useState(1);
  const [simplify, setSimplify] = useState(2);
  const [keepLargest, setKeepLargest] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const autoApplyRef = useRef(false);
  const { selectedIndex, setSelectedIndex, addPoint, removePoint, clearOutline } = useOutlinePointEditor({
    outline,
    setOutline,
    onClear: () => {
      autoApplyRef.current = false;
      setWarning("Contorno borrado. Haz clic dentro de la pieza y vuelve a detectar.");
    },
  });

  const detect = useCallback(
    async (scroll = false) => {
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
        setSelectedIndex(null);
        if (scroll && result.points.length >= 3) {
          canvasWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (result.points.length < 3) {
          setWarning("No se detectó un contorno cerrado. Ajusta el umbral o prueba a cerrar huecos.");
        } else if (result.touchesBorder) {
          setWarning("El contorno toca el borde de la foto. Revisa que la pieza esté completa y que el fondo no se haya colado.");
        }
      } finally {
        setBusy(false);
      }
    },
    [autoThreshold, canvas, gap, keepLargest, seed, simplify, threshold]
  );

  useEffect(() => {
    if (!autoApplyRef.current || !seed) return;
    const timer = window.setTimeout(() => {
      void detect(false);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [detect, seed]);

  const handleDetect = () => {
    autoApplyRef.current = true;
    void detect(true);
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
              línea no se cierra bien. Después, arrastra los puntos o usa «Añadir punto» y «Quitar
              punto» para corregir el contorno.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Si el fondo es oscuro, desactiva «Aislar el contorno principal».
            </p>
          </div>
        </div>

        <div ref={canvasWrapperRef}>
          <OutlineCanvas
            image={canvas}
            outline={outline}
            seed={seed}
            selectedIndex={selectedIndex}
            onSeedChange={(point) => {
              autoApplyRef.current = false;
              setSeed(point);
              setWarning(null);
            }}
            onOutlineChange={(points) => {
              setOutline(points);
              setWarning(null);
            }}
            onSelect={setSelectedIndex}
            onRemovePoint={removePoint}
          />
        </div>
        {outline.length >= 3 && (
          <OutlinePointTools
            pointCount={outline.length}
            selectedIndex={selectedIndex}
            onAdd={addPoint}
            onRemove={() => selectedIndex !== null && removePoint(selectedIndex)}
            onClear={clearOutline}
          />
        )}

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
