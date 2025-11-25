# api/services/imagen_service.py
"""
Servicio para gestión de imágenes de soluciones LEGO.
Maneja el guardado y recuperación de imágenes de prototipos.
"""

from django.utils import timezone

from ..models import Equipo, SolucionLego


def guardar_imagen_solucion_logic(equipo_id, image_url, descripcion=''):
    """
    Guarda la URL de imagen de una solución LEGO en la base de datos.
    
    Args:
        equipo_id: ID del equipo
        image_url: URL de la imagen
        descripcion: Descripción opcional de la solución
        
    Returns:
        dict: Resultado con información de la solución guardada
        
    Raises:
        ValueError: Si faltan parámetros requeridos
        Equipo.DoesNotExist: Si el equipo no existe
    """
    if not equipo_id or not image_url:
        raise ValueError('equipo_id y image_url son requeridos')

    equipo = Equipo.objects.get(id=equipo_id)

    # Buscar la solución más reciente del equipo o crear nueva si no existe
    solucion = SolucionLego.objects.filter(equipo=equipo).order_by('-fechacreacion').first()
    
    if solucion:
        # Actualizar la solución existente más reciente
        solucion.fotoprototipurl = image_url
        solucion.descripsoluc = descripcion
        solucion.save()
        created = False
    else:
        # Crear nueva si no existe ninguna para este equipo
        solucion = SolucionLego.objects.create(
            equipo=equipo,
            fechacreacion=timezone.now(),
            descripsoluc=descripcion,
            fotoprototipurl=image_url
        )
        created = True

    return {
        'success': True,
        'message': 'Imagen guardada exitosamente',
        'solucion_id': solucion.id,
        'image_url': solucion.fotoprototipurl,
        'created': created
    }


def obtener_imagen_equipo_logic(team_id):
    """
    Obtiene la imagen de prototipo de un equipo específico.
    
    Args:
        team_id: ID del equipo (string o int)
        
    Returns:
        dict: Información de la imagen encontrada
        
    Raises:
        ValueError: Si team_id no es válido
    """
    if not team_id:
        raise ValueError('team_id es requerido')
    
    try:
        # Convertir team_id a entero
        team_id = int(team_id)
    except (ValueError, TypeError):
        raise ValueError('team_id debe ser un número válido')
    
    # Buscar la solución que tenga una imagen válida para este equipo
    # Priorizar URLs de Google Cloud Storage sobre URLs dummy
    solucion = SolucionLego.objects.filter(
        equipo__id=team_id,
        fotoprototipurl__isnull=False
    ).exclude(
        fotoprototipurl__exact=''
    ).exclude(
        fotoprototipurl__startswith='http://example.com/'
    ).order_by('-id').first()
    
    # Si no hay imagen de Google Cloud, buscar cualquier imagen
    if not solucion:
        solucion = SolucionLego.objects.filter(
            equipo__id=team_id,
            fotoprototipurl__isnull=False
        ).exclude(
            fotoprototipurl__exact=''
        ).order_by('-id').first()
    
    if not solucion:
        return {
            'success': False,
            'message': 'No se encontró imagen para este equipo',
            'has_image': False
        }
    
    return {
        'success': True,
        'has_image': bool(solucion.fotoprototipurl),
        'image_url': solucion.fotoprototipurl,
        'solucion_id': solucion.id,
        'team_id': team_id
    }
