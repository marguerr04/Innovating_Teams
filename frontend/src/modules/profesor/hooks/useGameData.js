import { useState, useEffect } from 'react';
import gameService from '../../../services/gameService';

/**
 * Hook personalizado para manejar los datos del juego
 * Integrado con backend real
 */
export const useGameData = (gamePin) => {
  const [gameData, setGameData] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar datos del juego desde el backend
  const loadGameData = async (pin) => {
    setLoading(true);
    try {
      // Obtener el ID de la partida desde localStorage (fue guardado al crear)
      const partidaId = localStorage.getItem(`partida_${pin}_id`);
      
      if (!partidaId) {
        console.warn('No se encontró ID de partida para PIN:', pin);
        // Usar datos dummy como fallback
        const dummyGameData = {
          id: Date.now(),
          pin: pin,
          nombre: 'Juego de Emprendimiento',
          descripcion: 'Juego colaborativo para equipos',
          estado: 'waiting',
          participantes: 0,
          maxParticipantes: 12,
          duracion: 60,
          fechaCreacion: new Date().toISOString(),
        };
        const dummyGrupos = [
          { id: 1, nombre: 'Equipo 1', miembros: [], maxIntegrantes: 10 },
          { id: 2, nombre: 'Equipo 2', miembros: [], maxIntegrantes: 10 },
          { id: 3, nombre: 'Equipo 3', miembros: [], maxIntegrantes: 10 },
          { id: 4, nombre: 'Equipo 4', miembros: [], maxIntegrantes: 10 }
        ];
        setGameData(dummyGameData);
        setGrupos(dummyGrupos);
        setError(null);
        return;
      }

      // Obtener grupos desde el backend
      const gruposData = await gameService.obtenerGrupos(partidaId);
      
      // Transformar formato del backend al formato del frontend
      const gruposFormateados = gruposData.map(grupo => ({
        id: grupo.id,
        nombre: grupo.nombre,
        miembros: (grupo.alumnos || []).map(alumno => ({
          id: alumno.id,
          nombre: `${alumno.primer_nombre} ${alumno.apellido_paterno || ''} ${alumno.apellido_materno || ''}`.trim(),
          email: alumno.id_correo_usuario,
          conectado: true // Por ahora asumimos que todos están conectados
        })),
        maxIntegrantes: 10
      }));

      const gameData = {
        id: partidaId,
        pin: pin,
        nombre: 'Juego de Emprendimiento',
        estado: 'waiting',
        participantes: gruposFormateados.reduce((total, g) => total + g.miembros.length, 0),
        maxParticipantes: gruposFormateados.length * 10,
        fechaCreacion: new Date().toISOString(),
      };

      setGameData(gameData);
      setGrupos(gruposFormateados);
      setError(null);
      
      console.log('✅ Datos cargados desde backend:', { gameData, grupos: gruposFormateados });
    } catch (err) {
      setError('Error al cargar datos del juego');
      console.error('❌ Error loading game data:', err);
      
      // Fallback a datos dummy en caso de error
      const dummyGameData = {
        id: Date.now(),
        pin: pin,
        nombre: 'Juego de Emprendimiento',
        estado: 'waiting',
        participantes: 0,
        maxParticipantes: 12,
      };
      const dummyGrupos = [
        { id: 1, nombre: 'Equipo 1', miembros: [], maxIntegrantes: 10 },
        { id: 2, nombre: 'Equipo 2', miembros: [], maxIntegrantes: 10 },
        { id: 3, nombre: 'Equipo 3', miembros: [], maxIntegrantes: 10 },
        { id: 4, nombre: 'Equipo 4', miembros: [], maxIntegrantes: 10 }
      ];
      setGameData(dummyGameData);
      setGrupos(dummyGrupos);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar estado del juego
  const updateGameState = async (newState) => {
    try {
      // TODO: Reemplazar con llamada real a API
      // await fetch(`/api/games/${gamePin}/state`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ estado: newState })
      // });
      
      setGameData(prev => ({
        ...prev,
        estado: newState,
        fechaActualizacion: new Date().toISOString()
      }));
    } catch (err) {
      setError('Error al actualizar estado del juego');
      console.error('Error updating game state:', err);
    }
  };

  // Función para agregar jugador a grupo
  const addPlayerToGroup = async (playerId, groupId) => {
    try {
      // TODO: Reemplazar con llamada real a API
      // await fetch(`/api/games/${gamePin}/players/${playerId}/group`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ groupId })
      // });
      
      // Actualizar estado local temporalmente
      setGrupos(prev => prev.map(grupo => {
        if (grupo.id === groupId) {
          const playerData = jugadores.find(p => p.id === playerId);
          if (playerData && !grupo.miembros.find(m => m.id === playerId)) {
            return {
              ...grupo,
              miembros: [...grupo.miembros, playerData]
            };
          }
        }
        return grupo;
      }));
    } catch (err) {
      setError('Error al asignar jugador a grupo');
      console.error('Error adding player to group:', err);
    }
  };

  // Función para actualizar nombre de grupo
  const updateGroupName = async (groupId, newName) => {
    try {
      // TODO: Reemplazar con llamada real a API
      // await fetch(`/api/games/${gamePin}/groups/${groupId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ nombre: newName })
      // });
      
      setGrupos(prev => prev.map(grupo => 
        grupo.id === groupId 
          ? { ...grupo, nombre: newName }
          : grupo
      ));
    } catch (err) {
      setError('Error al actualizar nombre del grupo');
      console.error('Error updating group name:', err);
    }
  };

  // Función para obtener jugadores conectados
  const loadPlayers = async () => {
    try {
      // TODO: Reemplazar con WebSocket o polling real
      // const response = await fetch(`/api/games/${gamePin}/players`);
      // const players = await response.json();
      
      // Datos dummy por ahora
      const dummyPlayers = [
        { id: 1, nombre: 'Ana García', email: 'ana@email.com', grupoAsignado: null, conectado: true },
        { id: 2, nombre: 'Luis Morales', email: 'luis@email.com', grupoAsignado: null, conectado: true }
      ];
      
      setJugadores(dummyPlayers);
    } catch (err) {
      setError('Error al cargar jugadores');
      console.error('Error loading players:', err);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (gamePin) {
      loadGameData(gamePin);
      loadPlayers();
    }
  }, [gamePin]);

  // Simulación de polling para actualizaciones en tiempo real
  // TODO: Reemplazar con WebSocket real
  useEffect(() => {
    if (gamePin && gameData?.estado === 'waiting') {
      const interval = setInterval(() => {
        loadPlayers();
        // Simular auto-asignación de jugadores a grupos
        console.log('Checking for new players and auto-assignment...');
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [gamePin, gameData?.estado]);

  return {
    gameData,
    grupos,
    jugadores,
    loading,
    error,
    actions: {
      updateGameState,
      addPlayerToGroup,
      updateGroupName,
      loadPlayers,
      refreshData: () => loadGameData(gamePin)
    }
  };
};

/**
 * Utilidades para manejo de tiempo de juego
 */
export const useGameTimer = (initialTime = 60 * 60) => { // 60 minutos por defecto
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = (newTime = initialTime) => {
    setTimeRemaining(newTime);
    setIsRunning(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, isPaused]);

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning,
    isPaused,
    isFinished: timeRemaining <= 0,
    actions: {
      start: startTimer,
      pause: pauseTimer,
      reset: resetTimer
    }
  };
};

export default useGameData;