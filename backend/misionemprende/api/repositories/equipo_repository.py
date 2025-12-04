# api/repositories/equipo_repository.py
"""
Repository para operaciones de base de datos relacionadas con Equipo.
"""

from ..models import Equipo


class EquipoRepository:
    """Encapsula consultas relacionadas con Equipo."""
    
    @staticmethod
    def get_by_id(equipo_id):
        """
        Obtiene un equipo por su ID.
        
        Args:
            equipo_id: ID del equipo
            
        Returns:
            Equipo: Instancia de Equipo o None si no existe
        """
        try:
            return Equipo.objects.get(id=equipo_id)
        except Equipo.DoesNotExist:
            return None
    
    @staticmethod
    def get_all():
        """
        Obtiene todos los equipos ordenados por ID.
        
        Returns:
            QuerySet: Lista de equipos
        """
        return Equipo.objects.all().order_by('id')
    
    @staticmethod
    def create(nombre, tamano):
        """
        Crea un nuevo equipo.
        
        Args:
            nombre: Nombre del equipo
            tamano: Tamaño del equipo
            
        Returns:
            Equipo: Nueva instancia creada
            
        Note:
            La relación con Partida se establece mediante PartidaUsuario
        """
        return Equipo.objects.create(
            nombreequipo=nombre,
            tamanoequipo=tamano,
        )
    
    @staticmethod
    def filter_by_partida(partida_id):
        """
        Obtiene equipos filtrados por partida.
        
        Args:
            partida_id: ID de la partida
            
        Returns:
            QuerySet: Lista de equipos de la partida
        """
        return Equipo.objects.filter(partida_id=partida_id)
