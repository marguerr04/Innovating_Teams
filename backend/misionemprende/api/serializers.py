# api/serializers.py
from rest_framework import serializers
from .models import Estudiante, Curso, Usuario, ListaParticipante, Equipo, Video, Partida  # Importa los modelos que quieras exponer



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


class EquipoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Equipo.
    Permite obtener la lista de equipos con su id y nombre.
    """
    class Meta:
        model = Equipo
        fields = ['id', 'nombreequipo', 'tamanoequipo']
        
    # Renombrar el campo en el JSON de salida para que sea más legible
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['nombre'] = representation.pop('nombreequipo')
        return representation


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        # incluir 'partida' para poder asignarla al crear/subir un video
        fields = ['id', 'nombrevideo', 'url', 'partida']


class PartidaSerializer(serializers.ModelSerializer):
    # mostrar la lista de videos asociados usando el related_name 'videos'
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = Partida
        fields = ['id', 'fechacreacion', 'estado', 'codigoacceso', 'fechainicio', 'fechafin', 'maxequipos', 'maxparticipantes', 'videos']







