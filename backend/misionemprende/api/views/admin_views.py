# backend/misionemprende/api/views/admin_views.py
"""
Vistas específicas para el módulo de administración del sistema.
Maneja CRUD de temas de desafío, desafíos y datos auxiliares.
"""

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from rest_framework.parsers import JSONParser


@csrf_exempt
def admin_temas_list(request):
    """
    GET: Listar todos los temas de desafío activos
    POST: Crear nuevo tema de desafío
    
    GET Response:
        {
            "success": true,
            "data": [
                {
                    "id": 11,
                    "nombretema": "Sostenibilidad Ambiental", 
                    "descripcion": "Crear soluciones para reducir el impacto ecológico",
                    "estado": "ACTIVO",
                    "total_desafios": 7
                }
            ]
        }
    
    POST Request:
        {
            "nombretema": "Nuevo Tema",
            "descripcion": "Descripción del nuevo tema"
        }
    """
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        id, 
                        nombretema, 
                        descripcion, 
                        estado,
                        (SELECT COUNT(*) FROM desafio WHERE tema_desafio_id = tema_desafio.id AND estado = 'ACTIVO') as total_desafios
                    FROM tema_desafio 
                    WHERE estado = 'ACTIVO'
                    ORDER BY nombretema ASC
                """)
                
                temas = []
                for row in cursor.fetchall():
                    temas.append({
                        'id': row[0],
                        'nombretema': row[1],
                        'descripcion': row[2],
                        'estado': row[3],
                        'total_desafios': row[4]
                    })
                
                return JsonResponse({
                    'success': True,
                    'data': temas
                }, status=200)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    elif request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            nombretema = data.get('nombretema', '').strip()
            descripcion = data.get('descripcion', '').strip()
            
            if not nombretema or not descripcion:
                return JsonResponse({
                    'success': False,
                    'error': 'Nombre del tema y descripción son requeridos'
                }, status=400)
            
            with connection.cursor() as cursor:
                # Verificar si ya existe un tema con ese nombre
                cursor.execute("""
                    SELECT id FROM tema_desafio 
                    WHERE LOWER(nombretema) = LOWER(%s) AND estado = 'ACTIVO'
                """, [nombretema])
                
                if cursor.fetchone():
                    return JsonResponse({
                        'success': False,
                        'error': 'Ya existe un tema con ese nombre'
                    }, status=400)
                
                # Crear nuevo tema
                cursor.execute("""
                    INSERT INTO tema_desafio (nombretema, descripcion, estado)
                    VALUES (%s, %s, 'ACTIVO')
                    RETURNING id, nombretema, descripcion, estado
                """, [nombretema, descripcion])
                
                result = cursor.fetchone()
                
                return JsonResponse({
                    'success': True,
                    'data': {
                        'id': result[0],
                        'nombretema': result[1],
                        'descripcion': result[2],
                        'estado': result[3],
                        'total_desafios': 0
                    },
                    'message': 'Tema creado exitosamente'
                }, status=201)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
def admin_tema_detail(request, tema_id):
    """
    GET: Obtener tema específico por ID
    PUT: Actualizar tema existente
    DELETE: Desactivar tema (soft delete)
    
    GET Response:
        {
            "success": true,
            "data": {
                "id": 11,
                "nombretema": "Sostenibilidad Ambiental",
                "descripcion": "Crear soluciones para reducir el impacto ecológico",
                "estado": "ACTIVO",
                "total_desafios": 7
            }
        }
    """
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        id, 
                        nombretema, 
                        descripcion, 
                        estado,
                        (SELECT COUNT(*) FROM desafio WHERE tema_desafio_id = %s AND estado = 'ACTIVO') as total_desafios
                    FROM tema_desafio 
                    WHERE id = %s
                """, [tema_id, tema_id])
                
                result = cursor.fetchone()
                if not result:
                    return JsonResponse({
                        'success': False,
                        'error': 'Tema no encontrado'
                    }, status=404)
                
                return JsonResponse({
                    'success': True,
                    'data': {
                        'id': result[0],
                        'nombretema': result[1],
                        'descripcion': result[2],
                        'estado': result[3],
                        'total_desafios': result[4]
                    }
                }, status=200)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    elif request.method == 'PUT':
        try:
            data = JSONParser().parse(request)
            nombretema = data.get('nombretema', '').strip()
            descripcion = data.get('descripcion', '').strip()
            
            if not nombretema or not descripcion:
                return JsonResponse({
                    'success': False,
                    'error': 'Nombre del tema y descripción son requeridos'
                }, status=400)
            
            with connection.cursor() as cursor:
                # Verificar si existe otro tema con el mismo nombre
                cursor.execute("""
                    SELECT id FROM tema_desafio 
                    WHERE LOWER(nombretema) = LOWER(%s) AND estado = 'ACTIVO' AND id != %s
                """, [nombretema, tema_id])
                
                if cursor.fetchone():
                    return JsonResponse({
                        'success': False,
                        'error': 'Ya existe otro tema con ese nombre'
                    }, status=400)
                
                # Actualizar tema
                cursor.execute("""
                    UPDATE tema_desafio 
                    SET nombretema = %s, descripcion = %s
                    WHERE id = %s AND estado = 'ACTIVO'
                    RETURNING id, nombretema, descripcion, estado
                """, [nombretema, descripcion, tema_id])
                
                result = cursor.fetchone()
                if not result:
                    return JsonResponse({
                        'success': False,
                        'error': 'Tema no encontrado o no se puede actualizar'
                    }, status=404)
                
                return JsonResponse({
                    'success': True,
                    'data': {
                        'id': result[0],
                        'nombretema': result[1],
                        'descripcion': result[2],
                        'estado': result[3]
                    },
                    'message': 'Tema actualizado exitosamente'
                }, status=200)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    elif request.method == 'DELETE':
        try:
            with connection.cursor() as cursor:
                # Verificar si hay desafíos asociados activos
                cursor.execute("""
                    SELECT COUNT(*) FROM desafio WHERE tema_desafio_id = %s AND estado = 'ACTIVO'
                """, [tema_id])
                
                count = cursor.fetchone()[0]
                if count > 0:
                    return JsonResponse({
                        'success': False,
                        'error': f'No se puede eliminar. Hay {count} desafío(s) activo(s) asociado(s) a este tema'
                    }, status=400)
                
                # Soft delete del tema
                cursor.execute("""
                    UPDATE tema_desafio 
                    SET estado = 'INACTIVO'
                    WHERE id = %s AND estado = 'ACTIVO'
                    RETURNING id
                """, [tema_id])
                
                result = cursor.fetchone()
                if not result:
                    return JsonResponse({
                        'success': False,
                        'error': 'Tema no encontrado'
                    }, status=404)
                
                return JsonResponse({
                    'success': True,
                    'message': 'Tema eliminado exitosamente'
                }, status=200)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
