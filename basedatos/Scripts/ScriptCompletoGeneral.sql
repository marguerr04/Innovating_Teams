-- =====================================================
-- Script de creación de Base de Datos PostgreSQL
-- Sistema de Emprendimiento
-- Generado: 2025-10-18.
-- Compatible con: PostgreSQL 12+
-- =====================================================

-- =====================================================
-- CREACIÓN DE BASE DE DATOS
-- =====================================================
-- Nota: Ejecutar con usuario con privilegios de creación de BD


-- Conectarse a la base de datos creada

-- =====================================================
-- CREACIÓN DE TABLAS
-- =====================================================

CREATE TABLE ADMINISTRADOR (
    id           SERIAL PRIMARY KEY,
    USUARIO_id   INTEGER NOT NULL
);
COMMENT ON TABLE ADMINISTRADOR IS 'Información específica de administradores';

CREATE TABLE ATRIBUTO (
    id                         SERIAL PRIMARY KEY,
    valorAtributo              VARCHAR(255),
    CATEGORIA_ATRIBUTO_id      INTEGER NOT NULL,
    EQUIPO_DESAFIO_id          INTEGER NOT NULL
);

CREATE TABLE CARRERA (
    id            SERIAL PRIMARY KEY,
    FACULTAD_id   INTEGER NOT NULL,
    nombre        VARCHAR(100) NOT NULL,
    estado        VARCHAR(20) DEFAULT 'ACTIVO'
);
ALTER TABLE CARRERA ADD CONSTRAINT carrera_estado_chk CHECK (estado IN ('ACTIVO', 'INACTIVO'));

CREATE TABLE CATEGORIA_ATRIBUTO (
    id                SERIAL PRIMARY KEY,
    nombreCategoria   VARCHAR(100) NOT NULL
);

CREATE TABLE CONFIGURACION (
    id         SERIAL PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    tipoDato   VARCHAR(50) NOT NULL
);

CREATE TABLE CONFIGURACION_VALOR (
    id                 SERIAL PRIMARY KEY,
    valor              VARCHAR(500) NOT NULL,
    CONFIGURACION_id   INTEGER NOT NULL,
    USUARIO_id         INTEGER NOT NULL
);

CREATE TABLE CURSO (
    id              SERIAL PRIMARY KEY,
    CARRERA_id      INTEGER NOT NULL,
    TIPO_CURSO_id   INTEGER NOT NULL,
    codigo          VARCHAR(20) NOT NULL,
    nombre          VARCHAR(150) NOT NULL,
    descripcion     TEXT
);

CREATE TABLE CURSO_ESTUDIANTE (
    id              SERIAL PRIMARY KEY,
    CURSO_id        INTEGER NOT NULL,
    ESTUDIANTE_id   INTEGER NOT NULL
);

CREATE TABLE DESAFIO (
    id                SERIAL NOT NULL,
    TEMA_DESAFIO_id   INTEGER NOT NULL,
    fechaCreacion     TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    titulo            VARCHAR(200) NOT NULL,
    descripcion       TEXT NOT NULL,
    nombrePersona     VARCHAR(100),
    edadPersona       SMALLINT,
    contexto          TEXT,
    estado            VARCHAR(20) DEFAULT 'ACTIVO',
    PERSONA_id        INTEGER NOT NULL,
    PRIMARY KEY (id, PERSONA_id)
);

CREATE TABLE EQUIPO (
    id             SERIAL PRIMARY KEY,
    nombreEquipo   VARCHAR(100) NOT NULL,
    tamanoEquipo   INTEGER
);
COMMENT ON TABLE EQUIPO IS 'Equipos de estudiantes por juego';

CREATE TABLE EQUIPO_DESAFIO (
    EQUIPO_id            INTEGER NOT NULL PRIMARY KEY,
    DESAFIO_id           INTEGER NOT NULL,
    DESAFIO_PERSONA_id   INTEGER NOT NULL
);

CREATE TABLE ESTUDIANTE (
    id                        SERIAL PRIMARY KEY,
    USUARIO_id                INTEGER NOT NULL,
    LISTA_PARTICIPANTE_id     INTEGER NOT NULL
);
COMMENT ON TABLE ESTUDIANTE IS 'Información específica de estudiantes';

CREATE TABLE ETAPA (
    id                SERIAL PRIMARY KEY,
    nombreEtapa       VARCHAR(50) NOT NULL,
    duracionMinutos   INTEGER NOT NULL,
    orden             INTEGER NOT NULL,
    descripcion       VARCHAR(500),
    estado            VARCHAR(20) DEFAULT 'ACTIVO',
    textoHabilidad    VARCHAR(500)
);

CREATE TABLE EVALUACION_AUTOENCUESTA (
    id                    SERIAL PRIMARY KEY,
    ESTUDIANTE_id         INTEGER NOT NULL,
    GANAS_EMPRENDER_id    INTEGER NOT NULL,
    evalSatisf            SMALLINT,
    comentarios           TEXT
);
COMMENT ON COLUMN EVALUACION_AUTOENCUESTA.evalSatisf IS 'Puntuacion de 1-5, que se mapea con : No, No mucho, Más o menos, Si, Si, mucho';
ALTER TABLE EVALUACION_AUTOENCUESTA ADD CONSTRAINT eval_satisf_chk CHECK (evalSatisf BETWEEN 1 AND 5);

CREATE TABLE EVALUACION_PITCH (
    id                    SERIAL PRIMARY KEY,
    EQUIPO_EVALUADOR_id   INTEGER NOT NULL,
    EQUIPO_EVALUADO_id    INTEGER NOT NULL,
    puntajeEquipo         SMALLINT,
    puntajeEmpatia        SMALLINT,
    puntajeCreatividad    SMALLINT,
    puntajeComunicacion   SMALLINT
);
ALTER TABLE EVALUACION_PITCH ADD CONSTRAINT evaluacion_equipo_chk CHECK (puntajeEquipo BETWEEN 1 AND 4);
ALTER TABLE EVALUACION_PITCH ADD CONSTRAINT evaluacion_empatia_chk CHECK (puntajeEmpatia BETWEEN 1 AND 4);
ALTER TABLE EVALUACION_PITCH ADD CONSTRAINT evaluacion_creatividad_chk CHECK (puntajeCreatividad BETWEEN 1 AND 4);
ALTER TABLE EVALUACION_PITCH ADD CONSTRAINT evaluacion_comunicacion_chk CHECK (puntajeComunicacion BETWEEN 1 AND 4);

