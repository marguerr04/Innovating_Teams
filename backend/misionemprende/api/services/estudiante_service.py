# api/services/estudiante_service.py
"""
Servicio para operaciones de estudiantes.
Maneja la creación masiva y gestión de estudiantes.
"""

from django.db import transaction
from django.utils import timezone

from ..models import Usuario, Estudiante, ListaParticipante
from ..repositories import EstudianteRepository


def bulk_create_estudiantes_logic(estudiantes_data):
    """
    Crea o actualiza estudiantes en masa desde una lista de datos.
    
    Args:
        estudiantes_data: Lista de diccionarios con datos de estudiantes
        
    Returns:
        dict: Resultado con lista de estudiantes creados/actualizados y total
    """
    if estudiantes_data is None:
        raise ValueError('Campo "estudiantes" requerido')
    if not isinstance(estudiantes_data, list):
        raise ValueError('"estudiantes" debe ser una lista')

    resultado = []
    with transaction.atomic():
        for idx, est in enumerate(estudiantes_data, start=1):
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

            usuario, _ = EstudianteRepository.get_or_create_usuario(
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

            lista_participante, _ = EstudianteRepository.get_or_create_lista_participante(
                email=usuario.email,
                nombre=usuario.nombre
            )

            estudiante_obj, creado_est = EstudianteRepository.get_or_create_estudiante(
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

    return {'estudiantes': resultado, 'total': len(resultado)}


def get_estudiantes_por_equipo_logic(equipo_id):
    """
    Obtiene todos los estudiantes asociados a un equipo.
    
    Args:
        equipo_id: ID del equipo
        
    Returns:
        QuerySet: Usuarios del equipo con información de estudiante
    """
    # Usar repository para obtener usuarios con datos relacionados optimizados
    usuarios = EstudianteRepository.get_estudiantes_by_equipo(equipo_id)
    return usuarios
