// frontend/src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 1. Importa tu LAYOUT
import AdminLayout from "./PagesMartinGuerr/Components/AdminLayout";

// 2. Importa las páginas
import HomeAdmin from "./PagesMartinGuerr/Pages/HomeAdmin";
import ProfileAdmin from "./PagesMartinGuerr/Pages/ProfileAdmin";
import StatsAdmin from "./PagesMartinGuerr/Pages/StatsAdmin";
import AboutPage from "./PagesMartinGuerr/Pages/AboutPage";
import PaginaTesteo from './PagesMartinGuerr/Pages/PaginaTesteo';




function App() {
  return (
    <Router>
      <Routes>

        {/* --- 3. RUTAS DE ADMINISTRACIÓN ANIDADAS --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<HomeAdmin />} /> 
          <Route path="profile" element={<ProfileAdmin />} /> 
          <Route path="stats" element={<StatsAdmin />} /> 
        </Route>

        {/* --- RUTAS PÚBLICAS (EJEMPLO) --- */}
        <Route path="/about" element={<AboutPage />} />

        {/* --- Redirecciones --- */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />


        {/* ---Rutas para testar API --- */}
        <Route path="/testeo-api" element={<PaginaTesteo />} />


      </Routes>
    </Router>
  );
}

export default App;