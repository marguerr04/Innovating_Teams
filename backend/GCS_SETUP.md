# Configuración de Google Cloud Storage para MisionEmprende

## 1. Configuración en Google Cloud Console

### Paso 1: Crear un proyecto en Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID** (lo necesitarás para settings.py)

### Paso 2: Habilitar la API de Cloud Storage
1. En el menú de navegación, ve a "APIs & Services" > "Library"
2. Busca "Cloud Storage API" y habilítala

### Paso 3: Crear un bucket
1. Ve a "Cloud Storage" > "Buckets"
2. Haz clic en "Create Bucket"
3. Escoge un nombre único (ej: `mision-emprende-images-tu-nombre`)
4. Selecciona una región (ej: `us-central1`)
5. Configura el bucket como público si quieres URLs públicas

### Paso 4: Crear credenciales
1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "Service Account"
3. Dale un nombre (ej: `mision-emprende-storage`)
4. Asigna el rol "Storage Admin" o "Storage Object Admin"
5. Descarga el archivo JSON de credenciales

## 2. Configuración en el proyecto Django

### Paso 1: Instalar dependencias
```bash
pip install google-cloud-storage==2.14.0
```

### Paso 2: Colocar el archivo de credenciales
1. Coloca el archivo JSON descargado en `backend/misionemprende/`
2. Renómbralo a `gcs-credentials.json`

### Paso 3: Configurar settings.py
Actualiza las siguientes variables en `settings.py`:

```python
# Configuraciones de Google Cloud Storage
GCS_BUCKET_NAME = 'tu-nombre-del-bucket'  # El nombre del bucket que creaste
GCS_PROJECT_ID = 'tu-project-id'  # Tu Project ID de Google Cloud
GCS_REGION = 'us-central1'  # La región que seleccionaste
```

### Paso 4: Configurar variables de entorno (Opcional pero recomendado)
Para mayor seguridad, puedes usar variables de entorno:

```bash
# En tu .env o variables de sistema
export GOOGLE_APPLICATION_CREDENTIALS="ruta/a/tu/gcs-credentials.json"
export GCS_BUCKET_NAME="tu-nombre-del-bucket"
export GCS_PROJECT_ID="tu-project-id"
```

## 3. Uso del servicio

### Endpoint disponible
- **POST** `/api/storage/signed-url/`

### Ejemplo de uso
```javascript
// Frontend - Solicitar URL firmada
const response = await fetch('/api/storage/signed-url/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${userToken}`
    },
    body: JSON.stringify({
        filename: 'avatar-usuario-123.jpg',
        content_type: 'image/jpeg'
    })
});

const data = await response.json();
// data.signed_url - URL para subir el archivo
// data.public_url - URL pública para acceder al archivo
```

### Subir archivo usando la URL firmada
```javascript
// Usar la URL firmada para subir el archivo
await fetch(data.signed_url, {
    method: 'PUT',
    headers: {
        'Content-Type': 'image/jpeg'
    },
    body: fileBlob
});
```

## 4. Estructura del archivo de credenciales

Tu archivo `gcs-credentials.json` debe verse así:
```json
{
  "type": "service_account",
  "project_id": "tu-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@tu-project-id.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## 5. Verificación

Para verificar que todo funciona:

1. Instala las dependencias: `pip install -r requirements.txt`
2. Ejecuta el servidor: `python manage.py runserver`
3. Usa Postman para probar el endpoint `/api/storage/signed-url/`

## 6. Troubleshooting

### Error: "Application Default Credentials not found"
- Verifica que el archivo `gcs-credentials.json` esté en la ubicación correcta
- Configura la variable de entorno `GOOGLE_APPLICATION_CREDENTIALS`

### Error: "Bucket not found"
- Verifica que el nombre del bucket en `settings.py` sea correcto
- Asegúrate de que el bucket exista en tu proyecto de Google Cloud

### Error de permisos
- Verifica que la cuenta de servicio tenga los permisos adecuados
- Asigna el rol "Storage Admin" o "Storage Object Admin"