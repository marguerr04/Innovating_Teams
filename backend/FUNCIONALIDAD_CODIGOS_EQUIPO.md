# 🎯 Funcionalidad de Códigos de Equipo - IMPLEMENTADO Y VALIDADO

##  Estado de Implementación

**FECHA:** 29 de noviembre de 2025  
**ESTADO:**  **COMPLETAMENTE FUNCIONAL**  
**TODAS LAS PRUEBAS:**  **PASARON**

---

## 📋 Resumen Ejecutivo

Se implementó exitosamente un sistema de **códigos únicos por equipo** que permite a cada tablet/dispositivo identificarse de manera única dentro de una partida.

### Formato del Código
- **7 dígitos numéricos**: `PPPPPPN`
  - `PPPPPP` (6 dígitos): Código de la partida
  - `N` (1 dígito): Número del equipo (1-9)
  - **Ejemplo**: `3937061` = Partida 393706, Equipo 1

---

## 🏗️ Arquitectura Implementada

### 1. **Modelo de Datos** 

```python
# api/models.py - Clase Equipo
class Equipo(models.Model):
    nombreequipo = models.CharField(max_length=100)
    tamanoequipo = models.IntegerField(blank=True, null=True)
    codigo_equipo = models.CharField(
        max_length=10, 
        unique=True,  # ⚠️ IMPORTANTE: Índice único
        null=True, 
        blank=True,
        help_text="Código único partida-equipo para acceso del dispositivo"
    )
```

**Base de Datos:**
```sql
-- Migración 0011_equipo_codigo_equipo aplicada 
ALTER TABLE equipo 
ADD COLUMN codigo_equipo VARCHAR(10) UNIQUE;

CREATE INDEX idx_equipo_codigo ON equipo(codigo_equipo);
```

---

### 2. **Servicio de Generación** 

**Archivo:** `api/services/partida_service.py`  
**Función:** `asignar_grupos_logic()`  
**Líneas:** 85-125

```python
def asignar_grupos_logic(partida, data_grupos):
    """
    Genera códigos únicos automáticamente al asignar equipos.
    Formato: {codigo_partida}{numero_equipo}
    """
    codigo_partida = partida.codigoacceso  # Ej: "393706"
    
    for idx, grupo_data in enumerate(data_grupos, start=1):
        # Crear equipo
        equipo = EquipoRepository.create(
            nombre=nombre_grupo,
            tamano=len(alumnos)
        )
        
        # Generar código: 393706 + 1 = 3937061
        codigo_equipo = f"{codigo_partida}{idx}"
        equipo.codigo_equipo = codigo_equipo
        equipo.save(update_fields=['codigo_equipo'])
        
        # Respuesta incluye el código
        equipos_creados.append({
            "equipo_id": equipo.id,
            "nombre": equipo.nombre,
            "codigo_equipo": codigo_equipo  # ⭐ NUEVO
        })
```

**Ejemplo de Respuesta:**
```json
{
  "mensaje": "Se asignaron 4 equipos a la partida",
  "partida_id": 64,
  "codigo_partida": "393706",
  "equipos": [
    {
      "equipo_id": 138,
      "nombre": "Equipo Innovadores",
      "codigo_equipo": "3937061",
      "cantidad_alumnos": 5
    },
    {
      "equipo_id": 139,
      "nombre": "Equipo Creativos",
      "codigo_equipo": "3937062",
      "cantidad_alumnos": 5
    }
  ]
}
```

---

### 3. **Endpoint de Validación** 

**Archivo:** `api/views/auth_views.py`  
**Función:** `validar_codigo_equipo()`  
**Líneas:** 191-287  
**URL:** `POST /api/validar-equipo/`

```python
@api_view(["POST"])
def validar_codigo_equipo(request):
    """
    Valida código partida-equipo de 7 dígitos.
    
    POST /api/validar-equipo/
    Body: { "codigo": "3937061" }
    
    Retorna:
    - valido: True/False
    - partida_id: ID de la partida
    - equipo_id: ID del equipo
    - equipo_nombre: Nombre del equipo
    - equipo_numero: Número del equipo (1-9)
    - mensaje: Mensaje de bienvenida
    """
```

