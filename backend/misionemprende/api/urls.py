# backend/misionemprende/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import login_view, assign_groups, login_profesor, login_admin, crear_partida
from .views import asignar_grupos, obtener_grupos, guardar_imagen_solucion, obtener_imagen_equipo, listar_equipos
from .storage_service import generate_signed_url
from .database_test import test_database_connection

# Router principal para los viewsets
router = DefaultRouter()
router.register(r'estudiantes', views.EstudianteViewSet, basename='estudiante')
router.register(r'cursos', views.CursoViewSet, basename='curso')
router.register(r'usuarios', views.UsuarioViewSet, basename='usuario')
router.register(r'videos', views.VideoViewSet, basename='video')

# Rutas adicionales
urlpatterns = [
    path('', include(router.urls)),  # incluye los endpoints del router
    path('login/', login_view, name='login'),
    path('equipos/<int:equipo_id>/estudiantes/', views.get_estudiantes_por_equipo, name='get-estudiantes-equipo'),
    path('groups/assign', assign_groups, name='assign_groups'),  
    path('estudiantes/bulk_create/', views.bulk_create_estudiantes, name='bulk-create-estudiantes'),
    path('login/profesor/', login_profesor, name='login_profesor'),
    path('login/admin/', login_admin, name='login_admin'),
    path("crear-partida/", crear_partida, name="crear_partida"),

# Endpoint para la asignacion de grupos
    path("partida/<int:partida_id>/asignar-grupos/", asignar_grupos, name="asignar_grupos"),
    path('partida/<int:partida_id>/obtener-grupos/', views.obtener_grupos, name='obtener_grupos'),

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