CREATE TABLE FACULTAD (
    id       SERIAL PRIMARY KEY,
    nombre   VARCHAR(100) NOT NULL
);

CREATE TABLE GANAS_EMPRENDER (
    id            SERIAL PRIMARY KEY,
    descripcion   VARCHAR(500) NOT NULL
);

CREATE TABLE INSTRUCCION_ETAPA (
    id           SERIAL PRIMARY KEY,
    ETAPA_id     INTEGER NOT NULL,
    contenido    TEXT NOT NULL
);

CREATE TABLE LISTA_PARTICIPANTE (
    id                 SERIAL PRIMARY KEY,
    emailEstudiante    VARCHAR(100) NOT NULL,
    nombreEstudiante   VARCHAR(150) NOT NULL
);

CREATE TABLE PARTIDA (
    id                 SERIAL PRIMARY KEY,
    VIDEO_id           INTEGER NOT NULL,
    fechaCreacion      TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado             VARCHAR(20) DEFAULT 'CONFIGURACION' NOT NULL,
    codigoAcceso       VARCHAR(10),
    fechaInicio        TIMESTAMP,
    fechaFin           TIMESTAMP,
    maxEquipos         INTEGER DEFAULT 4,
    maxParticipantes   INTEGER
);
ALTER TABLE PARTIDA ADD CONSTRAINT juego_estado_chk CHECK (estado IN ('CONFIGURACION', 'EN_CURSO', 'FINALIZADO'));
COMMENT ON TABLE PARTIDA IS 'Sesiones de juego del sistema de emprendimiento';

CREATE TABLE PARTIDA_USUARIO (
    id           SERIAL PRIMARY KEY,
    USUARIO_id   INTEGER NOT NULL,
    PARTIDA_id   INTEGER NOT NULL,
    EQUIPO_id    INTEGER NOT NULL
);

CREATE TABLE PERSONA (
    id                SERIAL PRIMARY KEY,
    nombrePersona     VARCHAR(150) NOT NULL,
    imagenUrl         VARCHAR(500) NOT NULL,
    contextoPersona   TEXT NOT NULL,
    edad              SMALLINT
);

CREATE TABLE PROFESOR (
    id           SERIAL PRIMARY KEY,
    USUARIO_id   INTEGER NOT NULL
);
COMMENT ON TABLE PROFESOR IS 'Información específica de profesores';

CREATE TABLE RANKING (
    id              SERIAL PRIMARY KEY,
    EQUIPO_id       INTEGER NOT NULL,
    totalTokens     INTEGER DEFAULT 0 NOT NULL,
    posicionFinal   INTEGER NOT NULL
);

CREATE TABLE SOLUCION_LEGO (
    id                SERIAL PRIMARY KEY,
    EQUIPO_id         INTEGER NOT NULL,
    fechaCreacion     TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    descripSoluc      TEXT,
    fotoPrototipUrl   VARCHAR(500)
);

CREATE TABLE TEMA_DESAFIO (
    id            SERIAL PRIMARY KEY,
    nombreTema    VARCHAR(100) NOT NULL,
    descripcion   VARCHAR(500) NOT NULL,
    estado        VARCHAR(20) DEFAULT 'ACTIVO'
);

CREATE TABLE TIPO_CURSO (
    id       SERIAL PRIMARY KEY,
    nombre   VARCHAR(100) NOT NULL
);

