# api/views/usuario_views.py
"""
ViewSets para gestión de Usuarios y Estudiantes.
Proporciona endpoints CRUD para ambos modelos a través de Django REST Framework.
"""

# Django REST Framework imports
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Modelos locales
from ..models import Usuario, Estudiante

# Serializers
from ..serializers import UsuarioSerializer, EstudianteSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar usuarios.
    
    Endpoints generados automáticamente:
    - GET    /api/usuarios/          Lista todos los usuarios
    - POST   /api/usuarios/          Crea un nuevo usuario
    - GET    /api/usuarios/{id}/     Obtiene un usuario específico
    - PUT    /api/usuarios/{id}/     Actualiza un usuario completo
    - PATCH  /api/usuarios/{id}/     Actualiza parcialmente un usuario
    - DELETE /api/usuarios/{id}/     Elimina un usuario
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class EstudianteViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar estudiantes.
    
    Endpoints generados automáticamente:
    - GET    /api/estudiantes/       Lista todos los estudiantes
    - POST   /api/estudiantes/       Crea un nuevo estudiante
    - GET    /api/estudiantes/{id}/  Obtiene un estudiante específico
    - PUT    /api/estudiantes/{id}/  Actualiza un estudiante completo
    - PATCH  /api/estudiantes/{id}/  Actualiza parcialmente un estudiante
    - DELETE /api/estudiantes/{id}/  Elimina un estudiante
    """
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer
