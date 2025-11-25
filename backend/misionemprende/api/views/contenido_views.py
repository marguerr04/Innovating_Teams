# api/views/contenido_views.py
"""
ViewSets para gestión de Cursos y Videos.
Proporciona endpoints CRUD para ambos modelos a través de Django REST Framework.
"""

# Django REST Framework imports
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Modelos locales
from ..models import Curso, Video

# Serializers
from ..serializers import CursoSerializer, VideoSerializer


class CursoViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar cursos.
    
    Endpoints generados automáticamente:
    - GET    /api/cursos/          Lista todos los cursos
    - POST   /api/cursos/          Crea un nuevo curso
    - GET    /api/cursos/{id}/     Obtiene un curso específico
    - PUT    /api/cursos/{id}/     Actualiza un curso completo
    - PATCH  /api/cursos/{id}/     Actualiza parcialmente un curso
    - DELETE /api/cursos/{id}/     Elimina un curso
    """
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer


class VideoViewSet(viewsets.ModelViewSet):
    """
    API endpoint para crear/listar/editar videos.
    
    Endpoints generados automáticamente:
    - GET    /api/videos/          Lista todos los videos
    - POST   /api/videos/          Crea un nuevo video
    - GET    /api/videos/{id}/     Obtiene un video específico
    - PUT    /api/videos/{id}/     Actualiza un video completo
    - PATCH  /api/videos/{id}/     Actualiza parcialmente un video
    - DELETE /api/videos/{id}/     Elimina un video
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
