# api/repositories/partida_repository.py
"""
Repository para operaciones de base de datos relacionadas con Partida.
"""

from ..models import Partida


class PartidaRepository:
    """Encapsula consultas relacionadas con Partida."""
    
    @staticmethod
    def get_by_id(partida_id):
        """
        Obtiene una partida por su ID.
        
        Args:
            partida_id: ID de la partida
            
        Returns:
            Partida: Instancia de Partida o None si no existe
        """
        try:
            return Partida.objects.get(id=partida_id)
        except Partida.DoesNotExist:
            return None
    
    @staticmethod
    def get_by_codigo_acceso(codigo):
        """
        Obtiene una partida por su código de acceso.
        
        Args:
            codigo: Código de acceso único
            
        Returns:
            Partida: Instancia de Partida o None si no existe
        """
        try:
            return Partida.objects.get(codigoacceso=codigo)
        except Partida.DoesNotExist:
            return None
    
    @staticmethod
    def exists_codigo_acceso(codigo):
        """
        Verifica si existe una partida con el código de acceso dado.
        
        Args:
            codigo: Código de acceso a verificar
            
        Returns:
            bool: True si existe, False en caso contrario
        """
        return Partida.objects.filter(codigoacceso=codigo).exists()
    
    @staticmethod
    def create(estado, codigo_acceso, max_equipos, max_participantes, fecha_creacion):
        """
        Crea una nueva partida.
        
        Args:
            estado: Estado inicial
            codigo_acceso: Código único
            max_equipos: Máximo de equipos
            max_participantes: Máximo de participantes
            fecha_creacion: Fecha de creación
            
        Returns:
            Partida: Nueva instancia creada
        """
        return Partida.objects.create(
            estado=estado,
            codigoacceso=codigo_acceso,
            maxequipos=max_equipos,
            maxparticipantes=max_participantes,
            fechacreacion=fecha_creacion,
        )
