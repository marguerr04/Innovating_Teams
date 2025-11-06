import React from 'react';
import AdminLayout from '../components/AdminLayout';
import DashboardCard from '../components/DashboardCard';

const HomeAdmin = () => {
  const stats = [
    {
      title: 'Estudiantes Activos',
      value: '1,234',
      color: 'blue',
      description: '+12% desde el mes pasado',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: 'Profesores',
      value: '89',
      color: 'green',
      description: '+5 nuevos este mes',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: 'Proyectos Completados',
      value: '2,567',
      color: 'purple',
      description: '+23% desde el año pasado',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Calificación Promedio',
      value: '8.7',
      color: 'yellow',
      description: 'Excelente rendimiento',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Principal</h2>
          <p className="text-gray-600">Bienvenido al panel de administración de Misión Emprende</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <DashboardCard
              key={index}
              title={stat.title}
              value={stat.value}
              color={stat.color}
              description={stat.description}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {[
              { action: 'Nuevo estudiante registrado', user: 'María González', time: 'hace 2 minutos' },
              { action: 'Proyecto completado', user: 'Equipo Alpha', time: 'hace 15 minutos' },
              { action: 'Nuevo profesor asignado', user: 'Dr. Rodriguez', time: 'hace 1 hora' },
              { action: 'Evaluación completada', user: 'Fase 3 - Grupo Beta', time: 'hace 2 horas' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                Crear Nuevo Proyecto
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                Registrar Estudiante
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                Generar Reporte
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Eventos</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">Reunión de Profesores</p>
                <p className="text-gray-500">Mañana a las 10:00 AM</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Evaluación Fase 4</p>
                <p className="text-gray-500">Viernes 8 de Nov</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Workshop de Innovación</p>
                <p className="text-gray-500">Próxima semana</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistema</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado del servidor</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base de datos</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Conectada</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última actualización</span>
                <span className="text-xs text-gray-500">hace 1 hora</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HomeAdmin;