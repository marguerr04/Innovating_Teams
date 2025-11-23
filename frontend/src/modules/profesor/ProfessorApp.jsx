// src/modules/profesor/ProfessorApp.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProfesorProvider } from "./components/ProfessorContext";
import ProfessorLayout from "./components/ProfessorLayout";
import HomeView from "./pages/HomeView";
import CrearJuegoView from "./pages/CrearJuegoView";
import PerfilView from "./pages/PerfilView";
import GroupBuilder from "./pages/GroupBuilder";
import GroupBuilderNew from "./pages/GroupBuilderNew";
import GroupBuilderVisual from "./pages/GroupBuilderVisual";

export default function ProfessorApp() {
  return (
    <ProfesorProvider>
      <ProfessorLayout>
        <Routes>
          {/* Ruta por defecto redirige a home */}
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="/home" element={<HomeView />} />
          <Route path="/crear" element={<CrearJuegoView />} />
          <Route path="/perfil" element={<PerfilView />} />
          <Route path="/grupos-new" element={<GroupBuilderNew />} />
          <Route path="/grupos-visual" element={<GroupBuilderVisual />} />
          <Route path="/grupos-legacy" element={<GroupBuilder />} />
        </Routes>
      </ProfessorLayout>
    </ProfesorProvider>
  );
}