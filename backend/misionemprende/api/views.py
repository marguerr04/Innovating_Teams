from django.shortcuts import render

# Create your views here.
# api/views.py
from rest_framework import viewsets
from .models import Estudiante, Curso, Usuario
from .serializers import EstudianteSerializer, CursoSerializer, UsuarioSerializer

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