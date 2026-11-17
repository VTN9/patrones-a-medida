import { Eraser, Plus, Trash2 } from "lucide-react";

interface OutlinePointToolsProps {
  pointCount: number;
  selectedIndex: number | null;
  onAdd: () => void;
  onRemove: () => void;
  onClear: () => void;
}

const buttonClass =
  "flex items-center gap-2 rounded-lg border border-beige bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-beige disabled:cursor-not-allowed disabled:opacity-60";

export function OutlinePointTools({
  pointCount,
  selectedIndex,
  onAdd,
  onRemove,
  onClear,
}: OutlinePointToolsProps) {
  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onAdd} className={buttonClass}>
          <Plus size={16} /> Añadir punto
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={selectedIndex === null || pointCount <= 3}
          className={buttonClass}
        >
          <Trash2 size={16} /> Quitar punto
        </button>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 rounded-lg border border-terracotta/30 bg-white px-3 py-2 text-sm font-medium text-terracotta transition hover:bg-terracotta/10"
        >
          <Eraser size={16} /> Borrar contorno
        </button>
      </div>
      <div className="mt-2 space-y-1 text-xs text-slate-500">
        <p>Arrastra los puntos para moverlos. También puedes hacer clic sobre la línea para añadir uno.</p>
        <p>Selecciona un punto y pulsa «Quitar punto» o la tecla Supr; «Borrar contorno» elimina todo el contorno.</p>
      </div>
    </div>
  );
}
