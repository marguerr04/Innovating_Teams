from django.shortcuts import render

# Create your views here.
# api/views.py
from rest_framework import viewsets
from .models import Estudiante, Curso, Usuario, PartidaUsuario
from .serializers import EstudianteSerializer, CursoSerializer, UsuarioSerializer
from django.contrib.auth import authenticate, get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


User = get_user_model()

@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=400)

    # Autenticamos con el username real del usuario
    user = authenticate(username=user.username, password=password)
    if not user:
        return Response({"error": "Credenciales inválidas"}, status=400)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "username": user.username,
        "role": "admin",  # como esta demo es solo para admin
    })


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
