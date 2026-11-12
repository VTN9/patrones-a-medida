// ============================================================================
// Registro de calculadoras de patrones
// Para añadir un nuevo patrón: crear el archivo de calculadora, importarlo aquí
// y registrarlo con registerCalculator.
// ============================================================================

import { registerCalculator } from "../patternEngine";
import { calcularNeceserRectangular } from "./calcularNeceserRectangular";
import { calcularFaldaBase } from "./calcularFaldaBase";

registerCalculator(calcularNeceserRectangular);
registerCalculator(calcularFaldaBase);