// ============================================================================
// Componente: Guía de costura para un patrón generado
// ============================================================================

interface SewingGuideProps {
  instructions: string[];
  materials: string[];
  fabricQty: string;
}

export function SewingGuide({ instructions, materials, fabricQty }: SewingGuideProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Guía de costura</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-beige p-5 shadow-sm">
          <h3 className="text-sm font-bold text-sageDark uppercase tracking-wider mb-3">Tela recomendada</h3>
          <p className="text-sm text-slate-600 font-medium">{fabricQty}</p>
        </div>
        <div className="bg-white rounded-xl border border-beige p-5 shadow-sm">
          <h3 className="text-sm font-bold text-sageDark uppercase tracking-wider mb-3">Materiales</h3>
          <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">{materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </div>
        <div className="bg-white rounded-xl border border-beige p-5 shadow-sm">
          <h3 className="text-sm font-bold text-sageDark uppercase tracking-wider mb-3">Herramientas</h3>
          <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
            <li>Máquina de coser o aguja e hilo</li>
            <li>Tijeras de tela</li>
            <li>Alfileres o pinzas</li>
            <li>Cinta métrica</li>
            <li>Tiza de sastre o marcador</li>
          </ul>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-beige p-5 shadow-sm">
        <h3 className="text-sm font-bold text-sageDark uppercase tracking-wider mb-3">Pasos de confección</h3>
        <ol className="text-sm text-slate-600 space-y-3 list-decimal pl-6">{instructions.map((paso, i) => <li key={i} className="leading-relaxed">{paso}</li>)}</ol>
      </div>
      <div className="bg-beige rounded-xl p-5 border border-beige/50">
        <h3 className="text-sm font-bold text-sageDark uppercase tracking-wider mb-2">Consejos básicos</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
          <li>Siempre cose derecho sobre derecho si quieres ocultar las costuras.</li>
          <li>Refuerza los puntos de tensión con una costura doble.</li>
          <li>Plancha cada costura tras coserla para un acabado profesional.</li>
          <li>Haz una prueba con retales antes de cortar la tela final.</li>
        </ul>
      </div>
    </div>
  );
}