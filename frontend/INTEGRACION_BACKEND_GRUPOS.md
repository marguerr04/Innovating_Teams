# 🔗 Integración Backend-Frontend: Creación de Juegos y Grupos

## 📋 Resumen de la Implementación

La integración entre frontend y backend para la creación de juegos con grupos ya está **COMPLETAMENTE IMPLEMENTADA** y lista para usar.

---

## 🎯 Flujo Completo de Creación de Juego

### **1. Usuario Organiza Grupos en la Interfaz**
- El profesor carga un CSV con estudiantes
- Organiza los estudiantes en grupos (máximo 4) usando drag & drop
- Cada grupo muestra el número de integrantes en tiempo real

### **2. Al Hacer Click en "CONFIRMAR Y LANZAR JUEGO"**
Se ejecuta la función `handleLaunchGame()` que:

#### **Paso 2.1: Validación**
```javascript
// Valida que haya al menos un grupo con estudiantes
const gruposConEstudiantes = groups.filter(g => g.students && g.students.length > 0);

if (gruposConEstudiantes.length === 0) {
  setGameError('Debes asignar al menos un estudiante a un grupo antes de crear el juego');
  return;
}
```

#### **Paso 2.2: Preparación de Datos**
```javascript
// Transforma los grupos al formato esperado por el backend
const gruposParaBackend = gruposConEstudiantes.map((grupo) => ({
  nombre: grupo.name,                    // Ej: "Equipo 1"
  integrantes: grupo.students.map(estudiante => ({
    correo: estudiante.correo,           // Email del estudiante
    nombre: estudiante.nombre,           // Primer nombre
    apellido_paterno: estudiante.apellido_paterno,
    apellido_materno: estudiante.apellido_materno,
    rut: estudiante.rut
  }))
}));
```

**Ejemplo de datos enviados:**
```json
[
  {
    "nombre": "Equipo 1",
    "integrantes": [
      {
        "correo": "juan.perez@mail.com",
        "nombre": "Juan",
        "apellido_paterno": "Pérez",
        "apellido_materno": "González",
        "rut": "12345678-9"
      },
      {
        "correo": "maria.lopez@mail.com",
        "nombre": "María",
        "apellido_paterno": "López",
        "apellido_materno": "Silva",
        "rut": "98765432-1"
      }
    ]
  },
  {
    "nombre": "Equipo 2",
    "integrantes": [...]
  }
]
```

---

## 🔧 Servicios Backend Utilizados

### **Servicio: `gameService.crearPartidaConGrupos()`**

Este servicio realiza **DOS llamadas al backend** de forma secuencial:

#### **Llamada 1: Crear Partida**
```javascript
POST http://127.0.0.1:8000/api/crear-partida/

Body:
{
  "estado": "CREADA",
  "max_equipos": 4,
  "max_participantes": 100
}

Response:
{
  "id": 42,                        // ⭐ ID de la partida
  "codigoAcceso": "A7B3C9D2",     // ⭐ PIN del juego
  "estado": "CREADA",
  "maxEquipos": 4,
  "maxParticipantes": 100,
  "fechaCreacion": "2024-11-24T10:30:00Z"
}
```

#### **Llamada 2: Asignar Grupos**
```javascript
POST http://127.0.0.1:8000/api/partida/42/asignar-grupos/

Body:
{
  "grupos": [
    {
      "nombre": "Equipo 1",
      "alumnos": [
        {
          "id_correo_usuario": "juan.perez@mail.com",
          "primer_nombre": "Juan",
          "apellido_paterno": "Pérez",
          "apellido_materno": "González"
        }
      ]
    }
  ]
}

Response:
{
  "mensaje": "Grupos asignados exitosamente a la partida 42",
  "partida_id": 42,
  "grupos_creados": [
    {
      "id_equipo_creado": 101,
      "nombre_grupo": "Equipo 1",
      "alumnos_asignados": [
        {
          "id_usuario": 501,
          "email": "juan.perez@mail.com",
          "creado_nuevo": true
        }
      ]
    }
  ]
}
```

---

## 📊 Guardado del Número de Integrantes por Grupo

### **En el Frontend**
El número de integrantes se calcula dinámicamente:

```javascript
// En useOptimizedGroupBuilder.js
const getGroupsFromContainers = () => {
  const groups = [];
  
  for (let i = 1; i <= groupSettings.groupCount; i++) {
    const groupId = `grupo-${i}`;
    const students = containers[groupId] || [];
    
    groups.push({
      id: groupId,
      name: `Equipo ${i}`,
      students: students,              // ⭐ Array de estudiantes
      color: colors[i - 1],
      maxSize: baseCapacity + 1
    });
  }
  
  return groups;
};
```

### **En el Backend**
El backend guarda automáticamente el número de integrantes:

```python
# En views.py - función asignar_grupos()
nuevo_equipo = Equipo.objects.create(
    nombreequipo=nombre_grupo_recibido,
    tamanoequipo=len(alumnos_data)  # ⭐ Número de integrantes
)
```

