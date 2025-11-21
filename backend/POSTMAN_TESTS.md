# 🧪 Guía de Pruebas en Postman - Sistema de Equipos e Imágenes

## 📋 Resumen de Endpoints Disponibles

### **NUEVOS ENDPOINTS AGREGADOS:**
✅ `GET /api/equipos/` - Listar todos los equipos

---

## 1️⃣ GET /api/equipos/ - Obtener Lista de Equipos

### Configuración en Postman:
```
Método: GET
URL: http://localhost:8000/api/equipos/
Headers: (ninguno requerido)
```

### Respuesta Exitosa (200 OK):
```json
[
    {
        "id": 1,
        "nombre": "Equipo Alpha",
        "tamanoequipo": 5
    },
    {
        "id": 2,
        "nombre": "Equipo Beta",
        "tamanoequipo": 4
    },
    {
        "id": 3,
        "nombre": "Equipo Gamma",
        "tamanoequipo": 6
    }
]
```

### Respuesta de Error (500):
```json
{
    "error": "Error al obtener equipos: [mensaje de error]"
}
```

---

## 2️⃣ POST /api/guardar-imagen/ - Guardar Imagen Asociada a Equipo

### Configuración en Postman:
```
Método: POST
URL: http://localhost:8000/api/guardar-imagen/
Headers: 
    Content-Type: application/json
```

### Body (raw JSON):
```json
{
    "equipo_id": 1,
    "image_url": "https://storage.googleapis.com/mision-emprende-bucket/equipo_1_proto_20241119.jpg",
    "descripcion": "Prototipo de solución LEGO para el desafío de emprendimiento"
}
```

### Respuesta Exitosa (200 OK):
```json
{
    "success": true,
    "message": "Imagen guardada exitosamente",
    "solucion_id": 15,
    "image_url": "https://storage.googleapis.com/mision-emprende-bucket/equipo_1_proto_20241119.jpg",
    "created": true
}
```

**Nota:** 
- `created: true` = Se creó una nueva solución
- `created: false` = Se actualizó una solución existente

### Respuesta de Error (400):
```json
{
    "error": "equipo_id y image_url son requeridos"
}
```

### Respuesta de Error (404):
```json
{
    "error": "Equipo no encontrado"
}
```

---

## 3️⃣ GET /api/obtener-imagen/ - Obtener Imagen de un Equipo

### Configuración en Postman:
```
Método: GET
URL: http://localhost:8000/api/obtener-imagen/?team_id=1
```

### Parámetros Query:
- `team_id` (requerido): ID del equipo

### Respuesta Exitosa con Imagen (200 OK):
```json
{
    "success": true,
    "has_image": true,
    "image_url": "https://storage.googleapis.com/mision-emprende-bucket/equipo_1_proto_20241119.jpg",
    "solucion_id": 15,
    "team_id": 1
}
```

### Respuesta Sin Imagen (200 OK):
```json
{
    "success": false,
    "message": "No se encontró imagen para este equipo",
    "has_image": false
}
```

---

## 4️⃣ GET /api/signed-url/ - Obtener URL Firmada para Upload

### Configuración en Postman:
```
Método: GET
URL: http://localhost:8000/api/signed-url/?grupoId=1&ext=jpg
```

### Parámetros Query:
- `grupoId` (requerido): ID del equipo/grupo
- `ext` (requerido): Extensión del archivo (jpg, png, jpeg)

### Respuesta Exitosa:
```json
{
    "uploadUrl": "https://storage.googleapis.com/mision-emprende-bucket/equipo_1_20241119_abc123.jpg?...",
    "publicUrl": "https://storage.googleapis.com/mision-emprende-bucket/equipo_1_20241119_abc123.jpg"
}
```

---

## 🔄 Flujo Completo de Prueba

### Paso 1: Verificar que existan equipos
```bash
GET http://localhost:8000/api/equipos/
```

### Paso 2: Obtener URL firmada para subir imagen
```bash
GET http://localhost:8000/api/signed-url/?grupoId=1&ext=jpg
```

### Paso 3: Subir imagen a Google Cloud (usando uploadUrl del paso anterior)
```bash
PUT [uploadUrl obtenida]
Headers: Content-Type: image/jpeg
Body: binary (seleccionar archivo de imagen)
```

### Paso 4: Guardar la URL pública en la base de datos
```bash
POST http://localhost:8000/api/guardar-imagen/
Body:
{
    "equipo_id": 1,
    "image_url": "[publicUrl del paso 2]",
    "descripcion": "Mi prototipo"
}
```

### Paso 5: Verificar que la imagen se guardó
```bash
GET http://localhost:8000/api/obtener-imagen/?team_id=1
```

---

## 📊 Resumen Completo de Endpoints (Actualizado)

### Autenticación:
- `POST /api/login/` - Login de usuarios
- `POST /api/login-profesor/` - Login de profesores
- `POST /api/login-admin/` - Login de administradores

### Partidas y Grupos:
- `POST /api/crear-partida/` - Crear nueva partida
- `POST /api/partida/<partida_id>/asignar-grupos/` - Asignar grupos a partida
- `GET /api/partida/<partida_id>/obtener-grupos/` - Obtener grupos de partida

### **Equipos (NUEVO):**
- `GET /api/equipos/` - Listar todos los equipos

### Imágenes y Storage:
- `GET /api/signed-url/` - Obtener URL firmada para upload
- `POST /api/guardar-imagen/` - Guardar imagen asociada a equipo
- `GET /api/obtener-imagen/` - Obtener imagen de un equipo

### Utilidades:
- `GET /api/test-db/` - Verificar conexión a base de datos

---

## 🚀 Comandos para Iniciar el Servidor

### Backend (Django):
```bash
cd backend/misionemprende
python manage.py runserver
```

### Frontend (React):
```bash
cd frontend
npm start
```

---

## 🐛 Troubleshooting

### Error: "No se pueden cargar equipos"
✅ Verificar que el servidor Django esté corriendo
✅ Verificar que existan equipos en la base de datos
✅ Verificar configuración de CORS en `settings.py`

### Error: "Equipo no encontrado"
✅ Verificar que el equipo_id existe en la tabla `equipo`
✅ Ejecutar query en PostgreSQL: `SELECT * FROM equipo;`

### Error: "Error al obtener URL firmada"
✅ Verificar credenciales de Google Cloud Storage
✅ Verificar que el archivo `gcs-credentials.json` existe
✅ Verificar permisos del bucket en GCS

---

## 💡 Tips de Uso

1. **Primero verifica equipos:** Siempre comienza con `GET /api/equipos/` para ver qué equipos están disponibles

2. **Usa el flujo completo:** Para probar todo el sistema, sigue los 5 pasos del flujo completo

3. **Verifica en la BD:** Después de guardar una imagen, verifica en PostgreSQL:
   ```sql
   SELECT * FROM solucion_lego ORDER BY id DESC LIMIT 5;
   ```

4. **Frontend Test:** Usa la página `TestImageUpload.jsx` en el frontend para probar visualmente el sistema completo
