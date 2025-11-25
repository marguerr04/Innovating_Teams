# 📊 Lógica de Guardado de Grupos - Frontend a Backend

## 🎯 Objetivo
Implementar la integración completa entre el frontend y backend para crear juegos con grupos y guardar correctamente el número de integrantes de cada equipo en la base de datos.

---

## 🔄 Flujo Completo de Creación de Juego

### 1️⃣ **Preparación de Datos en el Frontend**

#### Ubicación: `GroupBuilderOptimized.jsx` - función `handleLaunchGame()`

```javascript
const handleLaunchGame = async () => {
  try {
    setIsCreatingGame(true);
    setGameError(null);
    
    // PASO 1: Validar que existan grupos con estudiantes
    const gruposConEstudiantes = groups.filter(g => 
      g.students && g.students.length > 0
    );
    
    if (gruposConEstudiantes.length === 0) {
      setGameError('Debes asignar al menos un estudiante a un grupo');
      return;
    }
    
    // PASO 2: Formatear datos para el backend
    const gruposParaBackend = gruposConEstudiantes.map((grupo) => ({
      nombre: grupo.name,                    // Ej: "Equipo 1"
      integrantes: grupo.students.map(estudiante => ({
        correo: estudiante.correo,           // Email único
        nombre: estudiante.nombre,           // Primer nombre
        apellido_paterno: estudiante.apellido_paterno,
        apellido_materno: estudiante.apellido_materno,
        rut: estudiante.rut || ''
      }))
    }));
    
    // PASO 3: Enviar al backend y recibir ID de partida + PIN
    const partidaCreada = await gameService.crearPartidaConGrupos(
      gruposParaBackend, 
      { estado: 'CREADA' }
    );
    
    // PASO 4: Navegar con los datos de la partida creada
    navigate(`/profesor/waiting-room/${partidaCreada.pin}`, {
      state: {
        partidaId: partidaCreada.id,      // ID de la partida en BD
        pin: partidaCreada.pin,            // PIN de 8 caracteres
        grupos: gruposParaBackend,
        totalEstudiantes: gruposParaBackend.reduce(
          (sum, g) => sum + g.integrantes.length, 0
        )
      }
    });
    
  } catch (error) {
    setGameError('Error al crear el juego: ' + error.message);
  }
};
```

---

### 2️⃣ **Servicio de Comunicación con Backend**

#### Ubicación: `services/gameService.js`

