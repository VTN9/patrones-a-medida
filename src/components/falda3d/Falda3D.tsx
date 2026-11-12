// ============================================================================
// Contenedor de la vista 3D de la falda
// ============================================================================

import { useRef, useState } from "react";
import { Camera, Grid3x3, RotateCcw } from "lucide-react";
import type { AppMeasurements } from "../../types";
import Canvas3D, { type Canvas3DHandle } from "./Canvas3D";
import { useFaldaDimensions } from "./useFaldaDimensions";

interface Falda3DProps {
  measures: AppMeasurements;
  compact?: boolean;
}

export default function Falda3D({ measures, compact = false }: Falda3DProps) {
  const dims = useFaldaDimensions(measures);
  const viewerRef = useRef<Canvas3DHandle>(null);
  const [showGrid, setShowGrid] = useState(true);

  const handleCapture = () => {
    const data = viewerRef.current?.capture();
    if (!data) return;
    const link = document.createElement("a");
    link.href = data;
    link.download = `falda-3d-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!dims.valid) {
    return (
      <section className="rounded-xl border border-beige bg-white p-6 shadow-sm" aria-label="Vista 3D de la falda">
        <h2 className="text-lg font-bold text-slate-800">Vista 3D</h2>
        <p className="mt-2 text-sm text-slate-500">
          {dims.error ?? "Introduce las medidas de la falda para ver el modelo en 3D."}
        </p>
      </section>
    );
  }

  const heightClass = compact ? "h-[300px] lg:h-[380px]" : "h-[360px] sm:h-[420px] lg:h-[480px]";
  const buttonClass =
    "inline-flex items-center gap-1.5 rounded-lg border border-beige bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-cream";

  return (
    <section
      className="overflow-hidden rounded-xl border border-beige bg-white shadow-sm"
      aria-label="Vista 3D de la falda"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-beige p-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Vista 3D</h2>
          <p className="text-xs text-slate-500">Gira, acerca y explora tu falda</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowGrid((value) => !value)}
            aria-pressed={showGrid}
            className={
              showGrid
                ? "inline-flex items-center gap-1.5 rounded-lg border border-sage bg-sage/15 px-3 py-1.5 text-xs font-medium text-sageDark"
                : buttonClass
            }
          >
            <Grid3x3 className="h-3.5 w-3.5" aria-hidden="true" />
            Cuadrícula
          </button>
          <button type="button" onClick={() => viewerRef.current?.resetView()} className={buttonClass}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reiniciar
          </button>
          <button type="button" onClick={handleCapture} className={buttonClass}>
            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            Captura
          </button>
        </div>
      </div>

      <div className={`w-full touch-none bg-cream ${heightClass}`}>
        <Canvas3D ref={viewerRef} dims={dims} showGrid={showGrid} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-beige p-3 text-xs text-slate-500">
        <span>
          Cintura {dims.cinturaCm} · Cadera {dims.caderaCm} cm
        </span>
        <span>
          Largo {dims.largoTotalCm} cm
          {dims.holguraCm > 0 ? ` · Holgura ${dims.holguraCm} cm` : ""}
          {dims.margenCm > 0 ? ` · Margen ${dims.margenCm} cm` : ""}
        </span>
      </div>
    </section>
  );
}
