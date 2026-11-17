import jsPDF from "jspdf";
import type { DigitizedPiece, Point } from "../../types/digitizer";
import { formatDate } from "../../utils/format";
import { bbox, offsetPolygon } from "./geometry";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 15;
const PRINT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
const PRINT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2 - 20;
const OVERLAP_MM = 10;
const MM_PER_CM = 10;

export function exportDigitizedPdf(pieces: DigitizedPiece[], filename?: string): void {
  if (pieces.length === 0) return;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  addCoverPage(doc, pieces);
  for (const piece of pieces) addPiecePages(doc, piece);
  doc.save(filename || `patron_digitalizado_${formatDate()}.pdf`);
}

function addCoverPage(doc: jsPDF, pieces: DigitizedPiece[]): void {
  doc.setFillColor(251, 250, 245);
  doc.rect(0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(201, 106, 74);
  doc.text("Patrón digitalizado", A4_WIDTH_MM / 2, 55, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(111, 135, 89);
  doc.text("Generado desde una foto de tu patrón en papel", A4_WIDTH_MM / 2, 68, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Fecha: ${formatDate()}`, A4_WIDTH_MM / 2, 80, { align: "center" });

  let y = 100;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Piezas incluidas", MARGIN_MM, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (const piece of pieces) {
    const line = `${piece.name}: ${piece.widthCm.toFixed(1)} × ${piece.heightCm.toFixed(1)} cm · margen ${piece.marginCm.toFixed(1)} cm`;
    doc.text(`• ${line}`, MARGIN_MM, y);
    y += 6;
  }

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Impresión y montaje", MARGIN_MM, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const tips = [
    "Imprime al 100% de escala, sin ajustar a página.",
    "Comprueba la regla de 10 cm de cada hoja.",
    "Recorta el borde de la hoja y une las páginas por las marcas de esquina.",
    "Las hojas contiguas comparten una solapa de 10 mm.",
    "La línea negra continua es la línea de corte.",
    "La línea verde discontinua es la línea de costura.",
    "Revisa el contorno antes de cortar: la digitalización automática puede necesitar ajustes.",
  ];
  for (const tip of tips) {
    const lines = doc.splitTextToSize(`• ${tip}`, A4_WIDTH_MM - MARGIN_MM * 2);
    for (const line of lines) {
      doc.text(line, MARGIN_MM, y);
      y += 5;
    }
  }
}

function addPiecePages(doc: jsPDF, piece: DigitizedPiece): void {
  const cutPoints = piece.marginCm > 0 ? offsetPolygon(piece.pointsCm, piece.marginCm) : piece.pointsCm;
  if (cutPoints.length < 3) return;
  const box = bbox(cutPoints);
  const widthMm = box.width * MM_PER_CM;
  const heightMm = box.height * MM_PER_CM;
  const stepWidth = PRINT_WIDTH_MM - OVERLAP_MM;
  const stepHeight = PRINT_HEIGHT_MM - OVERLAP_MM;
  const columns = Math.max(1, Math.ceil((widthMm - OVERLAP_MM) / stepWidth));
  const rows = Math.max(1, Math.ceil((heightMm - OVERLAP_MM) / stepHeight));

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      doc.addPage();
      const offsetX = MARGIN_MM - box.minX * MM_PER_CM - column * stepWidth;
      const offsetY = MARGIN_MM - box.minY * MM_PER_CM - row * stepHeight;
      doc.setDrawColor(225, 225, 225);
      doc.setLineWidth(0.2);
      doc.rect(MARGIN_MM, MARGIN_MM, PRINT_WIDTH_MM, PRINT_HEIGHT_MM, "S");
      if (piece.marginCm > 0) {
        drawPolygon(doc, piece.pointsCm, offsetX, offsetY, [122, 139, 111], [1.5, 1.5], 0.3);
      }
      drawPolygon(doc, cutPoints, offsetX, offsetY, [20, 20, 20], [], 0.5);
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `${piece.name} · fila ${row + 1}/${rows} · columna ${column + 1}/${columns}`,
        MARGIN_MM,
        10
      );
      addCornerMarks(doc);
      addRuler(doc);
      doc.text(`${doc.getNumberOfPages()}`, A4_WIDTH_MM - MARGIN_MM, A4_HEIGHT_MM - 6, { align: "right" });
    }
  }
}

function drawPolygon(
  doc: jsPDF,
  points: Point[],
  offsetX: number,
  offsetY: number,
  color: [number, number, number],
  dash: number[],
  width: number
): void {
  if (points.length < 3) return;
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(width);
  doc.setLineDashPattern(dash, 0);
  doc.moveTo(points[0].x * MM_PER_CM + offsetX, points[0].y * MM_PER_CM + offsetY);
  for (let i = 1; i < points.length; i++) {
    doc.lineTo(points[i].x * MM_PER_CM + offsetX, points[i].y * MM_PER_CM + offsetY);
  }
  doc.close();
  doc.stroke();
  doc.setLineDashPattern([], 0);
}

function addCornerMarks(doc: jsPDF): void {
  const marks = [
    [MARGIN_MM, MARGIN_MM],
    [A4_WIDTH_MM - MARGIN_MM, MARGIN_MM],
    [MARGIN_MM, MARGIN_MM + PRINT_HEIGHT_MM],
    [A4_WIDTH_MM - MARGIN_MM, MARGIN_MM + PRINT_HEIGHT_MM],
  ];
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.2);
  for (const [x, y] of marks) {
    doc.line(x - 3, y, x + 3, y);
    doc.line(x, y - 3, x, y + 3);
  }
}

function addRuler(doc: jsPDF): void {
  const y = A4_HEIGHT_MM - 18;
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_MM, y, MARGIN_MM + 100, y);
  for (let i = 0; i <= 10; i++) {
    const x = MARGIN_MM + i * 10;
    doc.line(x, y - 2, x, y + 2);
  }
  doc.setFontSize(7);
  doc.setTextColor(60, 60, 60);
  doc.text("10 cm", MARGIN_MM + 104, y + 1);
}
