// ============================================================================
// Componente: Botones de exportación (PDF, SVG, PNG, copiar, imprimir)
// ============================================================================

import { useRef } from "react";
import { FileText, Image, Download, Clipboard } from "lucide-react";
import type { PatternResult } from "../../types";
import { useExport } from "../../hooks/useExport";

interface ExportButtonsProps {
  result: PatternResult;
  svgContainer: HTMLElement;
  svgElement: SVGElement;
  instructions: string[];
}

export function ExportButtons({ result, svgContainer, svgElement, instructions }: ExportButtonsProps) {
  const svgRef = useRef<SVGElement>(svgElement);
  const { exportSVG, exportPNG, exportPDF, copyInstructions } = useExport();

  const handleDownloadPDF = () => { exportPDF(result, `patron_${result.patternId}.pdf`); };
  const handleDownloadSVG = () => { exportSVG(svgRef.current!, result, `patron_${result.patternId}.svg`); };
  const handleDownloadPNG = () => { exportPNG(svgContainer, `patron_${result.patternId}.png`); };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button onClick={handleDownloadPDF} className="px-5 py-2.5 rounded-lg bg-terracotta text-white text-sm font-medium hover:bg-terracottaDark transition flex items-center gap-2 shadow">
        <Download size={16} /> PDF A4
      </button>
      <button onClick={handleDownloadSVG} className="px-5 py-2.5 rounded-lg bg-white border border-beige text-slate-700 text-sm font-medium hover:bg-beige transition flex items-center gap-2">
        <FileText size={16} /> SVG
      </button>
      <button onClick={handleDownloadPNG} className="px-5 py-2.5 rounded-lg bg-white border border-beige text-slate-700 text-sm font-medium hover:bg-beige transition flex items-center gap-2">
        <Image size={16} /> PNG
      </button>
      <button onClick={() => copyInstructions(instructions)} className="px-5 py-2.5 rounded-lg bg-white border border-beige text-slate-700 text-sm font-medium hover:bg-beige transition flex items-center gap-2">
        <Clipboard size={16} /> Copiar instrucciones
      </button>
    </div>
  );
}