// ============================================================================
// App.tsx - Configuración de rutas y layout principal
// ============================================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { PatternSelector } from "./pages/PatternSelector";
import { Measurements } from "./pages/Measurements";
import { Preview } from "./pages/Preview";
import { HowToMeasure } from "./components/guides/HowToMeasure";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/selector" element={<PatternSelector />} />
        <Route path="/medidas" element={<Measurements />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/como-tomar-medidas" element={<HowToMeasure />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;