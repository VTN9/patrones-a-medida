// ============================================================================
// Componente: Renderizado del patrón en SVG con piezas, márgenes y marcas
// ============================================================================

import type { PatternResult } from "../../types";
import { cmToPx } from "../../utils/units";

interface SvgPatternProps {
  result: PatternResult;
  showSeamAllowance: boolean;
  seamAllowanceCm: number;
}

export function SvgPattern({ result, showSeamAllowance, seamAllowanceCm }: SvgPatternProps) {
  const { pieces, viewBox } = result;
  const marginPx = cmToPx(seamAllowanceCm);
  const showMargin = showSeamAllowance && seamAllowanceCm > 0;
  return (
    <svg className="svg-canvas w-full h-[600px] md:h-[700px]" viewBox={viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Patrón de ${result.patternName}`}>
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
        </marker>
      </defs>
      <rect x={0} y={0} width={Number(viewBox.split(" ")[2])} height={Number(viewBox.split(" ")[3])} fill="#fbfaf5" />
      {pieces.map((piece) => (
        <g key={piece.id} className="piece-group">
          <path d={piece.cutPath} fill="none" stroke="#1a1a1a" strokeWidth="2" className="cut-line" />
          {showMargin && piece.width > marginPx * 2 && piece.height > marginPx * 2 && (
            <rect
              x={piece.x + marginPx}
              y={piece.y + marginPx}
              width={piece.width - marginPx * 2}
              height={piece.height - marginPx * 2}
              fill="none"
              stroke="#7a8b6f"
              strokeWidth="1"
              strokeDasharray="4"
              className="seam-line"
            />
          )}
          <text x={piece.labelPosition.x} y={piece.labelPosition.y} textAnchor="middle" fontSize="11" fontWeight="600" fill="#7a8b6f" className="piece-label">{piece.name}</text>
          <line x1={piece.grainline.x1} y1={piece.grainline.y1} x2={piece.grainline.x2} y2={piece.grainline.y2} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" className="grainline" />
          {piece.notches.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={3} fill="#c96a4a" stroke="white" strokeWidth="1" />
          ))}
        </g>
      ))}
    </svg>
  );
}
