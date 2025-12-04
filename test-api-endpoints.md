# 🔧 Endpoints del Backend - Guía de Pruebas

## 📍 Base URL
```
http://127.0.0.1:8000/api/
```

---

## 🎮 ENDPOINTS PRINCIPALES

### 1️⃣ **CREAR PARTIDA (Crear Juego)**

**Endpoint:** `POST /api/crear-partida/`

**URL Completa:**
```
http://127.0.0.1:8000/api/crear-partida/
```

**Request Body:**
```json
{
  "estado": "CREADA",
  "max_equipos": 4,
  "max_participantes": 100
}
```

**Response Exitoso (201):**
```json
{
  "id": 42,
  "estado": "CREADA",
  "codigoAcceso": "A7B3C9D2",
  "maxEquipos": 4,
  "maxParticipantes": 100,
  "fechaCreacion": "2024-11-24T10:30:00Z"
}
```

**Probar con cURL:**
```bash
curl -X POST http://127.0.0.1:8000/api/crear-partida/ \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "CREADA",
    "max_equipos": 4,
    "max_participantes": 100
  }'
```

**Probar con PowerShell:**
```powershell
$body = @{
    estado = "CREADA"
    max_equipos = 4
    max_participantes = 100
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/crear-partida/" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

### 2️⃣ **ASIGNAR GRUPOS A PARTIDA**

**Endpoint:** `POST /api/partida/{partida_id}/asignar-grupos/`

**URL Completa (ejemplo con partida_id=42):**
```
http://127.0.0.1:8000/api/partida/42/asignar-grupos/
```

**Request Body:**
```json
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
        },
        {
          "id_correo_usuario": "maria.lopez@mail.com",
          "primer_nombre": "María",
          "apellido_paterno": "López",
          "apellido_materno": "Silva"
        }
      ]
    },
    {
      "nombre": "Equipo 2",
      "alumnos": [
        {
          "id_correo_usuario": "pedro.martinez@mail.com",
          "primer_nombre": "Pedro",
          "apellido_paterno": "Martínez",
          "apellido_materno": "Rojas"
        }
      ]
    }
  ]
}
```

**Response Exitoso (201):**
```json
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
        },
        {
          "id_usuario": 502,
          "email": "maria.lopez@mail.com",
          "creado_nuevo": true
        }
      ]
    },
    {
      "id_equipo_creado": 102,
      "nombre_grupo": "Equipo 2",
      "alumnos_asignados": [
        {
          "id_usuario": 503,
          "email": "pedro.martinez@mail.com",
          "creado_nuevo": true
        }
      ]
    }
  ]
}
```

**Probar con cURL:**
```bash
curl -X POST http://127.0.0.1:8000/api/partida/42/asignar-grupos/ \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

**Probar con PowerShell:**
```powershell
$body = @{
    grupos = @(
        @{
            nombre = "Equipo 1"
            alumnos = @(
                @{
                    id_correo_usuario = "juan.perez@mail.com"
                    primer_nombre = "Juan"
                    apellido_paterno = "Pérez"
                    apellido_materno = "González"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/partida/42/asignar-grupos/" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

### 3️⃣ **OBTENER GRUPOS DE UNA PARTIDA**

**Endpoint:** `GET /api/partida/{partida_id}/obtener-grupos/`

**URL Completa (ejemplo con partida_id=42):**
```
http://127.0.0.1:8000/api/partida/42/obtener-grupos/
```

**Response Exitoso (200):**
```json
{
  "grupos": [
    {
      "id": 101,
      "nombre": "Equipo 1",
      "tamanoequipo": 2,
      "integrantes": [
        {
          "id": 501,
          "email": "juan.perez@mail.com",
          "nombre": "Juan",
          "apellido": "Pérez González"
        },
        {
          "id": 502,
          "email": "maria.lopez@mail.com",
          "nombre": "María",
          "apellido": "López Silva"
        }
      ]
    },
    {
      "id": 102,
      "nombre": "Equipo 2",
      "tamanoequipo": 1,
      "integrantes": [
        {
          "id": 503,
          "email": "pedro.martinez@mail.com",
          "nombre": "Pedro",
          "apellido": "Martínez Rojas"
        }
      ]
    }
  ]
}
```

**Probar con cURL:**
```bash
curl -X GET http://127.0.0.1:8000/api/partida/42/obtener-grupos/
```

**Probar con PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/partida/42/obtener-grupos/" `
    -Method GET
```

---

## 🧪 SCRIPT DE PRUEBA COMPLETO

### **PowerShell - Flujo Completo**

Guarda este script como `test-backend.ps1`:

```powershell
# Script de prueba para endpoints del backend
Write-Host "🧪 INICIANDO PRUEBAS DE ENDPOINTS" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# URL base del backend
$baseUrl = "http://127.0.0.1:8000/api"

