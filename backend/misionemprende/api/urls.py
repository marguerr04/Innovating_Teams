# backend/misionemprende/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import login_view, assign_groups, login_profesor, login_admin

# Router principal para los viewsets
router = DefaultRouter()
router.register(r'estudiantes', views.EstudianteViewSet, basename='estudiante')
router.register(r'cursos', views.CursoViewSet, basename='curso')
router.register(r'usuarios', views.UsuarioViewSet, basename='usuario')

# Rutas adicionales
urlpatterns = [
    path('', include(router.urls)),  # incluye los endpoints del router
    path('login/', login_view, name='login'),
    path('equipos/<int:equipo_id>/estudiantes/', views.get_estudiantes_por_equipo, name='get-estudiantes-equipo'),
    path('groups/assign', assign_groups, name='assign_groups'),  
    path('estudiantes/bulk_create/', views.bulk_create_estudiantes, name='bulk-create-estudiantes'),
    path('login/profesor/', login_profesor, name='login_profesor'),
    path('login/admin/', login_admin, name='login_admin')
]