CREATE TABLE TOKEN (
    id              SERIAL PRIMARY KEY,
    EQUIPO_id       INTEGER NOT NULL,
    tipoToken       VARCHAR(30) NOT NULL,
    cantidad        INTEGER NOT NULL,
    ETAPA_id        INTEGER,
    fechaOtorgada   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
ALTER TABLE TOKEN ADD CONSTRAINT token_tipo_chk CHECK (tipoToken IN ('BONIFICACION', 'EVALUACION', 'RECOMPENSA_ETAPA'));
COMMENT ON TABLE TOKEN IS 'Sistema de tokens y recompensas';
COMMENT ON COLUMN TOKEN.id IS 'Esta entidad permite trazabilidad de los tokens ganados por etapas';

CREATE TABLE USUARIO (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(100) NOT NULL,
    nombre          VARCHAR(50) NOT NULL,
    apellido        VARCHAR(50) NOT NULL,
    tipoUsuario     VARCHAR(20) NOT NULL,
    fechaCreacion   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ultimoLogin     TIMESTAMP,
    estado          VARCHAR(20) DEFAULT 'ACTIVO',
    contrasena      VARCHAR(255)
);
ALTER TABLE USUARIO ADD CONSTRAINT usuario_tipo_chk CHECK (tipoUsuario IN ('ADMINISTRADOR', 'ESTUDIANTE', 'PROFESOR'));
ALTER TABLE USUARIO ADD CONSTRAINT usuario_estado_chk CHECK (estado IN ('ACTIVO', 'INACTIVO'));
COMMENT ON TABLE USUARIO IS 'Tabla base de usuarios del sistema';

CREATE TABLE VIDEO (
    id            SERIAL PRIMARY KEY,
    nombreVideo   VARCHAR(150) NOT NULL,
    url           VARCHAR(500) NOT NULL
);

-- =====================================================
-- CONSTRAINTS ÚNICOS
-- =====================================================
ALTER TABLE ADMINISTRADOR ADD CONSTRAINT ADMINISTRADOR_idUsuario_UN UNIQUE (USUARIO_id);
ALTER TABLE ESTUDIANTE ADD CONSTRAINT ESTUDIANTE_idUsuario_UN UNIQUE (USUARIO_id);
ALTER TABLE EVALUACION_PITCH ADD CONSTRAINT EVALUACION_PITCH_idEquipEval_UN UNIQUE (EQUIPO_EVALUADOR_id, EQUIPO_EVALUADO_id);
ALTER TABLE PARTIDA ADD CONSTRAINT PARTIDA_codigoAcceso_UN UNIQUE (codigoAcceso);
ALTER TABLE PROFESOR ADD CONSTRAINT PROFESOR_idUsuario_UN UNIQUE (USUARIO_id);
ALTER TABLE RANKING ADD CONSTRAINT RANKING_idEquipo_UN UNIQUE (EQUIPO_id);
ALTER TABLE USUARIO ADD CONSTRAINT USUARIO_email_UN UNIQUE (email);

-- =====================================================
-- FOREIGN KEYS
-- =====================================================
ALTER TABLE ADMINISTRADOR ADD CONSTRAINT ADMINISTRADOR_USUARIO_FK 
    FOREIGN KEY (USUARIO_id) REFERENCES USUARIO (id);

ALTER TABLE ATRIBUTO ADD CONSTRAINT ATRIBUTO_CATEGORIA_ATRIBUTO_FK 
    FOREIGN KEY (CATEGORIA_ATRIBUTO_id) REFERENCES CATEGORIA_ATRIBUTO (id);

ALTER TABLE ATRIBUTO ADD CONSTRAINT ATRIBUTO_EQUIPO_DESAFIO_FK 
    FOREIGN KEY (EQUIPO_DESAFIO_id) REFERENCES EQUIPO_DESAFIO (EQUIPO_id);

ALTER TABLE CARRERA ADD CONSTRAINT CARRERA_FACULTAD_FK 
    FOREIGN KEY (FACULTAD_id) REFERENCES FACULTAD (id);

ALTER TABLE CONFIGURACION_VALOR ADD CONSTRAINT FK_CONFVALOR_CONFIGURACION 
    FOREIGN KEY (CONFIGURACION_id) REFERENCES CONFIGURACION (id);

ALTER TABLE CONFIGURACION_VALOR ADD CONSTRAINT FK_CONFVALOR_USUARIO 
    FOREIGN KEY (USUARIO_id) REFERENCES USUARIO (id);

ALTER TABLE CURSO ADD CONSTRAINT CURSO_CARRERA_FK 
    FOREIGN KEY (CARRERA_id) REFERENCES CARRERA (id);

ALTER TABLE CURSO_ESTUDIANTE ADD CONSTRAINT FK_CURSOEST_CURSO 
    FOREIGN KEY (CURSO_id) REFERENCES CURSO (id);

ALTER TABLE CURSO_ESTUDIANTE ADD CONSTRAINT FK_CURSOEST_ESTUDIANTE 
    FOREIGN KEY (ESTUDIANTE_id) REFERENCES ESTUDIANTE (id);

ALTER TABLE CURSO ADD CONSTRAINT CURSO_TIPO_CURSO_FK 
    FOREIGN KEY (TIPO_CURSO_id) REFERENCES TIPO_CURSO (id);

ALTER TABLE DESAFIO ADD CONSTRAINT DESAFIO_PERSONA_FK 
    FOREIGN KEY (PERSONA_id) REFERENCES PERSONA (id);

ALTER TABLE DESAFIO ADD CONSTRAINT DESAFIO_TEMA_DESAFIO_FK 
    FOREIGN KEY (TEMA_DESAFIO_id) REFERENCES TEMA_DESAFIO (id);

ALTER TABLE EQUIPO_DESAFIO ADD CONSTRAINT FK_EQUIPODESAFIO_DESAFIO 
    FOREIGN KEY (DESAFIO_id, DESAFIO_PERSONA_id) REFERENCES DESAFIO (id, PERSONA_id);

ALTER TABLE EQUIPO_DESAFIO ADD CONSTRAINT FK_EQUIPODESAFIO_EQUIPO 
    FOREIGN KEY (EQUIPO_id) REFERENCES EQUIPO (id);

ALTER TABLE ESTUDIANTE ADD CONSTRAINT ESTUDIANTE_LISTA_PARTICIPANTE_FK 
    FOREIGN KEY (LISTA_PARTICIPANTE_id) REFERENCES LISTA_PARTICIPANTE (id);

ALTER TABLE ESTUDIANTE ADD CONSTRAINT ESTUDIANTE_USUARIO_FK 
    FOREIGN KEY (USUARIO_id) REFERENCES USUARIO (id);

ALTER TABLE EVALUACION_AUTOENCUESTA ADD CONSTRAINT FK_EVALAUTO_ESTUDIANTE 
    FOREIGN KEY (ESTUDIANTE_id) REFERENCES ESTUDIANTE (id);

ALTER TABLE EVALUACION_AUTOENCUESTA ADD CONSTRAINT FK_EVALAUTO_GANAS 
    FOREIGN KEY (GANAS_EMPRENDER_id) REFERENCES GANAS_EMPRENDER (id);

ALTER TABLE EVALUACION_PITCH ADD CONSTRAINT FK_EVALPITCH_EQUIPO_EVALUADOR 
    FOREIGN KEY (EQUIPO_EVALUADOR_id) REFERENCES EQUIPO (id);

ALTER TABLE EVALUACION_PITCH ADD CONSTRAINT FK_EVALPITCH_EQUIPO_EVALUADO 
    FOREIGN KEY (EQUIPO_EVALUADO_id) REFERENCES EQUIPO (id);

ALTER TABLE INSTRUCCION_ETAPA ADD CONSTRAINT INSTRUCCION_ETAPA_ETAPA_FK 
    FOREIGN KEY (ETAPA_id) REFERENCES ETAPA (id);

ALTER TABLE PARTIDA_USUARIO ADD CONSTRAINT PARTIDA_USUARIO_EQUIPO_FK 
    FOREIGN KEY (EQUIPO_id) REFERENCES EQUIPO (id);

ALTER TABLE PARTIDA_USUARIO ADD CONSTRAINT PARTIDA_USUARIO_PARTIDA_FK 
    FOREIGN KEY (PARTIDA_id) REFERENCES PARTIDA (id);

ALTER TABLE PARTIDA_USUARIO ADD CONSTRAINT PARTIDA_USUARIO_USUARIO_FK 
    FOREIGN KEY (USUARIO_id) REFERENCES USUARIO (id);

ALTER TABLE PARTIDA ADD CONSTRAINT PARTIDA_VIDEO_FK 
    FOREIGN KEY (VIDEO_id) REFERENCES VIDEO (id);

ALTER TABLE PROFESOR ADD CONSTRAINT PROFESOR_USUARIO_FK 
    FOREIGN KEY (USUARIO_id) REFERENCES USUARIO (id);

ALTER TABLE RANKING ADD CONSTRAINT RANKING_EQUIPO_FK 
    FOREIGN KEY (EQUIPO_id) REFERENCES EQUIPO (id);

ALTER TABLE SOLUCION_LEGO ADD CONSTRAINT SOLUCION_LEGO_EQUIPO_FK 
    FOREIGN KEY (EQUIPO_id) REFERENCES EQUIPO (id);

ALTER TABLE TOKEN ADD CONSTRAINT TOKEN_EQUIPO_FK 
    FOREIGN KEY (EQUIPO_id) REFERENCES EQUIPO (id);

ALTER TABLE TOKEN ADD CONSTRAINT TOKEN_ETAPA_FK 
    FOREIGN KEY (ETAPA_id) REFERENCES ETAPA (id);

-- =====================================================
-- INFORMACIÓN DEL SISTEMA
-- =====================================================
COMMENT ON DATABASE InnovatingTeamsv5 IS 'Base de datos para el Sistema de Emprendimiento con gamificación';

-- Otorgar permisos básicos (ajustar según necesidades)
-- GRANT CONNECT ON DATABASE InnovatingTeamsV5 TO nombre_usuario;
-- GRANT USAGE ON SCHEMA public TO nombre_usuario;
-- GRANT CREATE ON SCHEMA public TO nombre_usuario;

-- =====================================================
-- FIN DEL SCRIPT - comeinzo escript poblacion
-- =====================================================
-- =================================================================
-- SCRIPT DE POBLACIÓN CON FUNCIONES PL/pgSQL
-- Sistema de Emprendimiento - InnovatingTeamsv5
-- Compatible con: PostgreSQL 12+
-- =================================================================

-- Eliminamos funciones si ya existen para poder recrearlas
DROP FUNCTION IF EXISTS poblar_facultad();
DROP FUNCTION IF EXISTS poblar_tipo_curso();
DROP FUNCTION IF EXISTS poblar_usuario(integer);
DROP FUNCTION IF EXISTS poblar_categoria_atributo();
DROP FUNCTION IF EXISTS poblar_configuracion();
DROP FUNCTION IF EXISTS poblar_equipo(integer);
DROP FUNCTION IF EXISTS poblar_etapa();
DROP FUNCTION IF EXISTS poblar_ganas_emprender();
DROP FUNCTION IF EXISTS poblar_lista_participante(integer);
DROP FUNCTION IF EXISTS poblar_persona(integer);
DROP FUNCTION IF EXISTS poblar_tema_desafio();
DROP FUNCTION IF EXISTS poblar_video(integer);
DROP PROCEDURE IF EXISTS poblar_tablas_base();


-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: FACULTAD
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_facultad()
RETURNS void AS $$
BEGIN
    INSERT INTO FACULTAD (nombre) VALUES
    ('Facultad de Ingeniería y Ciencias'),
    ('Facultad de Economía y Negocios'),
    ('Facultad de Diseño y Comunicación'),
    ('Facultad de Ciencias Sociales'),
    ('Facultad de Artes Liberales');
    RAISE NOTICE '-> Tabla FACULTAD poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: TIPO_CURSO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_tipo_curso()
RETURNS void AS $$
BEGIN
    INSERT INTO TIPO_CURSO (nombre) VALUES
    ('Obligatorio'),
    ('Electivo'),
    ('Taller'),
    ('Práctica Profesional');
    RAISE NOTICE '-> Tabla TIPO_CURSO poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: USUARIO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_usuario(cantidad integer)
RETURNS void AS $$
DECLARE
    tipos_usuario text[] := ARRAY['ADMINISTRADOR', 'ESTUDIANTE', 'PROFESOR'];
    estados text[] := ARRAY['ACTIVO', 'INACTIVO'];
BEGIN
    FOR i IN 1..cantidad LOOP
        INSERT INTO USUARIO (email, nombre, apellido, tipoUsuario, contrasena, estado)
        VALUES (
            'usuario' || i || '@innovate.com',
            'Nombre' || i,
            'Apellido' || i,
            tipos_usuario[1 + floor(random() * 3)],
            md5(random()::text), -- Contraseña encriptada simple
            estados[1 + floor(random() * 2)]
        );
    END LOOP;
    RAISE NOTICE '-> Tabla USUARIO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: CATEGORIA_ATRIBUTO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_categoria_atributo()
RETURNS void AS $$
BEGIN
    INSERT INTO CATEGORIA_ATRIBUTO (nombreCategoria) VALUES
    ('Creatividad'),
    ('Comunicación Efectiva'),
    ('Liderazgo'),
    ('Resolución de Problemas'),
    ('Trabajo en Equipo');
    RAISE NOTICE '-> Tabla CATEGORIA_ATRIBUTO poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: CONFIGURACION
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_configuracion()
RETURNS void AS $$
BEGIN
    INSERT INTO CONFIGURACION (nombre, tipoDato) VALUES
    ('Tiempo máximo por etapa', 'INTEGER'),
    ('Permitir registro de nuevos usuarios', 'BOOLEAN'),
    ('Mensaje de bienvenida del sistema', 'TEXT'),
    ('Versión del sistema', 'VARCHAR');
    RAISE NOTICE '-> Tabla CONFIGURACION poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: EQUIPO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_equipo(cantidad integer)
RETURNS void AS $$
DECLARE
    nombres text[] := ARRAY['Creativos', 'Innovadores', 'Titanes', 'Pioneros', 'Visionarios', 'Exploradores'];
BEGIN
    FOR i IN 1..cantidad LOOP
        INSERT INTO EQUIPO (nombreEquipo, tamanoEquipo)
        VALUES (
            'Los ' || nombres[1 + floor(random() * array_length(nombres, 1))] || ' ' || i,
            floor(random() * 3 + 3)::integer -- Equipos de 3 a 5 miembros
        );
    END LOOP;
    RAISE NOTICE '-> Tabla EQUIPO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: ETAPA
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_etapa()
RETURNS void AS $$
BEGIN
    INSERT INTO ETAPA (nombreEtapa, duracionMinutos, orden, descripcion, textoHabilidad) VALUES
    ('Ideación', 30, 1, 'Generar ideas innovadoras para resolver el desafío.', 'Fomenta la creatividad y el pensamiento lateral.'),
    ('Prototipado', 45, 2, 'Construir un prototipo de baja fidelidad de la solución.', 'Desarrolla habilidades de construcción y diseño rápido.'),
    ('Validación', 20, 3, 'Obtener retroalimentación sobre el prototipo.', 'Practica la escucha activa y la empatía.'),
    ('Pitch Final', 15, 4, 'Presentar la solución final de forma convincente.', 'Mejora la comunicación y la persuasión.');
    RAISE NOTICE '-> Tabla ETAPA poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: GANAS_EMPRENDER
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_ganas_emprender()
RETURNS void AS $$
BEGIN
    INSERT INTO GANAS_EMPRENDER (descripcion) VALUES
    ('¿Sientes que tienes una idea innovadora que podría convertirse en un negocio?'),
    ('¿Disfrutas de los desafíos y de resolver problemas complejos?'),
    ('¿Te sientes cómodo tomando riesgos calculados?'),
    ('¿Te motiva la idea de crear tu propio camino profesional?');
    RAISE NOTICE '-> Tabla GANAS_EMPRENDER poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================

-- FUNCIÓN PARA POBLAR LA TABLA: LISTA_PARTICIPANTE
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_lista_participante(cantidad integer)
RETURNS void AS $$
BEGIN
    FOR i IN 1..cantidad LOOP
        INSERT INTO LISTA_PARTICIPANTE (emailEstudiante, nombreEstudiante)
        VALUES (
            'estudiante' || i || '@pre-registro.com',
            'Participante ' || i
        );
    END LOOP;
    RAISE NOTICE '-> Tabla LISTA_PARTICIPANTE poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: PERSONA
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_persona(cantidad integer)
RETURNS void AS $$
BEGIN
    FOR i IN 1..cantidad LOOP
        INSERT INTO PERSONA (nombrePersona, imagenUrl, contextoPersona, edad)
        VALUES (
            'Arquetipo ' || i,
            'https://example.com/imagen' || i || '.jpg',
            'Este es el contexto de la persona ' || i || ', describe sus necesidades y problemas.',
            floor(random() * 50 + 18)::integer -- Edad entre 18 y 68
        );
    END LOOP;
    RAISE NOTICE '-> Tabla PERSONA poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: TEMA_DESAFIO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_tema_desafio()
RETURNS void AS $$
BEGIN
    INSERT INTO TEMA_DESAFIO (nombreTema, descripcion) VALUES
    ('Sostenibilidad Ambiental', 'Crear soluciones para reducir el impacto ecológico en la ciudad.'),
    ('Salud y Bienestar', 'Desarrollar ideas para mejorar la calidad de vida y la salud de las personas.'),
    ('Educación Digital', 'Innovar en herramientas educativas para el aprendizaje en línea.'),
    ('Inclusión Financiera', 'Crear servicios financieros accesibles para todos.');
    RAISE NOTICE '-> Tabla TEMA_DESAFIO poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN PARA POBLAR LA TABLA: VIDEO
-- =====================================================
CREATE OR REPLACE FUNCTION poblar_video(cantidad integer)
RETURNS void AS $$
BEGIN
    FOR i IN 1..cantidad LOOP
        INSERT INTO VIDEO (nombreVideo, url)
        VALUES (
            'Video introductorio ' || i,
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ' -- URL de ejemplo
        );
    END LOOP;
    RAISE NOTICE '-> Tabla VIDEO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PROCEDIMIENTO PRINCIPAL PARA EJECUTAR TODO
-- =====================================================
CREATE OR REPLACE PROCEDURE poblar_tablas_base()
AS $$
BEGIN
    -- Llamamos a cada función de población en el orden correcto
    PERFORM poblar_facultad();
    PERFORM poblar_tipo_curso();
    PERFORM poblar_usuario(50); -- Poblar con 50 usuarios
    PERFORM poblar_categoria_atributo();
    PERFORM poblar_configuracion();
    PERFORM poblar_equipo(15); -- Poblar con 15 equipos
    PERFORM poblar_etapa();
    PERFORM poblar_ganas_emprender();
    PERFORM poblar_lista_participante(100); -- Poblar con 100 participantes
    PERFORM poblar_persona(10); -- Poblar con 10 arquetipos de persona
    PERFORM poblar_tema_desafio();
    PERFORM poblar_video(3); -- Poblar con 3 videos

    RAISE NOTICE '---';
    RAISE NOTICE '✅ Proceso de población de tablas base completado.';
    RAISE NOTICE '---';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- EJECUCIÓN 
-- =====================================================
-- =================================================================
-- SCRIPT DE POBLACIÓN (TABLAS CON CLAVES FORÁNEAS)
-- Sistema de Emprendimiento - InnovatingTeamsv5
-- Compatible con: PostgreSQL 12+
-- =================================================================

-- Eliminamos funciones y procedimientos si ya existen
DROP FUNCTION IF EXISTS poblar_administrador(integer);
DROP FUNCTION IF EXISTS poblar_profesor(integer);
DROP FUNCTION IF EXISTS poblar_carrera(integer);
DROP FUNCTION IF EXISTS poblar_estudiante(integer);
DROP FUNCTION IF EXISTS poblar_desafio(integer);
DROP FUNCTION IF EXISTS poblar_partida(integer);
DROP FUNCTION IF EXISTS poblar_curso(integer);
DROP FUNCTION IF EXISTS poblar_evaluacion_pitch(integer);
DROP FUNCTION IF EXISTS poblar_solucion_lego(integer);
DROP FUNCTION IF EXISTS poblar_token(integer);
DROP FUNCTION IF EXISTS poblar_curso_estudiante(integer);
DROP FUNCTION IF EXISTS poblar_partida_usuario(integer);
DROP FUNCTION IF EXISTS poblar_equipo_desafio();
DROP PROCEDURE IF EXISTS poblar_tablas_foraneas();

-- =====================================================
-- FUNCIÓN AUXILIAR: Generar fecha aleatoria desde 2024
-- =====================================================
CREATE OR REPLACE FUNCTION random_date_from_2024()
RETURNS timestamp AS $$
BEGIN
    RETURN '2024-01-01'::timestamp + (random() * (now() - '2024-01-01'::timestamp));
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- NIVEL 1 DE DEPENDENCIA
-- =====================================================

CREATE OR REPLACE FUNCTION poblar_administrador(cantidad integer)
RETURNS void AS $$
DECLARE
    -- Selecciona IDs de usuarios tipo 'ADMINISTRADOR' que aún no están en la tabla ADMINISTRADOR
    usuarios_disponibles integer[];
BEGIN
    SELECT array_agg(id) INTO usuarios_disponibles FROM USUARIO
    WHERE tipoUsuario = 'ADMINISTRADOR' AND id NOT IN (SELECT USUARIO_id FROM ADMINISTRADOR);

    IF array_length(usuarios_disponibles, 1) IS NULL THEN
        RAISE NOTICE 'No hay usuarios de tipo ADMINISTRADOR disponibles para asignar.';
        RETURN;
    END IF;

    FOR i IN 1..LEAST(cantidad, array_length(usuarios_disponibles, 1)) LOOP
        INSERT INTO ADMINISTRADOR (USUARIO_id) VALUES (usuarios_disponibles[i]);
    END LOOP;
    RAISE NOTICE '-> Tabla ADMINISTRADOR poblada.';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION poblar_profesor(cantidad integer)
RETURNS void AS $$
DECLARE
    usuarios_disponibles integer[];
BEGIN
    -- Selecciona IDs de usuarios tipo 'PROFESOR' que aún no están en la tabla PROFESOR
    SELECT array_agg(id) INTO usuarios_disponibles FROM USUARIO
    WHERE tipoUsuario = 'PROFESOR' AND id NOT IN (SELECT USUARIO_id FROM PROFESOR);

    IF array_length(usuarios_disponibles, 1) IS NULL THEN
        RAISE NOTICE 'No hay usuarios de tipo PROFESOR disponibles para asignar.';
        RETURN;
    END IF;

    FOR i IN 1..LEAST(cantidad, array_length(usuarios_disponibles, 1)) LOOP
        INSERT INTO PROFESOR (USUARIO_id) VALUES (usuarios_disponibles[i]);
    END LOOP;
    RAISE NOTICE '-> Tabla PROFESOR poblada.';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION poblar_carrera(cantidad integer)
RETURNS void AS $$
DECLARE
    facultad_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        -- Selecciona una facultad al azar
        SELECT id INTO facultad_id FROM FACULTAD ORDER BY random() LIMIT 1;

        INSERT INTO CARRERA (FACULTAD_id, nombre)
        VALUES (facultad_id, 'Carrera de ' || md5(random()::text)::char(10));
    END LOOP;
    RAISE NOTICE '-> Tabla CARRERA poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION poblar_estudiante(cantidad integer)
RETURNS void AS $$
DECLARE
    -- SE ELIMINARON LAS VARIABLES "usuario_id" Y "lista_id" QUE CAUSABAN AMBIGÜEDAD
    usuarios_disponibles integer[] := (SELECT array_agg(id) FROM USUARIO WHERE tipoUsuario = 'ESTUDIANTE' AND id NOT IN (SELECT USUARIO_id FROM ESTUDIANTE));
    listas_disponibles integer[] := (SELECT array_agg(id) FROM LISTA_PARTICIPANTE WHERE id NOT IN (SELECT LISTA_PARTICIPANTE_id FROM ESTUDIANTE));
BEGIN
    IF array_length(usuarios_disponibles, 1) IS NULL OR array_length(listas_disponibles, 1) IS NULL THEN
        RAISE NOTICE 'No hay suficientes usuarios o listas de participantes disponibles.';
        RETURN;
    END IF;
    
    FOR i IN 1..LEAST(cantidad, array_length(usuarios_disponibles, 1), array_length(listas_disponibles, 1)) LOOP
        INSERT INTO ESTUDIANTE (USUARIO_id, LISTA_PARTICIPANTE_id)
        VALUES (usuarios_disponibles[i], listas_disponibles[i]);
    END LOOP;
    RAISE NOTICE '-> Tabla ESTUDIANTE poblada.';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION poblar_desafio(cantidad integer)
RETURNS void AS $$
DECLARE
    tema_id integer;
    persona_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO tema_id FROM TEMA_DESAFIO ORDER BY random() LIMIT 1;
        SELECT id INTO persona_id FROM PERSONA ORDER BY random() LIMIT 1;
        
        INSERT INTO DESAFIO (TEMA_DESAFIO_id, PERSONA_id, titulo, descripcion, fechaCreacion)
        VALUES (
            tema_id,
            persona_id,
            'Desafío sobre ' || (SELECT nombreTema FROM TEMA_DESAFIO WHERE id = tema_id),
            'Descripción detallada del desafío número ' || i,
            random_date_from_2024()
        );
    END LOOP;
    RAISE NOTICE '-> Tabla DESAFIO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION poblar_partida(cantidad integer)
RETURNS void AS $$
DECLARE
    vid_id integer;
    estados text[] := ARRAY['CONFIGURACION', 'EN_CURSO', 'FINALIZADO'];
    fecha_inicio timestamp;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO vid_id FROM VIDEO ORDER BY random() LIMIT 1;
        fecha_inicio := random_date_from_2024();
        
        INSERT INTO PARTIDA (VIDEO_id, estado, codigoAcceso, fechaInicio, fechaFin)
        VALUES (
            vid_id,
            estados[1 + floor(random() * 3)],
            upper(substr(md5(random()::text), 1, 6)), -- Código de 6 caracteres
            fecha_inicio,
            fecha_inicio + (random() * interval '3 hours') -- Termina hasta 3 horas después
        );
    END LOOP;
    RAISE NOTICE '-> Tabla PARTIDA poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- NIVEL 2 DE DEPENDENCIA
-- =====================================================

CREATE OR REPLACE FUNCTION poblar_curso(cantidad integer)
RETURNS void AS $$
DECLARE
    carr_id integer;
    tipo_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO carr_id FROM CARRERA ORDER BY random() LIMIT 1;
        SELECT id INTO tipo_id FROM TIPO_CURSO ORDER BY random() LIMIT 1;

        INSERT INTO CURSO (CARRERA_id, TIPO_CURSO_id, codigo, nombre)
        VALUES (
            carr_id,
            tipo_id,
            'SIG' || (100 + floor(random() * 900))::text,
            'Curso de ' || md5(random()::text)::char(15)
        );
    END LOOP;
    RAISE NOTICE '-> Tabla CURSO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION poblar_evaluacion_pitch(cantidad integer)
RETURNS void AS $$
DECLARE
    evaluador_id integer;
    evaluado_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        -- Asegurarse de que un equipo no se evalúe a sí mismo
        SELECT id INTO evaluador_id FROM EQUIPO ORDER BY random() LIMIT 1;
        SELECT id INTO evaluado_id FROM EQUIPO WHERE id <> evaluador_id ORDER BY random() LIMIT 1;

        -- Evitar duplicados si la combinación ya existe
        IF evaluado_id IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM EVALUACION_PITCH WHERE EQUIPO_EVALUADOR_id = evaluador_id AND EQUIPO_EVALUADO_id = evaluado_id
        ) THEN
            INSERT INTO EVALUACION_PITCH (EQUIPO_EVALUADOR_id, EQUIPO_EVALUADO_id, puntajeEquipo, puntajeEmpatia, puntajeCreatividad, puntajeComunicacion)
            VALUES (
                evaluador_id,
                evaluado_id,
                floor(random() * 4 + 1)::smallint,
                floor(random() * 4 + 1)::smallint,
                floor(random() * 4 + 1)::smallint,
                floor(random() * 4 + 1)::smallint
            );
        END IF;
    END LOOP;
    RAISE NOTICE '-> Tabla EVALUACION_PITCH poblada.';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION poblar_solucion_lego(cantidad integer)
