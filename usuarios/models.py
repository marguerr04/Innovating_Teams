# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Administrador(models.Model):
    usuario = models.OneToOneField('Usuario', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'administrador'
        db_table_comment = 'Informaci�n espec�fica de administradores'


class Atributo(models.Model):
    valoratributo = models.CharField(max_length=255, blank=True, null=True)
    categoria_atributo = models.ForeignKey('CategoriaAtributo', models.DO_NOTHING)
    equipo_desafio = models.ForeignKey('EquipoDesafio', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'atributo'


class Carrera(models.Model):
    facultad = models.ForeignKey('Facultad', models.DO_NOTHING)
    nombre = models.CharField(max_length=100)
    estado = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'carrera'


class CategoriaAtributo(models.Model):
    nombrecategoria = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'categoria_atributo'


class Configuracion(models.Model):
    nombre = models.CharField(max_length=100)
    tipodato = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'configuracion'


class ConfiguracionValor(models.Model):
    valor = models.CharField(max_length=500)
    configuracion = models.ForeignKey(Configuracion, models.DO_NOTHING)
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'configuracion_valor'


class Curso(models.Model):
    carrera = models.ForeignKey(Carrera, models.DO_NOTHING)
    tipo_curso = models.ForeignKey('TipoCurso', models.DO_NOTHING)
    codigo = models.CharField(max_length=20)
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'curso'


class CursoEstudiante(models.Model):
    curso = models.ForeignKey(Curso, models.DO_NOTHING)
    estudiante = models.ForeignKey('Estudiante', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'curso_estudiante'


class Desafio(models.Model):
    id = models.AutoField(primary_key=True)  
    tema_desafio = models.ForeignKey('TemaDesafio', models.DO_NOTHING)
    fechacreacion = models.DateTimeField()
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    nombrepersona = models.CharField(max_length=100, blank=True, null=True)
    edadpersona = models.SmallIntegerField(blank=True, null=True)
    contexto = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=20, blank=True, null=True)
    persona = models.ForeignKey('Persona', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'desafio'


class Equipo(models.Model):
    nombreequipo = models.CharField(max_length=100)
    tamanoequipo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'equipo'
        db_table_comment = 'Equipos de estudiantes por juego'


class EquipoDesafio(models.Model):
    equipo = models.OneToOneField(Equipo, models.DO_NOTHING, primary_key=True)
    desafio = models.ForeignKey(Desafio, models.DO_NOTHING)
    desafio_persona_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'equipo_desafio'


class Estudiante(models.Model):
    usuario = models.OneToOneField('Usuario', models.DO_NOTHING)
    lista_participante = models.ForeignKey('ListaParticipante', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'estudiante'
        db_table_comment = 'Informaci�n espec�fica de estudiantes'


class Etapa(models.Model):
    nombreetapa = models.CharField(max_length=50)
    duracionminutos = models.IntegerField()
    orden = models.IntegerField()
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    estado = models.CharField(max_length=20, blank=True, null=True)
    textohabilidad = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'etapa'


class EvaluacionAutoencuesta(models.Model):
    estudiante = models.ForeignKey(Estudiante, models.DO_NOTHING)
    ganas_emprender = models.ForeignKey('GanasEmprender', models.DO_NOTHING)
    evalsatisf = models.SmallIntegerField(blank=True, null=True, db_comment='Puntuacion de 1-5, que se mapea con : No, No mucho, M�s o menos, Si, Si, mucho')
    comentarios = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'evaluacion_autoencuesta'


class EvaluacionPitch(models.Model):
    equipo_evaluador = models.ForeignKey(Equipo, models.DO_NOTHING)
    equipo_evaluado = models.ForeignKey(Equipo, models.DO_NOTHING, related_name='evaluacionpitch_equipo_evaluado_set')
    puntajeequipo = models.SmallIntegerField(blank=True, null=True)
    puntajeempatia = models.SmallIntegerField(blank=True, null=True)
    puntajecreatividad = models.SmallIntegerField(blank=True, null=True)
    puntajecomunicacion = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'evaluacion_pitch'
        unique_together = (('equipo_evaluador', 'equipo_evaluado'),)


class Facultad(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'facultad'


class GanasEmprender(models.Model):
    descripcion = models.CharField(max_length=500)

    class Meta:
        managed = False
        db_table = 'ganas_emprender'


class InstruccionEtapa(models.Model):
    etapa = models.ForeignKey(Etapa, models.DO_NOTHING)
    contenido = models.TextField()

    class Meta:
        managed = False
        db_table = 'instruccion_etapa'


class ListaParticipante(models.Model):
    emailestudiante = models.CharField(max_length=100)
    nombreestudiante = models.CharField(max_length=150)

    class Meta:
        managed = False
        db_table = 'lista_participante'


class Partida(models.Model):
    video = models.ForeignKey('Video', models.DO_NOTHING)
    fechacreacion = models.DateTimeField()
    estado = models.CharField(max_length=20)
    codigoacceso = models.CharField(unique=True, max_length=10, blank=True, null=True)
    fechainicio = models.DateTimeField(blank=True, null=True)
    fechafin = models.DateTimeField(blank=True, null=True)
    maxequipos = models.IntegerField(blank=True, null=True)
    maxparticipantes = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partida'
        db_table_comment = 'Sesiones de juego del sistema de emprendimiento'


class PartidaUsuario(models.Model):
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING)
    partida = models.ForeignKey(Partida, models.DO_NOTHING)
    equipo = models.ForeignKey(Equipo, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'partida_usuario'


class Persona(models.Model):
    nombrepersona = models.CharField(max_length=150)
    imagenurl = models.CharField(max_length=500)
    contextopersona = models.TextField()
    edad = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'persona'


class Profesor(models.Model):
    usuario = models.OneToOneField('Usuario', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'profesor'
        db_table_comment = 'Informaci�n espec�fica de profesores'


class Ranking(models.Model):
    equipo = models.OneToOneField(Equipo, models.DO_NOTHING)
    totaltokens = models.IntegerField()
    posicionfinal = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ranking'


class SolucionLego(models.Model):
    equipo = models.ForeignKey(Equipo, models.DO_NOTHING)
    fechacreacion = models.DateTimeField()
    descripsoluc = models.TextField(blank=True, null=True)
    fotoprototipurl = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'solucion_lego'


class TemaDesafio(models.Model):
    nombretema = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500)
    estado = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tema_desafio'


class TipoCurso(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'tipo_curso'


class Token(models.Model):
    equipo = models.ForeignKey(Equipo, models.DO_NOTHING)
    tipotoken = models.CharField(max_length=30)
    cantidad = models.IntegerField()
    etapa = models.ForeignKey(Etapa, models.DO_NOTHING, blank=True, null=True)
    fechaotorgada = models.DateTimeField()

    class Meta:
        managed = False
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
        managed = False
        db_table = 'usuario'
        db_table_comment = 'Tabla base de usuarios del sistema'


class Video(models.Model):
    nombrevideo = models.CharField(max_length=150)
    url = models.CharField(max_length=500)

    class Meta:
        managed = False
        db_table = 'video'



class VistaDetalleEquipo(models.Model):
    # Define aquí los campos que retorna tu vista
    equipo_id = models.IntegerField(primary_key=True)
    nombreequipo = models.CharField(max_length=100)
    nombre_profesor = models.CharField(max_length=50)
    email_profesor = models.CharField(max_length=100)
    nombre_estudiante = models.CharField(max_length=50)
    email_estudiante = models.CharField(max_length=100)
    nombre_carrera = models.CharField(max_length=100)
    # ... y los demás campos que tengas en la vista

    class Meta:
        managed = False  # ¡MUY IMPORTANTE! Le dice a Django que no intente crear o modificar esta "tabla".
        db_table = 'vista_detalle_equipo' # El nombre exacto de tu vista en la BD