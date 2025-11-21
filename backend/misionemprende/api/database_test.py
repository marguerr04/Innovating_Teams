from django.http import JsonResponse
from django.db import connection
from .models import Equipo, SolucionLego
import traceback

def test_database_connection(request):
    """
    Endpoint de diagnóstico para probar la conexión a la base de datos
    """
    try:
        # Test 1: Conexión básica
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            db_version = cursor.fetchone()
        
        # Test 2: Verificar que las tablas existen
        table_checks = {}
        
        # Verificar tabla equipo
        try:
            equipos_count = Equipo.objects.count()
            table_checks['equipo'] = f'OK - {equipos_count} equipos'
        except Exception as e:
            table_checks['equipo'] = f'ERROR - {str(e)}'
        
        # Verificar tabla solucion_lego
        try:
            soluciones_count = SolucionLego.objects.count()
            table_checks['solucion_lego'] = f'OK - {soluciones_count} soluciones'
        except Exception as e:
            table_checks['solucion_lego'] = f'ERROR - {str(e)}'
        
        # Test 3: Intentar crear un equipo de prueba
        try:
            equipo_test = Equipo.objects.create(
                nombreequipo='Test Equipo',
                tamanoequipo=3
            )
            test_create = f'OK - Equipo creado con ID {equipo_test.id}'
            # Eliminar el equipo de prueba
            equipo_test.delete()
        except Exception as e:
            test_create = f'ERROR - {str(e)}'
        
        return JsonResponse({
            'status': 'success',
            'database_version': db_version[0] if db_version else 'Unknown',
            'table_checks': table_checks,
            'create_test': test_create,
            'message': 'Conexión a base de datos exitosa'
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'error': str(e),
            'traceback': traceback.format_exc(),
            'message': 'Error de conexión a base de datos'
        }, status=500)