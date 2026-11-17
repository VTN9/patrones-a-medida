interface OutlineControlsProps {
  threshold: number;
  setThreshold: (value: number) => void;
  autoThreshold: boolean;
  setAutoThreshold: (value: boolean) => void;
  gap: number;
  setGap: (value: number) => void;
  simplify: number;
  setSimplify: (value: number) => void;
  keepLargest: boolean;
  setKeepLargest: (value: boolean) => void;
  widthCm: number;
  heightCm: number;
  areaCm2: number;
  pointCount: number;
}

export function OutlineControls({
  threshold,
  setThreshold,
  autoThreshold,
  setAutoThreshold,
  gap,
  setGap,
  simplify,
  setSimplify,
  keepLargest,
  setKeepLargest,
  widthCm,
  heightCm,
  areaCm2,
  pointCount,
}: OutlineControlsProps) {
  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Umbral: {autoThreshold ? "automático" : threshold}
          <input
            type="range"
            min={20}
            max={240}
            value={threshold}
            disabled={autoThreshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className="mt-2 w-full accent-terracotta disabled:opacity-40"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={autoThreshold}
            onChange={(event) => setAutoThreshold(event.target.checked)}
            className="h-4 w-4 accent-terracotta"
          />
          Umbral automático
        </label>
        <label className="text-sm font-medium text-slate-700">
          Cerrar huecos: {gap} px
          <input
            type="range"
            min={0}
            max={4}
            value={gap}
            onChange={(event) => setGap(Number(event.target.value))}
            className="mt-2 w-full accent-terracotta"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Simplificar: {simplify} px
          <input
            type="range"
            min={0}
            max={8}
            value={simplify}
            onChange={(event) => setSimplify(Number(event.target.value))}
            className="mt-2 w-full accent-terracotta"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
          <input
            type="checkbox"
            checked={keepLargest}
            onChange={(event) => setKeepLargest(event.target.checked)}
            className="h-4 w-4 accent-terracotta"
          />
          Aislar el contorno principal (recomendado)
        </label>
      </div>

      <div className="rounded-xl border border-beige bg-cream/60 p-4 text-sm">
        <p className="text-slate-500">Contorno detectado</p>
        <p className="font-semibold text-slate-800">
          {pointCount > 0 ? `${widthCm.toFixed(1)} × ${heightCm.toFixed(1)} cm` : "Sin detectar"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {pointCount} puntos · {areaCm2.toFixed(0)} cm²
        </p>
      </div>
    </div>
  );
}
