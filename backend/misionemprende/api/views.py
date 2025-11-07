from django.shortcuts import render
from django.utils import timezone
from django.db import transaction
from django.http import JsonResponse
import math 
from django.views.decorators.csrf import csrf_exempt # desactivacion temporal de la verificacion CSRF para probar post de csv


# Django REST Framework imports
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

# Modelos y serializers
from .models import Estudiante, Curso, Usuario, PartidaUsuario, Equipo, Partida,  ListaParticipante

from .serializers import EstudianteSerializer, CursoSerializer, UsuarioSerializer

# Autenticación
from django.contrib.auth import authenticate, get_user_model

# Utilidades
import csv
import io
import random

User = get_user_model()

@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=400)

    # Autenticamos con el username real del usuario
    user = authenticate(username=user.username, password=password)
    if not user:
        return Response({"error": "Credenciales inválidas"}, status=400)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "username": user.username,
        "role": "admin",  # como esta demo es solo para admin
    })


# Esta clase ES la que hace la query
class EstudianteViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar estudiantes.
    """
    queryset = Estudiante.objects.all() # <-- ¡AQUÍ ESTÁ TU QUERY!
    serializer_class = EstudianteSerializer

class CursoViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar cursos.
    """
    queryset = Curso.objects.all() # <-- ¡OTRA QUERY!
    serializer_class = CursoSerializer
    
class UsuarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar usuarios.
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer








@api_view(['GET'])
def get_estudiantes_por_equipo(request, equipo_id):
    """
    Devuelve todos los estudiantes asociados a un equipo.
    """
    try:
        usuarios_ids = PartidaUsuario.objects.filter(equipo_id=equipo_id).values_list('usuario_id', flat=True)
        estudiantes = Estudiante.objects.filter(usuario_id__in=usuarios_ids)
        serializer = EstudianteSerializer(estudiantes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
# Hay que cambiar en servics para no encasuplartoda logica
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

        # === 2️⃣ Lectura del CSV ===
        data = archivo.read().decode('utf-8')
        reader = csv.reader(io.StringIO(data), delimiter=';')
        if tiene_encabezado:
            next(reader, None)

        filas = [row for row in reader if row]
        if not filas:
            return JsonResponse({'error': 'El archivo CSV está vacío'}, status=400)

        # === 3️⃣ Procesamiento del CSV ===
        estudiantes = []
        for row in filas:
            try:
                correo = row[0].strip()
                rut = row[1].strip()
                nombre = row[2].strip()
                apellido_paterno = row[3].strip()
                apellido_materno = row[4].strip()
                estudiantes.append({
                    'correo': correo,
                    'rut': rut,
                    'nombre': nombre,
                    'apellido_paterno': apellido_paterno,
                    'apellido_materno': apellido_materno
                })
            except Exception as e:
                print(f"Fila inválida: {row} -> {e}")
                continue

        if modo == 'aleatoria':
            random.shuffle(estudiantes)

        # === 4️⃣ Transacción atómica ===
        with transaction.atomic():
            # Crear la partida (juego)
            partida = Partida.objects.create(
                video_id=12,
                fechacreacion=timezone.now(),
                estado='EN_CURSO'
            )

            # Crear equipos
            grupos = []
            tamano_grupo = max(1, math.ceil(len(estudiantes) / cantidad_grupos))
            for i in range(cantidad_grupos):
                equipo = Equipo.objects.create(nombreequipo=f"Equipo {i+1}")
                grupos.append({'nombre_equipo': equipo.nombreequipo, 'estudiantes': []})

            grupo_idx = 0

            for est in estudiantes:
                nombre_completo = f"{est['nombre']} {est['apellido_paterno']} {est['apellido_materno']}".strip()
                primer_nombre = est['nombre']
                apellido_final = f"{est['apellido_paterno']} {est['apellido_materno']}"

                #  Crear o recuperar usuario
                usuario, creado_usuario = Usuario.objects.get_or_create(
                    email=est['correo'],
                    defaults={
                        'nombre': primer_nombre,
                        'apellido': apellido_final,
                        'tipousuario': 'ESTUDIANTE',
                        'fechacreacion': timezone.now(),
                        'estado': 'ACTIVO',
                    }
                )

                #  Crear o recuperar lista participante
                lista_participante, _ = ListaParticipante.objects.get_or_create(
                    emailestudiante=usuario.email,
                    defaults={'nombreestudiante': usuario.nombre}
                )

                #  Verificar si el estudiante ya existe
                estudiante_existente = Estudiante.objects.filter(usuario=usuario).first()

                if estudiante_existente:
                    # Si ya existe, actualiza la lista participante si es distinta
                    if estudiante_existente.lista_participante_id != lista_participante.id:
                        estudiante_existente.lista_participante = lista_participante
                        estudiante_existente.save()
                else:
                    # Si no existe, créalo
                    Estudiante.objects.create(usuario=usuario, lista_participante=lista_participante)

                #  Asignar equipo (sin buscar por nombre)
                equipo_obj = Equipo.objects.filter(nombreequipo=grupos[grupo_idx]['nombre_equipo']).last()

                #  Evitar duplicados en PartidaUsuario
                if not PartidaUsuario.objects.filter(usuario=usuario, partida=partida).exists():
                    PartidaUsuario.objects.create(
                        usuario=usuario,
                        partida=partida,
                        equipo=equipo_obj
                    )

                # Añadir al grupo actual para mostrar en respuesta
                grupos[grupo_idx]['estudiantes'].append({
                    'nombre': nombre_completo,
                    'correo': est['correo']
                })

                grupo_idx = (grupo_idx + 1) % cantidad_grupos
        # === 9️⃣ Respuesta exitosa ===
        return JsonResponse({
            'mensaje': ' Grupos y estudiantes creados exitosamente',
            'id_partida': partida.id,
            'grupos': grupos
        }, status=201)

    except Exception as e:
        import traceback
        print("ERROR EN assign_groups:", str(e))
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)