// ============================================================================
// Página: Inicio
// ============================================================================

import { Link } from "react-router-dom";
import { Scissors, FileText, Download } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="bg-cream border-b border-beige py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/10 text-sageDark text-xs font-bold uppercase tracking-wider mb-6">
            Nueva aplicación
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-6">Patrones a Medida</h1>
          <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
            Crea patrones de costura personalizados introduciendo tus medidas reales
            en centímetros. Genera, visualiza y descarga tus patrones listos para
            imprimir o proyectar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/selector?categoria=ropa" className="px-8 py-4 rounded-xl bg-terracotta text-white text-lg font-medium hover:bg-terracottaDark transition shadow-lg flex items-center justify-center gap-2">
              <Scissors size={20} /> Crear patrón de ropa
            </Link>
            <Link to="/selector?categoria=neceser" className="px-8 py-4 rounded-xl bg-white border border-beige text-slate-800 text-lg font-medium hover:bg-beige transition flex items-center justify-center gap-2">
              <FileText size={20} /> Crear patrón de neceser
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-8">Cómo funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white border border-beige shadow-sm">
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center mx-auto mb-4 text-sageDark font-bold text-lg">{i}</div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{i === 1 ? "Elegir patrón" : i === 2 ? "Introducir medidas" : "Generar y descargar"}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {i === 1 ? "Selecciona el tipo de prenda o accesorio que deseas confeccionar." : i === 2 ? "Ingresa tus medidas en centímetros. Guarda perfiles para reutilizarlos." : "Visualiza el patrón en SVG y descárgalo en PDF, SVG o PNG."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-6 bg-beige/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Todo en tu navegador</h2>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
            No necesitamos servidores ni bases de datos. Los perfiles y el último
            patrón se guardan en tu navegador (localStorage) para que puedas
            volver cuando quieras.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-slate-500">
            <span className="flex items-center gap-1"><Download size={14} /> Exportar PDF, SVG y PNG</span>
            <span className="flex items-center gap-1"><FileText size={14} /> Medidas en centímetros</span>
            <span className="flex items-center gap-1"><Scissors size={14} /> Diseño original y sin rastreo</span>
          </div>
        </div>
      </section>
    </div>
  );
}