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
        style={{ background: 'linear-gradient(135deg, #1E5AA8, #183f72)' }}
      >
        {/* Contenido principal del juego */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Card: Fase Actual con Instrucciones */}
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 mb-6 border-2 border-purple-400/30">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                  🎯
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">Fase 1: Formación de Equipos</h3>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">En Progreso</span>
                  </div>
                  <p className="text-white/90 text-base mb-4">
                    En esta fase, los estudiantes se conocen, establecen roles y definen objetivos comunes para su proyecto emprendedor. Monitorea que todos los equipos completen las tres actividades principales.
                  </p>
                  
                  {/* Barra de progreso de fase */}
                  <div className="bg-white/20 rounded-full h-3 mb-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500" 
                         style={{ width: '75%' }}></div>
                  </div>
                  <div className="text-white/70 text-sm">Progreso: 75% - Los equipos están completando la formación inicial</div>
                </div>
              </div>
            </div>

            {/* Card: Progreso de Equipos Unificado - Más conciso */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-6">
              <h3 className="text-lg font-bold mb-4 text-white">📊 Progreso de Equipos</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-lg p-3 text-center text-white">
                  <div className="text-2xl font-bold text-blue-300">
                    {currentGameData?.participantes || jugadores.length}
                  </div>
                  <div className="text-xs opacity-80 mt-1">Estudiantes</div>
                </div>
                
                <div className="bg-white/20 rounded-lg p-3 text-center text-white">
                  <div className="text-2xl font-bold text-green-300">
                    {currentGrupos.filter(g => g.miembros && g.miembros.length > 0).length}
                  </div>
                  <div className="text-xs opacity-80 mt-1">Equipos</div>
                </div>

                <div className="bg-white/20 rounded-lg p-3 text-center text-white">
                  <div className="text-2xl font-bold text-yellow-300">75%</div>
                  <div className="text-xs opacity-80 mt-1">Completado</div>
                </div>
              </div>
            </div>


            {/* Vista de grupos en tiempo real - ENFOQUE PRINCIPAL */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">👥 Estado de los Equipos en Tiempo Real</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm text-white/70">Actualizando en vivo</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <GroupsDisplay
                  grupos={currentGrupos.map(grupo => {
                    // Transformar integrantes a miembros si es necesario
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
                      // Agregar datos de progreso simulado para cada grupo
                      progreso: Math.floor(Math.random() * 40 + 60),
                      actividadActual: "Definiendo roles del equipo",
                      estado: Math.random() > 0.3 ? 'activo' : 'necesita_atencion'
                    };
                  })}
                  onUpdateGroupName={() => {}} // No editable durante juego
                  allowEdit={false}
                  showEditInput={false}
                  viewMode="playing"
                />
              </div>
              
              {/* Alertas de atención */}
              <div className="mt-4 space-y-2">
                <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-200">
                    <span className="text-lg">⚠️</span>
                    <span className="text-sm font-medium">Equipo 3 lleva 5 minutos sin actividad - Considera brindar apoyo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel de Información Adicional */}
            <div className="mb-8">
              {/* Próximas Fases */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">🗓️ Próximas Fases del Juego</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 text-white/70 bg-white/5 rounded-lg p-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <div className="font-medium text-white">Lluvia de Ideas</div>
                      <div className="text-xs opacity-75">Generación de propuestas innovadoras</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/70 bg-white/5 rounded-lg p-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <div className="font-medium text-white">Desarrollo de Prototipo</div>
                      <div className="text-xs opacity-75">Materialización de la idea seleccionada</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/70 bg-white/5 rounded-lg p-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <div className="font-medium text-white">Presentación Final</div>
                      <div className="text-xs opacity-75">Pitch y evaluación de proyectos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de desarrollo actualizada */}
            <div className="bg-black/20 rounded-lg p-4 text-xs text-white opacity-60">
              <h4 className="font-semibold mb-2">ℹ️ Información de desarrollo:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>• Fase actual: Fase 1 - Formación de equipos</div>
                <div>• PIN del juego: {gamePin}</div>
                <div>• Monitoreo en tiempo real activo</div>
                <div>• Sistema de fases centralizado</div>
                <div>• Enfoque en seguimiento del profesor</div>
                <div>• WebSocket preparado para métricas en vivo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer mejorado con información de la sesión */}
        <div className="bg-black/20 py-4">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between text-white text-sm opacity-75">
              <div>
                Sesión iniciada: {currentGameData?.fechaInicio ? new Date(currentGameData.fechaInicio).toLocaleString() : 'N/A'} | 
                PIN: <span className="font-mono font-bold">{gamePin}</span>
              </div>
              <div className="mt-2 md:mt-0">
                Rol: Monitor del Profesor | Fase 1 de 4 | {jugadores.length} estudiantes activos
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default GameActiveView;