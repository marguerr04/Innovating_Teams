import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfesor } from './ProfessorContext';

const ProfessorLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profesor, logoutProfesor } = useProfesor();

  const handleLogout = () => {
    logoutProfesor();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/profesor/home',
      label: 'Inicio',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/profesor/crear',
      label: 'Crear Juego',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      path: '/profesor/perfil',
      label: 'Perfil',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header className="shadow-lg border-b border-gray-200" style={{ backgroundColor: '#2E5E8C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Innovating Teams
              </h1>
              <span className="ml-2 text-sm text-white px-2 py-1 rounded-full" style={{ backgroundColor: '#00B8A9' }}>
                Profesor
              </span>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-white">Bienvenido, </span>
                <span className="font-medium" style={{ color: '#FDC328' }}>
                  {profesor?.nombre || 'Profesor'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white transition-colors duration-200"
                style={{ backgroundColor: '#E24872' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d13963'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#E24872'}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen" style={{ backgroundColor: '#2E5E8C' }}>
          <nav className="mt-8">
            <div className="px-4">
              <h2 className="text-xs font-semibold text-white uppercase tracking-wide mb-4">
                Navegación
              </h2>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive(item.path)
                          ? 'text-white border-r-4'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={isActive(item.path) ? 
                        { backgroundColor: '#00B8A9', borderRightColor: '#FDC328' } : 
                        {}
                      }
                      onMouseEnter={(e) => {
                        if (!isActive(item.path)) {
                          e.target.style.backgroundColor = '#254c72';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(item.path)) {
                          e.target.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span className={`mr-3 ${isActive(item.path) ? 'text-white' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfessorLayout;