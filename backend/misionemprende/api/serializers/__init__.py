# api/serializers/__init__.py
"""
Serializers organizados por dominio.
Re-exporta todos los serializers para mantener compatibilidad con imports existentes.
"""

from .usuario_serializers import (
    UsuarioSerializer,
    ListaParticipanteSerializer,
    EstudianteSerializer,
)
from .partida_serializers import PartidaSerializer
from .equipo_serializers import EquipoSerializer
from .video_serializers import CursoSerializer, VideoSerializer


__all__ = [
    'UsuarioSerializer',
    'ListaParticipanteSerializer',
    'EstudianteSerializer',
    'PartidaSerializer',
    'EquipoSerializer',
    'CursoSerializer',
    'VideoSerializer',
]
