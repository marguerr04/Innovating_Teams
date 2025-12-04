# api/serializers/equipo_serializers.py
"""
Serializers para el dominio de equipos.
"""

from rest_framework import serializers
from ..models import Equipo


class EquipoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Equipo.
    Permite obtener la lista de equipos con su id y nombre.
    Renombra 'nombreequipo' a 'nombre' en la respuesta JSON.
    """
    
    class Meta:
        model = Equipo
        fields = ['id', 'nombreequipo', 'tamanoequipo']
        
    def to_representation(self, instance):
        """Renombrar el campo en el JSON de salida para que sea más legible."""
        representation = super().to_representation(instance)
        representation['nombre'] = representation.pop('nombreequipo')
        return representation
