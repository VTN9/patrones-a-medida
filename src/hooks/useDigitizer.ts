import { useCallback, useState } from "react";
import type {
  Calibration,
  DigitizedPiece,
  DigitizerStage,
  NormalizedPoint,
  Point,
} from "../types/digitizer";
import { DEFAULT_CORNERS } from "../services/digitizer/defaults";
import { loadImage, warpPerspective } from "../services/digitizer/perspective";

export function useDigitizer() {
  const [stage, setStage] = useState<DigitizerStage>("upload");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [corners, setCorners] = useState<NormalizedPoint[]>(DEFAULT_CORNERS);
  const [warped, setWarped] = useState<HTMLCanvasElement | null>(null);
  const [calibration, setCalibration] = useState<Calibration | null>(null);
  const [outline, setOutline] = useState<Point[] | null>(null);
  const [pieces, setPieces] = useState<DigitizedPiece[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selectImage = useCallback(async (file: File) => {
    setError(null);
    try {
      const loaded = await loadImage(file);
      setImage(loaded);
      setCorners(DEFAULT_CORNERS);
      setWarped(null);
      setCalibration(null);
      setOutline(null);
      setStage("perspective");
    } catch {
      setError("No se pudo cargar la imagen. Prueba con otra foto.");
    }
  }, []);

  const rectify = useCallback(() => {
    if (!image) return;
    setError(null);
    setBusy(true);
    setTimeout(() => {
      try {
        const canvas = warpPerspective(image, corners);
        setWarped(canvas);
        setCalibration(null);
        setOutline(null);
        setStage("scale");
      } catch {
        setError("No se pudo enderezar la imagen. Revisa las cuatro esquinas.");
      } finally {
        setBusy(false);
      }
    }, 30);
  }, [image, corners]);

  const addPiece = useCallback((piece: DigitizedPiece) => {
    setPieces((previous) => [...previous, piece]);
    setOutline(null);
    setStage("result");
  }, []);

  const removePiece = useCallback((id: string) => {
    setPieces((previous) => previous.filter((piece) => piece.id !== id));
  }, []);

  const startAnother = useCallback(() => {
    setImage(null);
    setCorners(DEFAULT_CORNERS);
    setWarped(null);
    setCalibration(null);
    setOutline(null);
    setStage("upload");
    setError(null);
  }, []);

  const resetAll = useCallback(() => {
    setPieces([]);
    startAnother();
  }, [startAnother]);

  return {
    stage,
    image,
    corners,
    warped,
    calibration,
    outline,
    pieces,
    error,
    busy,
    setStage,
    setCorners,
    setCalibration,
    setOutline,
    setError,
    selectImage,
    rectify,
    addPiece,
    removePiece,
    startAnother,
    resetAll,
  };
}
