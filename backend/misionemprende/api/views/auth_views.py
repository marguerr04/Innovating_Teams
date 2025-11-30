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


@api_view(["POST"])
def validar_codigo_equipo(request):
    """
    Valida un código compuesto partida-equipo y registra la conexión del estudiante.
    El código tiene 7 dígitos: primeros 6 = código partida, último dígito = número de equipo.
    
    POST /api/validar-equipo/
    Body: { "codigo": "1234561", "usuario_id": 123 }  (usuario_id opcional, se puede crear si no existe)
    
    Ejemplo:
    - Código "1234561" → Partida: 123456, Equipo: 1
    - Código "1234562" → Partida: 123456, Equipo: 2
    
    Retorna:
    - valido: True si el código existe
    - partida_id: ID de la partida
    - partida_codigo: Código de la partida (6 dígitos)
    - equipo_id: ID del equipo
    - equipo_nombre: Nombre del equipo
    - equipo_numero: Número del equipo (1, 2, 3, 4...)
    - mensaje: Mensaje de bienvenida
    
    Errores:
    - 400: Código no proporcionado o formato inválido
    - 404: Código no existe en la base de datos
    - 403: Partida no disponible
    """
    from ..models import Equipo, PartidaUsuario, ConexionPartida, Usuario
    from ..repositories import PartidaRepository
    
    codigo = request.data.get("codigo", "").strip()
    
    # Validación básica
    if not codigo:
        return Response({
            "error": "Código requerido"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validar formato: debe tener 7 dígitos (6 partida + 1 equipo)
    if not codigo.isdigit() or len(codigo) != 7:
        return Response({
            "error": "Código inválido. Debe ser un número de 7 dígitos (ej: 1234561)"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Buscar equipo por código compuesto
    try:
        equipo = Equipo.objects.get(codigo_equipo=codigo)
    except Equipo.DoesNotExist:
        return Response({
            "error": "Código inválido. Verifica con tu profesor el código correcto de tu equipo"
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Obtener la partida desde el código (primeros 6 dígitos)
    try:
        codigo_partida = codigo[:6]  # Primeros 6 dígitos
        partida = PartidaRepository.get_by_codigo_acceso(codigo_partida)
        
        if not partida:
            return Response({
                "error": "El código de partida no existe. Verifica con tu profesor"
            }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            "error": f"Error al obtener información de la partida"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Verificar estado de la partida
    estados_validos = ['CONFIGURACION', 'EN_CURSO', 'ACTIVO']
    if partida.estado not in estados_validos:
        return Response({
            "error": "La partida ya finalizó o no está disponible para jugar"
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Verificar que el código de partida coincida
    if partida.codigoacceso != codigo_partida:
        return Response({
            "error": "El código no corresponde a la partida correcta"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Extraer número de equipo del código (último dígito)
    equipo_numero = int(codigo[-1])
    
    # Marcar el equipo completo como conectado (no rastreamos estudiantes individuales)
    # Solo registramos que este equipo ingresó su código y está activo
    conexion, created = ConexionPartida.objects.get_or_create(
        partida=partida,
        equipo=equipo,
        defaults={
            'codigo_ingresado': codigo,
            'activo': True,
            'usuario': None  # No rastreamos usuarios individuales, solo equipos
        }
    )
    
    # Si ya existía, reactivarlo
    if not created:
        conexion.activo = True
        conexion.codigo_ingresado = codigo
        conexion.save()
    
    # Código válido - devolver toda la información
    return Response({
        "valido": True,
        "partida_id": partida.id,
        "partida_codigo": partida.codigoacceso,
        "equipo_id": equipo.id,
        "equipo_nombre": equipo.nombreequipo,
        "equipo_numero": equipo_numero,
        "codigo_equipo": codigo,
        "estado_partida": partida.estado,
        "mensaje": f"¡Bienvenido al {equipo.nombreequipo}!"
    }, status=status.HTTP_200_OK)
