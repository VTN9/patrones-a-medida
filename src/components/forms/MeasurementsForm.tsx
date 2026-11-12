// ============================================================================
// Componente: Formulario principal de medidas
// ============================================================================

import { MEASURE_FIELDS } from "../../data/patterns";
import { MeasureField } from "./MeasureField";
import { ProfilesManager } from "./ProfilesManager";
import type { PatternMeta, AppMeasurements } from "../../types";

interface MeasurementsFormProps {
  pattern: PatternMeta;
  category: string;
  measures: AppMeasurements;
  setMeasure: (fieldId: string, value: string) => void;
  errors: { field: string; message: string }[];
  clearErrors?: () => void;
  profiles: any[];
  onLoad: (profile: any) => void;
  onCreate: (name: string, category: string, measures: AppMeasurements) => void;
  onEdit: (id: string, changes: Partial<any>) => void;
  onDelete: (id: string) => void;
  exampleMode?: boolean;
  setExampleMode?: (v: boolean) => void;
}

export function MeasurementsForm({ pattern, category, measures, setMeasure, errors, profiles, onLoad, onCreate, onEdit, onDelete, exampleMode = false }: MeasurementsFormProps) {
  const fieldDefs = pattern.measures.map((id) => MEASURE_FIELDS[id]);
  const fieldErrors: Record<string, string> = {};
  errors.forEach((e) => { fieldErrors[e.field] = e.message; });

  const fillExample = () => {
    const ejemplo: AppMeasurements = {};
    fieldDefs.forEach((f) => {
      if (f.id === "tieneAsa") ejemplo[f.id] = 1;
      else if (f.id === "largoAsa") ejemplo[f.id] = 30;
      else if (f.id === "margenCostura") ejemplo[f.id] = 1;
      else if (f.id === "holgura") ejemplo[f.id] = 4;
      else if (f.id === "busto") ejemplo[f.id] = 88;
      else if (f.id === "cintura") ejemplo[f.id] = 72;
      else if (f.id === "cadera") ejemplo[f.id] = 96;
      else if (f.id === "largoTotal") ejemplo[f.id] = 60;
      else if (f.id === "largoManga") ejemplo[f.id] = 60;
      else if (f.id === "anchoHombros") ejemplo[f.id] = 40;
      else if (f.id === "largoTiro") ejemplo[f.id] = 25;
      else if (f.id === "largoNeceser") ejemplo[f.id] = 25;
      else if (f.id === "altoNeceser") ejemplo[f.id] = 18;
      else if (f.id === "fondoNeceser") ejemplo[f.id] = 10;
      else if (f.id === "anchoCremallera") ejemplo[f.id] = 2;
      else ejemplo[f.id] = 20;
    });
    Object.entries(ejemplo).forEach(([k, v]) => setMeasure(k, v.toString()));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-beige p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Medidas para {pattern.name}</h2>
        <p className="text-sm text-slate-500">Introduce las medidas en centímetros. Usa el punto o la coma para decimales.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {fieldDefs.map((f) => (
            <MeasureField key={f.id} field={f} value={measures[f.id] || 0} onChange={setMeasure} error={fieldErrors[f.id]} exampleMode={exampleMode} onFillExample={fillExample} />
          ))}
        </div>
        {pattern.measures.includes("cintura") && pattern.measures.includes("cadera") && (
          <div className="mt-3 p-3 rounded-lg bg-terracotta/5 border border-terracotta/20">
            <p className="text-xs text-terracottaDark font-medium">Nota: para patrones de ropa, la cintura debe ser menor que la cadera.</p>
          </div>
        )}
      </div>
      <ProfilesManager profiles={profiles} onLoad={onLoad} onCreate={onCreate} onEdit={onEdit} onDelete={onDelete} currentMeasures={measures} category={category} />
    </div>
  );
}