RETURNS void AS $$
DECLARE
    eq_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO eq_id FROM EQUIPO ORDER BY random() LIMIT 1;
        INSERT INTO SOLUCION_LEGO (EQUIPO_id, fechaCreacion, descripSoluc, fotoPrototipUrl)
        VALUES (
            eq_id,
            random_date_from_2024(),
            'Esta es la descripción de la solución LEGO para el equipo ' || eq_id,
            'http://example.com/foto' || i || '.jpg'
        );
    END LOOP;
    RAISE NOTICE '-> Tabla SOLUCION_LEGO poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION poblar_token(cantidad integer)
RETURNS void AS $$
DECLARE
    eq_id integer;
    et_id integer;
    tipos text[] := ARRAY['BONIFICACION', 'EVALUACION', 'RECOMPENSA_ETAPA'];
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO eq_id FROM EQUIPO ORDER BY random() LIMIT 1;
        SELECT id INTO et_id FROM ETAPA ORDER BY random() LIMIT 1;
        INSERT INTO TOKEN (EQUIPO_id, ETAPA_id, tipoToken, cantidad, fechaOtorgada)
        VALUES (
            eq_id,
            et_id,
            tipos[1 + floor(random() * 3)],
            floor(random() * 50 + 10)::integer,
            random_date_from_2024()
        );
    END LOOP;
    RAISE NOTICE '-> Tabla TOKEN poblada con % registros.', cantidad;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- NIVEL 3 DE DEPENDENCIA
