// ============================================================================
// Calculadora: Neceser rectangular con cremallera
// ============================================================================

import type { PatternResult } from "../../types";
import type { PatternCalculator } from "../patternEngine";
import { createPiece, computeViewBox } from "../patternEngine";
import { cmToPx } from "../../utils/units";

export class CalcularNeceserRectangular implements PatternCalculator {
  id = "calcularNeceserRectangular";

  calculate(medidas: Record<string, number>, margenCosturaCm: number): PatternResult {
    const largo = Number(medidas["largoNeceser"] || 25);
    const alto = Number(medidas["altoNeceser"] || 18);
    const fondo = Number(medidas["fondoNeceser"] || 10);
    const anchoCremallera = Number(medidas["anchoCremallera"] || 2);
    const tieneAsa = Number(medidas["tieneAsa"] || 0) === 1;
    const largoAsa = Number(medidas["largoAsa"] || 30);

    const margenPx = cmToPx(margenCosturaCm);
    const piezas: any[] = [];
    const Lpx = cmToPx(largo);
    const Hpx = cmToPx(alto);
    const Fpx = cmToPx(fondo);
    const gap = 40;

    const pFrontal = createPiece("panel-frontal", "Panel frontal", gap, gap, Lpx, Hpx, margenPx);
    piezas.push(pFrontal);

    const pTrasero = createPiece("panel-trasero", "Panel trasero", gap + Lpx + gap, gap, Lpx, Hpx, margenPx);
    piezas.push(pTrasero);

    const pLateral1 = createPiece("lateral-1", "Lateral 1 (x2)", gap + Lpx * 2 + gap * 2, gap, Fpx, Hpx, margenPx);
    pLateral1.name = "Lateral (x2)";
    piezas.push(pLateral1);

    const pLateral2 = createPiece("lateral-2", "Lateral 2", gap + Lpx * 2 + gap * 2 + Fpx + gap, gap, Fpx, Hpx, margenPx);
    pLateral2.name = "Lateral (x2)";
    piezas.push(pLateral2);

    const pFondo = createPiece("fondo", "Fondo", gap, gap + Hpx + gap, Lpx, Fpx, margenPx);
    piezas.push(pFondo);

    let solapa: any = null;
    if (anchoCremallera > 0) {
      solapa = createPiece("solapa-cremallera", "Solapa cremallera", gap + Lpx + gap, gap + Hpx + gap, Lpx, cmToPx(anchoCremallera * 2), margenPx);
      piezas.push(solapa);
    }

    let asa: any = null;
    if (tieneAsa && largoAsa > 0) {
      asa = createPiece("asa", "Asa", gap + Lpx * 2 + gap * 2, gap + Hpx + gap, cmToPx(largoAsa), cmToPx(3), margenPx);
      asa.name = "Asa (x1 o x2)";
      piezas.push(asa);
    }

    const labels = piezas.map((p) => ({ text: p.name, x: p.labelPosition.x, y: p.labelPosition.y - 10 }));
    const grainlines = piezas.map((p) => p.grainline);
    const notches = piezas.flatMap((p) => [{ x: p.x, y: p.y, angle: 0 }, { x: p.x + p.width, y: p.y, angle: 0 }]);
    const viewBox = computeViewBox(piezas);
    const largoCremallera = largo;

    return {
      patternId: "neceser-rectangular",
      patternName: "Neceser rectangular con cremallera",
      category: "neceser",
      pieces: piezas as any[],
      labels,
      notches,
      grainlines: grainlines as any[],
      seamAllowanceCm: margenCosturaCm,
      instructions: ["Corta las piezas según el patrón generado.", "Une el panel frontal con los laterales.", "Coloca la cremallera en la abertura superior.", "Cierra el fondo y une los laterales.", "Remata los bordes con overlock o zigzag.", tieneAsa ? "Cose el asa en los extremos superiores." : "Plancha y revisa las costuras."],
      materials: ["Tela exterior", "Tela forro (opcional)", `Cremallera de ${largoCremallera.toFixed(0)} cm`, "Hilo", "Tijeras", "Alfileres"],
      fabricQty: `${((largo * 2 + alto * 2 + fondo * 2 + 20) / 100).toFixed(2)} m`,
      zipper: { largo: largoCremallera, tipo: "cremallera estándar" },
      measuresUsed: { largo, alto, fondo, anchoCremallera, tieneAsa: tieneAsa ? 1 : 0, largoAsa: tieneAsa ? largoAsa : 0, margenCostura: margenCosturaCm },
      viewBox,
      canvasWidth: Number(viewBox.split(" ")[2]),
      canvasHeight: Number(viewBox.split(" ")[3]),
    };
  }
}

export const calcularNeceserRectangular = new CalcularNeceserRectangular();