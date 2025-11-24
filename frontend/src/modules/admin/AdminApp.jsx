import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeAdmin from './pages/HomeAdmin';
import StatsAdmin from './pages/StatsAdmin';
import ProfileAdmin from './pages/ProfileAdmin';
import AboutPage from './pages/AboutPage';
import PaginaTesteo from './pages/PaginaTesteo';
import CrearDesafiosPage from './pages/CrearDesafiosPage';

const AdminApp = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeAdmin />} />
      <Route path="/home" element={<HomeAdmin />} />
      <Route path="/stats" element={<StatsAdmin />} />
      <Route path="/profile" element={<ProfileAdmin />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/testeo" element={<PaginaTesteo />} />
      <Route path="/crear-desafios" element={<CrearDesafiosPage />} />
    </Routes>
  );
};

export default AdminApp;