# ============================================
# TEST 1: Crear Partida
# ============================================
Write-Host "📍 TEST 1: Crear Partida" -ForegroundColor Yellow
Write-Host "Endpoint: POST /api/crear-partida/" -ForegroundColor Gray

$crearPartidaBody = @{
    estado = "CREADA"
    max_equipos = 4
    max_participantes = 100
} | ConvertTo-Json

try {
    $partidaResponse = Invoke-RestMethod -Uri "$baseUrl/crear-partida/" `
        -Method POST `
        -ContentType "application/json" `
        -Body $crearPartidaBody
    
    Write-Host "✅ Partida creada exitosamente!" -ForegroundColor Green
    Write-Host "   ID: $($partidaResponse.id)" -ForegroundColor White
    Write-Host "   PIN: $($partidaResponse.codigoAcceso)" -ForegroundColor White
    Write-Host "   Estado: $($partidaResponse.estado)" -ForegroundColor White
    Write-Host ""
    
    $partidaId = $partidaResponse.id
    $pin = $partidaResponse.codigoAcceso
    
} catch {
    Write-Host "❌ Error al crear partida:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

# Esperar 1 segundo
Start-Sleep -Seconds 1

# ============================================
# TEST 2: Asignar Grupos
# ============================================
Write-Host "📍 TEST 2: Asignar Grupos a Partida ID: $partidaId" -ForegroundColor Yellow
Write-Host "Endpoint: POST /api/partida/$partidaId/asignar-grupos/" -ForegroundColor Gray

$asignarGruposBody = @{
    grupos = @(
        @{
            nombre = "Equipo Test 1"
            alumnos = @(
                @{
                    id_correo_usuario = "test1@mail.com"
                    primer_nombre = "Test"
                    apellido_paterno = "Uno"
                    apellido_materno = "Prueba"
                },
                @{
                    id_correo_usuario = "test2@mail.com"
                    primer_nombre = "Test"
                    apellido_paterno = "Dos"
                    apellido_materno = "Prueba"
                }
            )
        },
        @{
            nombre = "Equipo Test 2"
            alumnos = @(
                @{
                    id_correo_usuario = "test3@mail.com"
                    primer_nombre = "Test"
                    apellido_paterno = "Tres"
                    apellido_materno = "Prueba"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $gruposResponse = Invoke-RestMethod -Uri "$baseUrl/partida/$partidaId/asignar-grupos/" `
        -Method POST `
        -ContentType "application/json" `
        -Body $asignarGruposBody
    
    Write-Host "✅ Grupos asignados exitosamente!" -ForegroundColor Green
    Write-Host "   Mensaje: $($gruposResponse.mensaje)" -ForegroundColor White
    Write-Host "   Grupos creados: $($gruposResponse.grupos_creados.Count)" -ForegroundColor White
    
    foreach ($grupo in $gruposResponse.grupos_creados) {
        Write-Host "   📁 $($grupo.nombre_grupo):" -ForegroundColor Cyan
        Write-Host "      - ID Equipo: $($grupo.id_equipo_creado)" -ForegroundColor White
        Write-Host "      - Alumnos: $($grupo.alumnos_asignados.Count)" -ForegroundColor White
    }
    Write-Host ""
    
} catch {
    Write-Host "❌ Error al asignar grupos:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

# Esperar 1 segundo
Start-Sleep -Seconds 1

# ============================================
# TEST 3: Obtener Grupos
# ============================================
Write-Host "📍 TEST 3: Obtener Grupos de Partida ID: $partidaId" -ForegroundColor Yellow
Write-Host "Endpoint: GET /api/partida/$partidaId/obtener-grupos/" -ForegroundColor Gray

try {
    $obtenerGruposResponse = Invoke-RestMethod -Uri "$baseUrl/partida/$partidaId/obtener-grupos/" `
        -Method GET
    
    Write-Host "✅ Grupos obtenidos exitosamente!" -ForegroundColor Green
    Write-Host "   Total grupos: $($obtenerGruposResponse.grupos.Count)" -ForegroundColor White
    
    foreach ($grupo in $obtenerGruposResponse.grupos) {
        Write-Host "   📁 $($grupo.nombre):" -ForegroundColor Cyan
        Write-Host "      - ID: $($grupo.id)" -ForegroundColor White
        Write-Host "      - Tamaño: $($grupo.tamanoequipo)" -ForegroundColor White
        Write-Host "      - Integrantes: $($grupo.integrantes.Count)" -ForegroundColor White
    }
    Write-Host ""
    
} catch {
    Write-Host "❌ Error al obtener grupos:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

# ============================================
# RESUMEN FINAL
# ============================================
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ TODOS LOS TESTS EXITOSOS!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "📊 RESUMEN:" -ForegroundColor White
Write-Host "   Partida ID: $partidaId" -ForegroundColor White
Write-Host "   PIN: $pin" -ForegroundColor White
Write-Host "   Grupos creados: $($gruposResponse.grupos_creados.Count)" -ForegroundColor White
Write-Host "   Total alumnos: $(($gruposResponse.grupos_creados | ForEach-Object { $_.alumnos_asignados.Count } | Measure-Object -Sum).Sum)" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Backend funcionando correctamente!" -ForegroundColor Green
Write-Host ""
```

**Ejecutar el script:**
```powershell
cd e:\IngenieriaSoftware\MisionEmprende_App\MisionEmprendeMonoRepo
.\test-backend.ps1
```

---

## 🌐 PROBAR CON POSTMAN

### **Collection para Postman:**

```json
{
  "info": {
    "name": "MisionEmprende - Juegos API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Crear Partida",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"estado\": \"CREADA\",\n  \"max_equipos\": 4,\n  \"max_participantes\": 100\n}"
        },
        "url": {
          "raw": "http://127.0.0.1:8000/api/crear-partida/",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "crear-partida", ""]
        }
      }
    },
    {
      "name": "2. Asignar Grupos",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"grupos\": [\n    {\n      \"nombre\": \"Equipo 1\",\n      \"alumnos\": [\n        {\n          \"id_correo_usuario\": \"juan@mail.com\",\n          \"primer_nombre\": \"Juan\",\n          \"apellido_paterno\": \"Pérez\",\n          \"apellido_materno\": \"González\"\n        }\n      ]\n    }\n  ]\n}"
        },
        "url": {
          "raw": "http://127.0.0.1:8000/api/partida/42/asignar-grupos/",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "partida", "42", "asignar-grupos", ""]
        }
      }
    },
    {
      "name": "3. Obtener Grupos",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://127.0.0.1:8000/api/partida/42/obtener-grupos/",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "partida", "42", "obtener-grupos", ""]
        }
      }
    }
  ]
}
```

---

## 🔍 VERIFICAR EN BASE DE DATOS

Después de ejecutar los endpoints, verifica los datos:

```sql
-- Ver la partida creada
SELECT * FROM partida WHERE id = 42;

-- Ver los equipos con su tamaño
SELECT id, nombreequipo, tamanoequipo 
FROM equipo 
WHERE id IN (
  SELECT DISTINCT equipo_id 
  FROM partida_usuario 
  WHERE partida_id = 42
);

-- Ver todos los usuarios asignados
SELECT 
  u.email,
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

## 🚨 POSIBLES ERRORES

### **Error 1: Connection refused**
```
❌ No connection could be made because the target machine actively refused it
```
**Solución:** El backend no está levantado
```bash
cd backend/misionemprende
python manage.py runserver
```

### **Error 2: 404 Not Found**
```
❌ {"detail": "Not found."}
```
**Solución:** URL incorrecta, verificar que sea exactamente:
- `/api/crear-partida/` (con slash final)
- `/api/partida/{id}/asignar-grupos/` (con slash final)

### **Error 3: 400 Bad Request**
```
❌ {"error": "Se esperaba una lista de 'grupos' en el JSON."}
```
**Solución:** El JSON no tiene la estructura correcta. Verificar que tenga:
```json
{
  "grupos": [ ... ]  // ← Debe ser un array
}
```

### **Error 4: 500 Internal Server Error**
```
❌ Internal Server Error
```
**Solución:** Ver logs del backend en la consola donde corre Django:
```bash
# Verás el error exacto en la consola
[ERROR] ...
```

---

## ✅ CHECKLIST DE PRUEBAS

- [ ] Backend corriendo en `http://127.0.0.1:8000`
- [ ] POST `/api/crear-partida/` retorna ID y PIN
- [ ] POST `/api/partida/{id}/asignar-grupos/` retorna grupos creados
- [ ] GET `/api/partida/{id}/obtener-grupos/` retorna grupos guardados
- [ ] Base de datos tiene registros en:
  - [ ] Tabla `partida`
  - [ ] Tabla `equipo` (con `tamanoequipo`)
  - [ ] Tabla `usuario`
  - [ ] Tabla `partida_usuario`

---

## 🎯 RESUMEN

**3 Endpoints principales:**

1. **Crear Juego:** `POST /api/crear-partida/`
2. **Asociar Grupos:** `POST /api/partida/{id}/asignar-grupos/`
3. **Obtener Grupos:** `GET /api/partida/{id}/obtener-grupos/`

**El flujo normal es:**
```
1. Crear Partida → Obtener ID (42) y PIN (A7B3C9D2)
2. Asignar Grupos a Partida 42 → Guarda equipos y usuarios
3. Obtener Grupos de Partida 42 → Verifica que se guardó correctamente
```

🎉 **¡Usa el script de PowerShell para probar todo automáticamente!**
