"""
Verificar soluciones del equipo 1 después del upload
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'misionemprende.settings')
django.setup()

from .api.models import Equipo, SolucionLego

equipo = Equipo.objects.get(id=1)
soluciones = SolucionLego.objects.filter(equipo=equipo).order_by('-fechacreacion')

print(f"Equipo: {equipo.nombreequipo}")
print(f"Total soluciones: {soluciones.count()}")
print()

for i, sol in enumerate(soluciones, 1):
    print(f"Solución {i}:")
    print(f"  ID: {sol.id}")
    print(f"  Fecha: {sol.fechacreacion}")
    print(f"  URL: {sol.fotoprototipurl}")
    print(f"  Descripción: {sol.descripsoluc}")
    print()