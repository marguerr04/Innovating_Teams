# api/serializers/usuario_serializers.py
"""
Serializers para el dominio de usuarios (Usuario, Estudiante, ListaParticipante).
"""

from rest_framework import serializers
from ..models import Usuario, Estudiante, ListaParticipante


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Usuario."""
    
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'apellido', 'tipousuario']


class ListaParticipanteSerializer(serializers.ModelSerializer):
    """Serializer para el modelo ListaParticipante."""
    
    class Meta:
        model = ListaParticipante
        fields = ['id', 'emailestudiante', 'nombreestudiante']


class EstudianteSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Estudiante.
    Incluye información anidada de usuario y lista de participantes.
    """
    
    usuario = UsuarioSerializer(read_only=True)
    lista_participante = ListaParticipanteSerializer(read_only=True)

    class Meta:
        model = Estudiante
        fields = ['id', 'usuario', 'lista_participante']
