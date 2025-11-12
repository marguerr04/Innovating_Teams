// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
<<<<<<< HEAD
=======
import AdminLogin from "./pages/AdminLogin";
>>>>>>> avanceAlejandro/rama_post_certamen_1
import StudentApp from "./modules/student/pages/StudentApp";
import AdminApp from "./modules/admin/AdminApp";
import PreLogin from "./pages/PreLogin";
import ProfessorApp from "./modules/profesor/ProfessorApp";
<<<<<<< HEAD
=======
import TestAnimacion from './pages/Tests';
// NOTE: Added /administrador route alias for new PreLogin button

>>>>>>> avanceAlejandro/rama_post_certamen_1

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial: redirige al login */}
        <Route path="/" element={<Navigate to="/prelogin" replace />} />
<<<<<<< HEAD
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/prelogin" element={<PreLogin />} />

        <Route path="/estudiante/*" element={<StudentApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/profesor/*" element={<ProfessorApp />} />
=======
  <Route path="/login" element={<Login />} />
  <Route path="/auth" element={<Login />} />
  {/* Flujos de login específicos */}
  <Route path="/login/profesor" element={<Login role="profesor" redirectTo="/profesor" />} />
  <Route path="/login/administrador" element={<AdminLogin />} />
        <Route path="/prelogin" element={<PreLogin />} />

        <Route path="/estudiante/*" element={<StudentApp />} />
  <Route path="/admin/*" element={<AdminApp />} />
  {/* Alias para botón Administrador en PreLogin */}
  <Route path="/administrador/*" element={<AdminApp />} />
        <Route path="/profesor/*" element={<ProfessorApp />} />

  {/* Rutas de prueba para animaciones */}
  <Route path="/test-animacion" element={<TestAnimacion />} />
  <Route path="/tests" element={<TestAnimacion />} />

>>>>>>> avanceAlejandro/rama_post_certamen_1
      </Routes>
    </BrowserRouter>
  );
}
