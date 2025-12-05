# Módulo de Profesor - Integración

Este documento explica la integración del módulo de profesor en el proyecto Innovating Teams.

## Estructura de Archivos

El módulo de profesor se encuentra en la carpeta `src/modules/profesor/` y tiene la siguiente estructura:

```
src/modules/profesor/
├── components/
│   ├── ProfessorContext.jsx    # Contexto global del profesor
│   └── ProfessorLayout.jsx     # Layout principal con navegación
└── pages/
  ├── HomeView.jsx            # Dashboard principal del profesor
  ├── PerfilView.jsx          # Perfil del profesor
  ├── GroupBuilderOptimized.jsx # Constructor de grupos optimizado
  ├── WaitingRoomView.jsx     # Sala de espera del juego
  └── GameActiveView.jsx      # Juego en progreso
```

## Características Implementadas

### 1. **ProfessorContext.jsx**
- Manejo de estado global del profesor
- Gestión de juegos creados
- Funciones de autenticación y actualización de datos

### 2. **ProfessorLayout.jsx**
- Layout responsivo con Tailwind CSS
- Navegación lateral con iconos
- Header con información del profesor
- Integración con React Router

### 3. **HomeView.jsx**
- Dashboard con estadísticas
- Acciones rápidas (crear juego, ver grupos, perfil)
- Lista de juegos recientes
- Diseño responsive con cards informativos

### 4. **PerfilView.jsx**
- Edición de perfil del profesor
- Configuración de notificaciones
- Estadísticas personales
- Diseño con gradientes y toggles

### 5. **GroupBuilderOptimized.jsx**
- Gestión de estudiantes y arrastre optimizado
- Algoritmos de formación de grupos con mejoras de rendimiento
- Exportación de grupos a CSV
- Visualización dinámica de grupos y vista previa de sala

### 6. **WaitingRoomView.jsx / GameActiveView.jsx**
- Flujo de sala de espera y juego activo por PIN
- Muestra y controla grupos durante la partida
- Botones de navegación entre sala de espera y juego

## Rutas Configuradas

Las rutas del módulo de profesor están configuradas en `ProfessorApp.jsx`:

```javascript
<Routes>
  <Route path="/waiting-room/:gamePin" element={<WaitingRoomView />} />
  <Route path="/game-active/:gamePin" element={<GameActiveView />} />
  <Route path="/*" element={
    <ProfessorLayout>
      <Routes>
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/perfil" element={<PerfilView />} />
        <Route path="/grupos" element={<GroupBuilderOptimized />} />
      </Routes>
    </ProfessorLayout>
  } />
</Routes>
```

## Integración con el Sistema de Autenticación

El módulo está integrado con el sistema de login existente:

1. **PreLogin**: Botón "Profesor / Administrador" redirige a `/auth`
2. **Login**: Maneja el rol "profesor" y redirige a `/profesor`
3. **Context**: El `ProfesorProvider` envuelve toda la aplicación

## Estilos y Diseño

- **Framework**: Tailwind CSS
- **Componentes**: Completamente responsive
- **Colores**: Paleta consistente con el proyecto (indigo, purple, blue)
- **Iconos**: SVG embebidos para mejor rendimiento
- **Animaciones**: Transiciones suaves y hover effects

## Funcionalidades Principales

### Dashboard (HomeView)
- Estadísticas en tiempo real
- Acciones rápidas
- Lista de juegos recientes
- Cards informativos

### Perfil (PerfilView)
- Edición de información personal
- Configuración de notificaciones
- Estadísticas del profesor

### Constructor de Grupos (GroupBuilderOptimized)
- Gestión de estudiantes con arrastre optimizado
- Algoritmos de agrupación
- Exportación a CSV
- Visualización dinámica y vista previa de sala

### Sala de Espera / Juego Activo
- Navegación por PIN a sala de espera y juego en curso
- Control de estado del juego y grupos
- Volver a `home` desde cualquiera de las vistas

## Uso

1. **Acceso**: Navegar a `/profesor` o usar el botón en PreLogin
2. **Navegación**: Usar la barra lateral para moverse entre secciones
3. **Gestión de Grupos**: Agregar estudiantes y generar grupos automáticamente
4. **Juegos**: Acceder a `/profesor/waiting-room/:pin` y `/profesor/game-active/:pin` para el flujo de sala/juego

## Notas Técnicas

- **Estado Global**: Manejado por Context API
- **Routing**: React Router v6 con layout anidado
- **Formularios**: Validación manual con estado local
- **Datos**: Mock data para demostración (fácilmente reemplazable por API calls)
- **Performance**: Componentes optimizados con React.memo donde necesario

## Integración Limpia

- ✅ No modifica otros módulos (estudiante, administrador)
- ✅ Reutiliza componentes de UI existentes
- ✅ Sigue la estructura de carpetas del proyecto
- ✅ Mantiene consistencia de estilos
- ✅ Compatible con el sistema de autenticación existente