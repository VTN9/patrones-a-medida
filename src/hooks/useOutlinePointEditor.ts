import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";
import type { Point } from "../types/digitizer";

interface UseOutlinePointEditorOptions {
  outline: Point[];
  setOutline: Dispatch<SetStateAction<Point[]>>;
  onClear: () => void;
}

export function useOutlinePointEditor({ outline, setOutline, onClear }: UseOutlinePointEditorOptions) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const addPoint = () => {
    if (outline.length < 3) return;
    let bestIndex = 0;
    let bestLength = -1;
    for (let index = 0; index < outline.length; index++) {
      const start = outline[index];
      const end = outline[(index + 1) % outline.length];
      const length = Math.hypot(end.x - start.x, end.y - start.y);
      if (length > bestLength) {
        bestLength = length;
        bestIndex = index;
      }
    }
    const start = outline[bestIndex];
    const end = outline[(bestIndex + 1) % outline.length];
    const point = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    setOutline((previous) => [
      ...previous.slice(0, bestIndex + 1),
      point,
      ...previous.slice(bestIndex + 1),
    ]);
    setSelectedIndex(bestIndex + 1);
  };

  const removePoint = useCallback(
    (index: number) => {
      if (outline.length <= 3) return;
      setOutline((previous) => previous.filter((_, pointIndex) => pointIndex !== index));
      setSelectedIndex(null);
    },
    [outline.length, setOutline]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      if (selectedIndex === null) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      removePoint(selectedIndex);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [removePoint, selectedIndex]);

  const clearOutline = () => {
    setOutline([]);
    setSelectedIndex(null);
    onClear();
  };

  return { selectedIndex, setSelectedIndex, addPoint, removePoint, clearOutline };
}
