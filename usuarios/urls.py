from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'detalles-equipo', views.DetalleEquipoViewSet, basename='detalles-equipo')

urlpatterns = [
    path('', views.index, name='index'),
    path('login/alumno/', views.login_alumno, name='login_alumno'),
    path('login/profesor_admin/', views.login_profesor, name='login_profesor_admin'),
    path('', include(router.urls)),
]
