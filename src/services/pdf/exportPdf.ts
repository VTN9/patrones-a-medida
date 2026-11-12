// ============================================================================
// Exportación a PDF con jsPDF (A4, varias páginas, regla de 10 cm, ensamblaje)
// ============================================================================

import jsPDF from "jspdf";
import type { PatternResult } from "../../types";
import { formatDate } from "../../utils/format";

const MM_PER_CM = 10;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 15;
const PX_TO_MM = 2.5;

export function exportPatternToPDF(result: PatternResult, filename?: string): void {
  const { pieces, patternName, category, measuresUsed, seamAllowanceCm, instructions } = result;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  addCoverPage(doc, patternName, category, measuresUsed, seamAllowanceCm);
  addPatternPages(doc, pieces, seamAllowanceCm);
  addInstructionsPage(doc, instructions, measuresUsed);
  const name = filename || `patron_${patternName.replace(/\s+/g, "_")}_${formatDate()}.pdf`;
  doc.save(name);
}

function addCoverPage(doc: jsPDF, patternName: string, category: string, measuresUsed: Record<string, number>, seamAllowanceCm: number): void {
  const pageW = A4_WIDTH_MM;
  const pageH = A4_HEIGHT_MM;
  doc.setFillColor(251, 250, 245);
  doc.rect(0, 0, pageW, pageH, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(26); doc.setTextColor(201, 106, 74);
  doc.text("Patrones a Medida", pageW / 2, 60, { align: "center" });
  doc.setFontSize(14); doc.setFont("helvetica", "normal"); doc.setTextColor(122, 139, 111);
  doc.text("Patrón generado para imprimir en casa", pageW / 2, 80, { align: "center" });
  doc.setFontSize(12); doc.setTextColor(60, 60, 60);
  doc.text(`Patrón: ${patternName}`, pageW / 2, 110, { align: "center" });
  doc.text(`Categoría: ${category === "ropa" ? "Ropa" : "Neceser"}`, pageW / 2, 125, { align: "center" });
  doc.text(`Fecha: ${formatDate()}`, pageW / 2, 140, { align: "center" });
  doc.text(`Margen de costura: ${seamAllowanceCm} cm`, pageW / 2, 155, { align: "center" });
  doc.setFontSize(11);
  doc.text("Medidas utilizadas:", MARGIN_MM, 185);
  let y = 195;
  for (const [key, value] of Object.entries(measuresUsed)) {
    doc.text(`• ${key}: ${value.toFixed(1)} cm`, MARGIN_MM, y); y += 7;
  }
  doc.setDrawColor(60, 60, 60); doc.setLineWidth(0.5);
  doc.line(MARGIN_MM, pageH - 30, MARGIN_MM + 100, pageH - 30);
  doc.setFontSize(10);
  doc.text("Regla de comprobación: 10 cm", MARGIN_MM, pageH - 22);
  doc.text("Imprime al 100% de escala (sin ajustar a página).", MARGIN_MM, pageH - 15);
}

function addPatternPages(doc: jsPDF, pieces: any[], margenCosturaCm: number): void {
  const pageW = A4_WIDTH_MM; const pageH = A4_HEIGHT_MM;
  let currentX = MARGIN_MM; let currentY = MARGIN_MM;
  for (const piece of pieces) {
    const wMm = piece.width * PX_TO_MM; const hMm = piece.height * PX_TO_MM;
    if (currentX + wMm > pageW - MARGIN_MM) { currentX = MARGIN_MM; currentY += hMm + 20; }
    if (currentY + hMm > pageH - MARGIN_MM) { doc.addPage(); currentX = MARGIN_MM; currentY = MARGIN_MM; }
    doc.setDrawColor(20, 20, 20); doc.setLineWidth(0.7);
    doc.rect(currentX, currentY, wMm, hMm, "S");
    const seamOffsetMm = margenCosturaCm * MM_PER_CM;
    if (wMm > seamOffsetMm * 2 && hMm > seamOffsetMm * 2) {
      doc.setDrawColor(122, 139, 111); doc.setLineWidth(0.3);
      doc.rect(currentX + seamOffsetMm, currentY + seamOffsetMm, wMm - seamOffsetMm * 2, hMm - seamOffsetMm * 2, "S");
    }
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(122, 139, 111);
    doc.text(piece.name, currentX + wMm / 2, currentY + hMm / 2, { align: "center" });
    doc.setDrawColor(201, 106, 74); doc.setLineWidth(0.5);
    doc.line(currentX - 4, currentY - 4, currentX + 4, currentY + 4);
    doc.line(currentX - 4, currentY + 4, currentX + 4, currentY - 4);
    currentX += wMm + 15;
  }
}

function addInstructionsPage(doc: jsPDF, instructions: string[], measuresUsed: Record<string, number>): void {
  const pageW = A4_WIDTH_MM; const pageH = A4_HEIGHT_MM;
  doc.setFillColor(251, 250, 245); doc.rect(0, 0, pageW, pageH, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.setTextColor(201, 106, 74);
  doc.text("Guía de costura", pageW / 2, 50, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(60, 60, 60);
  let y = 80;
  doc.text("Instrucciones de confección:", MARGIN_MM, y); y += 10;
  for (const paso of instructions) {
    const lineas = doc.splitTextToSize(paso, pageW - MARGIN_MM * 2);
    for (const linea of lineas) { doc.text("• " + linea, MARGIN_MM, y); y += 6; }
    y += 4;
  }
  y += 10;
  doc.text("Medidas utilizadas:", MARGIN_MM, y); y += 7;
  for (const [key, value] of Object.entries(measuresUsed)) {
    doc.text(`• ${key}: ${value.toFixed(1)} cm`, MARGIN_MM, y); y += 6;
  }
}