-- =====================================================

CREATE OR REPLACE FUNCTION poblar_curso_estudiante(cantidad integer)
RETURNS void AS $$
DECLARE
    cur_id integer;
    est_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO cur_id FROM CURSO ORDER BY random() LIMIT 1;
        SELECT id INTO est_id FROM ESTUDIANTE ORDER BY random() LIMIT 1;

        -- Evitar duplicados
        IF NOT EXISTS (SELECT 1 FROM CURSO_ESTUDIANTE WHERE CURSO_id = cur_id AND ESTUDIANTE_id = est_id) THEN
            INSERT INTO CURSO_ESTUDIANTE (CURSO_id, ESTUDIANTE_id) VALUES (cur_id, est_id);
        END IF;
    END LOOP;
    RAISE NOTICE '-> Tabla CURSO_ESTUDIANTE poblada.';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION poblar_partida_usuario(cantidad integer)
RETURNS void AS $$
DECLARE
    usr_id integer;
    par_id integer;
    eq_id integer;
BEGIN
    FOR i IN 1..cantidad LOOP
        SELECT id INTO usr_id FROM USUARIO WHERE tipoUsuario = 'ESTUDIANTE' ORDER BY random() LIMIT 1;
        SELECT id INTO par_id FROM PARTIDA ORDER BY random() LIMIT 1;
        SELECT id INTO eq_id FROM EQUIPO ORDER BY random() LIMIT 1;

        -- Evitar duplicados
        IF NOT EXISTS (SELECT 1 FROM PARTIDA_USUARIO WHERE USUARIO_id = usr_id AND PARTIDA_id = par_id) THEN
            INSERT INTO PARTIDA_USUARIO (USUARIO_id, PARTIDA_id, EQUIPO_id) VALUES (usr_id, par_id, eq_id);
        END IF;
    END LOOP;
    RAISE NOTICE '-> Tabla PARTIDA_USUARIO poblada.';
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION poblar_equipo_desafio()
RETURNS void AS $$
DECLARE
    eq_id integer;
    des_id integer;
    des_per_id integer;
    rec record;
