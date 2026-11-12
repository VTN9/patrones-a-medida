// ============================================================================
// Componente: Barra de progreso de 3 pasos
// ============================================================================

import { Scissors, FileText, Download } from "lucide-react";

type Step = "elegir" | "medidas" | "generar";

interface ProgressBarProps {
  activeStep: Step;
}

export function ProgressBar({ activeStep }: ProgressBarProps) {
  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "elegir", label: "Elegir patrón", icon: <Scissors size={18} /> },
    { id: "medidas", label: "Introducir medidas", icon: <FileText size={18} /> },
    { id: "generar", label: "Generar y descargar", icon: <Download size={18} /> },
  ];

  const stepIndex = (id: Step) => steps.findIndex((s) => s.id === id);
  const isActive = (id: Step) => stepIndex(id) <= stepIndex(activeStep);
  const isCurrent = (id: Step) => id === activeStep;

  return (
    <div className="w-full max-w-3xl mx-auto px-0 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3 mb-6">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-1.5 sm:gap-2">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${isCurrent(step.id) ? "bg-terracotta text-white" : isActive(step.id) ? "bg-sage text-white" : "bg-beige text-slate-500"}`}>
              {step.icon}
            </div>
            <div className={`text-xs sm:text-sm font-medium transition ${isCurrent(step.id) ? "text-terracottaDark" : isActive(step.id) ? "text-sageDark" : "text-slate-400"}`}>
              {step.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-4 sm:w-8 h-0.5 ${isActive(step.id) ? "bg-sage" : "bg-beige"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}