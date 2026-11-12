// ============================================================================
// Componente: Campo individual de medida con validación
// ============================================================================

import type { MeasureFieldDef } from "../../types";
import { CircleAlert } from "lucide-react";

interface MeasureFieldProps {
  field: MeasureFieldDef;
  value: number;
  onChange: (fieldId: string, value: string) => void;
  error?: string;
  exampleMode?: boolean;
  onFillExample?: () => void;
}

export function MeasureField({ field, value, onChange, error, exampleMode, onFillExample }: MeasureFieldProps) {
  const isBoolean = field.id === "tieneAsa";
  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between text-sm font-medium text-slate-700">
        {field.label}
        {error && <span className="text-terracotta text-xs font-bold">{error}</span>}
      </label>
      {isBoolean ? (
        <div className="flex items-center gap-3">
          <button className={`px-3 py-1.5 rounded border text-sm font-medium transition ${value === 1 ? "bg-terracotta border-terracotta text-white" : "bg-white border-beige text-slate-700 hover:bg-beige"}`} onClick={() => onChange(field.id, "1")}>Sí</button>
          <button className={`px-3 py-1.5 rounded border text-sm font-medium transition ${value === 0 ? "bg-terracotta border-terracotta text-white" : "bg-white border-beige text-slate-700 hover:bg-beige"}`} onClick={() => onChange(field.id, "0")}>No</button>
        </div>
      ) : (
        <div className="relative">
          <input type="text" value={value === 0 && field.min !== 0 ? "" : value.toString()} onChange={(e) => onChange(field.id, e.target.value)} placeholder={field.placeholder} className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-sage focus:border-transparent outline-none text-sm text-slate-800 transition" disabled={exampleMode} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{field.unit}</span>
          {error && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-terracotta"><CircleAlert size={14} /></div>}
        </div>
      )}
      {exampleMode && onFillExample && <button onClick={onFillExample} className="mt-1 text-xs text-sageDark hover:underline underline-offset-2">Rellenar con ejemplo</button>}
    </div>
  );
}