```javascript
const gameService = {
  /**
   * Crear partida y asignar grupos en un solo flujo
   */
  async crearPartidaConGrupos(grupos, gameConfig = {}) {
    console.log('🎮 Iniciando creación de partida con grupos...');
    
    // PASO A: Crear la partida primero
    const partidaData = await this.crearPartida({
      estado: 'CREADA',
      maxEquipos: grupos.length,
      maxParticipantes: grupos.reduce(
        (total, grupo) => total + grupo.integrantes.length, 0
      ),
      ...gameConfig
    });
    
    console.log('✅ Partida creada - ID:', partidaData.id, 'PIN:', partidaData.pin);
    
    // PASO B: Asignar grupos a la partida
    const resultadoGrupos = await this.asignarGrupos(
      partidaData.id, 
      grupos
    );
    
    return {
      ...partidaData,
      grupos: resultadoGrupos.gruposCreados,
      mensaje: 'Partida y grupos creados exitosamente'
    };
  },

  /**
   * Endpoint 1: Crear partida vacía
   */
  async crearPartida(gameData = {}) {
    const response = await fetch(`${API_BASE_URL}crear-partida/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estado: gameData.estado || 'EN_CURSO',
        max_equipos: gameData.maxEquipos || 4,
        max_participantes: gameData.maxParticipantes || 100,
      }),
    });
    
    const data = await response.json();
    return {
      id: data.id,                    // ID único en BD
      pin: data.codigoAcceso,         // PIN de 8 caracteres
      estado: data.estado,
      maxEquipos: data.maxEquipos,
      maxParticipantes: data.maxParticipantes,
      fechaCreacion: data.fechaCreacion,
    };
  },

  /**
   * Endpoint 2: Asignar grupos a partida existente
   */
  async asignarGrupos(partidaId, grupos) {
    // Transformar formato frontend -> backend
    const gruposFormateados = grupos.map((grupo, index) => ({
      nombre: grupo.nombre || `Equipo ${index + 1}`,
      alumnos: grupo.integrantes.map(estudiante => ({
        id_correo_usuario: estudiante.correo,
        primer_nombre: estudiante.nombre,
        apellido_paterno: estudiante.apellido_paterno || '',
        apellido_materno: estudiante.apellido_materno || '',
      }))
    }));
    
    const response = await fetch(
      `${API_BASE_URL}partida/${partidaId}/asignar-grupos/`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grupos: gruposFormateados }),
      }
    );
    
    const data = await response.json();
    return {
      mensaje: data.mensaje,
      partidaId: data.partida_id,
      gruposCreados: data.grupos_creados,  // Array con IDs de equipos creados
    };
  },
};
```

---

### 3️⃣ **Estructura de Datos que se Guarda en BD**

#### Cuando se ejecuta `crearPartidaConGrupos()`:

```javascript
// ENTRADA: Grupos del frontend
[
  {
    nombre: "Equipo 1",
    integrantes: [
      { correo: "juan@mail.com", nombre: "Juan", apellido_paterno: "Pérez", apellido_materno: "López" },
      { correo: "maria@mail.com", nombre: "María", apellido_paterno: "García", apellido_materno: "Silva" },
      { correo: "pedro@mail.com", nombre: "Pedro", apellido_paterno: "Rojas", apellido_materno: "Muñoz" }
    ]
  },
  {
    nombre: "Equipo 2",
    integrantes: [
      { correo: "ana@mail.com", nombre: "Ana", apellido_paterno: "Torres", apellido_materno: "Vega" },
      { correo: "luis@mail.com", nombre: "Luis", apellido_paterno: "Díaz", apellido_materno: "Soto" }
    ]
  }
]

// SALIDA: Respuesta del backend
{
  id: 42,                          // ID de la partida en BD
  pin: "A7X9B2C4",                // PIN único de 8 caracteres
  estado: "CREADA",
  maxEquipos: 2,
  maxParticipantes: 5,
  fechaCreacion: "2025-11-24T10:30:00Z",
  grupos: [
    {
      id_equipo_creado: 15,        // ID del Equipo 1 en BD
      nombre_grupo: "Equipo 1",
      alumnos_asignados: [
        { id_usuario: 101, email: "juan@mail.com", creado_nuevo: true },
        { id_usuario: 102, email: "maria@mail.com", creado_nuevo: true },
        { id_usuario: 103, email: "pedro@mail.com", creado_nuevo: false }
      ]
    },
    {
      id_equipo_creado: 16,        // ID del Equipo 2 en BD
      nombre_grupo: "Equipo 2",
      alumnos_asignados: [
        { id_usuario: 104, email: "ana@mail.com", creado_nuevo: true },
        { id_usuario: 105, email: "luis@mail.com", creado_nuevo: true }
      ]
    }
  ],
  mensaje: "Partida y grupos creados exitosamente"
}
```

---

## 🗄️ Tablas de Base de Datos Afectadas

### **1. Tabla `partida`**
```sql
INSERT INTO partida (
  fechacreacion, 
  estado, 
  codigoacceso, 
  maxequipos, 
  maxparticipantes
) VALUES (
  NOW(), 
  'CREADA', 
  'A7X9B2C4',  -- PIN único
  2,            -- Número de equipos
  5             -- Total de estudiantes
);
-- RETORNA: id = 42
```

### **2. Tabla `equipo`**
```sql
-- Por cada grupo creado:
INSERT INTO equipo (nombreequipo, tamanoequipo)
VALUES ('Equipo 1', 3);  -- 3 integrantes
-- RETORNA: id = 15

