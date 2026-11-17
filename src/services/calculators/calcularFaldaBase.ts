// ============================================================================
// Calculadora: Falda base con cintura, cadera y curva de costado
// ============================================================================

import type { PatternResult, Piece } from "../../types";
import type { PatternCalculator } from "../patternEngine";
import { computeViewBox } from "../patternEngine";
import { cmToPx, round1 } from "../../utils/units";
import { faldaSeamPath } from "../../utils/patternShapes";

function crearPiezaFalda(
  id: string,
  nombre: string,
  x: number,
  y: number,
  waistPx: number,
  hipPx: number,
  hipDepthPx: number,
  largoPx: number,
  margenPx: number
): Piece {
  const cutPath = `M ${x} ${y} L ${x + waistPx} ${y} Q ${x + hipPx} ${y} ${x + hipPx} ${y + hipDepthPx} L ${x + hipPx} ${y + largoPx} L ${x} ${y + largoPx} Z`;
  const piece: Piece = {
    id,
    name: nombre,
    cutPath,
    seamPath: "",
    shape: { kind: "falda", waistPx, hipDepthPx },
    labelPosition: { x: x + hipPx / 2, y: y + largoPx / 2 },
    grainline: {
      x1: x + hipPx / 2,
      y1: y + Math.max(margenPx + 6, largoPx * 0.15),
      x2: x + hipPx / 2,
      y2: y + Math.max(largoPx * 0.85, largoPx - margenPx - 6),
    },
    notches: [
      { x: x + waistPx / 2, y, angle: 0 },
      { x: x + hipPx, y: y + hipDepthPx, angle: 0 },
      { x: x + hipPx / 2, y: y + largoPx, angle: 0 },
    ],
    x,
    y,
    width: hipPx,
    height: largoPx,
  };
  piece.seamPath = faldaSeamPath(piece, margenPx);
  return piece;
}

export class CalcularFaldaBase implements PatternCalculator {
  id = "calcularFaldaBase";

  calculate(medidas: Record<string, number>, margenCosturaCm: number): PatternResult {
    const cintura = Number(medidas["cintura"] || 72);
    const cadera = Number(medidas["cadera"] || 96);
    const largo = Number(medidas["largoTotal"] || medidas["largo"] || 60);
    const holgura = Number(medidas["holgura"] || 4);

    const hipQuarterCm = (cadera + holgura) / 4;
    const waistQuarterCm = Math.max(1, Math.min(cintura / 4, hipQuarterCm));
    const hipDepthCm = Math.min(Math.max(largo * 0.35, 6), 20, Math.max(largo * 0.9, 1));

    const margenPx = cmToPx(margenCosturaCm);
    const gap = 40;
    const waistPx = cmToPx(waistQuarterCm);
    const hipPx = cmToPx(hipQuarterCm);
    const hipDepthPx = cmToPx(hipDepthCm);
    const largoPx = cmToPx(largo);

    const pDelantera = crearPiezaFalda(
      "falda-delantera",
      "Delantera · al doblez",
      gap,
      gap,
      waistPx,
      hipPx,
      hipDepthPx,
      largoPx,
      margenPx
    );
    const pTrasera = crearPiezaFalda(
      "falda-trasera",
      "Trasera · al doblez",
      gap + hipPx + gap,
      gap,
      waistPx,
      hipPx,
      hipDepthPx,
      largoPx,
      margenPx
    );
    const piezas = [pDelantera, pTrasera];

    const labels = piezas.map((p) => ({ text: p.name, x: p.labelPosition.x, y: p.labelPosition.y - 10 }));
    const grainlines = piezas.map((p) => p.grainline);
    const notches = piezas.flatMap((p) => p.notches);
    const viewBox = computeViewBox(piezas);
    const telaAnchoCm = (cadera + holgura) / 2 + 10;
    const telaLargoCm = largo + 10;

    return {
      patternId: "falda-base",
      patternName: "Falda base",
      category: "ropa",
      pieces: piezas,
      labels,
      notches,
      grainlines,
      seamAllowanceCm: margenCosturaCm,
      instructions: [
        "Coloca las piezas al doblez de la tela y corta la delantera y la trasera.",
        "Respeta la curva de cadera al unir los costados, derecho sobre derecho.",
        "Cose la cremallera en la costura lateral o trasera.",
        "Realiza el dobladillo del bajo según el largo deseado.",
        "Termina la cintura con cinturilla o elástico según prefieras.",
      ],
      materials: ["Tela principal", "Cremallera (opcional)", "Hilo", "Tijeras", "Alfileres"],
      fabricQty: `${((telaLargoCm * 2 + telaAnchoCm) / 100).toFixed(2)} m`,
      measuresUsed: { cintura, cadera, largo, holgura, alturaCadera: round1(hipDepthCm), margenCostura: margenCosturaCm },
      viewBox,
      canvasWidth: Number(viewBox.split(" ")[2]),
      canvasHeight: Number(viewBox.split(" ")[3]),
    };
  }
}

export const calcularFaldaBase = new CalcularFaldaBase();
