// File: frontend/src/modules/admin/AdminApp.jsx

import React from 'react';
// *** CORRECCIÓN: Se elimina 'BrowserRouter' de la importación. ***
import { Routes, Route, Navigate } from 'react-router-dom'; 

import AdminLayout from './components/AdminLayout';
import HomeAdmin from './pages/HomeAdmin'; 
import StatsAdmin from './pages/StatsAdmin';
import ProfileAdmin from './pages/ProfileAdmin';
import ChallengeAdmin from './pages/ChallengeAdmin'; 

const AdminApp = () => {
    return (
        // *** CAMBIO CLAVE: Se elimina el componente <BrowserRouter> para evitar el error de anidamiento. ***
        <AdminLayout>
            <Routes>
                {/* Redirige la ruta raíz ('/') inmediatamente a /stats. */}
                <Route path="/" element={<Navigate replace to="/stats" />} /> 
                
                {/* Rutas limpias internas */}
                <Route path="/stats" element={<StatsAdmin />} /> 
                <Route path="/challenges" element={<ChallengeAdmin />} />
                <Route path="/profile" element={<ProfileAdmin />} /> 
                
                <Route path="*" element={<div>Error 404: Página no encontrada</div>} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminApp;