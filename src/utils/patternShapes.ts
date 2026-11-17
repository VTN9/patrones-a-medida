import type { Piece } from "../types";

export function faldaSeamPath(piece: Piece, margenPx: number): string {
  if (!piece.shape || piece.shape.kind !== "falda") return piece.seamPath ?? "";
  const { x, y, width: hipPx, height: largoPx } = piece;
  const { waistPx, hipDepthPx } = piece.shape;
  const sy = y + margenPx;
  const hemY = Math.max(sy, y + largoPx - margenPx);
  const sw = Math.max(0, waistPx - margenPx);
  const sh = Math.max(0, hipPx - margenPx);
  return `M ${x} ${sy} L ${x + sw} ${sy} Q ${x + sh} ${sy} ${x + sh} ${y + hipDepthPx} L ${x + sh} ${hemY} L ${x} ${hemY} Z`;
}
