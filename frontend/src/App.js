// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentApp from "./modules/student/pages/StudentApp";
import AdminApp from "./modules/admin/AdminApp";
import PreLogin from "./pages/PreLogin";
import ProfessorApp from "./modules/profesor/ProfessorApp";
import TestAnimacion from './pages/Tests';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial: redirige al login */}
        <Route path="/" element={<Navigate to="/prelogin" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/prelogin" element={<PreLogin />} />

        <Route path="/estudiante/*" element={<StudentApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/profesor/*" element={<ProfessorApp />} />

  {/* Rutas de prueba para animaciones */}
  <Route path="/test-animacion" element={<TestAnimacion />} />
  <Route path="/tests" element={<TestAnimacion />} />

      </Routes>
    </BrowserRouter>
  );
}
