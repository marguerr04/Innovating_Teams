// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'; // linea de index.css



// Importamos la App de Estudiante, martin guerrero lo hice sin .jsx del studentapp
import StudentApp from "./modules/student/pages/StudentApp";

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