# api/repositories/__init__.py
"""
Repositories para acceso a datos.
Encapsulan consultas ORM complejas para evitar duplicación en servicios.
"""

from .partida_repository import PartidaRepository
from .equipo_repository import EquipoRepository
from .estudiante_repository import EstudianteRepository


__all__ = [
    'PartidaRepository',
    'EquipoRepository',
    'EstudianteRepository',
]
