# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.utils import timezone

"""
Se borro el managed = False para que Django pueda manejar las tablas
, es una descision para gestionar la base de datos desde django directamente.
"""



class Administrador(models.Model):
    usuario = models.OneToOneField('Usuario', models.CASCADE) # El Cascade esta basado en el diagrama de clases, implica que si se elimina un usuario, se elimina el administrador asociado

    class Meta:
        db_table = 'administrador'
        db_table_comment = 'Información específica de administradores'


class Atributo(models.Model):
    valoratributo = models.CharField(max_length=255, blank=True, null=True)
    categoria_atributo = models.ForeignKey('CategoriaAtributo', models.CASCADE)
    equipo_desafio = models.ForeignKey('EquipoDesafio', models.CASCADE)

    class Meta:
        db_table = 'atributo'




class Carrera(models.Model):
    facultad = models.ForeignKey('Facultad', models.PROTECT)
    nombre = models.CharField(max_length=100)
    estado = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'carrera'


class CategoriaAtributo(models.Model):
    nombrecategoria = models.CharField(max_length=100)

    class Meta:
        db_table = 'categoria_atributo'


class Configuracion(models.Model):
    nombre = models.CharField(max_length=100)
    tipodato = models.CharField(max_length=50)

    class Meta:
        db_table = 'configuracion'


class ConfiguracionValor(models.Model):
    valor = models.CharField(max_length=500)
    configuracion = models.ForeignKey(Configuracion, models.CASCADE)
    usuario = models.ForeignKey('Usuario', models.CASCADE)

    class Meta:
        db_table = 'configuracion_valor'


class Curso(models.Model):
    carrera = models.ForeignKey(Carrera, models.PROTECT)
    tipo_curso = models.ForeignKey('TipoCurso', models.PROTECT)
    codigo = models.CharField(max_length=20)
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'curso'


class CursoEstudiante(models.Model):
    curso = models.ForeignKey(Curso, models.CASCADE)
    estudiante = models.ForeignKey('Estudiante', models.CASCADE)

    class Meta:
        db_table = 'curso_estudiante'


class Desafio(models.Model):
    id = models.AutoField(primary_key=True) # Correción al importar, implica que el modelo de bd tenia un id auto incrementable
    tema_desafio = models.ForeignKey('TemaDesafio', models.PROTECT)
    fechacreacion = models.DateTimeField()
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    nombrepersona = models.CharField(max_length=100, blank=True, null=True)
    edadpersona = models.SmallIntegerField(blank=True, null=True)
    contexto = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=20, blank=True, null=True)
    persona = models.ForeignKey('Persona', models.PROTECT)

    class Meta:
        db_table = 'desafio'



class Equipo(models.Model):
    nombreequipo = models.CharField(max_length=100)
    tamanoequipo = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'equipo'
        db_table_comment = 'Equipos de estudiantes por juego'


class EquipoDesafio(models.Model):
    equipo = models.OneToOneField(Equipo, models.CASCADE, primary_key=True)
    desafio = models.ForeignKey(Desafio, models.CASCADE)
    desafio_persona_id = models.IntegerField()

    class Meta:
        db_table = 'equipo_desafio'


class Estudiante(models.Model):
    usuario = models.OneToOneField('Usuario', models.CASCADE) # El Cascade esta basado en el diagrama de clases, implica que si se elimina un usuario, se elimina el estudiante asociado
    lista_participante = models.ForeignKey('ListaParticipante', models.PROTECT)

    class Meta:
        db_table = 'estudiante'
        db_table_comment = 'Información específica de estudiantes'


class Etapa(models.Model):
    nombreetapa = models.CharField(max_length=50)
    duracionminutos = models.IntegerField()
    orden = models.IntegerField()
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    estado = models.CharField(max_length=20, blank=True, null=True)
    textohabilidad = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'etapa'


class EvaluacionAutoencuesta(models.Model):
    estudiante = models.ForeignKey(Estudiante, models.CASCADE)
    ganas_emprender = models.ForeignKey('GanasEmprender', models.PROTECT)
    evalsatisf = models.SmallIntegerField(blank=True, null=True, db_comment='Puntuacion de 1-5, que se mapea con : No, No mucho, M�s o menos, Si, Si, mucho')
    comentarios = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'evaluacion_autoencuesta'


class EvaluacionPitch(models.Model):
    equipo_evaluador = models.ForeignKey(Equipo, models.CASCADE)
    equipo_evaluado = models.ForeignKey(Equipo, models.CASCADE, related_name='evaluacionpitch_equipo_evaluado_set')
    puntajeequipo = models.SmallIntegerField(blank=True, null=True)
    puntajeempatia = models.SmallIntegerField(blank=True, null=True)
    puntajecreatividad = models.SmallIntegerField(blank=True, null=True)
    puntajecomunicacion = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        db_table = 'evaluacion_pitch'
        unique_together = (('equipo_evaluador', 'equipo_evaluado'),)


