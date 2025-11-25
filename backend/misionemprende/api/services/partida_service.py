# api/services/partida_service.py
"""
Servicio para gestión de partidas.
Maneja la creación de partidas, asignación de grupos y consulta de información.
"""

from django.db import transaction
from django.utils.timezone import now
from django.utils import timezone
import random
import uuid

from ..models import Partida, Equipo, Usuario, Estudiante, ListaParticipante, PartidaUsuario
from ..repositories import PartidaRepository, EquipoRepository, EstudianteRepository


def crear_partida_logic(estado='CONFIGURACION', max_equipos=4, max_participantes=20):
    """
    Crea una nueva partida con código de acceso único.
    
    Args:
        estado: Estado inicial de la partida
        max_equipos: Número máximo de equipos
        max_participantes: Número máximo de participantes
        
    Returns:
        dict: Datos de la partida creada
    """
    # Generar un código único de acceso (PIN numérico de 6 dígitos)
    # Más fácil de compartir y recordar que UUID
    codigo_acceso = None
    intentos = 0
    max_intentos = 10
    
    while codigo_acceso is None and intentos < max_intentos:
        # Generar PIN de 6 dígitos (100000 a 999999)
        pin_candidato = str(random.randint(100000, 999999))
        
        # Verificar que no exista en la BD usando repository
        if not PartidaRepository.exists_codigo_acceso(pin_candidato):
            codigo_acceso = pin_candidato
        
        intentos += 1
    
    # Si después de 10 intentos no se encontró PIN único, usar UUID como fallback
    if codigo_acceso is None:
        codigo_acceso = str(uuid.uuid4())[:8]

    # Crear la partida en la base de datos usando repository
    partida = PartidaRepository.create(
        estado=estado,
        codigo_acceso=codigo_acceso,
        max_equipos=max_equipos,
        max_participantes=max_participantes,
        fecha_creacion=now(),
    )

    # Respuesta exitosa con el ID único de la partida
    return {
        "id": partida.id,
        "estado": partida.estado,
        "codigoAcceso": partida.codigoacceso,
        "maxEquipos": partida.maxequipos,
        "maxParticipantes": partida.maxparticipantes,
        "fechaCreacion": partida.fechacreacion,
    }


@transaction.atomic
def asignar_grupos_logic(partida, data_grupos):
    """
    Asigna grupos de estudiantes a una partida existente.
    
    Args:
        partida: Instancia de Partida
        data_grupos: Lista de grupos con sus alumnos
        
    Returns:
        dict: Resultado con grupos creados
        
    Raises:
        ValueError: Si el formato de datos es incorrecto
    """
    if not data_grupos or not isinstance(data_grupos, list):
        raise ValueError("Se esperaba una lista de 'grupos' en el JSON.")

    resultado_final = []
    
    # 3. Iterar sobre la lista de grupos del JSON
    for grupo_data in data_grupos:
        nombre_grupo_recibido = grupo_data.get('nombre')
        alumnos_data = grupo_data.get('alumnos')

        if not nombre_grupo_recibido or not alumnos_data:
            continue  # Omitir grupo mal formado

        # --- CAMBIO IMPORTANTE ---
        # 4. Crear SIEMPRE un nuevo equipo para esta partida usando repository.
        # No usamos get_or_create para evitar mezclar equipos de partidas distintas.
        # Nota: La relación con partida se establece en PartidaUsuario, no en Equipo
        nuevo_equipo = EquipoRepository.create(
            nombre=nombre_grupo_recibido,
            tamano=len(alumnos_data)
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
                continue  # Saltar alumno mal formado

            apellido_final = f"{ap_pat} {ap_mat}".strip()
            
            # 6. Lógica de "Crear si no existe" para el Usuario (Estudiante) usando repository
            usuario_obj, creado_usr = EstudianteRepository.get_or_create_usuario(
                email=correo,
                defaults={
                    'nombre': nombre,
                    'apellido': apellido_final,
                    'tipousuario': 'ESTUDIANTE',
                    'fechacreacion': timezone.now(),
                    'estado': 'ACTIVO',
                    'password': 'password_temporal_123'  # ¡OJO! Asegúrate de manejar esto
                }
            )
            
            # (Opcional pero recomendado: Poblar Estudiante y ListaParticipante usando repository)
            lista_p, _ = EstudianteRepository.get_or_create_lista_participante(
                email=correo,
                nombre=nombre
            )
            EstudianteRepository.get_or_create_estudiante(
                usuario=usuario_obj,
                lista_participante=lista_p
            )

            # 7. Poblar la tabla intermedia PARTIDA_USUARIO
            if not PartidaUsuario.objects.filter(usuario=usuario_obj, partida=partida).exists():
                PartidaUsuario.objects.create(
                    partida=partida,
                    usuario=usuario_obj,
                    equipo=nuevo_equipo  # Asignamos el usuario a la partida Y al equipo nuevo
                )
            
            grupo_resultado["alumnos_asignados"].append({
                "id_usuario": usuario_obj.id,
                "email": usuario_obj.email,
                "creado_nuevo": creado_usr
            })
        
        resultado_final.append(grupo_resultado)

    # 8. Devolver una respuesta exitosa
    return {
        "mensaje": f"Grupos asignados exitosamente a la partida {partida.id}",
        "partida_id": partida.id,
        "grupos_creados": resultado_final
    }


def obtener_grupos_logic(partida_id):
    """
    Obtiene los grupos y usuarios de una partida específica.
    
    Args:
        partida_id: ID de la partida
        
    Returns:
        dict: Grupos con sus alumnos
        
    Raises:
        ValueError: Si la partida no existe
    """
    partida = PartidaRepository.get_by_id(partida_id)
    if not partida:
        raise ValueError("La partida especificada no existe")

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

    return {"partida_id": partida_id, "grupos": resultado}
