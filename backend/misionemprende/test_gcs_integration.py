"""
Script de prueba para verificar la integración de Google Cloud Storage
Ejecutar desde el directorio backend/misionemprende/
Uso: python test_gcs_integration.py
"""

import os
import sys
import django
import json
import requests
from pathlib import Path

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'misionemprende.settings')
django.setup()

def test_gcs_configuration():
    """Verificar que las configuraciones estén presentes"""
    from django.conf import settings
    
    print("=== Verificando configuraciones de Google Cloud Storage ===")
    
    # Verificar configuraciones requeridas
    required_settings = [
        'GCS_BUCKET_NAME',
        'GCS_PROJECT_ID',
        'GCS_REGION',
        'GCS_CREDENTIALS_FILE'
    ]
    
    for setting in required_settings:
        if hasattr(settings, setting):
            value = getattr(settings, setting)
            print(f"✓ {setting}: {value}")
        else:
            print(f"✗ {setting}: NO CONFIGURADO")
            return False
    
    # Verificar que el archivo de credenciales existe
    if os.path.exists(settings.GCS_CREDENTIALS_FILE):
        print(f"✓ Archivo de credenciales encontrado: {settings.GCS_CREDENTIALS_FILE}")
    else:
        print(f"✗ Archivo de credenciales NO encontrado: {settings.GCS_CREDENTIALS_FILE}")
        return False
    
    return True

def test_storage_service():
    """Probar el servicio de almacenamiento directamente"""
    print("\n=== Probando el servicio de almacenamiento ===")
    
    try:
        from api.storage_service import generate_signed_url
        from django.test import RequestFactory
        
        # Crear una request GET de prueba con los parámetros correctos
        factory = RequestFactory()
        request = factory.get('/api/signed-url/?grupoId=5&ext=png')
        
        # Ejecutar la función
        response = generate_signed_url(request)
        
        if response.status_code == 200:
            data = json.loads(response.content)
            print("✓ Servicio de almacenamiento funcionando")
            print(f"  - URL firmada generada: {data.get('uploadUrl', 'N/A')[:50]}...")
            print(f"  - URL pública generada: {data.get('publicUrl', 'N/A')}")
            print(f"  - Nombre del archivo: {data.get('filename', 'N/A')}")
            return True
        else:
            print(f"✗ Error en el servicio: {response.status_code}")
            print(f"  Contenido: {response.content}")
            return False
            
    except Exception as e:
        print(f"✗ Error al probar el servicio: {str(e)}")
        return False

def test_api_endpoint():
    """Probar el endpoint de la API (requiere servidor corriendo)"""
    print("\n=== Probando el endpoint de la API ===")
    
    try:
        url = 'http://localhost:8000/api/signed-url/?grupoId=5&ext=png'
        
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            result = response.json()
            print("✓ Endpoint de la API funcionando")
            print(f"  - URL firmada: {result.get('uploadUrl', 'N/A')[:50]}...")
            print(f"  - URL pública: {result.get('publicUrl', 'N/A')}")
            print(f"  - Nombre del archivo: {result.get('filename', 'N/A')}")
            return True
        else:
            print(f"✗ Error en el endpoint: {response.status_code}")
            print(f"  Respuesta: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("✗ No se puede conectar al servidor Django")
        print("  Asegúrate de que el servidor esté corriendo: python manage.py runserver")
        return False
    except Exception as e:
        print(f"✗ Error al probar el endpoint: {str(e)}")
        return False

def main():
    """Ejecutar todas las pruebas"""
    print("Iniciando pruebas de Google Cloud Storage Integration")
    print("=" * 60)
    
    tests = [
        ("Configuración", test_gcs_configuration),
        ("Servicio directo", test_storage_service),
        ("Endpoint API", test_api_endpoint)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"Error inesperado en {test_name}: {str(e)}")
            results.append((test_name, False))
    
    print("\n" + "=" * 60)
    print("RESUMEN DE PRUEBAS:")
    
    all_passed = True
    for test_name, passed in results:
        status = "✓ PASÓ" if passed else "✗ FALLÓ"
        print(f"  {test_name}: {status}")
        if not passed:
            all_passed = False
    
    if all_passed:
        print("\n🎉 Todas las pruebas pasaron! El sistema está listo para usar.")
    else:
        print("\n❌ Algunas pruebas fallaron. Revisa la configuración.")
        print("\nPasos para solucionar:")
        print("1. Asegúrate de tener el archivo gcs-credentials.json en backend/misionemprende/")
        print("2. Verifica las configuraciones en settings.py")
        print("3. Instala las dependencias: pip install google-cloud-storage")
        print("4. Ejecuta el servidor: python manage.py runserver")

if __name__ == "__main__":
    main()