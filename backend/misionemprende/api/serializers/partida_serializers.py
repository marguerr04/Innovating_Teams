# api/serializers/partida_serializers.py
"""
Serializers para el dominio de partidas (sesiones de juego).
"""

from rest_framework import serializers
from ..models import Partida
from .video_serializers import VideoSerializer


class PartidaSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Partida.
    Incluye la lista de videos asociados a la partida.
    """
    
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = Partida
        fields = [
            'id',
            'fechacreacion',
            'estado',
            'codigoacceso',
            'fechainicio',
            'fechafin',
            'maxequipos',
            'maxparticipantes',
            'videos'
        ]
