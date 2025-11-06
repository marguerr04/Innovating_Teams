// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentApp from "./modules/student/pages/StudentApp";
import PreLogin from "./pages/PreLogin"; // 



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
      </Routes>
    </BrowserRouter>
  );
}
