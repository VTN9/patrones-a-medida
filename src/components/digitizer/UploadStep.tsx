import { useRef, useState } from "react";
import { Camera, FileText, ImagePlus, Lightbulb, Upload } from "lucide-react";

interface UploadStepProps {
  onSelect: (file: File) => void;
  piecesCount: number;
  onExport: () => void;
  onViewPieces: () => void;
  error: string | null;
}

export function UploadStep({ onSelect, piecesCount, onExport, onViewPieces, error }: UploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) onSelect(file);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-beige bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
            <Camera size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Sube una foto de tu patrón en papel</h2>
            <p className="mt-1 text-sm text-slate-600">
              Extiende el patrón sobre una superficie plana, con buena luz y sin sombras. Incluye una
              regla o una medida conocida para calibrar la escala.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
            dragging ? "border-terracotta bg-terracotta/5" : "border-beige bg-cream hover:border-terracotta/60"
          }`}
        >
          <ImagePlus size={40} className="text-terracotta" />
          <span className="text-base font-medium text-slate-800">Haz clic o arrastra una imagen aquí</span>
          <span className="text-xs text-slate-500">JPG, PNG, WEBP o SVG · Una pieza por foto</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />

        {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: <Lightbulb size={16} />, title: "Buena luz", text: "Evita sombras y reflejos sobre el papel." },
            { icon: <Upload size={16} />, title: "Foto cenital", text: "Hazla desde arriba, lo más recta posible." },
            { icon: <FileText size={16} />, title: "Medida conocida", text: "Incluye una regla de 10 cm en la foto." },
          ].map((tip) => (
            <div key={tip.title} className="rounded-xl border border-beige bg-cream/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-terracotta">{tip.icon}</div>
              <p className="text-sm font-semibold text-slate-800">{tip.title}</p>
              <p className="mt-1 text-xs text-slate-600">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {piecesCount > 0 && (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-beige bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-bold text-slate-800">Ya tienes {piecesCount} pieza{piecesCount === 1 ? "" : "s"}</h3>
            <p className="text-sm text-slate-600">Puedes añadir más piezas o descargar el PDF con lo digitalizado.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onViewPieces}
              className="rounded-lg border border-beige bg-cream px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-beige"
            >
              Ver piezas
            </button>
            <button
              type="button"
              onClick={onExport}
              className="rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-white transition hover:bg-terracottaDark"
            >
              Descargar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
