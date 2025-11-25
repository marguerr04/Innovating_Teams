# views/__init__.py
# Importar todas las vistas para mantener compatibilidad con urls.py

from .auth_views import login_view, login_profesor, login_admin, validar_codigo_acceso
from .usuario_views import UsuarioViewSet, EstudianteViewSet
from .contenido_views import CursoViewSet, VideoViewSet

# Importar endpoints de función desde endpoints.py (módulo renombrado)
from api import endpoints

# Re-exportar las funciones de endpoint
assign_groups = endpoints.assign_groups
bulk_create_estudiantes = endpoints.bulk_create_estudiantes
crear_partida = endpoints.crear_partida
asignar_grupos = endpoints.asignar_grupos
obtener_grupos = endpoints.obtener_grupos
get_estudiantes_por_equipo = endpoints.get_estudiantes_por_equipo
guardar_imagen_solucion = endpoints.guardar_imagen_solucion
obtener_imagen_equipo = endpoints.obtener_imagen_equipo
listar_equipos = endpoints.listar_equipos

__all__ = [
    # Autenticación
    'login_view',
    'login_profesor', 
    'login_admin',
    # ViewSets
    'UsuarioViewSet',
    'EstudianteViewSet',
    'CursoViewSet',
    'VideoViewSet',
    # Endpoints de función
    'assign_groups',
    'bulk_create_estudiantes',
    'crear_partida',
    'asignar_grupos',
    'obtener_grupos',
    'get_estudiantes_por_equipo',
    'guardar_imagen_solucion',
    'obtener_imagen_equipo',
    'listar_equipos',
]
