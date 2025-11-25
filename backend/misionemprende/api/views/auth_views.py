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


@api_view(["POST"])
def validar_codigo_acceso(request):
    """
    Valida que un código de acceso sea válido para entrar a una partida.
    
    POST /api/validar-codigo/
    Body: { "codigo": "123456" }
    
    Retorna:
    - valido: True si el código existe
    - partida_id: ID de la partida
    - estado: Estado actual de la partida
    - mensaje: Mensaje descriptivo
    
    Errores:
    - 400: Código no proporcionado
    - 404: Código no existe
    - 403: Partida no disponible (estado incorrecto)
    """
    from ..repositories import PartidaRepository
    
    codigo = request.data.get("codigo", "").strip()
    
    if not codigo:
        return Response({
            "error": "Código de acceso requerido"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validar que el código tenga el formato correcto (6 dígitos)
    if not codigo.isdigit() or len(codigo) != 6:
        return Response({
            "error": "Código inválido. Debe ser un número de 6 dígitos"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Buscar partida por código
    partida = PartidaRepository.get_by_codigo_acceso(codigo)
    
    if not partida:
        return Response({
            "error": "Código de acceso inválido. Verifica con tu profesor"
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Verificar que la partida esté en un estado válido para unirse
    estados_validos = ['CONFIGURACION', 'EN_CURSO', 'ACTIVO']
    if partida.estado not in estados_validos:
        return Response({
            "error": f"La partida ya finalizó o no está disponible"
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Código válido
    return Response({
        "valido": True,
        "partida_id": partida.id,
        "estado": partida.estado,
        "mensaje": "Código válido. Bienvenido al juego!"
    }, status=status.HTTP_200_OK)
