# backend/misionemprende/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Todos los imports desde views (ahora manejado por views/__init__.py)
from .views import (
    # ViewSets
    UsuarioViewSet, EstudianteViewSet, CursoViewSet, VideoViewSet,
    # Autenticación
    login_view, login_profesor, login_admin, validar_codigo_acceso, validar_codigo_equipo,
    # Endpoints de función
    assign_groups, bulk_create_estudiantes, crear_partida,
    asignar_grupos, obtener_grupos, get_estudiantes_por_equipo,
    guardar_imagen_solucion, obtener_imagen_equipo, listar_equipos, unirse_equipo
)

# Servicios externos
from .storage_service import generate_signed_url
from .database_test import test_database_connection

# Router principal para los viewsets
router = DefaultRouter()
router.register(r'estudiantes', EstudianteViewSet, basename='estudiante')
router.register(r'cursos', CursoViewSet, basename='curso')
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'videos', VideoViewSet, basename='video')

# Rutas adicionales
urlpatterns = [
    path('', include(router.urls)),  # incluye los endpoints del router
    path('login/', login_view, name='login'),
    path('equipos/<int:equipo_id>/estudiantes/', get_estudiantes_por_equipo, name='get-estudiantes-equipo'),
    path('groups/assign', assign_groups, name='assign_groups'),  
    path('estudiantes/bulk_create/', bulk_create_estudiantes, name='bulk-create-estudiantes'),
    path('login/profesor/', login_profesor, name='login_profesor'),
    path('login/admin/', login_admin, name='login_admin'),
    path('validar-codigo/', validar_codigo_acceso, name='validar_codigo_acceso'),
    path('validar-equipo/', validar_codigo_equipo, name='validar_codigo_equipo'),
    path('unirse-equipo/', unirse_equipo, name='unirse_equipo'),
    path("crear-partida/", crear_partida, name="crear_partida"),

# Endpoint para la asignacion de grupos
    path("partida/<int:partida_id>/asignar-grupos/", asignar_grupos, name="asignar_grupos"),
    path('partida/<int:partida_id>/obtener-grupos/', obtener_grupos, name='obtener_grupos'),

# Endpoint para el servicio de almacenamiento
    path('storage/signed-url/', generate_signed_url, name='generate_signed_url'),
    # Ruta corta para compatibilidad con la guía de uso (/api/signed-url/)
    path('signed-url/', generate_signed_url, name='signed-url'),
    
# Endpoint para guardar imágenes en BD
    path('guardar-imagen/', guardar_imagen_solucion, name='guardar_imagen_solucion'),
    
# Endpoint para obtener imagen de equipo
    path('obtener-imagen/', obtener_imagen_equipo, name='obtener_imagen_equipo'),
    
# Endpoint para listar todos los equipos
    path('equipos/', listar_equipos, name='listar_equipos'),
    
    # Endpoint de diagnóstico de base de datos
    path('test-db/', test_database_connection, name='test_database_connection'),

]
