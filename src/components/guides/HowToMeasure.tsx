// ============================================================================
// Componente: Guía de cómo tomar las medidas corporales
// ============================================================================

export function HowToMeasure() {
  const pasos = [
    { title: "Contorno de busto", descripcion: "Envuelve la cinta alrededor de la parte más amplia del pecho, pasando por los puntos del pecho y por la escápula. La cinta debe quedar horizontal y ajustada pero sin apretar." },
    { title: "Contorno de cintura", descripcion: "Localiza la cintura natural (el punto más estrecho del torso, generalmente por encima del ombligo). Mide sin contener la respiración." },
    { title: "Contorno de cadera", descripcion: "Mide alrededor de la parte más ancha de las caderas, generalmente unos 20 cm por debajo de la cintura. Mantén la cinta horizontal." },
    { title: "Largo total deseado", descripcion: "Desde la cintura hasta el largo que quieres que tenga la prenda (ej. hasta la rodilla o el tobillo para una falda)." },
    { title: "Largo de manga", descripcion: "Desde el hombro (hueso del acromion) hasta la muñeca, con el brazo ligeramente doblado." },
    { title: "Ancho de hombros", descripcion: "Desde la punta de un hombro hasta la punta del otro, pasando por la base del cuello." },
    { title: "Largo de tiro", descripcion: "Desde la cintura frontal hasta la entrepierna. Útil para pantalones." },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Cómo tomar tus medidas</h2>
      <p className="text-slate-600">Usa una cinta métrica flexible. Todas las medidas se registran en centímetros. Mide sobre la ropa interior o prendas ajustadas para mayor precisión.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pasos.map((p, i) => (
          <div key={i} className="bg-white rounded-xl border border-beige p-5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-sageDark font-bold mb-3">{i + 1}</div>
            <h3 className="text-base font-bold text-slate-800 mb-1">{p.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{p.descripcion}</p>
          </div>
        ))}
      </div>
      <div className="bg-beige rounded-xl p-5 border border-beige/50">
        <h3 className="text-sm font-bold text-sageDark uppercase tracking-wider mb-2">Consejos</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
          <li>Mide dos veces cada medida para confirmar.</li>
          <li>Mantén la cinta métrica nivelada, ni demasiado suelta ni demasiado apretada.</li>
          <li>Pide ayuda a otra persona para las medidas de espalda.</li>
          <li>Anota todas las medidas en centímetros antes de comenzar.</li>
        </ul>
      </div>
    </div>
  );
}