def admin_desafios_list(request):
    """
    GET: Listar todos los desafíos con paginación y filtros
    POST: Crear nuevo desafío
    
    GET Parameters:
        - page: número de página (default: 1)
        - limit: registros por página (default: 10)  
        - search: búsqueda en título y descripción
        - tema_id: filtrar por tema específico
    
    GET Response:
        {
            "success": true,
            "data": {
                "desafios": [...],
                "pagination": {
                    "page": 1,
                    "limit": 10,
                    "total": 20,
                    "pages": 2
                }
            }
        }
    """
    if request.method == 'GET':
        try:
            # Parámetros de paginación y filtros
            page = int(request.GET.get('page', 1))
            limit = int(request.GET.get('limit', 10))
            search = request.GET.get('search', '').strip()
            tema_id = request.GET.get('tema_id', '')
            
            offset = (page - 1) * limit
            
            # Construir condiciones WHERE dinámicamente
            where_conditions = ["d.estado = 'ACTIVO'"]
            params = []
            
            if search:
                where_conditions.append("(d.titulo ILIKE %s OR d.descripcion ILIKE %s)")
                params.extend([f'%{search}%', f'%{search}%'])
            
            if tema_id:
                where_conditions.append("d.tema_desafio_id = %s")
                params.append(int(tema_id))
            
            where_clause = " AND ".join(where_conditions)
            
            with connection.cursor() as cursor:
                # Contar total de registros
                count_query = f"""
                    SELECT COUNT(*) 
                    FROM desafio d
                    WHERE {where_clause}
                """
                cursor.execute(count_query, params)
                total = cursor.fetchone()[0]
                
                # Obtener registros paginados con relaciones
                query = f"""
                    SELECT 
                        d.id,
                        d.titulo,
                        d.descripcion,
                        d.nombrepersona,
                        d.edadpersona,
                        d.contexto,
                        d.estado,
                        d.fechacreacion,
                        d.tema_desafio_id,
                        td.nombretema as tema_nombre,
                        d.persona_id,
                        p.nombrepersona as persona_nombre
                    FROM desafio d
                    LEFT JOIN tema_desafio td ON d.tema_desafio_id = td.id
                    LEFT JOIN persona p ON d.persona_id = p.id
                    WHERE {where_clause}
                    ORDER BY d.fechacreacion DESC
                    LIMIT %s OFFSET %s
                """
                
                cursor.execute(query, params + [limit, offset])
                
                desafios = []
                for row in cursor.fetchall():
                    desafios.append({
                        'id': row[0],
                        'titulo': row[1],
                        'descripcion': row[2],
                        'nombrepersona': row[3],
                        'edadpersona': row[4],
                        'contexto': row[5],
                        'estado': row[6],
                        'fechacreacion': row[7].isoformat() if row[7] else None,
                        'tema_desafio_id': row[8],
                        'tema_nombre': row[9],
                        'persona_id': row[10],
                        'persona_nombre': row[11]
                    })
                
                return JsonResponse({
                    'success': True,
                    'data': {
                        'desafios': desafios,
                        'pagination': {
                            'page': page,
                            'limit': limit,
                            'total': total,
                            'pages': (total + limit - 1) // limit
                        }
                    }
                }, status=200)
                
        except ValueError as e:
            return JsonResponse({
                'success': False,
                'error': 'Parámetros de paginación inválidos'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    elif request.method == 'POST':
        try:
            data = JSONParser().parse(request)
            
            # Validar campos requeridos
            titulo = data.get('titulo', '').strip()
            descripcion = data.get('descripcion', '').strip()
            tema_desafio_id = data.get('tema_desafio_id')
            persona_id = data.get('persona_id')
            
            # Campos opcionales
            nombrepersona = data.get('nombrepersona', '').strip()
            edadpersona = data.get('edadpersona')
            contexto = data.get('contexto', '').strip()
            
            if not titulo or not descripcion or not tema_desafio_id or not persona_id:
                return JsonResponse({
                    'success': False,
                    'error': 'Título, descripción, tema y persona son requeridos'
                }, status=400)
            
            with connection.cursor() as cursor:
                # Verificar que el tema existe y está activo
                cursor.execute("""
                    SELECT id FROM tema_desafio WHERE id = %s AND estado = 'ACTIVO'
                """, [tema_desafio_id])
                
                if not cursor.fetchone():
                    return JsonResponse({
                        'success': False,
                        'error': 'Tema de desafío no válido o inactivo'
                    }, status=400)
                
                # Verificar que la persona existe
                cursor.execute("""
                    SELECT id, nombrepersona FROM persona WHERE id = %s
                """, [persona_id])
                
                persona_result = cursor.fetchone()
                if not persona_result:
                    return JsonResponse({
                        'success': False,
                        'error': 'Persona/arquetipo no válido'
                    }, status=400)
                
                # Crear nuevo desafío
                cursor.execute("""
                    INSERT INTO desafio (
                        titulo, descripcion, tema_desafio_id, persona_id,
                        nombrepersona, edadpersona, contexto, estado, fechacreacion
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, 'ACTIVO', CURRENT_TIMESTAMP)
                    RETURNING id, titulo, descripcion, nombrepersona, edadpersona, contexto, fechacreacion
                """, [titulo, descripcion, tema_desafio_id, persona_id, nombrepersona, edadpersona, contexto])
                
                result = cursor.fetchone()
                
                return JsonResponse({
                    'success': True,
                    'data': {
                        'id': result[0],
                        'titulo': result[1],
                        'descripcion': result[2],
                        'nombrepersona': result[3],
                        'edadpersona': result[4],
                        'contexto': result[5],
                        'fechacreacion': result[6].isoformat() if result[6] else None,
                        'tema_desafio_id': tema_desafio_id,
                        'persona_id': persona_id
                    },
                    'message': 'Desafío creado exitosamente'
                }, status=201)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
def admin_desafio_detail(request, desafio_id):
    """
    GET: Obtener desafío específico por ID
    PUT: Actualizar desafío existente  
    DELETE: Desactivar desafío (soft delete)
    """
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        d.id,
                        d.titulo,
                        d.descripcion,
                        d.nombrepersona,
                        d.edadpersona,
                        d.contexto,
                        d.estado,
                        d.fechacreacion,
                        d.tema_desafio_id,
                        td.nombretema as tema_nombre,
                        d.persona_id,
                        p.nombrepersona as persona_nombre
                    FROM desafio d
                    LEFT JOIN tema_desafio td ON d.tema_desafio_id = td.id
                    LEFT JOIN persona p ON d.persona_id = p.id
                    WHERE d.id = %s
                """, [desafio_id])
                
                result = cursor.fetchone()
                if not result:
                    return JsonResponse({
                        'success': False,
                        'error': 'Desafío no encontrado'
                    }, status=404)
                
                return JsonResponse({
                    'success': True,
                    'data': {
                        'id': result[0],
                        'titulo': result[1],
                        'descripcion': result[2],
                        'nombrepersona': result[3],
                        'edadpersona': result[4],
                        'contexto': result[5],
                        'estado': result[6],
                        'fechacreacion': result[7].isoformat() if result[7] else None,
                        'tema_desafio_id': result[8],
                        'tema_nombre': result[9],
                        'persona_id': result[10],
                        'persona_nombre': result[11]
                    }
                }, status=200)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    elif request.method == 'PUT':
        try:
            data = JSONParser().parse(request)
            
            # Validar campos requeridos
            titulo = data.get('titulo', '').strip()
            descripcion = data.get('descripcion', '').strip()
            tema_desafio_id = data.get('tema_desafio_id')
            persona_id = data.get('persona_id')
            
            # Campos opcionales
            nombrepersona = data.get('nombrepersona', '').strip()
            edadpersona = data.get('edadpersona')
            contexto = data.get('contexto', '').strip()
            
            if not titulo or not descripcion or not tema_desafio_id or not persona_id:
                return JsonResponse({
                    'success': False,
                    'error': 'Título, descripción, tema y persona son requeridos'
                }, status=400)
            
            with connection.cursor() as cursor:
                # Verificar que el tema existe y está activo
                cursor.execute("""
                    SELECT id FROM tema_desafio WHERE id = %s AND estado = 'ACTIVO'
                """, [tema_desafio_id])
                
                if not cursor.fetchone():
                    return JsonResponse({
                        'success': False,
                        'error': 'Tema de desafío no válido o inactivo'
                    }, status=400)
                
                # Verificar que la persona existe
                cursor.execute("""
                    SELECT id FROM persona WHERE id = %s
                """, [persona_id])
                
                if not cursor.fetchone():
                    return JsonResponse({
                        'success': False,
                        'error': 'Persona/arquetipo no válido'
                    }, status=400)
                
                # Actualizar desafío
                cursor.execute("""
                    UPDATE desafio 
                    SET titulo = %s, descripcion = %s, tema_desafio_id = %s, persona_id = %s,
                        nombrepersona = %s, edadpersona = %s, contexto = %s
                    WHERE id = %s AND estado = 'ACTIVO'
                    RETURNING id, titulo, descripcion, nombrepersona, edadpersona, contexto, fechacreacion
                """, [titulo, descripcion, tema_desafio_id, persona_id, nombrepersona, edadpersona, contexto, desafio_id])
                
                result = cursor.fetchone()
                if not result:
                    return JsonResponse({
                        'success': False,
                        'error': 'Desafío no encontrado o no se puede actualizar'
                    }, status=404)
                
                return JsonResponse({
                    'success': True,
                    'data': {
                        'id': result[0],
                        'titulo': result[1],
                        'descripcion': result[2],
                        'nombrepersona': result[3],
                        'edadpersona': result[4],
                        'contexto': result[5],
                        'fechacreacion': result[6].isoformat() if result[6] else None,
                        'tema_desafio_id': tema_desafio_id,
                        'persona_id': persona_id
                    },
                    'message': 'Desafío actualizado exitosamente'
                }, status=200)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    elif request.method == 'DELETE':
        try:
            with connection.cursor() as cursor:
                # Soft delete del desafío
                cursor.execute("""
                    UPDATE desafio 
                    SET estado = 'INACTIVO'
                    WHERE id = %s AND estado = 'ACTIVO'
                    RETURNING id
                """, [desafio_id])
                
                result = cursor.fetchone()
                if not result:
                    return JsonResponse({
                        'success': False,
                        'error': 'Desafío no encontrado'
                    }, status=404)
                
                return JsonResponse({
                    'success': True,
                    'message': 'Desafío eliminado exitosamente'
                }, status=200)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
def admin_get_personas(request):
    """
    GET: Obtener lista de personas/arquetipos disponibles para dropdowns
    
    Response:
        {
            "success": true,
            "data": [
                {
                    "id": 11,
                    "nombre": "Arquetipo 1",
                    "imagenurl": "https://example.com/imagen1.jpg",
                    "contexto": "Este es el contexto de la persona...",
                    "edad": 67
                }
            ]
        }
    """
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, nombrepersona, imagenurl, contextopersona, edad
                    FROM public.persona 
                    ORDER BY nombrepersona ASC
                """)
                
                personas = []
                for row in cursor.fetchall():
                    personas.append({
                        'id': row[0],
                        'nombre': row[1],
                        'imagenurl': row[2] if row[2] else '',
                        'contexto': row[3] if row[3] else '',
                        'edad': row[4] if row[4] else 0
                    })
                
                return JsonResponse({
                    'success': True,
                    'data': personas
                }, status=200)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    elif request.method == 'POST':
        try:
            data = JSONParser().parse(request)

            nombre = data.get('nombre', '').strip()
            imagenurl = data.get('imagenurl', '').strip()
            contexto = data.get('contexto', '').strip()
            edad = data.get('edad')

            if not nombre:
                return JsonResponse({
                    'success': False,
                    'error': 'El nombre de la persona es obligatorio'
                }, status=400)

            edad_valor = None
            if edad not in (None, ''):
                try:
                    edad_valor = int(edad)
                except (TypeError, ValueError):
                    return JsonResponse({
                        'success': False,
                        'error': 'La edad debe ser un número válido'
                    }, status=400)

            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO persona (nombrepersona, imagenurl, contextopersona, edad)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, nombrepersona, imagenurl, contextopersona, edad
                """, [nombre, imagenurl, contexto, edad_valor])

                result = cursor.fetchone()

            return JsonResponse({
                'success': True,
                'data': {
                    'id': result[0],
                    'nombre': result[1],
                    'imagenurl': result[2] or '',
                    'contexto': result[3] or '',
                    'edad': result[4]
                }
            }, status=201)

        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)