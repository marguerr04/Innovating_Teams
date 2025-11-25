# 📊 DIAGRAMA VISUAL: Flujo de Integración Backend-Frontend

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                    INTERFAZ DE ORDENAR GRUPOS                             ║
║                  (GroupBuilderOptimized.jsx)                              ║
╚═══════════════════════════════════════════════════════════════════════════╝
                                    │
                                    │ 1. Usuario organiza grupos
                                    │    con drag & drop
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  GRUPOS ORGANIZADOS                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │  Equipo 1   │  │  Equipo 2   │  │  Equipo 3   │  │  Equipo 4   │   │
│  │  👤👤👤👤👤 │  │  👤👤👤👤   │  │  👤👤👤👤👤 │  │  👤👤👤👤   │   │
│  │  5 integ.   │  │  4 integ.   │  │  5 integ.   │  │  4 integ.   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 2. Click en botón
                                    ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║          🚀 CONFIRMAR Y LANZAR JUEGO                                      ║
║          handleLaunchGame() se ejecuta                                    ║
╚═══════════════════════════════════════════════════════════════════════════╝
                                    │
                                    │ 3. Preparar datos
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  TRANSFORMACIÓN DE DATOS                                                  │
│  {                                                                        │
│    grupos: [                                                              │
│      {                                                                    │
│        nombre: "Equipo 1",                                                │
│        integrantes: [                                                     │
│          { correo: "juan@mail.com", nombre: "Juan", ... },              │
│          { correo: "maria@mail.com", nombre: "María", ... },            │
│          ...                                                              │
│        ]                                                                  │
│      },                                                                   │
│      ...                                                                  │
│    ]                                                                      │
│  }                                                                        │
└───────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 4. Enviar al backend
                                    ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║                  gameService.crearPartidaConGrupos()                      ║
╚═══════════════════════════════════════════════════════════════════════════╝
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        │                                                       │
        ▼                                                       ▼
┌─────────────────────┐                             ┌─────────────────────┐
│  PASO 1             │                             │  PASO 2             │
│  Crear Partida      │                             │  Asignar Grupos     │
└─────────────────────┘                             └─────────────────────┘
        │                                                       │
        │ POST /api/crear-partida/                              │
        ▼                                                       │
┌─────────────────────────────────────┐                        │
│  BACKEND: crear_partida()           │                        │
│  • Crea registro en tabla partida   │                        │
│  • Genera ID único                   │                        │
│  • Genera PIN único (uuid)           │                        │
└─────────────────────────────────────┘                        │
        │                                                       │
        │ Retorna:                                              │
        │ { id: 42, codigoAcceso: "A7B3C9D2" }                 │
        ▼                                                       │
┌─────────────────────────────────────┐                        │
│  partidaId = 42                      │────────────────────────┤
│  pin = "A7B3C9D2"                    │                        │
└─────────────────────────────────────┘                        │
                                                                │
                         POST /api/partida/42/asignar-grupos/ ◄─┘
                                                                │
                                                                ▼
                              ┌─────────────────────────────────────────┐
                              │  BACKEND: asignar_grupos(42)            │
                              │  Para cada grupo:                        │
                              │  1. Crear Equipo                         │
                              │     • nombreequipo = "Equipo 1"          │
                              │     • tamanoequipo = 5 ⭐               │
                              │  2. Para cada alumno:                    │
                              │     • Crear/buscar Usuario               │
                              │     • Crear/buscar Estudiante            │
                              │     • Crear PartidaUsuario               │
                              └─────────────────────────────────────────┘
                                                                │
                                                                │ Retorna:
                                                                ▼
                              ┌─────────────────────────────────────────┐
                              │  {                                      │
                              │    mensaje: "Grupos asignados...",      │
                              │    partida_id: 42,                      │
                              │    grupos_creados: [                    │
                              │      {                                  │
                              │        id_equipo_creado: 101,           │
                              │        nombre_grupo: "Equipo 1",        │
                              │        alumnos_asignados: [...]         │
                              │      },                                 │
                              │      ...                                │
                              │    ]                                    │
                              │  }                                      │
                              └─────────────────────────────────────────┘
                                                                │
                                                                ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║                    DATOS GUARDADOS EN BASE DE DATOS                       ║
╚═══════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────┐
│  TABLA: partida                                                         │
├────────┬──────────────┬─────────┬──────────────┬─────────┬──────────────┤
│   id   │ codigoacceso │ estado  │  maxequipos  │ fecha..│ maxpartic... │
├────────┼──────────────┼─────────┼──────────────┼─────────┼──────────────┤
│   42   │   A7B3C9D2   │ CREADA  │      4       │ 2024... │     100      │
└────────┴──────────────┴─────────┴──────────────┴─────────┴──────────────┘
                                    │
                                    │ partida_id
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TABLA: equipo                                                          │
├────────┬──────────────┬──────────────┐                                  │
│   id   │ nombreequipo │ tamanoequipo │  ⭐ NÚMERO DE INTEGRANTES       │
├────────┼──────────────┼──────────────┤                                  │
│  101   │  Equipo 1    │      5       │  ← Calculado automáticamente     │
│  102   │  Equipo 2    │      4       │  ← len(alumnos_data)            │
│  103   │  Equipo 3    │      5       │                                  │
│  104   │  Equipo 4    │      4       │                                  │
└────────┴──────────────┴──────────────┘                                  │
           │                                                               │
           │ equipo_id                                                     │
           ▼                                                               │
