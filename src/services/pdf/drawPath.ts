import type jsPDF from "jspdf";

interface PathCommand {
  type: "M" | "L" | "Q" | "Z";
  values: number[];
}

function parsePath(d: string): PathCommand[] {
  const tokens = d.match(/[MLQZ]|-?\d*\.?\d+/gi) ?? [];
  const commands: PathCommand[] = [];
  let i = 0;
  while (i < tokens.length) {
    const raw = tokens[i++];
    const type = raw.toUpperCase() as PathCommand["type"];
    if (type === "Z") {
      commands.push({ type, values: [] });
      continue;
    }
    const count = type === "Q" ? 4 : 2;
    const values = tokens.slice(i, i + count).map(Number);
    i += count;
    if (values.length === count && values.every((v) => Number.isFinite(v))) {
      commands.push({ type, values });
    }
  }
  return commands;
}

export function drawSvgPath(
  doc: jsPDF,
  d: string,
  originX: number,
  originY: number,
  scale: number,
  offsetX: number,
  offsetY: number
): void {
  const commands = parsePath(d);
  if (commands.length === 0) return;
  const tx = (x: number) => (x - originX) * scale + offsetX;
  const ty = (y: number) => (y - originY) * scale + offsetY;
  let cx = 0;
  let cy = 0;
  let startX = 0;
  let startY = 0;
  for (const command of commands) {
    if (command.type === "M") {
      cx = command.values[0];
      cy = command.values[1];
      startX = cx;
      startY = cy;
      doc.moveTo(tx(cx), ty(cy));
    } else if (command.type === "L") {
      cx = command.values[0];
      cy = command.values[1];
      doc.lineTo(tx(cx), ty(cy));
    } else if (command.type === "Q") {
      const [qx, qy, ex, ey] = command.values;
      const c1x = cx + (2 / 3) * (qx - cx);
      const c1y = cy + (2 / 3) * (qy - cy);
      const c2x = ex + (2 / 3) * (qx - ex);
      const c2y = ey + (2 / 3) * (qy - ey);
      doc.curveTo(tx(c1x), ty(c1y), tx(c2x), ty(c2y), tx(ex), ty(ey));
      cx = ex;
      cy = ey;
    } else {
      doc.close();
      cx = startX;
      cy = startY;
    }
  }
  doc.stroke();
}
