// ============================================================================
// Hook: exportación de patrones (SVG, PNG, PDF, copiar, imprimir)
// ============================================================================

import { useCallback } from "react";
import type { PatternResult } from "../types";
import { exportPatternToPDF } from "../services/pdf/exportPdf";

export function useExport() {
  const exportSVG = useCallback(
    (svgElement: SVGElement, result: PatternResult, filename?: string) => {
      const svg = svgElement.cloneNode(true) as SVGElement;
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);
      source = source.replace(/>/g, ">\n");
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `${result.patternId}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    []
  );

  const exportPNG = useCallback(
    (container: HTMLElement, filename?: string) => {
      import("html-to-image").then(({ toPng }) => {
        toPng(container).then((dataUrl) => {
          const link = document.createElement("a");
          link.download = filename || "patron.png";
          link.href = dataUrl;
          link.click();
        });
      });
    },
    []
  );

  const exportPDF = useCallback(
    (result: PatternResult, filename?: string) => {
      exportPatternToPDF(result, filename);
    },
    []
  );

  const copyInstructions = useCallback((instructions: string[]) => {
    const text = instructions.join("\n");
    navigator.clipboard.writeText(text);
  }, []);

  const printPattern = useCallback(() => {
    window.print();
  }, []);

  return {
    exportSVG,
    exportPNG,
    exportPDF,
    copyInstructions,
    printPattern,
  };
}