import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProfessorLayout from '../components/ProfessorLayout';
import GroupsDisplay from '../components/GroupsDisplay';
import { useGameData } from '../hooks/useGameData';

const WaitingRoomView = () => {
  const navigate = useNavigate();
  const { gamePin } = useParams();
  const location = useLocation();
  
  // Usar el hook personalizado para manejo de datos
  const { gameData, grupos, jugadores, loading, error, actions } = useGameData(gamePin);
  
  // Estado local para datos desde navegación
  const [localGameData, setLocalGameData] = useState(
    location.state?.gameData || null
  );
  const [partidaId, setPartidaId] = useState(location.state?.partidaId || null);
  const storageKey = gamePin ? `partida_${gamePin}_id` : null;

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

  // Usar datos locales si existen, sino los del hook
  const currentGameData = localGameData || gameData;
  const currentGrupos = location.state?.grupos || grupos;

  useEffect(() => {
    if (!gamePin || typeof window === 'undefined') {
      return;
    }

    const sessionPayload = {
      pin: gamePin,
      route: 'waiting-room',
      gameName: currentGameData?.nombre || 'Juego de Emprendimiento',
      phase: 'Sala de espera',
      estado: currentGameData?.estado || 'waiting',
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('last_profesor_session', JSON.stringify(sessionPayload));
    localStorage.setItem('last_profesor_game_pin', gamePin);
    window.dispatchEvent(new Event('last-profesor-session-updated'));
  }, [gamePin, currentGameData?.nombre, currentGameData?.estado]);

  const handleComenzarJuego = () => {
    // Actualizar estado del juego a 'playing'
    const updatedGameData = {
      ...currentGameData,
      estado: 'playing',
      fechaInicio: new Date().toISOString()
    };
    
    actions.updateGameState('playing');
    
    // Obtener partidaId desde location.state o localStorage
    const partidaIdentifier = partidaId || (storageKey ? localStorage.getItem(storageKey) : null);
    
    // Navegar a la página de juego activo
    navigate(`/profesor/game-active/${gamePin}`, {
      state: {
        gameData: updatedGameData,
        grupos: currentGrupos,
        partidaId: partidaIdentifier
      }
    });
  };

  const handleUpdateGroupName = (groupId, newName) => {
    actions.updateGroupName(groupId, newName);
  };

  const handleIniciarVotacion = () => {
    // Funcionalidad futura: iniciar votación de actividades
    alert('Funcionalidad de votación será implementada con backend real');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E5AA8, #183f72)' }}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando sala de espera...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E5AA8, #183f72)' }}>
        <div className="text-white text-center">
          <p className="text-red-300 mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate('/profesor/home')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

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
        <div className="mx-auto max-w-6xl px-4" style={phaseSevenBackground}>
          <div className="px-6 py-8">
        
            {/* Header con botón volver */}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => navigate('/profesor/home')}
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200"
              >
                ← Volver
              </button>
              <div className="text-white text-sm opacity-90">
                Profesor: Sala de Espera
              </div>
            </div>

            {/* Card principal de sala de espera */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Sala de espera</h1>


                {/* Insertar aqui el eloj de arena el gif png, justo debajo de este titulo */}
                <div className="text-lg font-semibold text-blue-600 mb-1">
                  PIN: <span className="text-2xl font-mono">{gamePin}</span>
                </div>
                <p className="text-gray-600 mb-4">
                  {currentGameData?.nombre || 'Juego de Emprendimiento'}
                </p>
                <p className="text-gray-500 text-sm">
                  Se irán asignando automáticamente a los grupos. Los estudiantes pueden editar el nombre de su grupo.
                </p>
                
                {/* Botón para iniciar votación */}
                <div className="mt-4">
                  <button 
                    className="px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: '#3AB6B5' }}
                    onClick={handleIniciarVotacion}
                  >
                    ▶ Iniciar votación ahora
                  </button>
                </div>
              </div>

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentGameData?.participantes || jugadores.length}
                  </div>
                  <div className="text-sm text-gray-600">Participantes</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentGameData?.estado === 'waiting' ? 'Esperando' : 'Activo'}
                  </div>
                  <div className="text-sm text-gray-600">Estado</div>
                </div>
              </div>
            </div>

            {/* Componente de grupos reutilizable */}
            <div className="mb-6">
              <GroupsDisplay
                grupos={currentGrupos}
                onUpdateGroupName={handleUpdateGroupName}
                allowEdit={true}
                showEditInput={true}
                viewMode="waiting"
                showGroupIdentifiers={!!gamePin}
                getGroupIdentifier={(_, index) => {
                  const pin = gamePin || 'PIN';
                  return `${pin}-${index + 1}`;
                }}
              />
            </div>

            {/* Sección de votación (placeholder para futuro) */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ display: 'none' }}>
              <h3 className="font-semibold text-gray-900 mb-4">Votación de actividades</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input type="radio" name="activity" defaultChecked />
                  <span>Sopa de letras</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" name="activity" />
                  <span>Armar palabras con letras</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" name="activity" />
                  <span>Romper el hielo con el grupo</span>
                </label>
              </div>
            </div>

            {/* Botón Comenzar Juego */}
            <div className="text-center">
              <button
                onClick={handleComenzarJuego}
                className="px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#F68C1F' }}
              >
                🎮 Comenzar Juego
              </button>
            </div>

            {/* Información de debugging (remover en producción) */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
              <h4 className="font-semibold mb-2">Información de desarrollo:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>• PIN del juego: {gamePin}</div>
                <div>• Estado: {currentGameData?.estado}</div>
                <div>• Grupos configurados: {currentGrupos.length}</div>
                <div>• Jugadores conectados: {jugadores.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProfessorLayout>
  );
};

export default WaitingRoomView;