// ============================================================================
// Calculadora: Falda base (recta, pieza delantera y trasera simplificadas)
// ============================================================================

import type { PatternResult } from "../../types";
import type { PatternCalculator } from "../patternEngine";
import { createPiece, computeViewBox } from "../patternEngine";
import { cmToPx } from "../../utils/units";

export class CalcularFaldaBase implements PatternCalculator {
  id = "calcularFaldaBase";

  calculate(medidas: Record<string, number>, margenCosturaCm: number): PatternResult {
    const cintura = Number(medidas["cintura"] || 72);
    const cadera = Number(medidas["cadera"] || 96);
    const largo = Number(medidas["largoTotal"] || 60);
    const holgura = Number(medidas["holgura"] || 4);

    const margenPx = cmToPx(margenCosturaCm);
    const gap = 40;
    const anchoPiezaPx = cmToPx((cadera + holgura) / 4);
    const largoPx = cmToPx(largo);

    const pDelantera = createPiece("falda-delantera", "Falda delantera", gap, gap, anchoPiezaPx, largoPx, margenPx);
    const pTrasera = createPiece("falda-trasera", "Falda trasera", gap + anchoPiezaPx + gap, gap, anchoPiezaPx, largoPx, margenPx);
    const piezas = [pDelantera, pTrasera];

    const labels = piezas.map((p) => ({ text: p.name, x: p.labelPosition.x, y: p.labelPosition.y - 10 }));
    const grainlines = piezas.map((p) => p.grainline);
    const notches = piezas.flatMap((p) => [{ x: p.x + p.width / 2, y: p.y, angle: 0 }, { x: p.x, y: p.y + largoPx / 2, angle: 90 }]);
    const viewBox = computeViewBox(piezas);
    const telaAnchoCm = (cadera + holgura) / 2 + 10;
    const telaLargoCm = largo + 10;

    return {
      patternId: "falda-base",
      patternName: "Falda base",
      category: "ropa",
      pieces: piezas as any[],
      labels,
      notches,
      grainlines: grainlines as any[],
      seamAllowanceCm: margenCosturaCm,
      instructions: ["1. Corta la pieza delantera y la trasera del patrón.", "2. Une las piezas por los costados, derecho sobre derecho.", "3. Coloca la cremallera en la costura central trasera o lateral.", "4. Realiza el dobladillo del bajo según el largo deseado.", "5. Termina la cintura con cinturilla o elástico según prefieras."],
      materials: ["Tela principal", "Cremallera (opcional)", "Hilo", "Tijeras", "Alfileres"],
      fabricQty: `${((telaLargoCm * 2 + telaAnchoCm) / 100).toFixed(2)} m`,
      measuresUsed: { cintura, cadera, largo, holgura, margenCostura: margenCosturaCm },
      viewBox,
      canvasWidth: Number(viewBox.split(" ")[2]),
      canvasHeight: Number(viewBox.split(" ")[3]),
    };
  }
}

export const calcularFaldaBase = new CalcularFaldaBase();