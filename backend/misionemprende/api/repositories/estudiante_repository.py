# api/repositories/estudiante_repository.py
"""
Repository para operaciones de base de datos relacionadas con Estudiante.
"""

from ..models import Usuario, Estudiante, ListaParticipante, PartidaUsuario


class EstudianteRepository:
    """Encapsula consultas relacionadas con Estudiante."""
    
    @staticmethod
    def get_usuario_by_email(email):
        """
        Obtiene un usuario por email.
        
        Args:
            email: Email del usuario
            
        Returns:
            Usuario: Instancia de Usuario o None si no existe
        """
        try:
            return Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return None
    
    @staticmethod
    def get_or_create_usuario(email, defaults):
        """
        Obtiene o crea un usuario.
        
        Args:
            email: Email del usuario
            defaults: Valores por defecto si se crea
            
        Returns:
            tuple: (Usuario, created)
        """
        return Usuario.objects.get_or_create(email=email, defaults=defaults)
    
    @staticmethod
    def get_or_create_lista_participante(email, nombre):
        """
        Obtiene o crea un participante en la lista.
        
        Args:
            email: Email del participante
            nombre: Nombre del participante
            
        Returns:
            tuple: (ListaParticipante, created)
        """
        return ListaParticipante.objects.get_or_create(
            emailestudiante=email,
            defaults={'nombreestudiante': nombre}
        )
    
    @staticmethod
    def get_or_create_estudiante(usuario, lista_participante):
        """
        Obtiene o crea un estudiante.
        
        Args:
            usuario: Instancia de Usuario
            lista_participante: Instancia de ListaParticipante
            
        Returns:
            tuple: (Estudiante, created)
        """
        return Estudiante.objects.get_or_create(
            usuario=usuario,
            defaults={'lista_participante': lista_participante}
        )
    
    @staticmethod
    def get_estudiantes_by_equipo(equipo_id):
        """
        Obtiene estudiantes de un equipo específico con sus datos relacionados.
        
        Args:
            equipo_id: ID del equipo
            
        Returns:
            QuerySet: Lista de usuarios del equipo con select_related
        """
        return Usuario.objects.filter(
            partidausuario__equipo_id=equipo_id
        ).select_related(
            'estudiante',
            'estudiante__lista_participante'
        )
    
    @staticmethod
    def create_partida_usuario(usuario, equipo, partida):
        """
        Crea una relación entre usuario, equipo y partida.
        
        Args:
            usuario: Instancia de Usuario
            equipo: Instancia de Equipo
            partida: Instancia de Partida
            
        Returns:
            PartidaUsuario: Nueva instancia creada
        """
        return PartidaUsuario.objects.create(
            usuario=usuario,
            equipo=equipo,
            partida=partida,
        )