BEGIN
    -- Asigna un desafío a cada equipo existente
    FOR rec IN SELECT id FROM EQUIPO LOOP
        eq_id := rec.id;
        
        -- Selecciona un desafío al azar
        SELECT id, PERSONA_id INTO des_id, des_per_id FROM DESAFIO ORDER BY random() LIMIT 1;

        -- Evitar duplicados
        IF NOT EXISTS (SELECT 1 FROM EQUIPO_DESAFIO WHERE EQUIPO_id = eq_id) THEN
            INSERT INTO EQUIPO_DESAFIO (EQUIPO_id, DESAFIO_id, DESAFIO_PERSONA_id)
            VALUES (eq_id, des_id, des_per_id);
        END IF;
    END LOOP;
    RAISE NOTICE '-> Tabla EQUIPO_DESAFIO poblada.';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PROCEDIMIENTO PRINCIPAL PARA EJECUTAR TODO
-- =====================================================
CREATE OR REPLACE PROCEDURE poblar_tablas_foraneas()
AS $$
BEGIN
    RAISE NOTICE '--- INICIANDO POBLACIÓN DE TABLAS FORÁNEAS ---';

    -- Nivel 1
    PERFORM poblar_administrador(5);
    PERFORM poblar_profesor(10);
    PERFORM poblar_carrera(10);
    PERFORM poblar_estudiante(30);
    PERFORM poblar_desafio(20);
    PERFORM poblar_partida(15);
    
    -- Nivel 2
    PERFORM poblar_curso(25);
    PERFORM poblar_evaluacion_pitch(50);
    PERFORM poblar_solucion_lego(40);
    PERFORM poblar_token(100);
    
    -- Nivel 3
    PERFORM poblar_curso_estudiante(80);
    PERFORM poblar_partida_usuario(60);
    PERFORM poblar_equipo_desafio(); -- Asigna un desafío a cada equipo

    RAISE NOTICE '---';
    RAISE NOTICE '✅ Proceso de población de tablas foráneas completado.';
    RAISE NOTICE '---';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- EJECUCIÓN DEL PROCEDIMIENTO PRINCIPAL
