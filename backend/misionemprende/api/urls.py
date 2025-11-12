<<<<<<< HEAD
# backend/misionemprende/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import login_view, assign_groups 

# Router principal para los viewsets
=======
# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views # Importa las vistas que acabas de crear
from .views import login_view

>>>>>>> avanceAlejandro/rama_post_certamen_1
router = DefaultRouter()
router.register(r'estudiantes', views.EstudianteViewSet, basename='estudiante')
router.register(r'cursos', views.CursoViewSet, basename='curso')
router.register(r'usuarios', views.UsuarioViewSet, basename='usuario')

<<<<<<< HEAD
# Rutas adicionales
urlpatterns = [
    path('', include(router.urls)),  # incluye los endpoints del router
    path('login/', login_view, name='login'),
    path('equipos/<int:equipo_id>/estudiantes/', views.get_estudiantes_por_equipo, name='get-estudiantes-equipo'),
    path('groups/assign', assign_groups, name='assign_groups'),  
]
=======
urlpatterns = [
    path('', include(router.urls)),

     path("login/", login_view, name="login"),
     path('equipos/<int:equipo_id>/estudiantes/', views.get_estudiantes_por_equipo, name='get-estudiantes-equipo'),

    
]
>>>>>>> avanceAlejandro/rama_post_certamen_1
