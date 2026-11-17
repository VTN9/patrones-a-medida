import type { DigitizerStage } from "../../types/digitizer";

const steps = [
  { key: "upload", label: "Foto" },
  { key: "perspective", label: "Esquinas" },
  { key: "scale", label: "Escala" },
  { key: "outline", label: "Contorno" },
  { key: "result", label: "PDF" },
] as const;

const order: DigitizerStage[] = ["upload", "perspective", "scale", "outline", "result"];

export function StepIndicator({ stage }: { stage: DigitizerStage }) {
  const active = order.indexOf(stage);
  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs">
      {steps.map((step, index) => {
        const done = index < active;
        const current = index === active;
        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full font-bold ${
                current
                  ? "bg-terracotta text-white"
                  : done
                    ? "bg-sage text-white"
                    : "border border-beige bg-white text-slate-400"
              }`}
            >
              {done ? "✓" : index + 1}
            </span>
            <span className={current ? "font-bold text-slate-800" : "text-slate-500"}>{step.label}</span>
            {index < steps.length - 1 && <span className="h-px w-4 bg-beige" />}
          </li>
        );
      })}
    </ol>
  );
}
