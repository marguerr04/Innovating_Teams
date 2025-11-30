"""
Script de prueba para validar la funcionalidad de códigos de equipo.
Este script prueba el flujo completo:
1. Profesor crea partida → genera código de 6 dígitos
2. Profesor asigna grupos → genera códigos de 7 dígitos (partida + equipo)
3. Estudiante valida código de equipo → recibe información de partida y equipo

Ejecutar desde: backend/misionemprende/
Uso: python test_codigo_equipo.py
"""

import os
import sys
import django
import json

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'misionemprende.settings')
django.setup()

from django.test import RequestFactory
from api.views.auth_views import validar_codigo_equipo
from api.models import Partida, Equipo, Usuario, Estudiante, PartidaUsuario


def print_section(title):
    """Imprime una sección con formato"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def test_1_verificar_modelo():
    """Verificar que el modelo Equipo tenga el campo codigo_equipo"""
    print_section("TEST 1: Verificar Modelo Equipo")
    
    try:
        # Verificar que el campo existe
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT column_name, data_type, character_maximum_length, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'equipo' AND column_name = 'codigo_equipo'
            """)
            result = cursor.fetchone()
            
            if result:
                print(f"✓ Campo 'codigo_equipo' existe en tabla 'equipo'")
                print(f"  - Tipo: {result[1]}")
                print(f"  - Longitud máxima: {result[2]}")
                print(f"  - Nullable: {result[3]}")
                return True
            else:
                print("✗ Campo 'codigo_equipo' NO existe en tabla 'equipo'")
                return False
                
    except Exception as e:
        print(f"✗ Error al verificar modelo: {str(e)}")
        return False


