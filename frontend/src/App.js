// src/App.js (El nuevo Ruteador)
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'; // linea de index.css



// Importamos la App de Estudiante
import StudentApp from "./modules/student/pages/StudentApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/estudiante" />} />
        <Route path="/estudiante" element={<StudentApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;