┌─────────────────────────────────────────────────────────────────────────┐
│  TABLA: partida_usuario (vinculación)                                   │
├────────┬─────────────┬────────────┬───────────┐                         │
│   id   │ usuario_id  │ partida_id │ equipo_id │                         │
├────────┼─────────────┼────────────┼───────────┤                         │
│    1   │    501      │     42     │    101    │  Juan → Partida 42, Equipo 1
│    2   │    502      │     42     │    101    │  María → Partida 42, Equipo 1
│    3   │    503      │     42     │    102    │  Pedro → Partida 42, Equipo 2
│   ...  │    ...      │    ...     │    ...    │                         │
└────────┴─────────────┴────────────┴───────────┘                         │
                                                                           │
                                    ✅ TODO GUARDADO CORRECTAMENTE         │
                                                                           │
╔═══════════════════════════════════════════════════════════════════════════╗
║                    FRONTEND RECIBE RESPUESTA EXITOSA                      ║
╚═══════════════════════════════════════════════════════════════════════════╝
                                    │
                                    │ 5. Navegar automáticamente
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  navigate('/profesor/waiting-room/A7B3C9D2', {                           │
│    state: {                                                               │
│      partidaId: 42,              ⭐ ID para futuras fases                │
│      pin: "A7B3C9D2",            ⭐ PIN del juego                        │
│      grupos: [...],              ⭐ Datos de los grupos                  │
│      totalEstudiantes: 18        ⭐ Total de participantes               │
│    }                                                                      │
│  })                                                                       │
└───────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║                        WAITING ROOM VIEW                                  ║
║                   /profesor/waiting-room/A7B3C9D2                         ║
║                                                                           ║
║  • Muestra PIN: A7B3C9D2                                                  ║
║  • Muestra 4 grupos con sus integrantes                                   ║
║  • Botón "Comenzar Juego"                                                 ║
║  • Preparado para siguiente fase del juego                                ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 📝 RESUMEN EN 5 PUNTOS

### 1️⃣ **Click en "CONFIRMAR Y LANZAR JUEGO"**
   - Ejecuta `handleLaunchGame()`
   - Valida que haya grupos con estudiantes

### 2️⃣ **Crear Partida en Backend**
   - POST a `/api/crear-partida/`
   - Backend genera ID y PIN único
   - Retorna: `{ id: 42, codigoAcceso: "A7B3C9D2" }`

### 3️⃣ **Asignar Grupos a la Partida**
   - POST a `/api/partida/42/asignar-grupos/`
   - Backend crea:
     - Registros en tabla `equipo` con `tamanoequipo` ⭐
     - Registros en tabla `usuario`
     - Vinculaciones en tabla `partida_usuario`

### 4️⃣ **Número de Integrantes se Guarda Automáticamente**
   ```python
   # Backend en views.py
   tamanoequipo = len(alumnos_data)  # ⭐ Cuenta los integrantes
   
   nuevo_equipo = Equipo.objects.create(
       nombreequipo=nombre_grupo,
       tamanoequipo=tamanoequipo  # ⭐ Se guarda en BD
   )
   ```

### 5️⃣ **Navegación Automática con Datos del Juego**
   - Frontend navega a `/profesor/waiting-room/{PIN}`
   - Pasa `partidaId` para futuras fases
   - Todo queda guardado en BD para consultas posteriores

---

## 🎯 PUNTO CLAVE: ¿Dónde se Guarda el Número de Integrantes?

```
FRONTEND                        BACKEND                         BASE DE DATOS
---------                       -------                         -------------

grupo.students = [              alumnos_data = [                equipo
  {id:1, ...},                    {...},                        ┌──────────────┐
  {id:2, ...},                    {...},                        │ tamanoequipo │
  {id:3, ...},    ─────────►      {...},        ─────────►     │      5       │
  {id:4, ...},                    {...},                        └──────────────┘
  {id:5, ...}                     {...}                              ▲
]                               ]                                    │
                                                                     │
Array con 5 estudiantes         Array con 5 objetos                len() = 5
```

**El backend cuenta automáticamente:**
```python
tamanoequipo = len(alumnos_data)  # 5
```

**Y lo guarda en la columna `tamanoequipo` de la tabla `equipo`** ⭐

---

## ✅ VERIFICACIÓN

### Verificar en la consola del navegador:
```javascript
✅ Partida creada exitosamente: { id: 42, pin: "A7B3C9D2" }
✅ Grupos asignados exitosamente
```

### Verificar en la base de datos:
```sql
SELECT id, nombreequipo, tamanoequipo FROM equipo
WHERE id IN (
  SELECT DISTINCT equipo_id 
  FROM partida_usuario 
  WHERE partida_id = 42
);

-- Resultado esperado:
-- Equipo 1: tamanoequipo = 5
-- Equipo 2: tamanoequipo = 4
-- Equipo 3: tamanoequipo = 5
-- Equipo 4: tamanoequipo = 4
```

---

## 🎉 CONCLUSIÓN

**TODO ESTÁ IMPLEMENTADO Y FUNCIONAL:**

✅ Integración Backend-Frontend completa  
✅ Número de integrantes se guarda automáticamente  
✅ ID de partida generado y retornado al frontend  
✅ PIN único para identificar el juego  
✅ Datos preparados para futuras fases  
✅ Sin romper funcionalidades existentes  

**El profesor solo necesita organizar los grupos y hacer click en el botón.**  
**¡El resto sucede automáticamente!** 🚀
