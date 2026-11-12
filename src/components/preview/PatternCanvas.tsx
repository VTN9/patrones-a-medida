// ============================================================================
// Componente: Lienzo completo del patrón con zoom, pan y toggle de margen
// ============================================================================

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { PatternResult } from "../../types";
import { SvgPattern } from "./SvgPattern";
import { ZoomPan } from "./ZoomPan";

interface PatternCanvasProps {
  result: PatternResult;
  initialSeamAllowanceCm: number;
}

export function PatternCanvas({ result, initialSeamAllowanceCm }: PatternCanvasProps) {
  const [showSeamAllowance, setShowSeamAllowance] = useState(true);
  const [seamAllowanceCm, setSeamAllowanceCm] = useState(initialSeamAllowanceCm);
  const opcionesMargen = [0.5, 1, 1.5];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-beige shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSeamAllowance((v) => !v)} className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition">
            {showSeamAllowance ? <EyeOff size={16} /> : <Eye size={16} />}
            {showSeamAllowance ? "Ocultar margen" : "Mostrar margen"}
          </button>
          <span className="text-xs text-slate-500">Margen actual: {seamAllowanceCm} cm</span>
        </div>
        <div className="flex items-center gap-2">
          {opcionesMargen.map((op) => (
            <button key={op} onClick={() => setSeamAllowanceCm(op)} className={`w-8 h-8 rounded-full text-xs font-medium border transition ${seamAllowanceCm === op ? "bg-terracotta border-terracotta text-white" : "bg-white border-beige text-slate-700 hover:bg-beige"}`}>{op}</button>
          ))}
          <button onClick={() => setSeamAllowanceCm(0)} className="w-8 h-8 rounded-full text-xs font-medium border border-beige text-slate-700 hover:bg-beige" title="Personalizado">…</button>
        </div>
      </div>
      <ZoomPan>
        <SvgPattern result={result} showSeamAllowance={showSeamAllowance} seamAllowanceCm={seamAllowanceCm} />
      </ZoomPan>
    </div>
  );
}