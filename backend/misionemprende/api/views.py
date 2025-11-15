from django.shortcuts import render
from django.utils import timezone
from django.db import transaction
from django.http import JsonResponse
import math 
from django.views.decorators.csrf import csrf_exempt # desactivacion temporal de la verificacion CSRF para probar post de csv
from rest_framework.parsers import JSONParser



from api.models import Usuario
# Django REST Framework imports
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import check_password # para verificar contraseñas
# Modelos y serializers
from .models import Estudiante, Curso, Usuario, PartidaUsuario, Equipo, Partida,  ListaParticipante

from .serializers import EstudianteSerializer, CursoSerializer, UsuarioSerializer

# Autenticación
from django.contrib.auth import authenticate, get_user_model

# Utilidades
import csv
import io
import random
from django.utils.timezone import now # para manejar fechas y horas
import uuid

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

# endpoint para profesor

@api_view(["POST"])
def login_profesor(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = Usuario.objects.get(email=email, estado="ACTIVO")
    except Usuario.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=400)

    if not check_password(password, user.password):
        return Response({"error": "Credenciales inválidas"}, status=400)

    if user.tipousuario != "PROFESOR":
        return Response({"error": "No tiene permisos para acceder como profesor"}, status=403)

    # Genera el token
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "username": user.nombre,
        "role": user.tipousuario
    })


@api_view(["POST"])
def login_admin(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        # Busca al usuario por email y estado ACTIVO
        user = Usuario.objects.get(email=email, estado="ACTIVO")
    except Usuario.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=400)

    # Verifica la contraseña
    if not check_password(password, user.password):
        return Response({"error": "Credenciales inválidas"}, status=400)

    # Verifica el rol del usuario
    if user.tipousuario != "ADMINISTRADOR":
        return Response({"error": "No tiene permisos para acceder como administrador"}, status=403)

    # Genera el token
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "username": user.nombre,
        "role": user.tipousuario
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


