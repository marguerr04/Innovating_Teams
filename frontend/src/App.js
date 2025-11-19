import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProfesorLogin from "./pages/ProfesorLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentApp from "./modules/student/pages/StudentApp";
import AdminApp from "./modules/admin/AdminApp";
import PreLogin from "./pages/PreLogin";
import ProfessorApp from "./modules/profesor/ProfessorApp";
import TestAnimacion from './pages/Tests';
import DevImageUpload from './utils/dev-tools/DevImageUpload';
import VideoTest from './pages/VideoTest';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial: redirige a la selección de roles */}
        <Route path="/" element={<Navigate to="/prelogin" replace />} />
        <Route path="/prelogin" element={<PreLogin />} />

        {/* Flujos de login específicos */}
        <Route path="/login/profesor" element={<ProfesorLogin />} />
        <Route path="/login/administrador" element={<AdminLogin />} />

        {/* Rutas protegidas según el rol */}
        <Route path="/profesor/*" element={<ProfessorApp />} />
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Acceso directo para estudiantes (sin login) */}
        <Route path="/estudiante/*" element={<StudentApp />} />

        {/* Alias para botón Administrador en PreLogin */}
        <Route path="/administrador/*" element={<AdminApp />} />

        {/* Rutas de desarrollo/prueba */}
        <Route path="/test-animacion" element={<TestAnimacion />} />
        <Route path="/tests" element={<TestAnimacion />} />
        <Route path="/test-upload" element={<DevImageUpload />} />
        <Route path="/test-videos" element={<VideoTest />} />
      </Routes>
    </BrowserRouter>
  );
}