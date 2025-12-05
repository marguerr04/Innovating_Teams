import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfesor } from '../components/ProfessorContext';
// nada de esto es funcional, en proximas etapas sera funcional algunas partes
const HomeView = () => {
  const navigate = useNavigate();
  const { profesor, juegos } = useProfesor();
  const readStoredSession = () => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const raw = localStorage.getItem('last_profesor_session');
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('No se pudo leer la última sesión almacenada:', error);
      return null;
    }
  };

  const readStoredPin = () => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('last_profesor_game_pin');
  };

  const initialStoredSession = readStoredSession();
  const [stats, setStats] = useState({
    totalJuegos: 0,
    juegosPendientes: 0,
    estudiantesActivos: 0,
    ultimaActividad: null
  });
  const [activeGame, setActiveGame] = useState(null);
  const [lastCreatedGame, setLastCreatedGame] = useState(null);
  const [lastSessionInfo, setLastSessionInfo] = useState(initialStoredSession);
  const [lastSessionPin, setLastSessionPin] = useState(() => {
    return initialStoredSession?.pin || readStoredPin();
  });

  useEffect(() => {
    // Calcular estadísticas basadas en los juegos
    const totalJuegos = juegos.length;
    const juegosPendientes = juegos.filter(juego => juego.estado === 'pendiente').length;
    const runningGame = juegos.find(juego => juego.estado === 'activo') || null;
    const latestGame = juegos.length ? juegos[juegos.length - 1] : null;
    
    setStats({
      totalJuegos,
      juegosPendientes,
      estudiantesActivos: Math.floor(Math.random() * 50) + 20, // Placeholder
      ultimaActividad: new Date().toLocaleDateString()
    });
    setActiveGame(runningGame);
    setLastCreatedGame(latestGame);
  }, [juegos]);

  useEffect(() => {
    if (lastCreatedGame && lastCreatedGame.pin && typeof window !== 'undefined') {
      localStorage.setItem('last_profesor_game_pin', lastCreatedGame.pin);
      setLastSessionPin(lastCreatedGame.pin);
    }
  }, [lastCreatedGame]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncSessionInfo = () => {
      const stored = readStoredSession();
      if (stored) {
        setLastSessionInfo(stored);
        setLastSessionPin(stored.pin);
        return;
      }

      const storedPin = readStoredPin();
      if (storedPin) {
        setLastSessionPin(storedPin);
      }
    };

    syncSessionInfo();
    window.addEventListener('last-profesor-session-updated', syncSessionInfo);
    window.addEventListener('storage', syncSessionInfo);

    return () => {
      window.removeEventListener('last-profesor-session-updated', syncSessionInfo);
      window.removeEventListener('storage', syncSessionInfo);
    };
  }, []);

  const handleNavigateToGame = (juego) => {
    const pinDestino = juego?.pin || lastSessionInfo?.pin || lastSessionPin;

    if (pinDestino) {
      const routeHint =
        juego?.route ||
        (juego?.estado === 'playing' ? 'game-active' : null) ||
        lastSessionInfo?.route;

      const targetPath = routeHint === 'game-active'
        ? `/profesor/game-active/${pinDestino}`
        : `/profesor/waiting-room/${pinDestino}`;

      const shouldSendState = Boolean(
        juego && (juego.grupos || juego.nombre || juego.estado)
      );

      navigate(targetPath, shouldSendState ? {
        state: {
          gameData: juego,
          grupos: juego?.grupos || []
        }
      } : undefined);
      return;
    }

    if (juego?.rutaAcceso) {
      navigate(juego.rutaAcceso);
      return;
    }

    if (juego?.id) {
      navigate(`/profesor/juegos/${juego.id}`);
      return;
    }

    navigate('/profesor/grupos');
  };

  

  const recentGames = juegos.slice(0, 3);

  const participationData = [
    { label: 'Ingeniería', value: 48, color: '#2E5E8C' },
    { label: 'Administración', value: 32, color: '#00B8A9' },
    { label: 'Diseño', value: 12, color: '#FDC328' },
    { label: 'Otros', value: 8, color: '#E24872' }
  ];
  const participationTotal = participationData.reduce((sum, item) => sum + item.value, 0);
  const participationGradient = participationData.reduce((acc, item, index) => {
    const prevPercent = participationData
      .slice(0, index)
      .reduce((sum, current) => sum + current.value, 0);
    const start = (prevPercent / participationTotal) * 360;
    const end = ((prevPercent + item.value) / participationTotal) * 360;
    const segment = `${item.color} ${start}deg ${end}deg`;
    return acc ? `${acc}, ${segment}` : segment;
  }, '');
  const satisfactionScore = 4.3;
  const satisfactionPercent = Math.min(100, (satisfactionScore / 5) * 100);
  const resumeSource = lastSessionInfo || lastCreatedGame;
  const resumeActionPayload = resumeSource || (lastSessionPin ? { pin: lastSessionPin } : null);
  const resumePin = resumeActionPayload?.pin;
  const canResumeSession = Boolean(resumePin);
  const resumeGameName = resumeSource?.nombre || resumeSource?.gameName || 'Sesión pendiente';
  const resumePhase = resumeSource?.faseActual || resumeSource?.phase || (resumeSource?.estado === 'playing' ? 'Juego activo' : 'Sala de espera');

  const quickActions = [
    {
      title: 'Crear juego',
      description: 'Configura el PIN, grupos y fases de un nuevo juego',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6m13 8v-2a3 3 0 00-3-3H8a3 3 0 00-3 3v2m3-14h10a2 2 0 012 2v4" />
        </svg>
      ),
      action: () => navigate('/profesor/grupos'),
      bgColor: '#00B8A9',
      hoverColor: '#00a396'
    },
    {
      title: 'Volver al último juego',
      description: canResumeSession
        ? `${resumeGameName} · PIN ${resumePin} · ${resumePhase}`
        : 'Necesitas crear un juego para habilitar este acceso rápido',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l4-4m-4 4l-4-4M4 12h16" />
        </svg>
      ),
      action: () => {
        if (canResumeSession) {
          handleNavigateToGame(resumeActionPayload);
        } else {
          navigate('/profesor/grupos');
        }
      },
      bgColor: '#2E5E8C',
      hoverColor: '#254c72',
      disabled: !canResumeSession
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
          {quickActions.map((action, index) => {
            const bgColor = action.disabled ? '#94a3b8' : action.bgColor;
            const hoverColor = action.disabled ? '#94a3b8' : action.hoverColor;
            return (
              <button
                key={index}
                onClick={() => {
                  if (!action.disabled) {
                    action.action();
                  }
                }}
                className={`text-white p-6 rounded-lg shadow-lg transition-all duration-200 ${
                  action.disabled ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:scale-105'
                }`}
                style={{ backgroundColor: bgColor }}
                onMouseEnter={(e) => {
                  if (!action.disabled) {
                    e.currentTarget.style.backgroundColor = hoverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = bgColor;
                }}
              >
                <div className="flex items-center mb-4">
                  {action.icon}
                  <h3 className="ml-3 text-lg font-semibold">{action.title}</h3>
                </div>
                <p className="text-sm opacity-90">{action.description}</p>
              </button>
            );
          })}
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
          
          {/* Gráfico de dona con conic-gradient */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <div
                className="w-full h-full rounded-full"
                style={{ background: `conic-gradient(${participationGradient})` }}
              ></div>
              <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <p className="text-3xl font-bold" style={{ color: '#2E5E8C' }}>156</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {participationData.map((item) => (
              <div key={item.label} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span>
                  {item.label} ({item.value}%)
                </span>
              </div>
            ))}
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

          {/* Gauge semi circular mejor alineado */}
          <div className="flex justify-center mb-4">
            <div className="relative w-52 h-32 flex items-center justify-center overflow-visible">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 120 70">
                <path
                  d="M10 60 A 50 50 0 0 1 110 60"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M10 60 A 50 50 0 0 1 110 60"
                  stroke="#2E5E8C"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray={`${satisfactionPercent} ${100 - satisfactionPercent}`}
                />
              </svg>
              <div className="absolute bottom-2 text-center">
                <p className="text-4xl font-bold" style={{ color: '#2E5E8C' }}>{satisfactionScore}</p>
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
                onClick={() => navigate('/profesor/grupos')}
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