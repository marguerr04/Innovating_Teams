from google.cloud import storage
from django.http import JsonResponse
from django.conf import settings
from datetime import timedelta
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import time


@csrf_exempt
@require_http_methods(["GET", "OPTIONS"])
def generate_signed_url(request):
    """Genera una signed URL (PUT) para subir imágenes a GCS y devuelve la URL pública.

    Parámetros esperados en query string (GET):
      - grupoId: identificador del grupo (se incorpora al nombre del objeto)
      - ext: extensión del archivo (png, jpg, jpeg, etc.)

    Respuesta JSON:
      { "uploadUrl": <signed-put-url>, "publicUrl": <public-url>, "filename": <object-name>, "expires_in": <seconds> }
    """
    grupo_id = request.GET.get("grupoId", "0")
    ext = request.GET.get("ext", "png").lstrip('.')

    # Validaciones básicas
    if not ext:
        return JsonResponse({"error": "ext parameter is required"}, status=400)

    bucket_name = getattr(settings, 'GCS_BUCKET_NAME', None)
    credentials_file = getattr(settings, 'GCS_CREDENTIALS_FILE', None)
    project_id = getattr(settings, 'GCS_PROJECT_ID', None)

    if not bucket_name or not credentials_file:
        return JsonResponse({"error": "GCS_BUCKET_NAME or GCS_CREDENTIALS_FILE not configured in settings"}, status=500)

    try:
        client = storage.Client.from_service_account_json(credentials_file, project=project_id)
        bucket = client.bucket(bucket_name)

        timestamp = int(time.time())
        object_name = f"soluciones/group_{grupo_id}_{timestamp}.{ext}"
        blob = bucket.blob(object_name)

        expiration_seconds = getattr(settings, 'GCS_SIGNED_URL_EXPIRATION', 3600)

        # Unificar Content-Type para jpg y jpeg
        if ext.lower() in ["jpg", "jpeg"]:
            content_type = "image/jpeg"
        elif ext.lower() == "png":
            content_type = "image/png"
        else:
            content_type = f"image/{ext}"

        upload_url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(seconds=expiration_seconds),
            method="PUT",
            content_type=content_type
        )

        public_url = f"https://storage.googleapis.com/{bucket_name}/{object_name}"

        return JsonResponse({
            "uploadUrl": upload_url,
            "publicUrl": public_url,
            "filename": object_name,
            "expires_in": expiration_seconds,
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)