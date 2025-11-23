import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProfesorProvider } from "./components/ProfessorContext";
import ProfessorLayout from "./components/ProfessorLayout";
import HomeView from "./pages/HomeView";
import PerfilView from "./pages/PerfilView";
import GroupBuilderOptimized from "./pages/GroupBuilderOptimized";

export default function ProfessorApp() {
  return (
    <ProfesorProvider>
      <ProfessorLayout>
        <Routes>
          {/* Ruta por defecto redirige a home */}
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="/home" element={<HomeView />} />
          <Route path="/perfil" element={<PerfilView />} />
          <Route path="/grupos" element={<GroupBuilderOptimized />} />
        </Routes>
      </ProfessorLayout>
    </ProfesorProvider>
  );
}