INSERT INTO equipo (nombreequipo, tamanoequipo)
VALUES ('Equipo 2', 2);  -- 2 integrantes
-- RETORNA: id = 16
```

### **3. Tabla `usuario`**
```sql
-- Por cada estudiante (si no existe):
INSERT INTO usuario (
  email, 
  nombre, 
  apellido, 
  tipousuario, 
  fechacreacion, 
  estado, 
  password
) VALUES (
  'juan@mail.com',
  'Juan',
  'Pérez López',
  'ESTUDIANTE',
  NOW(),
  'ACTIVO',
  'password_temporal_123'
);
-- RETORNA: id = 101
```

### **4. Tabla `partida_usuario`** (Relación N:M)
```sql
-- Por cada estudiante en cada equipo:
INSERT INTO partida_usuario (partida_id, usuario_id, equipo_id)
VALUES (42, 101, 15);  -- Juan en Equipo 1 de la Partida 42

INSERT INTO partida_usuario (partida_id, usuario_id, equipo_id)
VALUES (42, 102, 15);  -- María en Equipo 1 de la Partida 42

INSERT INTO partida_usuario (partida_id, usuario_id, equipo_id)
VALUES (42, 103, 15);  -- Pedro en Equipo 1 de la Partida 42

INSERT INTO partida_usuario (partida_id, usuario_id, equipo_id)
VALUES (42, 104, 16);  -- Ana en Equipo 2 de la Partida 42

INSERT INTO partida_usuario (partida_id, usuario_id, equipo_id)
VALUES (42, 105, 16);  -- Luis en Equipo 2 de la Partida 42
```

---

## 📊 Cómo se Calcula el Número de Integrantes por Grupo

### En el Frontend (antes de enviar):

```javascript
// Hook: useOptimizedGroupBuilder.js
const getGroupsFromContainers = () => {
  const groups = [];
  
  for (let i = 1; i <= groupSettings.groupCount; i++) {
    const groupId = `grupo-${i}`;
    const students = containers[groupId] || [];
    
    groups.push({
      id: groupId,
      name: `Equipo ${i}`,
      students: students,              // Array de estudiantes
      color: colors[i - 1],
      maxSize: baseCapacity + 1
    });
  }
  
  return groups;
};

// Cada grupo tiene:
// - students.length: número actual de integrantes
// - maxSize: capacidad máxima calculada equitativamente
```

### En el Backend (al guardar):

```python
# views.py - asignar_grupos()

# Para cada grupo recibido:
nuevo_equipo = Equipo.objects.create(
    nombreequipo=nombre_grupo_recibido,
    tamanoequipo=len(alumnos_data)  # <-- AQUÍ SE GUARDA EL NÚMERO
)

# Ejemplo:
# Si alumnos_data = [juan, maria, pedro]
# Entonces tamanoequipo = 3
```

---

## ✅ Verificación del Guardado

### Query para verificar en BD:

```sql
-- Ver la partida creada
SELECT * FROM partida WHERE codigoacceso = 'A7X9B2C4';

-- Ver los equipos con su tamaño
SELECT 
  e.id,
  e.nombreequipo,
  e.tamanoequipo,
  COUNT(pu.usuario_id) as integrantes_reales
FROM equipo e
LEFT JOIN partida_usuario pu ON pu.equipo_id = e.id
WHERE pu.partida_id = 42
GROUP BY e.id, e.nombreequipo, e.tamanoequipo;

