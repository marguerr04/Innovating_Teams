import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
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

  const currentGameData = localGameData || gameData;
  // Priorizar grupos del location.state, sino usar del hook
  const currentGrupos = localGrupos.length > 0 ? localGrupos : grupos;

  // Guardar partidaId en localStorage si viene del state
  useEffect(() => {
    if (location.state?.partidaId && gamePin) {
      localStorage.setItem(`partida_${gamePin}_id`, location.state.partidaId);
      console.log('✅ PartidaId guardado en localStorage:', location.state.partidaId);
    }
  }, [location.state?.partidaId, gamePin]);

  // Actualizar grupos locales cuando el hook traiga nuevos datos
  useEffect(() => {
    if (grupos.length > 0 && localGrupos.length === 0) {
      setLocalGrupos(grupos);
      console.log('✅ Grupos actualizados desde hook:', grupos);
    }
  }, [grupos, localGrupos.length]);

  // Iniciar timer cuando se monta el componente
  useEffect(() => {
    timerActions.start();
  }, []);

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

  return (
    <GameLayout
      gamePin={gamePin}
      gameName={currentGameData?.nombre}
      showTimer={true}
      timeRemaining={timeRemaining}
      currentView="playing"
    >
      <div 
        className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(135deg, #2E5E8C 0%, #1A3A59 100%)' }}
      >
        {/* Contenido principal del juego */}
        <div className="flex-1 p-8">
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
        <div className="bg-black/20 py-4 border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between text-white text-sm opacity-90">
              <div>
                Sesión iniciada: {currentGameData?.fechaInicio ? new Date(currentGameData.fechaInicio).toLocaleString() : 'N/A'} | 
                PIN: <span className="font-mono font-bold text-[#FDC328]">{gamePin}</span>
              </div>
              <div className="mt-2 md:mt-0">
                Rol: Monitor del Profesor | Fase 1 de 4
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default GameActiveView;