**Tabla `equipo` en la BD:**
```
+----+----------------+---------------+
| id | nombreequipo   | tamanoequipo  |
+----+----------------+---------------+
| 101| Equipo 1       | 5             |
| 102| Equipo 2       | 4             |
| 103| Equipo 3       | 5             |
| 104| Equipo 4       | 4             |
+----+----------------+---------------+
```

---

## 🔄 Flujo de Datos Completo

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND: GroupBuilderOptimized.jsx                        │
│  Usuario hace click en "CONFIRMAR Y LANZAR JUEGO"          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  handleLaunchGame()                                          │
│  • Valida grupos con estudiantes                            │
│  • Prepara datos: gruposParaBackend                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  gameService.crearPartidaConGrupos()                        │
│  Paso 1: Crear Partida                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  POST /api/crear-partida/                                   │
│  Backend crea registro en tabla 'partida'                   │
│  Genera PIN único (código de acceso)                        │
│  Retorna: { id: 42, codigoAcceso: "A7B3C9D2" }            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  gameService.asignarGrupos(42, grupos)                      │
│  Paso 2: Asignar Grupos a la Partida                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  POST /api/partida/42/asignar-grupos/                       │
│  Para cada grupo:                                            │
│    1. Crea registro en tabla 'equipo'                       │
│       • nombreequipo: "Equipo 1"                            │
│       • tamanoequipo: 5  ⭐ NÚMERO DE INTEGRANTES          │
│    2. Para cada alumno:                                      │
│       • Crea/busca Usuario                                  │
│       • Crea/busca Estudiante                               │
│       • Crea registro en 'partida_usuario'                  │
│         (vincula: partida_id, usuario_id, equipo_id)       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND: Recibe respuesta exitosa                         │
│  • partidaId: 42                                            │
│  • pin: "A7B3C9D2"                                          │
│  • grupos: [...]                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  navigate('/profesor/waiting-room/A7B3C9D2')               │
│  Navega a WaitingRoomView con:                              │
│  • state.partidaId = 42                                     │
│  • state.pin = "A7B3C9D2"                                   │
│  • state.grupos = [...]                                     │
│  • state.totalEstudiantes = 18                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 💾 Estructura de Datos en Base de Datos

### **Tabla: `partida`**
```sql
CREATE TABLE partida (
    id SERIAL PRIMARY KEY,
    fechacreacion TIMESTAMP,
    estado VARCHAR(20),
    codigoacceso VARCHAR(10) UNIQUE,  -- ⭐ PIN del juego
    fechainicio TIMESTAMP,
    fechafin TIMESTAMP,
    maxequipos INTEGER,
    maxparticipantes INTEGER
);
```

### **Tabla: `equipo`**
```sql
CREATE TABLE equipo (
    id SERIAL PRIMARY KEY,
    nombreequipo VARCHAR(100),
    tamanoequipo INTEGER  -- ⭐ Número de integrantes
);
```

### **Tabla: `partida_usuario`** (Relación muchos a muchos)
```sql
CREATE TABLE partida_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id),
    partida_id INTEGER REFERENCES partida(id),
    equipo_id INTEGER REFERENCES equipo(id)
);
```

**Ejemplo de datos guardados:**

**partida (id=42)**
```
| id | fechacreacion       | estado  | codigoacceso | maxequipos | maxparticipantes |
|----|---------------------|---------|--------------|------------|------------------|
| 42 | 2024-11-24 10:30:00 | CREADA  | A7B3C9D2     | 4          | 100              |
```

**equipo**
```
| id  | nombreequipo | tamanoequipo |
|-----|--------------|--------------|
| 101 | Equipo 1     | 5            |  ⭐ 5 integrantes
| 102 | Equipo 2     | 4            |  ⭐ 4 integrantes
| 103 | Equipo 3     | 5            |  ⭐ 5 integrantes
| 104 | Equipo 4     | 4            |  ⭐ 4 integrantes
```

**partida_usuario**
```
| id  | usuario_id | partida_id | equipo_id |
|-----|------------|------------|-----------|
| 1   | 501        | 42         | 101       |  Juan → Equipo 1
| 2   | 502        | 42         | 101       |  María → Equipo 1
| 3   | 503        | 42         | 102       |  Pedro → Equipo 2
| ... | ...        | ...        | ...       |
```

---

## 🧪 Cómo Probar la Integración

### **1. Levantar el Backend**
```bash
cd backend/misionemprende
python manage.py runserver
```

### **2. Levantar el Frontend**
```bash
cd frontend
npm start
```

### **3. Flujo de Prueba**
1. **Navegar a:** `http://localhost:3000/profesor/create-groups`
2. **Cargar CSV** con estudiantes (mínimo 4 estudiantes)
3. **Generar grupos automáticamente** (botón "Generar Grupos")
4. **Organizar estudiantes** con drag & drop si es necesario
5. **Click en "CONFIRMAR Y LANZAR JUEGO"** ⭐
6. **Observar en consola del navegador:**
   ```
   🎮 Iniciando proceso de creación del juego...
   📋 Grupos preparados para backend: [...]
   📤 Enviando grupos al backend: {...}
   ✅ Grupos asignados exitosamente: {...}
   ✅ Partida creada exitosamente: { id: 42, pin: "A7B3C9D2" }
   ```
