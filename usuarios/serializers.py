# En usuarios/serializers.py

from rest_framework import serializers
from .models import VistaDetalleEquipo, Equipo # Importa los modelos que necesites

class DetalleEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VistaDetalleEquipo
        fields = '__all__' # Incluye todos los campos del modelo/vista