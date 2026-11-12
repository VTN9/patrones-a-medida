// ============================================================================
// Página: Previsualización y exportación del patrón generado
// ============================================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { ProgressBar } from "../components/layout/ProgressBar";
import { PatternCanvas } from "../components/preview/PatternCanvas";
import { ExportButtons } from "../components/export/ExportButtons";
import { SewingGuide } from "../components/guides/SewingGuide";
import { getCalculator } from "../services/patternEngine";
import { getPatternById } from "../data/patterns";
import { getDraft } from "../services/localStorage/draft";
import { saveLastPattern } from "../services/localStorage/lastPattern";
import { type PatternResult } from "../types";
import { ArrowLeft, RefreshCw } from "lucide-react";

import "../services/calculators";

export function Preview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patternId = searchParams.get("patron");
  const [result, setResult] = useState<PatternResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const generatePattern = useCallback(async () => {
    if (!patternId) { setError("No se indicó ningún patrón."); return; }
    const pattern = getPatternById(patternId);
    const calc = pattern ? getCalculator(pattern.calculator) : getCalculator(patternId);
    if (!calc) { setError("No se encontró la calculadora de este patrón."); return; }
    setLoading(true);
    setError(null);
    try {
      const draft = getDraft();
      const measures = draft && draft.patternId === patternId ? draft.measures : {};
      const margen = Number(measures["margenCostura"]);
      const margenCm = Number.isFinite(margen) && margen >= 0 ? margen : 1;
      const nuevo = calc.calculate(measures, margenCm);
      setResult(nuevo);
      saveLastPattern(nuevo);
    } catch (err) {
      console.error(err);
      setError("No se pudo generar el patrón con esas medidas.");
    } finally {
      setLoading(false);
    }
  }, [patternId]);

  useEffect(() => { generatePattern(); }, [generatePattern]);

  if (!result) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center py-20 px-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta mx-auto"><RefreshCw size={32} /></div>
          {loading ? <p className="text-slate-600">Generando tu patrón...</p> : <p className="text-slate-600">{error ?? "No se pudo cargar el patrón."}</p>}
          {!loading && (
            <button onClick={() => navigate("/selector")} className="px-5 py-2.5 rounded-lg bg-terracotta text-white text-sm font-medium hover:bg-terracottaDark transition">
              Volver a los patrones
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <ProgressBar activeStep="generar" />
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate("/selector")} className="flex items-center gap-2 text-sm text-slate-600 hover:text-terracotta transition"><ArrowLeft size={16} /> Volver a patrones</button>
            <span className="h-4 w-px bg-beige mx-2" />
            <span className="text-sm font-medium text-slate-700">{result.patternName}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-xl border border-beige p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Previsualización</h2>
                  <span className="text-xs text-slate-400 bg-beige px-2 py-1 rounded">SVG · Escala 1:1</span>
                </div>
                <div ref={containerRef} className="w-full">
                  <PatternCanvas result={result} initialSeamAllowanceCm={result.seamAllowanceCm} />
                </div>
                <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medidas utilizadas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    {Object.entries(result.measuresUsed).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-slate-500 text-xs uppercase tracking-wider">{key}</span>
                        <span className="text-slate-800 font-medium">{key === "tieneAsa" ? (value ? "Sí" : "No") : `${value.toFixed(1)} cm`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-beige p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Exportar</h2>
                <ExportButtons result={result} containerRef={containerRef} instructions={result.instructions} />
              </div>
              <SewingGuide instructions={result.instructions} materials={result.materials} fabricQty={result.fabricQty} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
