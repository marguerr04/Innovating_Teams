// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- CORRECCIÓN DE RUTA ---
// La ruta en tu archivo era incorrecta.
// Esta es la ruta correcta según tu estructura de carpetas.
import StudentApp from './modules/student/pages/StudentApp.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige la raíz a la app del estudiante */}
        <Route path="/" element={<Navigate to="/estudiante" replace />} />
        
        {/* Carga la app del estudiante */}
        <Route path="/estudiante" element={<StudentApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;