-- =====================================================
-- PRIMERO LLAMAMOS A LAS TABLAS BASE (USUARIO, FACULTAD, ETC)
CALL poblar_tablas_base();

-- LUEGO LLAMAMOS A LAS TABLAS QUE DEPENDEN DE ELLAS
CALL poblar_tablas_foraneas();




-- =====================================================
-- Comprobación con Querys 
-- =====================================================


CREATE OR REPLACE VIEW VISTA_DETALLE_EQUIPO AS
SELECT 
    e.id AS equipo_id,
    e.nombreEquipo,
    -- Datos del Profesor (asumiendo un profesor crea la partida)
    prof.id AS profesor_id,
    prof_usuario.nombre AS nombre_profesor,
    prof_usuario.apellido AS apellido_profesor,
    prof_usuario.email AS email_profesor,
    
    -- Datos del Estudiante
    est.id AS estudiante_id,
    est_usuario.nombre AS nombre_estudiante,
    est_usuario.apellido AS apellido_estudiante,
    est_usuario.email AS email_estudiante,
    
    -- Datos Académicos
    c.nombre AS nombre_carrera,
    f.nombre AS nombre_facultad,
    
    -- Datos de la Partida
    p.id as partida_id,
    p.codigoAcceso
FROM 
    EQUIPO e
