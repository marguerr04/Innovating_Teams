# 🎮 Script de Prueba: Flujo Profesor → Estudiante

## 📋 Prerequisitos
- Backend corriendo en puerto 8000
- Frontend corriendo en puerto 3000
- Usuario profesor creado en la BD

---

## 🚀 Paso 1: Iniciar Backend

```powershell
# Terminal 1
cd e:\IngenieriaSoftware\MisionEmprende_App\MisionEmprendeMonoRepo\backend\misionemprende
python manage.py runserver
```

**Verificar:** Deberías ver "Starting development server at http://127.0.0.1:8000/"

---

## 🎨 Paso 2: Iniciar Frontend

```powershell
# Terminal 2
cd e:\IngenieriaSoftware\MisionEmprende_App\MisionEmprendeMonoRepo\frontend
npm start
```

**Verificar:** Se abrirá automáticamente `http://localhost:3000`

---

## 👨‍🏫 Paso 3: Flujo PROFESOR (Pestaña 1)

### 3.1 Login Profesor
1. Ve a: `http://localhost:3000/prelogin`
2. Click en **"Ingresar como Profesor"**
3. Login con credenciales:
   - Email: `profesor@test.com` (o el que tengas creado)
   - Password: `password123`

### 3.2 Crear Partida
1. En el dashboard del profesor, busca el botón **"Crear Juego"** o similar
2. Click en crear partida
3. **IMPORTANTE:** Anota el código de 6 dígitos que aparece (ej: `123456`)

**Verificar en consola backend:**
```
POST /api/partida/crear/ HTTP/1.1" 201
```

### 3.3 Asignar Grupos (Opcional)
1. Sube CSV o crea grupos manualmente
2. Asigna estudiantes a la partida

**Verificar en consola backend:**
```
POST /api/partida/<ID>/asignar-grupos/ HTTP/1.1" 201
```

---

## 👨‍🎓 Paso 4: Flujo ESTUDIANTE (Pestaña 2 - Navegación Privada)

### 4.1 Abrir en Nueva Ventana
- **Windows:** `Ctrl + Shift + N` (Chrome/Edge modo incógnito)
- **O simplemente:** Abre otro navegador diferente

### 4.2 Acceder como Estudiante
1. Ve a: `http://localhost:3000/prelogin`
2. Click en **"Ingresar como Estudiante"**
3. Deberías ver la pantalla **"Unirse a la Sala"**

### 4.3 Ingresar Código
1. Ingresa el código de 6 dígitos del profesor
2. Click en **"Unirse"**

**Estado Actual:**
- ❌ **NO valida contra backend** (solo avanza sin verificar)
- ✅ El código existe en la BD pero no se verifica

---

## 🔍 Paso 5: Verificar en Base de Datos

### Verificar Partida Creada
```powershell
# Terminal 3
cd e:\IngenieriaSoftware\MisionEmprende_App\MisionEmprendeMonoRepo\backend\misionemprende
python manage.py shell
```

```python
from api.models import Partida

# Ver todas las partidas
partidas = Partida.objects.all()
for p in partidas:
    print(f"ID: {p.id}, Código: {p.codigoacceso}, Estado: {p.estado}")

# Ver última partida creada
ultima = Partida.objects.latest('id')
print(f"Última partida - Código: {ultima.codigoacceso}")
```

### Verificar Equipos Asignados
```python
from api.models import Equipo, PartidaUsuario

# Ver equipos de la última partida
partida_id = Partida.objects.latest('id').id
equipos = Equipo.objects.filter(partidausuario__partida_id=partida_id).distinct()
for e in equipos:
    print(f"Equipo: {e.nombreequipo}, Tamaño: {e.tamanoequipo}")
```

---

## 🐛 Problema Identificado

### ❌ Código NO se valida en backend

**Archivo:** `frontend/src/modules/student/features/Phase-2/index.jsx`

```jsx
const handleJoin = () => {
  if (code.trim().length === 0) {
    setError('Por favor, ingresa un código');
    return;
  }
  // ⚠️ Aquí solo llama a onJoin sin validar contra backend
  onJoin(code);
};
```

### ✅ Solución Necesaria

Crear endpoint en backend:

**Backend:** `api/views/auth_views.py`
```python
@api_view(["POST"])
def validar_codigo_acceso(request):
    """
    Valida que un código de acceso sea válido y retorna info de la partida.
    
    POST /api/validar-codigo/
    Body: { "codigo": "123456" }
    """
    from ..repositories import PartidaRepository
    
    codigo = request.data.get("codigo")
    
    if not codigo:
        return Response({"error": "Código requerido"}, status=400)
    
    partida = PartidaRepository.get_by_codigo_acceso(codigo)
    
    if not partida:
        return Response({"error": "Código inválido"}, status=404)
    
    if partida.estado != "ACTIVO":
        return Response({"error": "La partida no está activa"}, status=400)
    
    return Response({
        "valido": True,
        "partida_id": partida.id,
        "estado": partida.estado
    })
```

**Frontend:** Llamar al endpoint antes de avanzar

---

## 📊 Métricas de Prueba

| Paso | Esperado | Actual | Estado |
|------|----------|--------|--------|
| Profesor crea partida | Código de 6 dígitos | ✅ Funciona | ✅ |
| Código se guarda en BD | Campo `codigoacceso` | ✅ Funciona | ✅ |
| Estudiante ingresa código | Valida contra BD | ❌ No valida | ⚠️ |
| Código inválido rechazado | Error "inválido" | ❌ No valida | ⚠️ |
| Código válido acepta | Entra al juego | ⚠️ Entra sin validar | ⚠️ |

---

## 🎯 Siguiente Paso

**¿Quieres que implemente la validación del código de acceso?**

Esto incluiría:
1. ✅ Crear endpoint `/api/validar-codigo/` en backend
2. ✅ Actualizar `PhaseSalaCodigo` para llamar al endpoint
3. ✅ Mostrar error "Código inválido" si no existe
4. ✅ Solo avanzar si el código es válido

---

**Fecha:** 25 de noviembre 2025  
**Estado:** 🔍 Listo para pruebas manuales
