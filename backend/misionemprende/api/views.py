from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser

# Django REST Framework imports
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

# Modelos necesarios para las vistas
from .models import Partida, Equipo

# Serializers
from .serializers import EstudianteSerializer, EquipoSerializer

# Autenticación (importar desde el nuevo módulo)
from .views.auth_views import login_view, login_profesor, login_admin

# ViewSets de Usuario y Estudiante (importar desde el nuevo módulo)
from .views.usuario_views import UsuarioViewSet, EstudianteViewSet

# ViewSets de Contenido: Cursos y Videos (importar desde el nuevo módulo)
from .views.contenido_views import CursoViewSet, VideoViewSet

# Servicios (lógica de negocio)
from .services import (
    assign_groups_logic,
    bulk_create_estudiantes_logic,
    crear_partida_logic,
    asignar_grupos_logic,
    obtener_grupos_logic,
    listar_equipos_logic,
    get_estudiantes_por_equipo_logic,
    guardar_imagen_solucion_logic,
    obtener_imagen_equipo_logic,
)

# ============================================
# NOTA SOBRE REFACTORIZACIÓN:
# - Funciones de autenticación → api/views/auth_views.py
# - ViewSets de Usuario/Estudiante → api/views/usuario_views.py
# - ViewSets de Curso/Video → api/views/contenido_views.py
# - Lógica de negocio → api/services/
# Se importan arriba para mantener compatibilidad con urls.py
# ============================================








@api_view(['GET'])
def get_estudiantes_por_equipo(request, equipo_id):
    """
    Devuelve todos los estudiantes asociados a un equipo.
    """
    try:
        estudiantes = get_estudiantes_por_equipo_logic(equipo_id)
        serializer = EstudianteSerializer(estudiantes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
@csrf_exempt
def assign_groups(request):
    """
    Endpoint: /api/groups/assign
    Recibe un CSV con columnas [Correo, RUT, Nombre, Apellido Paterno, Apellido Materno]
    Crea usuarios, equipos, y estudiantes vinculados a lista_participante.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)

    try:
        # === 1️⃣ Parámetros del formulario ===
        archivo = request.FILES.get('archivo_lista')
        cantidad_grupos = int(request.POST.get('cantidad_grupos', 4))
        tiene_encabezado = request.POST.get('tiene_encabezado') in ['true', 'True', '1']
        modo = request.POST.get('modo', 'aleatoria')

        if not archivo:
            return JsonResponse({'error': 'No se envió ningún archivo CSV'}, status=400)

        # === 2️⃣ Ejecutar lógica de negocio ===
        resultado = assign_groups_logic(archivo, cantidad_grupos, tiene_encabezado, modo)
        return JsonResponse(resultado, status=201)

    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        import traceback
        print("ERROR EN assign_groups:", str(e))
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
def bulk_create_estudiantes(request):
    """
    Endpoint: /api/estudiantes/bulk_create/
    Recibe JSON: { "estudiantes": [ {"correo":"","rut":"","nombre":"","apellido_paterno":"","apellido_materno":""}, ... ] }
    Crea (o reutiliza) Usuario y Estudiante. Devuelve lista creada/reutilizada.
    """
    try:
        estudiantes_data = request.data.get('estudiantes')
        resultado = bulk_create_estudiantes_logic(estudiantes_data)
        return Response(resultado, status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    






@api_view(["POST"])
def crear_partida(request):
    """
    Endpoint para crear una partida única.
    """
    try:
        # Datos enviados desde el frontend
        estado = request.data.get("estado", "CONFIGURACION")
        max_equipos = request.data.get("max_equipos", 4)
        max_participantes = request.data.get("max_participantes", 20)
        
        resultado = crear_partida_logic(estado, max_equipos, max_participantes)
        return Response(resultado, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    






# Endpoints relacionados a la asignacion de grupos

@api_view(['POST'])
@parser_classes([JSONParser])
def asignar_grupos(request, partida_id):
    """
    Endpoint: /api/partida/<partida_id>/asignar-grupos/
    Recibe un JSON con una lista de grupos y sus alumnos, y los asocia
    a una partida existente.
    Crea (o reutiliza) usuarios (alumnos) basado en su email.
    Crea equipos NUEVOS para esta partida.
    """
    try:
        # 1. Obtener la Partida existente usando el ID de la URL
        partida = get_object_or_404(Partida, id=partida_id)

        # 2. Obtener el JSON que envió el frontend
        data_grupos = request.data.get('grupos')

        # 3. Ejecutar lógica de negocio
        resultado = asignar_grupos_logic(partida, data_grupos)
        return Response(resultado, status=status.HTTP_201_CREATED)

    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"Error interno del servidor: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    




@api_view(["GET"])
def obtener_grupos(request, partida_id):
    """
    Endpoint para obtener los grupos y usuarios de una partida específica.
    """
    try:
        resultado = obtener_grupos_logic(partida_id)
        return Response(resultado, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@csrf_exempt
def guardar_imagen_solucion(request):
    """
    Guarda la URL de imagen de una solución LEGO en la base de datos.
    Recibe: equipo_id, image_url, descripcion (opcional)
    """
    try:
        data = JSONParser().parse(request)
        equipo_id = data.get('equipo_id')
        image_url = data.get('image_url')
        descripcion = data.get('descripcion', '')

        resultado = guardar_imagen_solucion_logic(equipo_id, image_url, descripcion)
        return JsonResponse(resultado)

    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Equipo.DoesNotExist:
        return JsonResponse({'error': 'Equipo no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': f'Error interno del servidor: {str(e)}'}, status=500)

@csrf_exempt
def obtener_imagen_equipo(request):
    """
    Obtiene la imagen de prototipo de un equipo específico de la fase actual.
    
    Parámetros:
    - GET: team_id (número del equipo)
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    try:
        team_id = request.GET.get('team_id')
        resultado = obtener_imagen_equipo_logic(team_id)
        return JsonResponse(resultado)
        
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Error interno del servidor: {str(e)}'}, status=500)


@api_view(['GET'])
def listar_equipos(request):
    """
    Endpoint para obtener la lista de todos los equipos disponibles.
    
    GET /api/equipos/
    
    Retorna:
    - Lista de equipos con id, nombre y tamaño
    """
    try:
        equipos = listar_equipos_logic()
        serializer = EquipoSerializer(equipos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': f'Error al obtener equipos: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)