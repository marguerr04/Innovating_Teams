from django.shortcuts import render

# Create your views here.
# api/views.py
from rest_framework import viewsets
from .models import Estudiante, Curso, Usuario, PartidaUsuario
from .serializers import EstudianteSerializer, CursoSerializer, UsuarioSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response





# Esta clase ES la que hace la query
class EstudianteViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar estudiantes.
    """
    queryset = Estudiante.objects.all() # <-- ¡AQUÍ ESTÁ TU QUERY!
    serializer_class = EstudianteSerializer

class CursoViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar cursos.
    """
    queryset = Curso.objects.all() # <-- ¡OTRA QUERY!
    serializer_class = CursoSerializer
    
class UsuarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite ver o editar usuarios.
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer








@api_view(['GET'])
def get_estudiantes_por_equipo(request, equipo_id):
    """
    Devuelve todos los estudiantes asociados a un equipo.
    """
    try:
        usuarios_ids = PartidaUsuario.objects.filter(equipo_id=equipo_id).values_list('usuario_id', flat=True)
        estudiantes = Estudiante.objects.filter(usuario_id__in=usuarios_ids)
        serializer = EstudianteSerializer(estudiantes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
