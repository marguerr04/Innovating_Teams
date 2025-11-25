# api/services/group_assignment_service.py
"""
Servicio para asignación de grupos desde CSV.
Contiene la lógica de procesamiento de archivos CSV y creación de equipos/estudiantes.
"""

from django.db import transaction
from django.utils import timezone
import csv
import io
import random
import math

from ..models import Usuario, Estudiante, Equipo, Partida, ListaParticipante, PartidaUsuario
from ..repositories import PartidaRepository, EquipoRepository, EstudianteRepository


def assign_groups_logic(archivo, cantidad_grupos, tiene_encabezado, modo):
    """
    Procesa un archivo CSV y crea grupos de estudiantes.
    
    Args:
        archivo: Archivo CSV con datos de estudiantes
        cantidad_grupos: Número de grupos a crear
        tiene_encabezado: Si el CSV tiene fila de encabezado
        modo: 'aleatoria' para mezclar estudiantes o secuencial
        
    Returns:
        dict: Resultado con id_partida y grupos creados
        
    Raises:
        ValueError: Si el archivo está vacío o mal formado
    """
    # === 2️⃣ Lectura del CSV ===
    data = archivo.read().decode('utf-8')
    reader = csv.reader(io.StringIO(data), delimiter=';')
    if tiene_encabezado:
        next(reader, None)

    filas = [row for row in reader if row]
    if not filas:
        raise ValueError('El archivo CSV está vacío')

    # === 3️⃣ Procesamiento del CSV ===
    estudiantes = []
    for row in filas:
        try:
            correo = row[0].strip()
            rut = row[1].strip()
            nombre = row[2].strip()
            apellido_paterno = row[3].strip()
            apellido_materno = row[4].strip()
            estudiantes.append({
                'correo': correo,
                'rut': rut,
                'nombre': nombre,
                'apellido_paterno': apellido_paterno,
                'apellido_materno': apellido_materno
            })
        except Exception as e:
            print(f"Fila inválida: {row} -> {e}")
            continue

    if modo == 'aleatoria':
        random.shuffle(estudiantes)

    # === 4️⃣ Transacción atómica ===
    with transaction.atomic():
        # Crear la partida (juego)
        partida = Partida.objects.create(
            video_id=12,
            fechacreacion=timezone.now(),
            estado='EN_CURSO'
        )

        # Crear equipos
        grupos = []
        tamano_grupo = max(1, math.ceil(len(estudiantes) / cantidad_grupos))
        for i in range(cantidad_grupos):
            equipo = Equipo.objects.create(nombreequipo=f"Equipo {i+1}")
            grupos.append({'nombre_equipo': equipo.nombreequipo, 'estudiantes': []})

        grupo_idx = 0

        for est in estudiantes:
            nombre_completo = f"{est['nombre']} {est['apellido_paterno']} {est['apellido_materno']}".strip()
            primer_nombre = est['nombre']
            apellido_final = f"{est['apellido_paterno']} {est['apellido_materno']}"

            #  Crear o recuperar usuario usando repository
            usuario, creado_usuario = EstudianteRepository.get_or_create_usuario(
                email=est['correo'],
                defaults={
                    'nombre': primer_nombre,
                    'apellido': apellido_final,
                    'tipousuario': 'ESTUDIANTE',
                    'fechacreacion': timezone.now(),
                    'estado': 'ACTIVO',
                }
            )

            #  Crear o recuperar lista participante usando repository
            lista_participante, _ = EstudianteRepository.get_or_create_lista_participante(
                email=usuario.email,
                nombre=usuario.nombre
            )

            #  Verificar si el estudiante ya existe
            estudiante_existente = Estudiante.objects.filter(usuario=usuario).first()

            if estudiante_existente:
                # Si ya existe, actualiza la lista participante si es distinta
                if estudiante_existente.lista_participante_id != lista_participante.id:
                    estudiante_existente.lista_participante = lista_participante
                    estudiante_existente.save()
            else:
                # Si no existe, créalo usando repository
                EstudianteRepository.get_or_create_estudiante(
                    usuario=usuario,
                    lista_participante=lista_participante
                )

            #  Asignar equipo (sin buscar por nombre)
            equipo_obj = Equipo.objects.filter(nombreequipo=grupos[grupo_idx]['nombre_equipo']).last()

            #  Evitar duplicados en PartidaUsuario
            if not PartidaUsuario.objects.filter(usuario=usuario, partida=partida).exists():
                PartidaUsuario.objects.create(
                    usuario=usuario,
                    partida=partida,
                    equipo=equipo_obj
                )

            # Añadir al grupo actual para mostrar en respuesta
            grupos[grupo_idx]['estudiantes'].append({
                'nombre': nombre_completo,
                'correo': est['correo']
            })

            grupo_idx = (grupo_idx + 1) % cantidad_grupos

    # === 9️⃣ Respuesta exitosa ===
    return {
        'mensaje': ' Grupos y estudiantes creados exitosamente',
        'id_partida': partida.id,
        'grupos': grupos
    }
