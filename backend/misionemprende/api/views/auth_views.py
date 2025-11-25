# api/views/auth_views.py
"""
Vistas de autenticación para diferentes tipos de usuarios.
Incluye login para usuarios estándar, profesores y administradores.
"""

# Django imports
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import check_password

# Django REST Framework imports
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

# Modelos locales
from ..models import Usuario

User = get_user_model()


@api_view(["POST"])
def login_view(request):
    """
    Login para usuarios estándar del sistema.
    
    POST /api/login/
    Body: { "email": "user@example.com", "password": "password123" }
    
    Retorna:
    - token: Token de autenticación
    - username: Nombre de usuario
    - role: Rol del usuario (siempre "admin" en este caso)
    """
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


@api_view(["POST"])
def login_profesor(request):
    """
    Login específico para profesores.
    
    POST /api/login/profesor/
    Body: { "email": "profesor@example.com", "password": "password123" }
    
    Retorna:
    - token: Token de autenticación
    - username: Nombre del profesor
    - role: Rol del usuario (PROFESOR)
    """
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = Usuario.objects.get(email=email, estado="ACTIVO")
    except Usuario.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=400)

    if not check_password(password, user.password):
        return Response({"error": "Credenciales inválidas"}, status=400)

    if user.tipousuario != "PROFESOR":
        return Response({"error": "No tiene permisos para acceder como profesor"}, status=403)

    # Genera el token
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "username": user.nombre,
        "role": user.tipousuario
    })


@api_view(["POST"])
def login_admin(request):
    """
    Login específico para administradores.
    
    POST /api/login/admin/
    Body: { "email": "admin@example.com", "password": "password123" }
    
    Retorna:
    - token: Token de autenticación
    - username: Nombre del administrador
    - role: Rol del usuario (ADMINISTRADOR)
    """
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        # Busca al usuario por email y estado ACTIVO
        user = Usuario.objects.get(email=email, estado="ACTIVO")
    except Usuario.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=400)

    # Verifica la contraseña
    if not check_password(password, user.password):
        return Response({"error": "Credenciales inválidas"}, status=400)

    # Verifica el rol del usuario
    if user.tipousuario != "ADMINISTRADOR":
        return Response({"error": "No tiene permisos para acceder como administrador"}, status=403)

    # Genera el token
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "username": user.nombre,
        "role": user.tipousuario
    })