**Validaciones Implementadas:**
1.  Código no vacío
2.  Formato: exactamente 7 dígitos numéricos
3.  Equipo existe en BD
4.  Equipo asignado a una partida
5.  Partida en estado válido (CONFIGURACION/EN_CURSO/ACTIVO)
6.  Código de partida coincide

**Ejemplo de Request/Response:**

```bash
# Request
POST http://localhost:8000/api/validar-equipo/
Content-Type: application/json

{
  "codigo": "3937061"
}

# Response (200 OK)
{
  "valido": true,
  "partida_id": 64,
  "partida_codigo": "393706",
  "equipo_id": 138,
  "equipo_nombre": "Equipo Innovadores",
  "equipo_numero": 1,
  "codigo_equipo": "3937061",
  "estado_partida": "CONFIGURACION",
  "mensaje": "¡Bienvenido al Equipo Innovadores!"
}

# Response Error (404)
{
  "error": "Código inválido. Verifica con tu profesor el código correcto de tu equipo"
}
```

---

## 🔬 Pruebas Realizadas

**Script:** `test_codigo_equipo.py`  
**Ubicación:** `backend/misionemprende/`

### Resultados de Todas las Pruebas 

```

  PRUEBAS DE FUNCIONALIDAD: CÓDIGOS DE EQUIPO


TEST 1: Verificar Modelo Equipo                    ✓ PASÓ
TEST 2: Crear Partida y Equipos                    ✓ PASÓ
TEST 3: Validar Código Válido                      ✓ PASÓ
TEST 4: Validar Códigos Inválidos                  ✓ PASÓ
TEST 5: Verificar Unicidad                         ✓ PASÓ

🎉 ¡TODAS LAS PRUEBAS PASARON!
El sistema de códigos de equipo está funcionando correctamente.
```

### Detalles de las Pruebas

####  Test 1: Verificar Modelo
- Campo `codigo_equipo` existe en tabla `equipo`
- Tipo: `VARCHAR(10)`
- Constraint: `UNIQUE`
- Nullable: `YES`

####  Test 2: Crear Partida y Equipos
```
Partida creada: ID=64, Código=393706
Equipo 1 creado: ID=138, Código=3937061
Equipo 2 creado: ID=139, Código=3937062
Equipo 3 creado: ID=140, Código=3937063
Equipo 4 creado: ID=141, Código=3937064
```

####  Test 3: Validar Código Válido
```
Código: 3937061
✓ Válido: True
✓ Partida ID: 64
✓ Equipo ID: 138
✓ Mensaje: "¡Bienvenido al Equipo Test 1!"
```

####  Test 4: Validar Códigos Inválidos
- Código vacío → `400 Bad Request`
- Código de 3 dígitos → `400 Bad Request`
- Código de 8 dígitos → `400 Bad Request`
- Código no numérico → `400 Bad Request`
- Código inexistente → `404 Not Found`

####  Test 5: Verificar Unicidad
- 0 códigos duplicados encontrados
- Constraint UNIQUE funcionando correctamente

---

## 📊 Flujo Completo de Uso

### 1. **Profesor Crea Partida**

```
POST /api/partida/
Body: { 
  "max_equipos": 4, 
  "max_participantes": 20 
}

Response:
{
  "id": 64,
  "codigoAcceso": "393706",  ⬅️ Código de 6 dígitos
  "estado": "CONFIGURACION"
}
```

### 2. **Profesor Asigna Equipos**