@api_view(['POST'])
def bulk_create_estudiantes(request):
    """
    Endpoint: /api/estudiantes/bulk_create/
    Recibe JSON: { "estudiantes": [ {"correo":"","rut":"","nombre":"","apellido_paterno":"","apellido_materno":""}, ... ] }
    Crea (o reutiliza) Usuario y Estudiante. Devuelve lista creada/reutilizada.
    """
    try:
        data = request.data.get('estudiantes')
        if data is None:
            return Response({'error': 'Campo "estudiantes" requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(data, list):
            return Response({'error': '"estudiantes" debe ser una lista'}, status=status.HTTP_400_BAD_REQUEST)

        resultado = []
        with transaction.atomic():
            for idx, est in enumerate(data, start=1):
                correo = (est.get('correo') or est.get('email') or '').strip()
                rut = (est.get('rut') or '').strip()
                nombre = (est.get('nombre') or '').strip()
                ap_pat = (est.get('apellido_paterno') or '').strip()
                ap_mat = (est.get('apellido_materno') or '').strip()

                # Validación mínima
                if not correo or not nombre:
                    # Saltar fila inválida sin abortar todo
                    continue

                apellido_final = f"{ap_pat} {ap_mat}".strip()

                usuario, _ = Usuario.objects.get_or_create(
                    email=correo,
                    defaults={
                        'nombre': nombre,
                        'apellido': apellido_final,
                        'tipousuario': 'ESTUDIANTE',
                        'fechacreacion': timezone.now(),
                        'estado': 'ACTIVO',
                    }
                )

                # Actualizar nombre/apellido si llegaron distintos
                actual_nombre = usuario.nombre or ''
                actual_apellido = usuario.apellido or ''
                if actual_nombre != nombre or actual_apellido != apellido_final:
                    usuario.nombre = nombre
                    usuario.apellido = apellido_final
                    usuario.save()

                lista_participante, _ = ListaParticipante.objects.get_or_create(
                    emailestudiante=usuario.email,
                    defaults={'nombreestudiante': usuario.nombre}
                )

                estudiante_obj, creado_est = Estudiante.objects.get_or_create(
                    usuario=usuario,
                    defaults={'lista_participante': lista_participante}
                )
                if not creado_est and estudiante_obj.lista_participante_id != lista_participante.id:
                    estudiante_obj.lista_participante = lista_participante
                    estudiante_obj.save()

                resultado.append({
                    'id': estudiante_obj.id,
                    'correo': usuario.email,
                    'nombre': usuario.nombre,
                    'apellido': usuario.apellido,
                    'rut': rut,
                    'nuevo': creado_est
                })

        return Response({'estudiantes': resultado, 'total': len(resultado)}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    






@api_view(["POST"])
def crear_partida(request):
    """
    Endpoint para crear una partida única.
    """
    try:
        # Datos enviados desde el frontend
        estado = request.data.get("estado", "EN_CURSO")  # Estado por defecto
        max_equipos = request.data.get("max_equipos", 4)  # Número máximo de equipos
        max_participantes = request.data.get("max_participantes", 20)  # Número máximo de participantes
        codigo_acceso = str(uuid.uuid4())[:8]  # Generar un código único de acceso (8 caracteres)

        # Crear la partida en la base de datos
        partida = Partida.objects.create(
            fechacreacion=now(),  # Cambiado a minúsculas
            estado=estado,
            codigoacceso=codigo_acceso,  # Cambiado a minúsculas
            maxequipos=max_equipos,  # Cambiado a minúsculas
            maxparticipantes=max_participantes,  # Cambiado a minúsculas
        )

        # Respuesta exitosa con el ID único de la partida
        return Response({
            "id": partida.id,
            "estado": partida.estado,
            "codigoAcceso": partida.codigoacceso,  # Cambiado a minúsculas
            "maxEquipos": partida.maxequipos,  # Cambiado a minúsculas
            "maxParticipantes": partida.maxparticipantes,  # Cambiado a minúsculas
            "fechaCreacion": partida.fechacreacion,  # Cambiado a minúsculas
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    






# Endpoints relacionados a la asignacion de grupos



@api_view(['POST'])
@parser_classes([JSONParser]) # 
@transaction.atomic # Si algo falla en el proceso, revierte todos los cambios a la BD
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
        try:
            partida = Partida.objects.get(id=partida_id)
        except Partida.DoesNotExist:
            return Response({"error": "La partida con este ID no existe."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Obtener el JSON que envió el frontend
        data_grupos = request.data.get('grupos')
        if not data_grupos or not isinstance(data_grupos, list):
            return Response({"error": "Se esperaba una lista de 'grupos' en el JSON."}, status=status.HTTP_400_BAD_REQUEST)

        resultado_final = []
        
        # 3. Iterar sobre la lista de grupos del JSON
        for grupo_data in data_grupos:
            nombre_grupo_recibido = grupo_data.get('nombre')
            alumnos_data = grupo_data.get('alumnos')

            if not nombre_grupo_recibido or not alumnos_data:
                continue # Omitir grupo mal formado

            # --- CAMBIO IMPORTANTE ---
            # 4. Crear SIEMPRE un nuevo equipo para esta partida.
            # No usamos get_or_create para evitar mezclar equipos de partidas distintas.
            nuevo_equipo = Equipo.objects.create(
                nombreequipo=nombre_grupo_recibido,
                tamanoequipo=len(alumnos_data) # Opcional: guardamos el tamaño
            )
            # -------------------------

            grupo_resultado = {
                "id_equipo_creado": nuevo_equipo.id,
                "nombre_grupo": nuevo_equipo.nombreequipo,
                "alumnos_asignados": []
            }

            # 5. Iterar sobre la lista de alumnos de ese grupo
            for alumno_data in alumnos_data:
                correo = (alumno_data.get('id_correo_usuario') or '').strip()
                nombre = (alumno_data.get('primer_nombre') or '').strip()
                ap_pat = (alumno_data.get('apellido_paterno') or '').strip()
                ap_mat = (alumno_data.get('apellido_materno') or '').strip()

                if not correo or not nombre:
                    continue # Saltar alumno mal formado

                apellido_final = f"{ap_pat} {ap_mat}".strip()
                
                # 6. Lógica de "Crear si no existe" para el Usuario (Estudiante)
                # Tu lógica de get_or_create aquí está PERFECTA.
                usuario_obj, creado_usr = Usuario.objects.get_or_create(
                    email=correo,
                    defaults={
                        'nombre': nombre,
                        'apellido': apellido_final,
                        'tipousuario': 'ESTUDIANTE',
                        'fechacreacion': timezone.now(),
                        'estado': 'ACTIVO',
                        'password': 'password_temporal_123' # ¡OJO! Asegúrate de manejar esto
                    }
                )
                
                # (Opcional pero recomendado: Poblar Estudiante y ListaParticipante)
                lista_p, _ = ListaParticipante.objects.get_or_create(emailestudiante=correo, defaults={'nombreestudiante': nombre})
                Estudiante.objects.get_or_create(usuario=usuario_obj, defaults={'lista_participante': lista_p})


                # 7. Poblar la tabla intermedia PARTIDA_USUARIO
                # Esta es la tabla que une todo: Partida 40, Usuario X, Equipo Y
                # Esta lógica está PERFECTA.
                if not PartidaUsuario.objects.filter(usuario=usuario_obj, partida=partida).exists():
                    PartidaUsuario.objects.create(
                        partida=partida,
                        usuario=usuario_obj,
                        equipo=nuevo_equipo # Asignamos el usuario a la partida Y al equipo nuevo
                    )
                
                grupo_resultado["alumnos_asignados"].append({
                    "id_usuario": usuario_obj.id,
                    "email": usuario_obj.email,
                    "creado_nuevo": creado_usr
                })
            
            resultado_final.append(grupo_resultado)

        # 8. Devolver una respuesta exitosa al frontend
        return Response({
            "mensaje": f"Grupos asignados exitosamente a la partida {partida_id}",
            "partida_id": partida.id,
            "grupos_creados": resultado_final
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        # Si algo falla, la transacción @transaction.atomic revierte todo
        return Response({"error": f"Error interno del servidor: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    




@api_view(["GET"])
def obtener_grupos(request, partida_id):
    """
    Endpoint para obtener los grupos y usuarios de una partida específica.
    """
    try:
        partida = Partida.objects.filter(id=partida_id).first()
        if not partida:
            return Response({"error": "La partida especificada no existe"}, status=status.HTTP_404_NOT_FOUND)

        equipos = Equipo.objects.filter(partidausuario__partida=partida).distinct()
        resultado = []

        for equipo in equipos:
            usuarios = Usuario.objects.filter(partidausuario__equipo=equipo, partidausuario__partida=partida)
            resultado.append({
                "nombre_grupo": equipo.nombreequipo,
                "alumnos": [
                    {
                        "correo": usuario.email,
                        "nombre": usuario.nombre,
                        "apellido": usuario.apellido,
                    }
                    for usuario in usuarios
                ],
            })

        return Response({"partida_id": partida_id, "grupos": resultado}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)