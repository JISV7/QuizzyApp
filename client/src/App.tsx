import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/features/landing/LandingPage';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<LandingPage />} />

          {/* Rutas Protegidas */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