class Facultad(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'facultad'


class GanasEmprender(models.Model):
    descripcion = models.CharField(max_length=500)

    class Meta:
        db_table = 'ganas_emprender'


class InstruccionEtapa(models.Model):
    etapa = models.ForeignKey(Etapa, models.CASCADE)
    contenido = models.TextField()

    class Meta:
        db_table = 'instruccion_etapa'


class ListaParticipante(models.Model):
    emailestudiante = models.CharField(max_length=100)
    nombreestudiante = models.CharField(max_length=150)

    class Meta:
        db_table = 'lista_participante'


class Partida(models.Model):
    video = models.ForeignKey('Video', models.PROTECT)
    fechacreacion = models.DateTimeField()
    estado = models.CharField(max_length=20)
    codigoacceso = models.CharField(unique=True, max_length=10, blank=True, null=True)
    fechainicio = models.DateTimeField(blank=True, null=True)
    fechafin = models.DateTimeField(blank=True, null=True)
    maxequipos = models.IntegerField(blank=True, null=True)
    maxparticipantes = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'partida'
        db_table_comment = 'Sesiones de juego del sistema de emprendimiento'


class PartidaUsuario(models.Model):
    usuario = models.ForeignKey('Usuario', models.CASCADE)
    partida = models.ForeignKey(Partida, models.CASCADE)
    equipo = models.ForeignKey(Equipo, models.CASCADE)

    class Meta:
        db_table = 'partida_usuario'


class Persona(models.Model):
    nombrepersona = models.CharField(max_length=150)
    imagenurl = models.CharField(max_length=500)
    contextopersona = models.TextField()
    edad = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        db_table = 'persona'


class Profesor(models.Model):
    usuario = models.OneToOneField('Usuario', models.CASCADE) # El Cascade esta basado en el diagrama de clases, implica que si se elimina un usuario, se elimina el profesor asociado

    class Meta:
        db_table = 'profesor'
        db_table_comment = 'Información específica de profesores'


class Ranking(models.Model):
    equipo = models.OneToOneField(Equipo, models.CASCADE)
    totaltokens = models.IntegerField()
    posicionfinal = models.IntegerField()

    class Meta:
        db_table = 'ranking'


class SolucionLego(models.Model):
    equipo = models.ForeignKey(Equipo, models.CASCADE)
    fechacreacion = models.DateTimeField()
    descripsoluc = models.TextField(blank=True, null=True)
    fotoprototipurl = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'solucion_lego'


class TemaDesafio(models.Model):
    nombretema = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500)
    estado = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'tema_desafio'


class TipoCurso(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'tipo_curso'


class Token(models.Model):
    equipo = models.ForeignKey(Equipo, models.CASCADE)
    tipotoken = models.CharField(max_length=30)
    cantidad = models.IntegerField()
    etapa = models.ForeignKey(Etapa, models.SET_NULL, blank=True, null=True)
    fechaotorgada = models.DateTimeField()

    class Meta:
        db_table = 'token'
        db_table_comment = 'Sistema de tokens y recompensas'


class Usuario(models.Model):
    email = models.CharField(unique=True, max_length=100)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    tipousuario = models.CharField(max_length=20)
    fechacreacion = models.DateTimeField()
    ultimologin = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=20, blank=True, null=True)
    contrasena = models.CharField(max_length=255, blank=True, null=True)

    class Meta:

        db_table = 'usuario'
        db_table_comment = 'Tabla base de usuarios del sistema'


class Video(models.Model):
    nombrevideo = models.CharField(max_length=150)
    url = models.CharField(max_length=500)

    class Meta:
        db_table = 'video'









from usuarios.models import Usuario 
from .models import Equipo, Etapa

class ProgresoEtapa(models.Model):
    """
    Trackeo estado equipo y cumplpoir RT02
    """
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)
    etapa = models.ForeignKey(Etapa, on_delete=models.CASCADE)
    
    # Campos pedidos por RT-02 (Estado actual)
    start_at = models.DateTimeField(default=timezone.now)
    end_at = models.DateTimeField(null=True, blank=True)
    
    # --- CORRECCIÓN CLAVE ---
    # Distingue evento de sistema vs. usuario (como pide el feedback)
    
    finished_by_system = models.BooleanField(default=False) # True si el timer lo terminó
    
    # 'finished_by_user' ahora apunta a tu tabla genérica 'Usuario'.
    # Esto te permite registrar si fue un estudiante O un profesor quien
    # marcó la etapa como finalizada.
    finished_by_user = models.ForeignKey(
        Usuario, 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL
    )

    class Meta:
        unique_together = ('equipo', 'etapa') # Un equipo solo pasa una vez por etapa