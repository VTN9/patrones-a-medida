// ============================================================================
// Página: Formulario de medidas y generación de patrón
// ============================================================================

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { ProgressBar } from "../components/layout/ProgressBar";
import { MeasurementsForm } from "../components/forms/MeasurementsForm";
import { useMeasurements } from "../hooks/useMeasurements";
import { usePatterns } from "../hooks/usePatterns";
import { validatePatternMeasures } from "../utils/validators";
import { saveDraft } from "../services/localStorage/draft";
import type { PatternMeta } from "../types";
import { ArrowLeft, Play } from "lucide-react";

export function Measurements() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patternId = searchParams.get("patron");
  const [pattern, setPattern] = useState<PatternMeta | null>(null);
  const { measures, setMeasure, errors, setErrors, clearErrors, profiles, loadProfile, createProfile, editProfile, removeProfile } = useMeasurements();
  const { patternsByCategory } = usePatterns();

  useEffect(() => {
    if (!patternId) { navigate("/"); return; }
    try {
      const parsed = JSON.parse(patternId);
      if (parsed && parsed.id) { setPattern(parsed as PatternMeta); return; }
    } catch {}
    for (const cat of Object.keys(patternsByCategory)) {
      const p = patternsByCategory[cat as keyof typeof patternsByCategory].find((x) => x.id === patternId);
      if (p) { setPattern(p); return; }
    }
    navigate("/");
  }, [patternId, navigate, patternsByCategory]);

  const handleGenerate = () => {
    if (!pattern) return;
    const errores = validatePatternMeasures(pattern, measures);
    setErrors(errores);
    if (errores.length > 0) return;
    saveDraft({ patternId: pattern.id, measures });
    navigate(`/preview?patron=${pattern.id}`);
  };

  if (!pattern) return null;
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="py-6 px-6">
        <div className="max-w-5xl mx-auto">
          <ProgressBar activeStep="medidas" />
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate("/selector")} className="flex items-center gap-2 text-sm text-slate-600 hover:text-terracotta transition"><ArrowLeft size={16} /> Volver a patrones</button>
            <span className="h-4 w-px bg-beige mx-2" />
            <span className="text-sm font-medium text-slate-700">{pattern.name}</span>
          </div>
          <MeasurementsForm pattern={pattern} category={pattern.category} measures={measures} setMeasure={setMeasure} errors={errors} clearErrors={clearErrors} profiles={profiles} onLoad={loadProfile} onCreate={(name, cat) => createProfile(name, cat)} onEdit={editProfile} onDelete={removeProfile} />
          <div className="mt-8 flex justify-end">
            <button onClick={handleGenerate} className="px-8 py-3 rounded-xl bg-sageDark text-white text-lg font-medium hover:bg-sage transition shadow flex items-center gap-2"><Play size={20} /> Generar patrón</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Measurements;