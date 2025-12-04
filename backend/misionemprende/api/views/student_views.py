# backend/misionemprende/api/views/student_views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from ..models import Usuario, Equipo, PartidaUsuario
from ..repositories import PartidaRepository

@api_view(['POST'])
def unirse_equipo(request):
    """
    Registra a un estudiante en un equipo y partida.
    
    POST /api/unirse-equipo/
    Body: {
        "codigo_equipo": "9773211",
        "nombre": "Juan",
        "apellido": "Pérez",
        "correo": "juan@example.com" (opcional)
    }
    
    Returns:
        - success: True si se registró correctamente
        - usuario_id: ID del usuario creado/actualizado
        - equipo_id: ID del equipo
        - partida_id: ID de la partida
        - mensaje: Mensaje de confirmación
    """
    codigo_equipo = request.data.get("codigo_equipo", "").strip()
    nombre = request.data.get("nombre", "").strip()
    apellido = request.data.get("apellido", "").strip()
    correo = request.data.get("correo", "").strip()
    
    # Validaciones
    if not codigo_equipo or len(codigo_equipo) != 7:
        return Response({
            "error": "Código de equipo inválido"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not nombre or not apellido:
        return Response({
            "error": "Nombre y apellido son requeridos"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        with transaction.atomic():
            # Buscar el equipo
            try:
                equipo = Equipo.objects.get(codigo_equipo=codigo_equipo)
            except Equipo.DoesNotExist:
                return Response({
                    "error": "El código de equipo no existe"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Obtener la partida
            codigo_partida = codigo_equipo[:6]
            partida = PartidaRepository.get_by_codigo_acceso(codigo_partida)
            
            if not partida:
                return Response({
                    "error": "La partida no existe"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Verificar estado de la partida
            if partida.estado not in ['CONFIGURACION', 'EN_CURSO', 'ACTIVO']:
                return Response({
                    "error": "La partida no está disponible"
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Crear o actualizar usuario
            if correo:
                # Buscar por correo si se proporciona
                usuario, created = Usuario.objects.get_or_create(
                    email=correo,
                    defaults={
                        'nombre': nombre,
                        'apellido': apellido,
                        'rol': 'alumno'
                    }
                )
                if not created:
                    # Actualizar datos si el usuario ya existía
                    usuario.nombre = nombre
                    usuario.apellido = apellido
                    usuario.save()
            else:
                # Sin correo, crear nuevo usuario con correo temporal
                correo_temporal = f"{nombre.lower()}.{apellido.lower()}@temp.com"
                usuario, created = Usuario.objects.get_or_create(
                    nombre=nombre,
                    apellido=apellido,
                    defaults={
                        'email': correo_temporal,
                        'rol': 'alumno'
                    }
                )
            
            # Verificar si ya está registrado en este equipo/partida
            partida_usuario_exists = PartidaUsuario.objects.filter(
                usuario=usuario,
                partida=partida,
                equipo=equipo
            ).exists()
            
            if not partida_usuario_exists:
                # Registrar al usuario en la partida y equipo
                PartidaUsuario.objects.create(
                    usuario=usuario,
                    partida=partida,
                    equipo=equipo
                )
                mensaje = f"¡Bienvenido {nombre}! Te has unido correctamente al {equipo.nombreequipo}"
            else:
                mensaje = f"¡Bienvenido de nuevo {nombre}! Ya estabas registrado en el {equipo.nombreequipo}"
            
            return Response({
                "success": True,
                "usuario_id": usuario.id,
                "equipo_id": equipo.id,
                "equipo_nombre": equipo.nombreequipo,
                "partida_id": partida.id,
                "mensaje": mensaje
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({
            "error": f"Error al registrar estudiante: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
