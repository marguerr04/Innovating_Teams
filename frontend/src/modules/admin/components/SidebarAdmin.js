import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaChartLine, FaTrophy, FaUserCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const navigation = [
    { name: 'Dashboard Principal', href: 'stats', icon: FaChartLine }, 
    { name: 'Gestión de Desafíos', href: 'challenges', icon: FaTrophy },
    { name: 'Perfil de Usuario', href: 'profile', icon: FaUserCircle },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const SidebarAdmin = ({ isOpen, setOpen }) => {
    const navigate = useNavigate();
    
    // Definimos los colores del Profesor/Admin para usar en Tailwind
    const SIDEBAR_BG = '#2E5E8C'; // Color de fondo principal (Azul Oscuro)
    const ACTIVE_BG = '#00B8A9'; // Color de acento activo (Verde/Cian)
    const HOVER_BG = '#4A7F9F'; // Un color ligeramente más claro para el hover
    
    // *** FUNCIÓN DE LOGOUT IMPLEMENTADA ***
    const handleLogout = () => {
        console.log('Cerrando sesión de Administrador...');
        
        // Limpiar datos de sesión del localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        
        // Redirigir a la página inicial (PreLogin)
        navigate("/prelogin");
    };

    return (
        <>
            {/* Overlay para móviles */}
            <div 
                className={classNames(
                    isOpen ? 'fixed inset-0 z-30 bg-gray-600 bg-opacity-75 md:hidden transition-opacity ease-linear duration-300' : 'hidden'
                )}
                onClick={() => setOpen(false)}
            ></div>

            {/* Sidebar Principal */}
            <div 
                className={classNames(
                    'fixed inset-y-0 left-0 z-40 flex flex-col w-64 transition-transform duration-300 ease-in-out md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
                style={{ backgroundColor: SIDEBAR_BG }}
            >
                <div className="flex items-center justify-between h-16 flex-shrink-0 px-4" style={{ backgroundColor: '#1A3957' }}>
                    <span className="text-xl font-bold text-white tracking-wider">
                        ADMIN PANEL
                    </span>
                    <button 
                        className="text-white md:hidden"
                        onClick={() => setOpen(false)}
                    >
                        <FaTimes className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={`/admin/${item.href}`}
                                className={({ isActive }) => classNames(
                                    isActive
                                        ? 'text-white shadow-inner'
                                        : 'text-indigo-100 hover:text-white',
                                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out'
                                )}
                                style={({ isActive }) => ({
                                    backgroundColor: isActive ? ACTIVE_BG : 'transparent',
                                    '--tw-bg-opacity': isActive ? '1' : '0',
                                })}
                            >
                                <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" aria-hidden="true" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                
                {/* Enlace de Cerrar Sesión */}
                <div className="border-t p-4" style={{ borderColor: HOVER_BG }}>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-300 hover:text-white hover:bg-red-600 transition duration-150 ease-in-out"
                    >
                        <FaSignOutAlt className="mr-3 h-6 w-6" aria-hidden="true" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
};

export default SidebarAdmin;