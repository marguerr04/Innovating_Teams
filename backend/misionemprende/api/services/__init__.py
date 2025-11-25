# api/services/__init__.py
"""
Capa de servicios para lógica de negocio.
Separa la lógica compleja de las vistas para mantener responsabilidades claras.
"""

from .group_assignment_service import assign_groups_logic
from .estudiante_service import bulk_create_estudiantes_logic, get_estudiantes_por_equipo_logic
from .partida_service import crear_partida_logic, asignar_grupos_logic, obtener_grupos_logic
from .equipo_service import listar_equipos_logic
from .imagen_service import guardar_imagen_solucion_logic, obtener_imagen_equipo_logic

__all__ = [
    'assign_groups_logic',
    'bulk_create_estudiantes_logic',
    'get_estudiantes_por_equipo_logic',
    'crear_partida_logic',
    'asignar_grupos_logic',
    'obtener_grupos_logic',
    'listar_equipos_logic',
    'guardar_imagen_solucion_logic',
    'obtener_imagen_equipo_logic',
]
