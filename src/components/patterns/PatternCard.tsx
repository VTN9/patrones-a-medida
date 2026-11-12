// ============================================================================
// Componente: Tarjeta individual de patrón
// ============================================================================

import { ChevronRight } from "lucide-react";
import type { PatternMeta } from "../../types";

interface PatternCardProps {
  pattern: PatternMeta;
  onStart: (pattern: PatternMeta) => void;
}

export function PatternCard({ pattern, onStart }: PatternCardProps) {
  const iconMap: Record<string, React.ReactNode> = {
    Bag: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293M7 13l2.293 2.293M12 13l-2.293-2.293M12 13l2.293-2.293M16 13l-2.293-2.293M16 13l2.293-2.293M13 18l-2.293 2.293M13 18l2.293-2.293" /></svg>,
    Skirt: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
  };

  const Icon = iconMap[pattern.icon] || <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /></svg>;

  return (
    <div className="group relative bg-white border border-beige rounded-xl p-6 hover:border-terracotta hover:shadow-md transition cursor-pointer" onClick={() => onStart(pattern)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onStart(pattern)}>
      <div className="w-16 h-16 rounded-lg bg-cream flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white transition mb-4">
        {Icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{pattern.name}</h3>
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{pattern.description}</p>
      <div className="space-y-2 mb-6">
        <div className="flex items-start gap-2 text-xs text-slate-500">
          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-sage/20 text-sageDark flex items-center justify-center">•</span>
          <span>{pattern.measures.length} medidas necesarias</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-slate-500">
          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-sage/20 text-sageDark flex items-center justify-center">•</span>
          <span>{pattern.category === "ropa" ? "Patrón de ropa" : "Patrón de neceser"}</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-terracotta/0 group-hover:bg-terracotta/5 transition rounded-xl pointer-events-none" />
      <div className="mt-6 flex items-center text-sm font-medium text-terracottaDark">
        Empezar <ChevronRight size={14} className="ml-1" />
      </div>
    </div>
  );
}