// ============================================================================
// Componente: Contenedor con zoom y desplazamiento (pan) para el SVG
// ============================================================================

import { useState, useCallback, useRef } from "react";
import { ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react";

interface ZoomPanProps {
  children: React.ReactElement;
  className?: string;
}

export function ZoomPan({ children, className }: ZoomPanProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.25, 3)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.25, 0.5)), []);
  const resetZoom = useCallback(() => { setScale(1); setPosition({ x: 0, y: 0 }); }, []);
  const toggleFullscreen = useCallback(() => setIsFullscreen((f) => !f), []);

  const onMouseDown = useCallback((e: React.MouseEvent) => { setIsPanning(true); lastPos.current = { x: e.clientX, y: e.clientY }; }, []);
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPosition((p) => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, [isPanning]);
  const onMouseUp = useCallback(() => setIsPanning(false), []);
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const direction = delta > 0 ? 0.1 : -0.1;
    setScale((s) => { const newScale = Math.min(Math.max(s + direction, 0.5), 3); return newScale; });
  }, []);

  const containerStyle = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    transformOrigin: "0 0",
    cursor: isPanning ? "grabbing" : "grab",
  } as React.CSSProperties;

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-cream p-4" : "relative w-full"} overflow-hidden rounded-lg border border-beige bg-cream ${className ?? ""}`} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onWheel={onWheel} style={{ touchAction: "none" }}>
      <div style={containerStyle}>{children}</div>
      <div className="absolute top-3 right-3 flex gap-2 bg-white/90 backdrop-blur p-2 rounded-lg border border-beige shadow-sm z-10">
        <button onClick={zoomOut} className="p-1.5 hover:bg-beige rounded text-slate-600" title="Alejar"><ZoomOut size={16} /></button>
        <button onClick={resetZoom} className="p-1.5 hover:bg-beige rounded text-slate-600" title="Restablecer"><Maximize size={16} /></button>
        <button onClick={zoomIn} className="p-1.5 hover:bg-beige rounded text-slate-600" title="Acercar"><ZoomIn size={16} /></button>
        <button onClick={toggleFullscreen} className="p-1.5 hover:bg-beige rounded text-slate-600" title="Pantalla completa">{isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}</button>
      </div>
    </div>
  );
}