```
POST /api/partida/64/asignar-grupos/
Body: {
  "grupos": [
    { "nombre": "Equipo Innovadores", "alumnos": [...] },
    { "nombre": "Equipo Creativos", "alumnos": [...] },
    { "nombre": "Equipo Emprendedores", "alumnos": [...] },
    { "nombre": "Equipo Disruptores", "alumnos": [...] }
  ]
}

Response:
{
  "mensaje": "Se asignaron 4 equipos a la partida",
  "codigo_partida": "393706",
  "equipos": [
    { "codigo_equipo": "3937061", "nombre": "Equipo Innovadores" },
    { "codigo_equipo": "3937062", "nombre": "Equipo Creativos" },
    { "codigo_equipo": "3937063", "nombre": "Equipo Emprendedores" },
    { "codigo_equipo": "3937064", "nombre": "Equipo Disruptores" }
  ]
}
```

### 3. **Frontend Muestra Códigos al Profesor**

```jsx
<div className="codigos-equipos">
  <h2>Códigos de Acceso por Equipo</h2>
  
  <div className="equipo-card">
    <h3>Tablet 1: Equipo Innovadores</h3>
    <div className="codigo">3937061</div>
  </div>
  
  <div className="equipo-card">
    <h3>Tablet 2: Equipo Creativos</h3>
    <div className="codigo">3937062</div>
  </div>
  
  <div className="equipo-card">
    <h3>Tablet 3: Equipo Emprendedores</h3>
    <div className="codigo">3937063</div>
  </div>
  
  <div className="equipo-card">
    <h3>Tablet 4: Equipo Disruptores</h3>
    <div className="codigo">3937064</div>
  </div>
</div>
```

### 4. **Estudiante (Tablet) Ingresa Código**

```
POST /api/validar-equipo/
Body: { "codigo": "3937061" }

Response (200):
{
  "valido": true,
  "partida_id": 64,
  "equipo_id": 138,
  "equipo_nombre": "Equipo Innovadores",
  "mensaje": "¡Bienvenido al Equipo Innovadores!"
}
```

### 5. **Frontend Guarda Identidad en localStorage**

```javascript
// Después de validación exitosa
localStorage.setItem('partida_id', response.partida_id);
localStorage.setItem('equipo_id', response.equipo_id);
localStorage.setItem('equipo_nombre', response.equipo_nombre);
localStorage.setItem('codigo_equipo', response.codigo_equipo);

// Durante todo el juego, cada acción envía:
const payload = {
  equipo_id: localStorage.getItem('equipo_id'),
  partida_id: localStorage.getItem('partida_id'),
  // ... otros datos de la acción
};
```

---

## 🔒 Seguridad y Validaciones

### Validaciones en Backend

1. **Formato del Código**
   ```python
   if not codigo.isdigit() or len(codigo) != 7:
       return Response({"error": "Código inválido"}, status=400)
   ```

2. **Existencia del Equipo**
   ```python
   try:
       equipo = Equipo.objects.get(codigo_equipo=codigo)
   except Equipo.DoesNotExist:
       return Response({"error": "Código inválido"}, status=404)
   ```

3. **Partida Asociada**
   ```python
   partida_usuario = PartidaUsuario.objects.filter(equipo=equipo).first()
   if not partida_usuario:
       return Response({"error": "Equipo no asignado"}, status=404)
   ```

4. **Estado de la Partida**
   ```python
   if partida.estado not in ['CONFIGURACION', 'EN_CURSO', 'ACTIVO']:
       return Response({"error": "Partida no disponible"}, status=403)
   ```

### Constraint de Base de Datos

```sql
-- Garantiza unicidad a nivel de BD
ALTER TABLE equipo 
ADD CONSTRAINT unique_codigo_equipo UNIQUE (codigo_equipo);
```

---

## 📁 Archivos Modificados/Creados

###  Archivos del Sistema

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `api/models.py` | Modificado | Agregado campo `codigo_equipo` a clase Equipo |
| `api/migrations/0011_equipo_codigo_equipo.py` | Creado | Migración para agregar columna |
| `api/services/partida_service.py` | Modificado | Genera códigos en `asignar_grupos_logic()` |
| `api/views/auth_views.py` | Modificado | Endpoint `validar_codigo_equipo()` corregido |
| `api/urls.py` | Sin cambios | URL ya registrada previamente |

