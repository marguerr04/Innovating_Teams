import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProfesorProvider } from "./components/ProfessorContext";
import ProfessorLayout from "./components/ProfessorLayout";
import HomeView from "./pages/HomeView";
import PerfilView from "./pages/PerfilView";
import GroupBuilderOptimized from "./pages/GroupBuilderOptimized";
import WaitingRoomView from "./pages/WaitingRoomView";
import GameActiveView from "./pages/GameActiveView";

export default function ProfessorApp() {
  return (
    <ProfesorProvider>
      <Routes>
        {/* Rutas que NO usan ProfessorLayout (páginas independientes) */}
        <Route path="/waiting-room/:gamePin" element={<WaitingRoomView />} />
        <Route path="/game-active/:gamePin" element={<GameActiveView />} />
        
        {/* Rutas que SÍ usan ProfessorLayout */}
        <Route path="/*" element={
          <ProfessorLayout>
            <Routes>
              {/* Ruta por defecto redirige a home */}
              <Route path="/" element={<Navigate to="home" replace />} />
              <Route path="/home" element={<HomeView />} />
              <Route path="/perfil" element={<PerfilView />} />
              <Route path="/grupos" element={<GroupBuilderOptimized />} />
            </Routes>
          </ProfessorLayout>
        } />
      </Routes>
    </ProfesorProvider>
  );
}