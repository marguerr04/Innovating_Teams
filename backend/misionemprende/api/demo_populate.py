from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import SolucionLego, Equipo
import json

@csrf_exempt
@require_http_methods(["POST"])
def demo_populate_teams_images(request):
    """
    Endpoint para demo: Copia la imagen del equipo 1 a los equipos 2, 3, 4
    para que todos tengan imágenes reales de Google Cloud Storage
    """
    try:
        # Obtener la imagen real del equipo 1 (desde Google Cloud)
        equipo1_solucion = SolucionLego.objects.filter(
            equipo__id=1,
            fotoprototipurl__isnull=False
        ).exclude(
            fotoprototipurl__exact=''
        ).exclude(
            fotoprototipurl__startswith='http://example.com/'
        ).order_by('-id').first()
        
        if not equipo1_solucion:
            return JsonResponse({
                'error': 'No se encontró imagen real para equipo 1'
            }, status=404)
            
        # URL de imagen real del equipo 1
        real_image_url = equipo1_solucion.fotoprototipurl
        
        created_solutions = []
        
        # Crear soluciones para equipos 2, 3, 4 con la misma imagen
        for team_id in [2, 3, 4]:
            # Verificar si el equipo existe
            try:
                equipo = Equipo.objects.get(id=team_id)
            except Equipo.DoesNotExist:
                # Crear equipo si no existe
                equipo = Equipo.objects.create(
                    id=team_id,
                    nombre=f"Equipo {team_id}",
                    # Agregar otros campos necesarios
                )
            
            # Crear solución con imagen del equipo 1
            solucion = SolucionLego.objects.create(
                equipo=equipo,
                descripsoluc=f"Demo: Prototipo para {equipo.nombre} (imagen clonada para demo)",
                fotoprototipurl=real_image_url
            )
            
            created_solutions.append({
                'team_id': team_id,
                'solucion_id': solucion.id,
                'image_url': real_image_url
            })
        
        return JsonResponse({
            'success': True,
            'message': f'Imágenes demo creadas para equipos 2, 3, 4',
            'source_image': real_image_url,
            'created_solutions': created_solutions
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'Error interno: {str(e)}'
        }, status=500)