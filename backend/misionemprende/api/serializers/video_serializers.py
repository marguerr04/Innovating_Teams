# api/serializers/video_serializers.py
"""
Serializers para el dominio de videos educativos y cursos.
"""

from rest_framework import serializers
from ..models import Video, Curso


class CursoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Curso."""
    
    class Meta:
        model = Curso
        fields = '__all__'


class VideoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Video.
    Incluye 'partida' para poder asignarla al crear/subir un video.
    """
    
    class Meta:
        model = Video
        fields = ['id', 'nombrevideo', 'url', 'partida']
