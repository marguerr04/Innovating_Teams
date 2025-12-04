"""
Script para crear usuario profesor de prueba
"""
import os
import django
from django.contrib.auth.hashers import make_password

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'misionemprende.settings')
django.setup()

from api.models import Usuario

# Datos del profesor
email = 'usuario2@innovate.com'
password = 'contraseña123'

# Verificar si ya existe
if Usuario.objects.filter(id_correo_usuario=email).exists():
    print(f"✅ El usuario {email} ya existe")
    usuario = Usuario.objects.get(id_correo_usuario=email)
    print(f"   - Nombre: {usuario.primer_nombre} {usuario.apellido_paterno}")
    print(f"   - Tipo: {usuario.tipousuario}")
    print(f"   - Estado: {usuario.estado}")
else:
    # Crear usuario
    usuario = Usuario.objects.create(
        id_correo_usuario=email,
        primer_nombre='Profesor',
        apellido_paterno='Demo',
        apellido_materno='Test',
        password=make_password(password),
        tipousuario='PROFESOR',
        estado='ACTIVO'
    )
    print(f"✅ Usuario profesor creado exitosamente!")
    print(f"   - Email: {email}")
    print(f"   - Password: {password}")
    print(f"   - Tipo: PROFESOR")
