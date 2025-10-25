# api/serializers.py
from rest_framework import serializers
from .models import Estudiante, Curso, Usuario, ListaParticipante  # Importa los modelos que quieras exponer



class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'apellido', 'tipousuario'] # Mejor no exponer la contraseña


class ListaParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListaParticipante
        fields = ['id', 'emailestudiante', 'nombreestudiante']

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'apellido', 'tipousuario'] # Mejor no exponer la contraseña



class EstudianteSerializer(serializers.ModelSerializer):

    usuario = UsuarioSerializer(read_only=True)
    lista_participante = ListaParticipanteSerializer(read_only=True)

    class Meta:
        model = Estudiante
        fields = ['id', 'usuario', 'lista_participante']




class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'