def test_2_crear_partida_y_equipos():
    """Simular creación de partida y equipos con códigos"""
    print_section("TEST 2: Crear Partida y Equipos con Códigos")
    
    try:
        # 1. Crear usuario profesor de prueba
        profesor_user, _ = Usuario.objects.get_or_create(
            email='profesor.test@example.com',
            defaults={
                'nombre': 'Profesor',
                'apellido': 'Test',
                'tipousuario': 'PROFESOR'
            }
        )
        
        # 2. Crear partida de prueba
        from api.services.partida_service import crear_partida_logic
        
        partida_data = crear_partida_logic(
            estado='CONFIGURACION',
            max_equipos=4,
            max_participantes=20
        )
        
        print(f"✓ Partida creada:")
        print(f"  - ID: {partida_data['id']}")
        print(f"  - Código: {partida_data['codigoAcceso']}")
        
        codigo_partida = partida_data['codigoAcceso']
        partida_id = partida_data['id']
        
        # 3. Crear equipos manualmente para simular asignación
        equipos_creados = []
        partida = Partida.objects.get(id=partida_id)
        
        for idx in range(1, 5):  # Crear 4 equipos
            # Crear equipo
            equipo = Equipo.objects.create(
                nombreequipo=f'Equipo Test {idx}',
                tamanoequipo=5
            )
            
            # Generar código equipo: {codigo_partida}{idx}
            codigo_equipo = f"{codigo_partida}{idx}"
            equipo.codigo_equipo = codigo_equipo
            equipo.save(update_fields=['codigo_equipo'])
            
            # Asociar equipo a partida mediante PartidaUsuario
            # Usar el usuario profesor como participante para simplificar
            PartidaUsuario.objects.create(
                usuario=profesor_user,
                partida=partida,
                equipo=equipo
            )
            
            equipos_creados.append({
                'equipo_id': equipo.id,
                'nombre': equipo.nombreequipo,
                'codigo_equipo': codigo_equipo
            })
            
            print(f"✓ Equipo {idx} creado:")
            print(f"  - ID: {equipo.id}")
            print(f"  - Nombre: {equipo.nombreequipo}")
            print(f"  - Código: {codigo_equipo}")
        
        return {
            'partida_id': partida_id,
            'codigo_partida': codigo_partida,
            'equipos': equipos_creados
        }
        
    except Exception as e:
        print(f"✗ Error al crear partida y equipos: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


def test_3_validar_codigo_equipo(codigo_equipo):
    """Probar el endpoint de validación de código equipo"""
    print_section(f"TEST 3: Validar Código de Equipo '{codigo_equipo}'")
    
    try:
        factory = RequestFactory()
        request = factory.post(
            '/api/validar-equipo/',
            data=json.dumps({'codigo': codigo_equipo}),
            content_type='application/json'
        )
        
        response = validar_codigo_equipo(request)
        response.render()  # Renderizar antes de acceder al contenido
        
        if response.status_code == 200:
            data = json.loads(response.content)
            print(f"✓ Validación exitosa:")
            print(f"  - Válido: {data.get('valido')}")
            print(f"  - Partida ID: {data.get('partida_id')}")
            print(f"  - Código Partida: {data.get('partida_codigo')}")
            print(f"  - Equipo ID: {data.get('equipo_id')}")
            print(f"  - Equipo Nombre: {data.get('equipo_nombre')}")
            print(f"  - Equipo Número: {data.get('equipo_numero')}")
            print(f"  - Mensaje: {data.get('mensaje')}")
            return True
        else:
            data = json.loads(response.content)
            print(f"✗ Error en validación (Status {response.status_code}):")
            print(f"  - Error: {data.get('error')}")
            return False
            
    except Exception as e:
        print(f"✗ Error al validar código: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_4_validar_codigo_invalido():
    """Probar validación con código inválido"""
    print_section("TEST 4: Validar Código Inválido")
    
    codigos_invalidos = [
        ('', 'Código vacío'),
        ('123', 'Código muy corto'),
        ('12345678', 'Código muy largo'),
        ('abcdefg', 'Código no numérico'),
        ('9999999', 'Código que no existe')
    ]
    
    factory = RequestFactory()
    resultados = []
    
    for codigo, descripcion in codigos_invalidos:
        try:
            request = factory.post(
                '/api/validar-equipo/',
                data=json.dumps({'codigo': codigo}),
                content_type='application/json'
            )
            
            response = validar_codigo_equipo(request)
            response.render()  # Renderizar antes de acceder al contenido
            
            if response.status_code in [400, 404]:
                data = json.loads(response.content)
                print(f"✓ {descripcion}: Rechazado correctamente")
                print(f"  - Status: {response.status_code}")
                print(f"  - Error: {data.get('error')}")
                resultados.append(True)
            else:
                print(f"✗ {descripcion}: Debería haber sido rechazado")
                resultados.append(False)
                
        except Exception as e:
            print(f"✗ Error con {descripcion}: {str(e)}")
            resultados.append(False)
    
    return all(resultados)


def test_5_verificar_unicidad():
    """Verificar que los códigos de equipo sean únicos"""
    print_section("TEST 5: Verificar Unicidad de Códigos")
    
    try:
        # Contar equipos con códigos duplicados
        from django.db.models import Count
        
        duplicados = (
            Equipo.objects
            .values('codigo_equipo')
            .annotate(count=Count('id'))
            .filter(count__gt=1, codigo_equipo__isnull=False)
        )
        
        if duplicados.exists():
            print(f"✗ Se encontraron {duplicados.count()} códigos duplicados:")
            for dup in duplicados:
                print(f"  - Código: {dup['codigo_equipo']}, Aparece: {dup['count']} veces")
            return False
        else:
            total = Equipo.objects.filter(codigo_equipo__isnull=False).count()
            print(f"✓ Todos los códigos son únicos")
            print(f"  - Total de equipos con código: {total}")
            return True
            
    except Exception as e:
        print(f"✗ Error al verificar unicidad: {str(e)}")
        return False


def limpiar_datos_prueba():
    """Limpiar datos de prueba creados"""
    print_section("LIMPIEZA: Eliminando datos de prueba")
    
    try:
        # Eliminar PartidaUsuario de usuarios de prueba
        usuarios_test = Usuario.objects.filter(email__contains='@example.com')
        PartidaUsuario.objects.filter(usuario__in=usuarios_test).delete()
        print("✓ PartidaUsuario de prueba eliminados")
        
        # Eliminar equipos de prueba (con nombre Test)
        equipos_test = Equipo.objects.filter(nombreequipo__icontains='Test')
        count_equipos = equipos_test.count()
        equipos_test.delete()
        print(f"✓ {count_equipos} equipos de prueba eliminados")
        
        # Eliminar usuarios de prueba
        count_usuarios = usuarios_test.count()
        usuarios_test.delete()
        print(f"✓ {count_usuarios} usuarios de prueba eliminados")
        
        # Eliminar partidas de prueba (sin usuarios)
        partidas_huerfanas = Partida.objects.filter(partidausuario__isnull=True)
        count_partidas = partidas_huerfanas.count()
        partidas_huerfanas.delete()
        print(f"✓ {count_partidas} partidas huérfanas eliminadas")
        
    except Exception as e:
        print(f"⚠ Error durante limpieza: {str(e)}")


def main():
    """Ejecutar todos los tests"""
    print("\n" + "🔥" * 35)
    print("  PRUEBAS DE FUNCIONALIDAD: CÓDIGOS DE EQUIPO")
    print("🔥" * 35)
    
    tests_results = []
    datos_prueba = None
    
    # Test 1: Verificar modelo
    tests_results.append(("Verificar Modelo", test_1_verificar_modelo()))
    
    # Test 2: Crear partida y equipos
    datos_prueba = test_2_crear_partida_y_equipos()
    tests_results.append(("Crear Partida y Equipos", datos_prueba is not None))
    
    if datos_prueba:
        # Test 3: Validar código válido
        primer_equipo = datos_prueba['equipos'][0]
        tests_results.append((
            "Validar Código Válido",
            test_3_validar_codigo_equipo(primer_equipo['codigo_equipo'])
        ))
        
        # Test 4: Validar códigos inválidos
        tests_results.append(("Validar Códigos Inválidos", test_4_validar_codigo_invalido()))
        
        # Test 5: Verificar unicidad
        tests_results.append(("Verificar Unicidad", test_5_verificar_unicidad()))
    
    # Resumen
    print_section("RESUMEN DE PRUEBAS")
    
    all_passed = True
    for test_name, passed in tests_results:
        status = "✓ PASÓ" if passed else "✗ FALLÓ"
        print(f"  {test_name}: {status}")
        if not passed:
            all_passed = False
    
    # Limpieza
    if datos_prueba:
        limpiar_datos_prueba()
    
    # Resultado final
    print("\n" + "=" * 70)
    if all_passed:
        print("  🎉 ¡TODAS LAS PRUEBAS PASARON!")
        print("  El sistema de códigos de equipo está funcionando correctamente.")
    else:
        print("  ❌ ALGUNAS PRUEBAS FALLARON")
        print("  Revisa los errores arriba para más detalles.")
    print("=" * 70 + "\n")
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
