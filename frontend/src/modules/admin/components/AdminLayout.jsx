import React from 'react';
import SidebarAdmin from './SidebarAdmin';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        <header className="shadow-sm border-b border-gray-200" style={{ backgroundColor: '#2E5E8C' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-white">
                Panel de Administración
              </h1>
              <div className="flex items-center space-x-4">
                <button 
                  className="text-white px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: '#00B8A9' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#00a396'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#00B8A9'}
                >
                  Configuración
                </button>
                <button 
                  className="text-white px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: '#E24872' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#d13963'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#E24872'}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;