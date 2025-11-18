# Sistema de Subida de Imágenes - Google Cloud Storage

## Resumen del Sistema

El sistema de subida de imágenes de MisionEmprende utiliza **Google Cloud Storage** para almacenar archivos de forma segura y eficiente. Este sistema incluye:

- **Backend**: Endpoint para generar URLs firmadas de Google Cloud Storage
- **Frontend**: Componente React para subida de imágenes con vista previa
- **Autenticación**: Integración con el sistema de tokens de Django
- **Seguridad**: URLs firmadas con expiración temporal

## Arquitectura del Sistema

```
Frontend (React)          Backend (Django)           Google Cloud Storage
     |                          |                           |
[ImageUploader] -----> [/api/storage/signed-url/] -----> [Bucket: mision-emprende-images]
     |                          |                           |
[Preview & Upload] <--- [Signed URL + Public URL] <------ [File Storage]
```

## Flujo de Funcionamiento

1. **Usuario selecciona imagen**: El componente React valida formato y tamaño
2. **Solicitar URL firmada**: Se envía request al backend con nombre de archivo y tipo
3. **Generar URLs**: Django genera URL firmada (para subir) y URL pública (para acceso)
4. **Subir archivo**: El frontend usa la URL firmada para subir directamente a GCS
5. **Confirmar subida**: Se notifica al usuario y se guarda la URL pública

## Archivos del Sistema

### Backend

1. **`api/storage_service.py`** - Servicio principal de almacenamiento
   ```python
   def generate_signed_url(request):
       # Genera URLs firmadas para subida y URLs públicas para acceso
   ```

2. **`misionemprende/settings.py`** - Configuraciones de GCS
   ```python
   GCS_BUCKET_NAME = 'mision-emprende-images'
   GCS_PROJECT_ID = 'tu-proyecto-gcs'
   GCS_CREDENTIALS_FILE = os.path.join(BASE_DIR, 'gcs-credentials.json')
   ```

3. **`api/urls.py`** - Endpoint de la API
   ```python
   path('storage/signed-url/', generate_signed_url, name='generate_signed_url')
   ```

### Frontend

1. **`src/components/ImageUploader.jsx`** - Componente principal
   - Validación de archivos (tipo, tamaño)
   - Vista previa de imagen
   - Subida con barra de progreso

2. **`src/components/ImageUploader.css`** - Estilos del componente
   - Diseño responsive
   - Estados visuales (carga, éxito, error)

### Configuración

1. **`requirements.txt`** - Dependencias de Python
   ```
   google-cloud-storage==2.14.0
   ```

2. **`gcs-credentials.json`** - Archivo de credenciales (no incluido en repo)

## API Endpoint

### POST `/api/storage/signed-url/`

**Request Body:**
```json
{
    "filename": "avatar-usuario-123.jpg",
    "content_type": "image/jpeg"
}
```

**Response:**
```json
{
    "signed_url": "https://storage.googleapis.com/bucket/path?X-Goog-Signature=...",
    "public_url": "https://storage.googleapis.com/bucket/path",
    "filename": "avatar-usuario-123.jpg",
    "expires_in": 3600
}
```

**Headers requeridos:**
- `Authorization: Token <user_token>`
- `Content-Type: application/json`

## Uso del Componente React

```jsx
import ImageUploader from './components/ImageUploader';

function UserProfile() {
    const [userToken] = useState(localStorage.getItem('token'));
    
    const handleImageUploaded = (imageData) => {
        console.log('Imagen subida:', imageData.public_url);
        // Guardar URL en la base de datos o estado local
    };

    return (
        <ImageUploader 
            onImageUploaded={handleImageUploaded}
            userToken={userToken}
        />
    );
}
```

## Configuración de Google Cloud

### 1. Configuración inicial
```bash
# En Google Cloud Console:
# 1. Crear proyecto
# 2. Habilitar Cloud Storage API
# 3. Crear bucket
# 4. Crear cuenta de servicio
# 5. Descargar credenciales JSON
```

### 2. Configuración local
```bash
# Instalar dependencias
pip install google-cloud-storage

# Colocar archivo de credenciales
mv downloaded-credentials.json backend/misionemprende/gcs-credentials.json

# Actualizar settings.py con tu información
```

## Validaciones y Seguridad

### Frontend
- **Tipo de archivo**: Solo imágenes (image/*)
- **Tamaño**: Máximo 5MB
- **Preview**: Vista previa antes de subir

### Backend
- **Autenticación**: Token requerido
- **Validación**: Verificar datos del request
- **URLs firmadas**: Expiran en 1 hora
- **CORS**: Configurado para el frontend

### Google Cloud Storage
- **Bucket privado**: Solo acceso con credenciales
- **URLs temporales**: Acceso limitado por tiempo
- **Permisos**: Cuenta de servicio con permisos mínimos

## Pruebas del Sistema

### Prueba manual con Postman
```bash
# 1. POST /api/storage/signed-url/
# Headers: Authorization: Token <token>
# Body: {"filename": "test.jpg", "content_type": "image/jpeg"}

# 2. PUT <signed_url_from_response>
# Headers: Content-Type: image/jpeg
# Body: <imagen_binaria>
```

### Script automatizado
```bash
cd backend/misionemprende
python test_gcs_integration.py
```

## Troubleshooting

### Error: "Application Default Credentials not found"
**Solución**: Verificar que `gcs-credentials.json` esté en la ubicación correcta

### Error: "Bucket not found"
**Solución**: Verificar nombre del bucket en `settings.py`

### Error: "Permission denied"
**Solución**: Verificar permisos de la cuenta de servicio

### Error: "CORS policy"
**Solución**: Verificar configuración CORS en Django

## Estructura de Archivos

```
backend/
├── misionemprende/
│   ├── gcs-credentials.json (no en repo)
│   ├── test_gcs_integration.py
│   └── misionemprende/
│       └── settings.py (configuraciones GCS)
├── api/
│   ├── storage_service.py
│   └── urls.py (endpoint)
├── requirements.txt (google-cloud-storage)
└── GCS_SETUP.md (instrucciones)

frontend/
└── src/
    └── components/
        ├── ImageUploader.jsx
        └── ImageUploader.css
```

## Variables de Entorno (Recomendado)

```bash
# .env
GOOGLE_APPLICATION_CREDENTIALS=path/to/gcs-credentials.json
GCS_BUCKET_NAME=mision-emprende-images
GCS_PROJECT_ID=tu-proyecto-gcs
GCS_REGION=us-central1
```

## Próximos Pasos

1. **Configurar Google Cloud** siguiendo `GCS_SETUP.md`
2. **Probar el sistema** con `test_gcs_integration.py`
3. **Integrar en la aplicación** usando `ImageUploader.jsx`
4. **Configurar variables de entorno** para producción
5. **Implementar limpieza** de archivos antiguos (opcional)

## Notas Importantes

- Las URLs firmadas expiran en 1 hora
- Los archivos se almacenan permanentemente en GCS
- El sistema requiere autenticación con token
- Las imágenes son accesibles públicamente una vez subidas
- El bucket debe configurarse correctamente en Google Cloud Console