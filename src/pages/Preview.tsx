// ============================================================================
// Página: Previsualización y exportación del patrón generado
// ============================================================================

import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
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

const Neceser3D = lazy(() => import("../components/neceser3d/Neceser3D"));

export function Preview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patternId = searchParams.get("patron");
  const [result, setResult] = useState<PatternResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"2d" | "3d">("2d");

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

  const isNeceser = result.category === "neceser";
  const show3d = isNeceser && view === "3d";
  const tabClass = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-xs font-medium transition ${active ? "bg-white text-terracotta shadow-sm" : "text-slate-500 hover:text-slate-700"}`;

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
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Previsualización</h2>
                  {isNeceser ? (
                    <div className="flex gap-1 rounded-lg border border-beige bg-cream p-1" role="tablist" aria-label="Vista del neceser">
                      <button type="button" role="tab" id="tab-2d" aria-controls="panel-2d" aria-selected={view === "2d"} onClick={() => setView("2d")} className={tabClass(view === "2d")}>
                        Patrón 2D
                      </button>
                      <button type="button" role="tab" id="tab-3d" aria-controls="panel-3d" aria-selected={view === "3d"} onClick={() => setView("3d")} className={tabClass(view === "3d")}>
                        Vista 3D
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 bg-beige px-2 py-1 rounded">SVG · Escala 1:1</span>
                  )}
                </div>
                {show3d ? (
                  <div role="tabpanel" id="panel-3d" aria-labelledby="tab-3d">
                    <Suspense fallback={<div className="flex h-[420px] items-center justify-center rounded-lg bg-cream text-sm text-slate-500">Cargando vista 3D...</div>}>
                      <Neceser3D measures={result.measuresUsed} />
                    </Suspense>
                  </div>
                ) : (
                  <div
                    ref={containerRef}
                    className="w-full"
                    role={isNeceser ? "tabpanel" : undefined}
                    id={isNeceser ? "panel-2d" : undefined}
                    aria-labelledby={isNeceser ? "tab-2d" : undefined}
                  >
                    <PatternCanvas result={result} initialSeamAllowanceCm={result.seamAllowanceCm} />
                  </div>
                )}
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
                {show3d ? (
                  <p className="text-sm text-slate-500">Usa el botón «Captura» de la vista 3D para descargar una imagen del modelo.</p>
                ) : (
                  <ExportButtons result={result} containerRef={containerRef} instructions={result.instructions} />
                )}
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
