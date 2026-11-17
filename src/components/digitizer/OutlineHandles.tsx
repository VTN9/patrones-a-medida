import type { PointerEvent } from "react";
import type { Point } from "../../types/digitizer";

interface OutlineHandlesProps {
  outline: Point[];
  selectedIndex: number | null;
  dragIndex: number | null;
  canvasWidth: number;
  canvasHeight: number;
  toDisplay: (point: Point) => Point;
  onPointerDown: (index: number, event: PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (index: number, event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onRemovePoint: (index: number) => void;
  onSelect: (index: number) => void;
}

export function OutlineHandles({
  outline,
  selectedIndex,
  dragIndex,
  canvasWidth,
  canvasHeight,
  toDisplay,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onRemovePoint,
  onSelect,
}: OutlineHandlesProps) {
  if (outline.length <= 1) return null;
  return (
    <div className="pointer-events-none absolute inset-0">
      {outline.map((point, index) => {
        const { x, y } = toDisplay(point);
        const active = dragIndex === index || selectedIndex === index;
        return (
          <button
            key={index}
            type="button"
            aria-label={`Punto ${index + 1} del contorno`}
            aria-pressed={selectedIndex === index}
            aria-keyshortcuts="Delete Backspace"
            title="Arrastra para mover; doble clic o Supr para quitar"
            onFocus={() => onSelect(index)}
            onPointerDown={(event) => onPointerDown(index, event)}
            onPointerMove={(event) => onPointerMove(index, event)}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={() => onRemovePoint(index)}
            style={{ left: `${(x / canvasWidth) * 100}%`, top: `${(y / canvasHeight) * 100}%` }}
            className={`pointer-events-auto absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-terracotta shadow-sm transition after:absolute after:-inset-2 after:content-[''] focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1 ${
              active
                ? "cursor-grabbing bg-terracotta ring-2 ring-terracotta ring-offset-1"
                : "cursor-grab bg-white hover:bg-terracotta/10"
            }`}
          />
        );
      })}
    </div>
  );
}
