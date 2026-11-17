import { useMemo, useState } from "react";
import { ArrowLeft, Check, Download, Plus, Trash2 } from "lucide-react";
import type { Calibration, DigitizedPiece, Point } from "../../types/digitizer";
import {
  bbox,
  offsetPolygon,
  pointsToSvgPath,
  polygonArea,
  polygonPerimeter,
} from "../../services/digitizer/geometry";

interface ResultStepProps {
  outline: Point[] | null;
  calibration: Calibration | null;
  pieces: DigitizedPiece[];
  onAddPiece: (name: string, marginCm: number) => void;
  onRemovePiece: (id: string) => void;
  onExport: () => void;
  onAnother: () => void;
  onBack: () => void;
}

export function ResultStep({
  outline,
  calibration,
  pieces,
  onAddPiece,
  onRemovePiece,
  onExport,
  onAnother,
  onBack,
}: ResultStepProps) {
  const [name, setName] = useState("");
  const [marginCm, setMarginCm] = useState(1);

  const preview = useMemo(() => {
    if (!outline || !calibration || calibration.pxPerCm <= 0) return null;
    const box = bbox(outline);
    const pointsCm = outline.map((point) => ({
      x: (point.x - box.minX) / calibration.pxPerCm,
      y: (point.y - box.minY) / calibration.pxPerCm,
    }));
    return {
      pointsCm,
      widthCm: box.width / calibration.pxPerCm,
      heightCm: box.height / calibration.pxPerCm,
      areaCm2: polygonArea(pointsCm),
      perimeterCm: polygonPerimeter(pointsCm),
    };
  }, [outline, calibration]);

  const cutPoints = useMemo(
    () => (preview && marginCm > 0 ? offsetPolygon(preview.pointsCm, marginCm) : preview?.pointsCm ?? []),
    [preview, marginCm]
  );
  const padding = preview ? Math.max(1, marginCm + Math.max(preview.widthCm, preview.heightCm) * 0.06) : 1;

  return (
    <div className="space-y-6">
      {preview && (
        <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage/15 text-sageDark">
              <Check size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Revisa y añade la pieza</h2>
              <p className="mt-1 text-sm text-slate-600">
                Comprueba que el contorno sigue la línea de tu patrón. La línea verde es la costura y
                la negra es el corte con el margen incluido.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <svg
              viewBox={`${-padding} ${-padding} ${preview.widthCm + padding * 2} ${preview.heightCm + padding * 2}`}
              className="h-72 w-full rounded-xl border border-beige bg-cream"
              role="img"
              aria-label="Vista previa del contorno digitalizado"
            >
              <path
                d={pointsToSvgPath(preview.pointsCm)}
                fill="rgba(122, 139, 111, 0.12)"
                stroke="#7a8b6f"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                vectorEffect="non-scaling-stroke"
              />
              {marginCm > 0 && (
                <path
                  d={pointsToSvgPath(cutPoints)}
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>

            <div className="space-y-4">
              <div className="rounded-xl border border-beige bg-cream/60 p-4 text-sm">
                <p className="text-slate-500">Tamaño real</p>
                <p className="text-lg font-bold text-slate-800">
                  {preview.widthCm.toFixed(1)} × {preview.heightCm.toFixed(1)} cm
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Área: {preview.areaCm2.toFixed(0)} cm² · Perímetro: {preview.perimeterCm.toFixed(0)} cm
                </p>
              </div>
              <label className="block text-sm font-medium text-slate-700">
                Nombre de la pieza
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={`Pieza ${pieces.length + 1}`}
                  className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-terracotta"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Margen de costura (cm)
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.5}
                  value={marginCm}
                  onChange={(event) => setMarginCm(Math.max(0, Number(event.target.value)))}
                  className="mt-1 w-28 rounded-lg border border-beige bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-terracotta"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-2 rounded-lg border border-beige bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-beige"
                >
                  <ArrowLeft size={16} /> Volver
                </button>
                <button
                  type="button"
                  onClick={() => onAddPiece(name || `Pieza ${pieces.length + 1}`, marginCm)}
                  className="flex items-center gap-2 rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-white transition hover:bg-terracottaDark"
                >
                  <Plus size={16} /> Añadir al PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Piezas digitalizadas</h2>
            <p className="text-sm text-slate-600">
              {pieces.length === 0
                ? "Todavía no has añadido ninguna pieza."
                : `${pieces.length} pieza${pieces.length === 1 ? "" : "s"} lista${pieces.length === 1 ? "" : "s"} para el PDF.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onAnother}
              className="flex items-center gap-2 rounded-lg border border-beige bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-beige"
            >
              <Plus size={16} /> Subir otra foto
            </button>
            <button
              type="button"
              onClick={onExport}
              disabled={pieces.length === 0}
              className="flex items-center gap-2 rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-white transition hover:bg-terracottaDark disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={16} /> Descargar PDF
            </button>
          </div>
        </div>

        {pieces.length > 0 && (
          <ul className="mt-5 divide-y divide-beige rounded-xl border border-beige">
            {pieces.map((piece) => (
              <li key={piece.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-800">{piece.name}</p>
                  <p className="text-xs text-slate-500">
                    {piece.widthCm.toFixed(1)} × {piece.heightCm.toFixed(1)} cm · margen {piece.marginCm.toFixed(1)} cm
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemovePiece(piece.id)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  aria-label={`Eliminar ${piece.name}`}
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
