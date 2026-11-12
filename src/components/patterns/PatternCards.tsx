// ============================================================================
// Componente: Grid de tarjetas de patrón por categoría
// ============================================================================

import { PatternCard } from "./PatternCard";
import type { PatternMeta } from "../../types";

interface PatternCardsProps {
  patterns: PatternMeta[];
  onStart: (pattern: PatternMeta) => void;
}

export function PatternCards({ patterns, onStart }: PatternCardsProps) {
  if (patterns.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        No hay patrones disponibles en esta categoría.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patterns.map((pattern) => (
        <PatternCard key={pattern.id} pattern={pattern} onStart={onStart} />
      ))}
    </div>
  );
}