// ============================================================================
// Página: Selector de patrones
// ============================================================================

import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { ProgressBar } from "../components/layout/ProgressBar";
import { PatternCards } from "../components/patterns/PatternCards";
import { usePatterns } from "../hooks/usePatterns";

export function PatternSelector() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<"ropa" | "neceser">((searchParams.get("categoria") as "ropa" | "neceser") || "neceser");
  const { patternsByCategory } = usePatterns();
  const categoryLabel = category === "ropa" ? "Ropa" : "Neceser";

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat === "ropa" || cat === "neceser") setCategory(cat);
  }, [searchParams]);

  const patterns = patternsByCategory[category] || [];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <ProgressBar activeStep="elegir" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{categoryLabel}</h1>
              <p className="text-slate-600">Selecciona el tipo de patrón que deseas crear</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCategory("ropa")} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${category === "ropa" ? "bg-terracotta text-white shadow" : "bg-white border border-beige text-slate-700 hover:bg-beige"}`}>Ropa</button>
              <button onClick={() => setCategory("neceser")} className={`px-5 py-2 rounded-lg text-sm font-medium transition ${category === "neceser" ? "bg-terracotta text-white shadow" : "bg-white border border-beige text-slate-700 hover:bg-beige"}`}>Neceser</button>
            </div>
          </div>
          <PatternCards patterns={patterns} onStart={(p) => navigate(`/medidas?patron=${p.id}`)} />
        </div>
      </div>
    </div>
  );
}