import { Navbar } from "../components/layout/Navbar";
import { StepIndicator } from "../components/digitizer/StepIndicator";
import { UploadStep } from "../components/digitizer/UploadStep";
import { PerspectiveStep } from "../components/digitizer/PerspectiveStep";
import { ScaleStep } from "../components/digitizer/ScaleStep";
import { OutlineStep } from "../components/digitizer/OutlineStep";
import { ResultStep } from "../components/digitizer/ResultStep";
import { useDigitizer } from "../hooks/useDigitizer";
import { createDigitizedPiece } from "../services/digitizer/createPiece";
import { exportDigitizedPdf } from "../services/digitizer/digitizerPdf";

export function Digitizer() {
  const {
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
    selectImage,
    rectify,
    addPiece,
    removePiece,
    startAnother,
  } = useDigitizer();

  const handleAddPiece = (name: string, marginCm: number) => {
    if (!outline || !calibration) return;
    addPiece(createDigitizedPiece(outline, calibration.pxPerCm, name, marginCm));
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Digitalizar un patrón en papel</h1>
              <p className="text-sm text-slate-600">
                Sube una foto, corrige la perspectiva, calibra la escala y descarga un PDF a tamaño real.
              </p>
            </div>
            <StepIndicator stage={stage} />
          </div>

          {error && stage !== "upload" && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {stage === "upload" && (
            <UploadStep
              onSelect={selectImage}
              piecesCount={pieces.length}
              onExport={() => exportDigitizedPdf(pieces)}
              onViewPieces={() => setStage("result")}
              error={error}
            />
          )}

          {stage === "perspective" && image && (
            <PerspectiveStep
              image={image}
              corners={corners}
              busy={busy}
              onCornersChange={setCorners}
              onNext={rectify}
              onBack={startAnother}
            />
          )}

          {stage === "scale" && warped && (
            <ScaleStep
              canvas={warped}
              initialCalibration={calibration}
              onCalibrated={(value) => {
                setCalibration(value);
                setStage("outline");
              }}
              onBack={() => setStage("perspective")}
            />
          )}

          {stage === "outline" && warped && calibration && (
            <OutlineStep
              canvas={warped}
              calibration={calibration}
              initialOutline={outline}
              onOutline={(points) => {
                setOutline(points);
                setStage("result");
              }}
              onBack={() => setStage("scale")}
            />
          )}

          {stage === "result" && (
            <ResultStep
              outline={outline}
              calibration={calibration}
              pieces={pieces}
              onAddPiece={handleAddPiece}
              onRemovePiece={removePiece}
              onExport={() => exportDigitizedPdf(pieces)}
              onAnother={startAnother}
              onBack={() => setStage("outline")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Digitizer;
