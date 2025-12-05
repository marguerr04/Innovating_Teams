# 📚 Módulo Profesor - Sistema de Juegos

## 🎯 Descripción General

Este módulo implementa el sistema de gestión de juegos para profesores, permitiendo crear salas de espera, manejar grupos de estudiantes y controlar juegos en tiempo real.

## 🗂️ Estructura de Carpetas

```
/modules/profesor/
├── pages/
│   ├── WaitingRoomView.jsx     ← Sala de espera del profesor
│   ├── GameActiveView.jsx      ← Juego en progreso 
│   ├── HomeView.jsx            ← Vista principal del profesor
│   └── GroupBuilderOptimized.jsx ← Constructor de grupos optimizado
├── components/
│   ├── GameLayout.jsx         ← Layout común para páginas de juego
│   ├── GroupsDisplay.jsx      ← Componente reutilizable de grupos
│   ├── ProfessorLayout.jsx    ← Layout principal del profesor
│   └── [otros componentes...]
├── hooks/
│   ├── useGameData.js         ← Hook para manejo de datos del juego
│   ├── useOptimizedGroupBuilder.js ← Hook para construcción de grupos
│   └── [otros hooks...]
├── config/
│   └── gameConfig.js          ← Configuraciones y constantes
└── ProfessorApp.jsx           ← Router principal del módulo
```

## 🚀 Nuevas Funcionalidades Implementadas

### 1. **Sala de Espera del Profesor** (`WaitingRoomView.jsx`)
- **Ruta**: `/profesor/waiting-room/:gamePin`
- **Funcionalidades**:
  - Muestra PIN del juego generado automáticamente
  - Vista de 4 grupos dummy preparados para backend
  - Botón "Iniciar votación" (placeholder)
  - Botón "Comenzar Juego" que navega a la vista activa
  - Componente reutilizable `GroupsDisplay`
  - Información de debugging para desarrollo

### 2. **Vista de Juego Activo** (`GameActiveView.jsx`)
- **Ruta**: `/profesor/game-active/:gamePin`
- **Funcionalidades**:
  - Temporizador de 60 minutos con cuenta regresiva
  - Vista en tiempo real del estado de grupos
  - Controles del profesor (monitorear, pausar, terminar)
  - Layout responsivo con información del juego
  - Navegación de vuelta al inicio o sala de espera

## 🔧 Componentes Clave

### `GameLayout.jsx`
Layout reutilizable para páginas de juego que incluye:
- Header con navegación
- Información del PIN del juego
- Temporizador (opcional)
- Estructura responsive

### `GroupsDisplay.jsx`
Componente altamente reutilizable para mostrar grupos:
- **Props configurables**:
  - `grupos`: Array de grupos
  - `allowEdit`: Permitir edición de nombres
  - `viewMode`: 'waiting', 'playing', 'finished'
  - `onUpdateGroupName`: Callback para actualizar nombres
- **Características**:
  - Vista de miembros con avatares
  - Estados visuales (vacío, parcial, completo)
  - Edición inline de nombres de grupo
  - Adaptable a diferentes contextos

### `useGameData.js` Hook
Hook personalizado preparado para integración con backend:
- **Funcionalidades actuales** (dummy data):
  - Manejo de estado del juego
  - Gestión de grupos y jugadores
  - Simulación de polling para updates
- **Preparado para**:
  - API calls reales
  - WebSocket para tiempo real
  - Manejo de errores
  - Validaciones

## 📡 Integración con Backend - Preparación

### API Endpoints Preparados
```javascript
// Definidos en gameConfig.js
const API_ENDPOINTS = {
  createGame: '/api/games',
  getGame: '/api/games/:gamePin',
  updateGameState: '/api/games/:gamePin/state',
  getPlayers: '/api/games/:gamePin/players',
  // ... más endpoints
};
```

### Estructura de Datos Esperada

#### Juego (Game)
```javascript
{
  id: number,
  pin: string, // 6 dígitos
  nombre: string,
  descripcion: string,
  estado: 'waiting' | 'playing' | 'finished',
  participantes: number,
  fechaCreacion: string,
  fechaInicio?: string,
  duracion: number, // minutos
  grupos: Group[]
}
```

#### Grupo (Group)
```javascript
{
  id: number,
  nombre: string,
  miembros: Player[],
  maxIntegrantes: number,
  color?: string
}
```

#### Jugador (Player)
```javascript
{
  id: number,
  nombre: string,
  email: string,
  conectado: boolean,
  grupoAsignado?: number
}
```

## 🔄 Flujo de Navegación

```
HomeView → [Ir a grupos] → GroupBuilderOptimized → [Entrar a sala] → WaitingRoomView → [Comenzar] → GameActiveView
     ↑                                                                    ↓                          ↓
   Volver a home                                              Volver a home / grupos       Volver a sala / home
```

## ⚙️ Configuraciones

Todas las configuraciones están centralizadas en `gameConfig.js`:
- Estados del juego
- Configuraciones por defecto
- Reglas de validación
- Configuraciones de API
- Utilidades y constantes

## 🔄 Próximos Pasos para Backend

### 1. Conexión de API
- Reemplazar datos dummy en `useGameData.js`
- Implementar llamadas HTTP reales
- Manejar estados de carga y error

### 2. WebSocket para Tiempo Real
- Conexión en tiempo real para updates de grupos
- Notificaciones cuando se unen/salen jugadores
- Sincronización de estado del juego

### 3. Persistencia
- Guardar juegos en base de datos
- Historial de partidas
- Estadísticas de uso

### 4. Funcionalidades Avanzadas
- Sistema de votación de actividades
- Monitoreo detallado de equipos
- Chat entre miembros del grupo
- Evaluación y retroalimentación

## 🧪 Testing y Desarrollo

### Datos Dummy Disponibles
- Los hooks están configurados para usar datos dummy mientras no hay backend
- La configuración `DEBUG_CONFIG.mockData = true` controla esto
- Los logs de debugging están habilitados en desarrollo

### Debugging
- Información detallada en consola sobre drag & drop
- Estado del juego visible en interfaces de desarrollo
- Logs de polling y actualizaciones de estado

## 📝 Notas Importantes

1. **Estructura modular**: Cada componente es independiente y reutilizable
2. **Preparado para backend**: Todos los hooks y componentes están listos para conectar con API real
3. **Responsive design**: Todas las vistas funcionan en móvil y desktop
4. **Consistencia visual**: Mantiene el mismo diseño y colores del sistema existente

## 🔍 Archivos Modificados

- ✅ `ProfessorApp.jsx` - Agregadas rutas para sala de espera y juego
- 🆕 `WaitingRoomView.jsx` - Nueva vista de sala de espera
- 🆕 `GameActiveView.jsx` - Nueva vista de juego activo
- 🆕 `GameLayout.jsx` - Layout común para juegos
- 🆕 `GroupsDisplay.jsx` - Componente de grupos reutilizable
- 🆕 `useGameData.js` - Hook para datos del juego
- 🆕 `gameConfig.js` - Configuraciones centralizadas

El sistema está completamente funcional con datos dummy y listo para conectar con backend real cuando esté disponible.