-- Unir equipo con los usuarios que participan en una partida
LEFT JOIN PARTIDA_USUARIO pu ON e.id = pu.EQUIPO_id
-- Unir con la tabla de usuarios para obtener datos del estudiante
LEFT JOIN USUARIO est_usuario ON pu.USUARIO_id = est_usuario.id AND est_usuario.tipoUsuario = 'ESTUDIANTE'
-- Unir con la tabla estudiante para obtener más detalles si es necesario
LEFT JOIN ESTUDIANTE est ON est_usuario.id = est.USUARIO_id
-- Unir con la partida para encontrar al profesor
LEFT JOIN PARTIDA p ON pu.PARTIDA_id = p.id
-- Asumiendo que el "creador" de la partida es el profesor. Una forma de vincularlo.
-- NOTA: El modelo no une directamente un profesor a una partida. Haremos una suposición lógica.
-- Vamos a suponer que el primer usuario de tipo 'PROFESOR' en la BD está a cargo. (Esto es una simplificación)
-- Para una relación real, la tabla PARTIDA necesitaría un campo PROFESOR_id.
CROSS JOIN (
    SELECT u.id, u.nombre, u.apellido, u.email 
    FROM PROFESOR pr 
    JOIN USUARIO u ON pr.USUARIO_id = u.id 
    LIMIT 1
) AS prof_usuario
LEFT JOIN PROFESOR prof ON prof.USUARIO_id = prof_usuario.id

-- Unir con datos académicos del estudiante
LEFT JOIN CURSO_ESTUDIANTE ce ON est.id = ce.ESTUDIANTE_id
LEFT JOIN CURSO cur ON ce.CURSO_id = cur.id
LEFT JOIN CARRERA c ON cur.CARRERA_id = c.id
LEFT JOIN FACULTAD f ON c.FACULTAD_id = f.id
WHERE 
    est_usuario.id IS NOT NULL
ORDER BY
    e.nombreEquipo, est_usuario.apellido;


SELECT 
    nombreEquipo,
    nombre_profesor,
    email_profesor,
    nombre_estudiante,
    apellido_estudiante,
    email_estudiante,
    nombre_carrera
FROM 
    VISTA_DETALLE_EQUIPO
WHERE 
    equipo_id = 5;