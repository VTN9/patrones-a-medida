import { BookOpen, Lightbulb, Printer } from "lucide-react";

const STEPS = [
  {
    title: "Sube una foto",
    text: "Una pieza por foto. Hazla desde arriba, con buena luz y sin sombras. Incluye una regla de 10 cm o un folio A4 para calibrar.",
  },
  {
    title: "Ajusta las 4 esquinas",
    text: "Arrastra los puntos 1, 2, 3 y 4 hasta las esquinas del papel o del patrón. Pulsa «Enderezar y continuar».",
  },
  {
    title: "Calibra la escala",
    text: "Haz clic en los dos extremos de una medida conocida (una regla de 10 cm o el ancho de un A4, 21 cm) y escribe cuántos cm son. Comprueba la escala en px/cm y pulsa «Continuar».",
  },
  {
    title: "Detecta el contorno",
    text: "Haz clic dentro de la pieza y pulsa «Detectar contorno». Ajusta el umbral, «Cerrar huecos» o «Simplificar»: los cambios se aplican automáticamente. Arrastra los puntos para moverlos, usa «Añadir punto» o haz clic en la línea, y «Quitar punto» (o la tecla Supr) para eliminarlos. Si el contorno coge algo que no pertenece, pulsa «Borrar contorno» y vuelve a detectar. Si el fondo es oscuro, desactiva «Aislar el contorno principal». Pulsa «Usar contorno».",
  },
  {
    title: "Revisa y añade la pieza",
    text: "La línea verde es la costura y la negra el corte con margen. Ponle nombre, ajusta el margen (normalmente 1 cm) y pulsa «Añadir al PDF». Puedes usar «Subir otra foto» para añadir más piezas.",
  },
  {
    title: "Descarga el PDF",
    text: "Pulsa «Descargar PDF». Se genera un PDF con portada y hojas A4 a escala 1:1, con solapa de 10 mm, marcas de esquina y una regla de 10 cm para comprobar la impresión.",
  },
];

export function DigitizerGuide() {
  return (
    <section
      id="guia"
      className="mt-6 rounded-2xl border border-beige bg-white p-6 shadow-sm md:p-8"
      aria-labelledby="guia-titulo"
    >
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage/15 text-sageDark">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 id="guia-titulo" className="text-lg font-bold text-slate-800">
            Cómo usar el digitalizador
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Convierte la foto de un patrón de papel en un PDF imprimible a tamaño real.
          </p>
        </div>
      </div>

      <ol className="grid gap-4 md:grid-cols-2">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3 rounded-xl border border-beige bg-cream/60 p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-white">
              {index + 1}
            </span>
            <div>
              <p className="font-semibold text-slate-800">{step.title}</p>
              <p className="mt-1 text-sm text-slate-600">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl border border-beige bg-cream/60 p-4">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800">
          <Printer size={18} className="text-terracotta" /> Importante al imprimir
        </h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Imprime al 100 %, sin «ajustar a página».</li>
          <li>Mide la regla de 10 cm de la hoja: si mide 10 cm, la escala es correcta.</li>
          <li>Recorta los bordes y une las hojas por las marcas.</li>
        </ul>
      </div>

      <p className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Lightbulb size={18} className="mt-0.5 shrink-0" />
        <span>
          El progreso no se guarda si recargas la página: descarga el PDF antes de salir. La
          digitalización automática puede necesitar ajustes; revisa el contorno antes de cortar.
        </span>
      </p>
    </section>
  );
}