-- Resultado esperado:
-- id | nombreequipo | tamanoequipo | integrantes_reales
-- 15 | Equipo 1     | 3            | 3
-- 16 | Equipo 2     | 2            | 2
```

---

## 🎮 Flujo en la Interfaz de Usuario

### Paso a Paso Visual:

1. **Usuario carga CSV** → Se procesan estudiantes en el frontend
2. **Usuario organiza grupos** → Drag & drop entre contenedores
3. **Usuario hace clic en "CONFIRMAR Y LANZAR JUEGO"**
   - ⏳ Botón muestra "CREANDO JUEGO..."
   - 📤 Se envía solicitud al backend
4. **Backend crea partida** → Genera ID y PIN único
5. **Backend crea equipos** → Guarda `tamanoequipo` = número de integrantes
6. **Backend asocia usuarios** → Crea/obtiene usuarios y los vincula
7. **Backend responde** → Devuelve ID, PIN, y datos de equipos creados
8. **Frontend recibe respuesta** → Navega a `/profesor/waiting-room/{PIN}`
9. **Usuario ve sala de espera** → Con PIN y grupos confirmados

---

## 🔍 Logs de Debugging

### En el navegador (Console):

```javascript
🎮 Iniciando proceso de creación del juego...
📋 Grupos preparados para backend: [
  { 
    nombre: "Equipo 1", 
    integrantes: [{ correo: "...", nombre: "..." }, ...] 
  },
  ...
]
📤 Enviando grupos al backend: { partidaId: null, gruposFormateados: [...] }
✅ Partida creada con ID: 42 PIN: A7X9B2C4
✅ Grupos asignados exitosamente: { 
  grupos_creados: [
    { id_equipo_creado: 15, alumnos_asignados: [...] },
    ...
  ] 
}
✅ Partida creada exitosamente: { id: 42, pin: "A7X9B2C4", ... }
```

---

## 🚨 Manejo de Errores

### Validaciones Implementadas:

1. **Frontend valida antes de enviar:**
   - ✅ Al menos 1 grupo con estudiantes
   - ✅ Todos los estudiantes tienen correo y nombre

2. **Backend valida al recibir:**
   - ✅ Partida existe (si se envía `partidaId`)
   - ✅ Estructura JSON correcta
   - ✅ Emails únicos por estudiante

3. **Errores mostrados al usuario:**
   ```javascript
   {gameError && (
     <div className="bg-red-50 border border-red-200 rounded-lg p-4">
       <h3 className="text-red-800 font-semibold">Error al crear el juego</h3>
       <p className="text-red-600 text-sm">{gameError}</p>
     </div>
   )}
   ```

---

## 📝 Resumen

### Lo que se implementó:

✅ **Integración completa Frontend ↔ Backend**
- Servicio `gameService.js` con métodos `crearPartida()` y `asignarGrupos()`
- Flujo `crearPartidaConGrupos()` que ejecuta ambos endpoints en secuencia

✅ **Guardado del número de integrantes**
- Campo `tamanoequipo` en tabla `equipo`
- Se calcula como `len(alumnos_data)` en el backend
- Se verifica con conteo real en `partida_usuario`

✅ **Generación de ID y PIN únicos**
- ID autoincremental en tabla `partida`
- PIN de 8 caracteres (UUID truncado)

✅ **Navegación con datos persistidos**
- Estado compartido vía `navigate()` con `state`
- Datos disponibles en `WaitingRoomView` y `GameActiveView`

✅ **UX mejorada**
- Loading spinner mientras se crea el juego
- Mensajes de error descriptivos
- Botón deshabilitado durante la creación

---

## 🔗 Archivos Modificados

1. `frontend/src/services/gameService.js` - **NUEVO**
2. `frontend/src/modules/profesor/pages/GroupBuilderOptimized.jsx` - Modificado
3. `frontend/src/modules/profesor/components/OptimizedVistaPreviaSala.jsx` - Modificado
4. `backend/misionemprende/api/views.py` - Ya existente (sin cambios)
5. `backend/misionemprende/api/urls.py` - Ya existente (sin cambios)

---

## 🧪 Para Probar

### 1. Levantar el backend:
```powershell
cd backend/misionemprende
python manage.py runserver
```

### 2. Levantar el frontend:
```powershell
cd frontend
npm start
```

### 3. En el navegador:
1. Ir a la página de creación de grupos
2. Cargar un CSV con estudiantes
3. Organizar en grupos usando drag & drop
4. Hacer clic en "CONFIRMAR Y LANZAR JUEGO"
5. Verificar en la consola los logs
6. Confirmar navegación a `/profesor/waiting-room/{PIN}`

### 4. Verificar en la base de datos:
```sql
SELECT * FROM partida ORDER BY id DESC LIMIT 1;
SELECT * FROM equipo ORDER BY id DESC LIMIT 5;
SELECT * FROM partida_usuario ORDER BY partida_id DESC LIMIT 10;
```

---

## 🎯 Próximos Pasos

- [ ] Implementar endpoint `GET /api/partida/verificar/{pin}/`
- [ ] Agregar WebSocket para actualizaciones en tiempo real
- [ ] Guardar estado del juego cuando se inicia desde waiting room
- [ ] Implementar lógica de fases y progreso de equipos
