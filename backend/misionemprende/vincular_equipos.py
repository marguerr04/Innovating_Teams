# Script para vincular equipos existentes con la partida 65
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'misionemprende.settings')
django.setup()

from api.models import Equipo, Partida, PartidaUsuario

# Obtener la partida
partida = Partida.objects.get(id=65)
print(f"Partida {partida.id} - Código: {partida.codigoacceso}")

# Buscar equipos con códigos que empiecen con el código de la partida
codigo_partida = str(partida.codigoacceso)
equipos = Equipo.objects.filter(codigo_equipo__startswith=codigo_partida)

print(f"\nEncontrados {equipos.count()} equipos:")

for equipo in equipos:
    print(f"  - {equipo.nombreequipo} (código: {equipo.codigo_equipo})")
    
    # Crear relación si no existe
    if not PartidaUsuario.objects.filter(partida=partida, equipo=equipo).exists():
        PartidaUsuario.objects.create(
            partida=partida,
            usuario=None,
            equipo=equipo
        )
        print(f"    ✅ Vinculado con partida {partida.id}")
    else:
        print(f"    ℹ️  Ya estaba vinculado")

print("\n✅ Proceso completado")
