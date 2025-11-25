/**
 * Configuraciones y constantes para el módulo de juegos del profesor
 * Centraliza configuraciones que serán utilizadas por el backend
 */

// Estados posibles del juego
export const GAME_STATES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
};

// Configuraciones por defecto del juego
export const DEFAULT_GAME_CONFIG = {
  maxParticipantes: 12,
  defaultGroupCount: 4,
  defaultMaxIntegrantes: 3,
  defaultDuration: 60, // minutos
  autoAssignPlayers: true,
  allowGroupNameEdit: true
};

// Actividades disponibles para votación
export const AVAILABLE_ACTIVITIES = [
  'Sopa de letras',
  'Armar palabras con letras', 
  'Romper el hielo con el grupo',
  'Lluvia de ideas',
  'Resolución de problemas',
  'Construcción de consenso'
];

// Configuraciones de temporizador
export const TIMER_CONFIG = {
  defaultGameDuration: 60 * 60, // 60 minutos en segundos
  warningTime: 5 * 60, // Advertencia a los 5 minutos restantes
  updateInterval: 1000, // Actualizar cada segundo
  autoFinishOnTimeup: true
};

// Configuraciones de grupos
export const GROUP_CONFIG = {
  minGroups: 2,
  maxGroups: 6,
  minIntegrantesPerGroup: 1,
  maxIntegrantesPerGroup: 6,
  defaultGroupNames: [
    'Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4', 
    'Grupo 5', 'Grupo 6'
  ]
};

// Configuraciones para integración con backend
export const API_CONFIG = {
  endpoints: {
    createGame: '/api/games',
    getGame: '/api/games/:gamePin',
    updateGameState: '/api/games/:gamePin/state',
    getPlayers: '/api/games/:gamePin/players',
    assignPlayerToGroup: '/api/games/:gamePin/players/:playerId/group',
    updateGroupName: '/api/games/:gamePin/groups/:groupId'
  },
  polling: {
    interval: 5000, // Polling cada 5 segundos (mientras no hay WebSocket)
    timeout: 30000 // Timeout de 30 segundos
  },
  websocket: {
    enabled: false, // Activar cuando esté disponible
    url: 'ws://localhost:8080/ws/games'
  }
};

// Mensajes del sistema
export const SYSTEM_MESSAGES = {
  gameCreated: 'Juego creado exitosamente',
  gameStarted: 'El juego ha comenzado',
  gameFinished: 'El juego ha terminado',
  playerJoined: 'Un nuevo jugador se ha unido',
  playerLeft: 'Un jugador ha abandonado el juego',
  groupNameUpdated: 'Nombre del grupo actualizado',
  timeWarning: '⚠️ Quedan solo 5 minutos',
  timeUp: '⏰ Se acabó el tiempo'
};

// Colores para grupos (similares al diseño existente)
export const GROUP_COLORS = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-purple-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-indigo-500'
];

// Configuraciones de validación
export const VALIDATION_RULES = {
  gamePin: {
    length: 6,
    type: 'numeric'
  },
  gameName: {
    minLength: 3,
    maxLength: 50,
    required: true
  },
  groupName: {
    minLength: 1,
    maxLength: 30,
    required: true
  },
  playerName: {
    minLength: 2,
    maxLength: 50,
    required: true
  }
};

// Configuraciones de desarrollo/debugging
export const DEBUG_CONFIG = {
  enabled: process.env.NODE_ENV === 'development',
  showTimestamps: true,
  showDetailedLogs: true,
  mockData: true // Usar datos dummy mientras no hay backend
};

// Utilidades para generar datos
export const UTILS = {
  generateGamePin: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
  
  generateDefaultGroups: (count = 4) => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      nombre: `Grupo ${index + 1}`,
      miembros: [],
      maxIntegrantes: DEFAULT_GAME_CONFIG.defaultMaxIntegrantes,
      color: GROUP_COLORS[index % GROUP_COLORS.length]
    }));
  },

  formatGamePin: (pin) => {
    return pin.toString().padStart(6, '0');
  },

  validateGamePin: (pin) => {
    return /^\d{6}$/.test(pin);
  }
};

export default {
  GAME_STATES,
  DEFAULT_GAME_CONFIG,
  AVAILABLE_ACTIVITIES,
  TIMER_CONFIG,
  GROUP_CONFIG,
  API_CONFIG,
  SYSTEM_MESSAGES,
  GROUP_COLORS,
  VALIDATION_RULES,
  DEBUG_CONFIG,
  UTILS
};