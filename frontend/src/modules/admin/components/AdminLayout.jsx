import React, { useState } from 'react';
import SidebarAdmin from './SidebarAdmin';
// Asegúrate de importar cualquier icono de menú (ej. FaBars)

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false); 
    const primaryColor = '#2E5E8C'; // Color de fondo del Sidebar y Header
    // Color de acento para texto o botones: #00B8A9

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
            
            {/* 1. Sidebar (pasa el estado) */}
            <SidebarAdmin isOpen={sidebarOpen} setOpen={setSidebarOpen} /> 
            
            {/* 2. CONTENEDOR PRINCIPAL: Aplica margen para el Sidebar fijo */}
            <div className="flex-1 flex flex-col md:ml-64"> 
            
                {/* *** HEADER AJUSTADO (Se simplifica para coincidir con Profesor) *** */}
                <header className="shadow-sm border-b border-gray-200" style={{ backgroundColor: primaryColor }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4"> {/* Reducir py-6 a py-4 */}
                            
                            {/* Botón para abrir el menú en móviles */}
                            <div className="md:hidden">
                                <button 
                                    onClick={() => setSidebarOpen(true)} 
                                    className="text-white hover:text-indigo-200"
                                >
                                    Abrir Menú
                                </button>
                            </div>

                            {/* Título del panel más simple */}
                            <h1 className="text-xl font-bold text-white"> 
                                Panel de Administración
                            </h1>
                            
                            {/* Los botones de Cerrar Sesión / Configuración se mueven al Sidebar o se eliminan */}
                            {/* NOTA: DEJA ESTE DIV VACÍO O CON EL LOGO/USUARIO SI COPIAS EL LAYOUT DEL PROFESOR */}
                            <div className="flex items-center space-x-4">
                                {/* Aquí iría el nombre del usuario o un icono de perfil */}
                            </div>
                        </div>
                    </div>
                </header>
                
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;