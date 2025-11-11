import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfesor } from '../components/ProfessorContext';
// nada de esto es funcional, en proximas etapas sera funcional algunas partes
const HomeView = () => {
  const navigate = useNavigate();
  const { profesor, juegos, loading } = useProfesor();
  const [stats, setStats] = useState({
    totalJuegos: 0,
    juegosPendientes: 0,
    estudiantesActivos: 0,
    ultimaActividad: null
  });

  useEffect(() => {
    // Calcular estadísticas basadas en los juegos
    const totalJuegos = juegos.length;
    const juegosPendientes = juegos.filter(juego => juego.estado === 'pendiente').length;
    
    setStats({
      totalJuegos,
      juegosPendientes,
      estudiantesActivos: Math.floor(Math.random() * 50) + 20, // Placeholder
      ultimaActividad: new Date().toLocaleDateString()
    });
  }, [juegos]);

  const quickActions = [
    {
      title: 'Crear Nuevo Juego',
      description: 'Configura un nuevo juego para tus estudiantes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      action: () => navigate('/profesor/crear'),
      bgColor: '#00B8A9',
      hoverColor: '#00a396'
    },
    {
      title: 'Ver Grupos',
      description: 'Administra los grupos de estudiantes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      action: () => navigate('/profesor/grupos'),
      bgColor: '#FDC328',
      hoverColor: '#e6b023'
    },
    {
      title: 'Mi Perfil',
      description: 'Actualiza tu información personal',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      action: () => navigate('/profesor/perfil'),
      bgColor: '#E24872',
      hoverColor: '#d13963'
    }
  ];

  const recentGames = juegos.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-lg shadow-lg p-8 text-white" style={{ background: `linear-gradient(135deg, #2E5E8C 0%, #00B8A9 100%)` }}>
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido de vuelta, {profesor?.nombre || 'Profesor'}!
        </h1>
        <p className="text-white opacity-90 text-lg">
          Aquí tienes un resumen de tus actividades y herramientas para gestionar tus juegos.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: '#00B8A9' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00B8A9', color: 'white' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Juegos</p>
              <p className="text-2xl font-semibold" style={{ color: '#2E5E8C' }}>{stats.totalJuegos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: '#FDC328' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FDC328', color: 'white' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Juegos Pendientes</p>
              <p className="text-2xl font-semibold" style={{ color: '#2E5E8C' }}>{stats.juegosPendientes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: '#E24872' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E24872', color: 'white' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Estudiantes Activos</p>
              <p className="text-2xl font-semibold" style={{ color: '#2E5E8C' }}>{stats.estudiantesActivos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: '#2E5E8C' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2E5E8C', color: 'white' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Última Actividad</p>
              <p className="text-2xl font-semibold" style={{ color: '#2E5E8C' }}>{stats.ultimaActividad}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#2E5E8C' }}>Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: action.bgColor }}
              onMouseEnter={(e) => e.target.style.backgroundColor = action.hoverColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = action.bgColor}
            >
              <div className="flex items-center mb-4">
                {action.icon}
                <h3 className="ml-3 text-lg font-semibold">{action.title}</h3>
              </div>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sección de Gráficos y Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Participación por Carreras */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#2E5E8C' }}>
              Participación por Carreras
            </h3>
            <svg className="w-5 h-5" style={{ color: '#00B8A9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          
          {/* Simulación de gráfico de dona */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#2E5E8C"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="75 25"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#00B8A9"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="50 50"
                  strokeDashoffset="-75"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#FDC328"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="31 69"
                  strokeDashoffset="-125"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E24872"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="19 81"
                  strokeDashoffset="-156"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#2E5E8C' }}>156</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#2E5E8C' }}></div>
              <span>Ingeniería (48%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#00B8A9' }}></div>
              <span>Administración (32%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#FDC328' }}></div>
              <span>Diseño (12%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#E24872' }}></div>
              <span>Otros (8%)</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong style={{ color: '#2E5E8C' }}>Descripción:</strong> Distribución de estudiantes participantes según su carrera de estudio.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <strong>Métrica:</strong> Ingeniería lidera con 75 estudiantes activos
            </p>
          </div>
        </div>

        {/* Gráfico de Progreso de Juegos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#2E5E8C' }}>
              Progreso de Juegos
            </h3>
            <svg className="w-5 h-5" style={{ color: '#00B8A9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
            </svg>
          </div>

          {/* Simulación de gráfico de barras */}
          <div className="mb-4">
            <div className="flex items-end justify-between h-32 mb-2">
              <div className="flex flex-col items-center">
                <div className="w-8 rounded-t" style={{ backgroundColor: '#2E5E8C', height: '80%' }}></div>
                <span className="text-xs mt-1">Ene</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 rounded-t" style={{ backgroundColor: '#00B8A9', height: '60%' }}></div>
                <span className="text-xs mt-1">Feb</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 rounded-t" style={{ backgroundColor: '#FDC328', height: '90%' }}></div>
                <span className="text-xs mt-1">Mar</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 rounded-t" style={{ backgroundColor: '#E24872', height: '70%' }}></div>
                <span className="text-xs mt-1">Abr</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 rounded-t" style={{ backgroundColor: '#00B8A9', height: '85%' }}></div>
                <span className="text-xs mt-1">May</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="text-center p-2 rounded" style={{ backgroundColor: '#f0f9ff', color: '#2E5E8C' }}>
              <p className="font-bold text-lg">12</p>
              <p className="text-xs">Completados</p>
            </div>
            <div className="text-center p-2 rounded" style={{ backgroundColor: '#f0fdfa', color: '#00B8A9' }}>
              <p className="font-bold text-lg">5</p>
              <p className="text-xs">En Progreso</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong style={{ color: '#2E5E8C' }}>Descripción:</strong> Evolución mensual de juegos completados y en progreso.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <strong>Métrica:</strong> Incremento del 23% en finalización de juegos
            </p>
          </div>
        </div>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Nivel de Satisfacción */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#2E5E8C' }}>
              Satisfacción
            </h3>
            <svg className="w-5 h-5" style={{ color: '#00B8A9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-1 4H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" />
            </svg>
          </div>

          {/* Simulación de gauge */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-16">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <path
                  d="M 10 45 A 40 40 0 0 1 90 45"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="none"
                />
                <path
                  d="M 10 45 A 40 40 0 0 1 75 25"
                  stroke="#00B8A9"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <p className="text-2xl font-bold" style={{ color: '#00B8A9' }}>4.3</p>
                <p className="text-xs text-gray-500">de 5</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              <strong style={{ color: '#2E5E8C' }}>Descripción:</strong> Calificación promedio de estudiantes.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <strong>Métrica:</strong> +0.3 vs. mes anterior
            </p>
          </div>
        </div>

        {/* Tiempo Promedio */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#2E5E8C' }}>
              Tiempo Promedio
            </h3>
            <svg className="w-5 h-5" style={{ color: '#FDC328' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="text-center mb-4">
            <p className="text-4xl font-bold" style={{ color: '#FDC328' }}>45</p>
            <p className="text-lg" style={{ color: '#2E5E8C' }}>minutos</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="h-2 rounded-full" 
              style={{ backgroundColor: '#FDC328', width: '75%' }}
            ></div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              <strong style={{ color: '#2E5E8C' }}>Descripción:</strong> Duración promedio por sesión de juego.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <strong>Métrica:</strong> Dentro del rango óptimo (30-60 min)
            </p>
          </div>
        </div>

        {/* Tasa de Finalización */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#2E5E8C' }}>
              Tasa de Finalización
            </h3>
            <svg className="w-5 h-5" style={{ color: '#E24872' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="text-center mb-4">
            <p className="text-4xl font-bold" style={{ color: '#E24872' }}>87%</p>
            <p className="text-sm text-gray-500">estudiantes completan</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="text-center p-2 rounded" style={{ backgroundColor: '#fef2f2', color: '#E24872' }}>
              <p className="font-bold">156</p>
              <p>Completados</p>
            </div>
            <div className="text-center p-2 rounded bg-gray-50 text-gray-600">
              <p className="font-bold">23</p>
              <p>Abandonados</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              <strong style={{ color: '#2E5E8C' }}>Descripción:</strong> Porcentaje de estudiantes que finalizan los juegos.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <strong>Métrica:</strong> +5% respecto al trimestre anterior
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#2E5E8C' }}>Juegos Recientes</h2>
        {recentGames.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{ backgroundColor: '#2E5E8C' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Nombre del Juego
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Participantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentGames.map((juego, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#2E5E8C' }}>
                        {juego.nombre || `Juego ${index + 1}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{ 
                            backgroundColor: juego.estado === 'activo' ? '#00B8A9' : '#FDC328'
                          }}
                        >
                          {juego.estado || 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {juego.participantes || '0'} estudiantes
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {juego.fechaCreacion || new Date().toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="mx-auto h-12 w-12" style={{ color: '#2E5E8C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium" style={{ color: '#2E5E8C' }}>No hay juegos</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando tu primer juego para los estudiantes.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/profesor/crear')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white transition-colors duration-200"
                style={{ backgroundColor: '#00B8A9' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#00a396'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#00B8A9'}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Crear Primer Juego
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;