# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views # Importa las vistas que acabas de crear

router = DefaultRouter()
router.register(r'estudiantes', views.EstudianteViewSet, basename='estudiante')
router.register(r'cursos', views.CursoViewSet, basename='curso')
router.register(r'usuarios', views.UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('', include(router.urls)),


     path('equipos/<int:equipo_id>/estudiantes/', views.get_estudiantes_por_equipo, name='get-estudiantes-equipo'),

    
]