"""
Script de verificación rápida de base de datos
Para ejecutar: python manage.py shell < check_db.py
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'misionemprende.settings')
django.setup()

from api.models import Equipo, SolucionLego
from django.db import connection

print("=== VERIFICACIÓN DE BASE DE DATOS ===")
print()

# 1. Verificar conexión
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        print(f"✅ Conexión PostgreSQL exitosa: {version}")
except Exception as e:
    print(f"❌ Error de conexión: {e}")
    exit(1)

# 2. Verificar tablas
print("\n=== VERIFICACIÓN DE TABLAS ===")

try:
    equipos = Equipo.objects.all()[:5]
    print(f"✅ Tabla 'equipo': {Equipo.objects.count()} registros")
    for equipo in equipos:
        print(f"   - ID: {equipo.id}, Nombre: {equipo.nombreequipo}")
except Exception as e:
    print(f"❌ Error en tabla 'equipo': {e}")

try:
    soluciones = SolucionLego.objects.all()[:5]
    print(f"✅ Tabla 'solucion_lego': {SolucionLego.objects.count()} registros")
    for solucion in soluciones:
        print(f"   - ID: {solucion.id}, Equipo: {solucion.equipo_id}")
except Exception as e:
    print(f"❌ Error en tabla 'solucion_lego': {e}")

# 3. Verificar que existe equipo con ID 1
print("\n=== VERIFICACIÓN EQUIPO ID=1 ===")
try:
    equipo = Equipo.objects.get(id=1)
    print(f"✅ Equipo ID=1 existe: {equipo.nombreequipo}")
except Equipo.DoesNotExist:
    print("❌ No existe equipo con ID=1")
    print("📝 Creando equipo de prueba...")
    equipo = Equipo.objects.create(nombreequipo="Equipo de Prueba", tamanoequipo=4)
    print(f"✅ Equipo creado con ID: {equipo.id}")
except Exception as e:
    print(f"❌ Error verificando equipo: {e}")

print("\n=== VERIFICACIÓN COMPLETADA ===")