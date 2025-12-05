import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProfessorLayout from '../components/ProfessorLayout';
import GroupsDisplay from '../components/GroupsDisplay';
import { useGameData, useGameTimer } from '../hooks/useGameData';

const GameActiveView = () => {
  const navigate = useNavigate();
  const { gamePin } = useParams();
  const location = useLocation();

  // Hooks personalizados para manejo de datos y timer
  const { gameData, grupos, jugadores, actions } = useGameData(gamePin);
  const { timeRemaining, formattedTime, isFinished, actions: timerActions } = useGameTimer();

  // Estado del juego desde navegación o hook
  const [localGameData, setLocalGameData] = useState(
    location.state?.gameData || null
  );
  const [localGrupos, setLocalGrupos] = useState(
    location.state?.grupos || []
  );

  const [partidaId, setPartidaId] = useState(location.state?.partidaId || null);
  const storageKey = gamePin ? `partida_${gamePin}_id` : null;

  const currentGameData = localGameData || gameData;
  // Priorizar grupos del location.state, sino usar del hook
  const currentGrupos = localGrupos.length > 0 ? localGrupos : grupos;

  // Guardar partidaId en localStorage si viene del state
  useEffect(() => {
    if (location.state?.partidaId && storageKey) {
      localStorage.setItem(storageKey, location.state.partidaId);
      setPartidaId(location.state.partidaId);
    }
  }, [location.state?.partidaId, storageKey]);

  useEffect(() => {
    if (!partidaId && storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setPartidaId(stored);
      }
    }
  }, [partidaId, storageKey]);

  // Actualizar grupos locales cuando el hook traiga nuevos datos
  useEffect(() => {
    if (grupos.length > 0 && localGrupos.length === 0) {
      setLocalGrupos(grupos);
      console.log('✅ Grupos actualizados desde hook:', grupos);
    }
  }, [grupos, localGrupos.length]);

  useEffect(() => {
    if (!gamePin || typeof window === 'undefined') {
      return;
    }

    const sessionPayload = {
      pin: gamePin,
      route: 'game-active',
      gameName: currentGameData?.nombre || 'Juego de Emprendimiento',
      phase: currentGameData?.faseActual || 'Juego activo',
      estado: currentGameData?.estado || 'playing',
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('last_profesor_session', JSON.stringify(sessionPayload));
    localStorage.setItem('last_profesor_game_pin', gamePin);
    window.dispatchEvent(new Event('last-profesor-session-updated'));
  }, [gamePin, currentGameData?.nombre, currentGameData?.faseActual, currentGameData?.estado]);

  // Iniciar timer cuando se monta el componente
  useEffect(() => {
    timerActions.start();
  }, [timerActions]);

  // Manejar cuando se acaba el tiempo
  useEffect(() => {
    if (isFinished) {
      alert('¡Tiempo agotado! El juego ha terminado.');
      handleTerminarJuego();
    }
  }, [isFinished]);

  const handleTerminarJuego = () => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas terminar el juego?');
    if (confirmacion) {
      // Actualizar estado del juego
      actions.updateGameState('finished');
      // Redirigir a home o página de resultados
      navigate('/profesor/home');
    }
  };

  const handlePausarJuego = () => {
    timerActions.pause();
    alert('Juego pausado. Funcionalidad completa será implementada con backend');
  };

  const handleMonitorearEquipos = () => {
    alert('Funcionalidad de monitoreo será implementada con backend real');
  };

  const handleVolverInicio = () => {
    const confirmacion = window.confirm('¿Deseas volver al inicio? Esto finalizará el monitoreo actual.');
    if (confirmacion) {
      navigate('/profesor/home');
    }
  };

  const handleVolverSala = () => {
    navigate(`/profesor/waiting-room/${gamePin}`);
  };

  const phaseSevenBackground = {
    backgroundImage: "linear-gradient(135deg, rgba(9,25,64,0.92), rgba(13,46,105,0.88)), url('/assets/backgrounds/fase7.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '32px',
    boxShadow: '0 35px 70px rgba(6,18,44,0.45)'
  };

  return (
    <ProfessorLayout>
      <div className="min-h-[75vh]" style={{ padding: '1rem 0' }}>
        <div className="max-w-6xl mx-auto px-4" style={phaseSevenBackground}>
          <div className="px-6 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-8 text-white gap-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleVolverInicio}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                  🏠 Inicio
                </button>
                <button
                  onClick={handleVolverSala}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                  ← Volver a Sala
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm uppercase tracking-wide text-blue-100">Juego activo</p>
                <h1 className="text-2xl font-bold">{currentGameData?.nombre || 'Juego de Emprendimiento'}</h1>
                <p className="font-mono text-yellow-300">PIN: {gamePin}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-100 mb-1">Tiempo restante</p>
                <div className={`text-2xl font-mono font-bold px-4 py-2 rounded-lg ${
                  timeRemaining < 300 ? 'bg-red-500/80' : 'bg-green-500/80'
                }`}>
                  {formattedTime}
                </div>
              </div>
            </div>

            <div className="bg-white/95 rounded-3xl shadow-2xl p-8">
              <div className="max-w-6xl mx-auto">
            
            {/* 1. TARJETA FASE ACTUAL (Blanca con borde azul) */}
            <div className="bg-white rounded-xl p-6 mb-6 border-2 border-[#2E5E8C] shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md" 
                     style={{ background: 'linear-gradient(135deg, #00B8A9 0%, #2E5E8C 100%)', color: 'white' }}>
                  🎯
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-[#2E5E8C]">Fase 1: Formación de Equipos</h3>
                    <span className="text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm" 
                          style={{ backgroundColor: '#00B8A9' }}>
                      En Progreso
                    </span>
                  </div>
                  <p className="text-slate-600 text-base mb-4">
                    En esta fase, los estudiantes se conocen, establecen roles y definen objetivos comunes. Monitorea que todos los equipos completen las tres actividades.
                  </p>
                  
                  {/* Barra de progreso (Fondo gris claro para contraste) */}
                  <div className="bg-slate-100 rounded-full h-3 mb-2 overflow-hidden border border-slate-200">
                    <div className="h-full rounded-full transition-all duration-500" 
                         style={{ width: '75%', background: 'linear-gradient(90deg, #00B8A9 0%, #FDC328 100%)' }}></div>
                  </div>
                  <div className="text-slate-500 text-sm font-medium">Progreso: 75% - Los equipos están completando la formación inicial</div>
                </div>
              </div>
            </div>

            {/* 2. TARJETA PROGRESO (Blanca con borde azul) */}
            <div className="bg-white rounded-xl p-5 mb-6 border-2 border-[#2E5E8C] shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-[#2E5E8C]">📊 Progreso de Equipos</h3>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Items internos con fondo suave */}
                <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                  <div className="text-2xl font-bold" style={{ color: '#2E5E8C' }}>
                    {currentGameData?.participantes || jugadores.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">Estudiantes</div>
                </div>
                
                <div className="bg-teal-50 rounded-lg p-3 text-center border border-teal-100">
                  <div className="text-2xl font-bold" style={{ color: '#00B8A9' }}>
                    {currentGrupos.filter(g => g.miembros && g.miembros.length > 0).length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">Equipos</div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">
                  <div className="text-2xl font-bold" style={{ color: '#E6B023' }}>75%</div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">Completado</div>
                </div>
              </div>
            </div>

            {/* 3. TARJETA ESTADO REAL TIME (Blanca con borde azul) */}
            <div className="bg-white rounded-xl p-6 mb-8 border-2 border-[#2E5E8C] shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#2E5E8C]">👥 Estado de los Equipos en Tiempo Real</h3>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#00B8A9' }}></div>
                  <span className="text-sm font-medium text-[#00B8A9]">Actualizando en vivo</span>
                </div>
              </div>
              
              {/* Contenedor de la tabla/grid de grupos */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <GroupsDisplay
                  grupos={currentGrupos.map(grupo => {
                    const miembros = grupo.miembros || (grupo.integrantes ? grupo.integrantes.map(int => ({
                      id: int.correo || int.email || int.id,
                      nombre: int.nombre || int.primer_nombre || 'Estudiante',
                      email: int.correo || int.email || int.id_correo_usuario,
                      conectado: true
                    })) : []);
                    
                    return {
                      ...grupo,
                      miembros: miembros,
                      maxIntegrantes: grupo.maxIntegrantes || grupo.max_integrantes || 10,
                      progreso: Math.floor(Math.random() * 40 + 60),
                      actividadActual: "Definiendo roles del equipo",
                      estado: Math.random() > 0.3 ? 'activo' : 'necesita_atencion'
                    };
                  })}
                  onUpdateGroupName={() => {}} 
                  allowEdit={false}
                  showEditInput={false}
                  viewMode="playing"
                  showGroupIdentifiers={!!gamePin}
                  getGroupIdentifier={(_, index) => {
                    const pin = gamePin || 'PIN';
                    return `${pin}-${index + 1}`;
                  }}
                />
              </div>
              
              {/* Alerta ejemplo */}
              <div className="mt-4 space-y-2">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3">
                   <span className="text-lg">⚠️</span>
                   <span className="text-sm font-medium text-amber-700">Equipo 3 lleva 5 minutos sin actividad - Considera brindar apoyo</span>
                </div>
              </div>
            </div>

            {/* 4. TARJETA PRÓXIMAS FASES (Blanca con borde azul) */}
            <div className="mb-8">
              <div className="bg-white rounded-xl p-6 border-2 border-[#2E5E8C] shadow-xl">
                <h4 className="text-lg font-semibold text-[#2E5E8C] mb-4">🗓️ Próximas Fases del Juego</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { num: 2, title: 'Lluvia de Ideas', desc: 'Generación de propuestas' },
                    { num: 3, title: 'Prototipo', desc: 'Materialización de la idea' },
                    { num: 4, title: 'Presentación', desc: 'Pitch y evaluación' }
                  ].map((fase) => (
                    <div key={fase.num} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white" 
                           style={{ backgroundColor: '#2E5E8C' }}>
                        {fase.num}
                      </div>
                      <div>
                        <div className="font-medium text-slate-700">{fase.title}</div>
                        <div className="text-xs text-slate-500">{fase.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            

          </div>
            </div>

            {/* Footer */}
            <div className="bg-black/10 rounded-2xl px-6 py-4 text-white text-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between mt-6">
              <div>
                Sesión iniciada: {currentGameData?.fechaInicio ? new Date(currentGameData.fechaInicio).toLocaleString() : 'N/A'} | PIN: <span className="font-mono font-bold text-[#FDC328]">{gamePin}</span>
              </div>
              <div>
                Rol: Monitor del Profesor | Fase 1 de 4
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProfessorLayout>
  );
};

export default GameActiveView;