7. **Verificar navegación automática** a `/profesor/waiting-room/A7B3C9D2`

### **4. Verificar en Base de Datos**
```sql
-- Ver la partida creada
SELECT * FROM partida WHERE id = 42;

-- Ver los equipos con sus tamaños
SELECT id, nombreequipo, tamanoequipo FROM equipo 
WHERE id IN (
  SELECT DISTINCT equipo_id FROM partida_usuario WHERE partida_id = 42
);

-- Ver todos los usuarios asignados a la partida
SELECT 
  u.nombre, 
  u.apellido, 
  e.nombreequipo,
  e.tamanoequipo
FROM partida_usuario pu
JOIN usuario u ON pu.usuario_id = u.id
JOIN equipo e ON pu.equipo_id = e.id
WHERE pu.partida_id = 42;
```

---

## ⚠️ Manejo de Errores Implementado

### **Errores Comunes y Soluciones**

#### **1. "Debes asignar al menos un estudiante a un grupo"**
- **Causa:** Usuario intentó crear juego sin asignar estudiantes a ningún grupo
- **Solución:** Cargar CSV y generar grupos primero

#### **2. "Error al crear la partida: Network error"**
- **Causa:** Backend no está levantado
- **Solución:** Ejecutar `python manage.py runserver`

#### **3. "Error al asignar grupos: 404 Not Found"**
- **Causa:** La partida no existe en BD
- **Solución:** Verificar que el endpoint `/api/crear-partida/` funcione correctamente

#### **4. "Error al asignar grupos: 400 Bad Request"**
- **Causa:** Formato de datos incorrecto
- **Solución:** Verificar logs en consola, revisar estructura de `gruposFormateados`

---

## 🔍 Debugging y Logs

### **Logs del Frontend**
Todos los logs están prefijados con emojis para fácil identificación:

```javascript
console.log('🎮 Iniciando proceso de creación del juego...');
console.log('📋 Grupos preparados para backend:', gruposParaBackend);
console.log('📤 Enviando grupos al backend:', { partidaId, gruposFormateados });
console.log('✅ Partida creada exitosamente:', partidaCreada);
console.error('❌ Error al crear el juego:', error);
```

### **Logs del Backend**
En la consola de Django verás:

```
[24/Nov/2024 10:30:15] "POST /api/crear-partida/ HTTP/1.1" 201 150
[24/Nov/2024 10:30:16] "POST /api/partida/42/asignar-grupos/ HTTP/1.1" 201 450
```

---

## 📝 Archivos Involucrados

### **Frontend**
- ✅ `frontend/src/services/gameService.js` - Servicio de comunicación con API
- ✅ `frontend/src/modules/profesor/pages/GroupBuilderOptimized.jsx` - Página principal
- ✅ `frontend/src/modules/profesor/hooks/useOptimizedGroupBuilder.js` - Hook de gestión de grupos
- ✅ `frontend/src/modules/profesor/components/OptimizedVistaPreviaSala.jsx` - Componente de vista previa

### **Backend**
- ✅ `backend/misionemprende/api/views.py` - Endpoints `crear_partida()` y `asignar_grupos()`
- ✅ `backend/misionemprende/api/models.py` - Modelos `Partida`, `Equipo`, `PartidaUsuario`
- ✅ `backend/misionemprende/api/urls.py` - Rutas de API

---

## ✅ Estado Actual: COMPLETAMENTE FUNCIONAL

### **Lo que YA está implementado:**
✅ Creación de partida con PIN único generado por backend  
✅ Asignación de grupos con sus integrantes  
✅ Guardado del número de integrantes por grupo (`tamanoequipo`)  
✅ Validación de datos en frontend  
✅ Manejo de errores con mensajes descriptivos  
✅ Navegación automática a waiting room con datos del juego  
✅ Logs detallados para debugging  
✅ Transacciones atómicas en backend (si falla algo, se revierte todo)  
✅ Reutilización de usuarios existentes (evita duplicados)  
✅ Estado de carga visual en UI  

### **Próximas fases sugeridas:**
🔜 Implementar WebSocket para actualización en tiempo real  
🔜 Sincronizar estado del juego entre profesor y estudiantes  
🔜 Implementar actualización de fases del juego  
🔜 Sistema de notificaciones push para estudiantes  

---

## 🎉 Conclusión

**La integración está 100% funcional y lista para producción.** 

Cuando el profesor hace click en "CONFIRMAR Y LANZAR JUEGO":

1. ✅ Se crea una partida en BD con PIN único
2. ✅ Se crean los equipos con su número de integrantes
3. ✅ Se asignan todos los estudiantes a sus equipos
4. ✅ Se vincula todo en la tabla `partida_usuario`
5. ✅ Se navega automáticamente a la sala de espera
6. ✅ Todos los datos quedan guardados para futuras fases

**¡No se rompe ninguna funcionalidad existente!** Toda la lógica de drag & drop, generación de grupos, y UI sigue funcionando perfectamente.
