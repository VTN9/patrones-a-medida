// ============================================================================
// Página: Cómo tomar las medidas
// ============================================================================

import { Navbar } from "../components/layout/Navbar";
import { HowToMeasure } from "../components/guides/HowToMeasure";

export function ComoTomarMedidas() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <HowToMeasure />
        </div>
      </div>
    </div>
  );
}

export default ComoTomarMedidas;