// ============================================================================
// Componente: Barra de navegación superior
// ============================================================================

import { Home, FileText, Info } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-beige shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-white font-bold text-lg">
          P
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Patrones a Medida</h1>
          <p className="text-xs text-sageDark uppercase tracking-wider">Diseño de patrones personalizados</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link to="/" className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-cream hover:bg-beige transition text-slate-800 text-sm font-medium">
          <Home size={16} /> Inicio
        </Link>
        <Link to="/medidas" className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-terracotta hover:bg-terracottaDark transition text-white text-sm font-medium">
          <FileText size={16} /> Mis medidas
        </Link>
        <Link to="/como-tomar-medidas" className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-beige hover:bg-beige transition text-slate-800 text-sm font-medium">
          <Info size={16} /> Guía de medidas
        </Link>
      </div>
    </nav>
  );
}