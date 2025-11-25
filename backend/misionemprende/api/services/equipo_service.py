# api/services/equipo_service.py
"""
Servicio para gestión de equipos.
Maneja operaciones relacionadas con equipos y sus integrantes.
"""

from ..repositories import EquipoRepository


def listar_equipos_logic():
    """
    Obtiene la lista de todos los equipos disponibles.
    
    Returns:
        QuerySet: Todos los equipos ordenados por ID
    """
    equipos = EquipoRepository.get_all()
    return equipos