###  Archivos de Prueba

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `test_codigo_equipo.py` | Creado | Script completo de pruebas automatizadas |
| `FUNCIONALIDAD_CODIGOS_EQUIPO.md` | Creado | Este documento de documentación |

---

## 🚀 Próximos Pasos (Frontend)

### 1. Actualizar Componente de Entrada de Código

**Archivo:** `frontend/src/modules/student/features/Phase-2/index.jsx`

```jsx
const IngresarCodigoEquipo = () => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/api/validar-equipo/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error);
        return;
      }
      
      // Guardar identidad del equipo
      localStorage.setItem('partida_id', data.partida_id);
      localStorage.setItem('equipo_id', data.equipo_id);
      localStorage.setItem('equipo_nombre', data.equipo_nombre);
      localStorage.setItem('codigo_equipo', data.codigo_equipo);
      
      // Redirigir al juego
      navigate('/estudiante/fase-1');
      
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };
  
  return (
    <div className="ingreso-codigo">
      <h2>Ingresa el código de tu equipo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 7))}
          placeholder="Ej: 3937061"
          maxLength="7"
          className="input-codigo"
        />
        <button type="submit" disabled={codigo.length !== 7}>
          Ingresar
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
```

### 2. Mostrar Códigos al Profesor

**Archivo:** `frontend/src/modules/professor/features/AsignarGrupos.jsx`

```jsx
// Después de asignar grupos exitosamente
const mostrarCodigosGenerados = (response) => {
  return (
    <div className="codigos-generados">
      <h2> Equipos creados exitosamente</h2>
      <p>Comparte estos códigos con cada equipo:</p>
      
      {response.equipos.map((equipo, idx) => (
        <div key={equipo.equipo_id} className="tarjeta-codigo">
          <div className="numero-tablet">Tablet {idx + 1}</div>
          <h3>{equipo.nombre}</h3>
          <div className="codigo-grande">{equipo.codigo_equipo}</div>
          <p className="cantidad-alumnos">
            {equipo.cantidad_alumnos} estudiantes
          </p>
        </div>
      ))}
      
      <button onClick={imprimirCodigos}>
        🖨️ Imprimir Códigos
      </button>
    </div>
  );
};
```

---

## 📞 Soporte y Mantenimiento

### Comandos Útiles

```bash
# Ejecutar pruebas
cd backend/misionemprende
python test_codigo_equipo.py

# Verificar migración
python manage.py showmigrations api

# Verificar sintaxis Django
python manage.py check

# Consultar equipos con código
python manage.py shell
>>> from api.models import Equipo
>>> Equipo.objects.filter(codigo_equipo__isnull=False)
```

### Troubleshooting

**Problema:** Códigos duplicados  
**Solución:** El constraint UNIQUE en BD lo previene automáticamente

**Problema:** Código no valida  
**Solución:** Verificar que equipo esté asociado a partida en tabla `partida_usuario`

**Problema:** Partida no disponible  
**Solución:** Verificar campo `estado` de la partida (debe ser CONFIGURACION/EN_CURSO/ACTIVO)

---

##  Checklist Final

- [x] Campo `codigo_equipo` agregado al modelo
- [x] Migración 0011 creada y aplicada
- [x] Servicio genera códigos automáticamente
- [x] Endpoint de validación implementado
- [x] URL registrada en `urls.py`
- [x] Todas las validaciones implementadas
- [x] Constraint UNIQUE en base de datos
- [x] Script de pruebas completo
- [x] **TODAS LAS PRUEBAS PASARON **
- [ ] Frontend actualizado (PENDIENTE)
- [ ] Pruebas end-to-end con frontend (PENDIENTE)

---

## 🎉 Conclusión

El backend está **100% funcional y probado**. El sistema genera códigos únicos por equipo, los valida correctamente, y mantiene la integridad de los datos mediante constraints de base de datos.

**Siguiente paso:** Actualizar el frontend para usar el endpoint `/api/validar-equipo/` en lugar de `/api/validar-codigo/`.

---

**Documentación generada:** 29 de noviembre de 2025  
**Autor:** GitHub Copilot  
**Versión:** 1.0.0
